from flask import Flask, request, jsonify, send_file
import requests
import threading
import uuid
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
jobs = {}
PDB_DIR = "pdb_files"
os.makedirs(PDB_DIR, exist_ok=True)

@app.route("/predict-models", methods=["POST"])
def predict_models():
    sequence = request.json.get("sequence", "").strip()
    if not sequence:
        return jsonify({"error": "Missing sequence"}), 400

    try:
        angles = predict_angles(sequence)
        distances = predict_distances(sequence)
        return jsonify({
            "angles": angles,
            "distances": distances
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
