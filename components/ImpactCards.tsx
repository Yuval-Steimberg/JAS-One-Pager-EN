"use client";

import { motion } from "framer-motion";
import { Leaf, Users, Recycle } from "lucide-react";
import { PILLARS } from "@/data/siteContent";
import { SectionWrapper } from "@/components/SectionWrapper";
import { TiltCard3D } from "@/components/TiltCard3D";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, viewportOnce, clipReveal } from "@/lib/animations";

const ICONS = [Leaf, Users, Recycle];

export function ImpactCards() {
  return (
    <SectionWrapper
      id="impact"
      tone="cream"
      kicker="שלושה מעגלי השפעה"
      title={"חפץ אחד,\nשלושה סוגי ערך"}
      intro="כל פריט שעובר אצלנו מיחדוש מייצר השפעה בשלושה מישורים שמזינים זה את זה."
      decorative={
        <KineticWord
          text="VALUE · ערך"
          direction="ltr"
          className="top-8 text-[18vw] text-clay/[0.05]"
        />
      }
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-6 md:grid-cols-3"
      >
        {PILLARS.map((pillar, i) => {
          const Icon = ICONS[i] ?? Leaf;
          return (
            <motion.div key={pillar.key} variants={fadeUp}>
              <TiltCard3D className="h-full" max={7}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl2 bg-cream shadow-soft transition-shadow duration-500 hover:shadow-lift">
                  <motion.div
                    variants={clipReveal}
                    className="relative aspect-[16/11] overflow-hidden"
                  >
                    <img
                      src={pillar.image}
                      alt={pillar.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover/tilt:scale-105"
                    />
                    <span className="absolute end-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-ivory/95 text-clay shadow-soft">
                      <Icon className="h-6 w-6" />
                    </span>
                  </motion.div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="mb-3 text-2xl font-bold">{pillar.title}</h3>
                    <p className="text-base leading-relaxed text-ink/65">
                      {pillar.text}
                    </p>
                  </div>
                </article>
              </TiltCard3D>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
