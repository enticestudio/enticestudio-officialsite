"use client";

import { useEffect, useRef, useState } from "react";
import type { Design } from "@/lib/invitations";
import { InvitePreview } from "@/components/ui/InvitePreview";

// Rendered at a real phone size, then scaled down to fit the card.
const SCREEN_W = 390;
const SCREEN_H = 844;

/**
 * A phone showing the real, running demo invitation (an iframe of /i/<slug> in
 * preview mode: it opens by itself when scrolled into view, without music).
 *
 * The iframe ignores the pointer, so wheel/touch scrolling keeps moving the page
 * and a click goes to the surrounding link (the full demo viewer).
 * The lightweight CSS preview shows underneath until the demo has loaded.
 */
export function LivePhone({ inv, className = "" }: { inv: Design; className?: string }) {
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = screen.current!;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SCREEN_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const src = `/i/${inv.slug}?preview=1&guest=${encodeURIComponent(inv.sampleGuest)}`;

  return (
    <div
      className={`relative overflow-hidden rounded-[2.4rem] border-[7px] bg-ink shadow-[0_40px_80px_-30px_rgb(14_14_14/0.5)] ${className}`}
    >
      <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div
        ref={screen}
        className="relative w-full overflow-hidden rounded-[1.9rem]"
        style={{ aspectRatio: `${SCREEN_W} / ${SCREEN_H}` }}
      >
        <div className={`absolute inset-0 transition-opacity duration-700 ${loaded ? "opacity-0" : "opacity-100"}`}>
          <InvitePreview demo={inv} />
        </div>
        {scale > 0 && (
          <iframe
            src={src}
            title={`${inv.title} live demo`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden
            onLoad={() => setLoaded(true)}
            className={`pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: SCREEN_W, height: SCREEN_H, transform: `scale(${scale})` }}
          />
        )}
      </div>
    </div>
  );
}
