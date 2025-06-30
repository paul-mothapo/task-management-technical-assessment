import React from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard/index';
import { ViewMode } from '@/hooks/useViewMode';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './common/Button';
import { cn } from '@/utils/cn';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  viewMode: ViewMode;
  currentPage: number;
  totalTasks: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onEditTask,
  onDeleteTask,
  viewMode,
  currentPage,
  totalTasks,
  limit,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-500">
          No tasks found. Start by creating your first task to get organized!
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalTasks / limit);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'
        )}
      >
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            viewMode={viewMode}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="ghost"
            size="sm"
            icon={ChevronLeft}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn('!p-2', currentPage === 1 && 'text-gray-400 cursor-not-allowed')}
            aria-label="Previous page"
          />

          <span className="text-sm text-gray-600 min-w-[100px] text-center">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            icon={ChevronRight}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn('!p-2', currentPage === totalPages && 'text-gray-400 cursor-not-allowed')}
            aria-label="Next page"
          />
        </div>
      )}
    </div>
  );
};
