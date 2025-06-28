import React from 'react';
import { Task } from '@/types';
import { TaskCard } from './TaskCard/index';
import { ViewMode } from '@/hooks/useViewMode';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  viewMode: ViewMode;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onEditTask,
  onDeleteTask,
  viewMode,
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

  return (
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
  );
}; 