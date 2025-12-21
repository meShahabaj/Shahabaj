import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { JOBS } from "./Resume_scorer_utils";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

const ResumeScorer: React.FC = () => {
    const [resume, setResume] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [jobTitle, setJobTitle] = useState<string | null>(null);
    const [issues, setIssues] = useState<any[] | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResume(file);
        setScore(null);
        setIssues(null);
        setError(null);

        if (file.type === "application/pdf") {
            setPreviewURL(URL.createObjectURL(file));
        } else {
            setPreviewURL(null);
        }
    };

    const handleSubmit = async () => {
        if (!resume || !jobTitle) {
            setError("Please upload a resume and select a job role.");
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
        } catch {
            setError("Failed to analyze resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
            <main className="mx-auto max-w-4xl px-6 py-16">
                {/* HEADER */}
                <header className="text-center mb-14">
                    <h1 className="text-4xl font-bold tracking-tight">
                        AI Resume Scorer
                    </h1>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                        Analyze how well your resume matches a job role using AI-powered ATS
                        scoring.
                    </p>
                </header>

                <div className="space-y-10">
                    {/* UPLOAD PANEL */}
                    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-8 backdrop-blur-xl shadow-xl">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Upload Resume
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Select Job Role
                                </label>
                                <Select
                                    options={JOBS}
                                    isSearchable
                                    placeholder="Search job roles..."
                                    onChange={(option: any) => setJobTitle(option.value)}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            backgroundColor: "transparent",
                                            borderColor: "#cbd5f5",
                                            borderRadius: "0.75rem",
                                            padding: "4px",
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: "#020617",
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: "inherit",
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            color: "inherit",
                                        }),
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {loading ? "Analyzing…" : "Score Resume"}
                            </button>

                            {error && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                                    {error}
                                </div>
                            )}

                            {issues && issues.length > 0 && (
                                <div className="space-y-3">
                                    {issues.map((issue, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-xl bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm border border-slate-200 dark:border-slate-700"
                                        >
                                            <strong className="text-indigo-600 dark:text-indigo-400">
                                                {issue.severity}:
                                            </strong>{" "}
                                            {issue.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* RESULTS */}
                    {(score !== null || previewURL) && (
                        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-8 backdrop-blur-xl shadow-xl space-y-8">
                            {score !== null && (
                                <div className="mx-auto w-40 text-center">
                                    <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Resume Match Score
                                    </p>
                                    <CircularProgressbar
                                        value={score}
                                        text={`${score}%`}
                                        styles={buildStyles({
                                            pathColor: "#4f46e5",
                                            textColor: "#4f46e5",
                                            trailColor: "#e5e7eb",
                                        })}
                                    />
                                </div>
                            )}

                            {previewURL && (
                                <div>
                                    <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
                                        Resume Preview
                                    </p>
                                    <iframe
                                        src={previewURL}
                                        title="Resume Preview"
                                        className="h-[460px] w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                                    />
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ResumeScorer;
