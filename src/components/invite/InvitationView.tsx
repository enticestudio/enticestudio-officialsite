"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Invitation } from "@/lib/invitations";
import { Gate } from "./Openings";
import { Particles } from "./Particles";
import { useMusic } from "./useMusic";
import { Closing, Countdown, Events, Gallery, Hero, Rsvp, SaveTheDate, Story, Venue } from "./Sections";

/**
 * A complete, working invitation rendered from data.
 * Flow: tap-to-open gate (+ music) → opening animation → scrollable invitation.
 * Personal greeting comes from the link: /i/<slug>?guest=Mr%20%26%20Mrs%20Silva
 */
export function InvitationView({ inv }: { inv: Invitation }) {
  const [guest, setGuest] = useState<string | null>(null);
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");
  const music = useMusic(inv.music);

  useEffect(() => {
    // Read on the client so every invitation page can stay fully static.
    const g = new URLSearchParams(window.location.search).get("guest");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL
    if (g) setGuest(g.slice(0, 60));
  }, []);

  // No scrolling until the invitation has been opened.
  useEffect(() => {
    const el = document.documentElement;
    el.style.overflow = stage === "open" ? "" : "hidden";
    if (stage !== "open") window.scrollTo(0, 0);
    return () => {
      el.style.overflow = "";
    };
  }, [stage]);

  const onStart = useCallback(() => {
    music.start();
    setStage("opening");
  }, [music]);
  const onDone = useCallback(() => setStage("open"), []);

  const vars = {
    "--inv-bg": inv.theme.bg,
    "--inv-surface": inv.theme.surface,
    "--inv-fg": inv.theme.fg,
    "--inv-accent": inv.theme.accent,
    "--inv-on-accent": inv.theme.onAccent,
    background: inv.theme.bg,
    color: inv.theme.fg,
  } as CSSProperties;

  return (
    <div style={vars} className="min-h-dvh">
      {/* keep overscroll / outside-the-column areas on theme */}
      <style>{`html,body{background:${inv.theme.bg}}`}</style>
      {music.audio}

      <div className="relative mx-auto max-w-[480px] overflow-x-clip">
        <Hero inv={inv} revealed={stage !== "closed"} />
        <Countdown inv={inv} />
        <Story inv={inv} />
        <Events inv={inv} />
        <Gallery inv={inv} />
        <Venue inv={inv} />
        <SaveTheDate inv={inv} />
        <Rsvp inv={inv} guest={guest} />
        <Closing inv={inv} />
      </div>

      {stage !== "closed" && <Particles kind={inv.particles} color={inv.theme.accent} />}

      {music.available && stage !== "closed" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          onClick={music.toggle}
          aria-label={music.playing ? "Pause music" : "Play music"}
          className="fixed right-4 top-4 z-40 flex size-11 items-center justify-center rounded-full shadow-lg"
          style={{ background: "var(--inv-accent)", color: "var(--inv-on-accent)" }}
        >
          <MusicIcon playing={music.playing} />
        </motion.button>
      )}

      <AnimatePresence>{stage !== "open" && <Gate inv={inv} guest={guest} onStart={onStart} onDone={onDone} />}</AnimatePresence>
    </div>
  );
}

function MusicIcon({ playing }: { playing: boolean }) {
  return playing ? (
    // animated equaliser bars
    <span className="flex h-4 items-end gap-[3px]" aria-hidden>
      {[0, 0.2, 0.4].map((d) => (
        <span key={d} className="w-[3px] rounded-full bg-current" style={{ height: "100%", transformOrigin: "bottom", animation: `eq 0.9s ${d}s ease-in-out infinite` }} />
      ))}
      <style>{`@keyframes eq{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}`}</style>
    </span>
  ) : (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
