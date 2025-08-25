export interface User {
  id: string;
  userId: string;
  name: string;
}

export interface Project {
  projectId: string;
  projectName: string;
}

export interface Task {
  id: string;
  taskId: string;
  taskTitle: string;
  description: string;
  dueDate: string;
  project: Project;
  reporter: User;
  assignees: User[];
  status: number;
  priority: number;
  attachment: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  taskTitle: string;
  description: string;
  dueDate: string;
  projectId: string;
  reporterId: string;
  assigneeIds: string[];
  priority: number;
  attachment?: File;
}

export interface ApiResponse<T> {
  data: T;
  status: boolean;
  message: string;
}
