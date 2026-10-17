import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] text-[var(--tc-text-primary)] shadow-xs transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCard({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)]/90 shadow-sm backdrop-blur-md text-[var(--tc-text-primary)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  accentColor?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 shadow-xs ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`font-[family-name:var(--font-manrope)] text-lg md:text-xl font-bold tracking-tight text-[var(--tc-text-primary)] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mt-1.5 text-xs sm:text-sm text-[var(--tc-text-secondary)] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}
