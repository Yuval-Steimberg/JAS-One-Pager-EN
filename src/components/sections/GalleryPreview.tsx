import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GALLERY, PRODUCTS } from "@/content/site";
import { TiltCard3D } from "@/components/primitives/TiltCard3D";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

export function GalleryPreview() {
  return (
    <section
      id="gallery"
      aria-label={GALLERY.kicker}
      className="on-dark relative scroll-mt-[72px] overflow-hidden bg-forest py-20 text-cream sm:py-28 lg:py-32"
    >
      <div aria-hidden className="texture-dots absolute inset-0 opacity-70" />
      <div className="container relative">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="max-w-xl"
          >
            <motion.p variants={fadeUp} className="section-kicker mb-3">
              {GALLERY.kicker}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="whitespace-pre-line text-fluid-h2 font-bold leading-tight text-cream"
            >
              {GALLERY.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-base leading-relaxed text-cream/70 sm:text-lg">
              {GALLERY.lead}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-3 text-base leading-relaxed text-cream/55">
              {GALLERY.note}
            </motion.p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            href={GALLERY.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group shrink-0"
          >
            {GALLERY.cta.label}
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </motion.a>
        </div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PRODUCTS.map((product) => (
            <motion.li key={product.name} variants={fadeUp}>
              <TiltCard3D className="h-full" max={9} lift={10}>
                <article className="flex h-full flex-col overflow-hidden rounded-xl2 bg-cream text-forest shadow-lift">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1.1s] ease-editorial group-hover/tilt:scale-110"
                    />
                    <span className="absolute end-3 top-3 rounded-full bg-ember px-3 py-1 text-xs font-semibold text-white shadow-soft">
                      {product.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ember">
                      {product.category}
                    </p>
                    <h3 className="mt-1 text-lg font-bold">{product.name}</h3>
                    <p className="mt-auto pt-3 text-lg font-bold text-forest">
                      {product.price}
                    </p>
                  </div>
                </article>
              </TiltCard3D>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="mt-10 flex flex-wrap gap-2.5"
        >
          {GALLERY.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cream/20 px-4 py-1.5 text-sm text-cream/75"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
