import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { Category } from '@/types';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data.categories);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to fetch categories';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (name: string) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/categories', { name });
      setCategories(prev => [...prev, data.category]);
      toast.success('Category created successfully');
      return data.category;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to create category';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/categories/${categoryId}`);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to delete category';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    deleteCategory,
  };
};
