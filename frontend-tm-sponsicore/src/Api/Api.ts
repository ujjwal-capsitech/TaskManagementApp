import axios from "axios";
import type { Task, CreateTaskData, ApiResponse, User, Project } from "./type";

const API_BASE_URL = "https://localhost:7007/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const taskApi = {
  getTasks: () => api.get<ApiResponse<Task[]>>("/Tasks"),
  getTask: (taskId: string) => api.get<ApiResponse<Task>>(`/Tasks/${taskId}`),
  createTask: (taskData: CreateTaskData) =>
    api.post<ApiResponse<Task>>("/Tasks", taskData),
  updateTask: (taskId: string, taskData: Partial<CreateTaskData>) =>
    api.put<ApiResponse<Task>>(`/Tasks/${taskId}`, taskData),
};

export const userApi = {
  getUsers: () => api.get<ApiResponse<User[]>>("/users"),
};

export const projectApi = {
  getProjects: () => api.get<ApiResponse<Project[]>>("/projects"),
};
