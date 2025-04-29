
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../redux/api/authApi';
import { AuthLoginData, ErrorResponse } from '../types/user.type';
import toast from 'react-hot-toast';
import { setCredentials, setUserLoggeIn } from '../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (credentials: AuthLoginData) => {
        try {
            const response = await login(credentials).unwrap()
            dispatch(setCredentials(response.response));
            dispatch(setUserLoggeIn(true))
            localStorage.setItem("accessToken", response.response.accessToken)
            toast.success(response.message || "Login successfull")
            console.log("Response from the login handler", response)
            navigate("/")

        } catch (error) {
            console.log(error)
            const err = error as ErrorResponse;
            if (err.data.message) {
                toast.error(err.data.message)
                return
            }
        }
    };

    return {
        handleLogin,
        isLoading
    }


};