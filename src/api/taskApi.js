import axiosClient from "./axiosClient";

export const getTasksByProjectApi = (data) => axiosClient.post("/api/tasks/project/tasks", data);
export const createTaskApi = (data) => axiosClient.post("/api/tasks/add", data);
export const moveTaskApi = (id, data) => axiosClient.patch(`/api/tasks/${id}/move`, data);
export const updateTaskApi = (id, data) => axiosClient.put(`/api/tasks/${id}`, data);
export const updateTaskStatusApi = (id, data) => axiosClient.patch(`/api/tasks/${id}/status`, data);
export const deleteTaskApi = (id) => axiosClient.delete(`/api/tasks/${id}`);
export const searchTasksApi = (data) => axiosClient.post(`/api/tasks/search`, data);
