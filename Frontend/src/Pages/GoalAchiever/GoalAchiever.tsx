import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header.tsx";
import GoalForm from "./Components/GoalForm.tsx";
import GoalsList from "./Components/GoalList.tsx";
import axios from "axios";

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
            } catch (err) {
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
            <Header />

            {/* Top bar */}
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">🎯 Goal Achiever</h1>
                    <p className="text-sm text-gray-600">
                        Welcome back,{" "}
                        <span className="font-medium">{user.username}</span>
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Create Goal */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4">
                                Create New Goal
                            </h2>
                            <GoalForm />
                        </div>
                    </div>

                    {/* Goals List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Your Goals
                            </h2>
                            <GoalsList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
