const BelowComponents = () => {
    return (
        <section className="mt-10 w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col justify-center py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-lg text-slate-700  max-w-3xl mx-auto">
                        Analyze and improve your resume with AI, completely free and privacy-friendly. No signup required, and your data is never stored.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Feature Cards */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">🤖</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">AI Resume Scoring</h3>
                        <p className="text-sm text-slate-700 ">Get detailed scoring and feedback for every section of your resume instantly.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">🎯</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">Role-specific Analysis</h3>
                        <p className="text-sm text-slate-700 ">Tailor your resume to match specific job roles for better alignment.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">⚡</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">Instant Suggestions</h3>
                        <p className="text-sm text-slate-700 ">Highlight issues and get actionable improvement tips immediately.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">📄</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">Resume Preview</h3>
                        <p className="text-sm text-slate-700 ">View your uploaded resume directly without leaving the page.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">🔒</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">No Signup Required</h3>
                        <p className="text-sm text-slate-700 ">Start analyzing your resume immediately without creating an account.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">🗑️</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">No Data Saved</h3>
                        <p className="text-sm text-slate-700 ">Your uploaded resumes are processed in-memory and never stored on our servers.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">⚙️</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">Custom Job Roles</h3>
                        <p className="text-sm text-slate-700 ">Select any role to analyze your resume against specific job requirements.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center text-center">
                        <div className="text-indigo-600 text-4xl mb-4">🌐</div>
                        <h3 className="font-bold text-lg mb-2 text-slate-900 ">Fully Free & Accessible</h3>
                        <p className="text-sm text-slate-700 ">Use it on any device, anytime, without any hidden costs or subscriptions.</p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default BelowComponents;