import React from "react"

const ArticleCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="relative h-48 bg-gray-200">
                <div className="absolute top-0 left-0 bg-gray-300 h-6 w-24 rounded-br-lg" />
            </div>

            <div className="p-5 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />

                <div className="flex items-center mt-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                    <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-1" />
                        <div className="h-3 bg-gray-300 rounded w-20" />
                    </div>
                </div>

                <div className="h-4 bg-gray-300 rounded w-16 mt-4" />
            </div>
        </div>
    )
}

export default ArticleCardSkeleton
