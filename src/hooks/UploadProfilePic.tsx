import toast from "react-hot-toast";
import { useUploadProfilePicMutation } from "../redux/api/authApi";
import { ErrorResponse } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfilePicture } from "../redux/slice/userSlice";



const useUploadProfilePicture = () => {
   const [uploardProfilePic, { isLoading }] = useUploadProfilePicMutation();
   const dispatch = useDispatch()
   const uploardProfileHandler = async ({ profilePic }: { profilePic: string }) => {
      console.log(profilePic)
      try {
         const response = await uploardProfilePic({ profilePic }).unwrap();
         dispatch(setProfilePicture(response.profilePicture));
         toast.success("Profile Picture uploaded successfully")
      } catch (error) {
         const err = error as ErrorResponse;
         if (err.data.message) {
            toast.error(err.data.message)
            return
         }
         toast.error("Something went wrong . Please try again")
      }
   }
   return {
      uploardProfileHandler,
      isLoading
   }
}

export default useUploadProfilePicture