import type { Category } from "./invitations";
import { prices, type Money } from "./pricing";

// Single source of truth for site copy. Prices live in ./pricing.ts.

export type Package = {
  id: string;
  name: string;
  price: Money;
  blurb: string;
  features: string[];
  delivery: string;
  featured?: boolean;
};

export const websitePackages: Package[] = [
  {
    id: "essential",
    name: "Essential Website",
    price: prices.essential,
    blurb: "A beautiful one-event page, ready to share.",
    features: [
      "Template styling in your colours",
      "Schedule, map link and gallery",
      "Add-to-calendar and WhatsApp contact",
      "Social-preview image",
      "One revision · 6 months hosting",
    ],
    delivery: "2–3 business days",
  },
  {
    id: "rsvp",
    name: "RSVP Website",
    price: prices.rsvp,
    blurb: "Everything in Essential, plus guest replies handled for you.",
    features: [
      "RSVP for up to 300 named invitees",
      "Meal and attendance questions",
      "Guest-list export",
      "Two revisions · 12 months hosting",
    ],
    delivery: "3–5 business days",
    featured: true,
  },
  {
    id: "signature",
    name: "Signature Website",
    price: prices.signature,
    blurb: "A custom visual treatment for multi-event celebrations.",
    features: [
      "Custom look built on proven modules",
      "Up to three event sections",
      "RSVP for up to 500 invitees",
      "Three revisions · 12 months hosting",
    ],
    delivery: "5–7 business days",
  },
];

/** Personal "moment" pages: proposals, Valentine's, birthdays, graduations, memorials. */
export const momentPackages: Package[] = [
  {
    id: "moment",
    name: "Moment Page",
    price: prices.moment,
    blurb: "A personal page from one of our designs, made in a day or two.",
    features: [
      "Any of our Moments designs, in your colours",
      "Up to 6 sections and 10 photos",
      "Your song, starting on the first tap",
      "Private link, hidden from search engines",
      "One revision · 12 months online",
    ],
    delivery: "1–2 business days",
  },
  {
    id: "moment-premium",
    name: "Moment Premium",
    price: prices.momentPremium,
    blurb: "More story, more photos, and touches made just for them.",
    features: [
      "Everything in Moment Page",
      "Up to 25 photos and a video message",
      "Custom colours, wording and opening touches",
      "Extra sections: flip cards, the big question, candles",
      "Two revisions · 24 months online",
    ],
    delivery: "2–4 business days",
    featured: true,
  },
];

export const smallProducts = [
  { name: "Digital Card", price: prices.card, blurb: "Mobile and print-ready design, one revision." },
  { name: "Motion Invite", price: prices.motion, blurb: "A 15–30 second animated invitation." },
];

// Demo invitations live in ./invitations.ts (full data for the working demos).
export { designs as demos, type Design as Demo } from "./invitations";

/**
 * Optional looping background film for the home page hero, behind the 3D envelope.
 * Put the files in public/hero/ and fill this in, e.g.
 *   { mp4: "/hero/hero.mp4", webm: "/hero/hero.webm", mobileMp4: "/hero/hero-portrait.mp4", poster: "/hero/hero-poster.jpg" }
 * Leave it null for the plain cream background.
 */
export const heroVideo: { mp4: string; webm?: string; mobileMp4?: string; poster?: string } | null = { mp4: "/hero/hero.mp4", poster: "/hero/hero-poster1.jpg" };

/** The live phones in the home page gallery, in order. Swap slugs to feature others. */
export const homeShowcaseSlugs = ["christmas-wishes", "kandyan-gold", "ivory-envelope", "velvet-curtain", "the-question", "birthday", "grand-opening"];

export type Service = {
  slug: "weddings" | "celebrations" | "business-events" | "moments";
  title: string;
  kicker: string;
  intro: string;
  occasions: string[];
  /** "From …" starting price shown on cards. */
  from: Money;
  /** Short line after the "From …" price on the service page. */
  priceNote: string;
  /** Every demo with this category is shown on the page automatically. */
  category: Category;
  /** Matching section on the /demos page */
  demosAnchor: string;
};

