import { post } from "../utils/http/api";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const authenticateMember = (
  email: string,
  gToken: string | undefined
) => {
  return post("/auth", null, { email: email, gToken: gToken });
};


const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, accessToken],
    [REFRESH_KEY, refreshToken],
  ]);
};

export const saveAccessToken = async (accessToken: string) => {
    await AsyncStorage.setItem(ACCESS_KEY, accessToken);
}

export const getAccessToken = async () => {
  return await AsyncStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem(REFRESH_KEY);
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
};
