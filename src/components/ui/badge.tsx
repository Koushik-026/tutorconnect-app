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
  primary: "bg-[#EFEAF8] text-[#4E3C70] border-[#66518A]/25 shadow-xs",
  plum: "bg-[#EFEAF8] text-[#4E3C70] border-[#66518A]/25 shadow-xs",
  sage: "bg-[#E6F0EA] text-[#3E6153] border-[#4F7867]/25 shadow-xs",
  teal: "bg-[#E6F0EA] text-[#3E6153] border-[#4F7867]/25 shadow-xs",
  peach: "bg-[#FBE9DF] text-[#A64E28] border-[#E99873]/30 shadow-xs",
  lavender: "bg-[#F4F0FB] text-[#554477] border-[#B7A5DE]/35 shadow-xs",
  violet: "bg-[#F4F0FB] text-[#554477] border-[#B7A5DE]/35 shadow-xs",
  butter: "bg-[#F8EFCF] text-[#826514] border-[#D9B85F]/35 shadow-xs",
  amber: "bg-[#FDF4E5] text-[#965C12] border-[#C27A1B]/30 shadow-xs",
  green: "bg-[#E9F5EF] text-[#205F45] border-[#2E7D5B]/30 shadow-xs",
  danger: "bg-[#FCEEEA] text-[#A6361E] border-[#C84B31]/30 shadow-xs",
  neutral: "bg-[#ECE6DC] text-[#4D504A] border-[#E4DED4] shadow-xs",
  outline: "bg-[#FFFEFB] text-[#232520] border-[#E4DED4] shadow-xs",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-[#66518A]",
  plum: "bg-[#66518A]",
  sage: "bg-[#4F7867]",
  teal: "bg-[#4F7867]",
  peach: "bg-[#E99873]",
  lavender: "bg-[#B7A5DE]",
  violet: "bg-[#B7A5DE]",
  butter: "bg-[#D9B85F]",
  amber: "bg-[#C27A1B]",
  green: "bg-[#2E7D5B]",
  danger: "bg-[#C84B31]",
  neutral: "bg-[#676B64]",
  outline: "bg-[#989C94]",
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
