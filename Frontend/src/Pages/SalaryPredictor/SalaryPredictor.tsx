import { useState, FormEvent } from "react";
import axios from "axios";
import jobs from "./SalaryPredictorUtils";
import Header from "../Header/Header.tsx";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

const SalaryPredictor: React.FC = () => {
  const [age, setAge] = useState<number>(25);
  const [experience, setExperience] = useState<number>(0);
  const [gender, setGender] = useState<string>("Male");
  const [education, setEducation] = useState<string>("Bachelor's");
  const [job, setJob] = useState<string>("Software Engineer");
  const [loading, setLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<number | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${BACKEND_URL}/projects/salary_predictor/predict`,
        { age, experience, gender, education, job }
      );
      setPrediction(res.data.prediction);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 text-slate-900">
      <Header />

      {/* PAGE HEADER */}
      <header className="mx-auto max-w-4xl px-6 pt-14 pb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Salary Prediction
        </h1>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Estimate salary based on age, experience, education, and role.
          This demo uses sample data for prediction.
        </p>
      </header>

      {/* PAGE CONTENT */}
      <main className="mx-auto max-w-5xl px-6 pb-20 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl p-8"
        >
          {/* STATUS */}
          {loading && (
            <div className="mb-5 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-center text-sm text-yellow-700">
              ⏳ Waiting for backend… first request may take some time
            </div>
          )}

          {prediction !== null && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center font-semibold text-emerald-700">
              Predicted Salary: ₹{prediction}
            </div>
          )}

          {/* FORM */}
          <div className="space-y-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                min={10}
                max={100}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Education Level
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option>High School</option>
                <option>Bachelor's</option>
                <option>Master's</option>
                <option>PhD</option>
              </select>
            </div>

            {/* Job */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title
              </label>
              <select
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {jobs.map((j: string) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
          >
            Predict Salary
          </button>
        </form>
      </main>
    </div>
  );
};

export default SalaryPredictor;
