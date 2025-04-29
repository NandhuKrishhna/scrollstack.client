import { ErrorResponse } from "react-router-dom";
import { useDisLikeArticleMutation } from "../redux/api/articleApi";
import toast from "react-hot-toast";

const useDisLikeArticle = () => {
    const [disLikeArticle, { isLoading }] = useDisLikeArticleMutation();

    const handleDisLikeArticle = async (
        id: string,
        setLikes: React.Dispatch<React.SetStateAction<number>>,
        setIsLiked: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        try {
            await disLikeArticle({ articleId: id }).unwrap();
        } catch (error) {
            // Rollback changes
            setLikes(prev => prev + 1);
            setIsLiked(true);

            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }
        }
    };

    return {
        handleDisLikeArticle,
        isLoading
    };
};

export default useDisLikeArticle;
