import {
    createApi,
    fetchBaseQuery,
    FetchArgs,
    FetchBaseQueryError,
    BaseQueryApi,
    BaseQueryFn,
} from "@reduxjs/toolkit/query/react";

type CustomErrorData = {
    message: string;
    errorCode: string;
};

type CustomError = FetchBaseQueryError & {
    data?: CustomErrorData;
};
const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SOCKET_URL}/auth`,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {
    let result = await baseQuery(args, api, extraOptions);
    const error = result.error as CustomError;

    if (error?.status === 401 && error?.data?.errorCode === "InvalidAccessToken") {
        const refreshResult = await baseQuery("/refresh", api, extraOptions);
        if (refreshResult.data) {
            const newAccessToken = (refreshResult.data as { accessToken: string }).accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            // TODO 1 
            // api.dispatch(setLogout());
        }
    }
    if (error?.status === 401 && error?.data?.errorCode === "AccountSuspended") {
        // TODO 2
        //   api.dispatch(setLogout());
    }

    return result;
};
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "users",
        "artciles"
    ],
    keepUnusedDataFor: 60,
    endpoints: () => ({}),
});