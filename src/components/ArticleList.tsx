import ArticleCard from "./ArticleCard"
import ArticleCardSkeleton from "./ArticleCardSkeleton"
import { Article } from "../types/article"

interface ArticleListProps {
    articles: Article[] | null
    isLoading?: boolean
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles?.map((article) => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </div>
    )
}

export default ArticleList
