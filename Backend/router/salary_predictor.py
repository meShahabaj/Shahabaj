from fastapi import APIRouter, Request, HTTPException
from catboost import CatBoostRegressor
import json

router = APIRouter()

# ✅ Load CatBoost model ONCE (faster)
model = CatBoostRegressor()
model.load_model("./Utils/salary_predictor.cbm")


@router.post("/projects/salary_predictor/predict")
async def predict_salary(request: Request):

    # Read JSON input
    data = await request.json()

    # Validate payload
    required_fields = ["age", "gender", "education", "job", "experience"]

    for f in required_fields:
        if f not in data:
            raise HTTPException(status_code=400, detail=f"Missing field: {f}")

    age = data["age"]
    gender = data["gender"]
    education = data["education"]
    job = data["job"]
    experience = data["experience"]

    # Predict
    prediction = model.predict([[age, gender, education, job, experience]])
    prediction = float(prediction)

    return {"prediction": prediction}
