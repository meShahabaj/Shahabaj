// Updated ResumeScorer.tsx with IT job selector and modern styling
import React, { useState } from "react";
import axios from "axios";
import EasyConnect from "../../App_utils/EasyConnect";
import "./Resume_scorer.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

const IT_JOBS = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Cybersecurity Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "IT Support Specialist",
    "System Administrator",
];

const ResumeScorer: React.FC = () => {
    const [resume, setResume] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResume(file);
        setScore(null);
        setError(null);

        if (file.type === "application/pdf") {
            const url = URL.createObjectURL(file);
            setPreviewURL(url);
        } else {
            setPreviewURL(null);
        }
    };

    const handleSubmit = async () => {
        if (!resume || !jobTitle) {
            setError("Please select a resume and IT job before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("file", resume);
        formData.append("JobTitle", jobTitle);

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                `${BACKEND_URL}/projects/resume_scorer`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setScore(response.data);
        } catch (err: any) {
            console.error("Upload error:", err.response?.data || err.message);
            setError("Failed to upload resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-scorer-container modern-card">
            <EasyConnect />

            <h1 className="title">Resume Scorer</h1>

            <div className="input-group">
                <label className="label">Upload Resume</label>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="file-input"
                    onChange={handleFileUpload}
                />
            </div>

            <div className="input-group">
                <label className="label">Select IT Job Role</label>
                <select
                    className="select-input"
                    onChange={(e) => setJobTitle(e.target.value)}
                >
                    <option value="">Choose a role...</option>
                    {IT_JOBS.map((job) => (
                        <option key={job} value={job}>
                            {job}
                        </option>
                    ))}
                </select>
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Uploading..." : "Submit"}
            </button>

            {score !== null && (
                <div className="score-result modern-box">
                    <strong>Score:</strong> {score}%
                </div>
            )}

            {error && <div className="error-message modern-error">{error}</div>}

            {previewURL && (
                <div className="pdf-preview modern-box">
                    <h3>Preview:</h3>
                    <iframe src={previewURL} title="Resume PDF Preview"></iframe>
                </div>
            )}
        </div>
    );
};

export default ResumeScorer;