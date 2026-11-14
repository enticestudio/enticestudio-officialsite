import * as THREE from "three";
import { ENVELOPE, rng } from "./stationery-paint";

// The envelope's paper and letter are pre-painted images (see stationery-paint.ts and
// scripts/bake-envelope.mjs), loaded like any picture: no painting on the visitor's device.

/** Baked images, in the order back, front pocket, flap, letter. */
export const BAKED = ["/hero/envelope/back.webp", "/hero/envelope/pocket.webp", "/hero/envelope/flap.webp", "/hero/envelope/card.webp"];

/**
 * Sets up the loaded images. The front and flap are flat shapes whose texture
 * coordinates are raw world units, so those two are scaled and shifted to fit.
 */
export function prepareBaked([back, pocket, flap, card]: THREE.Texture[]) {
  const { W, H, FLAP_H } = ENVELOPE;
  for (const t of [back, pocket, flap, card]) {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  }
  pocket.repeat.set(1 / W, 1 / H);
  pocket.offset.set(0.5, 0.5);
  flap.repeat.set(1 / W, 1 / FLAP_H);
  flap.offset.set(0.5, 1);
}

/** A wavy disc, so the wax seal looks poured rather than machined. */
export function waxShape(radius: number, seed = 7) {
  const r = rng(seed);
  // a few big soft lobes (like the reference seal) plus small irregularities
  const lobes = 9;
  const jitter = Array.from({ length: 6 }, () => ({ f: 3 + Math.floor(r() * 9), a: r() * 0.02, p: r() * Math.PI * 2 }));
  const s = new THREE.Shape();
  const N = 144;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const k = 1 + Math.sin(t * lobes) * 0.045 + jitter.reduce((acc, b) => acc + Math.sin(t * b.f + b.p) * b.a, 0);
    const x = Math.cos(t) * radius * k, y = Math.sin(t) * radius * k;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return s;
}
