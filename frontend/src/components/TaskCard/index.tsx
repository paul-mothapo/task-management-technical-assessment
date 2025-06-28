import React, { useEffect, useState } from 'react';
import { Task } from '@/types';
import { Clock } from 'lucide-react';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/constants/cardConstants';
import { formatDate, getResponsiveTimeFormat } from './utils';
import { TaskBadge } from './TaskBadge';
import { ActionButton } from './ActionButton';
import { Pencil, Trash2 } from 'lucide-react';
import { ViewMode } from '@/hooks/useViewMode';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  viewMode: ViewMode;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  viewMode 
}) => {
  const isListView = viewMode === 'list';
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isSmallScreen = screenWidth < 640;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getResponsiveSize = (): 'sm' | 'md' | 'lg' => {
    if (screenWidth < 640) return 'sm';
    if (screenWidth < 1024) return 'md';
    return 'lg';
  };

  const size = getResponsiveSize();
  const timeFormat = getResponsiveTimeFormat(screenWidth);

  const renderTimestamp = (label: string, timestamp: string) => (
    <div className="flex items-center">
      <Clock size={size === 'sm' ? 10 : 12} className="mr-1" />
      <span className={size === 'sm' ? 'text-[10px]' : 'text-xs'}>
        {screenWidth >= 640 && `${label}: `}{formatDate(timestamp, timeFormat)}
      </span>
    </div>
  );

  const renderBadges = () => (
    <div className="flex gap-1 sm:gap-2">
      <TaskBadge
        label={task.status}
        colorClasses={STATUS_COLORS[task.status]}
        size={size}
      />
      <TaskBadge
        label={task.priority}
        colorClasses={PRIORITY_COLORS[task.priority]}
        size={size}
      />
    </div>
  );

  const renderActions = () => (
    <div className="flex gap-1 sm:gap-2">
      <ActionButton
        onClick={() => onEdit(task)}
        label="edit"
        icon={<Pencil size={size === 'sm' ? 14 : 16} />}
        colorClasses="text-neutral-600 hover:bg-neutral-50"
        size={size}
      />
      <ActionButton
        onClick={() => onDelete(task.id)}
        label="delete"
        icon={<Trash2 size={size === 'sm' ? 14 : 16} />}
        colorClasses="text-red-600 hover:bg-red-50"
        size={size}
      />
    </div>
  );

  if (isListView) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 hover:shadow transition-shadow duration-200 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-semibold truncate ${size === 'sm' ? 'text-base' : 'text-lg'}`}>
            {task.title}
          </h3>
          {!isSmallScreen && renderActions()}
        </div>
        
        {isSmallScreen ? (
          <div className="mt-2 flex items-center justify-between">
            {renderBadges()}
            {renderActions()}
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 line-clamp-2 mb-2">
                {task.description}
              </p>
              <div className="flex flex-col space-y-1 text-gray-500">
                {renderTimestamp('Created', task.created_at)}
                {task.updated_at !== task.created_at && 
                  renderTimestamp('Updated', task.updated_at)}
              </div>
            </div>
            <div className="ml-4">
              {renderBadges()}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 hover:shadow transition-shadow duration-200 flex flex-col p-3 sm:p-4">
      <div className="flex-grow">
        <h3 className={`font-semibold truncate ${size === 'sm' ? 'text-base' : 'text-lg'} mb-2`}>
          {task.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 mb-4">
          {task.description}
        </p>
        <div className="flex flex-col space-y-1 text-gray-500 mt-2">
          {renderTimestamp('Created', task.created_at)}
          {task.updated_at !== task.created_at && 
            renderTimestamp('Updated', task.updated_at)}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-neutral-100">
        {renderBadges()}
        {renderActions()}
      </div>
    </div>
  );
};