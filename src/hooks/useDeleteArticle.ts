import toast from "react-hot-toast";
import { useDeleteArticleMutation } from "../redux/api/articleApi"
import { ErrorResponse } from "../types/user.type";
import { useState } from "react";

const useDeleteArticle = () => {
    const [deleteArticle] = useDeleteArticleMutation();
    const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({});
    const handleDeleteArticle = async (id: string) => {
        setLoadingItems((prev) => ({ ...prev, [id]: true }));
        try {
            const response = await deleteArticle(id).unwrap();
            toast.success(response.message)
        } catch (error) {
            console.log(error)
            const err = error as ErrorResponse;
            if (err.data.message) {
                toast.error(err.data.message)
                return
            }
        }
        finally {
            setLoadingItems((prev) => ({ ...prev, [id]: false }));
        }
    }
    return {
        loadingItems,
        handleDeleteArticle
    }
};


export default useDeleteArticle;