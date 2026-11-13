import Link from "next/link";
import { demos, type Service } from "@/lib/content";
import { PageHeader } from "./PageHeader";
import { Packages } from "./Packages";
import { Cta } from "./Cta";
import { Reveal } from "@/components/motion/Reveal";
import { InvitePreview, PhoneFrame } from "@/components/ui/InvitePreview";

export function ServicePage({ service }: { service: Service }) {
  const picks = demos.filter((d) => service.demoSlugs.includes(d.slug));
  return (
    <>
      <PageHeader eyebrow={service.kicker} title={`${service.title}, *beautifully* sent.`} intro={service.intro} />

      <section className="py-24 md:py-32">
        <div className="container-x grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div>
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
            <p className="mt-6 text-sm text-stone">{service.range} · quoted by design effort, guest count and number of events.</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {picks.map((d, i) => (
              <Reveal key={d.slug} delay={i * 0.1} className={i % 2 ? "mt-16" : ""}>
                <Link href={`/demos/${d.slug}`} className="group block">
                  <PhoneFrame className="transition-transform duration-500 group-hover:-translate-y-2">
                    <InvitePreview demo={d} />
                  </PhoneFrame>
                  <p className="mt-4 text-center font-display text-xl">{d.title}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Packages />
      <Cta />
    </>
  );
}
