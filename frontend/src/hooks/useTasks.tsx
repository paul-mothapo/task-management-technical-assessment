import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { Task, TaskFilters } from '@/types';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Applying filters:', filters);
      
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters?.dateRange) params.append('dateRange', filters.dateRange);

      console.log('Request params:', Object.fromEntries(params));
      const { data } = await axios.get('/api/tasks', { params });
      console.log('Tasks received from API:', data.tasks);
      if (data.tasks.length > 0) {
        console.log('Sample task dates from API:', {
          task_id: data.tasks[0].id,
          created_at: data.tasks[0].created_at,
          updated_at: data.tasks[0].updated_at,
          created_at_type: typeof data.tasks[0].created_at,
          updated_at_type: typeof data.tasks[0].updated_at
        });
      }
      setTasks(data.tasks);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/tasks', taskData);
      setTasks(prev => [...prev, data]);
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
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...data } : task));
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
      setTasks(prev => prev.filter(task => task.id !== taskId));
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
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}; 