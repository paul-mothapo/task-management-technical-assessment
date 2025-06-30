interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export const LoadingButton = ({
  loading = false,
  children,
  className = '',
  ...props
}: LoadingButtonProps) => {
  const baseClasses =
    'w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${baseClasses} ${className}`}
    >
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
