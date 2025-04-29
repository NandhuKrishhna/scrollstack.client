import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "../redux/api/authApi"
import { ErrorResponse } from "react-router-dom";

const useChangePassword = () => {
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation()
    const handleUpdatePassword = async ({ newPassword, oldPassword }: { newPassword: string, oldPassword: string }) => {
        try {
            const response = await updatePassword({ newPassword, oldPassword }).unwrap();
            toast.success(response.message)
        } catch (error) {
            const err = error as ErrorResponse;
            if (err.data.message) {
                toast.error(err.data.message)
            }
        }
    }
    return {
        handleUpdatePassword,
        isLoading
    }

}
export default useChangePassword