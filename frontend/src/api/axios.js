import axios from 'axios';

const api = axios.create({
  baseURL: 'https://accurate-smile-production-47a8.up.railway.app/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;