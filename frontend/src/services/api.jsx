import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Servicios de Películas
export const movieService = {
  getAll: (params) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  search: (query) => api.get('/movies/search', { params: { q: query } }),
  getByGenre: (genre, params) => api.get(`/movies/genre/${genre}`, { params }),
  create: (movieData) => api.post('/movies', movieData),
  update: (id, movieData) => api.put(`/movies/${id}`, movieData),
  delete: (id) => api.delete(`/movies/${id}`)
};

// Servicios de Directores
export const directorService = {
  getAll: (params) => api.get('/directors', { params }),
  getById: (id) => api.get(`/directors/${id}`),
  search: (query) => api.get('/directors/search', { params: { q: query } }),
  getByNationality: (nationality, params) => api.get(`/directors/nationality/${nationality}`, { params }),
  getStats: () => api.get('/directors/stats'),
  create: (directorData) => api.post('/directors', directorData),
  update: (id, directorData) => api.put(`/directors/${id}`, directorData),
  delete: (id) => api.delete(`/directors/${id}`)
};

export default api;