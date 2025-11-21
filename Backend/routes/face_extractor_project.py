from flask import Blueprint,  request, send_file, jsonify
import onnxruntime as ort
from io import BytesIO
import zipfile
import cv2
import numpy as np

session = ort.InferenceSession("./Utils/face_detection_yolo_custom.onnx", providers=['CPUExecutionProvider'])
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

face_extractor_project_bp = Blueprint("/projects/face_extractor/upload", __name__)

@face_extractor_project_bp.route("/projects/face_extractor/upload", methods=["POST"])
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
