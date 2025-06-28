import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  DEFAULT_VALUES,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  TaskFormData,
  TaskFormProps,
} from '@/constants/formConstants';
import { Category } from '@/types';
import { X, Check } from 'lucide-react';

export const TaskForm: React.FC<
  TaskFormProps & {
    onCreateCategory: (name: string) => Promise<void>;
    onDeleteCategory: (id: number) => Promise<void>;
    fetchCategories: () => Promise<void>;
  }
> = ({
  open,
  onClose,
  onSubmit,
  editingTask,
  categories = [],
  onCreateCategory,
  fetchCategories,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    defaultValues: DEFAULT_VALUES,
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null);
  const selectedCategoryIds = (watch('category_ids') || []).map(id => Number(id));

  // Get selected categories objects for display
  const selectedCategories = useMemo(
    () => categories.filter(cat => selectedCategoryIds.includes(cat.id)),
    [categories, selectedCategoryIds]
  );

  // Filter suggestions based on input
  const categorySuggestions = useMemo(() => {
    if (!categoryInput.trim()) return [];
    const input = categoryInput.toLowerCase().trim();
    return categories.filter(
      cat => cat.name.toLowerCase().includes(input) && !selectedCategoryIds.includes(cat.id)
    );
  }, [categories, categoryInput, selectedCategoryIds]);

  useEffect(() => {
    if (editingTask) {
      setValue('title', editingTask.title);
      setValue('description', editingTask.description);
      setValue('status', editingTask.status);
      setValue('priority', editingTask.priority);
      setValue(
        'due_date',
        editingTask.due_date ? new Date(editingTask.due_date).toISOString().split('T')[0] : ''
      );
      setValue(
        'category_ids',
        editingTask.categories.map(c => c.id)
      );
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [editingTask, setValue, reset]);

  const handleClose = () => {
    reset();
    setCategoryInput('');
    setCategoryError(null);
    setCategorySuccess(null);
    onClose();
  };

  const handleCreateCategory = async () => {
    try {
      setCategoryError(null);
      setCategorySuccess(null);
      if (!categoryInput.trim()) {
        setCategoryError('Category name cannot be empty');
        return;
      }

      await onCreateCategory(categoryInput.trim());
      await fetchCategories();
      setCategorySuccess(`Category "${categoryInput.trim()}" created successfully`);
      setCategoryInput('');
      setTimeout(() => {
        setCategorySuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to create category:', error);
      setCategoryError(error instanceof Error ? error.message : 'Failed to create category');
    }
  };

  const handleSelectCategory = (category: Category) => {
    const currentIds = selectedCategoryIds || [];
    setValue('category_ids', [...currentIds, category.id]);
    setCategoryInput('');
    setShowSuggestions(false);
  };

  const handleRemoveCategory = (categoryId: number) => {
    const currentIds = selectedCategoryIds || [];
    setValue(
      'category_ids',
      currentIds.filter(id => id !== categoryId)
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Task Title"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Task Description"
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                {...register('description', {
                  required: 'Description is required',
                })}
              />
              {errors.description && (
                <p className="mt-1 text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                {...register('due_date')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Categories</label>

              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map(category => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-gray-100"
                  >
                    {category.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category.id)}
                      className="ml-1.5 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={e => {
                      setCategoryInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Type to search or add category"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  {categoryInput.trim() &&
                    !categorySuggestions.some(
                      cat => cat.name.toLowerCase() === categoryInput.toLowerCase().trim()
                    ) && (
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        className="px-3 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
                      >
                        Add New
                      </button>
                    )}
                </div>

                {showSuggestions && categorySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                    {categorySuggestions.map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleSelectCategory(category)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {categoryError && (
                <p className="text-red-500 text-sm flex items-center">
                  <X size={16} className="mr-1" />
                  {categoryError}
                </p>
              )}

              {categorySuccess && (
                <p className="text-green-600 text-sm flex items-center">
                  <Check size={16} className="mr-1" />
                  {categorySuccess}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                {...register('status')}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                {...register('priority')}
              >
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg transition-colors duration-200"
              >
                {editingTask ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
