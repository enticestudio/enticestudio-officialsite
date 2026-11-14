import * as THREE from "three";

// Paper for the hero envelope, painted on canvases at runtime: a soft cream
// stock with fine fibres, like handmade cotton paper. Brand marks (the wordmark
// on the flap, the "E" on the seal) are separate meshes in Envelope.tsx.

/** Small seeded random, so the paper looks the same on every visit. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function fontFamily(variable: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

/** Cream cotton paper: gentle mottling, curly fibres, fine speckles, soft edges. */
function paper(ctx: CanvasRenderingContext2D, w: number, h: number, base: string | null, seed: number, edge = 0.12) {
  const r = rng(seed);
  if (base) {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);
  }

  // very soft mottling, so it isn't a flat colour
  for (let i = 0; i < 10; i++) {
    const x = r() * w, y = r() * h, rad = (0.15 + r() * 0.3) * Math.max(w, h);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const light = r() > 0.5;
    g.addColorStop(0, light ? "rgba(255, 252, 244, 0.12)" : "rgba(150, 120, 80, 0.018)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  // fine curly fibres, some warm brown, some pale
  for (let i = 0; i < 420; i++) {
    const x = r() * w, y = r() * h, len = 6 + r() * 22, a0 = r() * Math.PI * 2, bend = (r() - 0.5) * 1.6;
    ctx.strokeStyle = r() > 0.25 ? `rgba(130, 85, 45, ${0.1 + r() * 0.16})` : `rgba(255, 250, 238, ${0.18 + r() * 0.2})`;
    ctx.lineWidth = 0.6 + r() * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a0 + bend) * len * 0.6, y + Math.sin(a0 + bend) * len * 0.6, x + Math.cos(a0) * len, y + Math.sin(a0) * len);
    ctx.stroke();
  }
  // speckles
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = `rgba(110, 80, 50, ${r() * 0.09})`;
    ctx.fillRect(r() * w, r() * h, 1 + r() * 1.2, 1 + r() * 1.2);
  }
  // soft edge shading
  const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  v.addColorStop(0, "rgba(120, 90, 55, 0)");
  v.addColorStop(1, `rgba(120, 90, 55, ${edge})`);
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

