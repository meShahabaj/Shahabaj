import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import EasyConnect from "../../App_utils/EasyConnect.tsx";
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
    const [issues, setIssues] = useState<Array<any> | null>(null);

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

            setIssues(response.data["Issues"]);
            setScore(Math.round(response.data["Similarity score"]));
        } catch (err: any) {
            setError("Failed to upload resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <EasyConnect />
            <div className="resume-scorer-modern">
                <h1 className="modern-title">AI Resume Scorer</h1>

                <div className="modern-grid">
                    {/* Upload Panel */}
                    <div className="modern-panel">
                        <label className="modern-label">Upload Resume</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="modern-file-input"
                            onChange={handleFileUpload}
                        />

                        <label className="modern-label">Select Job Role</label>
                        <Select
                            options={JOBS}
                            onChange={(option: any) => setJobTitle(option.value)}
                            placeholder="Search job roles..."
                            isSearchable
                        />

                        <button
                            className="modern-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Analyzing..." : "Score Resume"}
                        </button>

                        {error && <div className="modern-error-box">{error}</div>}

                        {issues && issues.length > 0 && (
                            <div className="modern-issues">
                                {issues.map((i, idx) => (
                                    <div key={idx} className="issue-card">
                                        <strong>{i.severity}:</strong> {i.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="modern-results">
                        {score !== null && (
                            <div className="score-card">
                                <h3>Resume Score</h3>
                                <CircularProgressbar
                                    value={score}
                                    text={`${score}%`}
                                    styles={buildStyles({
                                        textSize: "16px",
                                        pathColor: `rgba(99, 102, 241, ${score / 100})`,
                                        textColor: "#4f46e5",
                                        trailColor: "#e5e7eb",
                                    })}
                                />
                            </div>
                        )}

                        {previewURL && (
                            <div className="pdf-card">
                                <h3>Resume Preview</h3>
                                <iframe src={previewURL} title="Resume PDF Preview" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResumeScorer;
