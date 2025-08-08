import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { getAccessToken, getRefreshToken, clearTokens, saveAccessToken } from '../helpers/auth_helper';
import { showSnackbar } from "../components/snackbar/snackbarService";
import { BASE_URL } from '../utils/constants'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<any, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Access token expired
  if (result.error && (result.error as any).status === 401) {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearTokens();
      return result;
    }

    // ❗ Use a *separate* base query that does NOT include prepareHeaders
    const refreshBaseQuery = fetchBaseQuery({
      baseUrl: BASE_URL,
    });

    const refreshResult = await refreshBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`, 
        },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as {
        accessToken: string;
      };

      await saveAccessToken(accessToken);

      // Retry the original request with new access token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      await clearTokens();
    }
  }

  /* show messages in snackbar */
  if (result.error) {
    let message = "Something went wrong";

    if (result.error.status === "FETCH_ERROR") {
      message = "Network error. Please check your connection.";
    } else if (result.error.status === "TIMEOUT_ERROR") {
      message = "Request timed out. Please try again.";
    } else if (result.error.status === "PARSING_ERROR") {
      message = "Server response could not be processed.";
    } else if (typeof result.error.status === "number") {
      const data = result.error.data as any;
      message = data?.message || data?.error || `Error ${result.error.status}`;
    }

    showSnackbar(message, "error");
  }

  console.log(result)

  if (!result.error && api.type === "mutation") {
    const data = result.data as any;
    const successMessage =
      data?.message ||
      data?.msg ||
      "Operation completed successfully!";

    showSnackbar(successMessage, "success");
  }

  return result;
};
