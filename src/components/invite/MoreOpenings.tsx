"use client";

import { motion } from "motion/react";
import type { Design } from "@/lib/invitations";
import { Cloud, DecoFrame, Lotus } from "./Ornaments";

// Additional code-drawn openings. Each gets `started` (the guest has tapped)
// and runs its own timeline; the Gate fades it away when the time is up.

type Props = { inv: Design; started: boolean };
const ease = [0.65, 0, 0.35, 1] as const;

// Deterministic pseudo-random (identical on server and client)
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Date line for invitations; moment pages show their occasion instead. */
const dateOf = (inv: Design) => (inv.kind === "moment" ? inv.occasion : inv.dateLabel);

const initialsOf = (inv: Design) =>
  inv.names.length > 1 ? inv.names.map((n) => n[0]).join(" · ") : inv.names[0].slice(0, 1);

/* ───────────── Art deco: gold lines draw, monogram glows, panels part ───────────── */

export function DecoOpening({ inv, started }: Props) {
  const { bg, accent } = inv.theme;
  const half = (side: "left" | "right") => (
    <motion.div
      key={side}
      className={`absolute inset-y-0 w-1/2 overflow-hidden ${side === "left" ? "left-0" : "right-0"}`}
      style={{ background: bg }}
      animate={{ x: started ? (side === "left" ? "-102%" : "102%") : 0 }}
      transition={{ duration: 1.3, delay: 0.9, ease }}
    >
      <div className={`absolute inset-y-0 w-[200%] ${side === "left" ? "left-0" : "right-0"}`} style={{ color: accent }}>
        <DecoFrame center draw className="h-full w-full" />
      </div>
    </motion.div>
  );
  return (
    <div className="absolute inset-0" style={{ background: bg }}>
      {half("left")}
      {half("right")}
      {/* monogram inside the diamond */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center font-display text-3xl tracking-[0.2em]"
        style={{ color: accent }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={started ? { opacity: 0, scale: 1.6, filter: "blur(6px)" } : { opacity: 1, scale: 1 }}
        transition={started ? { duration: 0.9, ease } : { delay: 1.4, duration: 1 }}
      >
        {initialsOf(inv)}
      </motion.div>
      {/* gold flash along the seam */}
      <motion.div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
        style={{ background: accent, boxShadow: `0 0 24px 6px ${accent}` }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={started ? { scaleY: [0, 1, 1], opacity: [0, 1, 0] } : {}}
        transition={{ duration: 1.4, times: [0, 0.45, 1] }}
      />
    </div>
  );
}

/* ───────────── Scroll: parchment unrolls between two gold rods ───────────── */

export function ScrollOpening({ inv, started }: Props) {
  const { bg, fg, accent } = inv.theme;
  const rod = (
    <div className="relative z-10 h-5 w-[calc(100%+28px)] rounded-full shadow-md" style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${accent} 70%, white), ${accent} 45%, color-mix(in oklab, ${accent} 60%, black))` }}>
      {["-left-2", "-right-2"].map((s) => (
        <span key={s} className={`absolute top-1/2 size-6 -translate-y-1/2 rounded-full ${s}`} style={{ background: `radial-gradient(circle at 35% 35%, color-mix(in oklab, ${accent} 60%, white), ${accent})` }} />
      ))}
    </div>
  );
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `radial-gradient(circle at 50% 40%, color-mix(in oklab, ${fg} 75%, ${accent}), color-mix(in oklab, ${fg} 85%, black))` }}
    >
      <motion.div
        className="flex w-[min(76vw,300px)] flex-col items-center"
        animate={started ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: started ? 0 : Infinity, ease: "easeInOut" }}
      >
        {rod}
        <motion.div
          className="relative w-full overflow-hidden"
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, ${bg} 85%, #b08a55), ${bg} 12%, ${bg} 88%, color-mix(in oklab, ${bg} 85%, #b08a55))`,
          }}
          initial={{ height: 26 }}
          animate={{ height: started ? "62vh" : 26 }}
          transition={{ duration: 1.5, delay: 0.25, ease }}
        >
          <motion.div
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 px-6 text-center"
            style={{ color: fg }}
            initial={{ opacity: 0 }}
            animate={{ opacity: started ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Lotus className="w-24" />
            <p className="font-script text-4xl leading-tight" style={{ color: fg }}>
              {inv.names.join(" & ")}
            </p>
            <p className="eyebrow text-[0.55rem]" style={{ color: accent }}>
              {dateOf(inv)}
            </p>
          </motion.div>
        </motion.div>
        {rod}
      </motion.div>
      {/* ribbon tie around the closed scroll */}
      <motion.span
        className="absolute left-1/2 top-1/2 h-16 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm"
        style={{ background: "#9e1b32" }}
        animate={started ? { y: 260, opacity: 0, rotate: 30 } : {}}
        transition={{ duration: 0.6, ease: "easeIn" }}
      />
    </div>
  );
}

/* ───────────── Gift box: bow pops, lid flies off, confetti bursts ───────────── */

export function GiftBoxOpening({ inv, started }: Props) {
  const { bg, surface, accent, fg } = inv.theme;
  const ribbon = "#ffd166";
  const palette = [accent, ribbon, "#06d6a0", "#4d96ff", "#b388ff"];
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(circle at 50% 45%, ${surface}, ${bg} 70%)` }}>
      <motion.div
        className="relative h-[150px] w-[170px]"
        animate={started ? {} : { rotate: [0, -4, 4, -3, 0] }}
        transition={started ? {} : { duration: 0.7, repeat: Infinity, repeatDelay: 1.6 }}
      >
        {/* confetti burst */}
        {started &&
          Array.from({ length: 46 }, (_, i) => {
            const ang = rand(i, 1) * Math.PI * 2;
            const dist = 140 + rand(i, 2) * 260;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-8 block"
                style={{ width: 7, height: 12, borderRadius: i % 3 ? 2 : 999, background: palette[i % palette.length] }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{ x: Math.cos(ang) * dist, y: Math.sin(ang) * dist - 120, opacity: 0, rotate: rand(i, 3) * 720 }}
                transition={{ duration: 1.5, delay: 0.35, ease: [0.1, 0.8, 0.3, 1] }}
              />
            );
          })}
        {/* box */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[110px] rounded-md shadow-xl"
          style={{ background: accent }}
          animate={started ? { y: 60, opacity: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2" style={{ background: ribbon }} />
        </motion.div>
        {/* lid + bow */}
        <motion.div
          className="absolute -inset-x-3 top-[18px] h-[34px] rounded-md shadow-lg"
          style={{ background: `color-mix(in oklab, ${accent} 85%, white)` }}
          animate={started ? { y: -320, rotate: -28, opacity: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.3, 0, 0.2, 1] }}
        >
          <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2" style={{ background: ribbon }} />
          <motion.div
            className="absolute -top-7 left-1/2 flex -translate-x-1/2"
            animate={started ? { scale: 0 } : {}}
            transition={{ duration: 0.2 }}
          >
            <span className="h-8 w-10 -rotate-[25deg] rounded-full border-[6px]" style={{ borderColor: ribbon }} />
            <span className="h-8 w-10 rotate-[25deg] rounded-full border-[6px]" style={{ borderColor: ribbon }} />
          </motion.div>
        </motion.div>
      </motion.div>
      <p className="sr-only" style={{ color: fg }}>
        Gift box
      </p>
    </div>
  );
}

/* ───────────── Balloons float away ───────────── */

export function BalloonsOpening({ inv, started }: Props) {
  const { bg, surface, accent } = inv.theme;
  const palette = [accent, "#f7c6d9", "#fde2a7", "#c9e4de", "#d7c9f2", "#ffffff"];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: `linear-gradient(180deg, ${surface}, ${bg})` }}>
      <div className="text-white">
        <Cloud className="absolute -left-8 top-[8%] w-44 opacity-90" />
        <Cloud className="absolute -right-10 top-[30%] w-40 opacity-80" />
        <Cloud className="absolute left-[20%] bottom-[10%] w-52 opacity-90" />
      </div>
      {Array.from({ length: 16 }, (_, i) => {
        const size = 62 + rand(i, 1) * 40;
        const left = (i % 4) * 25 + rand(i, 2) * 14 - 4;
        const top = Math.floor(i / 4) * 17 + rand(i, 3) * 8 + 4;
        return (
          <motion.div
            key={i}
            className="absolute flex flex-col items-center"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={started ? { y: "-130vh", x: (rand(i, 4) - 0.5) * 80 } : { y: [0, -8, 0] }}
            transition={
              started
                ? { duration: 1.7 + rand(i, 5) * 0.8, delay: rand(i, 6) * 0.45, ease: [0.5, 0, 0.9, 0.6] }
                : { duration: 3 + rand(i, 7) * 2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <span
              className="block rounded-[50%_50%_48%_48%]"
              style={{
                width: size,
                height: size * 1.18,
                background: `radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.85), ${palette[i % palette.length]} 38%, color-mix(in oklab, ${palette[i % palette.length]} 80%, black))`,
              }}
            />
            <span className="block h-14 w-px bg-black/20" />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ───────────── Ticket: "admit one" tears along the perforation ───────────── */

export function TicketOpening({ inv, started }: Props) {
  const { bg, surface, accent, fg } = inv.theme;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: bg,
        backgroundImage: `linear-gradient(color-mix(in oklab, ${accent} 10%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, ${accent} 10%, transparent) 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
      }}
    >
      <motion.div
        className="relative flex h-[180px] w-[min(86vw,340px)]"
        style={{ filter: `drop-shadow(0 0 18px color-mix(in oklab, ${accent} 45%, transparent))` }}
        animate={started ? { scale: [1, 1.04, 7], opacity: [1, 1, 0] } : { y: [0, -5, 0], rotate: -4 }}
        transition={started ? { duration: 1.1, delay: 1, times: [0, 0.2, 1], ease: "easeIn" } : { duration: 3, repeat: Infinity }}
      >
        {/* main part */}
        <div className="relative flex flex-1 flex-col justify-between rounded-l-xl p-5" style={{ background: surface, color: fg, border: `1px solid ${accent}` }}>
          <p className="eyebrow text-[0.55rem]" style={{ color: accent }}>
            Admit one
          </p>
          <p className="font-sans text-2xl font-semibold uppercase tracking-[0.15em]">{inv.names[0]}</p>
          <p className="text-[0.65rem] tracking-[0.2em] opacity-75">{dateOf(inv).toUpperCase()}</p>
        </div>
        {/* perforation */}
        <div className="relative w-0 border-l-2 border-dashed" style={{ borderColor: accent }}>
          {["-top-3", "-bottom-3"].map((p) => (
            <span key={p} className={`absolute -left-3 size-6 rounded-full ${p}`} style={{ background: bg }} />
          ))}
        </div>
        {/* stub */}
        <motion.div
          className="flex w-[26%] origin-top-left flex-col items-center justify-between rounded-r-xl py-5"
          style={{ background: surface, color: accent, border: `1px solid ${accent}` }}
          animate={started ? { rotate: 24, x: 30, y: 320, opacity: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.5, 0, 0.75, 0] }}
        >
          <span className="text-[0.55rem] tracking-[0.2em] [writing-mode:vertical-rl]">Nº 0127</span>
          <span className="h-14 w-8" style={{ background: `repeating-linear-gradient(90deg, ${accent} 0 2px, transparent 2px 4px, ${accent} 4px 5px, transparent 5px 8px)` }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ───────────── Iris: the screen opens from the centre ───────────── */

export function IrisOpening({ inv, started }: Props) {
  const { bg, accent, fg } = inv.theme;
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0"
        style={
          {
            background: bg,
            backgroundImage: `linear-gradient(color-mix(in oklab, ${accent} 12%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, ${accent} 12%, transparent) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
            "--hole": "0%",
            maskImage: "radial-gradient(circle at 50% 50%, transparent var(--hole), black calc(var(--hole) + 1px))",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, transparent var(--hole), black calc(var(--hole) + 1px))",
          } as React.CSSProperties
        }
        animate={{ "--hole": started ? "160%" : "0%" } as never}
        transition={{ duration: 1.3, delay: 0.75, ease: [0.7, 0, 0.3, 1] }}
      />
      {/* HUD rings */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={started ? { scale: 2.6, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: started ? 0.6 : 0, ease }}
      >
        <div className="relative size-60">
          <span className="absolute inset-0 animate-[slow-spin_12s_linear_infinite] rounded-full border border-dashed" style={{ borderColor: accent }} />
          <span className="absolute inset-6 animate-[slow-spin_8s_linear_infinite_reverse] rounded-full border-2 border-transparent" style={{ borderTopColor: accent, borderBottomColor: accent }} />
          <span className="absolute inset-14 rounded-full border" style={{ borderColor: `color-mix(in oklab, ${accent} 50%, transparent)` }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ color: fg }}>
            <span className="eyebrow text-[0.5rem]" style={{ color: accent }}>
              {inv.occasion}
            </span>
            <span className="mt-2 font-sans text-sm font-semibold uppercase tracking-[0.2em]">{inv.names[0]}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
