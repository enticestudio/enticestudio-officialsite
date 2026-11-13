import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

/** Shared top section for inner pages. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden bg-ivory pb-20 pt-40 md:pb-28 md:pt-52">
      <Parallax speed={0.5} className="pointer-events-none absolute -right-16 -top-10 md:right-10">
        <span className="block size-56 rounded-full bg-paper md:size-80" />
      </Parallax>
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow text-stone">{eyebrow}</p>
        </Reveal>
        <SplitHeading
          as="h1"
          className="mt-5 max-w-4xl font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.95]"
          text={title}
        />
        {intro && (
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-xl text-lg text-ink-soft">{intro}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
