import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/85 bg-white text-slate-900 shadow-xs transition-shadow duration-200 ${className}`}
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
      className={`rounded-2xl border border-white/70 bg-white/80 shadow-md backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className = "",
  children,
  accentColor = "blue",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  accentColor?: "blue" | "teal" | "violet" | "amber" | "slate";
}) {
  const accentGradients = {
    blue: "from-blue-500/10 via-blue-500/5 to-transparent",
    teal: "from-teal-500/10 via-teal-500/5 to-transparent",
    violet: "from-violet-500/10 via-violet-500/5 to-transparent",
    amber: "from-amber-500/10 via-amber-500/5 to-transparent",
    slate: "from-slate-500/10 via-slate-500/5 to-transparent",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs ${className}`}
      {...props}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${accentGradients[accentColor]} blur-2xl`}
        aria-hidden="true"
      />
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
    <div className={`p-6 pb-4 ${className}`} {...props}>
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
      className={`font-[family-name:var(--font-manrope)] text-lg font-bold tracking-tight text-slate-900 ${className}`}
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
    <p className={`mt-1 text-sm text-slate-500 leading-relaxed ${className}`} {...props}>
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
