import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EXPERIENCES, CONTACT } from "@/content/site";
import { SectionWrapper } from "@/components/primitives/SectionWrapper";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function ExperienceCards() {
  return (
    <SectionWrapper
      id="experience"
      tone="cream"
      kicker="חוויה ב-JAS"
      title={"סדנאות, סיורים\nוחוויות יצירה"}
      intro="מושלם לארגונים, ימי הולדת, מפגשי חברים וכל רעיון אחר — חוויה שמשלבת יצירה, למידה והשראה."
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
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="group flex flex-col overflow-hidden rounded-xl2 bg-white shadow-soft"
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <img
                src={exp.image}
                alt={exp.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
              />
              <span className="absolute bottom-3 end-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-semibold text-ember shadow-soft">
                {exp.detail}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-2 text-xl font-bold">{exp.title}</h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-forest/65">
                {exp.text}
              </p>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-ember"
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
