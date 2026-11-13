"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Invitation, OpeningType } from "@/lib/invitations";
import { TapIcon } from "./Ornaments";

const ease = [0.65, 0, 0.35, 1] as const;

/** How long each opening runs before the gate fades away (seconds). */
const DURATION: Record<OpeningType, number> = { envelope: 2.6, curtain: 2.3, doors: 2.4 };

type OpeningProps = { inv: Invitation; started: boolean };

/* ───────────────────────────── Envelope ───────────────────────────── */

function EnvelopeOpening({ inv, started }: OpeningProps) {
  const { theme } = inv;
  const [flapBehind, setFlapBehind] = useState(false);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setFlapBehind(true), 380); // flap passes vertical
    return () => clearTimeout(t);
  }, [started]);

  const initials = inv.names.map((n) => n[0]).join("");

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `radial-gradient(circle at 50% 40%, ${theme.surface}, ${theme.bg} 70%)` }}
    >
      <motion.div
        className="relative w-[min(78vw,330px)] [perspective:1100px]"
        style={{ aspectRatio: "1.42" }}
        animate={started ? { y: 70, scale: 1.04 } : { y: [0, -6, 0] }}
        transition={started ? { duration: 1.2, delay: 1.1, ease } : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* back */}
        <div className="absolute inset-0 rounded-md shadow-[0_30px_60px_-25px_rgb(0_0_0/0.45)]" style={{ background: `color-mix(in oklab, ${theme.surface} 80%, black)` }} />
        {/* card */}
        <motion.div
          className="absolute inset-x-[6%] top-[5%] bottom-[5%] z-[1] flex flex-col items-center justify-center rounded-sm text-center shadow-sm"
          style={{ background: "#fffdf8", color: theme.fg }}
          animate={started ? { y: "-68%" } : { y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease }}
        >
          <span className="eyebrow text-[0.5rem]" style={{ color: theme.accent }}>
            {inv.occasion}
          </span>
          <span className="mt-1 font-script text-3xl leading-tight">{inv.names.join(" & ")}</span>
        </motion.div>
        {/* front pocket */}
        <div
          className="absolute inset-0 z-[2] rounded-md"
          style={{
            background: `linear-gradient(160deg, ${theme.surface}, color-mix(in oklab, ${theme.surface} 88%, black))`,
            clipPath: "polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
        {/* flap */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] origin-top"
          style={{
            zIndex: flapBehind ? 0 : 3,
            background: `linear-gradient(180deg, color-mix(in oklab, ${theme.surface} 92%, black), ${theme.surface})`,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backfaceVisibility: "visible",
          }}
          animate={{ rotateX: started ? 180 : 0 }}
          transition={{ duration: 0.8, ease }}
        />
        {/* wax seal */}
        <motion.div
          className="absolute left-1/2 top-[58%] z-[4] flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-display text-lg shadow-lg"
          style={{ background: theme.accent, color: theme.onAccent }}
          animate={started ? { scale: 0, rotate: 90, opacity: 0 } : { scale: [1, 1.06, 1] }}
          transition={started ? { duration: 0.35 } : { duration: 2, repeat: Infinity }}
        >
          {initials}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ───────────────────────────── Curtain ───────────────────────────── */

const fabric = (c: string) =>
  [
    // vertical folds
    `repeating-linear-gradient(90deg, rgb(0 0 0 / 0.38) 0px, rgb(255 255 255 / 0.07) 14px, rgb(0 0 0 / 0.18) 26px, rgb(0 0 0 / 0.38) 38px)`,
    // light from above
    `linear-gradient(180deg, rgb(255 255 255 / 0.12), transparent 30%, rgb(0 0 0 / 0.35))`,
    `linear-gradient(${c}, ${c})`,
  ].join(", ");

// Same number of points in both shapes so Motion can morph between them.
const CLOSED_L = "polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 0% 100%)";
const OPEN_L = "polygon(0% 0%, 34% 0%, 9% 52%, 26% 100%, 0% 100%)";
const CLOSED_R = "polygon(100% 0%, 0% 0%, 0% 50%, 0% 100%, 100% 100%)";
const OPEN_R = "polygon(100% 0%, 66% 0%, 91% 52%, 74% 100%, 100% 100%)";

function CurtainOpening({ inv, started }: OpeningProps) {
  const c = inv.theme.curtain ?? inv.theme.accent;
  const gold = inv.theme.accent;
  return (
    <div className="absolute inset-0">
      {[
        { closed: CLOSED_L, open: OPEN_L, side: "left-0" },
        { closed: CLOSED_R, open: OPEN_R, side: "right-0" },
      ].map((p) => (
        <motion.div
          key={p.side}
          className={`absolute top-0 ${p.side} h-full w-1/2`}
          style={{ background: fabric(c) }}
          initial={{ clipPath: p.closed }}
          animate={{ clipPath: started ? p.open : p.closed }}
          transition={{ duration: 1.9, ease }}
        />
      ))}
      {/* tie-backs appear as the drapes gather */}
      {started &&
        ["left-[6%]", "right-[6%]"].map((side) => (
          <motion.span
            key={side}
            className={`absolute top-[51%] ${side} h-2 w-[12%] rounded-full shadow`}
            style={{ background: gold }}
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          />
        ))}
      {/* valance */}
      <motion.div
        className="absolute inset-x-0 top-0 h-16"
        style={{
          background: fabric(c),
          maskImage: "radial-gradient(circle at 50% 0, black 70%, transparent 71%)",
          maskSize: "64px 100%",
          WebkitMaskImage: "radial-gradient(circle at 50% 0, black 70%, transparent 71%)",
          WebkitMaskSize: "64px 100%",
        }}
        animate={{ y: started ? -80 : 0 }}
        transition={{ duration: 1, delay: 1.2, ease }}
      />
    </div>
  );
}

/* ───────────────────────────── Temple doors ───────────────────────────── */

function DoorPanel({ side, color, gold }: { side: "left" | "right"; color: string; gold: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `linear-gradient(${side === "left" ? 90 : 270}deg, color-mix(in oklab, ${color} 70%, black), ${color} 40%, color-mix(in oklab, ${color} 85%, white))`,
      }}
    >
      {/* carved panels */}
      {[8, 38, 68].map((top) => (
        <div
          key={top}
          className="absolute inset-x-[14%] rounded-t-full border"
          style={{ top: `${top}%`, height: "24%", borderColor: `color-mix(in oklab, ${gold} 70%, transparent)` }}
        >
          <div className="absolute inset-[10%] rounded-t-full border" style={{ borderColor: `color-mix(in oklab, ${gold} 40%, transparent)` }} />
        </div>
      ))}
      {/* studs */}
      {Array.from({ length: 6 }, (_, i) => (
        <span
          key={i}
          className="absolute size-2 rounded-full"
          style={{ background: gold, top: `${6 + i * 17}%`, [side === "left" ? "right" : "left"]: "6%" }}
        />
      ))}
      {/* ring handle */}
      <span
        className="absolute top-1/2 size-8 -translate-y-1/2 rounded-full border-[3px]"
        style={{ borderColor: gold, [side === "left" ? "right" : "left"]: "10%" }}
      />
    </div>
  );
}

