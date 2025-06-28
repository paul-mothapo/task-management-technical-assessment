import { LayoutGrid, ListTodo } from 'lucide-react';
import { TaskStatus } from '@/types';

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
      <h2 className="text-2xl font-bold text-gray-900">
        {getStatusTitle(activeStatus)}
      </h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => toggleViewMode('list')}
          className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          aria-label="List view"
        >
          <ListTodo size={20} />
        </button>
        <button
          onClick={() => toggleViewMode('grid')}
          className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          aria-label="Grid view"
        >
          <LayoutGrid size={20} />
        </button>
      </div>
    </div>
  );
}; 