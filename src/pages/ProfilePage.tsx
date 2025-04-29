import type React from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { currentUser, isUserLoggedIn } from "../redux/slice/userSlice"
import Header from "../components/Header"
import useChangePassword from "../hooks/useChangPassword"
import { Loader } from "lucide-react"
import useUploadProfilePicture from "../hooks/UploadProfilePic"

const ProfilePage: React.FC = () => {
    const isLoggedIn = useSelector(isUserLoggedIn)
    const user = useSelector(currentUser)

    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile")
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const { handleUpdatePassword, isLoading } = useChangePassword()
    const { uploardProfileHandler, isLoading: isProfileUploading } = useUploadProfilePicture()
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("All fields are required")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match")
            return
        }
        handleUpdatePassword({ newPassword: newPassword, oldPassword: currentPassword })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result as string;
            setSelectedImg(base64Image);
            uploardProfileHandler({ profilePic: base64Image })
        };
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                            Login
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>

                <div className="max-w-4xl mx-auto">

                    <div className="flex mb-6 border-b">
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === "profile"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                            onClick={() => setActiveTab("profile")}
                        >
                            Profile Information
                        </button>
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === "security"
                                ? "border-b-2 border-blue-600 text-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                            onClick={() => setActiveTab("security")}
                        >
                            Security
                        </button>
                    </div>

                    {activeTab === "profile" && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold">Profile Information</h2>
                                <p className="text-gray-600 text-sm">View and manage your personal information</p>
                            </div>

                            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 mb-6">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                        <img
                                            src={selectedImg || user?.profilePicture || "/placeholder.svg"}
                                            alt={user?.name || "User"}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={isProfileUploading}
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </label>
                                </div>


                            </div>

                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="name" className="text-right font-medium text-gray-700">
                                        Name
                                    </label>
                                    <div className="col-span-3">
                                        <input
                                            id="name"
                                            type="text"
                                            value={user?.name || ""}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="email" className="text-right font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="col-span-3">
                                        <input
                                            id="email"
                                            type="email"
                                            value={user?.email || ""}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold">Change Password</h2>
                                <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 text-red-700">
                                    <div className="flex">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div className="grid gap-2">
                                    <label htmlFor="current-password" className="font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="new-password" className="font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="confirm-password" className="font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-2 px-4 rounded font-medium text-white flex items-center justify-center ${isLoading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 transition-colors"
                                        }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader className="animate-spin" size={20} />
                                        </span>
                                    ) : (
                                        "Update Password"
                                    )}
                                </button>

                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default ProfilePage
