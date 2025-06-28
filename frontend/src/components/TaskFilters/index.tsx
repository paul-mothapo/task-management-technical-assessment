import React, { useState, useRef } from 'react';
import { TaskFilters as TaskFiltersType } from '@/types';
import { FilterSelect } from './FilterSelect';
import { SortButtons } from './SortButtons';
import { useTaskFilters } from './useTaskFilters';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, DATE_RANGE_OPTIONS } from '@/constants/filterConstants';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useClickAway } from '@/hooks/useClickAway';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: TaskFiltersType) => void;
  className?: string;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters: initialFilters,
  onFilterChange,
  className = '',
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const moreFiltersRef = useRef<HTMLDivElement>(null);

  const {
    filters,
    handleStatusChange,
    handlePriorityChange,
    handleDateRangeChange,
    handleSortChange,
    handleClearFilters,
  } = useTaskFilters(initialFilters, onFilterChange);

  const hasActiveFilters = Boolean(
    filters.status || filters.priority || filters.dateRange || filters.sortBy
  );

  const hasActiveMoreFilters = Boolean(filters.dateRange || filters.sortBy);

  useClickAway(moreFiltersRef, () => setShowMoreFilters(false));

  return (
    <div className={`bg-white rounded-lg p-6 mb-8 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-start gap-4">
        {/* Main Filters */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-[280px]">
          <FilterSelect
            id="status"
            label=""
            value={filters.status || ''}
            options={STATUS_OPTIONS}
            onChange={handleStatusChange}
            placeholder="Select Status"
          />
          <FilterSelect
            id="priority"
            label=""
            value={filters.priority || ''}
            options={PRIORITY_OPTIONS}
            onChange={handlePriorityChange}
            placeholder="Select Priority"
          />
        </div>

        {/* More Filters Button and Popover */}
        <div className="relative" ref={moreFiltersRef}>
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              hasActiveMoreFilters
                ? 'border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            More Filters
            {showMoreFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {hasActiveMoreFilters && <span className="flex h-2 w-2 rounded-full bg-blue-500" />}
          </button>

          {/* More Filters Popover */}
          {showMoreFilters && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
              <div className="space-y-4">
                <FilterSelect
                  id="dateRange"
                  label="Date Range"
                  value={filters.dateRange || ''}
                  options={DATE_RANGE_OPTIONS}
                  onChange={handleDateRangeChange}
                  placeholder="Any Time"
                />
                <SortButtons
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
