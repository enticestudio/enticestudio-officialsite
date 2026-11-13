import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Packages } from "@/components/sections/Packages";
import { Cta } from "@/components/sections/Cta";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Invitation websites from $129, RSVP websites from $249 and Signature websites from $449.",
};

const addOns = [
  ["Custom domain", "$35 setup + actual registration cost"],
  ["Additional revision", "$20–35"],
  ["Second language", "+$49–99"],
  ["Additional event section", "+$39–79"],
  ["Personalised guest links", "+$49–99 per 100 guests"],
  ["Matching save-the-date & thank-you", "+$49–89"],
  ["Matching motion video", "+$59–89"],
  ["Guest photo-upload gallery", "$49–99 setup"],
  ["Seating chart", "$49–149"],
  ["Issued QR passes", "From $299"],
  ["Rush delivery", "+40–60%, subject to capacity"],
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Clear packages, *no surprises.*"
        intro="Every package includes design, setup, phone testing and hosting for a fixed term. Delivery times start once we have your complete content."
      />
      <Packages />
      <section className="py-24 md:py-32">
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow text-stone">Add-ons</p>
            <h2 className="mt-5 font-display text-5xl leading-none">
              Make it <span className="font-accent italic">yours.</span>
            </h2>
            <p className="mt-6 max-w-sm text-ink-soft">
              Domain registration renews yearly — we&apos;ll tell you the renewal cost up front. Payment-processing,
              messaging and ticket-platform fees are separate.
            </p>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {addOns.map(([name, price], i) => (
              <Reveal key={name} delay={i * 0.03}>
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="font-display text-xl">{name}</dt>
                  <dd className="text-right text-sm text-ink-soft">{price}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
      <Cta />
    </>
  );
}
