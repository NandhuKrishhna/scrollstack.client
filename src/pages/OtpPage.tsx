import React, { useState, useRef, useEffect } from "react"
import Header from "../components/Header"
import useOtpValidation from "../hooks/useHandleOtp"
import { Loader } from "lucide-react"

const OtpPage: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
    const [error, setError] = useState("")
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const { handleOtpVerification, isLoading } = useOtpValidation()

    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6)
    }, [])

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.substring(0, 1)
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").trim()
        if (!/^\d+$/.test(pastedData)) return

        const digits = pastedData.substring(0, 6).split("")
        const newOtp = [...otp]
        digits.forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit
        })
        setOtp(newOtp)

        const nextEmptyIndex = newOtp.findIndex((val) => !val)
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus()
        } else {
            inputRefs.current[5]?.focus()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.some((digit) => !digit)) {
            setError("Please enter the complete OTP")
            return
        }
        handleOtpVerification(otp.join(""));


    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Header /> {/* ✅ Header added here */}
            <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Verify your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We've sent a verification code to your email
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-6 gap-2 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    aria-label={`Digit ${index + 1}`}
                                    className="w-full h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                />

                            ))}
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {isLoading ? <Loader className="animate-spin" size={20} /> : "Verify"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default OtpPage
