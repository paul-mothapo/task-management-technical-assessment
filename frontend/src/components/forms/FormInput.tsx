import { Eye, EyeOff } from 'lucide-react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { Button } from '../common/Button';
import { cn } from '@/utils/cn';

interface FormInputProps {
  type?: 'text' | 'email' | 'password';
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  className?: string;
}

export const FormInput = ({
  type = 'text',
  placeholder,
  registration,
  error,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
  className,
}: FormInputProps) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-2 border rounded-lg transition-colors duration-200',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:ring-blue-200 hover:border-gray-400',
          className
        )}
        {...registration}
      />
      {showPasswordToggle && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={showPassword ? EyeOff : Eye}
            onClick={onTogglePassword}
            className="text-gray-500 hover:text-gray-700 !p-1"
          />
        </div>
      )}
      {error && <p className="mt-1 text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};
