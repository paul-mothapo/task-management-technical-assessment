import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  colorClasses: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  icon,
  colorClasses,
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full transition-colors duration-200 ${colorClasses}`}
    aria-label={label}
  >
    {icon}
  </button>
); 