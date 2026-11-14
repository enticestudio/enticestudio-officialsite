import { siFacebook, siInstagram, siTiktok, siWhatsapp } from "simple-icons";

const icons = { whatsapp: siWhatsapp, instagram: siInstagram, tiktok: siTiktok, facebook: siFacebook };

export type Brand = keyof typeof icons;

/** Official brand glyphs (from Simple Icons), drawn in currentColor. */
export function BrandIcon({ brand, className = "size-5" }: { brand: Brand; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d={icons[brand].path} />
    </svg>
  );
}
