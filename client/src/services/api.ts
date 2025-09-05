// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

// Interceptor para adicionar o token a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;