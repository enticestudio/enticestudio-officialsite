import { occasionsMarquee } from "@/lib/content";

/** Endless ribbon of occasions, separated by the brand dot. */
export function Marquee({ dark = false }: { dark?: boolean }) {
  const items = [...occasionsMarquee, ...occasionsMarquee];
  return (
    <div
      className={`overflow-hidden border-y py-6 ${dark ? "border-paper/10 bg-ink text-paper" : "border-line bg-paper"}`}
      aria-hidden
    >
      <div className="flex w-max animate-[marquee_40s_linear_infinite] items-center gap-10 hover:[animation-play-state:paused]">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl md:text-5xl">
            {i % 3 === 1 ? <span className="font-accent italic">{item}</span> : item}
            <span className={`size-3 rounded-full ${dark ? "bg-champagne" : "bg-ink"}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
