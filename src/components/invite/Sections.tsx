"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Invitation } from "@/lib/invitations";
import { ArchFrame, Divider, Mandala, Sprig } from "./Ornaments";

const ease = [0.22, 1, 0.36, 1] as const;

const namesClass = {
  script: "font-script text-[clamp(3.2rem,15vw,4.6rem)] leading-[1.05]",
  display: "font-display text-[clamp(2.8rem,13vw,4rem)] leading-[1]",
  sans: "font-sans uppercase tracking-[0.18em] text-[clamp(2rem,10vw,2.8rem)] leading-[1.1]",
};

/** Fade-up when scrolled into view (inside the invitation). */
function In({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <In className="mb-10 text-center">
      <h2 className="font-script text-5xl leading-tight">{children}</h2>
      <Divider className="mx-auto mt-3 w-32 text-[var(--inv-accent)]" />
      {sub && <p className="mt-4 text-sm opacity-75">{sub}</p>}
    </In>
  );
}

/* ───────────────────────────── Hero ───────────────────────────── */

export function Hero({ inv, revealed }: { inv: Invitation; revealed: boolean }) {
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 1, delay, ease },
  });
  const [first, second] = inv.names;

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 py-24 text-center">
      {/* background: looping video > image > gradient */}
      {inv.heroVideo ? (
        <video className="absolute inset-0 h-full w-full object-cover opacity-50" src={inv.heroVideo} poster={inv.heroImage} autoPlay muted loop playsInline />
      ) : inv.heroImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- decorative full-bleed background
        <img className="absolute inset-0 h-full w-full object-cover opacity-50" src={inv.heroImage} alt="" />
      ) : (
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 35%, var(--inv-surface), var(--inv-bg) 72%)" }} />
      )}

      {/* ornaments */}
      <div className="pointer-events-none absolute inset-0 text-[var(--inv-accent)]">
        {inv.ornament === "mandala" && (
          <Mandala className="absolute left-1/2 top-[7%] w-40 -translate-x-1/2 animate-[slow-spin_80s_linear_infinite] opacity-70" />
        )}
        {inv.ornament === "arch" && <ArchFrame className="absolute inset-x-5 bottom-0 top-10 opacity-60" />}
        {inv.ornament === "botanical" && (
          <>
            <Sprig className="absolute -left-6 -top-4 w-44 opacity-70" />
            <Sprig className="absolute -bottom-4 -right-6 w-44 rotate-180 opacity-70" />
          </>
        )}
      </div>

      <div className="relative">
        <motion.p className="eyebrow text-[0.62rem] text-[var(--inv-accent)]" {...show(0.2)}>
          {inv.occasion}
        </motion.p>
        <motion.p className="mx-auto mt-6 max-w-xs font-accent text-lg italic leading-snug opacity-85" {...show(0.45)}>
          {inv.intro}
        </motion.p>

        <motion.h1 className={`mt-6 ${namesClass[inv.theme.namesFont]}`} {...show(0.75)}>
          {first}
          {second && (
            <>
              <span className="my-1 block font-accent text-3xl italic text-[var(--inv-accent)]">&amp;</span>
              {second}
            </>
          )}
        </motion.h1>
        {inv.localNames && (
          <motion.p className="mt-3 font-sinhala text-lg opacity-85" {...show(1)}>
            {inv.localNames}
          </motion.p>
        )}

        <motion.div {...show(1.15)}>
          <Divider className="mx-auto my-7 w-40 text-[var(--inv-accent)]" />
          <p className="eyebrow text-[0.65rem]">{inv.dateLabel}</p>
          <p className="mt-2 font-accent text-lg italic">{inv.timeLabel}</p>
          <p className="mt-1 text-sm opacity-75">{inv.venue.name}</p>
          {inv.hashtag && <p className="mt-6 text-sm tracking-wider text-[var(--inv-accent)]">{inv.hashtag}</p>}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.3em] opacity-70"
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 0.7, y: [0, 6, 0] } : { opacity: 0 }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
      >
        SCROLL
      </motion.div>
    </section>
  );
}

/* ───────────────────────────── Countdown ───────────────────────────── */

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { v: Math.floor(s / 86400), l: "Days" },
    { v: Math.floor((s % 86400) / 3600), l: "Hours" },
    { v: Math.floor((s % 3600) / 60), l: "Minutes" },
    { v: s % 60, l: "Seconds" },
  ];
}

