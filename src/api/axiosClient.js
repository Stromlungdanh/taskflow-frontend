import axios from "axios";
import { getAccessToken, getRefreshToken, saveAccessToken, logout } from "../utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;
  if (!error.response) return Promise.reject(error);
  const isRefreshRequest = originalRequest?.url?.includes("/api/auth/refresh");
  if (error.response.status === 401 && !originalRequest._retry && !isRefreshRequest) {
    originalRequest._retry = true;
    const refreshToken = getRefreshToken();
    if (!refreshToken) { logout(); window.location.href = "/"; return Promise.reject(error); }
    try {
      const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken }, { headers: { "Content-Type": "application/json" } });
      const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.data?.data?.accessToken;
      if (!newAccessToken) { logout(); window.location.href = "/"; return Promise.reject(error); }
      saveAccessToken(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) { logout(); window.location.href = "/"; return Promise.reject(refreshError); }
  }
  return Promise.reject(error);
});

export default axiosClient;
