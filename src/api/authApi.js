import axiosClient from "./axiosClient";

export const loginApi = (data) => {
  return axiosClient.post("/auth/login", data);
};

export const refreshTokenApi = (refreshToken) => {
  return axiosClient.post("/auth/refresh", { refreshToken });
};
export const registerApi = (data) => {
  return axiosClient.post("/auth/register", data);
};
