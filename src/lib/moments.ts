// ─────────────────────────────────────────────────────────────────────────────
// "Moments": personal pages made for one person or one memory: proposals,
// Valentine's, birthday surprises, graduations and memorial tributes.
//
// Each page is a list of sections (blocks), in any order; see the Block type in
// ./invitations.ts. Photos: add `src: "/demos/<slug>/1.jpg"` to a photo item;
// without one, a soft placeholder frame is drawn.
// Names and details below are fictional.
// ─────────────────────────────────────────────────────────────────────────────

import type { Moment } from "./invitations";

export const moments: Moment[] = [
  // ───────────── Christmas wishes ─────────────
  {
    kind: "moment",
    slug: "christmas-wishes",
    cover: "/demos/christmas-wishes/cover.jpg",
    isNew: true,
    title: "Christmas Wishes",
    style: "A bauble opens on a Christmas letter, memories and a countdown",
    category: "Moment",
    occasion: "Merry Christmas",
    theme: {
      bg: "#0f2a1f",
      surface: "#173a2b",
      fg: "#f6ecd9",
      accent: "#e3ba62",
      onAccent: "#0f2a1f",
      velvet: "#b3261e", // the bauble
      namesFont: "script",
    },
    opening: { type: "ornament" },
    greeting: "Merry Christmas, {guest}",
    greetingDefault: "Merry Christmas",
    tapLabel: "Tap to open your Christmas wish",
    music: "/demos/placeholder-music.wav",
    particles: "snow",
    names: ["Amma & Thaththa"],
    sampleGuest: "Amma & Thaththa",
    blocks: [
      {
        type: "hero",
        art: "tree",
        eyebrow: "Merry Christmas",
        title: "Amma & Thaththa",
        subtitle: "From Melbourne, with all my love.",
        note: "I can't be at the table this year, so I made you this instead.",
      },
      { type: "countdown", heading: "Until Christmas morning", to: "2026-12-25T00:00:00+05:30", doneText: "It's Christmas morning!" },
      {
        type: "letter",
        heading: "A Christmas letter",
        paragraphs: [
          "Every December I think of our house in Negombo: the tree in the corner, Amma's Christmas cake and Thaththa pretending he didn't already eat a piece.",
          "Thank you for every Christmas you made feel like magic. This year the magic is coming to you by phone.",
        ],
        signoff: "Your son, Shehan",
      },
      {
        type: "photos",
        heading: "Christmases we've shared",
        items: [{ caption: "Midnight mass, 2015" }, { caption: "The crooked tree" }, { caption: "Amma's Christmas cake" }, { caption: "All of us, 2019" }],
      },
      {
        type: "reasons",
        heading: "What I'm thankful for",
        items: [
          "Amma's breudher on Christmas morning.",
          "Thaththa's carols, always one note off.",
          "A home that always smelled of cinnamon.",
          "Phone calls that never feel long enough.",
        ],
      },
      {
        type: "messages",
        heading: "Wishes from all of us",
        items: [
          { from: "Dilki", text: "Merry Christmas! Save us some cake. We'll be home in April." },
          { from: "Little Ayaan, age 5", text: "Seeya, Achchi, I drew you a reindeer. It has six legs." },
        ],
      },
      { type: "closing", text: "Merry Christmas and a blessed New Year.", signoff: "Shehan, Dilki & Ayaan" },
    ],
  },

  // ───────────── Proposal ─────────────
  {
    kind: "moment",
    slug: "the-question",
    cover: "/demos/the-question/cover.jpg",
    isNew: true,
    title: "The Question",
    style: "A ring box opens on a love story, then the big question",
    category: "Moment",
    occasion: "Marriage proposal",
    theme: {
      bg: "#10142b",
      surface: "#1a2042",
      fg: "#f5ede0",
      accent: "#e9c48f",
      onAccent: "#10142b",
      velvet: "#6d1430",
      namesFont: "script",
    },
    opening: { type: "ringbox" },
    greeting: "{guest}, my love,",
    greetingDefault: "My love,",
    music: "/demos/placeholder-music.wav",
    particles: "sparkles",
    names: ["Amaya"],
    sampleGuest: "Amaya",
    blocks: [
      {
        type: "hero",
        art: "ring",
        eyebrow: "For the love of my life",
        title: "Amaya",
        subtitle: "I made this for you. Scroll slowly.",
      },
      {
        type: "timeline",
        heading: "Our story",
        items: [
          { date: "March 2019", title: "The first hello", text: "You laughed at my terrible joke in the library. I've been trying to make you laugh ever since." },
          { date: "December 2020", title: "Our first trip", text: "Ella, a missed train, and the best tea we've ever had." },
          { date: "2023", title: "Through everything", text: "New jobs, a tiny flat and a lot of rice and curry at midnight. Always together." },
          { date: "Today", title: "And now…", text: "There's something I've wanted to ask you for a long time." },
        ],
      },
      {
        type: "photos",
        heading: "Us",
        items: [{ caption: "Ella, 2020" }, { caption: "Your birthday" }, { caption: "Galle Fort sunset" }, { caption: "Sunday mornings" }],
      },
      {
        type: "letter",
        heading: "A letter for you",
        paragraphs: [
          "Amaya, you are my calm on loud days and my favourite person on every day.",
          "You make ordinary things feel like celebrations. I don't want to imagine a single year without you in it.",
          "So I'd like to ask you something…",
        ],
        signoff: "Ravin",
      },
      {
        type: "question",
        question: "Will you marry me?",
        yes: "Yes!",
        no: "No",
        success: "She said yes!",
        successText: "Now look up from your phone. I'm right behind you.",
      },
      { type: "closing", text: "Forever starts now.", signoff: "Ravin" },
    ],
  },

  // ───────────── Valentine's ─────────────
  {
    kind: "moment",
    slug: "be-mine",
    cover: "/demos/be-mine/cover.jpg",
    isNew: true,
    title: "Be Mine",
    style: "A love letter with a heart seal and flip-card reasons",
    category: "Moment",
    occasion: "Happy Valentine's Day",
    theme: {
      bg: "#fff1f3",
      surface: "#ffdfe6",
      fg: "#5c1428",
      accent: "#e0315b",
      onAccent: "#ffffff",
      namesFont: "script",
    },
    opening: { type: "loveletter" },
    greeting: "For {guest},",
    greetingDefault: "For you,",
    music: "/demos/placeholder-music.wav",
    particles: "hearts",
    names: ["Dinithi"],
    sampleGuest: "Dinithi",
    blocks: [
      {
        type: "hero",
        art: "heart",
        eyebrow: "Happy Valentine's Day",
        title: "Dinithi",
        subtitle: "You + me = my favourite thing.",
      },
      {
        type: "reasons",
        heading: "Reasons I love you",
        items: [
          "The way you sing in the car, every word wrong.",
          "You always save me the last bite.",
          "Your laugh. Especially the loud one.",
          "How kind you are to everyone, even strangers.",
          "You make every Monday feel like a Friday.",
          "You believed in me before I did.",
        ],
      },
      {
        type: "photos",
        heading: "Our favourite days",
        items: [{ caption: "First date" }, { caption: "Rainy day in Kandy" }, { caption: "Beach, 2025" }],
      },
      {
        type: "letter",
        heading: "Just so you know",
        paragraphs: [
          "Every year with you is better than the last.",
          "Thank you for the coffee, the patience and all the little notes.",
        ],
        signoff: "Yours, always",
      },
      {
        type: "question",
        question: "Will you be my Valentine?",
        yes: "Yes",
        no: "No",
        success: "Best answer ever!",
        successText: "Dinner's booked for 7.30 tonight. Wear the red dress.",
      },
      { type: "closing", text: "Happy Valentine's Day, my love.", signoff: "Kasun" },
    ],
  },

  // ───────────── Birthday surprise ─────────────
  {
    kind: "moment",
    slug: "birthday-surprise",
    cover: "/demos/birthday-surprise/cover.jpg",
    isNew: true,
    title: "Birthday Surprise",
    style: "A gift to open, a countdown and candles to blow out",
    category: "Moment",
    occasion: "Happy birthday",
    theme: {
      bg: "#1c1033",
      surface: "#2a1849",
      fg: "#fff3f8",
      accent: "#ff8fb4",
      onAccent: "#1c1033",
      namesFont: "display",
    },
    opening: { type: "giftbox" },
    greeting: "Hey {guest},",
    greetingDefault: "Hey you,",
    tapLabel: "Tap to open your gift",
    music: "/demos/placeholder-music.wav",
    particles: "confetti",
    names: ["Nimesha"],
    sampleGuest: "Nimesha",
    blocks: [
      {
        type: "hero",
        art: "cake",
        eyebrow: "Happy birthday",
        title: "Nimesha",
        subtitle: "Another year of you. Lucky world.",
      },
      { type: "countdown", heading: "Until your birthday", to: "2027-03-08T00:00:00+05:30", doneText: "It's your birthday!" },
      { type: "cake", heading: "Make a wish", candles: 5, doneText: "Wish made. Now it has to come true." },
      {
        type: "photos",
        heading: "Your year in pictures",
        items: [{ caption: "Sigiriya at sunrise" }, { caption: "The cake disaster" }, { caption: "Office party" }, { caption: "Us" }],
      },
      {
        type: "letter",
        heading: "Birthday letter",
        paragraphs: [
          "Happy birthday to the person who makes every room brighter.",
          "I hope this year brings you everything you keep wishing for, and a few surprises you didn't see coming.",
        ],
        signoff: "Love, Chamod",
      },
      { type: "closing", text: "Here's to you, today and every day.", signoff: "Chamod" },
    ],
  },

  // ───────────── Graduation / farewell ─────────────
  {
    kind: "moment",
    slug: "class-of-2026",
    cover: "/demos/class-of-2026/cover.jpg",
    isNew: true,
    title: "Class of 2026",
    style: "Caps in the air, milestones and messages from loved ones",
    category: "Moment",
    occasion: "Graduation",
    theme: {
      bg: "#0f2140",
      surface: "#162c54",
      fg: "#f2f5fb",
      accent: "#f2c14e",
      onAccent: "#0f2140",
      namesFont: "display",
    },
    opening: { type: "caps" },
    greeting: "Congratulations, {guest}!",
    greetingDefault: "Congratulations!",
    music: "/demos/placeholder-music.wav",
    particles: "confetti",
    names: ["Sachini"],
    sampleGuest: "Sachini",
    blocks: [
      {
        type: "hero",
        art: "cap",
        eyebrow: "Class of 2026",
        title: "Sachini Perera",
        subtitle: "BSc (Hons) in Computer Science",
        note: "Four years, a thousand coffees, one very proud family.",
      },
      {
        type: "timeline",
        heading: "The journey",
        items: [
          { date: "2022", title: "First day", text: "New campus, new friends, and a timetable nobody understood." },
          { date: "2023", title: "Late nights", text: "Group projects, power cuts and kottu at 2 am." },
          { date: "2025", title: "Final-year project", text: "An app that helps farmers predict the rain. It worked!" },
          { date: "2026", title: "Graduation day", text: "The gown, the cap and the biggest smile." },
        ],
      },
      {
        type: "photos",
        heading: "Memories",
        items: [{ caption: "Freshers' day" }, { caption: "Study group" }, { caption: "Project demo" }, { caption: "The last lecture" }],
      },
      {
        type: "messages",
        heading: "Messages for you",
        items: [
          { from: "Amma & Thaththa", text: "We watched you work so hard for this. We couldn't be prouder of you, putha." },
          { from: "Nethu, your little sister", text: "You're officially the smart one. I'll be the fun one." },
          { from: "Dilan, best friend", text: "From 'I'll start tomorrow' to graduate. Legend." },
          { from: "Dr. Fernando, supervisor", text: "A thoughtful engineer and a kind colleague. The best is yet to come." },
        ],
      },
      {
        type: "details",
        heading: "The ceremony",
        items: [
          { title: "Graduation ceremony", when: "Saturday, 20 February 2027 · 9.00 am", where: "Main Auditorium, Colombo", note: "Family seating from 8.30 am" },
          { title: "Celebration lunch", when: "Saturday, 20 February 2027 · 1.00 pm", where: "The Lagoon Terrace, Colombo" },
        ],
      },
      { type: "closing", text: "The world is lucky to have you next.", signoff: "With love, your family" },
    ],
  },

  // ───────────── Memorial / tribute ─────────────
  {
    kind: "moment",
    slug: "in-loving-memory",
    cover: "/demos/in-loving-memory/cover.jpg",
    isNew: true,
    title: "In Loving Memory",
    style: "A gentle tribute: light a candle, share a memory",
    category: "Moment",
    occasion: "In loving memory",
    theme: {
      bg: "#15120f",
      surface: "#201b16",
      fg: "#efe6d8",
      accent: "#d9b27c",
      onAccent: "#15120f",
      namesFont: "display",
    },
    opening: { type: "candle" },
    greeting: "Welcome, {guest}",
    greetingDefault: "In loving memory",
    tapLabel: "Tap to light a candle",
    music: "/demos/placeholder-music.wav",
    particles: "embers",
    names: ["Sunil Jayawardena"],
    sampleGuest: "Priyanka",
    blocks: [
      {
        type: "hero",
        art: "candle",
        eyebrow: "In loving memory of",
        title: "Sunil Jayawardena",
        subtitle: "12 June 1948 – 2 November 2026",
        note: "A gentle father, a patient teacher and a friend to everyone he met.",
      },
      {
        type: "timeline",
        heading: "His life",
        items: [
          { date: "1948", title: "Born in Galle", text: "The youngest of five, raised by the sea." },
          { date: "1972", title: "A teacher", text: "Thirty-six years teaching mathematics, and remembering every student's name." },
          { date: "1976", title: "Kamala", text: "Fifty years of marriage, morning tea and long evening walks." },
          { date: "2008", title: "Grandfather", text: "Three grandchildren, endless stories and a garden full of mangoes." },
        ],
      },
      { type: "quote", text: "He taught us to be kind first and right second. We are still learning.", by: "His family" },
      {
        type: "photos",
        heading: "Remembering",
        items: [{ caption: "Wedding day, 1976" }, { caption: "In his classroom" }, { caption: "With the grandchildren" }],
      },
      {
        type: "details",
        heading: "Funeral arrangements",
        items: [
          { title: "Viewing", when: "Wednesday, 4 November 2026 · from 4.00 pm", where: "Family residence, 18 Lighthouse Street, Galle" },
          { title: "Funeral service", when: "Thursday, 5 November 2026 · 3.00 pm", where: "Galle General Cemetery" },
          { title: "Seventh-day almsgiving", when: "Sunday, 8 November 2026 · 11.00 am", where: "Family residence", note: "All are welcome" },
        ],
      },
      {
        type: "guestbook",
        heading: "Condolence book",
        candlesLit: 214,
        entries: [
          { from: "Ruwan, former student", text: "Sir made maths make sense for the first time in my life. I became a teacher because of him." },
          { from: "The Silva family, neighbours", text: "Forty years of kindness over the garden wall. We will miss him every morning." },
          { from: "Anjali", text: "Thinking of you all. He was the warmest man I knew." },
        ],
      },
      { type: "closing", text: "Forever in our hearts.", signoff: "Kamala, Nuwan & Dilini" },
    ],
  },
];
