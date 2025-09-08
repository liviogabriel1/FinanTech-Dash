import axios from 'axios';

// Esta linha agora é inteligente. Ela tenta ler a variável de ambiente primeiro.
// Se não a encontrar (como no seu ambiente local), ela usa o localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
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