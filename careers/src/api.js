import axios from 'axios';
import API_URL from './config';

const API = axios.create({ baseURL: `${API_URL}/api/careers` });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('careerToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Public
export const getJobs   = (params) => API.get('/jobs', { params });
export const getJob    = (id)     => API.get(`/jobs/${id}`);

// Auth
export const registerCareerUser = (data) => API.post('/auth/register', data);
export const loginCareerUser    = (data) => API.post('/auth/login', data);
export const getCareerMe        = ()     => API.get('/auth/me');
export const updateCareerMe     = (data) => API.patch('/auth/me', data);

// Applications
export const applyJob        = (data) => API.post('/apply', data);
export const getMyApps       = ()     => API.get('/my-applications');
export const getMyApp        = (id)   => API.get(`/my-applications/${id}`);
export const sendAppMessage  = (id, text) => API.post(`/my-applications/${id}/message`, { text });

export default API;
