import { useParams } from 'react-router-dom'
import GoalAchieverCreate from './GoalAchieverCreate.tsx'
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import GoalAchieverShow from './GoalAchieverShow.tsx'
import GoalAchieverProfile from './GoalAchieverProfile.tsx'
import GoalAchieverAnalytics from './GoalAchieverAnalytics.tsx'

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

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/projects/goal_achiever/me`,
                    { credentials: "include" }
                )

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
        `px-4 py-3 rounded-lg text-left font-medium transition
   ${type === key
            ? 'bg-blue-600 text-white shadow'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Checking session...</p>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

                    {/* Brand */}
                    <Link
                        to="/projects/goal_achiever"
                        className="flex flex-col hover:opacity-90 transition"
                    >
                        <span className="text-xl font-semibold text-gray-900 tracking-tight">
                            Goal Achiever
                        </span>
                        <span className="text-xs text-gray-500">
                            Stay focused. Achieve more.
                        </span>
                    </Link>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {/* Avatar */}
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                            </div>

                            {/* Name */}
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-sm font-medium text-gray-800 leading-tight">
                                    {user.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Account
                                </span>
                            </div>

                            {/* Chevron */}
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border shadow-lg overflow-hidden">
                                <div className="px-4 py-3 border-b">
                                    <p className="text-sm font-medium text-gray-800">
                                        {user.username}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>


            {/* Main Layout */}
            <div className="flex max-w-7xl mx-auto">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r px-4 py-6 flex flex-col gap-2">
                    <button
                        onClick={() => navigate('/projects/goal_achiever/analytics')}
                        className={navButton('analytics')}
                    >
                        Analytics
                    </button>

                    <button
                        onClick={() => navigate('/projects/goal_achiever/create_goal')}
                        className={navButton('create_goal')}
                    >
                        Create Goal
                    </button>

                    <button
                        onClick={() => navigate('/projects/goal_achiever/view_goals')}
                        className={navButton('view_goals')}
                    >
                        View Goals
                    </button>

                    <button
                        onClick={() => navigate('/projects/goal_achiever/profile')}
                        className={navButton('profile')}
                    >
                        Profile
                    </button>
                </aside>


                {/* Content */}
                <main className="flex-1 p-6">
                    <div>
                        {type === 'analytics' && <GoalAchieverAnalytics />}
                        {type === 'create_goal' && <GoalAchieverCreate />}
                        {type === 'view_goals' && <GoalAchieverShow />}
                        {type === 'profile' && <GoalAchieverProfile user={user} />}
                    </div>
                </main>
            </div>
        </div>
    )
}
