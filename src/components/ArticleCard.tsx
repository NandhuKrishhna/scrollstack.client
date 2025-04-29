import type React from "react"
import { useState, useEffect } from "react"
import { Article } from "../types/article"
import { useSelector } from "react-redux"
import { isUserLoggedIn, currentUser } from "../redux/slice/userSlice"
import useLikeArticle from "../hooks/useLikeArticles"
import useDisLikeArticle from "../hooks/useDisLikeArticle"
import toast from "react-hot-toast"

interface ArticleCardProps {
    article: Article
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const [likes, setLikes] = useState(article.likes)
    const [isLiked, setIsLiked] = useState(false)

    const isLoggedIn = useSelector(isUserLoggedIn)
    const user = useSelector(currentUser)

    const { handleLikeArticle } = useLikeArticle()
    const { handleDisLikeArticle } = useDisLikeArticle()

    useEffect(() => {
        if (user && article.likedBy.includes(user._id)) {
            setIsLiked(true)
        }
    }, [user, article.likedBy])

    const handleLike = async (id: string) => {
        if (!isLoggedIn) {
            toast.error("Please login to like the article")
            return
        }

        if (isLiked) {
            await handleDisLikeArticle(id, setLikes, setIsLiked);

            setLikes(prev => prev - 1)
        } else {
            await handleLikeArticle(id, setLikes, setIsLiked);
            setLikes(prev => prev + 1)
        }

        setIsLiked(!isLiked)
    }

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden">
                <img src={article.imageUrl || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-br-lg">{article.category}</div>
            </div>

            <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{article.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.content}</p>

                <div className="flex items-center mb-4">
                    <img
                        src={article.author.profilePicture || "/placeholder.svg"}
                        alt={article.author.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                        <p className="font-medium text-gray-800">{article.author.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(article.createdAt)}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => handleLike(article._id)}
                        className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"} hover:text-red-500 transition-colors`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill={isLiked ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span>{likes}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArticleCard
