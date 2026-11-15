"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import type { Block, Moment } from "@/lib/invitations";
import { Divider } from "./Ornaments";

// The sections a personal "moment" page is built from. A page is just
// moment.blocks rendered in order; see the Block type in lib/invitations.ts.

const ease = [0.22, 1, 0.36, 1] as const;
const line = "color-mix(in oklab, var(--inv-accent) 40%, transparent)";

const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Font = Moment["theme"]["namesFont"];
const titleClass: Record<Font, string> = {
  script: "font-script text-[clamp(3.4rem,16vw,4.8rem)] leading-[1.05]",
  display: "font-display text-[clamp(2.6rem,12vw,3.8rem)] leading-[1.02]",
  sans: "font-sans uppercase tracking-[0.16em] text-[clamp(2rem,10vw,2.8rem)] leading-[1.1]",
};
const headingClass: Record<Font, string> = {
  script: "font-script text-5xl leading-tight",
  display: "font-display text-4xl leading-tight",
  sans: "font-sans text-2xl uppercase tracking-[0.2em]",
};

function In({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ font, children }: { font: Font; children: ReactNode }) {
  return (
    <In className="mb-10 text-center">
      <h2 className={headingClass[font]}>{children}</h2>
      <Divider className="mx-auto mt-3 w-32 text-[var(--inv-accent)]" />
    </In>
  );
}

const Heart = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.1 5.4 3.1 1.8-2 3.3-3.1 5.4-3.1 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z" />
  </svg>
);

