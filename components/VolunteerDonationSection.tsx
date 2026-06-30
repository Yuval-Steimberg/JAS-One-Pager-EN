"use client";

import { motion } from "framer-motion";
import { HandHeart, Gift, MessageCircle, ArrowLeft } from "lucide-react";
import { VOLUNTEER } from "@/data/siteContent";
import { TiltCard3D } from "@/components/TiltCard3D";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const ICONS = [HandHeart, Gift, MessageCircle];

export function VolunteerDonationSection() {
  return (
    <section
      id="volunteer"
      aria-label={VOLUNTEER.kicker}
      className="on-dark relative scroll-mt-[72px] overflow-hidden bg-clay py-20 text-white sm:py-28 lg:py-32"
    >
      <div aria-hidden className="texture-dots absolute inset-0 opacity-50" />
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
          <motion.h2 variants={fadeUp} className="whitespace-pre-line text-fluid-h2 font-bold leading-tight text-white">
            {VOLUNTEER.title}
          </motion.h2>
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
                      className="group inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-ink-700"
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