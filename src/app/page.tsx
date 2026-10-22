import { ContactSection } from "@/components/ContactSection";
import { FeaturedAlbums } from "@/components/home/FeaturedAlbums";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { ReportageBand } from "@/components/home/ReportageBand";
import { ServicesGrid } from "@/components/home/ServicesGrid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <ServicesGrid />
      <FeaturedAlbums />
      <ReportageBand />
      <ContactSection />
    </>
  );
}
