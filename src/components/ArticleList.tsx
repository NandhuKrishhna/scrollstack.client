import type React from "react"
import ArticleCard from "./ArticleCard"
import { Article } from "../types/article"

interface ArticleListProps {
    articles: Article[]
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    console.log("afd", articles)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </div>
    )
}

export default ArticleList
