import { Parallax } from "@/components/motion/Parallax";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { InvitePreview } from "@/components/ui/InvitePreview";
import { demos } from "@/lib/content";

/**
 * Statement section with floating "stationery" cards at different
 * parallax depths — near cards move faster than far ones.
 */
const floaters = [
  { demo: demos[1], cls: "left-[2%] top-[6%] w-32 md:w-44", speed: 0.5, rotate: -8 },
  { demo: demos[4], cls: "right-[4%] top-[2%] w-28 md:w-40", speed: 0.25, rotate: 10 },
  { demo: demos[3], cls: "left-[8%] bottom-[2%] w-28 md:w-36", speed: -0.2, rotate: 6 },
  { demo: demos[0], cls: "right-[6%] bottom-[8%] w-32 md:w-48", speed: 0.65, rotate: -5 },
];

export function Intro() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      {floaters.map((f, i) => (
        <Parallax key={i} speed={f.speed} rotate={f.rotate} className={`absolute hidden sm:block ${f.cls}`}>
          <div
            className="aspect-[3/4] overflow-hidden rounded-md shadow-[0_30px_60px_-25px_rgb(14_14_14/0.45)]"
            style={{ transform: `rotate(${f.rotate}deg)` }}
          >
            <InvitePreview demo={f.demo} compact />
          </div>
        </Parallax>
      ))}

      {/* soft gold dots drifting at their own depth */}
      <Parallax speed={0.9} className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <span className="absolute left-[30%] top-[20%] size-2 rounded-full bg-champagne" />
        <span className="absolute left-[70%] top-[35%] size-3 rounded-full bg-champagne/70" />
        <span className="absolute left-[55%] top-[80%] size-2 rounded-full bg-champagne/80" />
      </Parallax>

      <div className="container-x relative z-10 text-center">
        <Reveal>
          <p className="eyebrow text-stone">The studio</p>
        </Reveal>
        <SplitHeading
          className="mx-auto mt-6 max-w-4xl text-balance font-display text-[clamp(2.2rem,5.2vw,4.6rem)] leading-[1.02]"
          text="Free builders give you a page. We give you a *moment* your guests remember."
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg text-ink-soft">
            Every invitation is designed, written into place, tested on real phones and handed over ready to send so
            you can get back to planning the day itself.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
