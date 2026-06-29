import { MotionConfig } from "framer-motion";
import { TICKER_WORDS } from "@/content/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InfiniteTicker } from "@/components/primitives/InfiniteTicker";
import { ScrollHero } from "@/components/sections/ScrollHero";
import { About } from "@/components/sections/About";
import { ImpactCards } from "@/components/sections/ImpactCards";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { Mosaic } from "@/components/sections/Mosaic";
import { ExperienceCards } from "@/components/sections/ExperienceCards";
import { ActivityAreas } from "@/components/sections/ActivityAreas";
import { StatsSection } from "@/components/sections/StatsSection";
import { Team } from "@/components/sections/Team";
import { Partners } from "@/components/sections/Partners";
import { QuoteBand } from "@/components/sections/QuoteBand";
import { LocationSection } from "@/components/sections/LocationSection";
import { VolunteerDonationSection } from "@/components/sections/VolunteerDonationSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function App() {
  return (
    // reducedMotion="user" makes every transform/opacity tween respect the OS
    // setting automatically — the single source of truth for motion a11y.
    <MotionConfig reducedMotion="user">
      <Header />
      <main id="main">
        <ScrollHero />

        {/* Brand keyword rhythm */}
        <div className="bg-cream text-forest">
          <InfiniteTicker items={TICKER_WORDS} direction="rtl" speed={45} />
        </div>

        <About />
        <ImpactCards />
        <ProcessTimeline />
        <GalleryPreview />
        <Mosaic />
        <ExperienceCards />

        {/* Second ticker, reversed, between content blocks */}
        <div className="bg-forest text-cream">
          <InfiniteTicker
            items={TICKER_WORDS}
            direction="ltr"
            speed={40}
            itemClassName="text-cream"
          />
        </div>

        <ActivityAreas />
        <StatsSection />
        <Team />
        <Partners />
        <QuoteBand />
        <LocationSection />
        <VolunteerDonationSection />
        <ContactSection />
      </main>
      <Footer />
    </MotionConfig>
  );
}
