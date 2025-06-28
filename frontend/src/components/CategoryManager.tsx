import React, { useState } from 'react';
import { Category } from '@/types';
import { Plus, X } from 'lucide-react';
import { Button } from './common/Button';

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory: (name: string) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCreateCategory,
  onDeleteCategory,
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await onCreateCategory(newCategory.trim());
      setNewCategory('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Button
          variant="ghost"
          size="sm"
          icon={Plus}
          onClick={() => setIsAdding(true)}
          className="text-neutral-600 hover:text-neutral-900"
        />
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            autoFocus
          />
          <Button type="submit" size="sm">
            Add
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
            Cancel
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {categories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
          >
            <span>{category.name}</span>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={() => onDeleteCategory(category.id)}
              className="text-red-600 hover:text-red-800"
              title="Delete category"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
