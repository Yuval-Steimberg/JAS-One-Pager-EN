"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ACTIVITIES, CONTACT } from "@/data/siteContent";
import { SectionWrapper } from "@/components/SectionWrapper";
import { ZoomScrollImage } from "@/components/ZoomScrollImage";
import { KineticWord } from "@/components/KineticWord";
import { fadeUp, staggerContainer, clipReveal } from "@/lib/animations";
import { cn } from "@/lib/utils";

const FIELDS: { key: keyof (typeof ACTIVITIES)[number]; label: string }[] = [
  { key: "problem", label: "האתגר" },
  { key: "solution", label: "הפתרון" },
  { key: "audience", label: "למי זה מתאים" },
  { key: "impact", label: "ההשפעה" },
];

export function ActivityAreas() {
  return (
    <SectionWrapper
      id="activity"
      tone="cream"
      kicker="מרחבי פעולה"
      title={"איפה אנחנו\nיוצרים שינוי"}
      intro="שלושה מרחבי פעולה שבהם אנחנו הופכים פסולת לערך — בקנה מידה עירוני, מסחרי וקהילתי."
      decorative={
        <KineticWord
          text="CHANGE · שינוי"
          direction="ltr"
          className="top-10 text-[18vw] text-sage/[0.07]"
        />
      }
    >
      <div className="space-y-20 sm:space-y-28">
        {ACTIVITIES.map((activity, i) => {
          const reversed = i % 2 === 1;
          return (
            <motion.article
              key={activity.title}
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
            >
              {/* Image */}
              <motion.div
                variants={fadeUp}
                className={cn(reversed ? "lg:order-2" : "lg:order-1")}
              >
                <ZoomScrollImage
                  src={activity.image}
                  alt={activity.alt}
                  ratio="3/2"
                  zoom={[1.1, 1]}
                  direction="out"
                  className="rounded-xl2 shadow-lift"
                />
              </motion.div>

              {/* Text */}
              <div className={cn(reversed ? "lg:order-1" : "lg:order-2")}>
                <motion.span variants={fadeUp} className="section-kicker">
                  {String(i + 1).padStart(2, "0")} · {activity.subtitle}
                </motion.span>
                <motion.h3
                  variants={fadeUp}
                  className="mb-6 mt-2 text-3xl font-bold sm:text-4xl"
                >
                  {activity.title}
                </motion.h3>
                <dl className="space-y-4">
                  {FIELDS.map((field) => (
                    <motion.div
                      key={field.key}
                      variants={fadeUp}
                      className="border-s-2 border-clay/30 ps-4"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wider text-clay">
                        {field.label}
                      </dt>
                      <dd className="mt-0.5 text-base leading-relaxed text-ink/75">
                        {activity[field.key]}
                      </dd>
                    </motion.div>
                  ))}
                </dl>
                <motion.a
                  variants={fadeUp}
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-ink-700"
                >
                  למידע נוסף
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </motion.a>
              </div>
            </motion.article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}