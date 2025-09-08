import axios from 'axios';
import { getToken, removeToken } from './Auth';

const api = axios.create({
  // baseURL: 'https://localhost:7204/api/MstUser/login',
  baseURL: 'https://localhost:7204/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeToken();
      // Optional: redirect can be handled in components
    }
    return Promise.reject(error);
  }
);

export default api;

