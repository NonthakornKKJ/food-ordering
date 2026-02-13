import axios from 'axios';

// Use Vite env var in production; fallback to localhost
const BASE = import.meta.env.VITE_API_URL;
const API_URL = BASE.endsWith("/") ? `${BASE}api` : `${BASE}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});



// Request interceptor - add token to requests
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

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    qrLogin: (data) => api.post('/auth/qr-login', data),
    getMe: () => api.get('/auth/me'),
};

// Menu API
export const menuAPI = {
    getAll: (params) => api.get('/menus', { params }),
    getById: (id) => api.get(`/menus/${id}`),
    create: (data) => api.post('/menus', data),
    update: (id, data) => api.put(`/menus/${id}`, data),
    delete: (id) => api.delete(`/menus/${id}`),
};

// Category API
export const categoryAPI = {
    getAll: (params) => api.get('/categories', { params }),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Order API
export const orderAPI = {
    create: (data) => api.post('/orders', data),
    getAll: (params) => api.get('/orders', { params }),
    getByTable: (tableNumber) => api.get(`/orders/table/${tableNumber}`),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
    delete: (id) => api.delete(`/orders/${id}`),
};

// User API
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard'),
};

// Table API
export const tableAPI = {
    getAll: () => api.get('/tables'),
};

export default api;
