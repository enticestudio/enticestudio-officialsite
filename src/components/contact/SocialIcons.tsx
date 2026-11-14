import { externalProps, socials } from "@/lib/contact";
import { BrandIcon } from "./BrandIcon";

/** Brand colour each icon fills with on hover. */
const hover: Record<string, string> = {
  instagram: "hover:border-transparent hover:bg-[linear-gradient(45deg,#f9ce34,#ee2a7b_50%,#6228d7)]",
  tiktok: "hover:border-transparent hover:bg-black hover:[&_svg]:[filter:drop-shadow(-1.5px_-1.5px_0_#25f4ee)_drop-shadow(1.5px_1.5px_0_#fe2c55)]",
  facebook: "hover:border-transparent hover:bg-[#0866ff]",
};

/** Row of round social icons, e.g. under the footer logo or in the mobile menu. */
export function SocialIcons({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  if (socials.length === 0) return null;
  return (
    <ul className={`flex gap-3 ${className}`} aria-label="Social media">
      {socials.map((s) => (
        <li key={s.key}>
          <a
            href={s.url}
            {...externalProps(s.url)}
            aria-label={`${s.name} ${s.handle}`}
            title={`${s.name} ${s.handle}`}
            className={`flex size-11 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:text-white ${
              tone === "light" ? "border-paper/25 text-paper" : "border-ink/20 text-ink"
            } ${hover[s.key]}`}
          >
            <BrandIcon brand={s.key} className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
