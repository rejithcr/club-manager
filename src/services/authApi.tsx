import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    authenticateMember: builder.mutation({
      query: (body) => ({
        url: '/auth',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useAuthenticateMemberMutation } = authApi;
