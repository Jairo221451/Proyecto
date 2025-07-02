import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5173/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const getEmprendimientos = () => api.get('/emprendimientos');
export const getUsuario = (id) => api.get(`/usuarios/${id}`);
export const getEmprendimientosDestacados = () => api.get('/emprendimientos/mas-valorados');
export const getTodosEmprendimientos = (page = 1) => 
  api.get(`/emprendimientos?page=${page}`);

export const buscarEmprendimientos = (termino) => 
  api.get(`/emprendimientos/buscar?q=${termino}`);

export default api;