import axiosClient from "./axiosClient";

export const getProjectsApi = () => axiosClient.get("/projects");
export const createProjectApi = (data) => axiosClient.post("/projects", data);
export const updateProjectApi = (projectId, data) => axiosClient.put(`/projects/${projectId}`, data);
export const deleteProjectApi = (projectId) => axiosClient.delete(`/projects/${projectId}`);
export const getProjectMembersApi = (projectId) => axiosClient.get(`/projects/${projectId}/members`);
export const addProjectMemberApi = (projectId, data) => axiosClient.post(`/projects/${projectId}/members`, data);
export const removeProjectMemberApi = (projectId, userId) => axiosClient.delete(`/projects/${projectId}/members/${userId}`);
export const getProjectPermissionApi = (projectId) => axiosClient.get(`/projects/${projectId}/permission`);
