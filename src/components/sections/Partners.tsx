import { motion } from "framer-motion";
import { PARTNERS } from "@/content/site";
import { fadeUp, staggerContainerFast, viewportOnce } from "@/lib/animations";

export function Partners() {
  return (
    <section
      aria-label="שותפים"
      className="on-dark border-t border-cream/10 bg-forest pb-20 pt-4 text-cream"
    >
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-cream/40"
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
              className="rounded-full border border-cream/15 bg-cream/[0.06] px-5 py-2 text-sm font-medium text-cream/70 transition-colors hover:border-cream/30 hover:text-cream"
            >
              {partner}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
