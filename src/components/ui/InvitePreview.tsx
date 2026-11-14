import Image from "next/image";
import type { Design } from "@/lib/invitations";

const fontClass = {
  script: "font-script text-[1.35em] leading-none",
  display: "font-display",
  sans: "font-sans uppercase tracking-[0.2em]",
};

/**
 * What a demo looks like on a phone screen before it's opened.
 * Uses the captured cover image (the real "tap to open" screen) when there is one,
 * otherwise draws a simple CSS version from the demo's colours.
 */
export function InvitePreview({ demo, compact = false }: { demo: Design; compact?: boolean }) {
  if (demo.cover) {
    return (
      <div className="relative h-full w-full" style={{ background: demo.theme.bg }}>
        <Image
          src={demo.cover}
          alt={`${demo.title} — opening screen`}
          fill
          sizes={compact ? "200px" : "(min-width: 768px) 300px, 45vw"}
          className="object-cover object-top"
        />
      </div>
    );
  }

  const { theme } = demo;
  const art = demo.opening.poster ?? (demo.kind === "moment" ? undefined : demo.heroImage);
  const dateLine = demo.kind === "moment" ? "" : demo.dateLabel;
  const place = demo.kind === "moment" ? "" : demo.venue.name;
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-5 py-8 text-center"
      style={{ background: theme.bg, color: theme.fg }}
    >
      {art && (
        // eslint-disable-next-line @next/next/no-img-element -- tiny decorative preview
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      )}
      <p className="eyebrow relative text-[0.55rem]" style={{ color: theme.accent }}>
        {demo.occasion}
      </p>
      <div className="relative space-y-3">
        <span className="mx-auto block size-2 rounded-full" style={{ background: theme.accent }} />
        <p className={`${fontClass[theme.namesFont]} ${compact ? "text-xl" : "text-3xl"} leading-tight`}>
          {demo.names.join(" & ")}
        </p>
        <p className="text-[0.7rem] tracking-[0.18em] opacity-80">{dateLine}</p>
      </div>
      {!compact && (
        <div className="relative w-full space-y-3">
          <p className="text-[0.7rem] opacity-70">{place}</p>
          <div
            className="mx-auto w-fit rounded-full px-5 py-2 text-[0.65rem] font-medium tracking-[0.2em] uppercase"
            style={{ background: theme.accent, color: theme.onAccent }}
          >
            {demo.tapLabel ?? "Tap to open"}
          </div>
        </div>
      )}
    </div>
  );
}

export function PhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[390/844] overflow-hidden rounded-[2.4rem] border-[7px] border-ink bg-ink shadow-[0_40px_80px_-30px_rgb(14_14_14/0.5)] ${className}`}
    >
      <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div className="h-full w-full overflow-hidden rounded-[1.9rem]">{children}</div>
    </div>
  );
}
