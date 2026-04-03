import axiosClient from "./axiosClient";

export const getDashboardSummaryApi = () => axiosClient.get("/api/dashboard/summary");
