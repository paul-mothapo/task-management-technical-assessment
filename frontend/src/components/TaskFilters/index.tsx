import React from "react";
import { TaskFilters as TaskFiltersType } from "@/types";
import { FilterSelect } from "./FilterSelect";
import { SortButtons } from "./SortButtons";
import { useTaskFilters } from "./useTaskFilters";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, DATE_RANGE_OPTIONS } from "@/constants/filterConstants";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: TaskFiltersType) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters: initialFilters,
  onFilterChange,
}) => {
  const {
    filters,
    handleStatusChange,
    handlePriorityChange,
    handleDateRangeChange,
    handleSortChange,
  } = useTaskFilters(initialFilters, onFilterChange);

  return (
    <div className="bg-white rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterSelect
          id="status"
          label="Status Filter"
          value={filters.status || ""}
          options={STATUS_OPTIONS}
          onChange={handleStatusChange}
        />
        <FilterSelect
          id="priority"
          label="Priority Filter"
          value={filters.priority || ""}
          options={PRIORITY_OPTIONS}
          onChange={handlePriorityChange}
        />
        <FilterSelect
          id="dateRange"
          label="Date Range"
          value={filters.dateRange || ""}
          options={DATE_RANGE_OPTIONS}
          onChange={handleDateRangeChange}
        />
        <SortButtons
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
}; 