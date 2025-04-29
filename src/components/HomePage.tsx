import { useGetAllArtcilesQuery } from "../redux/api/articleApi"

import ArticleList from "./ArticleList"
import Header from "./Header"

const HomePage = () => {
    const { data: articles, error, isLoading } = useGetAllArtcilesQuery({});

    console.log('Articles:', articles);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching articles</div>;
    }

    if (!articles) {
        return <div>No articles found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Article Feeds</h1>

                {articles?.data ? (
                    <ArticleList articles={articles.data} />
                ) : (
                    <div>No articles available</div>
                )}
            </main>
        </div>
    );

}

export default HomePage
