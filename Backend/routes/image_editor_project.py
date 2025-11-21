from flask import Blueprint, request, send_file
import numpy as np
import cv2
from io import BytesIO
import onnxruntime as ort

image_editor_project_bp = Blueprint("/projects/image_editor/upload", __name__)

session = ort.InferenceSession("./Utils/face_detection_yolo_custom.onnx", providers=['CPUExecutionProvider'])
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

@image_editor_project_bp.route('/projects/image_editor/upload', methods=['POST'])
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