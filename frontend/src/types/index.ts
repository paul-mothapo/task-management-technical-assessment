export interface User {
  id: string;
  email: string;
  name: string;
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum SortBy {
  PRIORITY = 'priority',
  CREATED_AT = 'createdAt'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export type DateRange = 
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  dateRange?: DateRange;
} 