/** One-shot burst of hearts or confetti from the centre. */
function Burst({ kind, color }: { kind: "hearts" | "confetti"; color: string }) {
  const palette = [color, "#ffd166", "#ffffff", "#7fb3ff", "#ff8fb4"];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-visible">
      {Array.from({ length: 26 }, (_, i) => {
        const a = rand(i, 1) * Math.PI * 2;
        const d = 90 + rand(i, 2) * 170;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 block"
            style={{ color: kind === "hearts" ? (i % 3 ? color : "#ffffff") : palette[i % palette.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 60, opacity: 0, scale: 1, rotate: (rand(i, 3) - 0.5) * 360 }}
            transition={{ duration: 1.6 + rand(i, 4) * 0.6, ease: "easeOut" }}
          >
            {kind === "hearts" ? <Heart className="size-4" /> : <span className="block h-2.5 w-1.5 rounded-sm bg-current" />}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

function Art({ art, revealed }: { art: NonNullable<Extract<Block, { type: "hero" }>["art"]>; revealed: boolean }) {
  const draw = {
    initial: { pathLength: 0, opacity: 0 },
    animate: revealed ? { pathLength: 1, opacity: 1 } : {},
    transition: { duration: 1.8, delay: 0.2, ease },
  };
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 64 64" className="mx-auto mb-6 size-20 text-[var(--inv-accent)]" aria-hidden>
      {art === "ring" && (
        <>
          <motion.ellipse cx="32" cy="42" rx="15" ry="13" {...common} {...draw} />
          <motion.path d="M24 20 L28 14 H36 L40 20 L32 30 Z M24 20 H40 M28 14 L32 20 L36 14 M32 20 V30" {...common} {...draw} />
        </>
      )}
      {art === "heart" && (
        <motion.path d="M32 54s-19-11.5-24-23C4.5 22 9.5 13 18.5 13c5 0 9 2.8 13.5 7.8C36.5 15.8 40.5 13 45.5 13 54.5 13 59.5 22 56 31c-5 11.5-24 23-24 23Z" {...common} {...draw} />
      )}
      {art === "cap" && (
        <>
          <motion.path d="M32 12 L60 24 L32 36 L4 24 Z" {...common} {...draw} />
          <motion.path d="M16 30 V42 C16 50 48 50 48 42 V30 M32 24 L54 28 V42" {...common} {...draw} />
        </>
      )}
      {art === "candle" && (
        <>
          <motion.path d="M24 58 H40 M26 58 V26 H38 V58 M32 26 V22" {...common} {...draw} />
          <motion.path
            d="M32 21 C27 15 31 10 32 6 C33 10 37 15 32 21 Z"
            fill="currentColor"
            stroke="none"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={revealed ? { opacity: [0.7, 1, 0.8, 1], scale: [0.95, 1.05, 0.98, 1] } : {}}
            transition={{ duration: 2.2, repeat: Infinity, delay: 1.4 }}
            style={{ transformOrigin: "32px 21px" }}
          />
        </>
      )}
      {art === "tree" && (
        <>
          <motion.path d="M32 12 L22 26 H27 L17 40 H24 L13 54 H51 L40 40 H47 L37 26 H42 Z M32 54 V60 M27 60 H37" {...common} {...draw} />
          <motion.path
            d="M32 3 L33.6 7.4 L38.2 7.6 L34.6 10.4 L35.9 14.8 L32 12.2 L28.1 14.8 L29.4 10.4 L25.8 7.6 L30.4 7.4 Z"
            fill="currentColor"
            stroke="none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={revealed ? { opacity: [0.6, 1, 0.75, 1], scale: [0.95, 1.1, 1, 1.05] } : {}}
            transition={{ duration: 2.4, repeat: Infinity, delay: 1.6 }}
            style={{ transformOrigin: "32px 9px" }}
          />
        </>
      )}
      {art === "cake" && (
        <>
          <motion.path d="M10 56 H54 M14 56 V40 H50 V56 M18 40 V30 H46 V40 M14 46 C18 50 22 42 26 46 C30 50 34 42 38 46 C42 50 46 42 50 46" {...common} {...draw} />
          <motion.path d="M26 30 V22 M32 30 V20 M38 30 V22" {...common} {...draw} />
        </>
      )}
    </svg>
  );
}

function HeroBlock({ b, font, revealed }: { b: Extract<Block, { type: "hero" }>; font: Font; revealed: boolean }) {
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1, delay, ease },
  });
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 py-24 text-center">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 38%, var(--inv-surface), var(--inv-bg) 72%)" }} />
      <div className="relative">
        {b.art && <Art art={b.art} revealed={revealed} />}
        <motion.p className="eyebrow text-[0.62rem] text-[var(--inv-accent)]" {...show(0.3)}>
          {b.eyebrow}
        </motion.p>
        <motion.h1 className={`mt-5 ${titleClass[font]}`} {...show(0.6)}>
          {b.title}
        </motion.h1>
        {b.subtitle && (
          <motion.p className="mx-auto mt-5 max-w-xs font-accent text-xl italic leading-snug opacity-90" {...show(0.95)}>
            {b.subtitle}
          </motion.p>
        )}
        {b.note && (
          <motion.div {...show(1.2)}>
            <Divider className="mx-auto my-6 w-36 text-[var(--inv-accent)]" />
            <p className="mx-auto max-w-xs text-sm leading-relaxed opacity-80">{b.note}</p>
          </motion.div>
        )}
      </div>
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.3em] opacity-70"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 0.7, y: [0, 6, 0] } : { opacity: 0 }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
      >
        SCROLL
      </motion.div>
    </section>
  );
}

/* ───────────────────────────── Timeline ───────────────────────────── */

function TimelineBlock({ b, font }: { b: Extract<Block, { type: "timeline" }>; font: Font }) {
  return (
    <>
      <Heading font={font}>{b.heading}</Heading>
      <ol className="relative ml-3 space-y-10 border-l pl-7" style={{ borderColor: line }}>
        {b.items.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="absolute -left-[2.2rem] top-1 size-3 rounded-full" style={{ background: "var(--inv-accent)" }} />
            <In delay={i * 0.05}>
              <p className="eyebrow text-[0.6rem] text-[var(--inv-accent)]">{s.date}</p>
              <h3 className="mt-1 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80">{s.text}</p>
            </In>
          </li>
        ))}
      </ol>
    </>
  );
}

/* ───────────────────────────── Photos (polaroids) ───────────────────────────── */

