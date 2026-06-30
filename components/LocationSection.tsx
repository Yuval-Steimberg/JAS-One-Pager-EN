"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, MessageCircle, Car } from "lucide-react";
import { CONTACT } from "@/data/siteContent";
import { SectionWrapper } from "@/components/SectionWrapper";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function LocationSection() {
  return (
    <SectionWrapper
      id="location"
      tone="paper"
      kicker="ביקור אצלנו"
      title="שעות פתיחה ומיקום"
      intro="בואו לבקר בחנות הגלריה — לראות, לגעת ולמצוא את הפריט הבא עם סיפור."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Info */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="space-y-5"
        >
          <motion.div variants={fadeUp} className="flex gap-4 rounded-xl2 bg-white p-6 shadow-soft">
            <Clock className="h-6 w-6 shrink-0 text-clay" />
            <div className="flex-1">
              <h3 className="mb-3 text-lg font-bold">שעות פתיחה</h3>
              <ul className="space-y-1.5">
                {CONTACT.hours.map((h) => (
                  <li key={h.day} className="flex justify-between text-sm text-ink/70">
                    <span className="font-medium">יום {h.day}</span>
                    <span className="tabular-nums" dir="ltr">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.a
            variants={fadeUp}
            href={`https://maps.google.com/?q=${CONTACT.mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl2 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <MapPin className="h-6 w-6 shrink-0 text-clay" />
            <div>
              <h3 className="text-lg font-bold">כתובת</h3>
              <p className="text-sm text-ink/70">{CONTACT.address}</p>
            </div>
          </motion.a>

          <motion.div variants={fadeUp} className="flex items-center gap-4 rounded-xl2 bg-white p-6 shadow-soft">
            <Car className="h-6 w-6 shrink-0 text-clay" />
            <div>
              <h3 className="text-lg font-bold">הגעה וחניה</h3>
              <p className="text-sm text-ink/70">חניה חופשית בסביבה · נגיש בתחבורה ציבורית</p>
            </div>
          </motion.div>

          <motion.a
            variants={fadeUp}
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group w-full"
          >
            <MessageCircle className="h-5 w-5" />
            תיאום ביקור בוואטסאפ
          </motion.a>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7 }}
          className="min-h-[360px] overflow-hidden rounded-xl2 shadow-lift"
        >
          <iframe
            title="מפת המיקום של Just A Second"
            src={CONTACT.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[360px] w-full border-0"
            allowFullScreen
          />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}