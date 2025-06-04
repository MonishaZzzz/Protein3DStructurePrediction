import numpy as np
import tensorflow as tf

# Load models once
angle_model = tf.keras.models.load_model("resnet_1d_angles.h5")
distance_model = tf.keras.models.load_model("elu_resnet_2d_distances.h5")

def preprocess_sequence(seq, max_len=128):
    aa_dict = {
        'A': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6,
        'H': 7, 'I': 8, 'K': 9, 'L': 10, 'M': 11, 'N': 12,
        'P': 13, 'Q': 14, 'R': 15, 'S': 16, 'T': 17, 'V': 18,
        'W': 19, 'Y': 20
    }
    encoded = [aa_dict.get(aa, 0) for aa in seq.upper()]
    padded = encoded[:max_len] + [0] * (max_len - len(encoded))
    return np.array(padded).reshape(1, -1)

def predict_angles(sequence):
    input_tensor = preprocess_sequence(sequence)
    angles = angle_model.predict(input_tensor)[0]
    return angles.tolist()

def predict_distances(sequence):
    input_tensor = preprocess_sequence(sequence)
    dist_matrix = distance_model.predict(input_tensor)[0]
    return dist_matrix.tolist()
