// type.ts

export interface ApiResponse<T> {
  data: T;
  status: boolean;
  message: string;
}

export interface Task {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  userId: string;
  userName: string;
  avatarUrl: string | null;
  activityTitle: string;
  activityDescription: string;
  stateFrom: string | null;
  stateTo: string | null;
  createdAt: string;
  isDeleted: boolean;
}

export interface CreateTaskData {
  taskTitle: string;
  description: string;
  dueDate: string;
  projectId: string;
  reporterId: string;
  assigneeIds: string[];
  priority: number;
}

export interface User {
  userId: string;
  name: string;
  email?: string;
  avatarUrl?: string | null;
}

export interface Project {
  projectId: string;
  projectName: string;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  userId: string;
  userName: string;
  avatarUrl: string | null;
  activityTitle: string;
  activityDescription: string;
  stateFrom: string | null;
  stateTo: string | null;
  createdAt: string;
  isDeleted: boolean;
}