function PhotosBlock({ b, font }: { b: Extract<Block, { type: "photos" }>; font: Font }) {
  return (
    <>
      <Heading font={font}>{b.heading}</Heading>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {b.items.map((p, i) => {
          const tilt = (i % 2 ? 1 : -1) * (2 + rand(i, 1) * 3);
          return (
            <motion.figure
              key={p.caption}
              className={`rounded-sm bg-[#fffdf8] p-2 pb-0 text-[#2b2420] shadow-[0_18px_30px_-16px_rgb(0_0_0/0.55)] ${i % 2 ? "mt-6" : ""}`}
              initial={{ opacity: 0, y: 30, rotate: tilt * 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.12, ease }}
            >
              <div className="relative aspect-square overflow-hidden">
                {p.src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- client-supplied photo
                  <img src={p.src} alt={p.caption} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div
                    className="flex h-full w-full items-end justify-center pb-2 text-[0.55rem] uppercase tracking-[0.2em] text-white/80"
                    style={{
                      background: `linear-gradient(${135 + i * 40}deg, color-mix(in oklab, var(--inv-accent) 75%, white), color-mix(in oklab, var(--inv-surface) 70%, var(--inv-accent)))`,
                    }}
                  >
                    Your photo
                  </div>
                )}
              </div>
              <figcaption className="py-2.5 text-center font-accent text-sm italic">{p.caption}</figcaption>
            </motion.figure>
          );
        })}
      </div>
    </>
  );
}

/* ───────────────────────────── Letter (typed out) ───────────────────────────── */

function LetterBlock({ b, font }: { b: Extract<Block, { type: "letter" }>; font: Font }) {
  const text = b.paragraphs.join("\n\n");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const shown = reduced ? text.length : typed;

  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => setTyped((n) => (n >= text.length ? n : n + 1)), 32);
    return () => clearInterval(id);
  }, [inView, reduced, text.length]);

  const done = shown >= text.length;
  return (
    <>
      <Heading font={font}>{b.heading}</Heading>
      <In>
        <div
          ref={ref}
          className="relative -rotate-1 rounded-sm bg-[#fffaf1] px-6 py-8 text-[#3a2a22] shadow-[0_24px_40px_-20px_rgb(0_0_0/0.5)]"
          style={{ backgroundImage: "repeating-linear-gradient(transparent 0 31px, rgb(160 130 100 / 0.18) 31px 32px)" }}
        >
          <div className="relative font-accent text-lg italic leading-8">
            {/* full text keeps the card's final size; the typed copy sits on top */}
            <p className="invisible whitespace-pre-line">{text}</p>
            <p className="absolute inset-0 whitespace-pre-line" aria-label={text}>
              {text.slice(0, shown)}
              {!done && <span className="ml-0.5 inline-block h-5 w-px translate-y-1 animate-pulse bg-current" />}
            </p>
          </div>
          <motion.p
            className="mt-6 text-right font-script text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            {b.signoff}
          </motion.p>
        </div>
      </In>
    </>
  );
}

/* ───────────────────────────── Reasons (flip cards) ───────────────────────────── */

function ReasonsBlock({ b, font }: { b: Extract<Block, { type: "reasons" }>; font: Font }) {
  const [open, setOpen] = useState<number[]>([]);
  return (
    <>
      <Heading font={font}>{b.heading}</Heading>
      <p className="-mt-6 mb-6 text-center text-xs uppercase tracking-[0.2em] opacity-70">
        {open.length < b.items.length ? `Tap a card · ${open.length} of ${b.items.length}` : "Every one of them true"}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {b.items.map((r, i) => {
          const flipped = open.includes(i);
          return (
            <In key={r} delay={(i % 2) * 0.08}>
              <button
                className="relative block aspect-[4/5] w-full [perspective:900px]"
                onClick={() => setOpen((o) => (o.includes(i) ? o : [...o, i]))}
                aria-label={flipped ? r : `Reason ${i + 1}, tap to reveal`}
              >
                <motion.div
                  className="relative h-full w-full [transform-style:preserve-3d]"
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.7, ease }}
                >
                  <span
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl [backface-visibility:hidden]"
                    style={{ background: "var(--inv-accent)", color: "var(--inv-on-accent)" }}
                  >
                    <Heart className="size-8" />
                    <span className="font-display text-2xl">#{i + 1}</span>
                  </span>
                  <span
                    className="absolute inset-0 flex items-center justify-center rounded-2xl border p-4 text-center font-accent text-[1.05rem] italic leading-snug [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    style={{ borderColor: line, background: "var(--inv-bg)" }}
                  >
                    {r}
                  </span>
                </motion.div>
              </button>
            </In>
          );
        })}
      </div>
    </>
  );
}

