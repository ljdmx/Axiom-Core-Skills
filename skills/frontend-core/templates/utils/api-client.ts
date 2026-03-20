// TEMPLATE_META:START
/*
@template-id: api-client
@version: 1.0.0
@description: Advanced Axios instance with interceptors and retry logic
@dependencies: axios
@customization-points: BASE_URL
@framework: Shared
*/
// TEMPLATE_META:END

import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '{{BASE_URL}}',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Attach token if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized (Token Refresh Logic)
        if (error.response?.status === 401) {
            // Redirect to login or refresh token
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
