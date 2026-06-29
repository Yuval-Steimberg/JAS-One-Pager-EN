import { motion } from "framer-motion";
import { ABOUT } from "@/content/site";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { ZoomScrollImage } from "@/components/primitives/ZoomScrollImage";
import { ParallaxSection } from "@/components/primitives/ParallaxSection";
import { ScrollRevealText } from "@/components/primitives/ScrollRevealText";

export function About() {
  return (
    <section
      id="about"
      aria-label={ABOUT.kicker}
      className="texture-paper scroll-mt-[72px] py-20 sm:py-28 lg:py-32"
    >
      <div className="container">
        {/* Editorial lead — words brighten as you read */}
        <div className="mx-auto mb-16 max-w-4xl text-center sm:mb-24">
          <p className="section-kicker mb-4">{ABOUT.kicker}</p>
          <ScrollRevealText text={ABOUT.lead} className="justify-center" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Images — layered, parallaxed */}
          <div className="relative">
            <ZoomScrollImage
              src={ABOUT.image}
              alt={ABOUT.imageAlt}
              ratio="4/5"
              zoom={[1.12, 1]}
              direction="out"
              className="rounded-xl2 shadow-lift"
            />
            <ParallaxSection
              amount={36}
              className="absolute -bottom-10 start-[-8%] w-1/2 max-w-[220px] sm:max-w-[260px]"
            >
              <div className="overflow-hidden rounded-xl2 border-4 border-cream shadow-lift">
                <img
                  src={ABOUT.imageSecondary}
                  alt={ABOUT.imageSecondaryAlt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </ParallaxSection>
          </div>

          {/* Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="lg:ps-6"
          >
            <motion.h2
              variants={fadeUp}
              className="mb-6 whitespace-pre-line text-fluid-h2 font-bold leading-tight"
            >
              {ABOUT.title}
            </motion.h2>
            {ABOUT.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="mb-4 text-base leading-relaxed text-forest/70 sm:text-lg"
              >
                {p}
              </motion.p>
            ))}
            <motion.p
              variants={fadeUp}
              className="mt-8 border-s-2 border-ember ps-5 font-display text-xl font-bold leading-snug text-forest sm:text-2xl"
            >
              {ABOUT.signature}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
