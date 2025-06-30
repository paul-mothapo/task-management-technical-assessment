import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  colorClasses: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  icon,
  colorClasses,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-full transition-colors duration-200 ${sizeClasses[size]} ${colorClasses}`}
      aria-label={label}
    >
      {icon}
    </button>
  );
};
