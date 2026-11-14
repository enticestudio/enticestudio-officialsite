// ─────────────────────────────────────────────────────────────────────────────
// Invitation data. Every demo (and, later, every client invitation) is just one
// of these objects — the same components render all of them.
//
// Personal "moment" pages live in ./moments.ts and are built from sections.
//
// Media files are optional. Drop them into public/demos/<slug>/ and reference
// them here; until then each style falls back to its code-drawn version.
// Names and details below are fictional.
// ─────────────────────────────────────────────────────────────────────────────

import { moments } from "./moments";

export type OpeningType =
  | "envelope"
  | "curtain"
  | "doors"
  | "deco" // gold art-deco lines draw in, panels slide apart
  | "scroll" // parchment scroll unrolls
  | "giftbox" // lid pops off, confetti bursts
  | "balloons" // balloons float away
  | "ticket" // "admit one" ticket tears
  | "iris" // circular reveal from the centre
  | "loveletter" // envelope with a heart seal
  | "ringbox" // velvet ring box opens
  | "caps" // graduation caps thrown into the air
  | "candle"; // tap to light a candle

export type Category = "Wedding" | "Celebration" | "Business" | "Moment";

/** Everything the openings, phone viewer and demo cards need, shared by invitations and moments. */
type DesignBase = {
  slug: string;
  title: string;
  style: string; // one-line description for cards
  category: Category;
  occasion: string; // small caps label

  theme: {
    bg: string; // page background
    surface: string; // cards / alternating bands
    fg: string; // text
    accent: string; // gold, red, etc.
    onAccent: string; // text on accent buttons
    curtain?: string; // curtain fabric colour
    door?: string; // door panel colour
    velvet?: string; // ring box colour
    namesFont: "script" | "display" | "sans";
  };

  opening: {
    type: OpeningType; // code-drawn opening (also the fallback)
    /** Optional opening video, e.g. "/demos/kandyan-gold/opening.mp4". Plays instead of the code opening. */
    video?: string;
    /** First frame of the video, shown before the tap. */
    poster?: string;
  };

  /** Line on the tap-to-open cover. "{guest}" is replaced by the name in the link (?guest=…). Default "Dear {guest},". */
  greeting?: string;
  /** Cover line when the link has no name. Default "Dear Guest,". */
  greetingDefault?: string;
  /** Default "Tap to open". */
  tapLabel?: string;

  /** Optional licensed music track. Starts on the first tap. */
  music?: string;
  particles: "petals" | "sparkles" | "confetti" | "bubbles" | "hearts" | "embers" | "none";
  names: string[]; // 1 name for birthdays/businesses/moments, 2 for couples
  /** Sample name used in the phone demo. */
  sampleGuest: string;
  /** Shows a "New" badge and lists the design first in its category. */
  isNew?: boolean;
  /**
   * Image of the starting ("tap to open") screen, shown in the phone cards.
   * Regenerate with `npm run covers` after changing a design.
   */
  cover?: string;
};

/** An event invitation: fixed layout with countdown, events, venue, calendar and RSVP. */
export type Invitation = DesignBase & {
  kind?: "invitation";
  /** Optional looping hero background (muted video) or image. */
  heroVideo?: string;
  heroImage?: string;
  ornament: "mandala" | "arch" | "botanical" | "deco" | "lotus" | "clouds" | "grid" | "none";

  intro: string;
  localNames?: string; // optional second-language line (e.g. Sinhala)
  /** ISO date with time-zone offset — drives the countdown and calendar links. */
  start: string;
  dateLabel: string;
  timeLabel: string;
  venue: { name: string; address: string };
  hashtag?: string;

  story?: { year: string; title: string; text: string }[];
  events: { name: string; date: string; time: string; place: string; note?: string }[];
  /** Heading for the events section, e.g. "Agenda". */
  eventsTitle?: string;
  gallery?: string[];
  rsvpBy: string;
  closing: string;
};

/**
 * A personal page made for one person or one memory (proposal, Valentine's, birthday,
 * graduation, memorial). Built from a list of sections, in any order.
 */
export type Moment = DesignBase & {
  kind: "moment";
  blocks: Block[];
};

export type Design = Invitation | Moment;

