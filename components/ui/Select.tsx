import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
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
      <select
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-[var(--error)]">{error}</p>
      )}
    </div>
  );
};
