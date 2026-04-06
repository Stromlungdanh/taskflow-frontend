import axiosClient from "./axiosClient";

export const getTasksByProjectApi = (data) => axiosClient.post("/tasks/project/tasks", data);
export const createTaskApi = (data) => axiosClient.post("/tasks/add", data);
export const moveTaskApi = (id, data) => axiosClient.patch(`/tasks/${id}/move`, data);
export const updateTaskApi = (id, data) => axiosClient.put(`/tasks/${id}`, data);
export const updateTaskStatusApi = (id, data) => axiosClient.patch(`/tasks/${id}/status`, data);
export const deleteTaskApi = (id) => axiosClient.delete(`/tasks/${id}`);
export const searchTasksApi = (data) => axiosClient.post(`/tasks/search`, data);
