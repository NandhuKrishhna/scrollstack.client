import toast from "react-hot-toast";
import { useCreateArticleMutation, } from "../redux/api/articleApi";
import { ErrorResponse } from "../types/user.type";
export interface ArticleProps {
    title: string,
    description: string,
    content: string,
    category: string,
    imageUrl: string,
    tags?: string[]
}

const useCreateArticle = () => {
    const [createArticle, { isLoading }] = useCreateArticleMutation();
    const handleUploardArticle = async (article: ArticleProps) => {
        try {
            const response = await createArticle(article).unwrap();
            toast.success(response.message)
        } catch (error) {
            console.log(error);
            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
                return;
            }
        }
    }
    return {
        handleUploardArticle,
        isLoading
    }
};

export default useCreateArticle;
