"use client";

import { motion } from "motion/react";
import type { Design } from "@/lib/invitations";

// Openings for personal "moment" pages. Like the others, each gets `started`
// (the visitor has tapped) and runs its own timeline; the Gate fades it away.

type Props = { inv: Design; started: boolean };
const ease = [0.65, 0, 0.35, 1] as const;

const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/* ───────────── Ring box: velvet lid lifts, the ring catches the light ───────────── */

export function RingBoxOpening({ inv, started }: Props) {
  const { bg, surface, accent } = inv.theme;
  const velvet = inv.theme.velvet ?? "#6d1430";
  const shade = `color-mix(in oklab, ${velvet} 70%, black)`;

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `radial-gradient(circle at 50% 42%, ${surface}, ${bg} 70%)` }}>
      {/* light that blooms when the box opens */}
      <motion.div
        className="absolute left-1/2 top-[44%] size-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 65%)` }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={started ? { opacity: [0, 0.9, 0.6], scale: [0.4, 2.2, 9] } : { opacity: 0.15, scale: [0.9, 1.05, 0.9] }}
        transition={started ? { duration: 2.2, delay: 0.6, times: [0, 0.4, 1], ease } : { duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="relative w-44 [perspective:700px]"
        animate={started ? { scale: [1, 1, 1.25], y: [0, 0, -10], opacity: [1, 1, 0] } : { y: [0, -6, 0] }}
        transition={started ? { duration: 2.4, times: [0, 0.6, 1], ease } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* inside of the box: cushion + ring (hidden by the lid until it lifts) */}
        <div className="relative mx-auto h-20 w-40 rounded-t-xl" style={{ background: shade }}>
          <div className="absolute inset-x-3 bottom-0 top-3 rounded-t-lg" style={{ background: `color-mix(in oklab, ${velvet} 55%, #2a0a12)` }} />
          <motion.svg
            viewBox="0 0 60 60"
            className="absolute bottom-1 left-1/2 w-16 -translate-x-1/2"
            initial={{ y: 12 }}
            animate={started ? { y: -4 } : { y: 12 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            aria-hidden
          >
            {/* band */}
            <ellipse cx="30" cy="40" rx="17" ry="13" fill="none" stroke={accent} strokeWidth="4" />
            {/* setting + diamond */}
            <path d="M24 26 L30 20 L36 26 Z" fill={accent} />
            <path d="M22 16 L26 10 L34 10 L38 16 L30 26 Z" fill="#f4fbff" stroke="#bfe3ff" strokeWidth="0.8" />
            <path d="M22 16 H38 M26 10 L30 16 L34 10 M30 16 V26" stroke="#bfe3ff" strokeWidth="0.6" fill="none" />
          </motion.svg>
          {/* sparkle on the diamond */}
          <motion.span
            className="absolute left-1/2 top-0 size-6 -translate-x-1/2"
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={started ? { opacity: [0, 1, 0], scale: [0, 1.4, 0], rotate: 90 } : {}}
            transition={{ duration: 0.9, delay: 1.1 }}
            style={{ background: "conic-gradient(from 45deg, transparent 0 20%, white 25%, transparent 30% 45%, white 50%, transparent 55% 70%, white 75%, transparent 80%)", clipPath: "polygon(50% 0, 58% 42%, 100% 50%, 58% 58%, 50% 100%, 42% 58%, 0 50%, 42% 42%)" }}
          />
        </div>

        {/* lid, hinged at the back */}
        <motion.div
          className="absolute inset-x-0 top-0 mx-auto h-20 w-44 origin-top rounded-t-[1.6rem] shadow-[0_-6px_20px_-8px_rgb(0_0_0/0.6)]"
          style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${velvet} 85%, white), ${velvet})`, transformStyle: "preserve-3d" }}
          animate={{ rotateX: started ? 112 : 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          <span className="absolute inset-0 rounded-t-[1.6rem]" style={{ background: "radial-gradient(ellipse at 30% 25%, rgb(255 255 255 / 0.28), transparent 55%)" }} />
          <span className="absolute inset-x-6 bottom-2 h-px opacity-50" style={{ background: accent }} />
        </motion.div>

        {/* front of the box */}
        <div
          className="relative mx-auto h-16 w-44 rounded-b-2xl shadow-[0_30px_50px_-20px_rgb(0_0_0/0.7)]"
          style={{ background: `linear-gradient(180deg, ${velvet}, ${shade})` }}
        >
          <span className="absolute inset-x-0 top-0 h-px" style={{ background: accent, opacity: 0.6 }} />
          <span className="absolute inset-0 rounded-b-2xl" style={{ background: "linear-gradient(90deg, rgb(255 255 255 / 0.08), transparent 40%, rgb(0 0 0 / 0.15))" }} />
          {/* gold clasp */}
          <span
            className="absolute left-1/2 top-0 h-3.5 w-7 -translate-x-1/2 -translate-y-1/2 rounded-[3px] shadow-[0_2px_6px_rgb(0_0_0/0.4)]"
            style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${accent} 70%, white), ${accent})` }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ───────────── Graduation caps: a hat toss, then confetti ───────────── */

function Cap({ color, tassel, className = "" }: { color: string; tassel: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 70" className={className} aria-hidden>
      <path d="M50 6 L96 24 L50 42 L4 24 Z" fill={color} />
      <path d="M50 6 L96 24 L50 42 L4 24 Z" fill="white" opacity="0.1" />
      <path d="M50 6 L96 24 L50 42 L4 24 Z" fill="none" stroke={tassel} strokeWidth="1" strokeOpacity="0.55" />
      <path d="M24 32 V48 C24 56 76 56 76 48 V32 L50 42 Z" fill={color} />
      <path d="M24 32 V48 C24 56 76 56 76 48 V32" fill="black" opacity="0.25" />
      <circle cx="50" cy="24" r="2.6" fill={tassel} />
      <path d="M50 24 L86 30 V50" stroke={tassel} strokeWidth="2" fill="none" />
      <path d="M83 50 h6 l-1 10 h-4 Z" fill={tassel} />
    </svg>
  );
}

export function CapsOpening({ inv, started }: Props) {
  const { bg, surface, accent } = inv.theme;
  const ink = `color-mix(in oklab, ${bg} 75%, #2a2f45)`;
  const caps = Array.from({ length: 6 }, (_, i) => ({
    x: (rand(i, 1) - 0.5) * 260,
    rot: (rand(i, 2) - 0.5) * 720,
    delay: 0.15 + rand(i, 3) * 0.35,
    size: 44 + rand(i, 4) * 36,
    left: 15 + rand(i, 5) * 70,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `radial-gradient(circle at 50% 45%, ${surface}, ${bg} 72%)` }}>
      {/* stars */}
      {Array.from({ length: 26 }, (_, i) => (
        <span
          key={i}
          className="absolute block animate-[twinkle_ease-in-out_infinite] rounded-full"
          // rounded so the server HTML and the browser agree exactly
          style={{
            left: `${(rand(i, 7) * 100).toFixed(2)}%`,
            top: `${(rand(i, 8) * 70).toFixed(2)}%`,
            width: 2,
            height: 2,
            background: accent,
            animationDuration: `${(2 + rand(i, 9) * 3).toFixed(2)}s`,
            animationDelay: `${(-rand(i, 6) * 4).toFixed(2)}s`,
          }}
        />
      ))}

      {/* soft light behind the cap */}
      <motion.div
        className="absolute left-1/2 top-[40%] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, color-mix(in oklab, ${accent} 30%, transparent), transparent 65%)` }}
        animate={started ? { opacity: 0 } : { opacity: [0.6, 1, 0.6] }}
        transition={started ? { duration: 0.6 } : { duration: 3.4, repeat: Infinity }}
      />
      {/* the big cap */}
      <motion.div
        className="absolute left-1/2 top-[40%] w-48 -translate-x-1/2 -translate-y-1/2"
        animate={started ? { y: "-120vh", rotate: -200 } : { y: [0, -8, 0], rotate: [-4, 3, -4] }}
        transition={started ? { duration: 1.6, ease: [0.5, 0, 0.75, 0] } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cap color={ink} tassel={accent} className="w-full drop-shadow-[0_20px_30px_rgb(0_0_0/0.45)]" />
      </motion.div>

      {/* the rest of the class throws theirs */}
      {started &&
        caps.map((c, i) => (
          <motion.div
            key={i}
            className="absolute bottom-[-12%]"
            style={{ left: `${c.left}%`, width: c.size }}
            initial={{ y: 0, x: 0, rotate: 0 }}
            animate={{ y: "-130vh", x: c.x, rotate: c.rot }}
            transition={{ duration: 1.9, delay: c.delay, ease: [0.2, 0.6, 0.4, 1] }}
          >
            <Cap color={ink} tassel={accent} className="w-full" />
          </motion.div>
        ))}

      {/* confetti burst */}
      {started &&
        Array.from({ length: 28 }, (_, i) => {
          const a = rand(i, 11) * Math.PI * 2;
          const d = 120 + rand(i, 12) * 220;
          return (
            <motion.span
              key={`c${i}`}
              className="absolute left-1/2 top-[45%] block"
              style={{ width: 6, height: 10, borderRadius: 2, background: i % 3 === 0 ? accent : i % 3 === 1 ? "#ffffff" : "#7fb3ff" }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
              animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 160, opacity: [0, 1, 1, 0], rotate: rand(i, 13) * 540 }}
              transition={{ duration: 1.8, delay: 0.45, ease: "easeOut" }}
            />
          );
        })}
    </div>
  );
}

/* ───────────── Candle: tap to light it, warm light fills the screen ───────────── */

export function CandleOpening({ inv, started }: Props) {
  const { bg, accent } = inv.theme;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg }}>
      {/* soft vignette */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 46%, color-mix(in oklab, ${accent} 10%, ${bg}), ${bg} 60%)` }} />

      {/* warm glow that grows once lit */}
      <motion.div
        className="absolute left-1/2 top-[36%] size-48 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, color-mix(in oklab, ${accent} 75%, white) 0%, ${accent} 25%, transparent 68%)` }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={started ? { opacity: [0, 0.55, 0.55, 0.9], scale: [0.2, 1, 1.1, 9] } : { opacity: 0, scale: 0.2 }}
        transition={{ duration: 2.8, times: [0, 0.25, 0.6, 1], ease: "easeInOut" }}
      />

      <div className="absolute left-1/2 top-[36%] flex -translate-x-1/2 flex-col items-center">
        {/* flame */}
        <div className="relative h-14 w-8">
          <motion.div
            className="absolute bottom-0 left-1/2 h-12 w-6 -translate-x-1/2 origin-bottom rounded-[50%_50%_45%_45%/65%_65%_35%_35%]"
            style={{ background: `radial-gradient(ellipse at 50% 75%, #fffbe8 0%, #ffd27a 35%, ${accent} 60%, transparent 75%)`, filter: "blur(0.4px)" }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={started ? { scaleY: [0, 1.2, 0.9, 1.05, 1], opacity: 1, rotate: [0, -3, 2, -1, 0] } : { scaleY: 0, opacity: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
          />
        </div>
        {/* wick */}
        <span className="h-2.5 w-[2px] rounded-full bg-[#2a2420]" />
        {/* candle */}
        <div
          className="h-40 w-14 rounded-t-md shadow-[inset_-8px_0_14px_rgb(0_0_0/0.18)]"
          style={{ background: "linear-gradient(90deg, #efe6d6, #fbf6ec 40%, #e2d6c1)" }}
        />
        {/* holder */}
        <span className="h-2 w-24 rounded-full" style={{ background: `color-mix(in oklab, ${accent} 70%, #3a2a18)` }} />
      </div>
    </div>
  );
}
