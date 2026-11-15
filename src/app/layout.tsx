import type { Metadata, Viewport } from "next";
import { Gloock, Instrument_Serif, Jost, Pinyon_Script, Noto_Serif_Sinhala } from "next/font/google";
import "./globals.css";

const gloock = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-gloock" });
const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });
// Invitation fonts: only downloaded on pages that actually use them.
const script = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-pinyon", preload: false });
const sinhala = Noto_Serif_Sinhala({ subsets: ["sinhala"], variable: "--font-noto-sinhala", preload: false });

export const metadata: Metadata = {
  title: {
    default: "Entice Studio - Invitations & Moments Worth Opening",
    template: "%s · Entice Studio",
  },
  description:
    "Invitation websites with RSVP for weddings, celebrations and business events, plus personal pages for proposals, birthdays, graduations and tributes. Designed and set up for you, or made fully custom.",
};

export const viewport: Viewport = {
  themeColor: "#fbf8f3",
};

/**
 * Root shell only: fonts and global CSS. Smooth scrolling, the cursor dot and the
 * header/footer belong to the studio site — see (site)/layout.tsx. Invitations in
 * (invite)/ use plain native scrolling, which is what guests' phones expect.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gloock.variable} ${instrument.variable} ${jost.variable} ${script.variable} ${sinhala.variable}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
