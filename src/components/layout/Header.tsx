"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wordmark } from "./Logo";
import { SocialIcons } from "@/components/contact/SocialIcons";

const nav = [
  { href: "/weddings", label: "Weddings" },
  { href: "/celebrations", label: "Celebrations" },
  { href: "/business-events", label: "Business" },
  { href: "/moments", label: "Moments" },
  { href: "/demos", label: "Demos" },
  { href: "/pricing", label: "Pricing" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-[var(--season-bar,0px)] z-50 transition-all duration-500 ${
          scrolled ? "bg-paper/80 py-3 shadow-[0_1px_0_var(--line)] backdrop-blur-md" : "py-5"
        }`}
      >
        <div className="container-x flex items-center justify-between">
          <Link href="/" aria-label="Entice Studio home" onClick={() => setOpen(false)}>
            <Wordmark className={`transition-all duration-500 ${scrolled ? "w-24" : "w-28 md:w-32"}`} priority />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="group relative text-sm tracking-wide">
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ink transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-ink-soft"
            >
              Get a quote
            </Link>
          </nav>

          <button
            className="relative z-50 flex size-11 items-center justify-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${open ? "rotate-45 text-paper" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${open ? "-rotate-45 text-paper" : "translate-y-1"}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-6 pb-14 text-paper lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-3" aria-label="Mobile">
              {[...nav, { href: "/contact", label: "Get a quote" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="font-display text-5xl">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-12">
              <SocialIcons tone="light" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
