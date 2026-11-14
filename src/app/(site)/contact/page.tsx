import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { QuoteForm } from "./QuoteForm";
import { whatsappLink } from "@/lib/contact";
import { WhatsAppButton } from "@/components/contact/WhatsApp";
import { SocialIcons } from "@/components/contact/SocialIcons";

export const metadata: Metadata = {
  title: "Get a quote",
  description: "Tell us about your event or moment and get a clear quote within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get a quote"
        title="Tell us about your *day.*"
        intro="A few details are all we need to recommend the right package and give you a fixed price."
      />
      <section className="py-20 md:py-28">
        <div className="container-x max-w-4xl">
          {whatsappLink() && (
            <div className="mb-16 flex flex-col gap-5 rounded-2xl bg-ivory p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <p className="font-display text-2xl">Rather just chat?</p>
                <p className="mt-1 text-sm text-ink-soft">Send us a WhatsApp message with your date and the style you like.</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <WhatsAppButton />
                <SocialIcons />
              </div>
            </div>
          )}
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
