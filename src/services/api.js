import axios from 'axios';


const api = axios.create({
  baseURL: 'http://54.174.219.57:5000/api', // Local backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
