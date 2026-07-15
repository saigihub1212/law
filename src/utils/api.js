import axios from 'axios';

const API = axios.create({
  baseURL: '/api/',
  timeout: 15000,
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / redirection
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const res = await axios.post('/api/auth/refresh/', {
              refresh: refreshToken,
            });
            if (res.status === 200) {
              localStorage.setItem('access_token', res.data.access);
              originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
              return API(originalRequest);
            }
          } catch (refreshError) {
            // Token refresh failed, logout user
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/admin/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
