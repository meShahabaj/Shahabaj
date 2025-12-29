import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { JOBS } from "./Resume_scorer_utils";
import Header from "../Header/Header.tsx";
import BelowComponents from "./BelowComponents.tsx";

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
        <div className="min-h-screen bg-white text-slate-900 ">
            <Header />
            {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border-red-200 items-center justify-center flex">
                    {error}
                </div>
            )}
            <main className="mx-auto max-w-4xl px-6 py-10 flex flex-col items-center">
                {/* HEADER */}
                <header className="text-center mb-14">
                    <h1 className="text-4xl text-black font-bold tracking-tight">
                        AI Resume Scorer
                    </h1>
                    <p className="mt-4 text-black max-w-xl mx-auto">
                        Analyze how well your resume matches a job role using AI-powered scoring
                    </p>
                </header>

                <div>
                    {/* UPLOAD PANEL */}
                    <section>
                        <div className="md:flex gap-8">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-black">
                                    Upload Resume
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    className="w-full rounded-xl cursor-pointer border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-black">
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
                                            backgroundColor: "#ffffffff",
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
                                className="p-2.5 mt-6 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {loading ? "Analyzing…" : "Score Resume"}
                            </button>



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
                        <section className="bg-white/80 p-8 space-y-8">
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
                                    <p className="mb-2 text-sm text-black">
                                        Resume Preview
                                    </p>
                                    <iframe
                                        src={`${previewURL}#toolar=0&navpanes=0`}
                                        className="h-[460px] w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                                    />
                                </div>
                            )}
                        </section>
                    )}
                </div>


            </main>
            <BelowComponents />

        </div>
    );
};

export default ResumeScorer;
