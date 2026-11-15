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

Copy an entry in `src/lib/invitations.ts`, give it a new `slug`, colours, opening type (see `OpeningType`), names and events. No new code is needed. Run `npm run covers -- <slug>` afterwards to capture its card image.

### Moments (personal pages)

Proposals, Valentine's, birthday surprises, graduations and memorials live in `src/lib/moments.ts` and are shown on `/moments`, in the Moments group on `/demos`, and at `/i/<slug>` like invitations.

A moment page is a list of `blocks`, rendered in order by `src/components/invite/MomentBlocks.tsx`. Mix and reorder them freely:

| Block | What it shows |
| --- | --- |
| `hero` | Name, line and a drawn icon (`ring`, `heart`, `cap`, `candle`, `cake`) |
| `timeline` | Story or life milestones |
| `photos` | Polaroid photos (add `src` to each; without it a placeholder frame is drawn) |
| `letter` | A letter that types itself out |
| `reasons` | Cards that flip one by one ("Reasons I love you") |
| `question` | "Will you…?" with a Yes button and a No button that runs away |
| `countdown` | Countdown to a date |
| `cake` | Candles to tap out, then confetti |
| `messages` | Messages from family and friends |
| `quote` | A verse or favourite words |
| `details` | Ceremony or funeral details with directions |
| `guestbook` | "Light a candle" and a condolence book (demo only: nothing is saved yet) |
| `closing` | Final words and signature |

Openings made for moments: `ringbox`, `loveletter`, `caps` and `candle` (any opening works on any page). The cover line comes from `greeting` / `greetingDefault` / `tapLabel`. Memorial pages use the calm `embers` particles; keep confetti and playful blocks off them.

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

## Home page background video

The hero can play a looping film behind the 3D envelope. Put the files in `public/hero/` and set `heroVideo` in `src/lib/content.ts`:

```ts
export const heroVideo = { mp4: "/hero/hero.mp4", webm: "/hero/hero.webm", mobileMp4: "/hero/hero-portrait.mp4", poster: "/hero/hero-poster.jpg" };
```

- **Film:** 8–15 seconds, loops seamlessly, slow and calm, warm light tones, no text or faces in close-up. A cream wash is laid over it so the headline stays readable.
- **Files:** landscape 1920×1080 MP4 (H.264), ideally under 5 MB. Optional extras: a WebM version (smaller), a portrait 1080×1920 version for phones (`mobileMp4`), and a JPG of the first frame (`poster`), shown while it loads.
- It's muted (browsers only autoplay muted video), pauses when scrolled past, and is skipped for visitors who prefer reduced motion.
- **Loading:** the poster shows immediately; the film only starts downloading after the page has finished loading, so it never slows the first view. Phones (unless you add a `mobileMp4`) and data-saver / slow connections keep just the poster.
- **Keep it small:** the current film is 4.6 MB. Re-exporting it at 1280×720 around 1–1.5 Mbps (e.g. HandBrake's "Web" presets, or Clipchamp/CapCut export at 720p) brings it to about 2 MB with no visible difference behind the cream wash.
- Set `heroVideo` back to `null` for the plain cream background.

## Hero envelope artwork

The envelope's paper and the parchment letter are **pre-painted images** in `public/hero/envelope/` (about 60 KB in total), so visitors' devices don't have to paint them. The painting code is `src/components/three/stationery-paint.ts`. After changing it, regenerate the images with the dev server running:

```bash
npm run bake:envelope
```

The 3D shapes, wax seal and animation are in `src/components/three/Envelope.tsx`.

## Seasonal theme (Christmas)

One setting in `src/lib/season.ts` controls it:

- `mode: "auto"` shows it every year between `from` and `to` (1 December to 1 January), then it disappears by itself.
- `mode: "on"` always shows it (for previewing); `mode: "off"` never does.

It adds a greeting bar above the menu (wording and link are in the same file; visitors can close it), gentle snowfall, gold stars, a warm evergreen glow on the dark sections and a red wax seal on the envelope (`redSeal`). It only affects the studio pages, never the invitations or Moments demos. The components are in `src/components/season/Season.tsx`; the small CSS touches are at the end of `src/app/globals.css`.

## Motion and accessibility

- The 3D hero is loaded client-only (`next/dynamic`, `ssr: false`), fades in when ready, and stops rendering while off-screen.
- With `prefers-reduced-motion`, Lenis, parallax, the pinned gallery and the WebGL hero are all replaced by static layouts.
- The cursor dot only appears on mouse/trackpad devices.

## Email and WhatsApp

Copy `.env.example` to `.env.local` and fill it in (on Vercel, add the same keys under Project → Settings → Environment Variables).

**Quote emails (Resend).** `src/app/(site)/contact/actions.ts` emails each quote request to `CONTACT_TO_EMAIL` with the client as reply-to, so you can answer straight from your inbox. Email bodies live in `src/lib/email/quote.ts`.

1. Sign up at resend.com and create an API key → `RESEND_API_KEY`.
2. To start, leave `CONTACT_FROM_EMAIL` empty. Resend's test sender then delivers only to the email you signed up with, so use that as `CONTACT_TO_EMAIL`.
3. Before launch, add your domain in Resend → Domains, add the DNS records it shows, then set `CONTACT_FROM_EMAIL=Entice Studio <hello@yourdomain.com>`. Clients then also get a confirmation email.

Without a key, local dev just logs the request; production shows an error with a WhatsApp fallback.

**WhatsApp.** Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only, e.g. `94771234567`) to show a floating chat button on every page, a "Rather just chat?" card on the contact page, a footer link, and a "Continue on WhatsApp" button after a quote is sent, pre-filled with the request. Leave it empty to hide them all. Links go through `wa.me` (`src/lib/contact.ts`).

**Social media.** Set `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_TIKTOK_URL` and `NEXT_PUBLIC_FACEBOOK_URL` to your full profile links. They appear in the home page "Say hello" section (`src/components/sections/Connect.tsx`), the footer, the mobile menu and the contact page. Brand logos come from the `simple-icons` package.

While running `npm run dev`, anything not set yet still shows with a placeholder so you can see the design; on the live site, empty ones are hidden.

## To do before launch

- [ ] Fill in `.env.local` / Vercel env vars, and verify your sending domain in Resend.
- [ ] Replace CSS invite previews with real demo builds and phone screen recordings.
- [ ] Vector (SVG) version of the logo from the designer.
- [ ] Social-share image (`src/app/opengraph-image.png`), sitemap and analytics.
- [ ] Trademark / domain / social-handle checks for "Entice Studio".
- [ ] Deploy on Vercel Pro (Hobby is non-commercial).
