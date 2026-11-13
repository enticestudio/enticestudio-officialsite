// Single source of truth for site copy. Prices come from the launch plan (bussines.md §5).

export type Package = {
  id: string;
  name: string;
  price: number;
  blurb: string;
  features: string[];
  delivery: string;
  featured?: boolean;
};

export const websitePackages: Package[] = [
  {
    id: "essential",
    name: "Essential Website",
    price: 129,
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
    price: 249,
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
    price: 449,
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

export const smallProducts = [
  { name: "Digital Card", price: 49, blurb: "Mobile and print-ready design, one revision." },
  { name: "Motion Invite", price: 89, blurb: "A 15–30 second animated invitation." },
];

// Demo invitations live in ./invitations.ts (full data for the working demos).
export { invitations as demos, type Invitation as Demo } from "./invitations";

export type Service = {
  slug: "weddings" | "celebrations" | "business-events";
  title: string;
  kicker: string;
  intro: string;
  occasions: string[];
  range: string;
  demoSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "weddings",
    title: "Weddings",
    kicker: "From save-the-date to thank-you",
    intro:
      "Invitation websites for one day or a whole wedding weekend — ceremony, reception, homecoming and every event between, with RSVPs collected in one place.",
    occasions: ["Ceremony & reception", "Homecoming", "Engagement", "Mehendi & sangeet", "Destination weekends", "Save-the-dates"],
    range: "From $129",
    demoSlugs: ["kandyan-gold", "ivory-envelope", "velvet-curtain", "botanical"],
  },
  {
    slug: "celebrations",
    title: "Celebrations",
    kicker: "Every milestone deserves a beginning",
    intro:
      "Birthdays, baby showers, anniversaries, naming ceremonies and family reunions — invitations your guests can open, save and reply to in seconds.",
    occasions: ["Milestone birthdays", "Baby showers", "Anniversaries", "Naming ceremonies", "Reunions", "Religious & cultural rites"],
    range: "From $89",
    demoSlugs: ["birthday", "botanical"],
  },
  {
    slug: "business-events",
    title: "Business Events",
    kicker: "Openings, launches and gatherings",
    intro:
      "Branded event pages for shop openings, product launches, staff parties and networking nights, with RSVP lists and optional issued QR passes.",
    occasions: ["Grand openings", "Product launches", "Corporate dinners", "Awards nights", "Workshops", "VIP previews"],
    range: "From $129",
    demoSlugs: ["grand-opening", "ivory-envelope"],
  },
];

export const process = [
  { title: "Choose a style", body: "Pick a package and a design direction from our demos, then send your details through one simple form." },
  { title: "Secure your date", body: "A deposit reserves your slot. Small card orders are paid upfront." },
  { title: "Review your proof", body: "We send a private preview with your real content — names, dates, venue and schedule." },
  { title: "Approve & polish", body: "You confirm spelling, times and time zone in writing; we apply your consolidated revisions." },
  { title: "Launch & share", body: "Tested on real phones, RSVP checked, then published. You get a link ready for WhatsApp, email or social." },
];

export const faqs = [
  { q: "Do my guests need to download an app?", a: "No. Your invitation is a fast mobile web page — guests just tap the link." },
  { q: "Can I use my own domain?", a: "Yes. A custom domain is an optional upgrade: a $35 setup fee plus the actual first-year registration cost. Your standard invitation lives on a clean Entice Studio link." },
  { q: "What counts as a revision?", a: "One consolidated list of changes within the approved design. A new design direction or an extra event is new scope." },
  { q: "How long is my site online?", a: "Six months for Essential and twelve months for RSVP and Signature. Extra years can be added." },
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
];
