import type { Metadata } from "next";
import Link from "next/link";
import { demos } from "@/lib/content";
import { designsIn, type Category } from "@/lib/invitations";
import { NewBadge } from "@/components/ui/NewBadge";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { InvitePreview, PhoneFrame } from "@/components/ui/InvitePreview";
import { Cta } from "@/components/sections/Cta";
import { CustomDesign } from "@/components/sections/CustomDesign";

export const metadata: Metadata = {
  title: "Live demos",
  description: "Open our demo invitations and personal pages on your phone.",
};

const groups: { category: Category; id: string; title: string; blurb: string }[] = [
  { category: "Wedding", id: "weddings", title: "Weddings", blurb: "Doors, curtains, scrolls and gold — an opening for every kind of wedding." },
  { category: "Celebration", id: "celebrations", title: "Celebrations", blurb: "Birthdays, baby showers and family milestones, made to make guests smile." },
  { category: "Business", id: "business", title: "Business events", blurb: "Launches, openings and conferences with a brand-worthy first impression." },
  { category: "Moment", id: "moments", title: "Moments", blurb: "Proposals, Valentine's, birthday surprises, graduations and tributes: pages made for one person." },
];

export default function DemosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Live demos"
        title="Open one on your *phone.*"
        intro="Each demo is a working page with fictional names. Pick a style you love and we'll make it yours, or we'll design one from scratch just for you."
      />

      {/* category jump links */}
      <nav aria-label="Demo categories" className="container-x mt-12 flex flex-wrap gap-3">
        {groups.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="rounded-full border border-line px-5 py-2.5 text-sm transition-colors hover:bg-ink hover:text-paper">
            {g.title} <span className="text-stone">· {demos.filter((d) => d.category === g.category).length}</span>
          </a>
        ))}
      </nav>

      {groups.map((g) => {
        const list = designsIn(g.category); // newest first
        return (
          <section key={g.id} id={g.id} className="scroll-mt-24 py-20 md:py-28">
            <div className="container-x">
              <Reveal className="mb-14 flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
                <h2 className="font-display text-5xl leading-none md:text-6xl">{g.title}</h2>
                <p className="max-w-sm text-ink-soft">{g.blurb}</p>
              </Reveal>
              <div className="grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-3 md:gap-x-12">
                {list.map((d, i) => (
                  <Reveal key={d.slug} delay={(i % 3) * 0.1} className={i % 3 === 1 ? "md:mt-20" : ""}>
                    <Link href={`/demos/${d.slug}`} className="group relative block">
                      {d.isNew && <NewBadge className="absolute right-0 top-0 z-10 md:right-6" />}
                      <PhoneFrame className="mx-auto max-w-72 transition-transform duration-500 group-hover:-translate-y-3 group-hover:rotate-1">
                        <InvitePreview demo={d} />
                      </PhoneFrame>
                      <div className="mt-5 text-center">
                        <p className="font-display text-2xl">{d.title}</p>
                        <p className="text-sm text-ink-soft">{d.style}</p>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}
      <CustomDesign tone="ivory" what="invitation or page" />
      <Cta />
    </>
  );
}
