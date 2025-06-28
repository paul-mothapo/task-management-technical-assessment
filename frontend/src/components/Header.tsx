import { LayoutGrid, ListTodo } from 'lucide-react';
import { TaskStatus } from '@/types';
import { Button } from './common/Button';

interface HeaderProps {
  userName?: string;
  activeStatus: TaskStatus | 'all';
  viewMode: 'list' | 'grid';
  toggleViewMode: (mode: 'list' | 'grid') => void;
}

export const Header = ({ userName, activeStatus, viewMode, toggleViewMode }: HeaderProps) => {
  const getStatusTitle = (status: TaskStatus | 'all'): string => {
    if (status === 'all') {
      return `Hey ${userName}! How are you doing today?`;
    }
    return status === TaskStatus.IN_PROGRESS
      ? 'In Progress'
      : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{getStatusTitle(activeStatus)}</h2>
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'list' ? 'primary' : 'ghost'}
          size="sm"
          icon={ListTodo}
          onClick={() => toggleViewMode('list')}
          className="!p-2"
          aria-label="List view"
        />
        <Button
          variant={viewMode === 'grid' ? 'primary' : 'ghost'}
          size="sm"
          icon={LayoutGrid}
          onClick={() => toggleViewMode('grid')}
          className="!p-2"
          aria-label="Grid view"
        />
      </div>
    </div>
  );
};
