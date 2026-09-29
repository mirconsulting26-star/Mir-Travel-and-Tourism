import axios from 'axios';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mir_api_base_url');
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  }
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://backend-hurm.onrender.com/api/v1';
  }
  return '/api/v1';
}

export function setApiBaseUrl(newUrl: string): void {
  const cleaned = newUrl.trim().replace(/\/+$/, '');
  if (typeof window !== 'undefined') {
    if (cleaned) {
      localStorage.setItem('mir_api_base_url', cleaned);
    } else {
      localStorage.removeItem('mir_api_base_url');
    }
  }
  apiClient.defaults.baseURL = cleaned || getApiBaseUrl();
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export function formatApiError(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const err = error as {
    message?: string;
    isHtmlRedirect?: boolean;
    response?: { data?: unknown; status?: number };
    request?: unknown;
  };

  if (err?.isHtmlRedirect) {
    return err.message || fallback;
  }

  const responseData = err?.response?.data;
  if (typeof responseData === 'string' && (responseData.includes('<!DOCTYPE') || responseData.includes('<html'))) {
    return 'The backend API was not found (received frontend index.html). Please configure VITE_API_BASE_URL on your frontend static site to point to your live backend on Render (e.g. https://your-backend.onrender.com/api/v1).';
  }

  const detail = (responseData as { detail?: unknown })?.detail;
  if (typeof detail === 'string' && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const joined = detail
      .map((item) => (typeof item === 'string' ? item : item?.msg))
      .filter(Boolean)
      .join(' ');
    if (joined) return joined;
  }

  if (err?.request && !err?.response) {
    return 'Cannot reach the Travel Desk API. Ensure the backend is active on Render (or localhost:8000) and that CORS permits your frontend URL.';
  }

  if (err?.message && !err?.response) return err.message;
  return fallback;
}

apiClient.interceptors.request.use((config) => {
  // Ensure baseURL is always current
  config.baseURL = getApiBaseUrl();
  const token = localStorage.getItem('mir_access_token');
  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    // Check if the response returned an HTML document (SPA rewrite fallback when API route is missed)
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!doctype html') ||
        response.data.includes('<!DOCTYPE html') ||
        response.data.includes('<html'))
    ) {
      const error: any = new Error(
        'The backend API was not found (received frontend HTML instead of JSON). Please ensure your frontend environment has VITE_API_BASE_URL set to your Render backend URL (e.g. https://your-backend.onrender.com/api/v1).'
      );
      error.isHtmlRedirect = true;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    const url = String(error.config?.url || '');
    const isLoginRequest = url.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('mir_access_token');
    }
    return Promise.reject(error);
  }
);
