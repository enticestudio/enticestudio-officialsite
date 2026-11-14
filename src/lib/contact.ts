/**
 * Public contact details and social accounts. Set them in .env.local (see .env.example).
 * NEXT_PUBLIC_ values are baked in at build time, so restart dev / rebuild after changing them.
 *
 * On the live site, anything left empty is hidden. In `npm run dev`, empty ones still show
 * (with "#" links) so you can see the design before filling them in.
 */

/** Where every "custom design" button points; the quote form then preselects "Fully custom". */
export const customDesignHref = "/contact?design=custom";

export const isDevPreview = process.env.NODE_ENV === "development";

/** International format, digits only, e.g. 94771234567 for a Sri Lankan 077 number. */
export const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

export const defaultWhatsappMessage = "Hi Entice Studio! I'd like to ask about a design.";

/** A wa.me link that opens WhatsApp (app or web) with an optional pre-filled message. Null when no number is set. */
export function whatsappLink(message: string = defaultWhatsappMessage): string | null {
  if (!whatsappNumber) return isDevPreview ? "#whatsapp-not-set" : null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export type SocialKey = "instagram" | "tiktok" | "facebook";

export type Social = {
  key: SocialKey;
  name: string;
  url: string;
  handle: string;
  blurb: string;
  /** false while previewing in dev without a URL set */
  configured: boolean;
};

// Each process.env reference must be written out in full so Next can inline it.
const urls: Record<SocialKey, string> = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
};

const meta: Record<SocialKey, { name: string; blurb: string }> = {
  instagram: { name: "Instagram", blurb: "New designs and real client invites" },
  tiktok: { name: "TikTok", blurb: "Openings in motion, a few seconds at a time" },
  facebook: { name: "Facebook", blurb: "Offers, news and happy-client stories" },
};

/** "https://instagram.com/entice.studio/" → "@entice.studio"; Facebook profile.php links fall back to the studio name. */
function handleFrom(url: string) {
  try {
    const seg = new URL(url).pathname.split("/").filter(Boolean)[0];
    if (!seg || seg.includes(".php")) return "Entice Studio";
    return seg.startsWith("@") ? seg : `@${seg}`;
  } catch {
    return "Entice Studio";
  }
}

export const socials: Social[] = (Object.keys(meta) as SocialKey[]).flatMap((key) => {
  const url = urls[key].trim();
  if (!url && !isDevPreview) return [];
  return [
    {
      key,
      ...meta[key],
      url: url || `#${key}-not-set`,
      handle: url ? handleFrom(url) : "@your-handle",
      configured: Boolean(url),
    },
  ];
});


/** Open real links in a new tab; dev "#…-not-set" placeholders stay put. */
export const externalProps = (href: string) =>
  href.startsWith("http") ? ({ target: "_blank", rel: "noopener noreferrer" } as const) : {};
