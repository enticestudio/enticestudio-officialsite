"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { demos as allDemos, homeShowcaseSlugs } from "@/lib/content";
import { LivePhone } from "@/components/demo/LivePhone";
import { customDesignHref } from "@/lib/contact";

// The six featured styles (edit homeShowcaseSlugs in lib/content.ts to change them)
const demos = homeShowcaseSlugs.map((slug) => allDemos.find((d) => d.slug === slug)!).filter(Boolean);

/**
 * Pinned horizontal gallery of the six demos: scrolling down slides the phones
 * sideways, on desktop and mobile alike. With reduced motion it becomes a
 * native swipeable row instead.
 */
export function Showcase() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // each phone tilts slightly as it travels across the screen
        gsap.utils.toArray<HTMLElement>("[data-phone]").forEach((phone) => {
          gsap.fromTo(
            phone,
            { rotateY: -18, rotateZ: 3 },
            {
              rotateY: 18,
              rotateZ: -3,
              ease: "none",
              scrollTrigger: {
                trigger: phone,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="relative flex h-svh items-center overflow-hidden bg-ink text-paper motion-reduce:h-auto motion-reduce:py-24"
    >
      <div
        ref={track}
        className="flex gap-10 px-4 md:gap-20 md:px-[8vw] motion-reduce:snap-x motion-reduce:snap-mandatory motion-reduce:scroll-px-4 motion-reduce:overflow-x-auto"
      >
        <div className="flex w-[78vw] shrink-0 snap-start flex-col justify-center md:w-[32vw]">
          <p className="eyebrow text-champagne">Live demos</p>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98]">
            Six styles, <span className="font-accent italic">ready</span> to make yours.
          </h2>
          <p className="mt-6 max-w-sm text-paper/70">
            Each one is a working page: open it on your phone and try it. Or bring your own idea and we&apos;ll design it from scratch.
          </p>
        </div>

        {demos.map((demo, i) => (
          <Link
            key={demo.slug}
            href={`/demos/${demo.slug}`}
            className="group flex w-[min(62vw,30svh)] shrink-0 snap-center flex-col items-center gap-6 [perspective:1200px] sm:w-[min(40vw,32svh)] md:w-[min(19vw,34svh)]"
          >
            <div data-phone className="w-full [transform-style:preserve-3d]">
              <LivePhone inv={demo} className="w-full border-paper/90 transition-transform duration-500 group-hover:-translate-y-3" />
            </div>
            <div className="text-center">
              <p className="font-accent text-sm italic text-paper/50">0{i + 1}</p>
              <p className="font-display text-2xl">{demo.title}</p>
              <p className="text-sm text-paper/60">{demo.style}</p>
            </div>
          </Link>
        ))}

        {/* the seventh "phone": your own idea */}
        <Link
          href={customDesignHref}
          className="group flex w-[min(62vw,30svh)] shrink-0 snap-center flex-col items-center gap-6 [perspective:1200px] sm:w-[min(40vw,32svh)] md:w-[min(19vw,34svh)]"
        >
          <div data-phone className="w-full [transform-style:preserve-3d]">
            <div className="relative flex aspect-[390/844] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[2.4rem] border-2 border-dashed border-paper/35 p-6 text-center transition-all duration-500 group-hover:-translate-y-3 group-hover:border-champagne">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(212_184_140/0.18),transparent_65%)]" />
              <span className="relative flex size-16 items-center justify-center rounded-full border border-champagne/60 font-display text-4xl text-champagne transition-transform duration-500 group-hover:rotate-90">
                +
              </span>
              <p className="relative font-accent text-xl italic text-paper/85">Your idea here</p>
              <p className="relative text-xs uppercase tracking-[0.2em] text-paper/50">Designed from scratch</p>
            </div>
          </div>
          <div className="text-center">
            <p className="font-accent text-sm italic text-paper/50">0{demos.length + 1}</p>
            <p className="font-display text-2xl">Fully custom</p>
            <p className="text-sm text-paper/60">Your colours, your story, your opening</p>
          </div>
        </Link>
        <div className="w-[4vw] shrink-0" aria-hidden />
      </div>
    </section>
  );
}
