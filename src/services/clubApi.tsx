import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["club", "member", "event"],
  endpoints: (builder) => ({
    getClub: builder.query({
      query: (params) => `/club?${new URLSearchParams(params).toString()}`,
      providesTags: ["club"],
    }),
    getClubMembers: builder.query({
      query: (params) => `/club/member?${new URLSearchParams(params).toString()}`,
      providesTags: ["member"],
    }),
    getClubEvents: builder.query({
      query: (params) => `/club/event?${new URLSearchParams(params).toString()}`,
      providesTags: ["event"],
    }),
    addMember: builder.mutation({
      query: (body) => ({
        url: "/club/member",
        method: "POST",
        body,
      }),
      invalidatesTags: ["member"],
    }),
    addClub: builder.mutation({
      query: (body) => ({
        url: "/club",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetClubQuery,
  useGetClubMembersQuery,
  useGetClubEventsQuery,
  useLazyGetClubEventsQuery,
  useAddMemberMutation,
  useAddClubMutation,
} = clubApi;
