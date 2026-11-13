import { faqs } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function Faq() {
  return (
    <section className="bg-ivory py-28 md:py-36">
      <div className="container-x grid gap-12 md:grid-cols-[1fr_1.5fr]">
        <div>
          <p className="eyebrow text-stone">Questions</p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1]">
            Good to <span className="font-accent italic">know.</span>
          </h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="relative size-4 shrink-0" aria-hidden>
                    <span className="absolute left-0 top-1/2 h-px w-4 bg-ink" />
                    <span className="absolute left-0 top-1/2 h-px w-4 rotate-90 bg-ink transition-transform duration-300 group-open:rotate-0" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-ink-soft">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
