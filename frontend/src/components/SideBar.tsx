import { Task } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import {
  LogOut,
  User,
  CheckCircle2,
  Clock,
  ListTodo,
  AlertCircle,
  PlusIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './common/Button';
import { cn } from '@/utils/cn';

interface SideBarProps {
  tasks: Task[];
  activeStatus: Task['status'] | 'all';
  onStatusFilter: (status: Task['status'] | 'all') => void;
  onAddNewTask: () => void;
}

// @sidebar
export const SideBar = ({ tasks, activeStatus, onStatusFilter, onAddNewTask }: SideBarProps) => {
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const navigationItems = [
    {
      label: 'All Tasks',
      icon: ListTodo,
      status: 'all',
      count: tasks.length,
    },
    {
      label: 'Pending',
      icon: Clock,
      status: 'pending',
      count: tasks.filter(t => t.status === 'pending').length,
    },
    {
      label: 'In Progress',
      icon: AlertCircle,
      status: 'in_progress',
      count: tasks.filter(t => t.status === 'in_progress').length,
    },
    {
      label: 'Completed',
      icon: CheckCircle2,
      status: 'completed',
      count: tasks.filter(t => t.status === 'completed').length,
    },
  ];

  return (
    <div
      className={cn(
        'bg-white flex flex-col transition-all duration-300 relative',
        isExpanded ? 'w-64' : 'w-20'
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        icon={isExpanded ? ChevronLeft : ChevronRight}
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 !p-1 bg-white shadow-md border hover:bg-gray-50 rounded-full"
      />

      <div className="p-6 border-b flex items-center">
        <h1
          className={cn('text-xl font-bold text-gray-800 truncate', !isExpanded && 'scale-0 w-0')}
        >
          Task Manager
        </h1>
        {!isExpanded && <ListTodo className="mx-auto" size={24} />}
      </div>

      <div className="flex-grow p-4">
        <nav className="space-y-1">
          {navigationItems.map(item => (
            <Button
              key={item.status}
              variant={activeStatus === item.status ? 'primary' : 'ghost'}
              onClick={() => onStatusFilter(item.status as Task['status'] | 'all')}
              className={cn(
                'w-full !justify-between !px-4 !py-2',
                !isExpanded && '!justify-center'
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                {isExpanded && <span>{item.label}</span>}
              </div>
              {isExpanded && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {item.count}
                </span>
              )}
            </Button>
          ))}
        </nav>

        <div className="mt-8">
          <Button
            variant="primary"
            icon={PlusIcon}
            onClick={onAddNewTask}
            className={cn('w-full', isExpanded ? 'gap-2' : '!justify-center')}
            title={!isExpanded ? 'Add New Task' : undefined}
          >
            {isExpanded && 'Add New Task'}
          </Button>
        </div>
      </div>

      <div className="border-t p-4">
        <div className={cn('flex items-center mb-4', isExpanded ? 'gap-3' : 'justify-center')}>
          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white flex-shrink-0">
            <User size={20} />
          </div>
          {isExpanded && (
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900 truncate">{user?.name}</h3>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            icon={LogOut}
            onClick={logout}
            className={cn('w-full', isExpanded ? 'gap-2' : '!justify-center')}
            title={!isExpanded ? 'Logout' : undefined}
          >
            {isExpanded && 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
};
