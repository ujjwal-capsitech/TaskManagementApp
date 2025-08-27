import axios from "axios";
import type {
  Task,
  ApiResponse,
  User,
  Project,
  ActivityLogs,
} from "./type";

const API_BASE_URL = "https://localhost:7007/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const taskApi = {
    getTasks: () => api.get<ApiResponse<Task[]>>("/Tasks"),//To get All Tasks 

    getTask: (taskId: string) => api.get<ApiResponse<Task>>(`/Tasks/${taskId}`),

    createTask: (taskData: Task) => api.post<ApiResponse<Task>>("/Tasks", taskData),

    updateTask: (taskId: string, taskData: Partial<Task>) => api.put<ApiResponse<Task>>(`/Tasks/${taskId}`, taskData),

    addComment: (taskId: string) =>
        api.post<ApiResponse<Task>>(`/Tasks/${taskId}`),

    addAttachment: (taskId: string, formData: FormData) => 
      api.post<ApiResponse<Task>>(`/Tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
  };
    

export const userApi = {
  getUsers: () => api.get<ApiResponse<User[]>>("/user/all"),
};

export const projectApi = {
  getProjects: () => api.get<ApiResponse<Project[]>>("/projects"),
};
    
export const activityLogApi = {
    getActivityLogs: (taskId: string) =>
        api.get<ApiResponse<ActivityLogs[]>>(`/activity/task/${taskId}`),

    updateActivity: (id: string, data: Partial<ActivityLogs>) =>
        api.put<ApiResponse<ActivityLogs>>(`/activity/${id}`, data),

    deleteActivity: (id: string) =>
        api.delete<ApiResponse<void>>(`/activity/${id}`),

    createActivity: (data: Partial<ActivityLogs>) =>
        api.post<ApiResponse<ActivityLogs>>("/activity", data),
};

