import Link from "next/link";
import type { Service } from "@/lib/content";
import { designsIn } from "@/lib/invitations";
import { PageHeader } from "./PageHeader";
import { MomentPackages, Packages } from "./Packages";
import { Cta } from "./Cta";
import { CustomDesign } from "./CustomDesign";
import { Reveal } from "@/components/motion/Reveal";
import { InvitePreview, PhoneFrame } from "@/components/ui/InvitePreview";
import { NewBadge } from "@/components/ui/NewBadge";
import { Price } from "@/components/currency/Currency";

export function ServicePage({ service }: { service: Service }) {
  // Every demo in this category, newest first — new designs appear here automatically.
  const picks = designsIn(service.category);
  return (
    <>
      <PageHeader eyebrow={service.kicker} title={`${service.title}, *beautifully* ${service.category === "Moment" ? "made" : "sent"}.`} intro={service.intro} />

      <section className="py-24 md:py-32">
        <div className="container-x grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="eyebrow text-stone">Occasions</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {service.occasions.map((o, i) => (
                <Reveal key={o} delay={i * 0.05}>
                  <li className="flex items-center justify-between py-4 font-display text-2xl">
                    {o}
                    <span className="size-1.5 rounded-full bg-champagne" />
                  </li>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-sm text-stone">From <Price value={service.from} /> · {service.priceNote}</p>
          </div>

          <div>
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <p className="eyebrow text-stone">
                {picks.length} live {picks.length === 1 ? "demo" : "demos"}
              </p>
              <Link href={`/demos#${service.demosAnchor}`} className="text-sm underline-offset-4 hover:underline">
                See all demos →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {picks.map((d, i) => (
                <Reveal key={d.slug} delay={(i % 2) * 0.1} className={i % 2 ? "mt-16" : ""}>
                  <Link href={`/demos/${d.slug}`} className="group relative block">
                    {d.isNew && <NewBadge className="absolute -right-2 -top-2 z-10" />}
                    <PhoneFrame className="transition-transform duration-500 group-hover:-translate-y-2">
                      <InvitePreview demo={d} />
                    </PhoneFrame>
                    <p className="mt-4 text-center font-display text-xl">{d.title}</p>
                    <p className="text-center text-xs text-stone">{d.style}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CustomDesign what={service.category === "Moment" ? "page" : "invitation"} />
      {service.category === "Moment" ? <MomentPackages tone="ivory" /> : <Packages />}
      <Cta />
    </>
  );
}
