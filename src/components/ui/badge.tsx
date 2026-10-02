import type { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "plum"
  | "sage"
  | "teal"
  | "peach"
  | "lavender"
  | "violet"
  | "butter"
  | "amber"
  | "green"
  | "sky"
  | "danger"
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
  primary: "bg-[#EEE7FF] text-[#594282] border-[#7257A5]/20",
  plum: "bg-[#EEE7FF] text-[#594282] border-[#7257A5]/20",
  sage: "bg-[#E5F0EA] text-[#3D5A4D] border-[#5D806F]/20",
  teal: "bg-[#E5F0EA] text-[#3D5A4D] border-[#5D806F]/20",
  peach: "bg-[#FCE7DE] text-[#A85834] border-[#EFA17F]/25",
  lavender: "bg-[#F4F0FF] text-[#594282] border-[#7257A5]/20",
  violet: "bg-[#F4F0FF] text-[#594282] border-[#7257A5]/20",
  butter: "bg-[#F7E9BE]/50 text-[#7A5812] border-[#F7E9BE]",
  amber: "bg-[#F7E9BE]/50 text-[#7A5812] border-[#F7E9BE]",
  green: "bg-[#E5F0EA] text-[#3D5A4D] border-[#5D806F]/20",
  sky: "bg-[#E4F1FA] text-[#2C5282] border-[#63B3ED]/25",
  danger: "bg-[#FCEEEA] text-[#A6361E] border-[#C84B31]/25",
  neutral: "bg-[#F4F2EC] text-[#53564F] border-[rgba(54,48,60,0.10)]",
  outline: "bg-white text-[#20221F] border-[rgba(54,48,60,0.14)]",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-[#7257A5]",
  plum: "bg-[#7257A5]",
  sage: "bg-[#5D806F]",
  teal: "bg-[#5D806F]",
  peach: "bg-[#EFA17F]",
  lavender: "bg-[#7257A5]",
  violet: "bg-[#7257A5]",
  butter: "bg-[#D4A328]",
  amber: "bg-[#D4A328]",
  green: "bg-[#5D806F]",
  sky: "bg-[#3182CE]",
  danger: "bg-[#C84B31]",
  neutral: "bg-[#6D706A]",
  outline: "bg-[#969991]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2.5 py-0.5 min-h-[24px] gap-1.5 font-bold",
  md: "text-xs px-3.5 py-1 min-h-[28px] gap-2 font-bold",
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
