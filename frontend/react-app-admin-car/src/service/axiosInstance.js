import axios from 'axios';
import { API_BASE_URL } from '../utils/apiPath';

let navigate = () => {};
export const setNavigate = (navFn) => {
    navigate = navFn;
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token && config.url && !config.url.includes('/login')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            const message = String(data?.message || '').toLowerCase();
            const isUserNotFound = message.includes('utilisateur non trouv');
            
            if (status === 401 && !error.config.url.includes('/login') && !isUserNotFound) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                console.warn("Token expiré, redirection vers login");
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
