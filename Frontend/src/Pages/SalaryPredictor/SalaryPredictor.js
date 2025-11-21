import { useState } from "react";
import axios from "axios";
import "./SalaryPredictor.css";
import jobs from "./SalaryPredictorUtils";
import EasyConnect from "../EasyConnect";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function SalaryPredictor() {
  const [age, setAge] = useState(25);
  const [experience, setExperience] = useState(0);
  const [gender, setGender] = useState("Male");
  const [education, setEducation] = useState("Bachelor's");
  const [job, setJob] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);

  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);

    const data = { age, experience, gender, education, job };
    try {
      const res = await axios.post(`${BACKEND_URL}/projects/salary_predictor/predict`, data);
      setPrediction(res.data);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="page-container">
      <EasyConnect/>

      <form onSubmit={handleSubmit} className="form-card">

        {/* Caution */}
        <h1 className="title">Salary Prediction</h1>
        {loading && (
          <div className="loading-box">
            <p className="loading-text">⏳ Waiting for backend… first request may take some time</p>
          </div>
        )}
        <p>This is a dummy predictor.</p>
        {/* Prediction Output */}
        {prediction && (
          <p className="result">Predicted Salary: ₹{prediction}</p>
        )}

        {/* Age */}
        <div className="input-group">
          <label>Age</label>
          <input
            type="number"
            min="10"
            max="100"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* Experience */}
        <div className="input-group">
          <label>Experience (years)</label>
          <input
            type="number"
            min="0"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        {/* Gender */}
        <div className="input-group">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        {/* Education */}
        <div className="input-group">
          <label>Education Level</label>
          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          >
            <option>High School</option>
            <option>Bachelor's</option>
            <option>Master's</option>
            <option>PhD</option>
          </select>
        </div>

        {/* Job */}
        <div className="input-group">
          <label>Job Title</label>
          <select
            value={job}
            onChange={(e) => setJob(e.target.value)}
          >
            {jobs.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button type="submit" className="submit-btn">
          Predict Salary
        </button>


      </form>

    </div>
  );
}

