// ─────────────────────────────────────────────────────────────────────────────
// Seasonal theme for the studio pages (not the invitations or Moments demos).
//
// Christmas adds: a greeting bar above the menu, gentle snowfall, gold stars,
// a warm evergreen glow on the dark sections and a red wax seal on the envelope.
// Outside the dates below it all disappears by itself: nothing to undo.
// ─────────────────────────────────────────────────────────────────────────────

export const season = {
  /**
   * "auto": shown every year between `from` and `to` (checked on the visitor's device).
   * "on":   always shown (handy for previewing before December).
   * "off":  never shown.
   */
  mode: "on" as "auto" | "on" | "off",
  from: { month: 12, day: 1 },
  to: { month: 1, day: 1 },

  /** Greeting bar wording. `short` is used on phones. */
  greeting: "Merry Christmas & a joyful New Year, with love from Entice Studio",
  short: "Merry Christmas from Entice Studio",
  /** Optional link at the end of the bar (set to null to remove it). */
  link: { href: "/demos/christmas-wishes", label: "Send a Christmas wish" } as { href: string; label: string } | null,

  /** Turn the envelope's wax seal Christmas red for the season. */
  redSeal: true,
};

/** Is `date` inside the season's window? Handles windows that cross New Year. */
export function inSeason(date: Date) {
  const key = (m: number, d: number) => m * 100 + d;
  const now = key(date.getMonth() + 1, date.getDate());
  const from = key(season.from.month, season.from.day);
  const to = key(season.to.month, season.to.day);
  return from <= to ? now >= from && now <= to : now >= from || now <= to;
}
