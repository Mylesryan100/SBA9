export type Priority = 'low' | 'medium' | 'high';
export type Status   = 'todo' | 'in_progress' | 'done';
export type SortKey  = 'order' | 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDir  = 'asc' | 'desc';
export type Theme    = 'light' | 'dark';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    priority: Priority;
    createdAt: string;    
    updatedAt: string;    
    order: number;
  }

export interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export interface TaskFilterProps {
  onFilterChange: (filters: {
    status?: TaskStatus;
    priority?: 'low' | 'medium' | 'high';
  }) => void;
}

export interface DashboardProps {
  tasks: Task[];
}