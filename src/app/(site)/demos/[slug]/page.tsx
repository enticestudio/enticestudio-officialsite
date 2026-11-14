import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findDesign, designs } from "@/lib/invitations";
import { PhoneViewer } from "@/components/demo/PhoneViewer";

export function generateStaticParams() {
  return designs.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/demos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const inv = findDesign(slug);
  return inv ? { title: `${inv.title} demo`, description: `${inv.style}. Open the live demo invitation.` } : {};
}

export default function Page({ params }: PageProps<"/demos/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <Viewer params={params} />
    </Suspense>
  );
}

async function Viewer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = designs.findIndex((d) => d.slug === slug);
  if (i < 0) notFound();
  const n = designs.length;
  return <PhoneViewer inv={designs[i]} prev={designs[(i - 1 + n) % n]} next={designs[(i + 1) % n]} />;
}
