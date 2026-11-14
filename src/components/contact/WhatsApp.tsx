import { externalProps, whatsappLink } from "@/lib/contact";
import { BrandIcon } from "./BrandIcon";

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return <BrandIcon brand="whatsapp" className={className} />;
}

/** Floating "chat on WhatsApp" button for every site page. Renders nothing until a number is set. */
export function WhatsAppFloat() {
  const href = whatsappLink();
  if (!href) return null;
  return (
    <a
      href={href}
      {...externalProps(href)}
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#25d366] p-3.5 text-white shadow-[0_12px_30px_-10px_rgb(14_14_14/0.5)] transition-transform duration-300 hover:-translate-y-1 md:bottom-8 md:right-8"
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width,margin] duration-500 group-hover:mr-1 group-hover:max-w-40 md:inline">
        Chat with us
      </span>
    </a>
  );
}

/** Inline outline button, e.g. on the contact page. */
export function WhatsAppButton({
  message,
  children = "Chat on WhatsApp",
  tone = "dark",
  className = "",
}: {
  message?: string;
  children?: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const href = whatsappLink(message);
  if (!href) return null;
  return (
    <a
      href={href}
      {...externalProps(href)}
      className={`inline-flex items-center justify-center gap-3 rounded-full border px-6 py-3.5 text-sm font-medium transition-colors ${
        tone === "dark" ? "border-ink/25 hover:border-ink hover:bg-ink hover:text-paper" : "border-paper/30 text-paper hover:bg-paper hover:text-ink"
      } ${className}`}
    >
      <WhatsAppIcon className="size-5 text-[#25d366]" />
      {children}
    </a>
  );
}
