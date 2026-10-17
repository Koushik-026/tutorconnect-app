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
    "bg-[#315F52] hover:bg-[#244A40] active:bg-[#1C3B33] text-white shadow-[0_4px_16px_rgba(49,95,82,0.20)] hover:shadow-[0_6px_20px_rgba(49,95,82,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  forest:
    "bg-[#315F52] hover:bg-[#244A40] active:bg-[#1C3B33] text-white shadow-[0_4px_16px_rgba(49,95,82,0.20)] hover:shadow-[0_6px_20px_rgba(49,95,82,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  secondary:
    "bg-[#E4EEE9] hover:bg-[#D5E3DC] active:bg-[#C5D7CF] text-[#244A40] border border-[#315F52]/20 hover:border-[#315F52]/35 active:scale-[0.985] hover:-translate-y-0.5",
  accent:
    "bg-[#DE765D] hover:bg-[#BA5945] active:bg-[#9E4533] text-white shadow-[0_4px_16px_rgba(222,118,93,0.20)] hover:shadow-[0_6px_20px_rgba(222,118,93,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  coral:
    "bg-[#DE765D] hover:bg-[#BA5945] active:bg-[#9E4533] text-white shadow-[0_4px_16px_rgba(222,118,93,0.20)] hover:shadow-[0_6px_20px_rgba(222,118,93,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  outline:
    "bg-white hover:bg-[#FFF7ED] active:bg-[#FCEBD5] text-[#25231F] hover:text-[#25231F] border border-[rgba(55,48,40,0.12)] hover:border-[#315F52]/40 shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.985] hover:-translate-y-0.5",
  ghost:
    "bg-transparent hover:bg-[#E4EEE9]/60 active:bg-[#E4EEE9] text-[#6F6A62] hover:text-[#25231F] border border-transparent",
  danger:
    "bg-[#C84B31] hover:bg-[#B33E26] active:bg-[#99311B] text-white shadow-sm hover:shadow-[0_4px_14px_rgba(200,75,49,0.22)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  /* Backward compatibility aliases */
  plum:
    "bg-[#315F52] hover:bg-[#244A40] active:bg-[#1C3B33] text-white shadow-[0_4px_16px_rgba(49,95,82,0.20)] hover:shadow-[0_6px_20px_rgba(49,95,82,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  sage:
    "bg-[#315F52] hover:bg-[#244A40] active:bg-[#1C3B33] text-white shadow-[0_4px_16px_rgba(49,95,82,0.20)] hover:shadow-[0_6px_20px_rgba(49,95,82,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  teal:
    "bg-[#315F52] hover:bg-[#244A40] active:bg-[#1C3B33] text-white shadow-[0_4px_16px_rgba(49,95,82,0.20)] hover:shadow-[0_6px_20px_rgba(49,95,82,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
  peach:
    "bg-[#DE765D] hover:bg-[#BA5945] active:bg-[#9E4533] text-white shadow-[0_4px_16px_rgba(222,118,93,0.20)] hover:shadow-[0_6px_20px_rgba(222,118,93,0.26)] active:scale-[0.985] hover:-translate-y-0.5 border border-transparent",
};

const familyRadiusClasses: Record<ButtonFamily, string> = {
  marketing: "rounded-full",
  action: "rounded-2xl",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-4 py-1.5 text-xs font-bold gap-1.5",
  md: "min-h-[46px] px-5 py-2.5 text-sm font-bold gap-2",
  lg: "min-h-[52px] px-7 py-3.5 text-base font-extrabold gap-2.5",
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
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none font-[inherit] leading-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#315F52] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${familyRadiusClasses[family]} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
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
