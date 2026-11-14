"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { services } from "@/lib/content";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Price } from "@/components/currency/Currency";

const tones = ["bg-blush", "bg-ivory", "bg-[#dfe3d6]", "bg-[#ece2ee]"];

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
              text="For every kind of *occasion.*"
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-ink-soft">
              Weddings, celebrations and launches for your guests, or a personal page made for just one person.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.1}>
              <motion.div whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
                <Link
                  href={`/${s.slug}`}
                  className={`group @container flex aspect-[4/5] flex-col justify-between rounded-2xl p-7 ${tones[i % tones.length]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-stone">
                      From <Price value={s.from} />
                    </span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-ink/20 transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
                      →
                    </span>
                  </div>
                  <div>
                    <p className="font-accent text-lg italic text-ink-soft">{s.kicker}</p>
                    <h3 className="mt-2 font-display text-[clamp(1.9rem,12cqw,3rem)] leading-none">{s.title}</h3>
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
