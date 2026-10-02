import type { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "forest"
  | "secondary"
  | "coral"
  | "apricot"
  | "moss"
  | "peach"
  | "butter"
  | "rose"
  | "lavender"
  | "green"
  | "amber"
  | "danger"
  | "neutral"
  | "outline"
  | "plum"
  | "sage"
  | "teal"
  | "violet"
  | "sky";

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
  primary: "bg-[#E4EEE9] text-[#244A40] border-[#315F52]/20",
  forest: "bg-[#E4EEE9] text-[#244A40] border-[#315F52]/20",
  secondary: "bg-[#FFF7ED] text-[#6F6A62] border-[rgba(55,48,40,0.12)]",
  coral: "bg-[#FBE2D8] text-[#BA5945] border-[#DE765D]/25",
  apricot: "bg-[#FCEBD5] text-[#8C5D20] border-[#F1B777]/30",
  moss: "bg-[#E3EADD] text-[#2D4F42] border-[#315F52]/15",
  peach: "bg-[#FBE2D8] text-[#BA5945] border-[#DE765D]/25",
  butter: "bg-[#F8EAC3]/60 text-[#7A5812] border-[#F8EAC3]",
  rose: "bg-[#F5DEE4] text-[#A84562] border-[#DE765D]/20",
  lavender: "bg-[#EEEAF4] text-[#4F4668] border-[#A89EC4]/25",
  green: "bg-[#E9F5EF] text-[#2E7D5B] border-[#2E7D5B]/20",
  amber: "bg-[#FDF4E5] text-[#C27A1B] border-[#C27A1B]/20",
  danger: "bg-[#FCEEEA] text-[#A6361E] border-[#C84B31]/25",
  neutral: "bg-[#FFF7ED] text-[#6F6A62] border-[rgba(55,48,40,0.10)]",
  outline: "bg-white text-[#25231F] border-[rgba(55,48,40,0.14)]",
  /* Backward aliases */
  plum: "bg-[#E4EEE9] text-[#244A40] border-[#315F52]/20",
  sage: "bg-[#E3EADD] text-[#2D4F42] border-[#315F52]/15",
  teal: "bg-[#E4EEE9] text-[#244A40] border-[#315F52]/20",
  violet: "bg-[#EEEAF4] text-[#4F4668] border-[#A89EC4]/25",
  sky: "bg-[#E4EEE9] text-[#244A40] border-[#315F52]/20",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-[#315F52]",
  forest: "bg-[#315F52]",
  secondary: "bg-[#6F6A62]",
  coral: "bg-[#DE765D]",
  apricot: "bg-[#F1B777]",
  moss: "bg-[#315F52]",
  peach: "bg-[#DE765D]",
  butter: "bg-[#D4A328]",
  rose: "bg-[#DE765D]",
  lavender: "bg-[#7E749A]",
  green: "bg-[#2E7D5B]",
  amber: "bg-[#C27A1B]",
  danger: "bg-[#C84B31]",
  neutral: "bg-[#6F6A62]",
  outline: "bg-[#9B958C]",
  /* Backward aliases */
  plum: "bg-[#315F52]",
  sage: "bg-[#315F52]",
  teal: "bg-[#315F52]",
  violet: "bg-[#7E749A]",
  sky: "bg-[#315F52]",
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
