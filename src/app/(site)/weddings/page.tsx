import type { Metadata } from "next";
import { services } from "@/lib/content";
import { ServicePage } from "@/components/sections/ServicePage";

const service = services.find((s) => s.slug === "weddings")!;

export const metadata: Metadata = { title: service.title, description: service.intro };

export default function Page() {
  return <ServicePage service={service} />;
}
