import axiosClient from "./axiosClient";

export const loginApi = (data) => {
  return axiosClient.post("/api/auth/login", data);
};

export const refreshTokenApi = (refreshToken) => {
  return axiosClient.post("/api/auth/refresh", { refreshToken });
};
export const registerApi = (data) => {
  return axiosClient.post("/api/auth/register", data);
};
