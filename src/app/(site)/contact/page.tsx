import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { QuoteForm } from "./QuoteForm";

export const metadata: Metadata = {
  title: "Get a quote",
  description: "Tell us about your event and get a clear quote within one business day.",
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
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
