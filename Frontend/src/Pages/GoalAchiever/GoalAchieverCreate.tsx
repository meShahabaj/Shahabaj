import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoalCreate from "./Components/GoalCreate.tsx";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

interface User {
    id: string;
    username: string;
    email: string;
}

export default function GoalAchiever() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/projects/goal_achiever/me`,
                    { credentials: "include" }
                );

                if (res.status === 401) {
                    navigate("/projects/goal_achiever/login");
                    return;
                }

                const data = await res.json();
                setUser(data.user);
            } catch {
                navigate("/projects/goal_achiever/login");
            } finally {
                setLoading(false);
            }
        }

        loadUser();
    }, [navigate]);

    const handleLogout = async () => {
        await axios.post(
            `${BACKEND_URL}/projects/goal_achiever/logout`,
            {},
            { withCredentials: true }
        );
        window.location.href = "/#/projects/goal_achiever/login";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Checking session...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <Link to="/projects/goal_achiever">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Goal Achiever
                            </h1>
                        </Link>
                        <p className="text-sm text-gray-500">
                            Stay focused. Achieve more.
                        </p>
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
                        >
                            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {user.username}
                            </span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <GoalCreate />
            </main>
        </div>
    );
}
