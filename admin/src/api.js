import axios from 'axios';
import API_URL from './config';

const API = axios.create({ baseURL: `${API_URL}/api` });

// Attach JWT token for team members
API.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth (used by TeamLogin)
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe     = ()     => API.get('/auth/me');

export default API;
