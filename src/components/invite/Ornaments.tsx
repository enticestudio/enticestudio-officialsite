"use client";

// Code-drawn ornaments, so every style looks finished before any artwork is added.
// All use currentColor — set `color` / a text-colour class on the parent.

import { motion } from "motion/react";

/** Radial mandala: rings, petals and dots. */
export function Mandala({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * (360 / 16));
  const inner = Array.from({ length: 8 }, (_, i) => i * 45 + 22.5);
  const dots = Array.from({ length: 32 }, (_, i) => i * (360 / 32));
  return (
    <svg viewBox="-100 -100 200 200" className={className} fill="none" stroke="currentColor" aria-hidden>
      <circle r="96" strokeWidth="0.6" />
      <circle r="90" strokeWidth="0.4" strokeDasharray="1 3" />
      {dots.map((a) => (
        <circle key={a} r="1.4" cx="0" cy="-84" transform={`rotate(${a})`} fill="currentColor" stroke="none" />
      ))}
      {petals.map((a) => (
        <path key={a} d="M0 -30 C 12 -48, 10 -66, 0 -78 C -10 -66, -12 -48, 0 -30 Z" transform={`rotate(${a})`} strokeWidth="0.8" />
      ))}
      {inner.map((a) => (
        <path key={a} d="M0 -14 C 8 -22, 8 -34, 0 -42 C -8 -34, -8 -22, 0 -14 Z" transform={`rotate(${a})`} strokeWidth="0.8" />
      ))}
      <circle r="26" strokeWidth="0.8" />
      <circle r="12" strokeWidth="0.8" />
      <circle r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Double-line arch framing the hero. Stretches to fill its box. */
export function ArchFrame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 520" preserveAspectRatio="none" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path d="M14 520 V170 Q14 14 150 14 Q286 14 286 170 V520" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <path d="M26 520 V174 Q26 28 150 28 Q274 28 274 174 V520" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** A leafy sprig for corners. */
export function Sprig({ className = "" }: { className?: string }) {
  const leaves = [
    [30, 150, -50],
    [48, 118, -35],
    [70, 90, -20],
    [96, 66, -5],
    [124, 46, 10],
    [154, 32, 25],
  ];
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path d="M10 190 C 40 120, 100 50, 190 20" strokeWidth="1.2" />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 0 C 10 -16, 30 -16, 38 -4 C 26 4, 10 6, 0 0 Z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.12" />
          <path d="M0 0 C -6 16, -2 34, 10 40 C 14 28, 10 12, 0 0 Z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.12" />
        </g>
      ))}
    </svg>
  );
}

/** Line · diamond · line divider. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 12" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path d="M0 6 H64" strokeWidth="0.8" />
      <path d="M96 6 H160" strokeWidth="0.8" />
      <path d="M80 0 L86 6 L80 12 L74 6 Z" fill="currentColor" stroke="none" />
      <circle cx="68" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="92" cy="6" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Art-deco frame: double border, stepped corner fans and sunbursts.
 * `center` adds the diamond used around the monogram in the opening.
 * `draw` animates the gold lines being drawn in.
 */
export function DecoFrame({ className = "", center = false, draw = false }: { className?: string; center?: boolean; draw?: boolean }) {
  const corners: [number, number, number, number][] = [
    [30, 30, 1, 1],
    [360, 30, -1, 1],
    [30, 814, 1, -1],
    [360, 814, -1, -1],
  ];
  const paths: string[] = [
    "M18 18 H372 V826 H18 Z",
    "M30 30 H360 V814 H30 Z",
  ];
  for (const [x, y, sx, sy] of corners) {
    for (const r of [18, 30, 42]) paths.push(`M${x + sx * r} ${y} A${r} ${r} 0 0 ${sx * sy > 0 ? 1 : 0} ${x} ${y + sy * r}`);
    for (const a of [20, 45, 70]) {
      const rad = (a * Math.PI) / 180;
      paths.push(`M${x} ${y} L${x + sx * 42 * Math.cos(rad)} ${y + sy * 42 * Math.sin(rad)}`);
    }
  }
  // sunbursts top and bottom
  for (const [cy, dir] of [[30, 1], [814, -1]] as const) {
    for (let a = 15; a <= 165; a += 15) {
      const rad = (a * Math.PI) / 180;
      const l = a % 30 === 0 ? 58 : 38;
      paths.push(`M195 ${cy} L${195 + l * Math.cos(rad)} ${cy + dir * l * Math.sin(rad)}`);
    }
  }
  if (center) {
    paths.push("M195 332 L285 422 L195 512 L105 422 Z", "M195 350 L267 422 L195 494 L123 422 Z");
    paths.push("M195 30 V318", "M195 526 V814");
  }
  return (
    <svg viewBox="0 0 390 844" preserveAspectRatio="none" className={className} fill="none" stroke="currentColor" aria-hidden>
      {paths.map((d, i) =>
        draw ? (
          <motion.path
            key={i}
            d={d}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.1 + (i % 12) * 0.05, ease: "easeInOut" }}
          />
        ) : (
          <path key={i} d={d} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ),
      )}
    </svg>
  );
}

/** Lotus flower. */
export function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <path d="M100 10 C 118 34, 118 70, 100 96 C 82 70, 82 34, 100 10 Z" fill="currentColor" fillOpacity="0.12" />
      <path d="M100 96 C 70 86, 56 56, 60 30 C 82 40, 96 64, 100 96 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M100 96 C 130 86, 144 56, 140 30 C 118 40, 104 64, 100 96 Z" fill="currentColor" fillOpacity="0.08" />
      <path d="M100 96 C 60 96, 30 78, 18 56 C 46 54, 80 70, 100 96 Z" />
      <path d="M100 96 C 140 96, 170 78, 182 56 C 154 54, 120 70, 100 96 Z" />
      <path d="M30 104 Q100 118 170 104" />
      <path d="M50 112 Q100 122 150 112" strokeOpacity="0.6" />
      <circle cx="100" cy="4" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Soft cartoon cloud. */
export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden>
      <path
        d="M40 90 C 14 90, 8 62, 30 54 C 26 30, 56 18, 72 34 C 82 10, 124 8, 132 36 C 152 26, 182 40, 174 62 C 196 66, 192 92, 168 90 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Pointing-hand "tap" icon. */
export function TapIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 10.5V9a1.5 1.5 0 0 1 3 0v2" />
      <path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.9-2.5L4 15.1a1.5 1.5 0 0 1 2.3-1.9L9 15.5" />
    </svg>
  );
}
