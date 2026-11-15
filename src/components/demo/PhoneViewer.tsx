"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Block, Design } from "@/lib/invitations";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/currency/Currency";
import { prices } from "@/lib/pricing";
import { customDesignHref } from "@/lib/contact";

// The invitation is rendered at a real phone size, then scaled to fit the window.
const SCREEN_W = 390;
const SCREEN_H = 844;
const BEZEL = 12;

const openingLabel: Record<Design["opening"]["type"], string> = {
  envelope: "Wax-sealed envelope",
  curtain: "Velvet curtain reveal",
  doors: "Temple doors",
  deco: "Art-deco gold reveal",
  scroll: "Unrolling parchment scroll",
  giftbox: "Gift box & confetti burst",
  balloons: "Balloons float away",
  ticket: "Tear-away ticket",
  iris: "Circular iris reveal",
  loveletter: "Love letter with a heart seal",
  ringbox: "Velvet ring box",
  caps: "Graduation cap toss",
  candle: "Tap to light a candle",
  ornament: "Christmas bauble & gold sparkles",
};

/** What a moment page includes, in plain words, from its sections. */
const blockLabel: Partial<Record<Block["type"], string>> = {
  timeline: "story timeline",
  photos: "photos",
  letter: "typed letter",
  reasons: "flip cards",
  question: "the big question",
  countdown: "countdown",
  cake: "candles to blow out",
  messages: "messages",
  details: "service details & directions",
  guestbook: "condolence book",
};
const includes = (inv: Design) => {
  if (inv.kind !== "moment") return "Countdown, events, map, calendar, RSVP";
  const list = [...new Set(inv.blocks.map((b) => blockLabel[b.type]).filter(Boolean))] as string[];
  return list.join(", ").replace(/^./, (c) => c.toUpperCase());
};

/**
 * Desktop: the live invitation inside a phone frame (an iframe of /i/<slug>, so it
 * behaves exactly like a guest's phone, including its own scrolling).
 * Phones: go straight to the full-screen invitation.
 */
export function PhoneViewer({
  inv,
  prev,
  next,
}: {
  inv: Design;
  prev: Design;
  next: Design;
}) {
  const router = useRouter();
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [reload, setReload] = useState(0);
  const src = `/i/${inv.slug}?guest=${encodeURIComponent(inv.sampleGuest)}`;

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      router.replace(src);
      return;
    }
    const el = stage.current!;
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      setScale(Math.min(1, h / (SCREEN_H + BEZEL * 2)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [router, src]);

  return (
    <section className="container-x grid min-h-dvh items-center gap-10 pb-10 pt-28 md:grid-cols-[1fr_auto_1fr] md:gap-14">
      {/* left: details */}
      <div className="order-2 md:order-1">
        <Link href="/demos" className="eyebrow text-stone hover:text-ink">
          ← All demos
        </Link>
        <p className="eyebrow mt-10 text-champagne-deep">{inv.category === "Moment" ? `Moments · ${inv.occasion}` : inv.category}</p>
        <h1 className="mt-3 font-display text-5xl leading-none lg:text-6xl">{inv.title}</h1>
        <p className="mt-4 max-w-xs text-ink-soft">{inv.style}.</p>
        <dl className="mt-8 space-y-3 text-sm">
          {[
            ["Opening", inv.opening.video ? "Cinematic video" : openingLabel[inv.opening.type]],
            ["Music", inv.music ? `Starts when the ${inv.kind === "moment" ? "page is opened" : "guest taps"}` : "Optional"],
            ["Includes", includes(inv)],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4 border-t border-line pt-3">
              <dt className="w-20 shrink-0 text-stone">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* centre: phone */}
      <div ref={stage} className="order-1 flex h-[calc(100dvh-9rem)] items-center justify-center md:order-2">
        {scale > 0 && (
          <motion.div
            key={inv.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: (SCREEN_W + BEZEL * 2) * scale, height: (SCREEN_H + BEZEL * 2) * scale }}
          >
            <div
              className="relative origin-top-left rounded-[3.2rem] bg-ink shadow-[0_50px_100px_-40px_rgb(14_14_14/0.6)]"
              style={{ width: SCREEN_W + BEZEL * 2, height: SCREEN_H + BEZEL * 2, padding: BEZEL, transform: `scale(${scale})` }}
            >
              <div className="pointer-events-none absolute left-1/2 top-[22px] z-10 h-7 w-28 -translate-x-1/2 rounded-full bg-ink" />
              <iframe
                key={reload}
                src={src}
                title={`${inv.title} demo`}
                className="block rounded-[2.5rem] bg-white"
                style={{ width: SCREEN_W, height: SCREEN_H }}
                allow="autoplay"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* right: actions */}
      <div className="order-3 flex flex-col gap-4 md:items-start">
        <Button href="/contact">Make it yours</Button>
        <p className="text-sm text-stone">
          {inv.kind === "moment" ? (
            <>Your words, photos and song. From <Price value={prices.moment} />.</>
          ) : (
            <>Your names, photos, events and music. From <Price value={prices.rsvp} />.</>
          )}
        </p>
        <Link href={customDesignHref} className="text-sm underline underline-offset-4 hover:text-champagne-deep">
          Or have one designed from scratch →
        </Link>
        <button onClick={() => setReload((n) => n + 1)} className="eyebrow mt-2 text-left text-stone hover:text-ink">
          ↻ Replay opening
        </button>
        <div className="mt-8 flex gap-6 text-sm">
          <Link href={`/demos/${prev.slug}`} className="hover:text-champagne-deep">
            ← {prev.title}
          </Link>
          <Link href={`/demos/${next.slug}`} className="hover:text-champagne-deep">
            {next.title} →
          </Link>
        </div>
      </div>
    </section>
  );
}
