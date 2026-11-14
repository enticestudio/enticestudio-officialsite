// ─────────────────────────────────────────────────────────────────────────────
// All prices on the site, in both currencies. Edit amounts here only.
//
// LKR is the main price list. USD amounts are the LKR price at about Rs 300 = $1,
// rounded to whole dollars (a fixed list, not a live exchange rate).
// ─────────────────────────────────────────────────────────────────────────────

export type Currency = "USD" | "LKR";
export const CURRENCIES: Currency[] = ["LKR", "USD"];

/** A single price in both currencies. */
export type Money = { USD: number; LKR: number };
/** A from–to price range in both currencies. */
export type MoneyRange = { USD: [number, number]; LKR: [number, number] };

export const prices = {
  // Website packages
  essential: { USD: 13, LKR: 3_999 },
  rsvp: { USD: 23, LKR: 6_999 },
  signature: { USD: 40, LKR: 11_999 },
  // Small products
  card: { USD: 5, LKR: 1_499 },
  motion: { USD: 8, LKR: 2_499 },
  // Moments (personal pages)
  moment: { USD: 17, LKR: 4_999 },
  momentPremium: { USD: 27, LKR: 7_999 },
  // Add-ons
  domainSetup: { USD: 3, LKR: 999 },
  qrPasses: { USD: 30, LKR: 8_999 },
} satisfies Record<string, Money>;

export const ranges = {
  revision: { USD: [2, 3], LKR: [599, 999] },
  secondLanguage: { USD: [5, 10], LKR: [1_499, 2_999] },
  extraEvent: { USD: [4, 8], LKR: [1_199, 2_399] },
  guestLinks: { USD: [5, 10], LKR: [1_499, 2_999] },
  matchingSet: { USD: [5, 8], LKR: [1_499, 2_499] },
  matchingVideo: { USD: [6, 9], LKR: [1_799, 2_699] },
  photoGallery: { USD: [5, 10], LKR: [1_499, 2_999] },
  seatingChart: { USD: [5, 15], LKR: [1_499, 4_499] },
} satisfies Record<string, MoneyRange>;

const symbol: Record<Currency, string> = { USD: "$", LKR: "Rs " };

/** "$13" / "Rs 3,999" (fixed en-US grouping so server and browser agree). */
export function formatMoney(amount: number, currency: Currency) {
  return `${symbol[currency]}${amount.toLocaleString("en-US")}`;
}

/** "$20–35" / "Rs 6,000–10,500" */
export function formatRange([from, to]: [number, number], currency: Currency) {
  return `${symbol[currency]}${from.toLocaleString("en-US")}–${to.toLocaleString("en-US")}`;
}

export const currencySymbol = (c: Currency) => symbol[c].trim();
