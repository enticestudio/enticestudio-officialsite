"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { momentPackages, smallProducts, websitePackages, type Package } from "@/lib/content";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { BigPrice, CurrencyToggle, Price } from "@/components/currency/Currency";

/** Card that tilts in 3D toward the cursor, with a soft light following it. */
function TiltCard({ pkg }: { pkg: Package }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const lx = useMotionValue(50);
  const ly = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(circle at ${lx}% ${ly}%, rgb(255 255 255 / 0.18), transparent 55%)`;
  const dark = pkg.featured;

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 10);
        rx.set(-(py - 0.5) * 10);
        lx.set(px * 100);
        ly.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-8 md:p-10 ${
        dark ? "border-ink bg-ink text-paper" : "border-line bg-paper"
      }`}
    >
      {dark && <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glow }} />}
      <div className="flex items-start justify-between">
        <h3 className="font-display text-3xl">{pkg.name}</h3>
        {dark && <span className="eyebrow rounded-full bg-champagne px-3 py-1.5 text-[0.6rem] text-ink">Most chosen</span>}
      </div>
      <p className={`mt-3 ${dark ? "text-paper/70" : "text-ink-soft"}`}>{pkg.blurb}</p>
      <p className="mt-8 font-display text-[clamp(2.6rem,4.2vw,3.75rem)] leading-none">
        <BigPrice value={pkg.price} />
      </p>
      <ul className={`mt-8 flex-1 space-y-3 text-sm ${dark ? "text-paper/85" : "text-ink-soft"}`}>
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-3">
            <span className={`mt-2 size-1.5 shrink-0 rounded-full ${dark ? "bg-champagne" : "bg-ink"}`} />
            {f}
          </li>
        ))}
      </ul>
      <p className={`mt-8 eyebrow ${dark ? "text-paper/50" : "text-stone"}`}>Delivery {pkg.delivery}</p>
    </motion.div>
  );
}

export function Packages() {
  return (
    <section id="packages" className="bg-ivory py-28 md:py-40">
      <div className="container-x">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow text-stone">Packages</p>
          </Reveal>
          <SplitHeading
            className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1]"
            text="Simple, *honest* pricing."
          />
          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-col items-center gap-4">
              <CurrencyToggle />
              <p className="text-ink-soft">Custom domains, extra languages and photo galleries are optional add-ons.</p>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {websitePackages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.1} className="h-full">
              <TiltCard pkg={pkg} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-2xl border border-line bg-paper p-8 md:flex-row">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-12">
              {smallProducts.map((p) => (
                <div key={p.name}>
                  <p className="font-display text-xl">
                    {p.name} <span className="font-sans text-base text-stone">
                      · <Price value={p.price} />
                    </span>
                  </p>
                  <p className="text-sm text-ink-soft">{p.blurb}</p>
                </div>
              ))}
            </div>
            <Button href="/pricing" variant="outline">
              Full pricing &amp; add-ons
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Prices for personal "moment" pages (Moments page and the pricing page). */
export function MomentPackages({ tone = "paper" }: { tone?: "paper" | "ivory" }) {
  return (
    <section id="moments-pricing" className={`py-28 md:py-36 ${tone === "ivory" ? "bg-ivory" : ""}`}>
      <div className="container-x">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Reveal>
            <p className="eyebrow text-stone">Moments pages</p>
          </Reveal>
          <SplitHeading
            className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1]"
            text="Small pages, *big* feelings."
          />
          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-col items-center gap-4">
              <CurrencyToggle />
              <p className="text-ink-soft">For proposals, Valentine&apos;s, birthdays, graduations and tributes. Memorial pages can stay online for longer; just ask.</p>
            </div>
          </Reveal>
        </div>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {momentPackages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 0.1} className="h-full">
              <TiltCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
