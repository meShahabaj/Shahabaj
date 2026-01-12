interface User {
    username: string
    email: string
}

export default function GoalAchieverProfile({ user }: { user: User }) {
    if (!user) {
        return (
            <div className="text-gray-500">
                Loading profile...
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white text-xl font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Profile
                    </h1>
                    <p className="text-sm text-gray-500">
                        Manage your account information
                    </p>
                </div>
            </div>

            {/* Card */}
            <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
                <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-gray-900 font-medium">
                        {user.username}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">
                        {user.email}
                    </p>
                </div>
            </div>
        </div>
    )
}
