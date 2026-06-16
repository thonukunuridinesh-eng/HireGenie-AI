import axios from "axios";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const isProductionApiMissing = import.meta.env.PROD && !configuredApiBaseUrl;
const isLocalApiBaseUrl =
  configuredApiBaseUrl?.includes("localhost") ||
  configuredApiBaseUrl?.includes("127.0.0.1");
const isProductionApiLocal = import.meta.env.PROD && isLocalApiBaseUrl;

const API_BASE_URL =
  configuredApiBaseUrl || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (config) => {
    if (isProductionApiMissing) {
      const error = new Error(
        "Production API URL is missing. Set VITE_API_BASE_URL in Vercel to your deployed Django backend URL, for example https://your-backend.onrender.com/api."
      );
      error.isConfigError = true;
      return Promise.reject(error);
    }

    if (isProductionApiLocal) {
      const error = new Error(
        "Vercel cannot call localhost or 127.0.0.1. Deploy the Django backend publicly, then set VITE_API_BASE_URL in Vercel to that backend URL ending with /api."
      );
      error.isConfigError = true;
      return Promise.reject(error);
    }

    const accessToken = localStorage.getItem("hiregenie_access_token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const refreshToken = localStorage.getItem("hiregenie_refresh_token");

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });

        const newAccessToken = response.data.access;

        localStorage.setItem("hiregenie_access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        localStorage.removeItem("hiregenie_access_token");
        localStorage.removeItem("hiregenie_refresh_token");
        localStorage.removeItem("hiregenie_user");
        localStorage.removeItem("hiregenie_profile");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
