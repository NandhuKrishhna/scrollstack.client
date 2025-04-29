import { ErrorResponse } from "react-router-dom";
import { useLikeArticleMutation } from "../redux/api/articleApi";
import toast from "react-hot-toast";
import React from "react";

const useLikeArticke = () => {
    const [likeArticle, { isLoading }] = useLikeArticleMutation();

    const handleLikeArticle = async (
        id: string,
        setLikes: React.Dispatch<React.SetStateAction<number>>,
        setIsLiked: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        try {
            await likeArticle({ articleId: id }).unwrap();
        } catch (error) {
            // Rollback both like count and UI toggle
            setLikes(prev => prev - 1);
            setIsLiked(false);

            const err = error as ErrorResponse;
            if (err.data?.message) {
                toast.error(err.data.message);
            }
        }
    };

    return {
        handleLikeArticle,
        isLoading
    };
};
export default useLikeArticke