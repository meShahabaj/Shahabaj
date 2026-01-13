import { useState, FormEvent, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

type WeekDays = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

interface Milestone {
    title: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
}

export default function GoalCreate() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [hoursPerDay, setHoursPerDay] = useState(1);
    const [daysOfWeek, setDaysOfWeek] = useState<WeekDays[]>([]);

    const [milestones, setMilestones] = useState<Milestone[]>([]);

    /** AI Question Flow State */
    const [aiQuestions, setAIQuestions] = useState<string[]>([]);
    const [aiAnswers, setAIAnswers] = useState<{ [key: string]: string }>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showAIQuestionPopup, setShowAIQuestionPopup] = useState(false);

    const isAISuggestionEnabled =
        title.trim() !== "" &&
        description.trim() !== "" &&
        startDate !== null &&
        endDate !== null &&
        endDate >= startDate &&
        hoursPerDay > 0 &&
        daysOfWeek.length > 0;


    const getAIQuestions = async () => {
        if (!isAISuggestionEnabled) return;

        const payload = {
            title,
            description,
            startDate: startDate?.toISOString().split("T")[0],
            endDate: endDate?.toISOString().split("T")[0],
            hoursPerDay,
            daysOfWeek,
        };

        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/ai_generate_questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to generate AI questions");

            const data = await res.json();
            setAIQuestions(data.questions); // ["What is your main motivation?", "Preferred milestone style?"]
            setCurrentQuestionIndex(0);
            setShowAIQuestionPopup(true);
        } catch (err) {
            console.error(err);
        }
    };

    /** ---------- Step 2: Show questions one by one and collect answers ---------- */
    useEffect(() => {
        if (currentQuestionIndex >= aiQuestions.length && aiQuestions.length > 0) {
            setShowAIQuestionPopup(false);
            sendGoalWithAnswers();
        }
    }, [currentQuestionIndex]);

    /** ---------- Step 3: Send goal + answers to AI to get milestones ---------- */
    const sendGoalWithAnswers = async () => {
        const payload = {
            title,
            description,
            startDate: startDate?.toISOString().split("T")[0],
            endDate: endDate?.toISOString().split("T")[0],
            hoursPerDay,
            daysOfWeek,
            answers: aiAnswers,
        };

        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/ai_suggest_milestones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to get AI suggested milestones");

            const data = await res.json();
            setMilestones(
                data.milestones.map((m: any) => ({
                    title: m.title,
                    description: m.description,
                    startDate: new Date(m.startDate),
                    endDate: new Date(m.endDate),
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    /** ---------- Validation ---------- */
    const isFormValid =
        title.trim() !== "" &&
        description.trim() !== "" &&
        startDate &&
        endDate &&
        endDate >= startDate &&
        hoursPerDay > 0 &&
        daysOfWeek.length > 0 &&
        milestones.length > 0 &&
        milestones.every((m) => m.title.trim() && m.description.trim() && m.startDate && m.endDate && m.endDate >= m.startDate);

    /** ---------- Milestone helpers ---------- */
    const addMilestone = () =>
        setMilestones([...milestones, { title: "", description: "", startDate: null, endDate: null }]);
    const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
        const updated = [...milestones];
        updated[index][field] = value;
        if (field === "startDate") updated[index].endDate = null;
        setMilestones(updated);
    };
    const removeMilestone = (index: number) => setMilestones(milestones.filter((_, i) => i !== index));

    /** ---------- Submit ---------- */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const payload = {
            title,
            description,
            startDate,
            endDate,
            hoursPerDay,
            daysOfWeek,
            milestones,
        };

        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/create_goal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create goal");

            setTitle("");
            setDescription("");
            setStartDate(null);
            setEndDate(null);
            setMilestones([]);
            setHoursPerDay(1);
            setDaysOfWeek([]);
            window.location.href = "/#/projects/goal_achiever/view_goals";
        } catch (err) {
            console.error(err);
        }
    };

    /** ---------- UI ---------- */
    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* AI Suggestion Button */}
            {isAISuggestionEnabled && (
                <button
                    type="button"
                    onClick={getAIQuestions}
                    className="w-full rounded-xl py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                    ✨ Get AI Suggested Steps
                </button>
            )}

            {/* Goal Title & Description */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Goal Title *</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border px-4 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-xl border px-4 py-2 min-h-[80px]"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Date *</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                setMilestones([]);
                            }}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            scrollableYearDropdown
                            yearDropdownItemNumber={50}
                            minDate={new Date()}
                            className="w-full rounded-xl border px-4 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">End Date *</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => {
                                setEndDate(date);
                                setMilestones([]);
                            }}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            scrollableYearDropdown
                            yearDropdownItemNumber={50}
                            minDate={startDate ?? new Date()}
                            className="w-full rounded-xl border px-4 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Goal Time Plan */}
            <div className="rounded-xl border p-4 space-y-3">
                <h3 className="font-medium">Goal Schedule</h3>
                <div>
                    <label className="text-sm block mb-1">Hours per day</label>
                    <input
                        type="number"
                        min={1}
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(Number(e.target.value))}
                        className="w-32 rounded-lg border px-2 py-1"
                    />
                </div>
                <div>
                    <label className="text-sm block mb-1">Days</label>
                    <div className="flex flex-wrap gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                            const selected = daysOfWeek.includes(d as WeekDays);
                            return (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() =>
                                        setDaysOfWeek(selected ? daysOfWeek.filter((x) => x !== d) : [...daysOfWeek, d as WeekDays])
                                    }
                                    className={`px-3 py-1 rounded-full border text-sm ${selected ? "bg-blue-600 text-white border-blue-600" : "border-gray-300"
                                        }`}
                                >
                                    {d}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => setDaysOfWeek(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])}
                            className="px-3 py-1 rounded-full border text-sm bg-gray-100"
                        >
                            Everyday
                        </button>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            {startDate && endDate && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Steps (Milestones)</h3>
                        <button type="button" onClick={addMilestone} className="text-sm text-blue-600">
                            + Add Step
                        </button>
                    </div>
                    {milestones.map((m, i) => {
                        const prev = milestones[i - 1];
                        const minStart = i === 0 ? startDate : prev?.endDate ?? startDate;
                        return (
                            <div key={i} className="rounded-xl border p-4 space-y-3">
                                <input
                                    placeholder={`Step ${i + 1} title`}
                                    value={m.title}
                                    onChange={(e) => updateMilestone(i, "title", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                                <textarea
                                    placeholder="Step description"
                                    value={m.description}
                                    onChange={(e) => updateMilestone(i, "description", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                                <DatePicker
                                    selected={m.startDate}
                                    onChange={(date) => updateMilestone(i, "startDate", date)}
                                    minDate={minStart ?? undefined}
                                    maxDate={endDate ?? undefined}
                                    placeholderText="Step start date"
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                                <DatePicker
                                    selected={m.endDate}
                                    onChange={(date) => updateMilestone(i, "endDate", date)}
                                    minDate={m.startDate ?? minStart ?? undefined}
                                    maxDate={endDate ?? undefined}
                                    placeholderText="Step end date"
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                                <button type="button" onClick={() => removeMilestone(i)} className="text-sm text-red-500">
                                    Remove step
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Submit */}
            <button
                disabled={!isFormValid}
                className={`w-full rounded-xl py-2 text-white transition ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                Create Goal
            </button>

            {/* ---------- AI Question Popup ---------- */}
            {showAIQuestionPopup && currentQuestionIndex < aiQuestions.length && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 space-y-4">
                        <p className="font-medium">{aiQuestions[currentQuestionIndex]}</p>
                        <input
                            type="text"
                            value={aiAnswers[aiQuestions[currentQuestionIndex]] || ""}
                            onChange={(e) =>
                                setAIAnswers((prev) => ({ ...prev, [aiQuestions[currentQuestionIndex]]: e.target.value }))
                            }
                            className="w-full border rounded px-3 py-2"
                        />
                        <div className="flex justify-end gap-2">


                            <button
                                onClick={async () => {
                                    setCurrentQuestionIndex((prev) => prev + 1);
                                }}
                                className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100"
                            >
                                Skip
                            </button>

                            <button
                                onClick={async () => {
                                    setCurrentQuestionIndex((prev) => prev + 1);
                                }}
                                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Next
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
