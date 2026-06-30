"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Instagram, Send } from "lucide-react";
import { CONTACT, CONTACT_SECTION } from "@/data/siteContent";
import { SectionWrapper } from "@/components/SectionWrapper";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function ContactSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Placeholder: wire to a real newsletter provider (Mailchimp / Brevo …).
    setSent(true);
  }

  return (
    <SectionWrapper
      id="contact"
      tone="cream"
      kicker={CONTACT_SECTION.kicker}
      title={CONTACT_SECTION.title}
      intro={CONTACT_SECTION.lead}
      decorative={
        <KineticWord
          text="CONNECT · קשר"
          direction="ltr"
          className="top-8 text-[18vw] text-clay/[0.04]"
        />
      }
    >
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Direct channels */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="space-y-4"
        >
          <motion.a
            variants={fadeUp}
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clay/10 text-clay">
              <MessageCircle className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold">וואטסאפ</p>
              <p className="text-sm text-ink/60" dir="ltr">{CONTACT.whatsappDisplay}</p>
            </div>
          </motion.a>

          <motion.a
            variants={fadeUp}
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clay/10 text-clay">
              <Mail className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold">אימייל</p>
              <p className="text-sm text-ink/60" dir="ltr">{CONTACT.email}</p>
            </div>
          </motion.a>

          <motion.a
            variants={fadeUp}
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl2 bg-white p-5 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-clay/10 text-clay">
              <Instagram className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold">אינסטגרם</p>
              <p className="text-sm text-ink/60" dir="ltr">{CONTACT.instagramHandle}</p>
            </div>
          </motion.a>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center rounded-xl2 bg-ink p-8 text-ivory shadow-lift sm:p-10"
        >
          <h3 className="text-2xl font-bold">{CONTACT_SECTION.newsletter.title}</h3>
          <p className="mt-2 text-ivory/70">{CONTACT_SECTION.newsletter.text}</p>

          {sent ? (
            <p className="mt-6 rounded-xl bg-clay/15 px-4 py-3 text-clay-400">
              תודה! נשמור על קשר ✦
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                {CONTACT_SECTION.newsletter.placeholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={CONTACT_SECTION.newsletter.placeholder}
                className="w-full flex-1 rounded-full bg-ivory/10 px-5 py-3 text-ivory placeholder:text-ivory/40 focus:bg-ivory/15 focus:outline-none focus-visible:outline-2 focus-visible:outline-clay"
              />
              <button type="submit" className="btn-primary shrink-0">
                <Send className="h-4 w-4" />
                {CONTACT_SECTION.newsletter.button}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}