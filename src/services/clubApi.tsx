import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { getAttendanceReport } from "../helpers/events_helper";

export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["club", "member", "event", "attendance", "memberAttribute"],
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
    getClubMemberAttributes: builder.query({
      query: (params) => `/club/member/attribute?${new URLSearchParams(params).toString()}`,
      providesTags: ["memberAttribute"]
    }),    
    getClubMemberReportableAttributes: builder.query({
      query: (params) => `/club/report/memberattribute?${new URLSearchParams(params).toString()}`,
      providesTags: ["memberAttribute"]
    }),
    getClubMemberAttributesReport: builder.query({
      query: (params) => `/club/report/memberattribute?${new URLSearchParams(params).toString()}`,
      providesTags: ["memberAttribute"]
    }),
    addClubMemberAttribute: builder.mutation({
      query: (body) => ({
        url: "/club/member/attribute",
        method: "POST",
        body,
      }),
      invalidatesTags: ["memberAttribute"]
    }),
    deleteClubMemberAttribute: builder.mutation({
      query: (body) => ({
        url: "/club/member/attribute",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["memberAttribute"]
    }),
    saveClubMemberAttributes: builder.mutation({
      query: (body) => ({
        url: "/club/member/attribute",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["memberAttribute"]
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
    updateMember: builder.mutation({
      query: (body) => ({
        url: "/club/member",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["member"],
    }),
    removeMember: builder.mutation({
      query: (body) => ({
        url: "/club/member",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["member"],
    }),
    requestMembership: builder.mutation({
      query: (body) => ({
        url: "/club/member/request",
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
  useLazyGetClubQuery,
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
  useGetClubMemberAttributesQuery,
  useSaveClubMemberAttributesMutation,
  useUpdateMemberMutation,
  useRequestMembershipMutation,
  useGetClubMemberReportableAttributesQuery,
  useLazyGetClubMemberAttributesReportQuery,
  useAddClubMemberAttributeMutation,
  useDeleteClubMemberAttributeMutation,
  useRemoveMemberMutation
} = clubApi;
