import { Magnetic } from "@/components/motion/Magnetic";
import { Parallax } from "@/components/motion/Parallax";
import { SplitHeading } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Monogram } from "@/components/layout/Logo";

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-ink py-32 text-paper md:py-48">
      <Parallax speed={-0.35} className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 opacity-[0.06] md:right-10">
        <Monogram tone="white" className="w-72 md:w-[28rem]" />
      </Parallax>
      <div className="container-x relative text-center">
        <p className="eyebrow text-champagne">Let&apos;s begin</p>
        <SplitHeading
          className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.98]"
          text="Make something they'll *open twice.*"
        />
        <p className="mx-auto mt-8 max-w-md text-paper/70">
          Tell us your date, guest count and style. You&apos;ll get a clear quote within one business day.
        </p>
        <div className="mt-10">
          <Magnetic>
            <Button href="/contact" variant="light" className="px-9 py-5 text-base">
              Get your quote
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
