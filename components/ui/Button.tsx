import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/70 focus:ring-[var(--primary)]",
    secondary:
      "bg-[var(--secondary)] text-white hover:bg-[var(--secondary)]/70 focus:ring-[var(--secondary)]",
    outline:
      "border-2 border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] focus:ring-[var(--border)]",
    danger:
      "bg-[var(--error)] text-white hover:bg-[var(--error)]/70 focus:ring-[var(--error)]",
    success:
      "bg-[var(--success)] text-white hover:bg-[var(--success)]/70 focus:ring-[var(--success)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
