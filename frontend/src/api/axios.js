import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Ajoute le token automatiquement à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Pour déboguer
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;