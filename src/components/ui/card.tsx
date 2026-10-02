import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] text-[#232520] shadow-xs transition-shadow duration-200 ${className}`}
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
      className={`rounded-2xl border border-[#E4DED4]/80 bg-[#FFFEFB]/90 shadow-sm backdrop-blur-md ${className}`}
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
  accentColor?: "plum" | "sage" | "peach" | "lavender" | "butter" | "neutral";
}) {
  const accentGradients = {
    plum: "from-[#66518A]/12 via-[#66518A]/5 to-transparent",
    sage: "from-[#4F7867]/12 via-[#4F7867]/5 to-transparent",
    peach: "from-[#E99873]/12 via-[#E99873]/5 to-transparent",
    lavender: "from-[#B7A5DE]/15 via-[#B7A5DE]/5 to-transparent",
    butter: "from-[#D9B85F]/15 via-[#D9B85F]/5 to-transparent",
    neutral: "from-[#E4DED4]/25 via-[#E4DED4]/10 to-transparent",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#E4DED4] bg-[#FFFEFB] p-6 shadow-xs ${className}`}
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
      className={`font-[family-name:var(--font-manrope)] text-lg font-bold tracking-tight text-[#232520] ${className}`}
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
    <p className={`mt-1 text-sm text-[#676B64] leading-relaxed ${className}`} {...props}>
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
