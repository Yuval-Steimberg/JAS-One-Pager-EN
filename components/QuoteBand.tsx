"use client";

import { motion } from "framer-motion";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

/** Emotional pause between sections — the brand's core message. */
export function QuoteBand() {
  return (
    <section
      aria-label="המסר שלנו"
      className="texture-paper relative overflow-hidden py-24 sm:py-32"
    >
      <KineticWord
        text="SECOND LIFE · חיים שניים"
        direction="ltr"
        className="top-1/2 -translate-y-1/2 text-[18vw] text-sage/[0.10]"
      />
      <motion.blockquote
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="container relative max-w-3xl text-center"
      >
        <motion.span
          variants={fadeUp}
          aria-hidden
          className="block font-display text-7xl leading-none text-clay/25"
        >
          ״
        </motion.span>
        <motion.p
          variants={fadeUp}
          className="-mt-4 font-display text-2xl font-bold leading-snug text-ink sm:text-4xl"
        >
          רגע אחד לפני שקונים משהו חדש או זורקים משהו ישן — עוצרים לשנייה אחת.
        </motion.p>
        <motion.footer
          variants={fadeUp}
          className="mt-6 text-base text-ink/55 sm:text-lg"
        >
          Just A Second — כי רגע אחד של מחשבה יכול לשנות את העתיד.
        </motion.footer>
      </motion.blockquote>
    </section>
  );
}