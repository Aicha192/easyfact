import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
 baseURL: 'https://easyfact-backend-production.up.railway.app',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;