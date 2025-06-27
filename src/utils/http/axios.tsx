import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({
    //baseURL: 'https://n24tjyszxraupd5cuogxf377i40xiltl.lambda-url.ap-south-1.on.aws"'
    baseURL: 'http://localhost:5000', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userInfo').then(userInfo => {
            const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
            return parsedUserInfo?.authToken;
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;