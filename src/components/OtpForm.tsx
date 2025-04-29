import type React from "react";
import { useState } from "react";
import { Loader } from "lucide-react";
import useOtpValidation from "../hooks/useHandleOtp";


interface Props {
    onClose: () => void
}

const OtpForm: React.FC<Props> = ({ onClose }) => {
    const [otp, setOtp] = useState("");
    const [errors, setErrors] = useState<string | null>(null);
    const { handleOtpVerification, isLoading } = useOtpValidation(onClose);


    const validateForm = (): boolean => {
        if (!otp) {
            setErrors("OTP code is required");
            return false;
        } else if (otp.length !== 6) {
            setErrors("OTP must be 6 digits");
            return false;
        }
        setErrors(null);
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            await handleOtpVerification(otp);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg shadow-md">
            <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                </label>
                <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md ${errors ? "border-red-500" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                />
                {errors && <p className="mt-1 text-sm text-red-500">{errors}</p>}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    {isLoading ? <Loader className="animate-spin" size={15} /> : "Verify OTP"}
                </button>
            </div>
        </form>
    );
};

export default OtpForm;
