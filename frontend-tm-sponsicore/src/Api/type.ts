
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

export const mockActivityLogs: ActivityLogs[] = [
  {
    id: "1",
    taskId: "SC-001",
    taskTitle: "Low fidelity for the website",
    projectId: "P-001",
    userId: "U-01",
    userName: "Guy Hawkins",
    avatarUrl: null,
    activityTitle: "added a comment on",
    activityDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    stateFrom: null,
    stateTo: null,
    createdAt: "2025-08-27T19:54:00",
    isDeleted: false,
  },
  {
    id: "2",
    taskId: "SC-001",
    taskTitle: "Low fidelity for the website",
    projectId: "P-001",
    userId: "U-02",
    userName: "Theresa Webb",
    avatarUrl: null,
    activityTitle: "added a comment on",
    activityDescription: "Another comment for testing timeline UI.",
    stateFrom: null,
    stateTo: null,
    createdAt: "2025-08-27T19:54:00",
    isDeleted: false,
  },
];
// export interface User {
//   userId: string;
//   name: string;
//   email?: string;
//   avatar?: string;
// }

// export interface Project {
//   projectId: string;
//   projectName: string;
//   description?: string;
// }

// export interface Task {
//   id?: string;
//   taskId?: string;
//   taskTitle: string;
//   description?: string;
//   dueDate: string;
//   projectId: string;
//   reporterId: string;
//   assigneeIds: string[];
//   priority: number;
//   status?: number;
//   createdAt?: string;
//   project?: Project;
//   reporter?: User;
//   assignees?: User[];
// }