from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import onnxruntime as ort
from io import BytesIO
import zipfile
import cv2
import numpy as np

router = APIRouter()

# Load ONNX model
session = ort.InferenceSession(
    "./Utils/face_detection_yolo_custom.onnx",
    providers=['CPUExecutionProvider']
)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name


@router.post("/projects/face_extractor/upload")
async def face_extractor(image: UploadFile = File(...)):
    # Read uploaded file
    file_bytes = await image.read()
    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(400, "Invalid image")

    h, w = img.shape[:2]

    # Preprocess for ONNX
    inp = cv2.resize(img, (640, 640))
    inp = cv2.cvtColor(inp, cv2.COLOR_BGR2RGB)
    inp = inp / 255.0
    inp = inp.transpose(2, 0, 1)[None].astype(np.float32)

    # Predict
    pred = session.run([output_name], {input_name: inp})[0]
    pred = np.squeeze(pred)

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

    if len(boxes) == 0:
        raise HTTPException(404, "No face detected")

    # Convert to (x,y,w,h) for NMS
    cv_boxes = [[b[0], b[1], b[2] - b[0], b[3] - b[1]] for b in boxes]

    indices = cv2.dnn.NMSBoxes(cv_boxes, scores, 0.5, 0.5)

    # Normalize NMS output
    if isinstance(indices, np.ndarray):
        indices = indices.flatten().tolist()
    elif len(indices) > 0 and isinstance(indices[0], (list, tuple)):
        indices = [i[0] for i in indices]
    elif isinstance(indices, int):
        indices = [indices]

    if len(indices) == 0:
        raise HTTPException(404, "No face detected")

    final_boxes = [boxes[i] for i in indices]

    # Create ZIP file
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for i, (x1, y1, x2, y2) in enumerate(final_boxes):
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)

            face = img[y1:y2, x1:x2]
            if face.size == 0:
                continue

            success, buffer = cv2.imencode(".jpg", face)
            if success:
                zipf.writestr(f"face_{i+1}.jpg", buffer.tobytes())

    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=faces.zip"}
    )
