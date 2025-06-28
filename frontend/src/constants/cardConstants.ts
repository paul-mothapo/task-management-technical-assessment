import { TaskPriority, TaskStatus } from '@/types';

export const PRIORITY_COLORS = {
  [TaskPriority.LOW]: 'bg-green-100 text-green-800 border border-green-300',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800 border border-red-300',
} as const;

export const STATUS_COLORS = {
  [TaskStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border border-blue-300',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800 border border-green-300',
} as const; 