import { Eye, EyeOff } from "lucide-react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface FormInputProps {
  type?: "text" | "email" | "password";
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

export const FormInput = ({
  type = "text",
  placeholder,
  registration,
  error,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword,
}: FormInputProps) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-blue-200"
        }`}
        {...registration}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
      {error && (
        <p className="mt-1 text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  );
}; 