import { apiSlice } from "./entryApi";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addPreferences: builder.mutation({
            query: (data) => ({
                url: "/add-preference",
                method: "POST",
                body: data,
            }),
        }),
        createArticle: builder.mutation({
            query: (data) => ({
                url: "/create-article",
                method: "POST",
                body: data,
            }),
        }),
        getAllArtciles: builder.query({
            query: () => ({
                url: "/get-all-articles",
                method: "GET",
            }),
        }),
        getUserArticles: builder.query({
            query: (params) => {
                const {
                    id,
                    search = "",
                    sortBy = "createdAt",
                    order = "desc",
                    page = 1,
                    limit = 10,
                    category = "",
                } = typeof params === "object" ? params : { id: params }


                const queryParams = new URLSearchParams()
                if (search) queryParams.append("search", search)
                if (sortBy) queryParams.append("sortBy", sortBy)
                if (order) queryParams.append("order", order)
                if (page) queryParams.append("page", page.toString())
                if (limit) queryParams.append("limit", limit.toString())
                if (category) queryParams.append("category", category)

                const queryString = queryParams.toString()

                return {
                    url: `/get-articles/${id}${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                }
            },
        }),
        editArticle: builder.mutation({
            query: (data) => ({
                url: "/edit-article",
                method: "PATCH",
                body: data,
            }),
        }),
        deleteArticle: builder.mutation({
            query: (id) => ({
                url: `/delete-article/${id}`,
                method: "DELETE",
            }),
        }),

        likeArticle: builder.mutation({
            query: (data) => ({
                url: "/like-article",
                method: "POST",
                body: data,
            }),
        }),
        disLikeArticle: builder.mutation({
            query: (data) => ({
                url: "/disLike-article",
                method: "POST",
                body: data,
            }),
        }),

    })
});

export const {
    useAddPreferencesMutation,
    useCreateArticleMutation,
    useDeleteArticleMutation,
    useEditArticleMutation,
    useGetAllArtcilesQuery,
    useGetUserArticlesQuery,
    useLikeArticleMutation,
    useDisLikeArticleMutation
} = authApi