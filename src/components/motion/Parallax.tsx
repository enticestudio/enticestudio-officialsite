"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Moves its children vertically at a different rate from the page.
 * speed > 0 drifts up as you scroll (feels closer); speed < 0 lags behind (feels farther).
 */
export function Parallax({
  children,
  speed = 0.2,
  rotate = 0,
  className,
  style,
}: {
  children: ReactNode;
  speed?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const distance = speed * 400;
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);

  return (
    <motion.div ref={ref} className={className} style={reduced ? style : { ...style, y, rotate: r }}>
      {children}
    </motion.div>
  );
}
