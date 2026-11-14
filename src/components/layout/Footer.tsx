import Link from "next/link";
import { Wordmark } from "./Logo";
import { externalProps, socials, whatsappLink } from "@/lib/contact";
import { BrandIcon } from "@/components/contact/BrandIcon";
import { SocialIcons } from "@/components/contact/SocialIcons";

const cols = [
  {
    title: "Studio",
    links: [
      { href: "/weddings", label: "Weddings" },
      { href: "/celebrations", label: "Celebrations" },
      { href: "/business-events", label: "Business events" },
      { href: "/moments", label: "Moments" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/demos", label: "Live demos" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Get a quote" },
    ],
  },
];

const link = "inline-flex items-center gap-2.5 text-paper/85 transition-colors hover:text-champagne";

export function Footer() {
  const wa = whatsappLink();
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x grid grid-cols-2 gap-x-8 gap-y-14 py-20 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 space-y-6 md:col-span-1">
          <Wordmark tone="white" className="w-44" />
          <p className="max-w-xs font-accent text-xl italic text-paper/70">A beautiful beginning to every gathering.</p>
          <SocialIcons tone="light" />
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-5 text-paper/50">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {(wa || socials.length > 0) && (
          <div>
            <p className="eyebrow mb-5 text-paper/50">Say hello</p>
            <ul className="space-y-3">
              {wa && (
                <li>
                  <a href={wa} {...externalProps(wa)} className={link}>
                    <BrandIcon brand="whatsapp" className="size-4" /> WhatsApp
                  </a>
                </li>
              )}
              {socials.map((s) => (
                <li key={s.key}>
                  <a href={s.url} {...externalProps(s.url)} className={link}>
                    <BrandIcon brand={s.key} className="size-4" /> {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-paper/10 py-6 text-xs text-paper/50 sm:flex-row">
        {/* Static year: Cache Components prerenders pages, so avoid reading the clock at render time. */}
        <p>© 2026 Entice Studio. All rights reserved.</p>
        <p>Invitations, moments &amp; custom designs · Worldwide</p>
      </div>
    </footer>
  );
}
