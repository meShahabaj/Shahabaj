from fastapi import APIRouter, UploadFile, File, HTTPException
import cv2
import numpy as np
from number_identifier import forward

router = APIRouter()


@router.post("/projects/number_identifier/upload")
async def number_identifier_upload(
    image: UploadFile = File(...)
):
    # ---- Validate image ----
    if image.filename == "":
        raise HTTPException(status_code=400, detail="No selected file")

    # ---- Read file bytes ----
    file_bytes = await image.read()

    np_arr = np.frombuffer(file_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # ---- Preprocess ----
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, (28, 56))     # Your model expects this
    gray = gray / 255.0                   # Normalize
    X = gray.flatten().reshape(1, -1)

    # ---- Model Forward ----
    _, y_pred, _, _ = forward(X)
    prediction = int(np.argmax(y_pred))

    return {"prediction": str(prediction)}
