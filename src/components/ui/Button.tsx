import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline" | "light";

const styles: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-paper",
  light: "bg-paper text-ink hover:bg-ivory",
};

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full bg-current transition-transform duration-300 group-hover:scale-[2.2]"
      />
    </Link>
  );
}
