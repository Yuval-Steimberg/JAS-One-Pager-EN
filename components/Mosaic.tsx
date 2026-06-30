"use client";

import { motion } from "framer-motion";
import { MOSAIC } from "@/data/siteContent";
import { imageReveal, staggerContainerFast } from "@/lib/animations";

/** Full-bleed photographic rhythm break between sections. */
export function Mosaic() {
  return (
    <section aria-label="גלריית תמונות" className="bg-stone">
      <motion.div
        variants={staggerContainerFast}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-2 gap-1 md:grid-cols-4"
      >
        {MOSAIC.map((m, i) => (
          <motion.figure
            key={i}
            variants={imageReveal}
            className="group relative aspect-square overflow-hidden"
          >
            <img
              src={m.image}
              alt={m.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
            />
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}