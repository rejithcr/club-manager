import { configureStore } from "@reduxjs/toolkit";
import { clubApi } from "../services/clubApi";
import { memberApi } from "../services/memberApi";
import { feeApi } from "../services/feeApi";

export const store = configureStore({
  reducer: {
    [clubApi.reducerPath]: clubApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [feeApi.reducerPath]: feeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clubApi.middleware, memberApi.middleware, feeApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
