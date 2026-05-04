import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Since backend matches http://localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Typical JWT format
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
