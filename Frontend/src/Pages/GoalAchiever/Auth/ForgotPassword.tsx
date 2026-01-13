import { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${BACKEND_URL}/projects/goal_achiever/forgot-password`,
                { email }
            );

            if (response.data.success) {
                setMessage("OTP sent to your email. Please check your inbox.");
            } else {
                setError("Failed to send OTP. Please try again.");
            }
        } catch (err: any) {
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
                {message && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{message}</div>}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="mt-4 text-center text-gray-600">
                    <a href="/#/projects/goal_achiever/login" className="text-blue-500 hover:underline">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
