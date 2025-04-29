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
            query: (id) => ({
                url: `/get-articles/${id}`,
                method: "GET",
            }),
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