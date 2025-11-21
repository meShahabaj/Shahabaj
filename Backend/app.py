from flask import Flask, request, send_file, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS 
import json
import os
import numpy as np
import cv2
from io import BytesIO
from catboost import CatBoostRegressor
from number_identifier import forward
import random
from langchain_groq import ChatGroq
import onnxruntime as ort
import zipfile

app = Flask(__name__)
CORS(app) 
GROQ_API = os.getenv("GROQ_API")


session = ort.InferenceSession("./Utils/face_detection_yolo_custom.onnx", providers=['CPUExecutionProvider'])
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name


@app.route('/test', methods=["GET"])
def test():
    return "Backend Wake up successfully"

@app.route('/projects/image_editor/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return 'No file part in request', 400

    file = request.files['image']
    width = int(round(float(request.form["width"])))
    height = int(round(float((request.form["height"]))))
    blur_value = int(round(float(request.form["blur"])))

    if file.filename == '':
        return 'No selected file', 400

    file_byte = file.read()
    np_arr  = np.frombuffer(file_byte, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    img = cv2.resize(image, (width, height))

    if request.form["faceBlur"] == "true":
        h, w = img.shape[:2]
        # Preprocess for ONNX
        inp = cv2.resize(img, (640, 640))
        inp = cv2.cvtColor(inp, cv2.COLOR_BGR2RGB)
        inp = inp / 255.0
        inp = inp.transpose(2, 0, 1)[None].astype(np.float32)   # (1,3,640,640)

        # Run ONNX model
        pred = session.run([output_name], {input_name: inp})[0]
        pred = np.squeeze(pred)  

        scale_x = w / 640
        scale_y = h / 640

        boxes = []
        for det in pred.T:
            x, y, bw, bh, conf = det

            if conf < 0.3:
                continue

            x1 = int((x - bw/2) * scale_x)
            y1 = int((y - bh/2) * scale_y)
            x2 = int((x + bw/2) * scale_x)
            y2 = int((y + bh/2) * scale_y)

            boxes.append([x1, y1, x2, y2])

        for (x1, y1, x2, y2) in boxes:
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)

            roi = img[y1:y2, x1:x2]

            if roi.size > 0:
                img[y1:y2, x1:x2] = cv2.GaussianBlur(
                    roi,
                    ( 31, 31),  
                    10
                )

    resized = cv2.blur(img, ksize=(blur_value, blur_value))

    success, buffer = cv2.imencode(".jpg", resized)
    if not success :
        return "Image encoding failed", 500

    output = BytesIO(buffer.tobytes())
    output.seek(0)

    return send_file(output, mimetype = "image/jpeg", as_attachment= True, download_name = "resized.jpg")


@app.route('/projects/salary_predictor/predict', methods=['POST'])
def predict():
    model = CatBoostRegressor()
    model.load_model("./Utils/salary_predictor.cbm")

    raw_data = request.data 
    data = json.loads(raw_data.decode("utf-8"))

    age = data["age"]
    gender = data["gender"]
    education = data["education"]
    job = data["job"]
    experience = data["experience"]

    prediction = model.predict(([age, gender, education, job, experience]))

    return str(float(prediction))

@app.route('/projects/number_identifier/upload', methods=['POST'])
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


@app.route('/projects/rock_paper_scissor/detect', methods=['POST'])
def gesture_detection():

    raw_data = request.data 
    user_choice = json.loads(raw_data.decode("utf-8"))["data"]
    computer_choice = random.choice(["Rock", "Paper", "Scissor"])

    # Determine result
    if user_choice == computer_choice:
        result = "Draw"
    elif (user_choice == "Rock" and computer_choice == "Scissor") or \
         (user_choice == "Paper" and computer_choice == "Rock") or \
         (user_choice == "Scissor" and computer_choice == "Paper"):
        result = "You Won"
    else:
        result = "Computer Won"

    # Return the result along with computer choice
    return result

@app.route("/chatbot/user_request", methods=["POST"])
def chat():
    raw_data = request.data 
    data = json.loads(raw_data.decode("utf-8"))['text']

    llm = ChatGroq(
        model = "openai/gpt-oss-20b",
        temperature=.9,
        api_key=GROQ_API
    )
    messages = [
        {"role": "user", "content": data}, 
        {"role": "system", "content":"You are helpful assistant"}
    ]
    response = llm.invoke(messages)
    return response.content

@app.route("/projects/face_extractor/upload", methods=["POST"])
def face_extractor():
    if 'image' not in request.files:
        return 'No file part in request', 400

    file = request.files['image']

    if file.filename == '':
        return 'No selected file', 400

    file_byte = file.read()
    np_arr = np.frombuffer(file_byte, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    h, w = img.shape[:2]

    # Preprocess for ONNX
    inp = cv2.resize(img, (640, 640))
    inp = cv2.cvtColor(inp, cv2.COLOR_BGR2RGB)
    inp = inp / 255.0
    inp = inp.transpose(2, 0, 1)[None].astype(np.float32)

    # Run ONNX model
    pred = session.run([output_name], {input_name: inp})[0]
    pred = np.squeeze(pred)  # (5, 8400)

    x = pred[0]
    y = pred[1]
    bw = pred[2]
    bh = pred[3]
    conf = pred[4]

    boxes = []
    scores = []

    for i in range(pred.shape[1]):
        if conf[i] < 0.3:
            continue

        x1 = int((x[i] - bw[i]/2) * w / 640)
        y1 = int((y[i] - bh[i]/2) * h / 640)
        x2 = int((x[i] + bw[i]/2) * w / 640)
        y2 = int((y[i] + bh[i]/2) * h / 640)

        boxes.append([x1, y1, x2, y2])
        scores.append(float(conf[i]))

    print("Before NMS:", len(boxes))

    if len(boxes) == 0:
        return jsonify({"error": "No face detected"}), 404

    # Convert for OpenCV NMSBoxes
    opencv_boxes = []
    for (x1, y1, x2, y2) in boxes:
        opencv_boxes.append([x1, y1, x2 - x1, y2 - y1])

    indices = cv2.dnn.NMSBoxes(boxes, scores, 0.5, 0.5)

    # --- Normalize NMS output ---
    if isinstance(indices, np.ndarray):
        indices = indices.flatten().tolist()

    elif len(indices) > 0 and isinstance(indices[0], (list, tuple)):
        indices = [i[0] for i in indices]

    elif isinstance(indices, int):
        indices = [indices]

    # No detections
    if len(indices) == 0:
        return jsonify({"error": "No face detected"}), 404

    # Filter boxes
    final_boxes = [boxes[i] for i in indices]

    print("After NMS:", len(final_boxes))

    # ---- Make ZIP of cropped faces ----
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for i, (x1, y1, x2, y2) in enumerate(final_boxes):
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)

            face_roi = img[y1:y2, x1:x2]
            if face_roi.size == 0:
                continue

            success, buffer = cv2.imencode(".jpg", face_roi)
            if not success:
                continue

            zipf.writestr(f"face_{i+1}.jpg", buffer.tobytes())

    zip_buffer.seek(0)

    return send_file(
        zip_buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name="faces.zip"
    )



if __name__ == '__main__':
    port = 5000
    app.run(host='0.0.0.0', port=port,debug=True)
