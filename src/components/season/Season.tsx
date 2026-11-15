"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { inSeason, season } from "@/lib/season";

const SeasonContext = createContext({ active: false });
/** Is the seasonal (Christmas) theme showing right now? */
export const useSeason = () => useContext(SeasonContext);

// Deterministic pseudo-random numbers (same on server and client → no hydration mismatch).
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const EVERGREEN = "#1f4a38";
const GOLD = "#f0dcae";

/**
 * Wraps the studio pages. When the season is on it adds the greeting bar and snowfall,
 * marks the page with data-season="christmas" (see globals.css for the small touches),
 * and moves the fixed header down by the bar's height via the --season-bar variable.
 */
export function SeasonShell({ children }: { children: ReactNode }) {
  // "on" is known straight away; "auto" depends on the visitor's date, so it is decided after load.
  const [active, setActive] = useState(season.mode === "on");
  const [barOpen, setBarOpen] = useState(true);
  const [barKey, setBarKey] = useState("");

  useEffect(() => {
    const now = new Date();
    const key = `entice-season-bar-${now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()}`;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time read of the date and the saved "closed" choice */
    setBarKey(key);
    if (season.mode === "auto") setActive(inSeason(now));
    try {
      if (localStorage.getItem(key) === "closed") setBarOpen(false);
    } catch {
      /* storage unavailable: keep the bar */
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const closeBar = () => {
    setBarOpen(false);
    try {
      localStorage.setItem(barKey, "closed");
    } catch {
      /* ignore */
    }
  };

  const showBar = active && barOpen;
  return (
    <SeasonContext.Provider value={{ active }}>
      <div
        data-season={active ? "christmas" : undefined}
        className="transition-[padding] duration-500"
        style={{ "--season-bar": showBar ? "2.5rem" : "0px", paddingTop: "var(--season-bar)" } as CSSProperties}
      >
        <AnimatePresence>{showBar && <GreetingBar onClose={closeBar} />}</AnimatePresence>
        {active && <Snow />}
        {children}
      </div>
    </SeasonContext.Provider>
  );
}

/** A small holly sprig: two leaves and three berries. */
function Holly({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 40 28" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path
        d="M19 15 C15 9 12 10 9 5 C8 9 4 8 2 10 C5 12 4 15 7 17 C6 19 9 21 8 24 C12 22 14 24 19 15 Z"
        fill="#3f8261"
        stroke="#2a5f45"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path
        d="M21 15 C25 9 28 10 31 5 C32 9 36 8 38 10 C35 12 36 15 33 17 C34 19 31 21 32 24 C28 22 26 24 21 15 Z"
        fill="#4c9370"
        stroke="#2a5f45"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M19 15 L7 12 M21 15 L33 12" stroke="#2a5f45" strokeWidth="0.6" fill="none" />
      <circle cx="20" cy="12.5" r="3.1" fill="#c0392b" />
      <circle cx="17.2" cy="17" r="2.8" fill="#a93226" />
      <circle cx="22.8" cy="17" r="2.8" fill="#cf4a3c" />
      <circle cx="19.2" cy="11.6" r="0.8" fill="#fff" opacity="0.7" />
    </svg>
  );
}

function GreetingBar({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      role="region"
      aria-label="Season's greetings"
      className="fixed inset-x-0 top-0 z-[55] flex h-10 items-center justify-center overflow-hidden px-10 text-sm"
      style={{ background: `linear-gradient(90deg, #183b2d, ${EVERGREEN} 30%, #25563f 50%, ${EVERGREEN} 70%, #183b2d)`, color: GOLD }}
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* faint gold sparkles in the bar */}
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute block animate-[twinkle_ease-in-out_infinite] rounded-full"
          style={{
            left: `${(rand(i, 1) * 100).toFixed(2)}%`,
            top: `${(15 + rand(i, 2) * 70).toFixed(2)}%`,
            width: 2,
            height: 2,
            background: GOLD,
            boxShadow: `0 0 6px ${GOLD}`,
            animationDuration: `${(2.4 + rand(i, 3) * 3).toFixed(2)}s`,
            animationDelay: `${(-rand(i, 4) * 5).toFixed(2)}s`,
          }}
        />
      ))}

      <p className="relative flex min-w-0 items-center gap-2.5">
        <Holly className="h-5 w-7 shrink-0" />
        <span className="truncate font-accent text-[1.05rem] italic leading-none sm:hidden">{season.short}</span>
        <span className="hidden truncate font-accent text-[1.1rem] italic leading-none sm:inline">{season.greeting}</span>
        <Holly className="h-5 w-7 shrink-0" flip />
        {season.link && (
          <Link
            href={season.link.href}
            className="ml-3 hidden shrink-0 border-b border-current/50 pb-px text-xs uppercase tracking-[0.18em] transition-colors hover:border-current hover:text-white lg:inline"
          >
            {season.link.label} →
          </Link>
        )}
      </p>

      <button
        onClick={onClose}
        aria-label="Close the greeting"
        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-base opacity-70 transition-opacity hover:opacity-100"
      >
        ×
      </button>
    </motion.div>
  );
}

/** Gentle snowfall over the page: pure CSS, never blocks clicks, hidden for reduced motion. */
function Snow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[35] overflow-hidden motion-reduce:hidden">
      {Array.from({ length: 30 }, (_, i) => {
        const size = Math.round((3 + rand(i, 4) * 5) * 10) / 10;
        const gold = i % 6 === 0;
        return (
          <span
            key={i}
            // every other flake is left out on phones, to keep small screens calm
            className={`absolute -top-4 animate-[snow-fall_linear_infinite] ${i % 2 ? "hidden sm:block" : "block"}`}
            style={{
              left: `${(rand(i, 1) * 100).toFixed(2)}%`,
              animationDuration: `${(11 + rand(i, 3) * 12).toFixed(2)}s`,
              animationDelay: `${(-rand(i, 2) * 22).toFixed(2)}s`,
            }}
          >
            <span
              className="block animate-[snow-sway_ease-in-out_infinite_alternate] rounded-full"
              style={{
                width: size,
                height: size,
                // a soft warm edge keeps white flakes visible on the cream background
                background: gold ? "#ecd29a" : "#ffffff",
                boxShadow: gold ? "0 0 6px rgb(236 210 154 / 0.8)" : "0 0 0 1px rgb(170 150 120 / 0.16), 0 1px 4px rgb(90 70 40 / 0.28)",
                opacity: Number((0.55 + rand(i, 5) * 0.4).toFixed(2)),
                filter: size > 6.5 ? "blur(0.6px)" : undefined,
                animationDuration: `${(3 + rand(i, 6) * 4).toFixed(2)}s`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}
