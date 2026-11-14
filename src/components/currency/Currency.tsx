"use client";

import { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  CURRENCIES,
  currencySymbol,
  formatMoney,
  formatRange,
  type Currency,
  type Money,
  type MoneyRange,
} from "@/lib/pricing";

const STORAGE_KEY = "entice-currency";

type Ctx = { currency: Currency; setCurrency: (c: Currency) => void };
const CurrencyContext = createContext<Ctx>({ currency: "USD", setCurrency: () => {} });

export const useCurrency = () => useContext(CurrencyContext);

/**
 * Holds the visitor's chosen currency for the whole studio site.
 * First visit: LKR for devices set to Sri Lanka time, otherwise USD.
 * The choice is remembered on this device.
 */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Pages are prerendered in USD; the visitor's preference is applied right after load.
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    let initial: Currency = "USD";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "USD" || saved === "LKR") initial = saved;
      else if (Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Colombo") initial = "LKR";
    } catch {
      /* storage unavailable (private mode) — keep USD */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the saved preference
    setCurrencyState(initial);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  };

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
}

/** Renders a price (or a from–to range) in the selected currency. */
export function Price({
  value,
  prefix = "",
  suffix = "",
}: {
  value: Money | MoneyRange;
  prefix?: string;
  suffix?: string;
}) {
  const { currency } = useCurrency();
  const amount = value[currency];
  const text = Array.isArray(amount) ? formatRange(amount, currency) : formatMoney(amount, currency);
  return (
    <span className="whitespace-nowrap tabular-nums">
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/** Large price with a small currency symbol, for package cards. */
export function BigPrice({ value }: { value: Money }) {
  const { currency } = useCurrency();
  return (
    <span className="whitespace-nowrap">
      <span className="mr-1 align-top text-2xl">{currencySymbol(currency)}</span>
      {value[currency].toLocaleString("en-US")}
    </span>
  );
}

/** LKR | USD segmented switch. */
export function CurrencyToggle({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const { currency, setCurrency } = useCurrency();
  const dark = tone === "dark";
  // Each switch needs its own highlight id: with a shared one, several switches on the
  // same page fight over a single highlight and the chosen option can vanish.
  const pillId = useId();
  return (
    <div
      role="radiogroup"
      aria-label="Show prices in"
      className={`relative inline-flex rounded-full border p-1 text-sm font-medium ${
        dark ? "border-paper/25 bg-paper/10" : "border-ink/15 bg-ink/[0.05]"
      } ${className}`}
    >
      {CURRENCIES.map((c) => {
        const active = c === currency;
        return (
          <button
            key={c}
            role="radio"
            aria-checked={active}
            onClick={() => setCurrency(c)}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 tracking-wide transition-colors duration-300 ${
              active ? (dark ? "text-ink" : "text-paper") : dark ? "text-paper/75 hover:text-paper" : "text-ink/65 hover:text-ink"
            }`}
          >
            {active && (
              <motion.span
                layoutId={pillId}
                className={`absolute inset-0 -z-10 rounded-full shadow-sm ${dark ? "bg-paper" : "bg-ink"}`}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className={active ? "opacity-80" : "opacity-60"}>{currencySymbol(c).trim()}</span>
            {c}
          </button>
        );
      })}
    </div>
  );
}
