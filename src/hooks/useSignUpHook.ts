import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../redux/api/authApi";
import { AuthFormInputs, ErrorResponse } from "../types/user.type";
import toast from "react-hot-toast";


const useSignUp = () => {
    const [signUp, { isLoading }] = useSignUpMutation();
    const navigate = useNavigate()
    const handleSignUp = async (credentials: AuthFormInputs) => {

        try {
            const response = await signUp(credentials).unwrap();
            toast.success(response.message)
            console.log(response)
            localStorage.setItem("user", JSON.stringify(response.response));
            navigate('/otp')
        } catch (error) {
            console.log(error);
            const err = error as ErrorResponse;
            if (err.data.message) {
                toast.error(err.data.message)
                return
            }
            toast.error("Something unexpected error happened. Please try it again.")
        }
    }
    return {
        handleSignUp,
        isLoading

    }

};

export default useSignUp;
