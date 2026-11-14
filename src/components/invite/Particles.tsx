import type { Design } from "@/lib/invitations";

// Deterministic pseudo-random numbers (same on server and client → no hydration mismatch).
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Drifting petals or twinkling sparkles over the invitation. Pure CSS animation. */
export function Particles({ kind, color }: { kind: Design["particles"]; color: string }) {
  if (kind === "none") return null;

  if (kind === "hearts") {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => {
          const size = 10 + rand(i, 4) * 14;
          return (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className="absolute -bottom-10 block animate-[bubble-rise_linear_infinite]"
              style={{
                left: `${rand(i, 1) * 100}%`,
                width: size,
                height: size,
                color: i % 3 === 0 ? `color-mix(in oklab, ${color} 45%, white)` : color,
                opacity: 0.55,
                animationDuration: `${11 + rand(i, 3) * 8}s`,
                animationDelay: `${-rand(i, 2) * 18}s`,
              }}
            >
              <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.1 5.4 3.1 1.8-2 3.3-3.1 5.4-3.1 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21Z" />
            </svg>
          );
        })}
      </div>
    );
  }

  if (kind === "embers") {
    // slow, sparse points of warm light (memorial pages: calm, never busy)
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {Array.from({ length: 10 }, (_, i) => {
          const size = 2 + rand(i, 4) * 3;
          return (
            <span
              key={i}
              className="absolute -bottom-6 block animate-[bubble-rise_linear_infinite] rounded-full"
              style={{
                left: `${rand(i, 1) * 100}%`,
                width: size,
                height: size,
                background: color,
                boxShadow: `0 0 ${size * 4}px ${color}`,
                opacity: 0.5,
                animationDuration: `${22 + rand(i, 3) * 14}s`,
                animationDelay: `${-rand(i, 2) * 30}s`,
              }}
            />
          );
        })}
      </div>
    );
  }

  if (kind === "confetti") {
    const palette = [color, "#ffd166", "#06d6a0", "#4d96ff", "#b388ff"];
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            className="absolute -top-6 block animate-[petal-fall_linear_infinite]"
            style={{
              left: `${rand(i, 1) * 100}%`,
              width: 6 + rand(i, 4) * 5,
              height: 10 + rand(i, 5) * 6,
              borderRadius: i % 3 === 0 ? "50%" : 2,
              background: palette[i % palette.length],
              animationDuration: `${7 + rand(i, 3) * 6}s`,
              animationDelay: `${-rand(i, 2) * 12}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (kind === "bubbles") {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
        {Array.from({ length: 14 }, (_, i) => {
          const size = 10 + rand(i, 4) * 26;
          return (
            <span
              key={i}
              className="absolute -bottom-12 block animate-[bubble-rise_linear_infinite] rounded-full border"
              style={{
                left: `${rand(i, 1) * 100}%`,
                width: size,
                height: size,
                borderColor: `color-mix(in oklab, ${color} 60%, white)`,
                background: `radial-gradient(circle at 30% 30%, rgb(255 255 255 / 0.8), color-mix(in oklab, ${color} 25%, transparent))`,
                animationDuration: `${10 + rand(i, 3) * 8}s`,
                animationDelay: `${-rand(i, 2) * 16}s`,
              }}
            />
          );
        })}
      </div>
    );
  }

  const count = kind === "petals" ? 14 : 22;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {Array.from({ length: count }, (_, i) => {
        const left = rand(i, 1) * 100;
        const delay = -rand(i, 2) * 14;
        const dur = 9 + rand(i, 3) * 8;
        const size = kind === "petals" ? 8 + rand(i, 4) * 8 : 2 + rand(i, 4) * 3;
        return kind === "petals" ? (
          <span
            key={i}
            className="absolute -top-8 block animate-[petal-fall_linear_infinite] rounded-[70%_0_70%_0] opacity-70"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.3,
              background: `linear-gradient(135deg, ${color}, color-mix(in oklab, ${color} 55%, white))`,
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ) : (
          <span
            key={i}
            className="absolute block animate-[twinkle_ease-in-out_infinite] rounded-full"
            style={{
              left: `${left}%`,
              top: `${rand(i, 5) * 100}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
              animationDuration: `${2.5 + rand(i, 6) * 3}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
