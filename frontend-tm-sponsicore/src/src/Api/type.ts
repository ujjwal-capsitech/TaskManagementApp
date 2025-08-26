
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
  TaskStatus:number;
  stateTo: string | null;
  createdAt: string;
  isDeleted: boolean;

}

export interface TaskStatus {
    "Todo" :0,
    "InProgress" : 1,
    "NTD" : 2,
    "Done" : 3,
}

export interface Priority {
    "Low" : 0,
    "Medium" : 1,
    "High" : 2,
}

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
    projectId: string;
    reporterId: string;
    assigneeIds: string[];
    priority: Priority;
    status: TaskStatus;
    createdAt: string;
    updatedAt?: string;
    comments?: Comment[];
    attachments?: Attachment[];
}

export interface Attachment {
    name: string;
    size: string;
    url: string;
}
