import axios from 'axios';
import API_URL from './config';

const API = axios.create({ baseURL: `${API_URL}/api` });

// Attach JWT token to every request if present
API.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Public form submissions
export const submitRegistration = (data) => API.post('/registrations', data);
export const submitVolunteer    = (data) => API.post('/volunteers', data);
export const submitContact      = (data) => API.post('/contacts', data);
export const getStats           = ()     => API.get('/registrations/stats');

// Auth
export const registerUser    = (data) => API.post('/auth/register', data);
export const loginUser       = (data) => API.post('/auth/login', data);
export const loginVerifyOTP  = (data) => API.post('/auth/login/verify-otp', data);
export const sendOTP         = (data) => API.post('/auth/send-otp', data);
export const verifyEmailOTP  = (data) => API.post('/auth/verify-otp', data);
export const getMe           = ()     => API.get('/auth/me');
export const sendUserMsg     = (text) => API.post('/auth/me/message', { text });
export const deleteAccount   = ()     => API.delete('/auth/me');
export const changePassword  = (currentPassword, newPassword) =>
  API.patch('/auth/me/password', { currentPassword, newPassword });

// Admin broadcast
export const broadcastEmail  = (data) => API.post('/admin/broadcast', data);

