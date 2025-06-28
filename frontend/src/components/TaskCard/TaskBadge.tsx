import React from 'react';

interface TaskBadgeProps {
  label: string;
  colorClasses: string;
}

export const TaskBadge: React.FC<TaskBadgeProps> = ({ label, colorClasses }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colorClasses}`}>
    {label}
  </span>
); 