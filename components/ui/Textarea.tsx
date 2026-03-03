import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
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
      <textarea
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
          resize-vertical
          min-h-[100px]
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
