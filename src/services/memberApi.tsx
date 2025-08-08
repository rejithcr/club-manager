// src/services/api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: ({memberId}) => `/member?memberId=${memberId}`,
    }),
  }),
});

export const { useGetMembersQuery } = memberApi; 
