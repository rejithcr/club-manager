import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["member", "notificationCount"],
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: (params) => `/member?${new URLSearchParams(params).toString()}`,
      providesTags: ["member"],
    }),
    getUpcomingBirthdays: builder.query({
      query: (params) => `/member?${new URLSearchParams({ ...params, upcomingBirthdays: 'true' }).toString()}`,
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
    getNotifications: builder.query({
      query: (params) => `/member?${new URLSearchParams({ ...params, notifications: 'true' }).toString()}`,
      providesTags: ["notificationCount"],
    }),
    getUnreadNotificationCount: builder.query({
      query: (params) => `/member?${new URLSearchParams({ ...params, unreadCount: 'true' }).toString()}`,
      providesTags: ["notificationCount"],
    }),
    markNotificationAsRead: builder.mutation({
      query: (body) => ({
        url: "/member",
        method: "PUT",
        body: {
          notificationIds: body.notificationIds,
          notificationId: body.notificationId,
          markAsRead: 'true'
        },
      }),
      invalidatesTags: ["notificationCount"],
    }),
    sendNotification: builder.mutation({
      query: (body) => ({
        url: "/member",
        method: "POST",
        body: {
          ...body,
          sendNotification: 'true'
        },
      }),
    }),
    registerPushToken: builder.mutation({
      query: (body) => ({
        url: "/member",
        method: "POST",
        body: {
          ...body,
          registerPushToken: 'true'
        },
      }),
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
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useMarkNotificationAsReadMutation,
  useSendNotificationMutation,
  useRegisterPushTokenMutation,
} = memberApi;
