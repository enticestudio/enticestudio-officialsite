import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { customDesignHref } from "@/lib/contact";

const steps = [
  { title: "Tell us your idea", body: "Colours you love, a theme, a song, a Pinterest board or just a feeling. Rough is fine." },
  { title: "We design it", body: "A look and an opening animation made only for you, shown as a private preview." },
  { title: "Built your way", body: "Every section, word and photo exactly where you want it, with revisions until it's right." },
];

/**
 * "Not just our demos": a band that says every design can be made from scratch.
 * Used on the demos page, service pages and pricing.
 */
export function CustomDesign({ tone = "ink", what = "page" }: { tone?: "ink" | "ivory"; what?: string }) {
  const dark = tone === "ink";
  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <Reveal>
          <div
            className={`relative overflow-hidden rounded-3xl p-8 md:p-14 ${dark ? "bg-ink text-paper" : "bg-ivory text-ink"}`}
          >
            {/* soft champagne glow */}
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-champagne/20 blur-3xl" />

            <div className="relative grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-end">
              <div>
                <p className={`eyebrow ${dark ? "text-champagne" : "text-champagne-deep"}`}>Fully custom</p>
                <h2 className="mt-5 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1]">
                  Don&apos;t see your style? <span className="font-accent italic">We&apos;ll design it.</span>
                </h2>
                <p className={`mt-6 max-w-md ${dark ? "text-paper/70" : "text-ink-soft"}`}>
                  Our demos are a starting point, not a limit. Describe the {what} you imagine and we&apos;ll create it from scratch,
                  exactly the way you want it.
                </p>
                <div className="mt-8">
                  <Button href={customDesignHref} variant={dark ? "light" : "solid"}>
                    Start a custom design
                  </Button>
                </div>
              </div>

              <ol className="grid gap-4 sm:grid-cols-3">
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    className={`rounded-2xl border p-6 ${dark ? "border-paper/15 bg-paper/[0.04]" : "border-line bg-paper"}`}
                  >
                    <span className={`font-accent text-lg italic ${dark ? "text-champagne" : "text-champagne-deep"}`}>0{i + 1}</span>
                    <p className="mt-3 font-display text-xl leading-tight">{s.title}</p>
                    <p className={`mt-2 text-sm ${dark ? "text-paper/65" : "text-ink-soft"}`}>{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
