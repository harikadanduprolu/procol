import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  signup: (name: string, email: string, password: string) => 
    api.post('/auth/signup', { name, email, password }),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// Projects API
export const projectsAPI = {
  getAll: (params?: any) => api.get('/projects', { params }),
  
  getById: (id: string) => api.get(`/projects/${id}`),
  
  create: (data: any) => api.post('/projects', data),
  
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  
  delete: (id: string) => api.delete(`/projects/${id}`),
  
  addTeamMember: (id: string, userId: string) => 
    api.post(`/projects/${id}/team`, { userId }),
  
  removeTeamMember: (id: string, userId: string) => 
    api.delete(`/projects/${id}/team/${userId}`),
};

// Teams API
export const teamsAPI = {
  getAll: (params?: any) => api.get('/teams', { params }),
  
  getById: (id: string) => api.get(`/teams/${id}`),
  
  create: (data: any) => api.post('/teams', data),
  
  update: (id: string, data: any) => api.put(`/teams/${id}`, data),
  
  delete: (id: string) => api.delete(`/teams/${id}`),
};

// Mentors API
export const mentorsAPI = {
  getAll: (params?: any) => api.get('/mentors', { params }),
  
  getById: (id: string) => api.get(`/mentors/${id}`),
  
  becomeMentor: (data: any) => api.post('/mentors', data),
  
  update: (id: string, data: any) => api.put(`/mentors/${id}`, data),
};

// Funding API
export const fundingAPI = {
  getAll: (params?: any) => api.get('/funding', { params }),
  
  getById: (id: string) => api.get(`/funding/${id}`),
  
  create: (data: any) => api.post('/funding', data),
  
  update: (id: string, data: any) => api.put(`/funding/${id}`, data),
  
  delete: (id: string) => api.delete(`/funding/${id}`),
  
  backProject: (id: string, data: any) => 
    api.post(`/funding/${id}/back`, data),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  
  getMessages: (conversationId: string) => 
    api.get(`/messages/conversations/${conversationId}`),
  
  sendMessage: (conversationId: string, content: string) => 
    api.post(`/messages/conversations/${conversationId}`, { content }),
  
  createConversation: (userId: string) => 
    api.post('/messages/conversations', { userId }),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api; 