import React from 'react';

interface TaskBadgeProps {
  label: string;
  colorClasses: string;
  size?: 'sm' | 'md' | 'lg';
  showIndicator?: boolean;
}

export const TaskBadge: React.FC<TaskBadgeProps> = ({
  label,
  colorClasses,
  size = 'md',
  showIndicator = false,
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const indicatorSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`rounded-full font-medium capitalize whitespace-nowrap flex items-center ${sizeClasses[size]} ${colorClasses}`}
      title={label}
    >
      {showIndicator && (
        <span
          className={`${indicatorSizeClasses[size]} rounded-full mr-1.5 bg-current opacity-90`}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
};
