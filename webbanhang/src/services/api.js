// src/services/api.js
import axios from 'axios';



const API = axios.create({
  // Không thêm /api vào baseURL
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ... phần còn lại giữ nguyên

// Interceptor - Tự động thêm token vào mọi request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor - Xử lý response/error global
API.interceptors.response.use(
  (response) => response.data, // Tự động lấy response.data
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn -> logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default API;