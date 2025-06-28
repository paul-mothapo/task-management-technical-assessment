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
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

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
      count: tasks.length 
    },
    { 
      label: 'Pending', 
      icon: Clock, 
      status: 'pending',
      count: tasks.filter(t => t.status === 'pending').length
    },
    { 
      label: 'In Progress', 
      icon: AlertCircle, 
      status: 'in_progress',
      count: tasks.filter(t => t.status === 'in_progress').length
    },
    { 
      label: 'Completed', 
      icon: CheckCircle2, 
      status: 'completed',
      count: tasks.filter(t => t.status === 'completed').length
    }
  ];

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-20'} bg-white flex flex-col transition-all duration-300 relative`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-white rounded-full p-1 shadow-md border hover:bg-gray-50"
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="p-6 border-b flex items-center">
        <h1 className={`text-xl font-bold text-gray-800 truncate ${!isExpanded && 'scale-0 w-0'}`}>
          Task Manager
        </h1>
        {!isExpanded && <ListTodo className="mx-auto" size={24} />}
      </div>

      <div className="flex-grow p-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.status}
              onClick={() => onStatusFilter(item.status as Task['status'] | 'all')}
              className={`w-full flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} px-4 py-2 text-sm transition-colors duration-200 ${
                activeStatus === item.status
                  ? 'bg-neutral-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={18} />
                {isExpanded && <span>{item.label}</span>}
              </div>
              {isExpanded && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <button
            onClick={onAddNewTask}
            className={`w-full flex items-center ${isExpanded ? 'justify-center space-x-2' : 'justify-center'} bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 transition-colors duration-200`}
            title={!isExpanded ? 'Add New Task' : undefined}
          >
            <PlusIcon className="w-5 h-5" />
            {isExpanded && <span>Add New Task</span>}
          </button>
        </div>
      </div>

      <div className="border-t p-4">
        <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} mb-4`}>
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
          <button
            onClick={logout}
            className={`w-full flex items-center ${isExpanded ? 'justify-center space-x-2' : 'justify-center'} px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100`}
            title={!isExpanded ? 'Logout' : undefined}
          >
            <LogOut size={16} />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};