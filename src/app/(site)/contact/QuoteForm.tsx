"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { submitQuote, type QuoteState } from "./actions";
import { momentPackages, websitePackages, smallProducts } from "@/lib/content";
import { useCurrency } from "@/components/currency/Currency";
import { formatMoney } from "@/lib/pricing";
import { whatsappLink } from "@/lib/contact";
import { WhatsAppButton } from "@/components/contact/WhatsApp";

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

const designOptions = ["Based on one of your demos", "Fully custom design", "Not sure yet"];

function DesignSelect({ value }: { value?: string }) {
  return (
    <select key={`g-${value}`} name="design" className={input} defaultValue={value || designOptions[0]}>
      {designOptions.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

/** "Start a custom design" buttons link here with ?design=custom, which preselects it. */
function DesignFromLink({ refill }: { refill?: string }) {
  const custom = useSearchParams().get("design") === "custom";
  return <DesignSelect value={refill || (custom ? designOptions[1] : undefined)} />;
}

export function QuoteForm() {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const { currency } = useCurrency();
  // React clears the form after each submit; refill it with what was sent when it failed.
  const v: Record<string, string> = state && !state.ok ? (state.values ?? {}) : {};

  if (state?.ok) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-ink p-10 text-paper">
        <span className="block size-3 rounded-full bg-champagne" />
        <p className="mt-6 font-display text-4xl">Request received.</p>
        <p className="mt-4 text-paper/70">{state.message}</p>
        {state.summary && (
          <WhatsAppButton
            tone="light"
            className="mt-8"
            message={`Hi Entice Studio! I just sent a quote request on your website.\n\n${state.summary}`}
          >
            Continue on WhatsApp
          </WhatsAppButton>
        )}
      </motion.div>
    );
  }

  return (
    <form action={action} className="grid gap-8 sm:grid-cols-2">
      {/* spam trap: hidden from people, bots fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field label="Your name" required>
        <input name="name" defaultValue={v.name} required className={input} autoComplete="name" />
      </Field>
      <Field label="Email" required>
        <input name="email" defaultValue={v.email} type="email" required className={input} autoComplete="email" />
      </Field>
      <Field label="Event type" required>
        <select key={`e-${v.eventType}`} name="eventType" required className={input} defaultValue={v.eventType ?? ""}>
          <option value="" disabled>
            Choose…
          </option>
          <optgroup label="Invitations">
            {["Wedding", "Engagement / pre-wedding", "Birthday party", "Baby or family celebration", "Religious / cultural ceremony", "Business opening or launch", "Corporate event"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </optgroup>
          <optgroup label="Moments (a page for one person)">
            {["Proposal", "Valentine's / anniversary surprise", "Birthday surprise", "Christmas / festive wishes", "Graduation / farewell", "Memorial / tribute"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </optgroup>
          <option>Other</option>
        </select>
      </Field>
      <Field label="Date" required>
        <input name="eventDate" type="date" defaultValue={v.eventDate} required className={input} />
      </Field>
      <Field label="Country / time zone" required>
        <input name="country" defaultValue={v.country} required className={input} placeholder="e.g. United Kingdom (GMT)" />
      </Field>
      <Field label="Guest count">
        <input name="guests" type="number" defaultValue={v.guests} min={1} className={input} placeholder="e.g. 150 (skip for Moments)" />
      </Field>
      <Field label="Package" required>
        <select key={`p-${v.package}`} name="package" required className={input} defaultValue={v.package ?? ""}>
          <option value="" disabled>
            Choose…
          </option>
          {/* value = package name (stable); label shows the price in the chosen currency */}
          {[...websitePackages, ...smallProducts, ...momentPackages].map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} ({formatMoney(p.price[currency], currency)})
            </option>
          ))}
          <option value="Not sure yet">Not sure yet</option>
        </select>
        {/* tells you which currency the client was looking at when they asked */}
        <input type="hidden" name="currency" value={currency} />
      </Field>
      <Field label="Custom domain?">
        <select key={`d-${v.domain}`} name="domain" className={input} defaultValue={v.domain || "No — studio link is fine"}>
          <option>No — studio link is fine</option>
          <option>Yes — I have one</option>
          <option>Yes — please register one</option>
        </select>
      </Field>
      <Field label="Language(s)">
        <input name="language" defaultValue={v.language} className={input} placeholder="e.g. English & Sinhala" />
      </Field>
      <Field label="Design">
        {/* the link's ?design= is only known in the browser, so this one field renders there */}
        <Suspense fallback={<DesignSelect value={v.design} />}>
          <DesignFromLink refill={v.design} />
        </Suspense>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Design reference or your idea">
          <input
            name="reference"
            defaultValue={v.reference}
            className={input}
            placeholder="A demo name, a link you love, or describe what you imagine"
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Anything else?">
          <textarea name="notes" defaultValue={v.notes} rows={3} className={`${input} resize-none`} />
        </Field>
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone" aria-live="polite">
          {state && !state.ok ? <span className="text-[#a33]">{state.message}</span> : "We reply within one business day."}
        </p>
        <div className="flex shrink-0 flex-col gap-3 whitespace-nowrap sm:flex-row-reverse">
          <button
            type="submit"
            disabled={pending}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {pending ? "Sending…" : "Request my quote"}
            <span className="size-1.5 rounded-full bg-current transition-transform duration-300 group-hover:scale-[2.2]" />
          </button>
          {state && !state.ok && whatsappLink() && <WhatsAppButton>Message us instead</WhatsAppButton>}
        </div>
      </div>
    </form>
  );
}
