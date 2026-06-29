import { motion } from "framer-motion";
import { TEAM } from "@/content/site";
import { SectionWrapper } from "@/components/primitives/SectionWrapper";
import { fadeUp, staggerContainer, spring } from "@/lib/animations";

export function Team() {
  return (
    <SectionWrapper
      id="team"
      tone="forest"
      kicker="הצוות שלנו"
      title="האנשים שמאחורי המשימה"
      intro="צוות קטן ונחוש, עם המון מתנדבים ולוחמי מילואים, שמניע את כל המעגל קדימה."
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
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ember/20 font-display text-2xl font-bold text-ember"
            >
              {member.initial}
            </motion.div>
            <h3 className="text-sm font-bold text-cream">{member.name}</h3>
            <p className="mt-0.5 text-xs font-medium text-ember">{member.role}</p>
            <p className="mt-1 text-xs text-cream/45">{member.desc}</p>
          </motion.li>
        ))}
      </motion.ul>
    </SectionWrapper>
  );
}
