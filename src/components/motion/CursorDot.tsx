"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * The dot of the "i" in the Entice wordmark, following the cursor.
 * Grows over links/buttons. Hidden on touch devices and for reduced motion.
 */
export function CursorDot() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability check
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest("a, button, [data-cursor='grow']"));
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      // white + difference blend = black dot on light sections, white dot on dark ones
      className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full bg-white mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: hover ? 44 : 12, height: hover ? 44 : 12 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
    />
  );
}
