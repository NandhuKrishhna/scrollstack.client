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
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

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

    const openArticleModal = () => {
        setIsViewModalOpen(true)
    }

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                onClick={openArticleModal}
            >
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
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click event
                                handleLike(article._id);
                            }}
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

            {/* Article View Modal */}
            {isViewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Article Details</h3>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {article.imageUrl && (
                                <div className="mb-6">
                                    <img
                                        src={article.imageUrl || "/placeholder.svg"}
                                        alt={article.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{article.title}</h2>
                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                                        {article.category}
                                    </span>
                                    <span>{formatDate(article.createdAt)}</span>
                                    <span className="flex items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
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
                                        {likes}
                                    </span>
                                </div>

                                <div className="flex items-center mb-6">
                                    <img
                                        src={article.author.profilePicture || "/placeholder.svg"}
                                        alt={article.author.name}
                                        className="w-12 h-12 rounded-full mr-4 object-cover"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{article.author.name}</p>
                                        <p className="text-sm text-gray-500">{formatDate(article.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-700">{article.description}</p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-900 mb-2">Content</h3>
                                    <div className="prose max-w-none text-gray-700">{article.content}</div>
                                </div>

                                {article.tags && article.tags.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between pt-4 border-t">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(article._id);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md ${isLiked
                                        ? "bg-red-100 text-red-600"
                                        : "bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600"
                                        } transition-colors`}
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
                                    {isLiked ? "Liked" : "Like"}
                                </button>

                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ArticleCard