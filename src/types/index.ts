export type Priority = 'low' | 'medium' | 'high';
export type Status   = 'todo' | 'in_progress' | 'done';
export type SortKey  = 'order' | 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDir  = 'asc' | 'desc';
export type Theme    = 'light' | 'dark';
export type WithChildren<T = object> = T & { children?: React.ReactNode };
export type Id = string;

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;     
  createdAt: string;   
  updatedAt: string;    
  order: number;        
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;     
}

export interface Filters {
  query: string;
  status: Status | 'all';
  priority: Priority | 'all';
  sortBy: SortKey;
  sortDir: SortDir;
}


export interface TaskItemProps {
  task: Task;
  onUpdate: (id: Id, patch: Partial<Task>) => void;
  onRemove: (id: Id) => void;
}

export interface TaskListProps {
  tasks: Task[];
  onAdd: (t: Task) => void;
  onUpdate: (id: Id, patch: Partial<Task>) => void;
  onRemove: (id: Id) => void;
}

export interface TaskFormProps {
  nextOrder: number;                       
  onAdd: (t: Task) => void;                
  editing?: Task | null;                   
  onSaveEdit?: (id: Id, patch: Partial<Task>) => void;
  onCancelEdit?: () => void;
}

export interface TaskFilterProps {
  value: Filters;
  onChange: (f: Filters) => void;
  onReset?: () => void;
}

export interface DashboardProps {
  tasks: Task[];
  filters: Filters;
  theme: Theme;
  onAdd: (t: Task) => void;
  onUpdate: (id: Id, patch: Partial<Task>) => void;
  onRemove: (id: Id) => void;
  onChangeFilters: (f: Filters) => void;
  onChangeTheme?: (t: Theme) => void;
}

