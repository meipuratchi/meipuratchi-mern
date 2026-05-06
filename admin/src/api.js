import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

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
