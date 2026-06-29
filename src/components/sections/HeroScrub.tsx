import { useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { HERO, videoAsset } from "@/content/site";
import { ScrollScrubHero } from "@/components/primitives/ScrollScrubHero";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

const BTN: Record<string, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

/** The site hero: an Apple-style scroll-scrub video with staged overlay copy. */
export function HeroScrub() {
  const reduce = useReducedMotion();

  return (
    <ScrollScrubHero
      id="home"
      poster={HERO.image}
      posterAlt={HERO.imageAlt}
      scrollVh={3}
      sources={[
        // Production: add an H.264 mp4 (Safari/iOS) — drop it in /public/videos.
        { src: videoAsset("hero.mp4"), type: "video/mp4" },
        { src: videoAsset("hero.webm"), type: "video/webm" },
      ]}
      overlay={(p) => (reduce ? <StaticOverlay /> : <StagedOverlay progress={p} />)}
    />
  );
}

/* ── Animated, scroll-staged overlay ───────────────────────────────────────── */
type Stage = 0 | 1 | 2;

function StagedOverlay({ progress }: { progress: MotionValue<number> }) {
  const handleNav = useSmoothScroll();
  const [stage, setStage] = useState<Stage>(0);

  // Map continuous scroll progress to a discrete narrative stage. Re-renders
  // only at the two boundaries, so it's cheap; crossfades are handled by
  // `animate` below (which binds reliably, unlike per-frame derived values).
  useMotionValueEvent(progress, "change", (v) => {
    const next: Stage = v < 0.26 ? 0 : v < 0.68 ? 1 : 2;
    setStage((prev) => (prev === next ? prev : next));
  });

  const stageTransition = { duration: 0.6, ease: EASE };

  return (
    <>
      {/* A — intro headline */}
      <motion.div
        initial={false}
        animate={{ opacity: stage === 0 ? 1 : 0, y: stage === 0 ? 0 : -50 }}
        transition={stageTransition}
        className="absolute inset-x-0 px-6"
        aria-hidden={stage !== 0}
      >
        <p className="mx-auto mb-5 inline-block rounded-full border border-cream/25 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-cream/90 backdrop-blur-sm sm:text-sm">
          {HERO.kicker}
        </p>
        <h1 className="text-fluid-hero font-black leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {HERO.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </motion.div>

      {/* B — mid statement */}
      <motion.p
        initial={false}
        animate={{
          opacity: stage === 1 ? 1 : 0,
          y: stage === 1 ? 0 : stage < 1 ? 40 : -40,
        }}
        transition={stageTransition}
        className="absolute inset-x-0 mx-auto max-w-3xl px-6 font-display text-2xl font-bold leading-snug text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] sm:text-4xl"
        aria-hidden={stage !== 1}
      >
        מהרחוב, דרך הסטודיו — ועד הבית שלכם. כל חפץ והסיפור שלו.
      </motion.p>

      {/* C — CTAs (arrive last, stay) */}
      <motion.div
        initial={false}
        animate={{ opacity: stage === 2 ? 1 : 0, y: stage === 2 ? 0 : 50 }}
        transition={stageTransition}
        style={{ pointerEvents: stage === 2 ? "auto" : "none" }}
        className="absolute inset-x-0 px-6"
        aria-hidden={stage !== 2}
      >
        <h2 className="text-fluid-h2 font-bold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {HERO.titleLines.join(" ")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base font-light text-cream/85 sm:text-lg">
          {HERO.subtitle}
        </p>
        <div className="mt-8 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
          {HERO.ctas.map((cta) => (
            <a
              key={cta.label}
              href={cta.href}
              onClick={(e) => handleNav(e, cta.href.replace("#", ""))}
              className={cn(BTN[cta.variant], "group")}
              tabIndex={stage === 2 ? 0 : -1}
            >
              {cta.label}
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue — only during the intro */}
      <motion.div
        initial={false}
        animate={{ opacity: stage === 0 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/70"
        aria-hidden
      >
        <span className="text-xs tracking-widest">{HERO.scrollCue}</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </>
  );
}

/* ── Reduced-motion: a single static, fully-accessible hero ─────────────────── */
function StaticOverlay() {
  const handleNav = useSmoothScroll();
  return (
    <div className="px-6">
      <p className="mx-auto mb-5 inline-block rounded-full border border-cream/25 bg-white/5 px-4 py-1.5 text-xs font-semibold text-cream/90 sm:text-sm">
        {HERO.kicker}
      </p>
      <h1 className="text-fluid-hero font-black leading-[0.95] text-white">
        {HERO.titleLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base font-light text-cream/85 sm:text-lg md:text-xl">
        {HERO.subtitle}
      </p>
      <div className="mt-9 flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row">
        {HERO.ctas.map((cta) => (
          <a
            key={cta.label}
            href={cta.href}
            onClick={(e) => handleNav(e, cta.href.replace("#", ""))}
            className={cn(BTN[cta.variant], "group")}
            style={{ transitionTimingFunction: `cubic-bezier(${EASE.join(",")})` }}
          >
            {cta.label}
            <ArrowLeft className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}
