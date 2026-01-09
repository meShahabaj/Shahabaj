import { useState, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

/* ---------- Types ---------- */
interface Milestone {
    title: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
}

/* ---------- Component ---------- */
export default function GoalCreate() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const isAISuggestionEnabled =
        title.trim() !== "" &&
        description.trim() !== "" &&
        startDate !== null &&
        endDate !== null &&
        endDate >= startDate;

    const getAISuggestions = async () => {
        if (!isAISuggestionEnabled) return;

        const payload = {
            title,
            description,
            startDate: startDate?.toISOString().split("T")[0],
            endDate: endDate?.toISOString().split("T")[0],
        };


        const res = await fetch(
            `${BACKEND_URL}/projects/goal_achiever/ai_suggest_milestones`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            throw new Error("Failed to get AI suggestions");
        }

        const data = await res.json();

        // Expected: data.milestones
        setMilestones(
            data.milestones.map((m: any) => ({
                title: m.title,
                description: m.description,
                startDate: new Date(m.startDate),
                endDate: new Date(m.endDate),
            }))
        );
    };


    /* ---------- Validation ---------- */
    const isFormValid =
        title.trim() !== "" &&
        description.trim() !== "" &&
        startDate !== null &&
        endDate !== null &&
        endDate >= startDate &&
        milestones.length > 0 &&
        milestones.every(
            (m) =>
                m.title.trim() !== "" &&
                m.description.trim() !== "" &&
                m.startDate !== null &&
                m.endDate !== null &&
                m.endDate >= m.startDate
        );

    /* ---------- Helpers ---------- */
    const addMilestone = () => {
        setMilestones([
            ...milestones,
            {
                title: "",
                description: "",
                startDate: null,
                endDate: null,
            },
        ]);
    };

    const updateMilestone = (
        index: number,
        field: keyof Milestone,
        value: any
    ) => {
        const updated = [...milestones];
        updated[index][field] = value;

        // Reset dependent dates if order breaks
        if (field === "startDate") {
            updated[index].endDate = null;
        }

        setMilestones(updated);
    };

    const removeMilestone = (index: number) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    /* ---------- Submit ---------- */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const payload = {
            title,
            description,
            startDate,
            endDate,
            milestones: milestones.map((m) => ({
                title: m.title,
                description: m.description,
                startDate: m.startDate,
                endDate: m.endDate,
            })),
        };
        console.log("Submitting Goal:", BACKEND_URL);

        const res = await fetch(
            `${BACKEND_URL}/projects/goal_achiever/create_goal`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            }
        );

        if (!res.ok) {
            throw new Error("Failed to create goal");
        }

        /* Reset */
        setTitle("");
        setDescription("");
        setStartDate(null);
        setEndDate(null);
        setMilestones([]);
        window.location.href = "/#/projects/goal_achiever";
    };

    /* ---------- UI ---------- */
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {isAISuggestionEnabled && (
                <button
                    type="button"
                    onClick={getAISuggestions}
                    className="w-full rounded-xl py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                >
                    ✨ Get AI Suggested Steps
                </button>
            )}

            {/* Goal Title */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Goal Title *
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border px-4 py-2"
                    />
                </div>

                {/* Goal Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Description *
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-xl border px-4 py-2 min-h-[80px]"
                    />
                </div>

                {/* Goal Date Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Start Date *
                        </label>
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
                        <label className="block text-sm font-medium mb-1">
                            End Date *
                        </label>
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

            {/* Milestones / Steps */}
            {startDate && endDate && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">
                            Steps (Milestones)
                        </h3>
                        <button
                            type="button"
                            onClick={addMilestone}
                            className="text-sm text-blue-600"
                        >
                            + Add Step
                        </button>
                    </div>

                    {milestones.map((m, i) => {
                        const prev = milestones[i - 1];

                        const minStart =
                            i === 0
                                ? startDate
                                : prev?.endDate ?? startDate;

                        return (
                            <div
                                key={i}
                                className="rounded-xl border p-4 space-y-3"
                            >
                                <input
                                    placeholder={`Step ${i + 1} title`}
                                    value={m.title}
                                    onChange={(e) =>
                                        updateMilestone(
                                            i,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                <textarea
                                    placeholder="Step description"
                                    value={m.description}
                                    onChange={(e) =>
                                        updateMilestone(
                                            i,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                {/* Step Start */}
                                <DatePicker
                                    selected={m.startDate}
                                    onChange={(date) =>
                                        updateMilestone(
                                            i,
                                            "startDate",
                                            date
                                        )
                                    }
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={50}
                                    minDate={minStart ?? undefined}
                                    maxDate={endDate ?? undefined}
                                    placeholderText="Step start date"
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                {/* Step End */}
                                <DatePicker
                                    selected={m.endDate}
                                    onChange={(date) =>
                                        updateMilestone(
                                            i,
                                            "endDate",
                                            date
                                        )
                                    }
                                    minDate={
                                        m.startDate ??
                                        minStart ??
                                        undefined
                                    }
                                    maxDate={endDate ?? undefined}
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={50}
                                    placeholderText="Step end date"
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeMilestone(i)
                                    }
                                    className="text-sm text-red-500"
                                >
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
                className={`w-full rounded-xl py-2 text-white transition ${isFormValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                Create Goal
            </button>
        </form>
    );
}
