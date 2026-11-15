import { Parallax } from "@/components/motion/Parallax";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";

/** Statement section: the studio's promise, with a few soft gold dots drifting in parallax. */
export function Intro() {
  return (
    <section className="relative overflow-hidden py-32 md:py-48">
      {/* soft gold dots drifting at their own depth */}
      <Parallax speed={0.9} className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
        <span className="season-dot absolute left-[30%] top-[20%] size-2 rounded-full bg-champagne" />
        <span className="season-dot absolute left-[70%] top-[35%] size-3 rounded-full bg-champagne/70" />
        <span className="season-dot absolute left-[55%] top-[80%] size-2 rounded-full bg-champagne/80" />
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
