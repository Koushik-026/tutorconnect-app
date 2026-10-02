import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "plum"
  | "secondary"
  | "sage"
  | "teal"
  | "peach"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#7257A5] hover:bg-[#594282] active:bg-[#47346A] text-white shadow-[0_4px_16px_rgba(114,87,165,0.22)] hover:shadow-[0_6px_20px_rgba(114,87,165,0.30)] active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  plum:
    "bg-[#7257A5] hover:bg-[#594282] active:bg-[#47346A] text-white shadow-[0_4px_16px_rgba(114,87,165,0.22)] hover:shadow-[0_6px_20px_rgba(114,87,165,0.30)] active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  secondary:
    "bg-[#EEE7FF] hover:bg-[#E3D9FF] active:bg-[#D5C6FF] text-[#594282] border border-[#7257A5]/20 hover:border-[#7257A5]/35 active:translate-y-0 hover:-translate-y-0.5",
  sage:
    "bg-[#5D806F] hover:bg-[#4C6A5B] active:bg-[#3C5448] text-white shadow-[0_4px_16px_rgba(93,128,111,0.22)] hover:shadow-[0_6px_20px_rgba(93,128,111,0.30)] active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  teal:
    "bg-[#5D806F] hover:bg-[#4C6A5B] active:bg-[#3C5448] text-white shadow-[0_4px_16px_rgba(93,128,111,0.22)] hover:shadow-[0_6px_20px_rgba(93,128,111,0.30)] active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  peach:
    "bg-[#EFA17F] hover:bg-[#DE8E6A] active:bg-[#CD7A55] text-white shadow-[0_4px_16px_rgba(239,161,127,0.24)] hover:shadow-[0_6px_20px_rgba(239,161,127,0.32)] active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  outline:
    "bg-white hover:bg-[#FFFDF9] active:bg-[#F4F0FF] text-[#20221F] hover:text-[#20221F] border border-[rgba(54,48,60,0.14)] hover:border-[#7257A5]/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)]",
  ghost:
    "bg-transparent hover:bg-[#EEE7FF]/60 active:bg-[#EEE7FF] text-[#6D706A] hover:text-[#20221F] border border-transparent",
  danger:
    "bg-[#C84B31] hover:bg-[#B33E26] active:bg-[#99311B] text-white shadow-sm hover:shadow-[0_4px_14px_rgba(200,75,49,0.25)] active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-4 py-1.5 text-xs font-bold rounded-full gap-1.5",
  md: "min-h-[46px] px-5 py-2.5 text-sm font-bold rounded-full gap-2",
  lg: "min-h-[52px] px-7 py-3.5 text-base font-extrabold rounded-full gap-2.5",
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
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none font-[inherit] leading-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#7257A5] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
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
