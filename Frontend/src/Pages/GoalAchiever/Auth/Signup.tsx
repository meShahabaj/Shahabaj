import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL as string;

type Step = "signup" | "otp";

const RESEND_COOLDOWN = 60;

const SignupWithOTP: React.FC = () => {
    const [step, setStep] = useState<Step>("signup");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otp, setOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate()

    useEffect(() => {
        async function loadUser() {
                const res = await fetch(
                    `${BACKEND_URL}/projects/goal_achiever/me`,
                    { credentials: "include" }
                )

                if (res.status === 401) {
                    navigate("/projects/goal_achiever/login")
                    return
                }

                const data = await res.json()
                if(data.user){
                    navigate("/projects/goal_achiever/analytics")
            }
            
        }

        loadUser()
    }, [navigate])
    /* ---------------- Timer ---------------- */
    useEffect(() => {

        if (!resendTimer) return;
        const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);

    /* ---------------- Handlers ---------------- */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    /* ---------------- Signup ---------------- */
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${BACKEND_URL}/projects/goal_achiever/signup`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: formData.username.trim(),
                        email: formData.email.toLowerCase().trim(),
                        password: formData.password,
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.message);

            setStep("otp");
            setSuccess("We’ve sent a 6-digit OTP to your email.");
            setResendTimer(RESEND_COOLDOWN);
        } catch (err: any) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- Verify OTP ---------------- */
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            return setError("OTP must be 6 digits");
        }

        try {
            setOtpLoading(true);

            const res = await fetch(
                `${BACKEND_URL}/projects/goal_achiever/verify-otp`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        otp,
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.message);

            setSuccess("Account verified successfully 🎉");
            setTimeout(() => (window.location.href = "/#/projects/goal_achiever/analytics"), 1500);
        } catch (err: any) {
            setError(err.message || "Invalid OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    /* ---------------- Resend OTP ---------------- */
    const handleResendOtp = async () => {
        setError("");
        setSuccess("");

        try {
            setResendLoading(true);

            const res = await fetch(
                `${BACKEND_URL}/projects/goal_achiever/resend-otp?email=${formData.email}&purpose=signup`,
                { method: "POST" }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.message);

            setSuccess("OTP resent successfully.");
            setResendTimer(RESEND_COOLDOWN);
        } catch (err: any) {
            setError(err.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative min-h-screen flex items-center justify-left overflow-hidden">
            {/* Video Background */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="/Data/bg-video.mp4"
                autoPlay
                loop
                muted
            />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-center mb-2">
                    Goal Achiever
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    {step === "signup"
                        ? "Create your account"
                        : "Verify your email"}
                </p>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        {success}
                    </div>
                )}

                {step === "signup" && (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <input
                            name="username"
                            placeholder="Username"
                            required
                            onChange={handleChange}
                            className="input"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            required
                            onChange={handleChange}
                            className="input"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            onChange={handleChange}
                            className="input"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            required
                            onChange={handleChange}
                            className="input"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? "Sending OTP..." : "Create Account"}
                        </button>
                    </form>
                )}

                {step === "otp" && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <p className="text-sm text-center text-gray-600">
                            OTP sent to <strong>{formData.email}</strong>
                        </p>

                        <input
                            value={otp}
                            maxLength={6}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            className="input text-center tracking-widest text-lg"
                        />

                        <button
                            type="submit"
                            disabled={otpLoading}
                            className="btn-success"
                        >
                            {otpLoading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            disabled={resendTimer > 0 || resendLoading}
                            onClick={handleResendOtp}
                            className="text-sm text-blue-600 hover:underline w-full"
                        >
                            {resendTimer > 0
                                ? `Resend in ${resendTimer}s`
                                : resendLoading
                                    ? "Resending..."
                                    : "Resend OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep("signup")}
                            className="text-sm text-gray-500 hover:underline w-full"
                        >
                            Change email
                        </button>
                    </form>
                )}
            </div>

            {/* Tailwind shortcuts */}
            <style>{`
                .input {
                    width: 100%;
                    padding: 0.6rem 1rem;
                    border-radius: 0.75rem;
                    border: 1px solid #d1d5db;
                    outline: none;
                }
                .input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 1px #6366f1;
                }
                .btn-primary {
                    width: 100%;
                    padding: 0.6rem;
                    background: #4f46e5;
                    color: white;
                    border-radius: 0.75rem;
                    font-weight: 600;
                }
                .btn-success {
                    width: 100%;
                    padding: 0.6rem;
                    background: #16a34a;
                    color: white;
                    border-radius: 0.75rem;
                    font-weight: 600;
                }
                button:disabled {
                    opacity: 0.6;
                }
            `}</style>
        </div>
    );
};

export default SignupWithOTP;
