import { useGetAllArtcilesQuery } from "../redux/api/articleApi"
import ArticleList from "./ArticleList"
import Header from "./Header"
import ArticleCardSkeleton from "./ArticleCardSkeleton"

const HomePage = () => {
    const { data: articles, error, isLoading } = useGetAllArtcilesQuery({});

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Article Feeds</h1>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <ArticleCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">Error fetching articles</div>
                ) : !articles || articles.data.length === 0 ? (
                    <div className="text-center text-gray-500">No articles found</div>
                ) : (
                    <ArticleList articles={articles.data} />
                )}
            </main>
        </div>
    );
}

export default HomePage;
