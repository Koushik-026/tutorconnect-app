import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "teal"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md hover:shadow-blue-600/20 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  secondary:
    "bg-white hover:bg-blue-50/60 active:bg-blue-100/60 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-300 shadow-xs active:translate-y-0 hover:-translate-y-0.5",
  teal:
    "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm hover:shadow-md hover:shadow-teal-600/20 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  outline:
    "bg-transparent hover:bg-slate-100/80 active:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300",
  ghost:
    "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 border border-transparent",
  danger:
    "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-sm hover:shadow-rose-600/20 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-3.5 py-1.5 text-xs font-bold rounded-xl gap-1.5",
  md: "min-h-[46px] px-5 py-2.5 text-sm font-bold rounded-xl gap-2",
  lg: "min-h-[52px] px-6 py-3.5 text-base font-extrabold rounded-2xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none font-[inherit] leading-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${
          variantClasses[variant]
        } ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
