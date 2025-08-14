// src/services/api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const feeApi = createApi({
  reducerPath: "feeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["adhoc", "fee", "transaction", "exception"],
  endpoints: (builder) => ({
    getFundBalance: builder.query({
      query: (params) => `/club?${new URLSearchParams(params).toString()}`,
      providesTags: ["transaction", "fee", "adhoc"],
    }),
    getTotalDue: builder.query({
      query: (params) => `/club?${new URLSearchParams(params).toString()}`,
      providesTags: ["fee", "adhoc"],
    }),
    getFees: builder.query({
      query: (params) => `/fee?${new URLSearchParams(params).toString()}`,
      providesTags: ["fee"],
    }),
    getFeesAdhoc: builder.query({
      query: (params) => `/fee/adhoc?${new URLSearchParams(params).toString()}`,
      providesTags: ["adhoc"],
    }),
    getClubDues: builder.query({
      query: (params) => `/club/member?${new URLSearchParams(params).toString()}`,
      providesTags: ["fee", "adhoc"],
    }), 
    addFee: builder.mutation({
      query: (body) => ({
        url: "/fee",
        method: "POST",
        body,
      }),
      invalidatesTags: ["fee"],
    }),
    addFeesAdhoc: builder.mutation({
      query: (body) => ({
        url: "/fee/adhoc",
        method: "POST",
        body,
      }),
      invalidatesTags: ["adhoc"],
    }),
    saveFeesAdhoc: builder.mutation({
      query: (body) => ({
        url: "/fee/adhoc",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["adhoc"],
    }),
    deleteFeesAdhoc: builder.mutation({
      query: (body) => ({
        url: "/fee/adhoc",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["adhoc"],
    }),    
    addFeesException: builder.mutation({
      query: (body) => ({
        url: "/fee/exception",
        method: "POST",
        body,
      }),
      invalidatesTags: ["exception"],
    }),
    updateFeesException: builder.mutation({
      query: (body) => ({
        url: "/fee/exception",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["exception"],
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
  useGetFundBalanceQuery,
  useGetTotalDueQuery,
  useGetFeesAdhocQuery,
  useAddFeesAdhocMutation,
  useSaveFeesAdhocMutation,
  useDeleteFeesAdhocMutation,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useAddFeesExceptionMutation,
  useGetClubDuesQuery,
  useAddFeeMutation,
  useUpdateFeesExceptionMutation,
} = feeApi;
