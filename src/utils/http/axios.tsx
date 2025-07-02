import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from "expo-router";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error.message);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                const res = await axios.post(`${BASE_URL}/auth/refresh`, null, { headers: { Authorization: `Bearer ${refreshToken}` } });
                const newAccessToken = res.data.accessToken;
                await AsyncStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError: any) {
                console.log("refresh error", refreshError);
                if (refreshError.status === 401) {
                    alert('Session expired! Please login again.')
                    await AsyncStorage.removeItem('accessToken')
                    await AsyncStorage.removeItem('refreshToken')
                    router.dismissTo('/(auth)');
                } else {
                    return Promise.reject(error);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;