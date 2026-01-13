import { useParams, Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

import GoalAchieverCreate from "./GoalAchieverCreate.tsx"
import GoalAchieverShow from "./GoalAchieverShow.tsx"
import GoalAchieverAnalytics from "./GoalAchieverAnalytics.tsx"
import GoalAchieverProfile from "./GoalAchieverProfile.tsx"
import GoalAchieverMemory from "./GoalAchievermemory.tsx"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string

interface User {
    id: string
    username: string
    email: string
}

export default function GoalAchieverMain() {
    const { type } = useParams<{ type: string }>()
    const navigate = useNavigate()

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch(`${BACKEND_URL}/projects/goal_achiever/me`, {
                    credentials: "include",
                })

                if (res.status === 401) {
                    navigate("/projects/goal_achiever/login")
                    return
                }

                const data = await res.json()
                setUser(data.user)
            } catch {
                navigate("/projects/goal_achiever/login")
            } finally {
                setLoading(false)
            }
        }

        loadUser()
    }, [navigate])

    const navButton = (key: string) =>
        `px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3
     ${type === key
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-[1.03]"
            : "bg-white/60 text-gray-800 hover:bg-white hover:shadow"
        }`

    const handleLogout = async () => {
        await axios.post(
            `${BACKEND_URL}/projects/goal_achiever/logout`,
            {},
            { withCredentials: true }
        )
        window.location.href = "/#/projects/goal_achiever/login"
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-emerald-100">
                <p className="text-gray-700">Checking session...</p>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-emerald-100">
            {/* Header */}
            <header className="bg-white/70 backdrop-blur-md border-b border-white/40 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-white/50"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link to="/projects/goal_achiever/analytics" className="flex flex-col">
                            <span className="text-xl font-semibold text-gray-900">Goal Achiever</span>
                            <span className="text-xs text-gray-600">Stay focused. Achieve more.</span>
                        </Link>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/50"
                        >
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-semibold">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-sm font-medium">{user.username}</span>
                                <span className="text-xs text-gray-600">Account</span>
                            </div>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-white/40 rounded-xl shadow-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-medium">{user.username}</p>
                                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            <div className="flex max-w-7xl mx-auto relative">
                <aside
                    className={`fixed md:relative z-50 top-0 left-0 h-full w-64 backdrop-blur-md border-r  px-4 py-6
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
                >
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <span className="font-semibold">Menu</span>
                        <button onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>

                    {[
                        ["analytics", "Analytics"],
                        ["create_goal", "Create Goal"],
                        ["view_goals", "View Goals"],
                        ["memory", "Memory"],
                        ["profile", "Profile"],
                    ].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => {
                                navigate(`/projects/goal_achiever/${key}`)
                                setSidebarOpen(false)
                            }}
                            className={navButton(key)}
                        >
                            {label}
                        </button>
                    ))}
                </aside>

                <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 min-h-screen">
                    {type === "analytics" && <GoalAchieverAnalytics />}
                    {type === "create_goal" && <GoalAchieverCreate />}
                    {type === "view_goals" && <GoalAchieverShow />}
                    {type === "profile" && <GoalAchieverProfile user={user} />}
                    {type === "memory" && <GoalAchieverMemory />}
                </main>
            </div>
        </div>
    )
}
