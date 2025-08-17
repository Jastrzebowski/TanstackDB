// Data schemas for our TanStack DB collections

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

// Computed types for live queries
export interface TaskWithProject extends Task {
  project: Project;
}

export interface TaskWithAssignee extends Task {
  assignee?: User;
}

export interface ProjectStats {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionPercentage: number;
}

export interface UserStats {
  userId: string;
  userName: string;
  assignedTasks: number;
  completedTasks: number;
  overdueTasks: number;
}
