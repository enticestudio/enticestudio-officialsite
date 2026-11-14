"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { externalProps, socials, whatsappLink, type SocialKey } from "@/lib/contact";
import { BrandIcon } from "@/components/contact/BrandIcon";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

/** Resting icon chip and the fill that sweeps up on hover, per brand. */
const brand: Record<SocialKey, { chip: string; fill: string }> = {
  instagram: {
    chip: "bg-[linear-gradient(45deg,#f9ce34,#ee2a7b_50%,#6228d7)] text-white",
    fill: "bg-[linear-gradient(120deg,#f9ce34,#ee2a7b_45%,#6228d7)]",
  },
  tiktok: {
    chip: "bg-black text-white [&_svg]:[filter:drop-shadow(-1.5px_-1.5px_0_#25f4ee)_drop-shadow(1.5px_1.5px_0_#fe2c55)]",
    fill: "bg-black bg-[radial-gradient(circle_at_15%_20%,#25f4ee55,transparent_40%),radial-gradient(circle_at_85%_80%,#fe2c5566,transparent_45%)]",
  },
  facebook: { chip: "bg-[#0866ff] text-white", fill: "bg-[linear-gradient(120deg,#0866ff,#2b8cff)]" },
};

/** Home page: WhatsApp chat preview + social accounts. */
export function Connect() {
  const wa = whatsappLink("Hi Entice Studio! I found you on your website and I'd like to ask about a design.");
  if (!wa && socials.length === 0) return null;

  return (
    <section className="py-28 md:py-40" id="connect">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow text-stone">Say hello</p>
            </Reveal>
            <SplitHeading
              className="mt-5 max-w-2xl font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1]"
              text="Talk to us *your way.*"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-ink-soft">
              A question about a design, a date or a price? Message us on WhatsApp, or follow along to see new designs first.
            </p>
          </Reveal>
        </div>


        <div className={`grid gap-5 ${wa && socials.length ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
          {wa && <WhatsAppCard href={wa} />}
          {socials.length > 0 && (
            <ul className="grid gap-5">
              {socials.map((s, i) => (
                <Reveal key={s.key} delay={0.1 + i * 0.08} className="h-full">
                  <li className="h-full">
                    <a
                      href={s.url}
                      {...externalProps(s.url)}
                      className="group relative flex h-full min-h-28 items-center gap-5 overflow-hidden rounded-3xl border border-line bg-ivory/60 p-6 transition-colors duration-500 hover:border-transparent hover:text-white md:p-7"
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 ${brand[s.key].fill}`}
                      />
                      <span
                        className={`relative flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-[0_10px_24px_-12px_rgb(14_14_14/0.6)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${brand[s.key].chip}`}
                      >
                        <BrandIcon brand={s.key} className="size-6" />
                      </span>
                      <span className="relative min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-3">
                          <span className="font-display text-2xl md:text-3xl">{s.name}</span>
                          <span className="truncate text-sm text-stone transition-colors duration-500 group-hover:text-white/80">{s.handle}</span>
                        </span>
                        <span className="mt-1 block text-sm text-ink-soft transition-colors duration-500 group-hover:text-white/85">{s.blurb}</span>
                      </span>
                      <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-all duration-500 group-hover:-rotate-45 group-hover:border-white/40">
                        →
                      </span>
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function WhatsAppCard({ href }: { href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduced = useReducedMotion();
  // 0 nothing · 1 client message · 2 studio typing · 3 studio reply
  const [step, setStep] = useState(0);
  const shown = reduced ? 3 : step;

  useEffect(() => {
    if (!inView || reduced) return;
    const t = [setTimeout(() => setStep(1), 300), setTimeout(() => setStep(2), 1300), setTimeout(() => setStep(3), 2900)];
    return () => t.forEach(clearTimeout);
  }, [inView, reduced]);

  return (
    <Reveal className="h-full">
      <div
        ref={ref}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-ink p-6 text-paper md:p-9"
      >
        {/* soft green glow */}
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#25d366]/20 blur-3xl" />

        <div className="relative flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#25d366] text-white">
            <BrandIcon brand="whatsapp" className="size-6" />
          </span>
          <div>
            <p className="font-display text-2xl leading-none">Chat on WhatsApp</p>
            <p className="mt-1.5 flex items-center gap-2 text-xs text-paper/60">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-70 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-[#25d366]" />
              </span>
              Usually replies within a few hours
            </p>
          </div>
        </div>

        {/* chat preview */}
        <div className="relative mt-8 flex min-h-56 flex-1 flex-col justify-end gap-3 rounded-2xl bg-white/[0.04] p-4 text-sm md:p-5" aria-hidden>
          <AnimatePresence>
            {shown >= 1 && (
              <Bubble key="q" side="right">
                Hi! Our wedding is on 20 March, about 180 guests. We love the Kandyan Gold style. Could we get a quote?
              </Bubble>
            )}
            {shown === 2 && (
              <motion.div
                key="typing"
                className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-[#202c33] px-4 py-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-paper/60"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
            {shown >= 3 && (
              <Bubble key="a" side="left">
                Congratulations! Kandyan Gold suits a Poruwa beautifully. Here&apos;s your quote, plus a preview link with your names on it.
              </Bubble>
            )}
          </AnimatePresence>
        </div>

        <a
          href={href}
          {...externalProps(href)}
          className="group relative mt-6 inline-flex items-center justify-center gap-3 self-start rounded-full bg-[#25d366] px-7 py-4 text-sm font-medium text-[#062b17] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <BrandIcon brand="whatsapp" className="size-5" />
          Start a chat
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </Reveal>
  );
}

function Bubble({ side, children }: { side: "left" | "right"; children: React.ReactNode }) {
  const mine = side === "right";
  return (
    <motion.div
      layout
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
        mine ? "self-end rounded-br-sm bg-[#005c4b] text-white" : "self-start rounded-bl-sm bg-[#202c33] text-paper/90"
      }`}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
      <span className="ml-2 inline-block translate-y-0.5 text-[10px] text-white/50">
        {mine ? "10:24 ✓✓" : "10:26"}
      </span>
    </motion.div>
  );
}
