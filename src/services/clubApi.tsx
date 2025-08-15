import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { getAttendanceReport } from "../helpers/events_helper";

export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["club", "member", "event", "attendance"],
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
    getClubEventTypes: builder.query({
      query: (params) => `/club/event/types?${new URLSearchParams(params).toString()}`,
    }),
    getAttendanceReport: builder.query({
      query: (params) => `/club/event/attendance?${new URLSearchParams(params).toString()}`,
      providesTags: ["attendance"],
    }),
    updateEventAttendance: builder.mutation({
      query: (body) => ({
        url: "/club/event/attendance",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["attendance"],
    }),
    addEvent: builder.mutation({
      query: (body) => ({
        url: "/club/event",
        method: "POST",
        body,
      }),
      invalidatesTags: ["event"],
    }),
    deleteEvent: builder.mutation({
      query: (body) => ({
        url: "/club/event",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["event"],
    }),
    updateEvent: builder.mutation({
      query: (body) => ({
        url: "/club/event",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["event"],
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
  useGetClubEventTypesQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useLazyGetAttendanceReportQuery,
  useUpdateEventAttendanceMutation,
  useDeleteEventMutation,
} = clubApi;
