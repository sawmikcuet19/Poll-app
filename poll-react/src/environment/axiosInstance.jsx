import axios from 'axios';
import { getToken } from "../utility/common"

const instance = axios.create({
    baseURL: 'http://localhost:9000/',
});

// ✅ Add Request Interceptor
instance.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
