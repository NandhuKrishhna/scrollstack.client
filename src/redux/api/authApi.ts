import { apiSlice } from "./entryApi";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (data) => ({
                url: "/registration",
                method: "POST",
                body: data,
            }),
        }),
        otpVerification: builder.mutation({
            query: (data) => ({
                url: "/otp-verification",
                method: "POST",
                body: data,
            }),
        }),
        login: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data,
            })
        }),
        logout: builder.query({
            query: () => ({
                url: "/logout",
                method: "GET",
            }),
        }),
        updatePassword: builder.mutation({
            query: (data) => ({
                url: "/change-password",
                method: "POST",
                body: data
            }),
        }),
        uploadProfilePic: builder.mutation({
            query: (data) => ({
                url: "/update-profile",
                method: "POST",
                body: data,
            }),
        }),
    })
});

export const {
    useSignUpMutation,
    useLoginMutation,
    useLazyLogoutQuery,
    useOtpVerificationMutation,
    useUpdatePasswordMutation,
    useUploadProfilePicMutation
} = authApi;