import { useState, useCallback } from "react";
import { TaskFilters, TaskStatus, TaskPriority, SortBy, SortOrder, DateRange } from "@/types";

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
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  return {
    filters,
    handleStatusChange,
    handlePriorityChange,
    handleDateRangeChange,
    handleSortChange,
  };
}; 