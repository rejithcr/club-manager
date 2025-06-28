import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = await AsyncStorage.getItem('authInfo').then(userInfo => {
            const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
            return parsedUserInfo?.accessToken;
        });
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to catch 401
axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log("token expired:");
            try {
                const authInfo = await AsyncStorage.getItem('authInfo').then(userInfo => {
                    return userInfo ? JSON.parse(userInfo) : null;
                });
                const res = await axios.post(`${BASE_URL}/auth/refresh`, null, { headers: { Authorization: `Bearer ${authInfo?.refreshToken}` } });
                const newAccessToken = res.data.accessToken;
                await AsyncStorage.setItem('authInfo', JSON.stringify({ ...authInfo, accessToken: newAccessToken }));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                await AsyncStorage.removeItem('authInfo');
                // Redirect to login screen
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;