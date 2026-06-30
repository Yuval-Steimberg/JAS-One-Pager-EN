import { TICKER_WORDS } from "@/data/siteContent";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InfiniteTicker } from "@/components/InfiniteTicker";
import { ScrollHero } from "@/components/ScrollHero";
import { About } from "@/components/About";
import { ImpactCards } from "@/components/ImpactCards";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { GalleryPreview } from "@/components/GalleryPreview";
import { Mosaic } from "@/components/Mosaic";
import { ExperienceCards } from "@/components/ExperienceCards";
import { ActivityAreas } from "@/components/ActivityAreas";
import { StatsSection } from "@/components/StatsSection";
import { Team } from "@/components/Team";
import { Partners } from "@/components/Partners";
import { QuoteBand } from "@/components/QuoteBand";
import { LocationSection } from "@/components/LocationSection";
import { VolunteerDonationSection } from "@/components/VolunteerDonationSection";
import { ContactSection } from "@/components/ContactSection";

export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <ScrollHero />

        <div className="bg-ivory text-ink">
          <InfiniteTicker items={TICKER_WORDS} direction="rtl" speed={45} />
        </div>

        <About />
        <ImpactCards />
        <ProcessTimeline />
        <GalleryPreview />
        <Mosaic />
        <ExperienceCards />

        <div className="bg-sand text-ink">
          <InfiniteTicker items={TICKER_WORDS} direction="ltr" speed={40} />
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
    </>
  );
}
