
export interface ApiResponse<T> {
  data: T;
  status: boolean;
  message: string;
}


export interface User {
  id:string;
  userId: string;
  name: string;
  avatarUrl?: string | null;
}

export interface Project {
  id: string;
  projectId: string;
  projectName: string;

}

export interface ActivityLogs {
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
  activityType: "comment" | "activity";
}

export const TaskStatus = {
    Todo: 0,
    InProgress: 1,
    NTD: 2,
    Done: 3,
} as const;

export const Priority = {
    Low: 0,
    Medium: 1,
    High: 2,
} as const;


export interface Comment {
    userId: string;
    name: string;
    content: string;
    createdAt: string;
}

export interface Task {
  id: string;
  taskId: string;
  taskTitle: string;
  description: string;
  dueDate: string;
  project: Project;
  reporter: reporter;
  assignees: assignee[];
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
  comment?: Comment[];
  attachments?: Attachment[];
}
export interface reporter {
    reporterId: string;
    name: string;
}
export interface assignee {
    assigneeId: string;
    name: string;
}
export interface Attachment {
    name: string;
    size: string;
    url: string;
}
