import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const userService = {
  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  async getSkills() {
    const response = await api.get('/users/skills');
    return response.data;
  },

  async updateSkills(skillsData) {
    const response = await api.put('/users/skills', skillsData);
    return response.data;
  },
};

export const swapService = {
  async getSwapRequests() {
    const response = await api.get('/swaps');
    return response.data;
  },

  async createSwapRequest(swapData) {
    const response = await api.post('/swaps', swapData);
    return response.data;
  },

  async updateSwapRequest(id, status) {
    const response = await api.put(`/swaps/${id}`, { status });
    return response.data;
  },
};

export const ratingService = {
  async getRatings() {
    const response = await api.get('/ratings');
    return response.data;
  },

  async submitRating(ratingData) {
    const response = await api.post('/ratings', ratingData);
    return response.data;
  },
};

export default api;