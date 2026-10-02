import type { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "teal"
  | "green"
  | "amber"
  | "violet"
  | "neutral"
  | "outline";

export type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    "bg-blue-50 text-blue-700 border-blue-200/80 shadow-xs",
  teal:
    "bg-teal-50 text-teal-800 border-teal-200/80 shadow-xs",
  green:
    "bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-xs",
  amber:
    "bg-amber-50 text-amber-900 border-amber-200/80 shadow-xs",
  violet:
    "bg-violet-50 text-violet-800 border-violet-200/80 shadow-xs",
  neutral:
    "bg-slate-100 text-slate-700 border-slate-200/80 shadow-xs",
  outline:
    "bg-white/80 text-slate-700 border-slate-200 shadow-xs backdrop-blur-xs",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-blue-600",
  teal: "bg-teal-600",
  green: "bg-emerald-600",
  amber: "bg-amber-500",
  violet: "bg-violet-600",
  neutral: "bg-slate-500",
  outline: "bg-slate-400",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2.5 py-0.5 min-h-[24px] gap-1.5 font-bold",
  md: "text-xs px-3 py-1 min-h-[28px] gap-2 font-bold",
};

export function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
  dot = false,
  icon,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="leading-none">{children}</span>
    </span>
  );
}
