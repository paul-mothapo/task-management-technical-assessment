import React from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard/index';
import { ViewMode } from '@/hooks/useViewMode';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalTasks / limit);

  return (
    <div className="space-y-6">
      <div className={
        viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {tasks.map((task) => (
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
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}; 