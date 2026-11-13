"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { InvitePreview, PhoneFrame } from "@/components/ui/InvitePreview";
import { demos } from "@/lib/content";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

/**
 * Scroll-driven hero. The section is 320vh tall; its inner stage is sticky,
 * and the scroll progress through the section (0 → 1) is handed to the 3D
 * envelope, which opens and presents the card.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress;
          },
          // also sync on (re)measure, e.g. after coming back to this page at a different scroll position
          onRefresh: (self) => {
            progress.current = self.progress;
          },
        },
      });
      // The progress ref outlives this effect: Next.js keeps the page alive in the background while
      // you visit other routes. Reset it to the real scroll position now, so the envelope doesn't
      // reappear in the state it was in when you left.
      progress.current = tl.scrollTrigger?.progress ?? 0;
      tl.to("[data-hero-intro]", { opacity: 0, y: -60, duration: 0.25 }, 0)
        .to("[data-hero-hint]", { opacity: 0, duration: 0.08 }, 0)
        .fromTo("[data-hero-outro]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.2 }, 0.78)
        .to({}, { duration: 0.02 }, 0.98);
    },
    { scope: section, dependencies: [reduced] },
  );

  if (reduced) return <StaticHero />;

  return (
    <section ref={section} className="relative h-[320vh]" aria-label="Introduction">
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#fffdf9_0%,var(--paper)_45%,var(--ivory)_100%)]"
        />
        <HeroScene progress={progress} />

        {/* Intro copy — real HTML so it paints instantly */}
        <div data-hero-intro className="pointer-events-none absolute inset-x-0 top-24 md:top-28">
          <div className="container-x text-center">
            <p className="eyebrow text-stone">Digital invitations · Event passes</p>
            <h1 className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] tracking-tight">
              Invitations worth <span className="font-accent italic">opening.</span>
            </h1>
          </div>
        </div>

        <div data-hero-hint className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-stone">
          <span className="eyebrow">Scroll to open</span>
          <span className="block h-10 w-px overflow-hidden bg-line">
            <span className="block h-1/2 w-px animate-[hint_1.6s_ease-in-out_infinite] bg-ink" />
          </span>
        </div>

        {/* Outro copy, revealed once the card is presented */}
        <div data-hero-outro className="absolute inset-x-0 bottom-10 opacity-0 md:bottom-14">
          <div className="container-x flex flex-col items-center gap-6 text-center">
            <p className="max-w-xl text-balance text-lg text-ink-soft md:text-xl">
              Designed and set up for you a mobile invitation website with RSVP, maps and schedule, ready to send in
              days.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/contact">Start your invitation</Button>
              <Button href="/demos" variant="outline">
                See live demos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Reduced-motion version: same message, no scroll-jacking or WebGL. */
function StaticHero() {
  return (
    <section className="bg-ivory pb-20 pt-36">
      <div className="container-x grid items-center gap-12 md:grid-cols-2">
        <div>
          <p className="eyebrow text-stone">Digital invitations · Event passes</p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95]">
            Invitations worth <span className="font-accent italic">opening.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            Designed and set up for you a mobile invitation website with RSVP, maps and schedule.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact">Start your invitation</Button>
            <Button href="/demos" variant="outline">
              See live demos
            </Button>
          </div>
        </div>
        <PhoneFrame className="mx-auto w-60">
          <InvitePreview demo={demos[2]} />
        </PhoneFrame>
      </div>
    </section>
  );
}
