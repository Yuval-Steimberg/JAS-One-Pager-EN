"use client";

import { motion } from "framer-motion";
import { PARTNERS } from "@/data/siteContent";
import { fadeUp, staggerContainerFast, viewportOnce } from "@/lib/animations";

export function Partners() {
  return (
    <section
      aria-label="שותפים"
      className="bg-cream pb-20 pt-16 text-ink"
    >
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-charcoal/45"
        >
          גאים לעבוד עם
        </motion.p>
        <motion.ul
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2.5"
        >
          {PARTNERS.map((partner) => (
            <motion.li
              key={partner}
              variants={fadeUp}
              className="rounded-full border border-ink/15 bg-ivory px-5 py-2 text-sm font-medium text-charcoal/70 shadow-soft transition-colors hover:border-clay/40 hover:text-ink"
            >
              {partner}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}