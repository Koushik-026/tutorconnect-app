import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border border-[rgba(54,48,60,0.10)] bg-white text-[#20221F] shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-shadow duration-200 ${className}`}
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
      className={`rounded-3xl border border-[rgba(54,48,60,0.10)] bg-white/85 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-md text-[#20221F] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className = "",
  children,
  accentColor = "plum",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  accentColor?: "plum" | "sage" | "peach" | "lavender" | "butter" | "sky" | "neutral";
}) {
  const accentGradients = {
    plum: "from-[#7257A5]/10 via-[#7257A5]/3 to-transparent",
    sage: "from-[#5D806F]/10 via-[#5D806F]/3 to-transparent",
    peach: "from-[#EFA17F]/10 via-[#EFA17F]/3 to-transparent",
    lavender: "from-[#EEE7FF]/40 via-[#EEE7FF]/10 to-transparent",
    butter: "from-[#F7E9BE]/30 via-[#F7E9BE]/10 to-transparent",
    sky: "from-[#E4F1FA]/40 via-[#E4F1FA]/10 to-transparent",
    neutral: "from-[rgba(54,48,60,0.06)] via-transparent to-transparent",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[rgba(54,48,60,0.10)] bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] ${className}`}
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
    <div className={`p-6 md:p-8 pb-4 ${className}`} {...props}>
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
      className={`font-[family-name:var(--font-manrope)] text-lg md:text-xl font-bold tracking-tight text-[#20221F] ${className}`}
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
    <p className={`mt-1.5 text-sm text-[#6D706A] leading-relaxed ${className}`} {...props}>
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
    <div className={`p-6 md:p-8 pt-0 ${className}`} {...props}>
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
    <div className={`flex items-center p-6 md:p-8 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}
