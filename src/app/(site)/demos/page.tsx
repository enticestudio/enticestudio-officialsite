import type { Metadata } from "next";
import Link from "next/link";
import { demos } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { InvitePreview, PhoneFrame } from "@/components/ui/InvitePreview";
import { Cta } from "@/components/sections/Cta";

export const metadata: Metadata = {
  title: "Live demos",
  description: "Open our demo invitations on your phone and try the RSVP.",
};

export default function DemosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Live demos"
        title="Open one on your *phone.*"
        intro="Each demo is a working invitation with fictional names. Pick a style you love — we'll make it yours."
      />
      <section className="py-24 md:py-32">
        <div className="container-x grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-3 md:gap-x-12">
          {demos.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 3) * 0.1} className={i % 3 === 1 ? "md:mt-20" : ""}>
              <Link href={`/demos/${d.slug}`} className="group block">
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
      </section>
      <Cta />
    </>
  );
}
