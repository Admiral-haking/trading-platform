import axios from 'axios';

// Token storage key kept scoped and consistent
const TOKEN_KEY = 'auth_token';

let inMemoryToken: string | null = null;

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  if (inMemoryToken) return inMemoryToken;
  const t = window.localStorage.getItem(TOKEN_KEY);
  inMemoryToken = t;
  return t;
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  inMemoryToken = token;
  if (token) {
    // Basic hardening: avoid accidental exposure by namespacing and not spreading
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export const api = axios.create({
  // Let Next.js proxy relative paths to the same origin backend
  baseURL: '/api',
  withCredentials: false,
});

// Attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s by clearing token and redirecting to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setToken(null);
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

