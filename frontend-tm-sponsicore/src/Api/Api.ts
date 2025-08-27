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

    addAttachment: (taskId: string) =>
        api.post<ApiResponse<Task>>(`/Tasks/${taskId}`),

    
};

export const userApi = {
  getUsers: () => api.get<ApiResponse<User[]>>("/user/all"),
};

export const projectApi = {
  getProjects: () => api.get<ApiResponse<Project[]>>("/projects"),
};

export const activityLogApi = {
    getActivityLogs: (projectId: string = "SPC") => api.get<ApiResponse<ActivityLogs[]>>(`/activity/project/${projectId}`),
    
};
// Mock API responses
// const mockUsers: User[] = [
//   { userId: "1", name: "John Doe", email: "john@example.com" },
//   { userId: "2", name: "Jane Smith", email: "jane@example.com" },
//   { userId: "3", name: "Bob Wilson", email: "bob@example.com" },
//   { userId: "4", name: "Annette Black", email: "annette@example.com" },
// ];

// const mockProjects: Project[] = [
//   { projectId: "1", projectName: "Lucy", description: "Project Lucy" },
//   { projectId: "2", projectName: "Alpha", description: "Project Alpha" },
//   { projectId: "3", projectName: "Beta", description: "Project Beta" },
// ];

// const mockTasks: Task[] = [
//   {
//     id: "1",
//     taskId: "SC-001",
//     taskTitle: "example",
//     description: "Lorem Ipsum is simply dummy text",
//     dueDate: "2024-02-15",
//     projectId: "1",
//     reporterId: "4",
//     assigneeIds: ["1", "2", "3"],
//     priority: 1,
//     status: 0,
//     createdAt: "2024-02-01",
//   },
// ];

// export const userApi = {
//   getUsers: () => Promise.resolve({ data: { data: mockUsers } }),
//   getUserById: (id: string) => Promise.resolve({ data: { data: mockUsers.find(u => u.userId === id) } }),
// };

// export const projectApi = {
//   getProjects: () => Promise.resolve({ data: { data: mockProjects } }),
//   getProjectById: (id: string) => Promise.resolve({ data: { data: mockProjects.find(p => p.projectId === id) } }),
// };

// export const taskApi = {
//   getTasks: () => Promise.resolve({ data: { data: mockTasks } }),
//   getTaskById: (id: string) => Promise.resolve({ data: { data: mockTasks.find(t => t.id === id) } }),
//   createTask: (task: Task) => Promise.resolve({ data: { data: { ...task, id: Date.now().toString() } } }),
//   updateTask: (id: string, task: Partial<Task>) => Promise.resolve({ data: { data: { ...task, id } } }),
// };

