from flask import Flask, request, jsonify, send_file
import requests
import threading
import uuid
import os
from flask_cors import CORS
import subprocess
import numpy as np


app = Flask(__name__)
CORS(app)
jobs = {}
PDB_DIR = "pdb_files"
RR_DIR = "rr_files"
BLAST_DB = "swissprot"  # Path to your local BLAST DB
DIST_MODEL_FILE = "elu_resnet_2d_distances.h5"
ANGLE_MODEL_FILE = "resnet_1d_angles.h5"

os.makedirs(PDB_DIR, exist_ok=True)
#
def run_psiblast(fasta_file, db_path, output_pssm):
    subprocess.run([
        "psiblast",
        "-query", fasta_file,
        "-db", db_path,
        "-num_iterations", "3",
        "-out_ascii_pssm", output_pssm,
        "-out", "blast_output.txt"
    ], check=True)

def load_pssm(pssm_file):
    pssm_data = []
    with open(pssm_file, "r") as f:
        start_reading = False
        for line in f:
            if not start_reading:
                if line.strip().startswith("1"):
                    start_reading = True
                else:
                    continue
            tokens = line.strip().split()
            if len(tokens) < 22:
                break
            values = list(map(int, tokens[2:22]))
            pssm_data.append(values)
    return np.array(pssm_data, dtype=np.float32)

def predict_structure(pssm_matrix):
    pssm_input = np.expand_dims(pssm_matrix, axis=0)  # (1, L, 20)
    angle_model = load_model(ANGLE_MODEL_FILE)
    dist_model = load_model(DIST_MODEL_FILE)
    angles = angle_model.predict(pssm_input)[0]
    distances = dist_model.predict(pssm_input)[0]
    return distances, angles

def save_rr_file(distance_matrix, output_file, threshold=8.0):
    L = distance_matrix.shape[0]
    with open(output_file, "w") as f:
        for i in range(L):
            for j in range(i + 6, L):
                dist = distance_matrix[i][j]
                if dist < threshold:
                    f.write(f"{i+1} {j+1} 0 {dist:.2f}\n")
       
# ----------- JOB PROCESSING --------------

def process_job_3d(job_id, sequence):
    jobs[job_id]['status'] = 'Processing'

    try:
        fasta_file = f"{job_id}.fasta"
        with open(fasta_file, "w") as f:
            f.write(f">sequence\n{sequence.strip()}")

        pssm_file = f"{job_id}.pssm"
        run_psiblast(fasta_file, BLAST_DB, pssm_file)

        pssm_matrix = load_pssm(pssm_file)
        dist_matrix, _ = predict_structure(pssm_matrix)

        rr_file_path = os.path.join(RR_DIR, f"{job_id}.rr")
        save_rr_file(dist_matrix, rr_file_path)

        jobs[job_id]['status'] = 'Completed'
        jobs[job_id]['rr_path'] = rr_file_path
    except Exception as e:
        jobs[job_id]['status'] = 'Failed'
        jobs[job_id]['error'] = str(e)

@app.route("/submit_job", methods=["POST"])
def submit_job():
    sequence = request.json.get("sequence", "").strip()
    if not sequence:
        return jsonify({"error": "Missing sequence"}), 400

    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "Queued"}
    threading.Thread(target=process_job_3d, args=(job_id, sequence)).start()
    return jsonify({"job_id": job_id})

def sequence_to_pdb_lines(sequence, model_output, chain_id="A"):
    
    backbone_atoms = ["N", "CA", "C", "O"]

    pdb_lines = []
    serial_num = 1  

    
    aa_3letter = {
        'A': 'ALA', 'R': 'ARG', 'N': 'ASN', 'D': 'ASP', 'C': 'CYS',
        'Q': 'GLN', 'E': 'GLU', 'G': 'GLY', 'H': 'HIS', 'I': 'ILE',
        'L': 'LEU', 'K': 'LYS', 'M': 'MET', 'F': 'PHE', 'P': 'PRO',
        'S': 'SER', 'T': 'THR', 'W': 'TRP', 'Y': 'TYR', 'V': 'VAL'
    }

    def format_pdb_atom_line(
        serial_num, atom_name, res_name, chain_id, res_num,
        x, y, z, occupancy=1.00, b_factor=0.00, element=None
    ):
        element = element if element else atom_name.strip()[0]
        return (
            f"ATOM  "
            f"{serial_num:5d} "
            f"{atom_name:<4}"
            f"{res_name:>3} "
            f"{chain_id}"
            f"{res_num:4d}    "
            f"{x:8.3f}"
            f"{y:8.3f}"
            f"{z:8.3f}"
            f"{occupancy:6.2f}"
            f"{b_factor:6.2f}          "
            f"{element:>2}"
        )

    expected_atoms = len(sequence) * len(backbone_atoms)
    if len(model_output) != expected_atoms:
        raise ValueError(f"Model output length {len(model_output)} does not match expected atoms {expected_atoms}.")

    for res_index, aa in enumerate(sequence):
        res_num = res_index + 1
        res_name = aa_3letter.get(aa.upper(), "UNK")
        # For each atom in the residue
        for atom_index, atom_name in enumerate(backbone_atoms):
            coord_index = res_index * len(backbone_atoms) + atom_index
            x, y, z, occ, bfac = model_output[coord_index]
            line = format_pdb_atom_line(serial_num, atom_name, res_name, chain_id, res_num, x, y, z, occ, bfac)
            pdb_lines.append(line)
            serial_num += 1

    return pdb_lines

#
def process_job(job_id, sequence):
    jobs[job_id]['status'] = 'Processing'

    try:
        response = requests.post(
            "https://api.esmatlas.com/foldSequence/v1/pdb/",
            data=sequence,
            headers={"Content-Type": "text/plain"}
        )
        response.raise_for_status()

        pdb_content = response.text
        pdb_path = os.path.join(PDB_DIR, f"{job_id}.pdb")
        # with open(pdb_path, 'w') as f:
        #     f.write(pdb_content)
        # Filter and write only ATOM lines
        with open(pdb_path, 'w') as f:
            atom_section_started = False
            for line in pdb_content.splitlines():
                if line.startswith("ATOM"):
                    atom_section_started = True
                if atom_section_started:
                    f.write(line + "\n")


        jobs[job_id]['status'] = 'Completed'
        jobs[job_id]['path'] = pdb_path
    except Exception as e:
        jobs[job_id]['status'] = 'Failed'
        jobs[job_id]['error'] = str(e)

@app.route("/submit", methods=["POST"])
def submit():
    sequence = request.json.get("sequence", "").strip()
    if not sequence:
        return jsonify({"error": "Missing sequence"}), 400

    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "Queued"}
    threading.Thread(target=process_job, args=(job_id, sequence)).start()

    return jsonify({"job_id": job_id})

@app.route("/status/<job_id>")
def status(job_id):
    job = jobs.get(job_id)
    if not job:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"job_id": job_id, "status": job["status"]})

@app.route("/result/<job_id>")
def result(job_id):
    job = jobs.get(job_id)
    if not job or job["status"] != "Completed":
        return jsonify({"error": "Not ready"}), 400
    with open(job["path"], "r") as f:
        return jsonify({"pdb": f.read()})

@app.route("/history")
def history():
    return jsonify([
        {"job_id": jid, "status": job["status"]}
        for jid, job in jobs.items()
    ])

if __name__ == "__main__":
    app.run(debug=True)
