import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const feeApi = createApi({
  reducerPath: "feeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["adhoc", "fee", "transaction", "exception", "transactionCategory", "eventTransaction", "eventTransactionCategory"],
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
    // transaction categories
    getTransactionCategories: builder.query({
      query: (params) => `/club/transaction/category?${new URLSearchParams(params).toString()}`,
      providesTags: ["transactionCategory"],
    }),
    addTransactionCategory: builder.mutation({
      query: (body) => ({
        url: "/club/transaction/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["transactionCategory"],
    }),
    updateTransactionCategory: builder.mutation({
      query: (body) => ({
        url: "/club/transaction/category",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["transactionCategory"],
    }),
    deleteTransactionCategory: builder.mutation({
      query: (params) => ({
        url: `/club/transaction/category?${new URLSearchParams(params).toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["transactionCategory"],
    }),
    // event transactions
    getEventTransactions: builder.query({
      query: (params) => `/club/event/transaction?${new URLSearchParams(params).toString()}`,
      providesTags: ["eventTransaction", "transaction"],
    }),
    addEventTransaction: builder.mutation({
      query: (body) => ({
        url: "/club/event/transaction",
        method: "POST",
        body,
      }),
      invalidatesTags: ["eventTransaction"],
    }),
    updateEventTransaction: builder.mutation({
      query: (body) => ({
        url: "/club/event/transaction",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["eventTransaction"],
    }),
    deleteEventTransaction: builder.mutation({
      query: (params) => ({
        url: `/club/event/transaction?${new URLSearchParams(params).toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["eventTransaction"],
    }),
    // event transaction categories
    getEventTransactionCategories: builder.query({
      query: (params) => `/club/event/transaction/category?${new URLSearchParams(params).toString()}`,
      providesTags: ["eventTransactionCategory"],
    }),
    addEventTransactionCategory: builder.mutation({
      query: (body) => ({
        url: "/club/event/transaction/category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["eventTransactionCategory"],
    }),
    updateEventTransactionCategory: builder.mutation({
      query: (body) => ({
        url: "/club/event/transaction/category",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["eventTransactionCategory"],
    }),
    deleteEventTransactionCategory: builder.mutation({
      query: (params) => ({
        url: `/club/event/transaction/category?${new URLSearchParams(params).toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: ["eventTransactionCategory"],
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
    // mark multiple dues as bad debt
    markBadDebt: builder.mutation({
      query: (body) => ({
        url: "/fee/baddebt",
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
  useLazyGetFeesAdhocQuery,
  useAddFeesAdhocMutation,
  useSaveFeesAdhocMutation,
  useDeleteFeesAdhocMutation,
  useGetTransactionsQuery,
  useGetTransactionCategoriesQuery,
  useAddTransactionCategoryMutation,
  useUpdateTransactionCategoryMutation,
  useDeleteTransactionCategoryMutation,
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
  useDeleteFeeCollectionMutation,
  useMarkDuesPaidMutation,
  useMarkBadDebtMutation,
  useGetEventTransactionCategoriesQuery,
  useAddEventTransactionCategoryMutation,
  useUpdateEventTransactionCategoryMutation,
  useDeleteEventTransactionCategoryMutation,
  useDeleteEventTransactionMutation,
  useUpdateEventTransactionMutation,
  useGetEventTransactionsQuery,
  useAddEventTransactionMutation
} = feeApi;
