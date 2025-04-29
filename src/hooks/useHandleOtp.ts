import toast from "react-hot-toast";
import { useOtpVerificationMutation } from "../redux/api/authApi";
import { ErrorResponse, useNavigate } from "react-router-dom";
import { setCredentials, setUserLoggeIn } from "../redux/slice/userSlice";
import { useDispatch } from "react-redux";

const useOtpValidation = () => {
    const [otpVerification, { isLoading }] = useOtpVerificationMutation();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleOtpVerification = async (code: string) => {
        const userString = localStorage.getItem("user");
        if (!userString) {
            toast.error("User information is missing. Please login again.");
            return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;
        try {
            const response = await otpVerification({ code, userId }).unwrap();
            dispatch(setCredentials({ ...user }));
            dispatch(setUserLoggeIn(true))
            toast.success(response.message);
            navigate("/")
        } catch (error) {
            console.log(error);
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
                return;
            }
        }
    };

    return {
        handleOtpVerification,
        isLoading
    }
}
export default useOtpValidation;