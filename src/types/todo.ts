// Project types
export type ProjectData = {
  id: string;
  name: string;
  color: string;
  isInbox: boolean;
  isArchived: boolean;
  sortOrder: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

// Label types
export type LabelData = {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: Date;
};

export type TodoLabelData = {
  todoId: string;
  labelId: string;
  createdAt: Date;
  todo: TodoData;
  label: LabelData;
};

// SubTodo types
export type SubtaskData = {
  id: string;
  description: string;
  completed: boolean;
  checked: boolean; // For frontend compatibility
  sortOrder: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  todoId: string;
};

// Todo types
export type TodoData = {
  id: string;
  description: string;
  completed: boolean;
  checked: boolean; // For frontend compatibility
  dueDate: Date | string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  priority: number;
  completedAt: Date | null;
  projectId: string;
  userId: string;
  subTodos: SubtaskData[];
  labels?: TodoLabelData[];
  project?: ProjectData;
};

// AI Usage types
export type AIUsageData = {
  id: string;
  userId: string;
  model: string;
  category: string;
  tokens: number;
  cost: number;
  createdAt: Date;
};

// Form types for creating/updating
export type CreateTodoData = {
  description: string;
  dueDate?: Date;
  projectId?: string;
  priority?: number;
  sortOrder?: number;
};

export type UpdateTodoData = {
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  priority?: number;
  sortOrder?: number;
  projectId?: string;
};

export type CreateSubTodoData = {
  todoId: string;
  description: string;
  sortOrder?: number;
};

export type UpdateSubTodoData = {
  description?: string;
  completed?: boolean;
  sortOrder?: number;
};

export type CreateProjectData = {
  name: string;
  color?: string;
  sortOrder?: number;
};

export type UpdateProjectData = {
  name?: string;
  color?: string;
  isArchived?: boolean;
  sortOrder?: number;
};

// API Response types
export type TodoResponse = {
  data: TodoData[];
  message?: string;
};

export type ProjectResponse = {
  data: ProjectData[];
  message?: string;
};

// Priority levels
export enum TodoPriority {
  VERY_LOW = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4
}

// Priority labels for display
export const PRIORITY_LABELS = {
  [TodoPriority.VERY_LOW]: 'Very Low',
  [TodoPriority.LOW]: 'Low',
  [TodoPriority.MEDIUM]: 'Medium',
  [TodoPriority.HIGH]: 'High'
} as const;

// Priority colors for UI
export const PRIORITY_COLORS = {
  [TodoPriority.VERY_LOW]: '#87919E',
  [TodoPriority.LOW]: '#134074',
  [TodoPriority.MEDIUM]: '#E0CA3C',
  [TodoPriority.HIGH]: '#990033'
} as const;