function DoorsOpening({ inv, started }: OpeningProps) {
  const color = inv.theme.door ?? inv.theme.surface;
  const gold = inv.theme.accent;
  return (
    <div className="absolute inset-0 [perspective:1400px]">
      {/* light spilling through */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 50%, color-mix(in oklab, ${gold} 80%, white), transparent 65%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? [0, 1, 0] : 0 }}
        transition={{ duration: 2.2, times: [0, 0.35, 1] }}
      />
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          className={`absolute top-0 h-full w-1/2 ${side === "left" ? "left-0 origin-left" : "right-0 origin-right"}`}
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: started ? (side === "left" ? -108 : 108) : 0 }}
          transition={{ duration: 1.9, delay: 0.15, ease }}
        >
          <DoorPanel side={side} color={color} gold={gold} />
        </motion.div>
      ))}
      {/* arch over the doorway */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-[16%]"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${color} 60%, black), transparent)`,
        }}
        animate={{ opacity: started ? 0 : 1 }}
        transition={{ delay: 1 }}
      />
    </div>
  );
}

/* ───────────────────────────── Video ───────────────────────────── */

function VideoOpening({
  src,
  poster,
  started,
  onEnd,
  onFail,
}: {
  src: string;
  poster?: string;
  started: boolean;
  onEnd: () => void;
  onFail: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!started) return;
    // Called right after the tap, so mobile browsers allow playback.
    ref.current?.play().catch(onFail);
    const safety = setTimeout(onEnd, 12000); // never trap the guest behind a stalled video
    return () => clearTimeout(safety);
  }, [started, onEnd, onFail]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      onEnded={onEnd}
      onError={onFail}
    />
  );
}

/* ───────────────────────────── Gate ───────────────────────────── */

/**
 * Full-screen "tap to open" cover. Plays the opening (video, or the code-drawn
 * fallback), then calls onDone so the invitation can take over.
 */
export function Gate({
  inv,
  guest,
  onStart,
  onDone,
}: {
  inv: Invitation;
  guest: string | null;
  onStart: () => void;
  onDone: () => void;
}) {
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"video" | OpeningType>(inv.opening.video ? "video" : inv.opening.type);
  const fallbackType = inv.opening.type;
  // stable so the video effect doesn't restart on every render
  const switchToFallback = useCallback(() => setMode(fallbackType), [fallbackType]);

  // Code openings finish on a timer; the video finishes on its `ended` event.
  useEffect(() => {
    if (!started || mode === "video") return;
    const t = setTimeout(onDone, reduced ? 200 : DURATION[mode] * 1000);
    return () => clearTimeout(t);
  }, [started, mode, reduced, onDone]);

  const begin = () => {
    if (started) return;
    setStarted(true);
    onStart();
  };

  // Text colour over the closed cover
  const light = mode === "curtain" || mode === "doors" || mode === "video";
  const textColor = light ? "#fff8ee" : inv.theme.fg;

  return (
    <motion.div
      className="fixed inset-0 z-50 cursor-pointer select-none overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      onClick={begin}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && begin()}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {mode === "video" && inv.opening.video && (
        <VideoOpening src={inv.opening.video} poster={inv.opening.poster} started={started} onEnd={onDone} onFail={switchToFallback} />
      )}
      {mode === "envelope" && <EnvelopeOpening inv={inv} started={started} />}
      {mode === "curtain" && <CurtainOpening inv={inv} started={started} />}
      {mode === "doors" && <DoorsOpening inv={inv} started={started} />}

      <AnimatePresence>
        {!started && (
          <motion.div
            className={`pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center gap-3 px-6 text-center ${
              mode === "envelope" || mode === "doors" ? "bottom-[13%]" : "top-1/2 -translate-y-1/2"
            }`}
            style={{ color: textColor, textShadow: light ? "0 2px 12px rgb(0 0 0 / 0.45)" : undefined }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="relative flex size-14 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full border opacity-40" style={{ borderColor: textColor }} />
              <TapIcon className="size-8" />
            </span>
            <p className="font-accent text-xl italic md:text-2xl">Dear {guest ?? "Guest"},</p>
            <p className="eyebrow text-[0.6rem]">Tap to open</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