export const services: Service[] = [
  {
    slug: "weddings",
    title: "Weddings",
    kicker: "From save-the-date to thank-you",
    intro:
      "Invitation websites for one day or a whole wedding weekend — ceremony, reception, homecoming and every event between, with RSVPs collected in one place.",
    occasions: ["Ceremony & reception", "Homecoming", "Engagement", "Mehendi & sangeet", "Destination weekends", "Save-the-dates"],
    from: prices.essential,
    priceNote: "quoted by design effort, guest count and number of events.",
    category: "Wedding",
    demosAnchor: "weddings",
  },
  {
    slug: "celebrations",
    title: "Celebrations",
    kicker: "Every milestone deserves a beginning",
    intro:
      "Birthdays, baby showers, anniversaries, naming ceremonies and family reunions — invitations your guests can open, save and reply to in seconds.",
    occasions: ["Milestone birthdays", "Baby showers", "Anniversaries", "Naming ceremonies", "Reunions", "Religious & cultural rites"],
    from: prices.card,
    priceNote: "quoted by design effort, guest count and number of events.",
    category: "Celebration",
    demosAnchor: "celebrations",
  },
  {
    slug: "business-events",
    title: "Business Events",
    kicker: "Openings, launches and gatherings",
    intro:
      "Branded event pages for shop openings, product launches, staff parties and networking nights, with RSVP lists and optional issued QR passes.",
    occasions: ["Grand openings", "Product launches", "Corporate dinners", "Awards nights", "Workshops", "VIP previews"],
    from: prices.essential,
    priceNote: "quoted by design effort, guest count and number of events.",
    category: "Business",
    demosAnchor: "business",
  },
  {
    slug: "moments",
    title: "Moments",
    kicker: "Made for one person",
    intro:
      "Personal pages that are the gift: a proposal, a Valentine's surprise, a birthday at midnight, a graduation to remember, or a gentle tribute to someone you've lost.",
    occasions: ["Proposals", "Valentine's Day", "Birthday surprises", "Christmas wishes", "Anniversaries", "Graduation & farewell", "Memorials & tributes"],
    from: prices.moment,
    priceNote: "ready in a day or two, on a private link.",
    category: "Moment",
    demosAnchor: "moments",
  },
];

export const process = [
  { title: "Choose or imagine", body: "Pick a design from our demos, or describe your own idea and we'll design it from scratch. Then send your details through one simple form." },
  { title: "Secure your date", body: "A deposit reserves your slot. Small card orders are paid upfront." },
  { title: "Review your proof", body: "We send a private preview with your real content — names, dates, venue and schedule." },
  { title: "Approve & polish", body: "You confirm spelling, times and time zone in writing; we apply your consolidated revisions." },
  { title: "Launch & share", body: "Tested on real phones, RSVP checked, then published. You get a link ready for WhatsApp, email or social." },
];

export const faqs = [
  { q: "Do I have to choose one of your demos?", a: "No. The demos are a starting point. We can change any of them (colours, wording, sections, music) or design something completely new around your idea, theme or colours. Custom designs are quoted once we know what you have in mind." },
  { q: "Do my guests need to download an app?", a: "No. Your invitation is a fast mobile web page — guests just tap the link." },
  { q: "Can I use my own domain?", a: "Yes. A custom domain is an optional upgrade: a {domainSetup} setup fee plus the actual first-year registration cost. Your standard invitation lives on a clean Entice Studio link." },
  { q: "What counts as a revision?", a: "One consolidated list of changes within the approved design. A new design direction or an extra event is new scope." },
  { q: "How long is my site online?", a: "Six months for Essential and twelve months for RSVP and Signature. Extra years can be added." },
  { q: "Do you make personal pages too?", a: "Yes. Our Moments pages are made for one person: proposals, Valentine's surprises, birthday wishes, graduations and memorial tributes. Each one lives on a private link that search engines can't find, from {moment}." },
  { q: "Can you write in two languages?", a: "Yes — bilingual wording is an add-on. You supply the approved translation, or we can arrange professional translation." },
  { q: "Where are you based?", a: "We're a remote studio working with couples and hosts worldwide. Delivery times start once we have your complete content." },
];

export const occasionsMarquee = [
  "Weddings",
  "Homecomings",
  "Birthdays",
  "Baby Showers",
  "Grand Openings",
  "Product Launches",
  "Anniversaries",
  "Galas",
  "Engagements",
  "Award Nights",
  "Proposals",
  "Valentine's",
  "Graduations",
  "Tributes",
];
