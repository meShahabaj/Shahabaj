from flask import Blueprint, request
from catboost import CatBoostRegressor
import json

salary_predictor_project_bp = Blueprint("/projects/salary_predictor/predict", __name__)

@salary_predictor_project_bp.route('/projects/salary_predictor/predict', methods=['POST'])
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