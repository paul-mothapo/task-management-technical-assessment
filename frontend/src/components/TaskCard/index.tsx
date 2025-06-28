import React from 'react';
import { Task } from '@/types';
import { Clock } from 'lucide-react';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/constants/cardConstants';
import { formatDate } from './utils';
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

  const renderTimestamp = (label: string, timestamp: string) => (
    <div className="flex items-center">
      <Clock size={12} className="mr-1" />
      <span>{label}: {formatDate(timestamp)}</span>
    </div>
  );

  return (
    <div 
      className={`bg-white rounded-lg border border-neutral-200 hover:shadow transition-shadow duration-200 ${
        isListView ? 'flex items-center justify-between p-4' : 'flex flex-col p-4'
      }`}
    >
      <div className={isListView ? 'flex-1' : 'flex-grow'}>
        <div className={isListView ? 'flex items-center justify-between' : ''}>
          <div className={isListView ? 'flex-1' : ''}>
            <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
            <p className={`text-gray-600 ${isListView ? 'mb-0' : 'mb-4'}`}>
              {task.description}
            </p>
            <div className="flex flex-col space-y-1 text-[12px] text-gray-500 mt-2">
              {renderTimestamp('Created', task.created_at)}
              {task.updated_at !== task.created_at && 
                renderTimestamp('Updated', task.updated_at)}
            </div>
          </div>
          {isListView && (
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <TaskBadge
                  label={task.status}
                  colorClasses={STATUS_COLORS[task.status]}
                />
                <TaskBadge
                  label={task.priority}
                  colorClasses={PRIORITY_COLORS[task.priority]}
                />
              </div>
              <div className="flex gap-2">
                <ActionButton
                  onClick={() => onEdit(task)}
                  label="edit"
                  icon={<Pencil size={16} />}
                  colorClasses="text-neutral-600 hover:bg-neutral-50"
                />
                <ActionButton
                  onClick={() => onDelete(task.id)}
                  label="delete"
                  icon={<Trash2 size={16} />}
                  colorClasses="text-red-600 hover:bg-red-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {!isListView && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
          <div className="flex gap-2">
            <TaskBadge
              label={task.status}
              colorClasses={STATUS_COLORS[task.status]}
            />
            <TaskBadge
              label={task.priority}
              colorClasses={PRIORITY_COLORS[task.priority]}
            />
          </div>
          <div className="flex gap-2">
            <ActionButton
              onClick={() => onEdit(task)}
              label="edit"
              icon={<Pencil size={16} />}
              colorClasses="text-neutral-600 hover:bg-neutral-50"
            />
            <ActionButton
              onClick={() => onDelete(task.id)}
              label="delete"
              icon={<Trash2 size={16} />}
              colorClasses="text-red-600 hover:bg-red-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}; 