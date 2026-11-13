import Link from "next/link";
import { Wordmark } from "./Logo";

const cols = [
  {
    title: "Studio",
    links: [
      { href: "/weddings", label: "Weddings" },
      { href: "/celebrations", label: "Celebrations" },
      { href: "/business-events", label: "Business events" },
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

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x grid gap-14 py-20 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-6">
          <Wordmark tone="white" className="w-44" />
          <p className="max-w-xs font-accent text-xl italic text-paper/70">A beautiful beginning to every gathering.</p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-5 text-paper/50">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/85 transition-colors hover:text-champagne">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x flex flex-col justify-between gap-2 border-t border-paper/10 py-6 text-xs text-paper/50 sm:flex-row">
        {/* Static year: Cache Components prerenders pages, so avoid reading the clock at render time. */}
        <p>© 2026 Entice Studio. All rights reserved.</p>
        <p>Digital invitations &amp; event passes · Worldwide</p>
      </div>
    </footer>
  );
}
