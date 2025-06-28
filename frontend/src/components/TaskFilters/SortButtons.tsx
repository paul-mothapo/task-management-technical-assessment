import React from "react";
import { ArrowUpDown, Calendar } from "lucide-react";
import { SortBy, SortOrder } from "@/types";

interface SortButtonsProps {
  sortBy: SortBy | undefined;
  sortOrder: SortOrder | undefined;
  onSortChange: (sortBy: SortBy) => void;
}

export const SortButtons: React.FC<SortButtonsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Sort By
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onSortChange(SortBy.CREATED_AT)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors duration-200 ${
            sortBy === SortBy.CREATED_AT
              ? "bg-neutral-900 text-white border-neutral-900"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Calendar size={16} />
          <span>Date</span>
          {sortBy === SortBy.CREATED_AT && (
            <ArrowUpDown
              size={16}
              className={`transform transition-transform duration-200 ${
                sortOrder === SortOrder.DESC ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
        <button
          onClick={() => onSortChange(SortBy.PRIORITY)}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors duration-200 ${
            sortBy === SortBy.PRIORITY
              ? "bg-neutral-900 text-white border-neutral-900"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span>Priority</span>
          {sortBy === SortBy.PRIORITY && (
            <ArrowUpDown
              size={16}
              className={`transform transition-transform duration-200 ${
                sortOrder === SortOrder.DESC ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
      </div>
    </div>
  );
}; 