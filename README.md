# Entice Studio website

Next.js 16 (App Router, Cache Components) · Tailwind CSS 4 · Motion · GSAP + ScrollTrigger · Lenis · React Three Fiber

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Where things live

| What | File |
| --- | --- |
| Copy, prices, demos, FAQs | `src/lib/content.ts` |
| Brand colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Logo files (transparent PNG) | `public/brand/` |
| 3D envelope hero | `src/components/three/Envelope.tsx`, `src/components/sections/Hero.tsx` |
| Smooth scroll (Lenis + GSAP) | `src/components/motion/SmoothScroll.tsx` |
| Reusable motion | `src/components/motion/` (Reveal, SplitHeading, Parallax, Magnetic, CursorDot) |
| Home sections | `src/components/sections/` |
| Studio pages (with header/footer) | `src/app/(site)/` |
| Demo invitations (no studio chrome) | `src/app/(invite)/demos/[slug]/` |
| Quote form + server action | `src/app/(site)/contact/` |

`SplitHeading` turns `*words in asterisks*` into the italic accent serif.

## Demo invitations

| What | Where |
| --- | --- |
| Invitation data (all demos) | `src/lib/invitations.ts` |
| The invitation template | `src/components/invite/` (Openings, Sections, InvitationView, useMusic) |
| Guest-facing invitation | `/i/<slug>?guest=Mr%20%26%20Mrs%20Silva` |
| Phone-frame demo viewer | `/demos/<slug>` (phones are sent straight to `/i/<slug>`) |

### Adding a new style

Copy an entry in `src/lib/invitations.ts`, give it a new `slug`, colours, opening type (`envelope`, `curtain` or `doors`), names and events. No new code is needed.

### Adding your own images, video and music

Put files in `public/demos/<slug>/` and reference them in that demo's entry:

```ts
opening: { type: "doors", video: "/demos/kandyan-gold/opening.mp4", poster: "/demos/kandyan-gold/poster.jpg" },
music: "/demos/kandyan-gold/music.mp3",
heroImage: "/demos/kandyan-gold/hero.jpg",      // or heroVideo: ".../loop.mp4" (muted loop)
gallery: ["/demos/kandyan-gold/1.jpg", "/demos/kandyan-gold/2.jpg"],
```

- **Opening video:** portrait 9:16, 3–6 s, no text (names are added by the page), ideally under 3 MB. If the file is missing or fails, the code-drawn opening plays instead.
- **Poster:** the first frame of the video as a JPG. It is shown before the guest taps, and is used on the demo cards.
- **Music:** licensed tracks only. `public/demos/placeholder-music.wav` is a generated placeholder; replace it before launch.
- **Images:** keep text out of AI images; all wording is live text on top.

## Motion and accessibility

- The 3D hero is loaded client-only (`next/dynamic`, `ssr: false`), fades in when ready, and stops rendering while off-screen.
- With `prefers-reduced-motion`, Lenis, parallax, the pinned gallery and the WebGL hero are all replaced by static layouts.
- The cursor dot only appears on mouse/trackpad devices.

## To do before launch

- [ ] Send quote requests somewhere (`src/app/(site)/contact/actions.ts` only logs them today) — e.g. Resend or Postmark.
- [ ] Replace CSS invite previews with real demo builds and phone screen recordings.
- [ ] Vector (SVG) version of the logo from the designer.
- [ ] Social-share image (`src/app/opengraph-image.png`), sitemap and analytics.
- [ ] Trademark / domain / social-handle checks for "Entice Studio".
- [ ] Deploy on Vercel Pro (Hobby is non-commercial).
