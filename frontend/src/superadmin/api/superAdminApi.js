import axios from 'axios';
import Cookies from 'js-cookie';

// If REACT_APP_API_URL is "http://localhost:8089/api", strip the trailing "/api"
// so we don't accidentally produce duplicate "/api/api/super-admin/..."
const rawUrl = process.env.REACT_APP_API_URL || 'http://localhost:8089';
const cleanHost = rawUrl.replace(/\/+$/, '').replace(/\/api$/, '');
const SUPER_ADMIN_BASE = `${cleanHost}/api/super-admin`;

const superAdminClient = axios.create({
  baseURL: SUPER_ADMIN_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

superAdminClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('superAdminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

superAdminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname.startsWith('/super-admin') && window.location.pathname !== '/super-admin/login') {
        Cookies.remove('superAdminToken');
        Cookies.remove('superAdminUser');
        window.location.href = '/super-admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const superAdminApi = {
  // Auth
  login: (data) => axios.post(`${SUPER_ADMIN_BASE}/auth/login`, data),
  
  // Dashboard
  getDashboardStats: (params) => superAdminClient.get('/dashboard/stats', { params }),

  // Subscription Plans
  getAllPlans: () => superAdminClient.get('/plans'),
  getPlanById: (id) => superAdminClient.get(`/plans/${id}`),
  createPlan: (data) => superAdminClient.post('/plans', data),
  updatePlan: (id, data) => superAdminClient.put(`/plans/${id}`, data),
  togglePlanStatus: (id, data) => superAdminClient.patch(`/plans/${id}/status`, data),

  // Admins
  getAdmins: (params) => superAdminClient.get('/admins', { params }),
  getAdminById: (id) => superAdminClient.get(`/admins/${id}`),
  toggleAdminStatus: (id, data) => superAdminClient.patch(`/admins/${id}/status`, data),

  // Users
  getUsers: (params) => superAdminClient.get('/users', { params }),

  // Subscriptions & Reports
  getSubscriptions: (params) => superAdminClient.get('/subscriptions', { params }),
  getSubscriptionReport: (params) => superAdminClient.get('/subscriptions/report', { params }),

  // Audit Logs
  getAuditLogs: (params) => superAdminClient.get('/audit-logs', { params }),
};

export default superAdminApi;


