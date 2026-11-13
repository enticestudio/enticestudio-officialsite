"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { process } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

/** Sticky heading on the left; steps on the right with a line that draws as you scroll. */
export function Process() {
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="py-28 md:py-40">
      <div className="container-x grid gap-14 md:grid-cols-[1fr_1.3fr]">
        <div className="md:sticky md:top-32 md:self-start">
          <p className="eyebrow text-stone">How it works</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1]">
            From your details to their <span className="font-accent italic">phones.</span>
          </h2>
          <p className="mt-6 max-w-sm text-ink-soft">
            No editors to learn and no app for guests to install. You send the details, we handle the rest.
          </p>
        </div>

        <ol ref={list} className="relative space-y-14 pl-12">
          <span className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-line" aria-hidden />
          <motion.span
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-ink"
            style={{ scaleY }}
            aria-hidden
          />
          {process.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="absolute -left-12 top-1 flex size-6 items-center justify-center rounded-full border border-ink bg-paper text-[0.65rem]">
                {i + 1}
              </span>
              <Reveal>
                <h3 className="font-display text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-md text-ink-soft">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