/** Smooth 2D value noise (seeded), sampled at any point. */
function valueNoise(seed: number) {
  const hash = (x: number, y: number) => {
    let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  return (x: number, y: number) => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const fx = x - x0, fy = y - y0;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = hash(x0, y0), b = hash(x0 + 1, y0), c = hash(x0, y0 + 1), d = hash(x0 + 1, y0 + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
}

/** Layered noise ("fractal"): big shapes plus finer and finer detail. 0..1 */
function fbm(n: (x: number, y: number) => number, x: number, y: number, octaves: number) {
  let sum = 0, amp = 1, norm = 0, f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += n(x * f, y * f) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  return sum / norm;
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/**
 * Aged parchment, computed pixel by pixel: a finely torn outline (with small nicks),
 * pale cream-gold paper that warms to orange-tan toward the edges, faint crumple
 * folds and a slightly deeper tan right along the torn edge. Outside the outline the
 * canvas is transparent.
 */
function burntLetter(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  const r = rng(seed);
  const n1 = valueNoise(seed), n2 = valueNoise(seed + 1), n3 = valueNoise(seed + 2), n4 = valueNoise(seed + 3);
  const m = Math.min(w, h) * 0.028; // edge depth unit

  // how far each side has burnt in, along its length: wavy, plus a few rounded bites
  const bites = Array.from({ length: 12 }, () => ({ side: Math.floor(r() * 4), at: 0.06 + r() * 0.88, width: 0.006 + r() * 0.018, depth: m * (0.6 + r() * 1.4) }));
  const edge = (side: number, len: number) =>
    Float32Array.from({ length: len }, (_, i) => {
      const u = i / len;
      // gentle waviness plus fine jagged tearing
      let inset = m * (0.4 + 1.1 * fbm(n1, u * 7 + side * 17, side * 3.1, 3) + 0.9 * fbm(n2, u * 90 + side * 5, side * 7.7, 2));
      for (const b of bites) if (b.side === side) inset += b.depth * Math.exp(-(((u - b.at) / b.width) ** 2));
      return inset;
    });
  const top = edge(0, w), bottom = edge(1, w), left = edge(2, h), right = edge(3, h);
  const corner = m * 1.6; // slightly chipped corners

  const img = ctx.createImageData(w, h);
  const px = img.data;
  const cx = w / 2, cy = h / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // distance from the torn edge (px), roughened by noise so the burn line wanders
      let d = Math.min(x - left[y], w - x - right[y], y - top[x], h - y - bottom[x]);
      d = Math.min(d, (x + y) * 0.7071 - corner, (w - x + y) * 0.7071 - corner, (x + h - y) * 0.7071 - corner, (w - x + h - y) * 0.7071 - corner);
      d -= (fbm(n2, x / 30, y / 30, 3) - 0.5) * m * 1.1;
      if (d <= 0) continue; // burnt away: transparent

      // paper: pale cream-gold, softly mottled, warming to orange-tan toward the edges
      const mott = fbm(n3, x / 110, y / 110, 4);
      const stain = fbm(n4, x / 260 + 7, y / 260, 3);
      const mt = smooth(mott * 1.7 - 0.45);
      let R = mix(250, 240, mt);
      let G = mix(233, 212, mt);
      let B = mix(196, 158, mt);
      const st = smooth((stain - 0.58) * 4) * 0.35; // faint tea-coloured patches
      R = mix(R, 226, st); G = mix(G, 178, st); B = mix(B, 112, st);
      const v = Math.hypot((x - cx) / cx, (y - cy) / cy) / 1.414;
      const warm = smooth(v * 1.5 - 0.35) * 0.8;
      R = mix(R, 222, warm); G = mix(G, 166, warm); B = mix(B, 96, warm);

      // very soft unevenness in the surface (the creases are drawn afterwards)
      const shade = 1 + (fbm(n1, x / 160 + 40, y / 160 - 20, 3) - 0.5) * 0.08;
      R *= shade; G *= shade; B *= shade;

      // fine grain
      const grain = (n2(x * 0.8, y * 0.8) - 0.5) * 8;
      R += grain; G += grain; B += grain;

      // the torn edge: a deeper golden-brown along the tear, never black
      const edgeTone = smooth(1 - d / (m * 3.2)) * 0.75;
      R = mix(R, 196, edgeTone); G = mix(G, 128, edgeTone); B = mix(B, 62, edgeTone);
      const rim = smooth(1 - d / (m * 0.7)) * 0.6;
      R = mix(R, 150, rim); G = mix(G, 92, rim); B = mix(B, 42, rim);

      const i = (y * w + x) * 4;
      px[i] = R; px[i + 1] = G; px[i + 2] = B;
      px[i + 3] = 255 * Math.min(1, d / 1.4); // soft anti-aliased edge
    }
  }
  ctx.putImageData(img, 0, 0);

  // a few faint, nearly straight creases from old folds: a soft shadow line with a
  // highlight beside it, painted only onto the paper (source-atop keeps the tears clear)
  ctx.save();
  ctx.globalCompositeOperation = "source-atop";
  for (let i = 0; i < 6; i++) {
    const vertical = r() > 0.5;
    const a = (0.15 + r() * 0.7) * (vertical ? w : h);
    const tilt = (r() - 0.5) * 0.25 * (vertical ? h : w);
    const bend = (r() - 0.5) * 0.06 * (vertical ? w : h);
    const line = (off: number) => {
      ctx.beginPath();
      if (vertical) {
        ctx.moveTo(a - tilt / 2 + off, 0);
        ctx.quadraticCurveTo(a + bend + off, h / 2, a + tilt / 2 + off, h);
      } else {
        ctx.moveTo(0, a - tilt / 2 + off);
        ctx.quadraticCurveTo(w / 2, a + bend + off, w, a + tilt / 2 + off);
      }
      ctx.stroke();
    };
    ctx.filter = "blur(1.2px)";
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(130, 85, 40, ${0.08 + r() * 0.06})`;
    line(0);
    ctx.strokeStyle = `rgba(255, 246, 225, ${0.16 + r() * 0.1})`;
    line(2.2);
  }
  ctx.restore();
}

/**
 * The letter's parchment colours across the whole envelope: cream-gold in the middle,
 * warming to a deeper golden-brown toward every edge. (cx, cy) is the envelope's
 * centre in this canvas, so the flap and the front line up seamlessly.
 */
function parchmentGlow(ctx: CanvasRenderingContext2D, w: number, h: number, cx: number, cy: number, rx: number, ry: number, darker = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx); // elliptical, following the envelope's shape
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.08);
  const shade = (c: [number, number, number]) => `rgb(${c.map((v) => Math.round(v * (1 - darker))).join(",")})`;
  g.addColorStop(0, shade([251, 240, 216]));
  g.addColorStop(0.45, shade([247, 229, 194]));
  g.addColorStop(0.75, shade([240, 211, 166]));
  g.addColorStop(0.92, shade([229, 190, 136]));
  g.addColorStop(1, shade([216, 172, 114]));
  ctx.fillStyle = g;
  ctx.fillRect(-cx - 2, (-cy - 2) * (rx / ry), w + 4, (h + 4) * (rx / ry));
  ctx.restore();
}

function canvasTexture(c: HTMLCanvasElement, repeat?: [number, number], offset?: [number, number]) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) t.repeat.set(...repeat);
  if (offset) t.offset.set(...offset);
  return t;
}

export type Stationery = {
  back: THREE.Texture;
  pocket: THREE.Texture;
  flap: THREE.Texture;
  card: THREE.Texture;
};

/**
 * Paints the envelope's textures (async: waits for the script font used on the card).
 * `W`, `H`, `FLAP_H` map the shape geometries' raw (world-unit) UVs onto the canvas.
 */
export async function paintStationery(W: number, H: number, FLAP_H: number): Promise<Stationery> {
  const script = fontFamily("--font-pinyon", "cursive");
  await document.fonts.load(`64px ${script}`).catch(() => {});

  const PX = 340; // canvas pixels per world unit
  const make = (w: number, h: number) => {
    const c = document.createElement("canvas");
    c.width = Math.round(w * PX);
    c.height = Math.round(h * PX);
    return [c, c.getContext("2d")!] as const;
  };

  // inside of the envelope, a touch darker (seen when the flap opens)
  const [backC, b] = make(W, H);
  parchmentGlow(b, backC.width, backC.height, backC.width / 2, backC.height / 2, backC.width / 2, backC.height / 2, 0.12);
  paper(b, backC.width, backC.height, null, 11, 0.12);

  // front: the side and bottom folds meet under the flap; faint creases show where
  const [pocketC, p] = make(W, H);
  const pw = pocketC.width, ph = pocketC.height;
  parchmentGlow(p, pw, ph, pw / 2, ph / 2, pw / 2, ph / 2);
  paper(p, pw, ph, null, 23, 0);
  const crease = (x0: number, y0: number, x1: number, y1: number) => {
    // a soft shadow line with a highlight beside it, like a real paper fold
    p.lineWidth = 2.2;
    p.strokeStyle = "rgba(150, 105, 55, 0.18)";
    p.beginPath();
    p.moveTo(x0, y0);
    p.lineTo(x1, y1);
    p.stroke();
    p.lineWidth = 1.4;
    p.strokeStyle = "rgba(255, 244, 220, 0.4)";
    p.beginPath();
    p.moveTo(x0, y0 - 3);
    p.lineTo(x1, y1 - 3);
    p.stroke();
  };
  crease(0, ph, pw * 0.5, ph * 0.5);
  crease(pw, ph, pw * 0.5, ph * 0.5);

  // flap (its shape hangs from y = 0 down to y = -FLAP_H)
  const [flapC, f] = make(W, FLAP_H);
  // the flap's canvas starts at the envelope's top edge, so its centre sits H/2 below
  parchmentGlow(f, flapC.width, flapC.height, flapC.width / 2, (H / 2) * PX, flapC.width / 2, (H / 2) * PX);
  paper(f, flapC.width, flapC.height, null, 37, 0);

  // the letter inside: burnt, deep-brown parchment with torn, charred edges
  const [cardC, k] = make(2.7, 1.62);
  const kw = cardC.width, kh = cardC.height;
  burntLetter(k, kw, kh, 51);
  k.globalCompositeOperation = "multiply";
  k.fillStyle = "rgba(40, 18, 4, 0.95)";
  k.textAlign = "center";
  k.font = `${kh * 0.105}px ${script}`;
  k.fillText("You are warmly invited", kw / 2, kh * 0.3);
  k.globalCompositeOperation = "source-over";

  return {
    back: canvasTexture(backC),
    // ShapeGeometry UVs are raw local coordinates; map them onto the canvas
    pocket: canvasTexture(pocketC, [1 / W, 1 / H], [0.5, 0.5]),
    flap: canvasTexture(flapC, [1 / W, 1 / FLAP_H], [0.5, 1]),
    card: canvasTexture(cardC),
  };
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