/* ───────────────────────────── The question (the No button runs away) ───────────────────────────── */

const noLabels = (no: string) => [no, "Are you sure?", "Really?", "Think again!", "Nope, try the other one"];

function QuestionBlock({ b, font, particles }: { b: Extract<Block, { type: "question" }>; font: Font; particles: Moment["particles"] }) {
  const [answered, setAnswered] = useState(false);
  const [dodges, setDodges] = useState(0);
  const [pos, setPos] = useState({ left: 62, top: 50 });
  // one tap fires several events (pointer, mouse, click); count it once
  const lastDodge = useRef(0);

  const dodge = () => {
    const now = performance.now();
    if (now - lastDodge.current < 350) return;
    lastDodge.current = now;
    setDodges((d) => d + 1);
    setPos((p) => {
      // jump somewhere else in the box, away from where it was and from the Yes button
      for (let k = 1; k < 20; k++) {
        const left = 6 + rand(dodges * 7 + k, 21) * 62;
        const top = 12 + rand(dodges * 7 + k, 22) * 76;
        const farFromLast = Math.hypot(left - p.left, top - p.top) > 25;
        const farFromYes = Math.hypot(left - 22, top - 50) > 26;
        if (farFromLast && farFromYes) return { left, top };
      }
      return { left: p.left > 40 ? 10 : 66, top: p.top > 50 ? 18 : 80 };
    });
  };

  return (
    <div className="text-center">
      <In>
        <h2 className={headingClass[font]}>{b.question}</h2>
      </In>
      <AnimatePresence mode="wait">
        {answered ? (
          <motion.div
            key="yes"
            className="relative mt-8 py-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease }}
          >
            <Burst kind={particles === "confetti" ? "confetti" : "hearts"} color="var(--inv-accent)" />
            <motion.span
              className="mx-auto flex size-16 items-center justify-center rounded-full text-[var(--inv-on-accent)]"
              style={{ background: "var(--inv-accent)" }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Heart className="size-8" />
            </motion.span>
            <p className={`mt-6 ${headingClass[font]}`}>{b.success}</p>
            <p className="mx-auto mt-4 max-w-xs font-accent text-lg italic opacity-90">{b.successText}</p>
          </motion.div>
        ) : (
          <motion.div key="ask" exit={{ opacity: 0 }} className="relative mt-8 h-64">
            <motion.button
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] shadow-lg"
              style={{ left: "26%", top: "50%", background: "var(--inv-accent)", color: "var(--inv-on-accent)" }}
              animate={{ scale: Math.min(1 + dodges * 0.12, 1.7) }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAnswered(true)}
            >
              {b.yes}
            </motion.button>
            <motion.button
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-6 py-3 text-xs uppercase tracking-[0.2em]"
              style={{ borderColor: "color-mix(in oklab, var(--inv-fg) 35%, transparent)" }}
              animate={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              initial={false}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              onPointerEnter={(e) => e.pointerType === "mouse" && dodge()}
              onPointerDown={(e) => {
                e.preventDefault();
                dodge();
              }}
              onClick={dodge}
            >
              {noLabels(b.no)[Math.min(dodges, 4)]}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────────── Countdown ───────────────────────────── */

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { v: Math.floor(s / 86400), l: "Days" },
    { v: Math.floor((s % 86400) / 3600), l: "Hours" },
    { v: Math.floor((s % 3600) / 60), l: "Minutes" },
    { v: s % 60, l: "Seconds" },
  ];
}

function CountdownBlock({ b, font }: { b: Extract<Block, { type: "countdown" }>; font: Font }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(b.to).getTime();
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [b.to]);
  return (
    <>
      <Heading font={font}>{b.heading}</Heading>
      {left !== null && left <= 0 ? (
        <p className="text-center font-accent text-2xl italic">{b.doneText}</p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {(left === null ? parts(0).map((p) => ({ ...p, v: null })) : parts(left)).map((p, i) => (
            <In key={p.l} delay={i * 0.08}>
              <div className="rounded-xl border px-1 py-4 text-center" style={{ borderColor: line }}>
                <p className="font-display text-3xl tabular-nums">{p.v === null ? "–" : String(p.v).padStart(2, "0")}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] opacity-70">{p.l}</p>
              </div>
            </In>
          ))}
        </div>
      )}
    </>
  );
}

/* ───────────────────────────── Cake (tap the flames) ───────────────────────────── */

function CakeBlock({ b, font }: { b: Extract<Block, { type: "cake" }>; font: Font }) {
  const [out, setOut] = useState<number[]>([]);
  const done = out.length >= b.candles;
  return (
    <div className="text-center">
      <Heading font={font}>{b.heading}</Heading>
      <p className="-mt-6 mb-8 text-xs uppercase tracking-[0.2em] opacity-70">
        {done ? "All out!" : "Tap each flame to blow it out"}
      </p>
      <div className="relative mx-auto w-64">
        {done && <Burst kind="confetti" color="var(--inv-accent)" />}
        {/* candles */}
        <div className="relative z-[1] flex justify-center gap-4">
          {Array.from({ length: b.candles }, (_, i) => {
            const lit = !out.includes(i);
            return (
              <button
                key={i}
                className="flex h-20 w-6 flex-col items-center justify-end"
                onClick={() => lit && setOut((o) => [...o, i])}
                aria-label={lit ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
              >
                <AnimatePresence>
                  {lit ? (
                    <motion.span
                      key="flame"
                      className="mb-0.5 block h-6 w-3.5 origin-bottom rounded-[50%_50%_45%_45%/65%_65%_35%_35%]"
                      style={{ background: "radial-gradient(ellipse at 50% 75%, #fffbe8, #ffd27a 40%, #ff9a3c 70%, transparent 76%)" }}
                      animate={{ scaleY: [1, 1.12, 0.94, 1.06, 1], rotate: [-2, 2, -1, 1, -2] }}
                      exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
                      transition={{ duration: 1.1 + i * 0.1, repeat: Infinity }}
                    />
                  ) : (
                    <motion.span
                      key="smoke"
                      className="mb-0.5 block h-6 w-3 rounded-full bg-white/50 blur-[3px]"
                      initial={{ opacity: 0.8, y: 0, scale: 0.6 }}
                      animate={{ opacity: 0, y: -26, scale: 1.4 }}
                      transition={{ duration: 1.2 }}
                    />
                  )}
                </AnimatePresence>
                <span className="block h-10 w-2.5 rounded-t-sm" style={{ background: "repeating-linear-gradient(160deg, #ffffff 0 5px, var(--inv-accent) 5px 9px)" }} />
              </button>
            );
          })}
        </div>
        {/* tiers */}
        <div
          className="relative mx-auto h-14 w-48 rounded-t-xl"
          style={{
            background: "var(--inv-accent)",
            backgroundImage: "radial-gradient(circle at 10px -2px, #fff7fb 9px, transparent 10px)",
            backgroundSize: "20px 14px",
            backgroundRepeat: "repeat-x",
          }}
        />
        <div
          className="relative mx-auto h-16 w-60 rounded-t-lg"
          style={{
            background: "color-mix(in oklab, var(--inv-accent) 22%, #fff6f9)",
            backgroundImage: "radial-gradient(circle at 12px -3px, var(--inv-accent) 10px, transparent 11px)",
            backgroundSize: "24px 16px",
            backgroundRepeat: "repeat-x",
          }}
        />
        <div className="mx-auto h-2.5 w-64 rounded-full bg-white/70" />
      </div>
      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <p className="font-accent text-xl italic">{b.doneText}</p>
            <button onClick={() => setOut([])} className="mt-4 text-[0.65rem] uppercase tracking-[0.25em] opacity-70 underline-offset-4 hover:underline">
              Light them again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────────── Messages ───────────────────────────── */

function MessagesBlock({ b, font }: { b: Extract<Block, { type: "messages" }>; font: Font }) {
  return (
    <>
      <Heading font={font}>{b.heading}</Heading>
      <div className="space-y-4">
        {b.items.map((m, i) => (
          <In key={m.from} delay={i * 0.06}>
            <figure className="rounded-2xl border p-6" style={{ borderColor: line, background: "var(--inv-bg)" }}>
              <span className="font-display text-4xl leading-none text-[var(--inv-accent)]">&ldquo;</span>
              <blockquote className="-mt-3 font-accent text-lg italic leading-snug">{m.text}</blockquote>
              <figcaption className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] opacity-75">{m.from}</figcaption>
            </figure>
          </In>
        ))}
      </div>
    </>
  );
}

/* ───────────────────────────── Quote ───────────────────────────── */

function QuoteBlock({ b }: { b: Extract<Block, { type: "quote" }> }) {
  return (
    <In className="text-center">
      <Divider className="mx-auto w-32 text-[var(--inv-accent)]" />
      <blockquote className="mx-auto mt-8 max-w-sm font-accent text-2xl italic leading-snug">{b.text}</blockquote>
      {b.by && <p className="mt-5 text-[0.65rem] uppercase tracking-[0.25em] opacity-70">{b.by}</p>}
      <Divider className="mx-auto mt-8 w-32 rotate-180 text-[var(--inv-accent)]" />
    </In>
  );
}

/* ───────────────────────────── Details ───────────────────────────── */

function DetailsBlock({ b, font }: { b: Extract<Block, { type: "details" }>; font: Font }) {
  return (
    <>
      <Heading font={font}>{b.heading}</Heading>
      <div className="space-y-4">
        {b.items.map((d, i) => (
          <In key={d.title} delay={i * 0.06}>
            <article className="rounded-2xl border p-6 text-center" style={{ borderColor: line, background: "var(--inv-bg)" }}>
              <h3 className="font-display text-2xl">{d.title}</h3>
              <p className="mt-3 text-sm">{d.when}</p>
              <p className="text-sm opacity-80">{d.where}</p>
              {d.note && <p className="mt-3 font-accent italic opacity-80">{d.note}</p>}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.where)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full border px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.2em]"
                style={{ borderColor: "var(--inv-accent)" }}
              >
                Directions
              </a>
            </article>
          </In>
        ))}
      </div>
    </>
  );
}

/* ───────────────────────────── Condolence book ───────────────────────────── */

function GuestbookBlock({ b, font }: { b: Extract<Block, { type: "guestbook" }>; font: Font }) {
  const [lit, setLit] = useState(false);
  const [sent, setSent] = useState(false);
  const field = "mt-1 w-full rounded-lg border bg-transparent px-4 py-3 text-base outline-none focus:border-[var(--inv-accent)]";
  const fieldLine = { borderColor: "color-mix(in oklab, var(--inv-fg) 25%, transparent)" };

  return (
    <>
      <Heading font={font}>{b.heading}</Heading>

      <In className="text-center">
        <button
          onClick={() => setLit(true)}
          disabled={lit}
          className="inline-flex items-center gap-3 rounded-full border px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors disabled:cursor-default"
          style={lit ? { background: "var(--inv-accent)", color: "var(--inv-on-accent)", borderColor: "var(--inv-accent)" } : { borderColor: "var(--inv-accent)" }}
        >
          <span
            className="block h-4 w-2.5 rounded-[50%_50%_45%_45%/65%_65%_35%_35%]"
            style={{ background: lit ? "radial-gradient(ellipse at 50% 75%, #fffbe8, #ffd27a 50%, #ff9a3c 80%)" : "color-mix(in oklab, var(--inv-fg) 30%, transparent)" }}
          />
          {lit ? "Your candle is lit" : "Light a candle"}
        </button>
        <p className="mt-3 text-sm opacity-75">{(b.candlesLit + (lit ? 1 : 0)).toLocaleString("en")} candles lit</p>
      </In>

      <div className="mt-10 space-y-4">
        {b.entries.map((e, i) => (
          <In key={e.from} delay={i * 0.06}>
            <figure className="border-l-2 py-1 pl-5" style={{ borderColor: "var(--inv-accent)" }}>
              <blockquote className="font-accent text-lg italic leading-snug opacity-90">{e.text}</blockquote>
              <figcaption className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] opacity-70">{e.from}</figcaption>
            </figure>
          </In>
        ))}
      </div>

      <In className="mt-10">
        <div className="rounded-2xl border p-6" style={fieldLine}>
          {sent ? (
            <div className="py-6 text-center">
              <p className="font-accent text-xl italic">Thank you for sharing your memory.</p>
              <p className="mt-3 text-xs opacity-70">This is a demo — nothing was saved.</p>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <p className="text-xs uppercase tracking-[0.18em] opacity-80">Share a memory or message</p>
              <input required placeholder="Your name" className={field} style={fieldLine} />
              <textarea required rows={3} placeholder="Your message" className={`${field} resize-none`} style={fieldLine} />
              <button type="submit" className="w-full rounded-full py-4 text-xs font-medium uppercase tracking-[0.25em]" style={{ background: "var(--inv-accent)", color: "var(--inv-on-accent)" }}>
                Sign the book
              </button>
            </form>
          )}
        </div>
      </In>
    </>
  );
}

