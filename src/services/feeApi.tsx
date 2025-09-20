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
    editFee: builder.mutation({
      query: (body) => ({
        url: "/fee",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["fee"],
    }),
    deleteFee: builder.mutation({
      query: (body) => ({
        url: "/fee",
        method: "DELETE",
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
    getException: builder.query({
      query: (params) => `/fee/exception?${new URLSearchParams(params).toString()}`,
      providesTags: ["exception"],
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
    getFeeCollections: builder.query({
      query: (params) => `/fee/collection?${new URLSearchParams(params).toString()}`,
      providesTags: ["fee"],
    }),
    saveFeeCollection: builder.mutation({
      query: (body) => ({
        url: "/fee/collection",
        method: "POST",
        body,
      }),
      invalidatesTags: ["fee"],
    }),
    deleteFeeCollection: builder.mutation({
      query: (body) => ({
        url: "/fee/collection",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["fee"],
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
    // mark multiple dues as paid
    markDuesPaid: builder.mutation({
      query: (body) => ({
        url: "/fee/markpaid",
        method: "POST",
        body,
      }),
      invalidatesTags: ["fee", "transaction", "adhoc"],
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
  useEditFeeMutation,
  useDeleteFeeMutation,
  useGetExceptionQuery,
  useLazyGetExceptionQuery,
  useGetFeeCollectionsQuery,
  useLazyGetFeeCollectionsQuery,
  useSaveFeeCollectionMutation,
  useDeleteFeeCollectionMutation
  ,useMarkDuesPaidMutation
} = feeApi;
