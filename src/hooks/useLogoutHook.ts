import toast from "react-hot-toast";
import { useLazyLogoutQuery } from "../redux/api/authApi";
import { ErrorResponse } from "../types/user.type";
import { useDispatch } from "react-redux";
import { setLogout } from "../redux/slice/userSlice";

export const useLogout = () => {
    const [logout, { isLoading }] = useLazyLogoutQuery();
    const dispatch = useDispatch()
    const handleLogout = async () => {
        try {
            const response = await logout({}).unwrap();
            dispatch(setLogout())
            localStorage.removeItem("accessToken")
            console.log(response)
        } catch (error) {
            const err = error as ErrorResponse
            if (err.data.message) {
                toast.error(err.data.message)
                return;
            }
            toast.error("Something unexpected error happened. Please try it again.")
        }
    }

    return {
        handleLogout,
        isLoading
    }

};

export default useLogout