import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export function formatApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const err = error as {
    message?: string;
    response?: { data?: { detail?: unknown } };
    request?: unknown;
  };

  const detail = err?.response?.data?.detail;
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const joined = detail
      .map((item) => (typeof item === 'string' ? item : item?.msg))
      .filter(Boolean)
      .join(' ');
    if (joined) return joined;
  }

  if (err?.request && !err?.response) {
    return 'Cannot reach the Travel Desk API. Start the backend on port 8000 and try again.';
  }

  if (err?.message && !err?.response) return err.message;
  return fallback;
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mir_access_token');
  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || '');
    const isLoginRequest = url.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('mir_access_token');
    }
    return Promise.reject(error);
  }
);
