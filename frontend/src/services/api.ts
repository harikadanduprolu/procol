import axios from 'axios';

const PRODUCTION_API_FALLBACK = 'https://procol-backend.onrender.com/api';

const resolveApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const isBrowser = typeof window !== 'undefined';
  const isLocalhost =
    isBrowser &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isBrowser && !isLocalhost) {
    return PRODUCTION_API_FALLBACK;
  }

  return 'http://localhost:5000/api';
};

const API_BASE_URL = resolveApiBaseUrl();



// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  otp: (data: { email: string }) =>
    api.post('/auth/otp', data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () =>
    api.get('/auth/profile'),

  updateProfile: (data: any) =>
    api.put('/auth/profile', data),

  getTeams: () =>
    api.get('/teams/my'),

  searchUsers: (query: string) =>
    api.get(`/auth/users/search?query=${encodeURIComponent(query)}`),

  getAllUsers: (params?: Record<string, any>) => {
    console.log('🔍 getAllUsers called with:', params);
    return api.get('/auth/users', { params });
  },
  

  getUserById: (id: string) => api.get(`/auth/users/${id}`),
};

// Project API
export const projectApi = {
  getAll: (params?: any) =>
    api.get('/projects', { params }),

  getById: (id: string) =>
    api.get(`/projects/${id}`),

  create: (data: FormData) =>
    api.post('/projects', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  update: (id: string, data: any) =>
    api.put(`/projects/${id}`, data),

  delete: (id: string) =>
    api.delete(`/projects/${id}`),

  addTeamMember: (id: string, userId: string) =>
    api.post(`/projects/${id}/team`, { userId }),

  removeTeamMember: (id: string, userId: string) =>
    api.delete(`/projects/${id}/team`, { data: { userId } }),

  getUserProjects: (params?: any) => api.get('/projects/user/projects', { params }),

  applyToProject: (projectId: string, data: { message?: string }) =>
    api.post(`/projects/${projectId}/apply`, data),

  getApplications: (projectId: string) =>
    api.get(`/projects/${projectId}/applications`),

  respondToApplication: (projectId: string, applicationId: string, data: { action: 'accept' | 'reject', message?: string }) =>
    api.put(`/projects/${projectId}/applications/${applicationId}`, data),
};

// Team API
export const teamApi = {
  getAll: (params?: any) =>
    api.get('/teams', { params }),

  getById: (id: string) =>
    api.get(`/teams/${id}`),

  create: (data: any) =>
    api.post('/teams', data),

  update: (id: string, data: any) =>
    api.put(`/teams/${id}`, data),

  delete: (id: string) =>
    api.delete(`/teams/${id}`),

  addMember: (id: string, userId: string) =>
    api.post(`/teams/${id}/members`, { userId }),

  removeMember: (id: string, userId: string) =>
    api.delete(`/teams/${id}/members`, { data: { userId } }),
};

// Funding API
export const fundingApi = {
  getAll: (params?: any) =>
    api.get('/funding', { params }),

  getById: (id: string) =>
    api.get(`/funding/${id}`),

  create: (data: any) =>
    api.post('/funding', data),

  update: (id: string, data: any) =>
    api.put(`/funding/${id}`, data),

  delete: (id: string) =>
    api.delete(`/funding/${id}`),

  back: (id: string, data: { amount: number; rewardTier?: string }) =>
    api.post(`/funding/${id}/back`, data),
};

// Message API
export const messageApi = {
  getConversations: () =>
    api.get('/messages/conversations'),

  getMessages: (userId: string) =>
    api.get(`/messages/${userId}`),

  sendMessage: (data: { senderId: string; recipientId: string; content: string }) =>
    api.post('/messages', data),

  sendTeamMessage: (teamId: string, content: string) =>
    api.post(`/messages/team/${teamId}`, { content }),

  sendProjectMessage: (projectId: string, content: string) =>
    api.post(`/messages/project/${projectId}`, { content }),

  markAsRead: (userId: string) =>
    api.put(`/messages/${userId}/read`),

  createConversation: (data: { userId: string }) =>
    api.post('/messages/conversations', data),
};

// Notification API
export const notificationApi = {
  create: (data: {
    recipient: string;
    type: 'project' | 'team' | 'funding' | 'message' | 'system';
    title: string;
    content: string;
    relatedProject?: string;
    relatedTeam?: string;
    relatedFunding?: string;
    relatedUser?: string;
  }) => api.post('/notifications', data),

  getAll: () => api.get('/notifications'),

  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),

  markAllAsRead: () => api.put('/notifications/all/read'),

  delete: (id: string) => api.delete(`/notifications/${id}`),
};

// Mentor API
export const mentorApi = {
  getAll: (params?: any) =>
    api.get('/mentors', { params }),

  getById: (id: string) =>
    api.get(`/mentors/${id}`),

  becomeMentor: (data: any) =>
    api.post('/mentors', data),

  update: (id: string, data: any) =>
    api.put(`/mentors/${id}`, data),

  addReview: (id: string, data: any) =>
    api.post(`/mentors/${id}/reviews`, data),
};

export default api;
