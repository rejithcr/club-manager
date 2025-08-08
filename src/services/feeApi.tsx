// src/services/api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const feeApi = createApi({
  reducerPath: "feeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['adhoc','fee'],
  endpoints: (builder) => ({
    getFees: builder.query({
      query: (params) => `/fee?${new URLSearchParams(params).toString()}`,
    }),
    getFeesAdhoc: builder.query({
      query: (params) => `/fee/adhoc?${new URLSearchParams(params).toString()}`,
      providesTags:['adhoc']
    }),
    addFeesAdhoc: builder.mutation({
      query: (body) => ({
        url: '/fee/adhoc',
        method: 'POST',
        body,
      }),
      invalidatesTags:['adhoc']
    }),
  }),
});

export const { useGetFeesQuery, useGetFeesAdhocQuery, useAddFeesAdhocMutation  } = feeApi; 
