import { cn } from '../../utils/cn';

export const Input = ({ className, error, ...props }) => {
  return (
    <input
      className={cn(
        'w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
        className
      )}
      {...props}
    />
  );
};
