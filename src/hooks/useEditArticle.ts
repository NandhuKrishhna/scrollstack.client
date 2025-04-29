import toast from "react-hot-toast";
import { ErrorResponse } from "../types/user.type";
import { useEditArticleMutation } from "../redux/api/articleApi";
import { Article } from "../types/article";

const useEditArticle = () => {
    const [editArticle, { isLoading }] = useEditArticleMutation();
    const handleEditArticle = async ({ id, articleData }: { id: string; articleData: Partial<Article> }) => {
        try {
            const response = await editArticle({ id, articleData }).unwrap();
            toast.success(response.message)
        } catch (error) {
            console.log(error)
            const err = error as ErrorResponse;
            if (err.data.message) {
                toast.error(err.data.message)
                return
            }
        }
    }
    return {
        isLoading,
        handleEditArticle
    }
};


export default useEditArticle;