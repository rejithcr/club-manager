// src/services/api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const feeApi = createApi({
  reducerPath: "feeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["adhoc", "fee", "transaction"],
  endpoints: (builder) => ({
    getFees: builder.query({
      query: (params) => `/fee?${new URLSearchParams(params).toString()}`,
    }),
    getFeesAdhoc: builder.query({
      query: (params) => `/fee/adhoc?${new URLSearchParams(params).toString()}`,
      providesTags: ["adhoc"],
    }),
    addFeesAdhoc: builder.mutation({
      query: (body) => ({
        url: "/fee/adhoc",
        method: "POST",
        body,
      }),
      invalidatesTags: ["adhoc"],
    }),
    getTransactions: builder.query({
      query: (params) => `/club/transaction?${new URLSearchParams(params).toString()}`,
      providesTags: ["adhoc", "transaction", "fee"],
    }),
    addTransaction: builder.mutation({
      query: (body) => ({
        url: "/club/transaction",
        method: "POST",
        body,
      }),
      invalidatesTags: ["transaction"],
    }),
    updateTransaction: builder.mutation({
      query: (body) => ({
        url: "/club/transaction",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["transaction"],
    }),
    deleteTransaction: builder.mutation({
      query: (params) => ({
        url: `/club/transaction?${new URLSearchParams(params).toString()}`,
        method: "DELETE"
      }),
      invalidatesTags: ["transaction"],
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeesAdhocQuery,
  useAddFeesAdhocMutation,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation
} = feeApi;
