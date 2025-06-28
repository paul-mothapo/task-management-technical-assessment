import { useEffect, useState } from 'react';
import { Task, TaskFilters as TaskFiltersType, TaskStatus } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { useViewMode } from '@/hooks/useViewMode';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { SideBar } from '@/components/SideBar';
import { 
  LayoutGrid,
  ListTodo,
} from 'lucide-react';

type TaskFormData = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const { viewMode, toggleViewMode } = useViewMode('list');
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeStatus, setActiveStatus] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  const handleCreateOrUpdateTask = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Task operation failed:', error);
    }
  };

  const handleOpenModal = (task?: Task) => {
    setEditingTask(task ?? null);
    setOpenTaskModal(true);
  };

  const handleCloseModal = () => {
    setOpenTaskModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleStatusFilter = (status: TaskStatus | 'all') => {
    setActiveStatus(status);
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status
    }));
  };

  const getStatusTitle = (status: TaskStatus | 'all'): string => {
    if (status === 'all') {
      return `Hey ${user?.name}! How are you doing today?`;
    }
    return status === TaskStatus.IN_PROGRESS 
      ? 'In Progress' 
      : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="flex h-screen">
      <SideBar 
        tasks={tasks}
        activeStatus={activeStatus}
        onStatusFilter={handleStatusFilter}
        onAddNewTask={() => handleOpenModal()}
      />

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
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
          <div className='bg-neutral-100 rounded-lg p-4'>
            <TaskFilters
              filters={filters}
              onFilterChange={setFilters}
            />

            <TaskList
              tasks={tasks}
              loading={loading}
              onEditTask={handleOpenModal}
              onDeleteTask={handleDeleteTask}
              viewMode={viewMode}
            />

            <TaskForm
              open={openTaskModal}
              onClose={handleCloseModal}
              onSubmit={handleCreateOrUpdateTask}
              editingTask={editingTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 