export function Countdown({ inv }: { inv: Invitation }) {
  // Starts empty so the server-rendered HTML never contains a stale time.
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(inv.start).getTime();
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [inv.start]);

  return (
    <section className="px-6 py-20" style={{ background: "var(--inv-surface)" }}>
      <Heading>Counting down</Heading>
      <div className="grid grid-cols-4 gap-2">
        {(left === null ? parts(0).map((p) => ({ ...p, v: null })) : parts(left)).map((p, i) => (
          <In key={p.l} delay={i * 0.08}>
            <div className="rounded-xl border px-1 py-4 text-center" style={{ borderColor: "color-mix(in oklab, var(--inv-accent) 45%, transparent)" }}>
              <p className="font-display text-3xl tabular-nums">{p.v === null ? "–" : String(p.v).padStart(2, "0")}</p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] opacity-70">{p.l}</p>
            </div>
          </In>
        ))}
      </div>
      {left !== null && left <= 0 && <p className="mt-6 text-center font-accent italic">The big day is here!</p>}
    </section>
  );
}

/* ───────────────────────────── Story ───────────────────────────── */

export function Story({ inv }: { inv: Invitation }) {
  if (!inv.story?.length) return null;
  return (
    <section className="px-6 py-20">
      <Heading>Our story</Heading>
      <ol className="relative ml-3 space-y-10 border-l pl-7" style={{ borderColor: "color-mix(in oklab, var(--inv-accent) 50%, transparent)" }}>
        {inv.story.map((s, i) => (
          <li key={s.year} className="relative">
            <span className="absolute -left-[2.2rem] top-1 size-3 rounded-full" style={{ background: "var(--inv-accent)" }} />
            <In delay={i * 0.05}>
              <p className="eyebrow text-[0.6rem] text-[var(--inv-accent)]">{s.year}</p>
              <h3 className="mt-1 font-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80">{s.text}</p>
            </In>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ───────────────────────────── Events ───────────────────────────── */

export function Events({ inv }: { inv: Invitation }) {
  return (
    <section className="px-6 py-20" style={{ background: "var(--inv-surface)" }}>
      <Heading>{inv.events.length > 1 ? "The celebrations" : "The details"}</Heading>
      <div className="space-y-4">
        {inv.events.map((e, i) => (
          <In key={e.name} delay={i * 0.06}>
            <article
              className="rounded-2xl border p-6 text-center"
              style={{ borderColor: "color-mix(in oklab, var(--inv-accent) 40%, transparent)", background: "var(--inv-bg)" }}
            >
              <p className="eyebrow text-[0.55rem] text-[var(--inv-accent)]">Event · {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-script text-4xl">{e.name}</h3>
              <p className="mt-3 text-sm">{e.date}</p>
              <p className="text-sm opacity-80">
                {e.time} · {e.place}
              </p>
              {e.note && <p className="mt-3 font-accent italic opacity-80">{e.note}</p>}
            </article>
          </In>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────── Gallery ───────────────────────────── */

export function Gallery({ inv }: { inv: Invitation }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!inv.gallery?.length) return null;
  return (
    <section className="py-20">
      <Heading>Moments</Heading>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
        {inv.gallery.map((src) => (
          <button key={src} onClick={() => setOpen(src)} className="w-[70%] shrink-0 snap-center overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element -- client-supplied gallery images */}
            <img src={src} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.button
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            aria-label="Close photo"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open} alt="" className="max-h-full max-w-full rounded-lg" />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ───────────────────────────── Venue ───────────────────────────── */

export function Venue({ inv }: { inv: Invitation }) {
  const [showMap, setShowMap] = useState(false);
  const q = encodeURIComponent(`${inv.venue.name}, ${inv.venue.address}`);
  return (
    <section className="px-6 py-20 text-center">
      <Heading>The venue</Heading>
      <In>
        <p className="font-display text-2xl">{inv.venue.name}</p>
        <p className="mt-2 text-sm opacity-80">{inv.venue.address}</p>
        <div className="mt-6 overflow-hidden rounded-2xl border" style={{ borderColor: "color-mix(in oklab, var(--inv-accent) 40%, transparent)" }}>
          {showMap ? (
            // Loaded only on tap: faster first load and no third-party requests until the guest asks.
            <iframe title="Venue map" src={`https://maps.google.com/maps?q=${q}&output=embed`} className="h-64 w-full" loading="lazy" />
          ) : (
            <button onClick={() => setShowMap(true)} className="flex h-40 w-full items-center justify-center text-sm tracking-wider" style={{ background: "var(--inv-surface)" }}>
              Tap to show map
            </button>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-full px-6 py-3 text-xs font-medium uppercase tracking-[0.2em]"
          style={{ background: "var(--inv-accent)", color: "var(--inv-on-accent)" }}
        >
          Open in Google Maps
        </a>
      </In>
    </section>
  );
}

/* ───────────────────────────── Save the date ───────────────────────────── */

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function SaveTheDate({ inv }: { inv: Invitation }) {
  const title = inv.names.length > 1 ? `${inv.names.join(" & ")} — ${inv.occasion}` : `${inv.names[0]} — ${inv.occasion}`;
  const location = `${inv.venue.name}, ${inv.venue.address}`;

  const google = () => {
    const start = new Date(inv.start);
    const end = new Date(start.getTime() + 5 * 3600_000);
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", title);
    url.searchParams.set("dates", `${icsDate(start)}/${icsDate(end)}`);
    url.searchParams.set("location", location);
    window.open(url.toString(), "_blank", "noopener");
  };

  const ics = () => {
    const start = new Date(inv.start);
    const end = new Date(start.getTime() + 5 * 3600_000);
    const body = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Entice Studio//Invitation//EN",
      "BEGIN:VEVENT",
      `UID:${inv.slug}@enticestudio`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:${title}`,
      `LOCATION:${location.replace(/,/g, "\\,")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    a.download = `${inv.slug}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const btn = "rounded-full border px-5 py-3 text-xs uppercase tracking-[0.18em]";
  return (
    <section className="px-6 py-16 text-center" style={{ background: "var(--inv-surface)" }}>
      <In>
        <h2 className="font-script text-4xl">Save the date</h2>
        <p className="mt-3 text-sm opacity-80">Add it to your calendar so you don&apos;t miss a moment.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={google} className={btn} style={{ borderColor: "var(--inv-accent)" }}>
            Google Calendar
          </button>
          <button onClick={ics} className={btn} style={{ borderColor: "var(--inv-accent)" }}>
            Apple / Outlook
          </button>
        </div>
      </In>
    </section>
  );
}

/* ───────────────────────────── RSVP ───────────────────────────── */

export function Rsvp({ inv, guest }: { inv: Invitation; guest: string | null }) {
  const [sent, setSent] = useState<null | "yes" | "no">(null);
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const line = { borderColor: "color-mix(in oklab, var(--inv-fg) 25%, transparent)" };
  const field = "mt-1 w-full rounded-lg border bg-transparent px-4 py-3 text-base outline-none focus:border-[var(--inv-accent)]";

  return (
    <section className="px-6 py-20">
      <Heading sub={`Kindly respond by ${inv.rsvpBy}`}>RSVP</Heading>
      <In>
        <div className="rounded-2xl border p-6" style={line}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <p className="font-script text-4xl">{sent === "yes" ? "Can't wait to see you!" : "You'll be missed"}</p>
                <p className="mt-3 text-xs opacity-70">This is a demo — nothing was sent.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                exit={{ opacity: 0 }}
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(attending);
                }}
              >
                <label className="block text-xs uppercase tracking-[0.18em] opacity-80">
                  Full name
                  <input required defaultValue={guest ?? ""} className={field} style={line} />
                </label>
                <fieldset>
                  <legend className="mb-2 text-xs uppercase tracking-[0.18em] opacity-80">Will you attend?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setAttending(v)}
                        className="rounded-lg border px-3 py-3 text-sm transition-colors"
                        style={
                          attending === v
                            ? { background: "var(--inv-accent)", color: "var(--inv-on-accent)", borderColor: "var(--inv-accent)" }
                            : line
                        }
                      >
                        {v === "yes" ? "Joyfully accept" : "Regretfully decline"}
                      </button>
                    ))}
                  </div>
                </fieldset>
                {attending === "yes" && (
                  <label className="block text-xs uppercase tracking-[0.18em] opacity-80">
                    Number of guests
                    <select className={field} style={line} defaultValue="2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} style={{ color: "#111" }}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="block text-xs uppercase tracking-[0.18em] opacity-80">
                  A note for us (optional)
                  <textarea rows={2} className={`${field} resize-none`} style={line} />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full py-4 text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ background: "var(--inv-accent)", color: "var(--inv-on-accent)" }}
                >
                  Send RSVP
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </In>
    </section>
  );
}

/* ───────────────────────────── Closing ───────────────────────────── */

export function Closing({ inv }: { inv: Invitation }) {
  return (
    <footer className="px-6 pb-16 pt-12 text-center" style={{ background: "var(--inv-surface)" }}>
      <In>
        <Divider className="mx-auto w-40 text-[var(--inv-accent)]" />
        <p className="mx-auto mt-8 max-w-xs font-accent text-xl italic leading-snug">{inv.closing}</p>
        <p className={`mt-6 ${inv.theme.namesFont === "script" ? "font-script text-5xl" : "font-display text-3xl"}`}>
          {inv.names.join(" & ")}
        </p>
        {/* _top: when shown inside the phone viewer, open the studio site in the main window */}
        <Link href="/" target="_top" className="mt-12 inline-block text-[0.6rem] uppercase tracking-[0.3em] opacity-50 hover:opacity-90">
          Invitation by Entice Studio
        </Link>
      </In>
    </footer>
  );
}
