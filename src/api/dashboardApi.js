import axiosClient from "./axiosClient";

export const getDashboardSummaryApi = () => axiosClient.get("/dashboard/summary");
