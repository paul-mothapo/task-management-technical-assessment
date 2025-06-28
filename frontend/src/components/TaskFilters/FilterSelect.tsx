import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  id,
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 