import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["member"],
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: (params) => `/member?${new URLSearchParams(params).toString()}`,
      providesTags: ["member"],
    }),
    getUpcomingBirthdays: builder.query({
      query: (params) => `/member?${new URLSearchParams({...params, upcomingBirthdays: 'true'}).toString()}`,
      providesTags: ["member"],
    }),
    updateMember: builder.mutation({
      query: (body) => ({
        url: "/member",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["member"],
    }),
    addMember: builder.mutation({
      query: (body) => ({
        url: "/member",
        method: "POST",
        body,
      }),
      invalidatesTags: ["member"],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useLazyGetMembersQuery,
  useGetUpcomingBirthdaysQuery,
  useLazyGetUpcomingBirthdaysQuery,
  useUpdateMemberMutation,
  useAddMemberMutation,
} = memberApi;
