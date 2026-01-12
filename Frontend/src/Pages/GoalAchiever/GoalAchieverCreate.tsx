import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Checking session...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <GoalCreate />
            </main>
        </div>
    );
}
