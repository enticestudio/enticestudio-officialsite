"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { submitQuote, type QuoteState } from "./actions";
import { websitePackages, smallProducts } from "@/lib/content";

const input =
  "mt-2 w-full border-b border-ink/25 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-stone/60 focus:border-ink";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow text-stone">
        {label}
        {required && <span className="text-champagne-deep"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function QuoteForm() {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);

  if (state?.ok) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-ink p-10 text-paper">
        <span className="block size-3 rounded-full bg-champagne" />
        <p className="mt-6 font-display text-4xl">Request received.</p>
        <p className="mt-4 text-paper/70">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="grid gap-8 sm:grid-cols-2">
      <Field label="Your name" required>
        <input name="name" required className={input} autoComplete="name" />
      </Field>
      <Field label="Email" required>
        <input name="email" type="email" required className={input} autoComplete="email" />
      </Field>
      <Field label="Event type" required>
        <select name="eventType" required className={input} defaultValue="">
          <option value="" disabled>
            Choose…
          </option>
          {["Wedding", "Engagement / pre-wedding", "Birthday", "Baby or family celebration", "Religious / cultural ceremony", "Business opening or launch", "Corporate event", "Other"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </Field>
      <Field label="Event date" required>
        <input name="eventDate" type="date" required className={input} />
      </Field>
      <Field label="Country / time zone" required>
        <input name="country" required className={input} placeholder="e.g. United Kingdom (GMT)" />
      </Field>
      <Field label="Guest count" required>
        <input name="guests" type="number" min={1} required className={input} placeholder="e.g. 150" />
      </Field>
      <Field label="Package" required>
        <select name="package" required className={input} defaultValue="">
          <option value="" disabled>
            Choose…
          </option>
          {[...websitePackages.map((p) => `${p.name} ($${p.price})`), ...smallProducts.map((p) => `${p.name} ($${p.price})`), "Not sure yet"].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </Field>
      <Field label="Custom domain?">
        <select name="domain" className={input} defaultValue="No — studio link is fine">
          <option>No — studio link is fine</option>
          <option>Yes — I have one</option>
          <option>Yes — please register one</option>
        </select>
      </Field>
      <Field label="Language(s)">
        <input name="language" className={input} placeholder="e.g. English & Sinhala" />
      </Field>
      <Field label="Design reference">
        <input name="reference" className={input} placeholder="Demo name or a link you love" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Anything else?">
          <textarea name="notes" rows={3} className={`${input} resize-none`} />
        </Field>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone" aria-live="polite">
          {state && !state.ok ? <span className="text-[#a33]">{state.message}</span> : "We reply within one business day."}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Sending…" : "Request my quote"}
          <span className="size-1.5 rounded-full bg-current transition-transform duration-300 group-hover:scale-[2.2]" />
        </button>
      </div>
    </form>
  );
}
