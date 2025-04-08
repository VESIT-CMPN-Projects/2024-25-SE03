import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You might want to redirect to login page here in a real app
    }
    
    return Promise.reject(error);
  }
);

// Mock API service for authentication

export const authAPI = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Store token and user info in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Register function
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/user');
      return {
        isAuthenticated: true,
        user: response.data
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        user: null
      };
    }
  },
  
  // Logout function
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/user', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile with donations and volunteer history
  getUser: async () => {
    try {
      const response = await api.get('/auth/user');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user donations
  getUserDonations: async (userId) => {
    try {
      const response = await api.get(`/donations/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user volunteer history
  getUserVolunteerHistory: async (userId) => {
    try {
      const response = await api.get(`/volunteers/user/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// API endpoints
export const programsAPI = {
  // Get all programs
  getAll: async () => {
    try {
      const response = await api.get('/programs');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get a single program by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/programs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create a new program (admin only)
  create: async (programData) => {
    try {
      const response = await api.post('/programs', programData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update a program (admin only)
  update: async (id, programData) => {
    try {
      const response = await api.put(`/programs/${id}`, programData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete a program (admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/programs/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const volunteersAPI = {
  register: (volunteerData) => api.post('/volunteers', volunteerData),
  getAll: () => api.get('/volunteers'),
  getOne: (id) => api.get(`/volunteers/${id}`),
  update: (id, volunteerData) => api.put(`/volunteers/${id}`, volunteerData),
  delete: (id) => api.delete(`/volunteers/${id}`)
};

export const donationsAPI = {
  donate: (donationData) => api.post('/donations', donationData),
  getAll: () => api.get('/donations'),
  getOne: (id) => api.get(`/donations/${id}`),
  update: (id, donationData) => api.put(`/donations/${id}`, donationData),
  delete: (id) => api.delete(`/donations/${id}`)
};

export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  getOne: (id) => api.get(`/achievements/${id}`),
  create: (achievementData) => api.post('/achievements', achievementData),
  update: (id, achievementData) => api.put(`/achievements/${id}`, achievementData),
  delete: (id) => api.delete(`/achievements/${id}`)
};

export default api; 