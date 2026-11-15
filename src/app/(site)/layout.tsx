import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CursorDot } from "@/components/motion/CursorDot";
import { CurrencyProvider } from "@/components/currency/Currency";
import { WhatsAppFloat } from "@/components/contact/WhatsApp";
import { SeasonShell } from "@/components/season/Season";

/** Studio marketing pages: smooth scroll, header, footer. Invitations live in the (invite) group without them. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain">
      <CurrencyProvider>
        {/* seasonal theme (Christmas greeting bar, snow): see src/lib/season.ts */}
        <SeasonShell>
          <SmoothScroll>
            <Header />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </SeasonShell>
      </CurrencyProvider>
      <WhatsAppFloat />
      <CursorDot />
    </div>
  );
}
