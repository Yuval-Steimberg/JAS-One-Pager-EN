"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EXPERIENCES, CONTACT } from "@/data/siteContent";
import { SectionWrapper } from "@/components/SectionWrapper";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, clipReveal } from "@/lib/animations";

export function ExperienceCards() {
  return (
    <SectionWrapper
      id="experience"
      tone="cream"
      kicker="חוויה ב-JAS"
      title={"סדנאות, סיורים\nוחוויות יצירה"}
      intro="מושלם לארגונים, ימי הולדת, מפגשי חברים וכל רעיון אחר — חוויה שמשלבת יצירה, למידה והשראה."
      decorative={
        <KineticWord
          text="EXPERIENCE · חוויה"
          direction="rtl"
          className="top-12 text-[16vw] text-sage/[0.07]"
        />
      }
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {EXPERIENCES.map((exp) => (
          <motion.article
            key={exp.title}
            variants={fadeUp}
            whileHover={{ y: -10 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="group flex flex-col overflow-hidden rounded-xl2 bg-white shadow-soft"
          >
            <motion.div
              variants={clipReveal}
              className="relative aspect-[16/11] overflow-hidden"
            >
              <img
                src={exp.image}
                alt={exp.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
              />
              <span className="absolute bottom-3 end-3 rounded-full bg-ivory/95 px-3 py-1 text-xs font-semibold text-clay shadow-soft">
                {exp.detail}
              </span>
            </motion.div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-2 text-xl font-bold">{exp.title}</h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-ink/65">
                {exp.text}
              </p>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-clay"
              >
                לפרטים והזמנה
                <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
