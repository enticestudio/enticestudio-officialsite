// ─────────────────────────────────────────────────────────────────────────────
// Invitation data. Every demo (and, later, every client invitation) is just one
// of these objects — the same components render all of them.
//
// Media files are optional. Drop them into public/demos/<slug>/ and reference
// them here; until then each style falls back to its code-drawn version.
// Names and details below are fictional.
// ─────────────────────────────────────────────────────────────────────────────

export type OpeningType = "envelope" | "curtain" | "doors";

export type Invitation = {
  slug: string;
  title: string;
  style: string; // one-line description for cards
  category: "Wedding" | "Birthday" | "Business";
  occasion: string; // small caps label on the invitation

  theme: {
    bg: string; // page background
    surface: string; // cards / alternating bands
    fg: string; // text
    accent: string; // gold, red, etc.
    onAccent: string; // text on accent buttons
    curtain?: string; // curtain fabric colour
    door?: string; // door panel colour
    namesFont: "script" | "display" | "sans";
  };

  opening: {
    type: OpeningType; // code-drawn opening (also the fallback)
    /** Optional opening video, e.g. "/demos/kandyan-gold/opening.mp4". Plays instead of the code opening. */
    video?: string;
    /** First frame of the video, shown before the tap. */
    poster?: string;
  };

  /** Optional licensed music track. Starts on the guest's first tap. */
  music?: string;
  /** Optional looping hero background (muted video) or image. */
  heroVideo?: string;
  heroImage?: string;
  particles: "petals" | "sparkles" | "none";
  ornament: "mandala" | "arch" | "botanical" | "none";

  intro: string;
  names: string[]; // 1 name for birthdays/businesses, 2 for couples
  localNames?: string; // optional second-language line (e.g. Sinhala)
  /** ISO date with time-zone offset — drives the countdown and calendar links. */
  start: string;
  dateLabel: string;
  timeLabel: string;
  venue: { name: string; address: string };
  hashtag?: string;

  story?: { year: string; title: string; text: string }[];
  events: { name: string; date: string; time: string; place: string; note?: string }[];
  gallery?: string[];
  rsvpBy: string;
  closing: string;
  /** Sample guest greeting used in the phone demo. */
  sampleGuest: string;
};

export const invitations: Invitation[] = [
  {
    slug: "kandyan-gold",
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
    title: "Milestone Birthday",
    style: "Playful curtain-up party invite",
    category: "Birthday",
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
];

export const findInvitation = (slug: string) => invitations.find((i) => i.slug === slug);

/** Card colours for the CSS-only previews used across the marketing site. */
export const previewOf = (inv: Invitation) => ({
  bg: inv.theme.bg,
  fg: inv.theme.fg,
  accent: inv.theme.accent,
  font: inv.theme.namesFont,
});
