
export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
}

export interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}