/* ───────────────────────────── Closing ───────────────────────────── */

function ClosingBlock({ b, font }: { b: Extract<Block, { type: "closing" }>; font: Font }) {
  return (
    <In className="text-center">
      <Divider className="mx-auto w-40 text-[var(--inv-accent)]" />
      <p className="mx-auto mt-8 max-w-xs font-accent text-2xl italic leading-snug">{b.text}</p>
      <p className={`mt-6 ${font === "script" ? "font-script text-5xl" : "font-display text-3xl"}`}>{b.signoff}</p>
      {/* _top: inside the phone viewer, open the studio site in the main window */}
      <Link href="/" target="_top" className="mt-12 inline-block text-[0.6rem] uppercase tracking-[0.3em] opacity-50 hover:opacity-90">
        Made by Entice Studio
      </Link>
    </In>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */

export function MomentBlocks({ m, revealed }: { m: Moment; revealed: boolean }) {
  const font = m.theme.namesFont;
  return m.blocks.map((b, i) => {
    if (b.type === "hero") return <HeroBlock key={i} b={b} font={font} revealed={revealed} />;
    // alternate backgrounds between the sections after the hero
    const alt = m.blocks.slice(0, i).filter((x) => x.type !== "hero").length % 2 === 0;
    const style = { background: alt ? "var(--inv-surface)" : "var(--inv-bg)" };
    const pad = b.type === "closing" ? "px-6 pb-16 pt-14" : "px-6 py-20";
    return (
      <section key={i} className={`relative ${pad}`} style={style}>
        {b.type === "timeline" && <TimelineBlock b={b} font={font} />}
        {b.type === "photos" && <PhotosBlock b={b} font={font} />}
        {b.type === "letter" && <LetterBlock b={b} font={font} />}
        {b.type === "reasons" && <ReasonsBlock b={b} font={font} />}
        {b.type === "question" && <QuestionBlock b={b} font={font} particles={m.particles} />}
        {b.type === "countdown" && <CountdownBlock b={b} font={font} />}
        {b.type === "cake" && <CakeBlock b={b} font={font} />}
        {b.type === "messages" && <MessagesBlock b={b} font={font} />}
        {b.type === "quote" && <QuoteBlock b={b} />}
        {b.type === "details" && <DetailsBlock b={b} font={font} />}
        {b.type === "guestbook" && <GuestbookBlock b={b} font={font} />}
        {b.type === "closing" && <ClosingBlock b={b} font={font} />}
      </section>
    );
  });
}
