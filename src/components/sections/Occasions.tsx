"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { services } from "@/lib/content";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";

const tones = ["bg-blush", "bg-ivory", "bg-[#dfe3d6]"];

/** Three service lanes as tilting cards. */
export function Occasions() {
  return (
    <section className="py-28 md:py-40">
      <div className="container-x">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow text-stone">What we create</p>
            </Reveal>
            <SplitHeading
              className="mt-5 max-w-2xl font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1]"
              text="For every kind of *gathering.*"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-ink-soft">
              Start with weddings and private celebrations, or bring your brand to life with an opening or launch page.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.1}>
              <motion.div whileHover={{ y: -8, rotate: i === 1 ? 0 : i === 0 ? -1 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                <Link
                  href={`/${s.slug}`}
                  className={`group flex aspect-[4/5] flex-col justify-between rounded-2xl p-8 ${tones[i]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-stone">{s.range}</span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-ink/20 transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
                      →
                    </span>
                  </div>
                  <div>
                    <p className="font-accent text-lg italic text-ink-soft">{s.kicker}</p>
                    <h3 className="mt-2 font-display text-5xl">{s.title}</h3>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {s.occasions.slice(0, 4).map((o) => (
                        <li key={o} className="rounded-full border border-ink/15 px-3 py-1 text-xs">
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
