"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Background music for an invitation.
 * Phones only allow sound after the visitor interacts, so `start()` must be called
 * directly inside the "tap to open" handler. Fades in, loops, and pauses while the
 * tab is hidden. If the file is missing, `available` turns false and the toggle hides.
 */
export function useMusic(src?: string) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const wanted = useRef(false); // what the guest chose, independent of tab visibility

  const fadeTo = useCallback((target: number, ms = 1600) => {
    const a = ref.current;
    if (!a) return;
    const from = a.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = from + (target - from) * k;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const play = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    a.volume = 0;
    a.play()
      .then(() => {
        setPlaying(true);
        fadeTo(0.7);
      })
      .catch(() => setPlaying(false));
  }, [fadeTo]);

  const start = useCallback(() => {
    wanted.current = true;
    play();
  }, [play]);

  const toggle = useCallback(() => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      wanted.current = true;
      play();
    } else {
      wanted.current = false;
      a.pause();
      setPlaying(false);
    }
  }, [play]);

  useEffect(() => {
    const onVis = () => {
      const a = ref.current;
      if (!a) return;
      if (document.hidden) a.pause();
      else if (wanted.current) a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const audio =
    src && !failed ? <audio ref={ref} src={src} loop preload="auto" onError={() => setFailed(true)} /> : null;

  return { audio, playing, available: !!src && !failed, start, toggle };
}
