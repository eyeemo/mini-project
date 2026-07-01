import axios from 'axios';

// Central API client. withCredentials lets the Sanctum session cookie ride along,
// and axios auto-sends the XSRF-TOKEN cookie as the X-XSRF-TOKEN header.
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Prime the CSRF cookie (call once before login / mutations).
export function csrf() {
    return axios.get('/sanctum/csrf-cookie', { withCredentials: true });
}

export const AuthApi = {
    register: (payload) => api.post('/register', payload),
    login: (payload) => api.post('/login', payload),
    logout: () => api.post('/logout'),
    me: () => api.get('/user'),
};

export const UsersApi = {
    list: () => api.get('/users'),
    create: (payload) => api.post('/users', payload),
    update: (id, payload) => api.put(`/users/${id}`, payload),
    remove: (id) => api.delete(`/users/${id}`),
};

export const ItemsApi = {
    list: (params = {}) => api.get('/items', { params }),
    labels: () => api.get('/items/labels'),
    get: (id) => api.get(`/items/${id}`),
    create: (payload) => api.post('/items', payload),
    update: (id, payload) => api.put(`/items/${id}`, payload),
    remove: (id) => api.delete(`/items/${id}`),
};

export default api;
