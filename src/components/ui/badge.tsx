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
  primary: "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border-[var(--tc-primary)]/20",
  forest: "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border-[var(--tc-primary)]/20",
  secondary: "bg-[var(--tc-surface-muted)] text-[var(--tc-text-secondary)] border-[var(--tc-border)]",
  teal: "bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] border-[var(--tc-teal)]/25",
  green: "bg-[var(--tc-success)]/10 text-[var(--tc-success)] border-[var(--tc-success)]/25",
  amber: "bg-[var(--tc-warning)]/10 text-[var(--tc-warning)] border-[var(--tc-warning)]/25",
  danger: "bg-[var(--tc-danger)]/10 text-[var(--tc-danger)] border-[var(--tc-danger)]/25",
  neutral: "bg-[var(--tc-surface-muted)] text-[var(--tc-text-secondary)] border-[var(--tc-border)]",
  outline: "bg-transparent text-[var(--tc-text-primary)] border-[var(--tc-border)]",

  /* Backward aliases mapped to clean palette */
  coral: "bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] border-[var(--tc-teal)]/25",
  apricot: "bg-[var(--tc-warning)]/10 text-[var(--tc-warning)] border-[var(--tc-warning)]/25",
  moss: "bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] border-[var(--tc-teal)]/25",
  peach: "bg-[var(--tc-surface-muted)] text-[var(--tc-text-secondary)] border-[var(--tc-border)]",
  butter: "bg-[var(--tc-warning)]/10 text-[var(--tc-warning)] border-[var(--tc-warning)]/25",
  rose: "bg-[var(--tc-danger)]/10 text-[var(--tc-danger)] border-[var(--tc-danger)]/25",
  lavender: "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border-[var(--tc-primary)]/20",
  plum: "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border-[var(--tc-primary)]/20",
  sage: "bg-[var(--tc-teal)]/10 text-[var(--tc-teal)] border-[var(--tc-teal)]/25",
  violet: "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border-[var(--tc-primary)]/20",
  sky: "bg-[var(--tc-soft-primary)] text-[var(--tc-primary)] border-[var(--tc-primary)]/20",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-[var(--tc-primary)]",
  forest: "bg-[var(--tc-primary)]",
  secondary: "bg-[var(--tc-text-secondary)]",
  teal: "bg-[var(--tc-teal)]",
  green: "bg-[var(--tc-success)]",
  amber: "bg-[var(--tc-warning)]",
  danger: "bg-[var(--tc-danger)]",
  neutral: "bg-[var(--tc-text-secondary)]",
  outline: "bg-[var(--tc-text-secondary)]",
  coral: "bg-[var(--tc-teal)]",
  apricot: "bg-[var(--tc-warning)]",
  moss: "bg-[var(--tc-teal)]",
  peach: "bg-[var(--tc-text-secondary)]",
  butter: "bg-[var(--tc-warning)]",
  rose: "bg-[var(--tc-danger)]",
  lavender: "bg-[var(--tc-primary)]",
  plum: "bg-[var(--tc-primary)]",
  sage: "bg-[var(--tc-teal)]",
  violet: "bg-[var(--tc-primary)]",
  sky: "bg-[var(--tc-primary)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[11px] px-2.5 py-0.5 min-h-[22px] gap-1.5 font-bold",
  md: "text-xs px-3 py-1 min-h-[26px] gap-2 font-bold",
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
