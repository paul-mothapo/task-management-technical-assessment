import { Task, TaskStatus, TaskPriority, Category } from '@/types';

export interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  editingTask: Task | null;
  categories: Category[];
}

export type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  category_ids?: number[];
};

export const DEFAULT_VALUES: TaskFormData = {
  title: '',
  description: '',
  status: TaskStatus.PENDING,
  priority: TaskPriority.MEDIUM,
  due_date: undefined,
  category_ids: [],
};

export const STATUS_OPTIONS = [
  { value: TaskStatus.PENDING, label: 'Pending' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.COMPLETED, label: 'Completed' },
];

export const PRIORITY_OPTIONS = [
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.HIGH, label: 'High' },
];

export const LOGIN_FORM = {
  EMAIL: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  PASSWORD: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters',
    },
  },
} as const;

export const LOGIN_TEXTS = {
  TITLE: 'Welcome Back!',
  SUBTITLE: 'Sign in to your account, to keep managing your tasks',
  EMAIL_PLACEHOLDER: 'Email Address',
  PASSWORD_PLACEHOLDER: 'Password',
  SIGN_IN: 'Sign In',
  REGISTER_PROMPT: "Don't have an account? Sign Up",
} as const;

export const REGISTER_FORM = {
  NAME: {
    required: 'Name is required',
  },
  EMAIL: LOGIN_FORM.EMAIL,
  PASSWORD: LOGIN_FORM.PASSWORD,
} as const;

export const REGISTER_TEXTS = {
  TITLE: 'Create Account',
  SUBTITLE: 'Sign up to start managing your tasks effectively',
  NAME_PLACEHOLDER: 'Full Name',
  EMAIL_PLACEHOLDER: 'Email Address',
  PASSWORD_PLACEHOLDER: 'Password',
  SIGN_UP: 'Sign Up',
  LOGIN_PROMPT: 'Already have an account? Sign In',
} as const;
