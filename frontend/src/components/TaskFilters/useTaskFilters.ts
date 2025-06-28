import { useState, useCallback } from 'react';
import { TaskFilters, TaskStatus, TaskPriority, SortBy, SortOrder, DateRange } from '@/types';

const DEFAULT_FILTERS: TaskFilters = {
  status: undefined,
  priority: undefined,
  dateRange: undefined,
  sortBy: undefined,
  sortOrder: undefined,
  page: 1,
  limit: 10,
};

export const useTaskFilters = (
  initialFilters: TaskFilters,
  onFilterChange: (filters: TaskFilters) => void
) => {
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);

  const handleStatusChange = useCallback(
    (status: string) => {
      const newFilters = {
        ...filters,
        status: status ? (status as TaskStatus) : undefined,
        page: 1, // @reset page when filter changes
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handlePriorityChange = useCallback(
    (priority: string) => {
      const newFilters = {
        ...filters,
        priority: priority ? (priority as TaskPriority) : undefined,
        page: 1,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handleDateRangeChange = useCallback(
    (dateRange: string) => {
      const newFilters = {
        ...filters,
        dateRange: dateRange ? (dateRange as DateRange) : undefined,
        page: 1,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handleSortChange = useCallback(
    (newSortBy: SortBy) => {
      const newFilters = {
        ...filters,
        sortBy: newSortBy,
        sortOrder:
          newSortBy === filters.sortBy
            ? filters.sortOrder === SortOrder.ASC
              ? SortOrder.DESC
              : SortOrder.ASC
            : SortOrder.DESC,
        page: 1,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const handleClearFilters = useCallback(() => {
    const newFilters = {
      ...DEFAULT_FILTERS,
      page: filters.page,
      limit: filters.limit,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters.page, filters.limit, onFilterChange]);

  return {
    filters,
    handleStatusChange,
    handlePriorityChange,
    handleDateRangeChange,
    handleSortChange,
    handleClearFilters,
  };
};
