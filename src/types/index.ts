// Export all types from their respective modules
export * from './todo';
export * from './userData';
export * from './modal';

// Common utility types
export type ApiResponse<T = any> = {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
};

// Filter types
export type TodoFilter = {
  completed?: boolean;
  projectId?: string;
  priority?: number;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
};

export type ProjectFilter = {
  isArchived?: boolean;
  isInbox?: boolean;
  search?: string;
};

// Sort options
export type TodoSortOption = 
  | 'dueDate'
  | 'priority'
  | 'createdAt'
  | 'updatedAt'
  | 'sortOrder'
  | 'description';

export type ProjectSortOption = 
  | 'name'
  | 'createdAt'
  | 'updatedAt'
  | 'sortOrder';

// Form validation types
export type ValidationError = {
  field: string;
  message: string;
};

export type FormState<T = any> = {
  data: T;
  errors: ValidationError[];
  isSubmitting: boolean;
  isDirty: boolean;
};