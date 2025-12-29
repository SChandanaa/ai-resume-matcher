import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// If API_URL is just a hostname (common in some deployments), prepend protocol
if (API_URL && !API_URL.startsWith('http')) {
      API_URL = `https://${API_URL}`;
}

// Ensure the URL ends with /api if not already present
if (!API_URL.endsWith('/api')) {
      API_URL = `${API_URL}/api`;
}

const api = axios.create({
      baseURL: API_URL,
      headers: {
            'Content-Type': 'application/json',
      },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
      (config) => {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                  config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
      },
      (error) => {
            return Promise.reject(error);
      }
);

console.log('API_URL being used:', API_URL);

export default api;
