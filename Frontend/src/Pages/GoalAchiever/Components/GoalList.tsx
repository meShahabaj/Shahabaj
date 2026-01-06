import { useEffect, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

interface Milestone {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    completed: boolean;
}

interface Goal {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    milestones: Milestone[];
    createdAt: string; status: "pending" | "in-progress" | "completed";
}

export default function GoalsList() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchGoals();
    }, []);
    const toggleMilestone = async (goalId: string, index: number) => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/projects/goal_achiever/goals/${goalId}/milestones/${index}/toggle`,
                {
                    method: "PATCH",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Failed to update milestone");

            fetchGoals(); // refresh state
        } catch (err: any) {
            alert(err.message);
        }
    };

    const fetchGoals = async () => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/projects/goal_achiever/goals`,
                { credentials: "include" }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to load goals");
            }

            const data = await res.json();
            setGoals(data.goals);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteGoal = async (goalId: string) => {
        if (!window.confirm("Delete this goal permanently?")) return;

        try {
            const res = await fetch(
                `${BACKEND_URL}/projects/goal_achiever/goals/${goalId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

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

    if (goals.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No goals created yet 🌱
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {goals.map((goal) => (
                <div
                    key={goal.id}
                    className="bg-white rounded-2xl shadow-sm border p-6 space-y-5"
                >
                    {/* Goal Header */}
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {goal.title}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {goal.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(goal.startDate).toDateString()} →{" "}
                                {new Date(goal.endDate).toDateString()}
                            </p>
                        </div>

                        <button
                            onClick={() => deleteGoal(goal.id)}
                            className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                            Delete
                        </button>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-gray-700">
                            Steps
                        </h3>

                        <div className="space-y-3">
                            {goal.milestones.map((m, i) => (
                                <div
                                    key={i}
                                    className="flex gap-4 items-start"
                                >
                                    {/* Timeline dot */}
                                    <div className="mt-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    </div>

                                    <div className="flex-1 rounded-xl border px-4 py-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className={`font-medium text-sm
            ${m.completed ? "line-through text-gray-400" : "text-gray-800"}
        `}>
                                                    {m.title}
                                                </span>

                                                <p className="text-sm text-gray-600 mt-1">
                                                    {m.description}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => toggleMilestone(goal.id, i)}
                                                className={`text-xs px-3 py-1 rounded-full border transition
            ${m.completed
                                                        ? "border-green-300 text-green-700 bg-green-50"
                                                        : "border-gray-300 text-gray-600 hover:bg-gray-50"}
        `}
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
            ))}
        </div>
    );
}
