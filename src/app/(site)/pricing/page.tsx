import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { MomentPackages, Packages } from "@/components/sections/Packages";
import { Cta } from "@/components/sections/Cta";
import { CustomDesign } from "@/components/sections/CustomDesign";
import { Reveal } from "@/components/motion/Reveal";
import { CurrencyToggle, Price } from "@/components/currency/Currency";
import { prices, ranges } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Invitation websites from Rs 3,999, RSVP websites from Rs 6,999 and Signature websites from Rs 11,999. Personal Moments pages from Rs 4,999.",
};

// Prices come from lib/pricing.ts and follow the visitor's USD / LKR choice.
const addOns: { name: string; price?: React.ReactNode; note?: string }[] = [
  { name: "Custom domain", price: <Price value={prices.domainSetup} suffix=" setup" />, note: "+ actual registration cost" },
  { name: "Additional revision", price: <Price value={ranges.revision} /> },
  { name: "Second language", price: <Price value={ranges.secondLanguage} prefix="+" /> },
  { name: "Additional event section", price: <Price value={ranges.extraEvent} prefix="+" /> },
  { name: "Personalised guest links", price: <Price value={ranges.guestLinks} prefix="+" />, note: "per 100 guests" },
  { name: "Matching save-the-date & thank-you", price: <Price value={ranges.matchingSet} prefix="+" /> },
  { name: "Matching motion video", price: <Price value={ranges.matchingVideo} prefix="+" /> },
  { name: "Guest photo-upload gallery", price: <Price value={ranges.photoGallery} suffix=" setup" /> },
  { name: "Seating chart", price: <Price value={ranges.seatingChart} /> },
  { name: "Issued QR passes", price: <Price value={prices.qrPasses} prefix="From " /> },
  { name: "Rush delivery", note: "+40–60%, subject to capacity" },
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
      <MomentPackages />
      <CustomDesign what="invitation or page" />
      <section className="py-24 md:py-32">
        <div className="container-x grid gap-12 md:grid-cols-[1fr_1.5fr]">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow text-stone">Add-ons</p>
              <CurrencyToggle />
            </div>
            <h2 className="mt-5 font-display text-5xl leading-none">
              Make it <span className="font-accent italic">yours.</span>
            </h2>
            <p className="mt-6 max-w-sm text-ink-soft">
              Domain registration renews yearly — we&apos;ll tell you the renewal cost up front. Payment-processing,
              messaging and ticket-platform fees are separate.
            </p>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {addOns.map(({ name, price, note }, i) => (
              <Reveal key={name} delay={i * 0.03}>
                <div className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="font-display text-xl">{name}</dt>
                  <dd className="text-right text-sm text-ink-soft">
                    {price}
                    {price && note && " "}
                    {note}
                  </dd>
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
