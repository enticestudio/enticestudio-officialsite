import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findDesign, designs } from "@/lib/invitations";
import { InvitationView } from "@/components/invite/InvitationView";

/**
 * The invitation itself — what a guest opens from WhatsApp.
 * Demos live here today; real client invitations will use the same route.
 */
export function generateStaticParams() {
  return designs.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/i/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const inv = findDesign(slug);
  if (!inv) return {};
  return {
    title: { absolute: `${inv.names.join(" & ")} · ${inv.occasion}` },
    description: inv.kind === "moment" ? "Made just for you. Tap to open." : `${inv.dateLabel} · ${inv.venue.name}. Tap to open your invitation.`,
    robots: { index: false, follow: false },
  };
}

export default function Page({ params }: PageProps<"/i/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-ink" />}>
      <Invitation params={params} />
    </Suspense>
  );
}

async function Invitation({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = findDesign(slug);
  if (!inv) notFound();
  return <InvitationView inv={inv} />;
}
