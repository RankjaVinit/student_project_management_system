import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 
          border border-[var(--border)] 
          rounded-lg 
          bg-[var(--background)] 
          text-[var(--foreground)]
          focus:outline-none 
          focus:ring-2 
          focus:ring-[var(--primary)] 
          focus:border-transparent
          disabled:opacity-50 
          disabled:cursor-not-allowed
          ${error ? 'border-[var(--error)] focus:ring-[var(--error)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
};
