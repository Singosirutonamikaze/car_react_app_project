import axios from 'axios';
import { API_BASE_URL } from '../utils/apiPath';

let navigate = (_path?: string) => {};
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
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token && config.url && !config.url.includes('/login')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        console.log('Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.log("Axios Request Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('Axios Response Error:', error);
        
        if (error.response) {
            const { status } = error.response;
            
            if (status === 401 && !error.config.url.includes('/login')) {
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