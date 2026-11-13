"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children into view once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Splits text into words, flagging those inside "*an accent phrase*" (may span several words). */
function parseAccents(text: string) {
  const out: { word: string; accent: boolean }[] = [];
  let inAccent = false;
  for (const raw of text.split(" ")) {
    const opens = raw.startsWith("*");
    const closes = raw.endsWith("*") && (raw.length > 1 || !opens);
    out.push({ word: raw.replaceAll("*", ""), accent: inAccent || opens });
    if (opens) inAccent = true;
    if (closes) inAccent = false;
  }
  return out;
}

/**
 * Headline that rises word-by-word from behind a mask.
 * Wrap a word in *asterisks* to set it in the italic accent serif.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[Tag];
  const words = parseAccents(text);

  return (
    <MotionTag
      className={className}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text.replaceAll("*", "")}
    >
      {words.map(({ word, accent }, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${accent ? "font-accent italic" : ""}`}
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 0.9, ease }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
