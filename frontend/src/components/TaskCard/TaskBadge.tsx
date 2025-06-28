import React from 'react';

interface TaskBadgeProps {
  label: string;
  colorClasses: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TaskBadge: React.FC<TaskBadgeProps> = ({ 
  label, 
  colorClasses,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <span 
      className={`rounded-full font-medium capitalize whitespace-nowrap ${sizeClasses[size]} ${colorClasses}`}
      title={label}
    >
      {label}
    </span>
  );
}; 