import axios from 'axios';
// http://localhost:5000/api
const api = axios.create({
  baseURL: 'http://3.80.95.96:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
