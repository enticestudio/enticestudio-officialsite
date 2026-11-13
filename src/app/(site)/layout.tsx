import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CursorDot } from "@/components/motion/CursorDot";

/** Studio marketing pages: smooth scroll, header, footer. Invitations live in the (invite) group without them. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain">
      <SmoothScroll>
        <Header />
        <main>{children}</main>
        <Footer />
      </SmoothScroll>
      <CursorDot />
    </div>
  );
}
