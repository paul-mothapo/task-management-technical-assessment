import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { Task, TaskFilters, Category } from '@/types';
import { TaskFormData } from '@/constants/formConstants';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
  });

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data.categories);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to fetch categories';
      toast.error(errorMessage);
    }
  }, []);

  const fetchTasks = useCallback(
    async (filters?: TaskFilters) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.priority) params.append('priority', filters.priority);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
        if (filters?.dateRange) params.append('dateRange', filters.dateRange);
        params.append('page', (filters?.page || 1).toString());
        params.append('limit', (filters?.limit || 6).toString());

        const { data } = await axios.get('/api/tasks', { params });

        setTasks(data.tasks);
        setPagination({
          total: data.total,
          page: data.page,
          limit: data.limit,
        });

        // @fetch categories if not already loaded
        if (categories.length === 0) {
          await fetchCategories();
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Failed to fetch tasks';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [categories.length, fetchCategories]
  );

  const createTask = useCallback(async (taskData: TaskFormData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/tasks', taskData);
      toast.success('Task created successfully');
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to create task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, taskData: Partial<Task>) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.put(`/api/tasks/${taskId}`, taskData);
      toast.success('Task updated successfully');
      return data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`/api/tasks/${taskId}`);
      toast.success('Task deleted successfully');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    categories,
    loading,
    error,
    pagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
};
