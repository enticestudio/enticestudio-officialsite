import type { Invitation } from "@/lib/invitations";

// Deterministic pseudo-random numbers (same on server and client → no hydration mismatch).
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Drifting petals or twinkling sparkles over the invitation. Pure CSS animation. */
export function Particles({ kind, color }: { kind: Invitation["particles"]; color: string }) {
  if (kind === "none") return null;
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