/** Sections a moment page can be built from. Each renders in src/components/invite/MomentBlocks.tsx. */
export type Block =
  | { type: "hero"; eyebrow: string; title: string; subtitle?: string; note?: string; art?: "ring" | "heart" | "cap" | "candle" | "cake" }
  | { type: "timeline"; heading: string; items: { date: string; title: string; text: string }[] }
  | { type: "photos"; heading: string; items: { src?: string; caption: string }[] }
  | { type: "letter"; heading: string; paragraphs: string[]; signoff: string }
  | { type: "reasons"; heading: string; items: string[] }
  | { type: "question"; question: string; yes: string; no: string; success: string; successText: string }
  | { type: "countdown"; heading: string; to: string; doneText: string }
  | { type: "cake"; heading: string; candles: number; doneText: string }
  | { type: "messages"; heading: string; items: { from: string; text: string }[] }
  | { type: "quote"; text: string; by?: string }
  | { type: "details"; heading: string; items: { title: string; when: string; where: string; note?: string }[] }
  | { type: "guestbook"; heading: string; candlesLit: number; entries: { from: string; text: string }[] }
  | { type: "closing"; text: string; signoff: string };

const invitations: Invitation[] = [
  {
    slug: "kandyan-gold",
    cover: "/demos/kandyan-gold/cover.jpg",
    title: "Kandyan Gold",
    style: "Temple doors, gold and marigolds",
    category: "Wedding",
    occasion: "Poruwa Ceremony",
    theme: {
      bg: "#3b0d14",
      surface: "#4d1520",
      fg: "#f7e7c6",
      accent: "#d9b064",
      onAccent: "#3b0d14",
      door: "#6b1a24",
      namesFont: "script",
    },
    opening: {
      type: "doors",
      // video: "/demos/kandyan-gold/opening.mp4",
      // poster: "/demos/kandyan-gold/poster.jpg",
    },
    music: "/demos/placeholder-music.wav",
    particles: "petals",
    ornament: "mandala",
    intro: "With the blessings of our parents, we joyfully invite you to celebrate the wedding of",
    names: ["Nethmi", "Kavin"],
    localNames: "නෙත්මි  ·  කවින්",
    start: "2027-04-17T09:30:00+05:30",
    dateLabel: "Saturday, 17 April 2027",
    timeLabel: "Poruwa at 9.30 am",
    venue: { name: "The Grand Kandyan", address: "Peradeniya Road, Kandy, Sri Lanka" },
    hashtag: "#NethmiWedsKavin",
    story: [
      { year: "2019", title: "First hello", text: "A shared umbrella on a rainy afternoon in Kandy." },
      { year: "2022", title: "Two families", text: "Tea, nervous smiles and a lot of kiribath." },
      { year: "2026", title: "The proposal", text: "At sunrise, overlooking the lake where it all began." },
    ],
    events: [
      { name: "Poruwa Ceremony", date: "Sat, 17 April 2027", time: "9.30 am", place: "The Grand Kandyan", note: "Traditional attire welcome" },
      { name: "Wedding Lunch", date: "Sat, 17 April 2027", time: "12.30 pm", place: "Grand Ballroom" },
      { name: "Homecoming", date: "Sun, 25 April 2027", time: "7.00 pm", place: "Cinnamon Lakeside, Colombo" },
    ],
    rsvpBy: "15 March 2027",
    closing: "Your presence is the greatest blessing we could ask for.",
    sampleGuest: "Mr & Mrs Perera",
  },
  {
    slug: "ivory-envelope",
    cover: "/demos/ivory-envelope/cover.jpg",
    title: "Ivory Envelope",
    style: "A wax-sealed envelope that opens for each guest",
    category: "Wedding",
    occasion: "Wedding Celebration",
    theme: {
      bg: "#f6f0e6",
      surface: "#efe5d5",
      fg: "#2b2420",
      accent: "#a8824d",
      onAccent: "#fbf8f3",
      namesFont: "script",
    },
    opening: { type: "envelope" },
    music: "/demos/placeholder-music.wav",
    particles: "sparkles",
    ornament: "botanical",
    intro: "Together with their families",
    names: ["Anna", "Daniel"],
    start: "2027-06-12T14:00:00+01:00",
    dateLabel: "Saturday, 12 June 2027",
    timeLabel: "Ceremony at 2 pm",
    venue: { name: "Aynhoe Park", address: "Aynho, Banbury OX17 3BQ, United Kingdom" },
    hashtag: "#AnnaAndDanielSayIDo",
    story: [
      { year: "2018", title: "We met", text: "Opposite desks, one shared love of terrible puns." },
      { year: "2021", title: "First home", text: "A tiny flat, a big plant collection." },
      { year: "2026", title: "She said yes", text: "On a quiet walk along the Cotswold Way." },
    ],
    events: [
      { name: "Ceremony", date: "Sat, 12 June 2027", time: "2.00 pm", place: "The Orangery" },
      { name: "Drinks & Canapés", date: "Sat, 12 June 2027", time: "3.30 pm", place: "The Lawn" },
      { name: "Dinner & Dancing", date: "Sat, 12 June 2027", time: "6.00 pm", place: "The Great Hall" },
    ],
    rsvpBy: "1 May 2027",
    closing: "We can't wait to celebrate with you.",
    sampleGuest: "Sophie & James",
  },
  {
    slug: "velvet-curtain",
    cover: "/demos/velvet-curtain/cover.jpg",
    title: "Velvet Curtain",
    style: "Red velvet drapes part to reveal the day",
    category: "Wedding",
    occasion: "Wedding Celebration",
    theme: {
      bg: "#fbf1ec",
      surface: "#f4e1d9",
      fg: "#4a1018",
      accent: "#9e1b32",
      onAccent: "#fbf1ec",
      curtain: "#7d0f1d",
      namesFont: "script",
    },
    opening: { type: "curtain" },
    music: "/demos/placeholder-music.wav",
    particles: "petals",
    ornament: "arch",
    intro: "With joy in our hearts, we invite you to the wedding of",
    names: ["Priya", "Arjun"],
    start: "2027-02-20T18:00:00+04:00",
    dateLabel: "Saturday, 20 February 2027",
    timeLabel: "Evening ceremony at 6 pm",
    venue: { name: "Al Habtoor Palace", address: "Al Habtoor City, Dubai, UAE" },
    hashtag: "#PriyaArjunForever",
    events: [
      { name: "Mehendi", date: "Thu, 18 February 2027", time: "4.00 pm", place: "Garden Terrace" },
      { name: "Sangeet", date: "Fri, 19 February 2027", time: "7.30 pm", place: "Ballroom" },
      { name: "Wedding", date: "Sat, 20 February 2027", time: "6.00 pm", place: "Palace Lawn" },
    ],
    rsvpBy: "10 January 2027",
    closing: "Come for the vows, stay for the dancing.",
    sampleGuest: "The Fernando Family",
  },
  {
    slug: "botanical",
    cover: "/demos/botanical/cover.jpg",
    title: "Botanical",
    style: "Soft greens and garden florals",
    category: "Wedding",
    occasion: "Garden Wedding",
    theme: {
      bg: "#eef2e9",
      surface: "#e1e8d9",
      fg: "#2f3d2c",
      accent: "#6f8a5c",
      onAccent: "#f4f7f0",
      namesFont: "display",
    },
    opening: { type: "envelope" },
    particles: "petals",
    ornament: "botanical",
    intro: "Please join us as we say I do",
    names: ["Maya", "Theo"],
    start: "2027-05-22T15:00:00+10:00",
    dateLabel: "Saturday, 22 May 2027",
    timeLabel: "3 pm, garden ceremony",
    venue: { name: "Royal Botanic Garden", address: "Mrs Macquaries Rd, Sydney NSW 2000, Australia" },
    events: [
      { name: "Ceremony", date: "Sat, 22 May 2027", time: "3.00 pm", place: "Palm Grove" },
      { name: "Reception", date: "Sat, 22 May 2027", time: "5.30 pm", place: "The Calyx" },
    ],
    rsvpBy: "15 April 2027",
    closing: "Love, Maya & Theo",
    sampleGuest: "Olivia",
  },
  {
    slug: "birthday",
    cover: "/demos/birthday/cover.jpg",
    title: "Milestone Birthday",
    style: "Playful curtain-up party invite",
    category: "Celebration",
    occasion: "30th Birthday",
    theme: {
      bg: "#fbe3d9",
      surface: "#f6d2c4",
      fg: "#3b1e1a",
      accent: "#e2674a",
      onAccent: "#fff7f3",
      curtain: "#e2674a",
      namesFont: "display",
    },
    opening: { type: "curtain" },
    particles: "sparkles",
    ornament: "none",
    intro: "Drinks, dancing and questionable karaoke for",
    names: ["Leo turns 30"],
    start: "2027-04-03T19:00:00+01:00",
    dateLabel: "Saturday, 3 April 2027",
    timeLabel: "From 7 pm till late",
    venue: { name: "Rooftop at The Hoxton", address: "81 Great Eastern St, London EC2A 3HU" },
    events: [{ name: "Party", date: "Sat, 3 April 2027", time: "7.00 pm", place: "The Rooftop", note: "Dress code: something sparkly" }],
    rsvpBy: "20 March 2027",
    closing: "See you on the dance floor.",
    sampleGuest: "Sam",
  },
  {
    slug: "grand-opening",
    cover: "/demos/grand-opening/cover.jpg",
    title: "Grand Opening",
    style: "Bold brand launch, doors open at six",
    category: "Business",
    occasion: "Grand Opening",
    theme: {
      bg: "#0e0e0e",
      surface: "#1b1a19",
      fg: "#f6f1ea",
      accent: "#c8a97e",
      onAccent: "#0e0e0e",
      door: "#1f1d1b",
      namesFont: "sans",
    },
    opening: { type: "doors" },
    particles: "sparkles",
    ornament: "none",
    intro: "You're invited to the opening night of",
    names: ["Maison Rue"],
    start: "2027-03-12T18:00:00+00:00",
    dateLabel: "Friday, 12 March 2027",
    timeLabel: "Doors open at 6 pm",
    venue: { name: "Maison Rue", address: "12 Harbour Street, Edinburgh EH1 1AA" },
    events: [
      { name: "Ribbon cutting", date: "Fri, 12 March 2027", time: "6.00 pm", place: "Front entrance" },
      { name: "Tasting & music", date: "Fri, 12 March 2027", time: "6.30 pm", place: "Main floor" },
    ],
    rsvpBy: "1 March 2027",
    closing: "Bring a friend. Leave with a gift.",
    sampleGuest: "Alex Morgan",
  },

  // ───────────── Weddings ─────────────
  {
    slug: "noir-gold",
    cover: "/demos/noir-gold/cover.jpg",
    isNew: true,
    title: "Noir & Gold",
    style: "Black-tie art deco, gold lines drawn by hand",
    category: "Wedding",
    occasion: "The Wedding of",
    theme: {
      bg: "#0b0b0b",
      surface: "#15120d",
      fg: "#f3e9d2",
      accent: "#c9a45c",
      onAccent: "#0b0b0b",
      namesFont: "display",
    },
    opening: { type: "deco" },
    music: "/demos/placeholder-music.wav",
    particles: "sparkles",
    ornament: "deco",
    intro: "Together with their families, request the pleasure of your company at the marriage of",
    names: ["Isabella", "Marco"],
    start: "2027-09-18T17:00:00+01:00",
    dateLabel: "Saturday, 18 September 2027",
    timeLabel: "Black tie · Ceremony at 5 pm",
    venue: { name: "The Langham", address: "1C Portland Place, London W1B 1JA" },
    hashtag: "#IsabellaAndMarco",
    story: [
      { year: "2019", title: "A borrowed umbrella", text: "Outside a jazz bar in Soho, in the rain." },
      { year: "2023", title: "Paris", text: "One question asked at midnight on the Pont des Arts." },
    ],
    events: [
      { name: "Ceremony", date: "Sat, 18 September 2027", time: "5.00 pm", place: "The Ballroom" },
      { name: "Champagne Reception", date: "Sat, 18 September 2027", time: "6.00 pm", place: "The Palm Court" },
      { name: "Dinner & Dancing", date: "Sat, 18 September 2027", time: "7.30 pm", place: "The Grand Hall", note: "Black tie" },
    ],
    rsvpBy: "1 August 2027",
    closing: "An evening of elegance — we would be honoured by your presence.",
    sampleGuest: "Mr & Mrs Hamilton",
  },
  {
    slug: "lotus-scroll",
    cover: "/demos/lotus-scroll/cover.jpg",
    isNew: true,
    title: "Lotus Scroll",
    style: "A parchment scroll unrolls with lotus and gold",
    category: "Wedding",
    occasion: "Wedding Ceremony",
    theme: {
      bg: "#f5ecda",
      surface: "#ebdcc0",
      fg: "#1e3d3b",
      accent: "#b8893a",
      onAccent: "#fbf6ec",
      namesFont: "script",
    },
    opening: { type: "scroll" },
    music: "/demos/placeholder-music.wav",
    particles: "petals",
    ornament: "lotus",
    intro: "With the blessings of the Almighty and our elders, we invite you to the wedding of",
    names: ["Meera", "Kiran"],
    start: "2027-08-29T08:30:00+05:30",
    dateLabel: "Sunday, 29 August 2027",
    timeLabel: "Muhurtham at 8.30 am",
    venue: { name: "Shangri-La Colombo", address: "1 Galle Face, Colombo 02, Sri Lanka" },
    hashtag: "#MeeraWedsKiran",
    events: [
      { name: "Nalangu", date: "Fri, 27 August 2027", time: "5.00 pm", place: "Bride's residence" },
      { name: "Muhurtham", date: "Sun, 29 August 2027", time: "8.30 am", place: "Lotus Ballroom", note: "Traditional attire welcome" },
      { name: "Reception", date: "Sun, 29 August 2027", time: "7.00 pm", place: "Sapphire Hall" },
    ],
    rsvpBy: "31 July 2027",
    closing: "Your blessings will make our day complete.",
    sampleGuest: "Dr & Mrs Rajan",
  },

  // ───────────── Celebrations ─────────────
  {
    slug: "confetti-party",
    cover: "/demos/confetti-party/cover.jpg",
    isNew: true,
    title: "Confetti Party",
    style: "A gift box that bursts into confetti",
    category: "Celebration",
    occasion: "Birthday Party",
    theme: {
      bg: "#fff6ea",
      surface: "#ffe7cc",
      fg: "#2d1b4e",
      accent: "#ff5a7a",
      onAccent: "#ffffff",
      namesFont: "display",
    },
    opening: { type: "giftbox" },
    music: "/demos/placeholder-music.wav",
    particles: "confetti",
    ornament: "none",
    intro: "Balloons, cake and lots of games — come celebrate as",
    names: ["Zara turns 7!"],
    start: "2027-05-08T15:00:00+05:30",
    dateLabel: "Saturday, 8 May 2027",
    timeLabel: "3 pm – 6 pm",
    venue: { name: "Play Planet", address: "42 Park Street, Colombo 02" },
    eventsTitle: "The plan",
    events: [
      { name: "Games & Magic Show", date: "Sat, 8 May 2027", time: "3.00 pm", place: "Main hall" },
      { name: "Cake time!", date: "Sat, 8 May 2027", time: "5.00 pm", place: "Party room", note: "Fancy dress: superheroes" },
    ],
    rsvpBy: "28 April 2027",
    closing: "Don't forget your party hat!",
    sampleGuest: "Liam & family",
  },
  {
    slug: "little-cloud",
    cover: "/demos/little-cloud/cover.jpg",
    isNew: true,
    title: "Little Cloud",
    style: "Pastel balloons float away for a baby shower",
    category: "Celebration",
    occasion: "Baby Shower",
    theme: {
      bg: "#eef5fb",
      surface: "#dfeaf6",
      fg: "#2c3e5a",
      accent: "#7fa7d6",
      onAccent: "#ffffff",
      namesFont: "script",
    },
    opening: { type: "balloons" },
    music: "/demos/placeholder-music.wav",
    particles: "bubbles",
    ornament: "clouds",
    intro: "A little cloud is on its way! Please join us for a baby shower honouring",
    names: ["Nadia"],
    start: "2027-03-20T11:00:00+00:00",
    dateLabel: "Saturday, 20 March 2027",
    timeLabel: "Brunch at 11 am",
    venue: { name: "The Garden Room", address: "8 Willow Lane, Bath BA1 2QR" },
    eventsTitle: "The day",
    events: [
      { name: "Brunch & Games", date: "Sat, 20 March 2027", time: "11.00 am", place: "The Garden Room" },
      { name: "Gift opening", date: "Sat, 20 March 2027", time: "1.00 pm", place: "The Conservatory", note: "Registry details in your RSVP email" },
    ],
    rsvpBy: "6 March 2027",
    closing: "We can't wait to celebrate this little miracle with you.",
    sampleGuest: "Auntie Grace",
  },

  // ───────────── Business events ─────────────
  {
    slug: "launch-night",
    cover: "/demos/launch-night/cover.jpg",
    isNew: true,
    title: "Launch Night",
    style: "A neon ticket that tears to let you in",
    category: "Business",
    occasion: "Product Launch",
    theme: {
      bg: "#0c0c14",
      surface: "#161626",
      fg: "#f2f2f7",
      accent: "#b6ff3b",
      onAccent: "#0c0c14",
      namesFont: "sans",
    },
    opening: { type: "ticket" },
    particles: "sparkles",
    ornament: "grid",
    intro: "Lumen Audio invites you to the first listen of",
    names: ["AURA ONE"],
    start: "2027-06-04T19:00:00+04:00",
    dateLabel: "Friday, 4 June 2027",
    timeLabel: "Doors 7 pm · Reveal 8 pm",
    venue: { name: "Warehouse 21", address: "Alserkal Avenue, Al Quoz, Dubai" },
    eventsTitle: "Tonight",
    events: [
      { name: "Doors & drinks", date: "Fri, 4 June 2027", time: "7.00 pm", place: "The Courtyard" },
      { name: "The reveal", date: "Fri, 4 June 2027", time: "8.00 pm", place: "Main stage" },
      { name: "Hands-on & DJ set", date: "Fri, 4 June 2027", time: "8.45 pm", place: "Listening lounge" },
    ],
    rsvpBy: "25 May 2027",
    closing: "Limited capacity. Your ticket is personal — see you on the list.",
    sampleGuest: "Jordan Lee",
  },
  {
    slug: "summit",
    cover: "/demos/summit/cover.jpg",
    isNew: true,
    title: "Summit",
    style: "Conference invite with a circular reveal",
    category: "Business",
    occasion: "Annual Conference",
    theme: {
      bg: "#0a1a33",
      surface: "#0f2547",
      fg: "#eaf2ff",
      accent: "#4cc9f0",
      onAccent: "#0a1a33",
      namesFont: "sans",
    },
    opening: { type: "iris" },
    particles: "none",
    ornament: "grid",
    intro: "Join founders, investors and builders at",
    names: ["Commerce Summit 2027"],
    start: "2027-10-14T09:00:00+05:30",
    dateLabel: "Thursday, 14 October 2027",
    timeLabel: "Registration from 8.30 am",
    venue: { name: "Cinnamon Life", address: "1 Justice Akbar Mawatha, Colombo 02" },
    eventsTitle: "Agenda",
    events: [
      { name: "Opening keynote", date: "Thu, 14 October 2027", time: "9.00 am", place: "Main hall" },
      { name: "Panels & workshops", date: "Thu, 14 October 2027", time: "11.00 am", place: "Rooms A–D" },
      { name: "Networking evening", date: "Thu, 14 October 2027", time: "6.00 pm", place: "Sky lounge", note: "Business casual" },
    ],
    rsvpBy: "30 September 2027",
    closing: "Seats are limited — reserve yours today.",
    sampleGuest: "Ms Perera",
  },
];

/** Every demo: event invitations first, then personal moment pages. */
export const designs: Design[] = [...invitations, ...moments];

/** All demos in a category, newest designs first (otherwise in the order above). */
export const designsIn = (category: Category) => {
  const list = designs.filter((i) => i.category === category);
  return [...list.filter((i) => i.isNew), ...list.filter((i) => !i.isNew)];
};

export const findDesign = (slug: string) => designs.find((i) => i.slug === slug);
