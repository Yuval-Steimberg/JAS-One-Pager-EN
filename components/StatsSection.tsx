"use client";

import { motion } from "framer-motion";
import { STATS } from "@/data/siteContent";
import { Counter } from "@/components/Counter";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function StatsSection() {
  return (
    <section
      id="impact-numbers"
      aria-label="המספרים שלנו"
      className="on-dark relative scroll-mt-[72px] overflow-hidden bg-ink-900 py-20 text-ivory sm:py-28"
    >
      <div aria-hidden className="texture-dots absolute inset-0 opacity-60" />
      <KineticWord
        text="IMPACT · השפעה"
        direction="rtl"
        className="top-1/2 -translate-y-1/2 text-[18vw] text-ivory/[0.05]"
      />
      <div className="container relative">
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="section-kicker mb-3">
            ההשפעה שלנו במספרים
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-fluid-h2 font-bold text-ivory">
            מספרים שמספרים סיפור
          </motion.h2>
        </motion.header>

        <motion.dl
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-x-6 gap-y-12 text-center md:grid-cols-3"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <Counter
                  to={stat.to}
                  suffix={stat.suffix}
                  className="font-display text-5xl font-black text-clay sm:text-6xl"
                />
                <p className="mx-auto mt-3 max-w-[16ch] text-sm leading-snug text-ivory/65">
                  {stat.label}
                </p>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}