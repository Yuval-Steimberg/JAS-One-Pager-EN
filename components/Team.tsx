"use client";

import { motion } from "framer-motion";
import { TEAM } from "@/data/siteContent";
import { SectionWrapper } from "@/components/SectionWrapper";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, spring } from "@/lib/animations";

export function Team() {
  return (
    <SectionWrapper
      id="team"
      tone="cream"
      kicker="הצוות שלנו"
      title="האנשים שמאחורי המשימה"
      intro="צוות קטן ונחוש, עם המון מתנדבים ולוחמי מילואים, שמניע את כל המעגל קדימה."
      decorative={
        <KineticWord
          text="TEAM · צוות"
          direction="rtl"
          className="top-8 text-[18vw] text-clay/[0.05]"
        />
      }
    >
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5"
      >
        {TEAM.map((member) => (
          <motion.li
            key={member.name}
            variants={fadeUp}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.06, rotate: -3 }}
              transition={spring}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-clay/20 font-display text-2xl font-bold text-clay"
            >
              {member.initial}
            </motion.div>
            <h3 className="text-sm font-bold text-ink">{member.name}</h3>
            <p className="mt-0.5 text-xs font-medium text-clay">{member.role}</p>
            <p className="mt-1 text-xs text-charcoal/55">{member.desc}</p>
          </motion.li>
        ))}
      </motion.ul>
    </SectionWrapper>
  );
}