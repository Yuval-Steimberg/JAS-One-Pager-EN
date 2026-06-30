"use client";

import { motion } from "framer-motion";
import { HandHeart, Gift, MessageCircle, ArrowLeft } from "lucide-react";
import { VOLUNTEER } from "@/data/siteContent";
import { TiltCard3D } from "@/components/TiltCard3D";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, viewportOnce, EASE } from "@/lib/animations";

const ICONS = [HandHeart, Gift, MessageCircle];

export function VolunteerDonationSection() {
  const titleLines = VOLUNTEER.title.split("\n");

  return (
    <section
      id="volunteer"
      aria-label={VOLUNTEER.kicker}
      className="on-dark relative scroll-mt-[72px] overflow-hidden bg-clay py-20 text-white sm:py-28 lg:py-32"
    >
      <div aria-hidden className="texture-dots absolute inset-0 opacity-50" />
      <KineticWord
        text="GIVE · תרומה"
        direction="ltr"
        className="top-6 text-[18vw] text-white/[0.06]"
      />

      <div className="container relative">
        <motion.header
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            {VOLUNTEER.kicker}
          </motion.p>

          {/* Per-line masked slide-up */}
          <h2 className="text-fluid-h2 font-bold leading-tight text-white" aria-label={VOLUNTEER.title}>
            {titleLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  variants={{
                    hidden: { y: "115%", skewY: 3, opacity: 0 },
                    show: {
                      y: "0%",
                      skewY: 0,
                      opacity: 1,
                      transition: { duration: 0.88, ease: EASE, delay: 0.08 + i * 0.14 },
                    },
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
            {VOLUNTEER.lead}
          </motion.p>
        </motion.header>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {VOLUNTEER.cards.map((card, i) => {
            const Icon = ICONS[i] ?? HandHeart;
            return (
              <motion.div key={card.title} variants={fadeUp}>
                <TiltCard3D className="h-full" max={6} glare={false}>
                  <article className="flex h-full flex-col rounded-xl2 bg-ivory p-7 text-ink shadow-lift">
                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-clay/10 text-clay">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mb-2 text-xl font-bold">{card.title}</h3>
                    <p className="mb-6 flex-1 text-sm leading-relaxed text-ink/65">
                      {card.text}
                    </p>
                    <a
                      href={card.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory transition-all duration-200 hover:bg-ink-700 hover:scale-[1.04] active:scale-[0.97]"
                    >
                      {card.cta.label}
                      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </a>
                  </article>
                </TiltCard3D>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
