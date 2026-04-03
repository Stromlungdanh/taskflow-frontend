import axiosClient from "./axiosClient";

export const getProjectsApi = () => axiosClient.get("/api/projects");
export const createProjectApi = (data) => axiosClient.post("/api/projects", data);
export const updateProjectApi = (projectId, data) => axiosClient.put(`/api/projects/${projectId}`, data);
export const deleteProjectApi = (projectId) => axiosClient.delete(`/api/projects/${projectId}`);
export const getProjectMembersApi = (projectId) => axiosClient.get(`/api/projects/${projectId}/members`);
export const addProjectMemberApi = (projectId, data) => axiosClient.post(`/api/projects/${projectId}/members`, data);
export const removeProjectMemberApi = (projectId, userId) => axiosClient.delete(`/api/projects/${projectId}/members/${userId}`);
export const getProjectPermissionApi = (projectId) => axiosClient.get(`/api/projects/${projectId}/permission`);
