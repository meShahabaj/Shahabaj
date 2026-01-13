import { useState, useEffect, FormEvent } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

interface Memory {
    _id: string;
    question: string;
    answer: string;
    category?: string;
    createdAt: string;
}

export default function GoalAchieverMemory() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [memories, setMemories] = useState<Memory[]>([]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");


    // Fetch all saved memories
    const fetchMemories = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/memories`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch memories");

            const data = await res.json();
            setMemories(data.memories || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!question.trim() || !answer.trim()) return;

        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/save_answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ question, answer }),
            });

            if (!res.ok) throw new Error("Failed to save memory");

            setSuccessMsg("Memory saved successfully!");
            setQuestion("");
            setAnswer("");
            fetchMemories(); // refresh the list
        } catch (err) {
            console.error(err);
            setSuccessMsg("Error saving memory.");
        }
    };
    const handleUpdate = async (id: string) => {
        const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/memories/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                question: editQuestion,
                answer: editAnswer
            }),
        });

        if (!res.ok) {
            alert("Failed to update memory");
            return;
        }

        setEditingId(null);
        fetchMemories();
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/memories/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete memory");

            // Refresh the list
            setMemories(memories.filter((m) => m._id !== id));
        } catch (err) {
            console.error(err);
            alert("Error deleting memory.");
        }
    };


    return (
        <div className="max-w-md mx-auto p-6 space-y-6">
            <h2 className="text-xl font-semibold">Add Memory</h2>
            {successMsg && <p className="text-green-600">{successMsg}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Question */}
                <div>
                    <label className="block mb-1 font-medium">Question / Key</label>
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., Highest education?"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Answer */}
                <div>
                    <label className="block mb-1 font-medium">Answer / Value</label>
                    <input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="e.g., Bachelor's in CS"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Save Memory
                </button>
            </form>

            {/* ---------- Display Saved Memories ---------- */}
            <ul className="space-y-3">
                {memories.map((m) => (
                    <li key={m._id} className="border rounded-xl p-3 bg-gray-50">
                        {editingId === m._id ? (
                            <div className="space-y-2">
                                <input
                                    value={editQuestion}
                                    onChange={(e) => setEditQuestion(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />
                                <input
                                    value={editAnswer}
                                    onChange={(e) => setEditAnswer(e.target.value)}
                                    className="w-full border rounded px-2 py-1"
                                />

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdate(m._id)}
                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-3 py-1 bg-gray-300 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{m.question}</p>
                                    <p>{m.answer}</p>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditingId(m._id);
                                            setEditQuestion(m.question);
                                            setEditAnswer(m.answer);
                                        }}
                                        className="text-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(m._id)}
                                        className="text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}

            </ul>

        </div>
    );
}
