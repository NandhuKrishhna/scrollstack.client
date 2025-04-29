import type React from "react"
import { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import { useSelector } from "react-redux"
import { isSetOtpModelOpen } from "../redux/slice/userSlice"
import OtpForm from "./OtpForm"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    onLogin: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
    const isOtpModalOpen = useSelector(isSetOtpModelOpen);

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">

                {isOtpModalOpen ? (
                    <div className="p-6">
                        <OtpForm onClose={onClose} />
                    </div>
                ) : (
                    <>
                        <div className="flex border-b">
                            <button
                                className={`flex-1 py-3 font-medium text-center ${activeTab === "login" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("login")}
                            >
                                Login
                            </button>
                            <button
                                className={`flex-1 py-3 font-medium text-center ${activeTab === "signup" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                                onClick={() => setActiveTab("signup")}
                            >
                                Sign Up
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === "login" ? (
                                <LoginForm onLogin={onLogin} />
                            ) : (
                                <SignupForm onLogin={onLogin} />
                            )}
                        </div>

                        <div className="bg-gray-50 px-6 py-3 flex justify-end">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500">
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

}

export default AuthModal
