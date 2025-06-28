import React from 'react';
import { ArrowUpDown, Calendar, Clock, AlertCircle } from 'lucide-react';
import { SortBy, SortOrder } from '@/types';

interface SortOption {
  value: SortBy;
  label: string;
  icon: React.ReactNode;
}

interface SortButtonsProps {
  sortBy: SortBy | undefined;
  sortOrder: SortOrder | undefined;
  onSortChange: (sortBy: SortBy) => void;
  options?: SortOption[];
}

const DEFAULT_OPTIONS: SortOption[] = [
  {
    value: SortBy.CREATED_AT,
    label: 'Created',
    icon: <Clock size={14} />,
  },
  {
    value: SortBy.DUE_DATE,
    label: 'Due Date',
    icon: <Calendar size={14} />,
  },
  {
    value: SortBy.PRIORITY,
    label: 'Priority',
    icon: <AlertCircle size={14} />,
  },
];

export const SortButtons: React.FC<SortButtonsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  options = DEFAULT_OPTIONS,
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
      <div className="flex flex-col gap-1.5">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`flex items-center justify-between px-2.5 py-1.5 border rounded-md transition-all duration-200 ${
              sortBy === option.value
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {option.icon}
              <span className="text-sm">{option.label}</span>
            </div>
            {sortBy === option.value && (
              <ArrowUpDown
                size={14}
                className={`transform transition-transform duration-300 ease-in-out ${
                  sortOrder === SortOrder.DESC ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
