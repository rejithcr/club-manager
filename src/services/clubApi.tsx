// src/services/api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const clubApi = createApi({
  reducerPath: "clubApi",
  baseQuery: baseQueryWithReauth,
  tagTypes:['club','member','event'],
  endpoints: (builder) => ({    
    getClub: builder.query({
      query: (params) => `/club?${new URLSearchParams(params).toString()}`,
    }),
    getClubMembers: builder.query({
      query: (params) => `/club/member?${new URLSearchParams(params).toString()}`,
    }),
    getClubEvents: builder.query({
      query: (params) => `/club/event?${new URLSearchParams(params).toString()}`,
    }),
  }),
});

export const { useGetClubQuery, useGetClubMembersQuery, useGetClubEventsQuery } = clubApi; 
