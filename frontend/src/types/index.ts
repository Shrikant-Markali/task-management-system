export type TaskStatus = 'BACKLOG' | 'TODO' | 'DOING' | 'COMPLETED' | 'ONHOLD';
export type Priority = 'NONE' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Label {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  projectId: string | null;
  assigneeId: string | null;
  assignee?: { id: string; fullName: string; avatarSeed: string } | null;
  dueDateStart: string | null;
  dueDateEnd: string | null;
  createdAt: string;
  updatedAt: string;
  labels: Label[];
  subtasks?: unknown[];
  comments?: unknown[];
  activities?: unknown[];
}