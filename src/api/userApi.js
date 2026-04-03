import axiosClient from "./axiosClient";

export const getAllUsersApi = () => axiosClient.get("/api/users");
