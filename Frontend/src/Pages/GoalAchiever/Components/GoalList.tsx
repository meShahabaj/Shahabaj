import { useEffect, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

interface Milestone {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    completed: boolean;
}
const STEP_COLORS = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-yellow-500",
];


interface Goal {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    milestones: Milestone[];
    createdAt: string;
    status: "pending" | "in-progress" | "completed";
}
const getStepStyle = (
    goalStart: string,
    goalEnd: string,
    stepStart: string,
    stepEnd: string
) => {
    const gStart = new Date(goalStart).getTime();
    const gEnd = new Date(goalEnd).getTime();

    const sStart = new Date(stepStart).getTime();
    const sEnd = new Date(stepEnd).getTime();

    const left = ((sStart - gStart) / (gEnd - gStart)) * 100;
    const width = ((sEnd - sStart) / (gEnd - gStart)) * 100;

    return {
        left: `${Math.max(left, 0)}%`,
        width: `${Math.max(width, 1)}%`,
    };
};

export default function GoalsList() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showMilestones, setShowMilestones] = useState<Record<string, boolean>>({});

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/goals`, { credentials: "include" });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to load goals");
            }
            const data = await res.json();
            setGoals(data.goals);
            // Initialize milestone toggle state
            const milestoneState: Record<string, boolean> = {};
            setShowMilestones(milestoneState);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const getTimeLeft = (startDate: string, endDate: string) => {
        const now = new Date().getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        const totalDays = Math.max(
            Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
            0
        );

        // If milestone hasn't started yet
        if (now < start) {
            return {
                total: totalDays,
                left: totalDays,
                label: `${totalDays} days total · starts in ${Math.ceil(
                    (start - now) / (1000 * 60 * 60 * 24)
                )} days`,
            };
        }

        // If milestone already ended
        if (now > end) {
            return {
                total: totalDays,
                left: 0,
                label: `${totalDays} days total · ended`,
            };
        }

        const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

        return {
            total: totalDays,
            left: daysLeft,
            label: `${totalDays} days total · ${daysLeft} days left`,
        };
    };



    const toggleMilestone = async (goalId: string, index: number) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/projects/goal_achiever/goals/${goalId}/milestones/${index}/toggle`,
                { method: "PATCH", credentials: "include" }
            );
            if (!res.ok) throw new Error("Failed to update milestone");
            fetchGoals();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const deleteGoal = async (goalId: string) => {
        if (!window.confirm("Delete this goal permanently?")) return;
        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/goals/${goalId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to delete goal");
            }
            setGoals((prev) => prev.filter((g) => g.id !== goalId));
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <p className="text-gray-500">Loading goals...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (goals.length === 0) return <div className="text-center text-gray-500 py-8">No goals created yet 🌱</div>;

    return (
        <div className="space-y-8">
            {goals.map((goal) => (
                <div key={goal.id} className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
                    {/* Goal Header */}
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">{goal.title}</h2>
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(goal.startDate).toDateString()} → {new Date(goal.endDate).toDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                                {getTimeLeft(goal.startDate, goal.endDate).label}
                            </p>

                            <button
                                onClick={() => deleteGoal(goal.id)}
                                className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() =>
                                    setShowMilestones((prev) => ({ ...prev, [goal.id]: !prev[goal.id] }))
                                }
                                className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                            >
                                {showMilestones[goal.id] ? "Hide Steps" : "Show Steps"}
                            </button>
                        </div>
                    </div>

                    {/* Milestones */}
                    {showMilestones[goal.id] && (<div>
                        {/* Steps Timeline */}
                        <div className="relative w-full mt-4 mb-6">
                            {/* Base line */}
                            <div className="h-2 bg-gray-200 rounded-full" />

                            {/* Step segments */}
                            {goal.milestones.map((m, i) => {
                                const style = getStepStyle(
                                    goal.startDate,
                                    goal.endDate,
                                    m.startDate,
                                    m.endDate
                                );

                                const color = STEP_COLORS[i % STEP_COLORS.length];

                                return (
                                    <div
                                        key={i}
                                        className={`absolute top-0 h-2 rounded-full ${color} group cursor-pointer`}
                                        style={style}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 
                                scale-0 group-hover:scale-100 transition
                                bg-gray-900 text-white text-xs px-3 py-2 
                                rounded-lg whitespace-nowrap shadow-lg z-10">
                                            <p className="font-medium">{m.title}</p>
                                            <p className="text-gray-300">
                                                {new Date(m.startDate).toDateString()} →{" "}
                                                {new Date(m.endDate).toDateString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Goal date labels */}
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>{new Date(goal.startDate).toDateString()}</span>
                                <span>{new Date(goal.endDate).toDateString()}</span>
                            </div>
                        </div>

                        <div className="space-y-3">

                            <h3 className="text-sm font-semibold text-gray-700">Steps</h3>
                            <div className="space-y-3">
                                {goal.milestones.map((m, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        {/* Timeline dot */}
                                        <div className="mt-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        </div>

                                        <div className="flex-1 rounded-xl border px-4 py-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span
                                                        className={`font-medium text-sm ${m.completed ? "line-through text-gray-400" : "text-gray-800"
                                                            }`}
                                                    >
                                                        {m.title}
                                                    </span>
                                                    <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(m.startDate).toDateString()} → {new Date(m.endDate).toDateString()}
                                                    </p>
                                                </div>
                                                {!m.completed && (
                                                    <p className="text-xs text-blue-600 mt-1 font-medium">
                                                        {getTimeLeft(m.startDate, m.endDate).label}
                                                    </p>
                                                )}




                                                <button
                                                    onClick={() => toggleMilestone(goal.id, i)}
                                                    className={`text-xs px-3 py-1 rounded-full border transition ${m.completed
                                                        ? "border-green-300 text-green-700 bg-green-50"
                                                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {m.completed ? "Completed" : "Mark done"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            ))}
        </div>
    );
}
