import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import EasyConnect from "../../App_utils/EasyConnect";
import "./Resume_scorer.css";
import { JOBS } from "./Resume_scorer_utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

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
            setPreviewURL(URL.createObjectURL(file));
        } else {
            setPreviewURL(null);
        }
    };

    const handleSubmit = async () => {
        if (!resume || !jobTitle) {
            setError("Please select a resume and job before submitting.");
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
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setScore(Math.round(response.data));
        } catch (err: any) {
            console.error("Upload error:", err.response?.data || err.message);
            setError("Failed to upload resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <EasyConnect />
            <div className="resume-scorer-container modern-card">

                <h1 className="title">Resume Scorer</h1>

                <div className="scorer-columns">
                    {/* Left Column */}
                    <div className="left-column">
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
                            <label className="label">Select Job Role</label>
                            <Select
                                options={JOBS}
                                onChange={(option: any) => setJobTitle(option.value)}
                                placeholder="Search or select a job role..."
                                isSearchable
                            />
                        </div>

                        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Uploading..." : "Submit"}
                        </button>

                        {error && <div className="error-message modern-error">{error}</div>}
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        {score !== null && (
                            <div className="score-speedometer modern-box">
                                <h3>Resume Score</h3>
                                <div style={{ width: "180px", height: "180px", margin: "auto" }}>
                                    <CircularProgressbar
                                        value={score}
                                        text={`${score}%`}
                                        styles={buildStyles({
                                            textSize: "22px",
                                            pathColor: `rgba(99, 102, 241, ${score / 100})`,
                                            textColor: "#6366f1",
                                            trailColor: "#eee",
                                        })}
                                    />
                                </div>
                            </div>
                        )}
                        {previewURL && (
                            <div className="pdf-preview modern-box">
                                <h3>Preview:</h3>
                                <iframe src={previewURL} title="Resume PDF Preview"></iframe>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </>
    );
};

export default ResumeScorer;
