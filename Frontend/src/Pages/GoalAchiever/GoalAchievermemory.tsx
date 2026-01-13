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
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow space-y-6">
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
                    <li key={m._id} className="border rounded-xl p-3 bg-gray-50 flex justify-between items-start">
                        <div>
                            {m.category && <p className="text-sm text-gray-500">Category: {m.category}</p>}
                            <p className="font-medium">{m.question}</p>
                            <p className="text-gray-700">{m.answer}</p>
                            <p className="text-xs text-gray-400">Saved at: {new Date(m.createdAt).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(m._id)}
                            className="text-red-600 hover:text-red-800 font-semibold ml-4"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
}
