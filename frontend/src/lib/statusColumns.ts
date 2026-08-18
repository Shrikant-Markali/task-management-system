import type { TaskStatus } from '@/types';

export interface StatusColumn {
  key: TaskStatus;
  label: string;
  includesStatuses: TaskStatus[];
}

export const STATUS_COLUMNS: StatusColumn[] = [
  { key: 'TODO', label: 'To Do', includesStatuses: ['BACKLOG', 'TODO'] },
  { key: 'DOING', label: 'Doing', includesStatuses: ['DOING'] },
  { key: 'COMPLETED', label: 'Completed', includesStatuses: ['COMPLETED'] },
  { key: 'ONHOLD', label: 'On Hold', includesStatuses: ['ONHOLD'] },
];