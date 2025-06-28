import { TaskPriority, TaskStatus } from '@/types';

export const PRIORITY_COLORS = {
  [TaskPriority.LOW]: 'text-emerald-700 border border-emerald-200 bg-emerald-50',
  [TaskPriority.MEDIUM]: 'text-amber-700 border border-amber-200 bg-amber-50',
  [TaskPriority.HIGH]: 'text-rose-700 border border-rose-200 bg-rose-50',
} as const;

export const STATUS_COLORS = {
  [TaskStatus.PENDING]: 'text-neutral-800 border border-neutral-500',
  [TaskStatus.IN_PROGRESS]: 'text-neutral-800 border border-neutral-500',
  [TaskStatus.COMPLETED]: 'text-neutral-800 border border-neutral-500',
} as const;
