import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "forest"
  | "secondary"
  | "accent"
  | "coral"
  | "outline"
  | "ghost"
  | "danger"
  | "plum"
  | "sage"
  | "teal"
  | "peach";

export type ButtonFamily = "marketing" | "action";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  family?: ButtonFamily;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--tc-primary)] hover:bg-[var(--tc-primary-hover)] active:bg-[var(--tc-primary-hover)] text-white shadow-xs hover:shadow-sm active:scale-[0.98] hover:-translate-y-0.5 border border-transparent",
  forest:
    "bg-[var(--tc-primary)] hover:bg-[var(--tc-primary-hover)] active:bg-[var(--tc-primary-hover)] text-white shadow-xs hover:shadow-sm active:scale-[0.98] hover:-translate-y-0.5 border border-transparent",
  secondary:
    "bg-[var(--tc-surface)] hover:bg-[var(--tc-soft-primary)] active:bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border border-[var(--tc-border)] hover:border-[var(--tc-primary)]/30 active:scale-[0.98] hover:-translate-y-0.5 shadow-2xs",
  accent:
    "bg-[var(--tc-teal)] hover:bg-[#0D9488] active:bg-[#0F766E] text-white shadow-xs hover:shadow-sm active:scale-[0.98] hover:-translate-y-0.5 border border-transparent",
  coral:
    "bg-[var(--tc-teal)] hover:bg-[#0D9488] active:bg-[#0F766E] text-white shadow-xs hover:shadow-sm active:scale-[0.98] hover:-translate-y-0.5 border border-transparent",
  outline:
    "bg-transparent hover:bg-[var(--tc-soft-primary)] active:bg-[var(--tc-soft-primary)] text-[var(--tc-text-primary)] hover:text-[var(--tc-primary)] border border-[var(--tc-border)] hover:border-[var(--tc-primary)]/35 active:scale-[0.98] hover:-translate-y-0.5",
  ghost:
    "bg-transparent hover:bg-[var(--tc-surface-muted)] active:bg-[var(--tc-surface-muted)] text-[var(--tc-text-secondary)] hover:text-[var(--tc-text-primary)] border border-transparent",
  danger:
    "bg-[var(--tc-danger)] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white shadow-xs active:scale-[0.98] hover:-translate-y-0.5 border border-transparent",
  /* Backward compatibility aliases */
  plum:
    "bg-[var(--tc-primary)] hover:bg-[var(--tc-primary-hover)] text-white shadow-xs border border-transparent",
  sage:
    "bg-[var(--tc-teal)] hover:bg-[#0D9488] text-white shadow-xs border border-transparent",
  teal:
    "bg-[var(--tc-teal)] hover:bg-[#0D9488] text-white shadow-xs border border-transparent",
  peach:
    "bg-[var(--tc-primary)] hover:bg-[var(--tc-primary-hover)] text-white shadow-xs border border-transparent",
};

const familyRadiusClasses: Record<ButtonFamily, string> = {
  marketing: "rounded-full",
  action: "rounded-xl",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3.5 py-1.5 text-xs font-semibold gap-1.5",
  md: "min-h-[44px] px-5 py-2 text-sm font-semibold gap-2",
  lg: "min-h-[50px] px-7 py-3 text-base font-bold gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      family = "marketing",
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
        className={`inline-flex items-center justify-center transition-all duration-180 cursor-pointer select-none font-[inherit] leading-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--tc-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tc-bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${familyRadiusClasses[family]} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
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
