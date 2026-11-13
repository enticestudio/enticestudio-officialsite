import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Intro } from "@/components/sections/Intro";
import { Showcase } from "@/components/sections/Showcase";
import { Occasions } from "@/components/sections/Occasions";
import { Packages } from "@/components/sections/Packages";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Intro />
      <Showcase />
      <Occasions />
      <Packages />
      <Process />
      <Faq />
      <Cta />
    </>
  );
}
