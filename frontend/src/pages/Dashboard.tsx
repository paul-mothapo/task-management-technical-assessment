import { useEffect, useState } from 'react';
import { Task, TaskFilters as TaskFiltersType, TaskStatus } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { useViewMode } from '@/hooks/useViewMode';
import { useCategories } from '@/hooks/useCategories';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { SideBar } from '@/components/SideBar';
import { Header } from '@/components/Header';
import { INITIAL_FILTERS } from '@/constants/dashboardConstants';
import { TaskFormData } from '@/constants/formConstants';

export const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, pagination, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const { categories, fetchCategories, createCategory, deleteCategory } = useCategories();
  const { viewMode, toggleViewMode } = useViewMode('list');
  const [filters, setFilters] = useState<TaskFiltersType>(INITIAL_FILTERS);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeStatus, setActiveStatus] = useState<TaskStatus | 'all'>('all');

  useEffect(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
      limit: prev.limit,
    }));
  };

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
      limit: newFilters.limit || prev.limit,
    }));
  };

  const handleStatusFilter = (status: TaskStatus | 'all') => {
    setActiveStatus(status);
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1,
      limit: prev.limit,
    }));
  };

  const handleCreateOrUpdateTask = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      handleCloseModal();
      fetchTasks(filters);
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
        const isLastItemOnPage = tasks.length === 1 && pagination.page > 1;
        const newPage = isLastItemOnPage ? pagination.page - 1 : pagination.page;
        setFilters(prev => ({
          ...prev,
          page: newPage,
        }));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
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
          <Header
            userName={user?.name}
            activeStatus={activeStatus}
            viewMode={viewMode}
            toggleViewMode={toggleViewMode}
          />
          <div className="bg-neutral-100 rounded-lg p-4">
            <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

            <TaskList
              tasks={tasks}
              loading={loading}
              onEditTask={handleOpenModal}
              onDeleteTask={handleDeleteTask}
              viewMode={viewMode}
              currentPage={pagination.page}
              totalTasks={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
            />

            <TaskForm
              open={openTaskModal}
              onClose={handleCloseModal}
              onSubmit={handleCreateOrUpdateTask}
              editingTask={editingTask}
              categories={categories}
              onCreateCategory={createCategory}
              onDeleteCategory={deleteCategory}
              fetchCategories={fetchCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
