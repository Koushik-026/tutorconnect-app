import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "sage"
  | "teal"
  | "peach"
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
    "bg-[#66518A] hover:bg-[#4E3C70] active:bg-[#3F305B] text-white shadow-sm hover:shadow-md hover:shadow-[#66518A]/25 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  secondary:
    "bg-[#FFFEFB] hover:bg-[#EFEAF8] active:bg-[#E3D8F2] text-[#232520] hover:text-[#66518A] border border-[#E4DED4] hover:border-[#66518A]/40 shadow-xs active:translate-y-0 hover:-translate-y-0.5",
  sage:
    "bg-[#4F7867] hover:bg-[#3E6153] active:bg-[#2F4B40] text-white shadow-sm hover:shadow-md hover:shadow-[#4F7867]/25 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  teal:
    "bg-[#4F7867] hover:bg-[#3E6153] active:bg-[#2F4B40] text-white shadow-sm hover:shadow-md hover:shadow-[#4F7867]/25 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  peach:
    "bg-[#E99873] hover:bg-[#D8835C] active:bg-[#C2734D] text-white shadow-sm hover:shadow-md hover:shadow-[#E99873]/25 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
  outline:
    "bg-transparent hover:bg-[#ECE6DC] active:bg-[#E4DED4] text-[#232520] hover:text-[#232520] border border-[#E4DED4] hover:border-[#66518A]/40",
  ghost:
    "bg-transparent hover:bg-[#ECE6DC] active:bg-[#E4DED4] text-[#676B64] hover:text-[#232520] border border-transparent",
  danger:
    "bg-[#C84B31] hover:bg-[#AC3E27] active:bg-[#92331F] text-white shadow-sm hover:shadow-md hover:shadow-[#C84B31]/25 active:translate-y-0 hover:-translate-y-0.5 border border-transparent",
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
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none font-[inherit] leading-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#66518A] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${
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
