from flask import Blueprint, request
import cv2
import numpy as np
from number_identifier import forward

number_identifier_bp = Blueprint("/projects/number_identifier/upload", __name__)

@number_identifier_bp.route('/projects/number_identifier/upload', methods=['POST'])
def number_dentifier_upload():
    if 'image' not in request.files:
        return 'No file part in request', 400

    file = request.files['image']

    if file.filename == '':
        return 'No selected file', 400

    file_byte = file.read()
    np_arr  = np.frombuffer(file_byte, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    gray = cv2.resize(gray, (28, 56))

    # Normalize
    gray = gray / 255.0
    X = gray.flatten().reshape(1, -1)

    _, y_pred, _, _ = forward(X)
    prediction = int(np.argmax(y_pred))

    return {"prediction": str(prediction)}
