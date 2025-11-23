from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
import numpy as np
import cv2
from io import BytesIO
import onnxruntime as ort

router = APIRouter()

# ONNX model
session = ort.InferenceSession(
    "./Utils/face_detection_yolo_custom.onnx",
    providers=['CPUExecutionProvider']
)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name


@router.post("/projects/image_editor/upload")
async def upload_image(
    image: UploadFile = File(...),
    width: float = Form(...),
    height: float = Form(...),
    blur: float = Form(...),
    faceBlur: str = Form(...)
):
    # Convert fields to correct types
    width = int(round(width))
    height = int(round(height))
    blur_value = int(round(blur))

    # Read uploaded image
    file_bytes = await image.read()

    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(400, "Invalid image uploaded")

    # Resize image
    img = cv2.resize(img, (width, height))

    # If face blur is enabled
    if faceBlur == "true":
        h, w = img.shape[:2]

        # Preprocess for ONNX
        inp = cv2.resize(img, (640, 640))
        inp = cv2.cvtColor(inp, cv2.COLOR_BGR2RGB)
        inp = inp / 255.0
        inp = inp.transpose(2, 0, 1)[None].astype(np.float32)

        # Run model
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

        # Apply blur to faces
        for (x1, y1, x2, y2) in boxes:
            x1 = max(0, x1)
            y1 = max(0, y1)
            x2 = min(w, x2)
            y2 = min(h, y2)

            roi = img[y1:y2, x1:x2]
            if roi.size > 0:
                img[y1:y2, x1:x2] = cv2.GaussianBlur(roi, (31, 31), 10)

    # Apply global blur
    img = cv2.blur(img, (blur_value, blur_value))

    # Encode to JPG
    success, buffer = cv2.imencode(".jpg", img)
    if not success:
        raise HTTPException(500, "Image encoding failed")

    output = BytesIO(buffer.tobytes())
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="image/jpeg",
        headers={"Content-Disposition": "attachment; filename=resized.jpg"}
    )
