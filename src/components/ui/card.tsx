import type { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white text-[#25231F] shadow-[0_4px_24px_rgba(55,48,40,0.03)] transition-shadow duration-200 ${className}`}
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
      className={`rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white/90 shadow-[0_8px_32px_rgba(55,48,40,0.04)] backdrop-blur-md text-[#25231F] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className = "",
  children,
  accentColor = "forest",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  accentColor?:
    | "forest"
    | "coral"
    | "apricot"
    | "moss"
    | "peach"
    | "butter"
    | "rose"
    | "lavender"
    | "neutral"
    | "plum"
    | "sage"
    | "sky";
}) {
  const accentGradients: Record<string, string> = {
    forest: "from-[#315F52]/10 via-[#315F52]/3 to-transparent",
    coral: "from-[#DE765D]/10 via-[#DE765D]/3 to-transparent",
    apricot: "from-[#F1B777]/14 via-[#F1B777]/4 to-transparent",
    moss: "from-[#E3EADD]/60 via-[#E3EADD]/20 to-transparent",
    peach: "from-[#FBE2D8]/50 via-[#FBE2D8]/15 to-transparent",
    butter: "from-[#F8EAC3]/50 via-[#F8EAC3]/15 to-transparent",
    rose: "from-[#F5DEE4]/50 via-[#F5DEE4]/15 to-transparent",
    lavender: "from-[#EEEAF4]/50 via-[#EEEAF4]/15 to-transparent",
    neutral: "from-[rgba(55,48,40,0.06)] via-transparent to-transparent",
    /* Aliases */
    plum: "from-[#315F52]/10 via-[#315F52]/3 to-transparent",
    sage: "from-[#E3EADD]/60 via-[#E3EADD]/20 to-transparent",
    sky: "from-[#E4EEE9]/50 via-[#E4EEE9]/15 to-transparent",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[rgba(55,48,40,0.10)] bg-white p-7 shadow-[0_4px_24px_rgba(55,48,40,0.03)] ${className}`}
      {...props}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br ${accentGradients[accentColor] || accentGradients.forest} blur-2xl`}
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
      className={`font-[family-name:var(--font-manrope)] text-lg md:text-xl font-bold tracking-tight text-[#25231F] ${className}`}
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
    <p className={`mt-1.5 text-sm text-[#6F6A62] leading-relaxed ${className}`} {...props}>
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
