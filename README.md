# Just A Second — Website

A premium, animated, **Hebrew RTL** website for **Just A Second** (justasecond.co.il)
— Israel's first reuse & upcycling venture. Built as a custom, editorial,
scroll-driven experience: a cinematic **scroll-scrub video hero** (the "Apple
product page" effect), infinite tickers, 3D tilt cards, zoom-on-scroll imagery,
sticky storytelling, parallax depth, animated counters, and polished anchor
navigation with active-section tracking.

> The previous English single-file landing page is preserved at
> [`/legacy/index.html`](./legacy/index.html).

---

## Tech stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| Framework      | **Vite + React 18 + TypeScript** (static SPA)       |
| Styling        | **Tailwind CSS** (custom warm brand tokens)         |
| Animation      | **Framer Motion 12**                                |
| Icons          | lucide-react                                        |
| Fonts          | Heebo (UI) + Frank Ruhl Libre (editorial Hebrew serif) |
| Deploy         | Any static host — `dist/` (GitHub Pages / Netlify / Vercel) |

No backend. No heavy UI kit. Everything is small, reusable, and typed.

## Run it

```bash
npm install
npm run dev       # http://localhost:8080
npm run build     # type-check + production build → dist/
npm run preview   # preview the production build
```

## Project structure

```
index.html                  # Vite entry — RTL <html dir="rtl" lang="he">, SEO + OG + JSON-LD
legacy/index.html           # the old English one-pager (kept for reference)
public/
  images/                   # all photography + logo (drop-in replaceable)
  videos/hero.webm          # generated scroll-scrub hero video (add hero.mp4 for Safari)
src/
  main.tsx · App.tsx        # bootstrap + section composition
  index.css                 # Tailwind layers, RTL base, paper textures, reduced-motion
  content/site.ts           # ← ALL copy, photos, stats, products, links (single source of truth)
  lib/
    animations.ts           # reusable Framer variants + spring presets + easing
    utils.ts                # cn() classname helper
  hooks/
    useActiveSection.ts     # IntersectionObserver → active nav + URL hash sync
    useSmoothScroll.ts      # header-offset smooth anchor scroll + on-load hash scroll
  components/
    Header.tsx · MobileMenu.tsx · Footer.tsx
    primitives/             # the reusable building blocks (see below)
      SectionWrapper · AnimatedText · ScrollRevealText · ZoomScrollImage
      InfiniteTicker · TiltCard3D · ParallaxSection · StickyStorySection
      ScrollScrubHero · Counter
    sections/               # the page sections
      HeroScrub · Hero(legacy variant) · About · ImpactCards · ProcessTimeline
      GalleryPreview · Mosaic · ExperienceCards · ActivityAreas · StatsSection
      Team · Partners · QuoteBand · LocationSection
      VolunteerDonationSection · ContactSection
```

## Sections & anchor navigation

Header links map to section `id`s; clicking scrolls smoothly (with header
offset), updates `location.hash`, and the active link tracks the viewport.
Refreshing on a `#hash` scrolls to that section.

| Nav (he)            | `id`             |
| ------------------- | ---------------- |
| בית                 | `home`           |
| עלינו               | `about`          |
| חנות הגלריה          | `gallery`        |
| חוויה ב-JAS          | `experience`     |
| מרחבי פעולה          | `activity`       |
| הצוות שלנו           | `team`           |
| התנדבות ותרומה       | `volunteer`      |
| דברו איתנו           | `contact`        |

(Plus non-nav sections: `impact`, `process`, `impact-numbers`, `location`.)

## Reusable animation primitives

- **ScrollScrubHero** — pinned cinematic hero; scroll scrubs a video's
  `currentTime`. Poster + multi-source + reduced-motion fallback. See
  [`docs/SCROLL_SCRUB_HERO.md`](./docs/SCROLL_SCRUB_HERO.md).
- **ZoomScrollImage** — cinematic scroll-linked zoom (transform-only, no layout shift).
- **InfiniteTicker** — seamless RTL/LTR marquee; slows on hover; reduced-motion safe.
- **TiltCard3D** — elegant pointer-driven 3D tilt (rotateX/Y + spring + glare); off for touch/reduced-motion.
- **ParallaxSection / FloatingShape** — layered scroll depth.
- **StickyStorySection** — pinned media that crossfades through steps as you scroll (desktop), graceful stacked timeline on mobile.
- **ScrollRevealText** — editorial per-word brighten-on-scroll (bidi-safe).
- **AnimatedText** — masked per-word/line reveal.
- **Counter** — counts up on view; Hebrew number formatting.
- **SectionWrapper** — semantic landmark + brand tone + animated header.

## Editing content (no component edits needed)

Everything lives in **`src/content/site.ts`**:

- **Copy** — edit the strings (Hebrew). Newlines (`\n`) become line breaks in titles.
- **Photos** — drop a file in `public/images/` and update the path via `asset("file.jpeg")`.
- **Products / stats / team / partners / activities** — typed arrays; add/remove items freely.
- **Contact / hours / links** — the `CONTACT` object.
- **Navigation** — the `NAV` array (label + section `id`).

## Accessibility

- Semantic landmarks (`<header> <main> <nav> <section> <footer>`), one `<h1>`, ordered headings.
- Skip-to-content link, visible on-brand focus rings, keyboard-operable menu (Esc to close, body scroll lock).
- All meaningful images have Hebrew `alt`; decorative visuals are `aria-hidden`.
- **`prefers-reduced-motion`** respected globally via `<MotionConfig reducedMotion="user">`
  and a CSS fallback; the scrub hero renders a static, fully-accessible variant.

## SEO

- `<html lang="he" dir="rtl">`, Hebrew `<title>`/description, canonical, Open Graph + Twitter, Organization JSON-LD.
- Fast static output, descriptive alt text, internal anchor links.

## Performance

- Animations use **transform/opacity only**; images use fixed aspect ratios (no CLS).
- Vendor code-split (`react`, `framer-motion`); CSS ~6 KB gzip, app JS ~25 KB gzip.
- `loading="lazy"` + `decoding="async"` on below-the-fold imagery; hero poster is `fetchPriority="high"`.
- Hero video is `preload`ed and scrubbed via an eased rAF loop (no seek backlog).
- **Replace the source photos with optimized, resized versions** before launch
  (the current JPEGs are large originals) — ideally `.webp`/`.avif` at the sizes
  actually rendered. This is the single biggest perf win.

## Notes on the legacy site → this rebuild

The old page was a single static English `index.html` with CSS keyframes and an
IntersectionObserver reveal. This rebuild keeps the brand (green `#333D36`,
orange `#E88225`, cream `#FFFCF5`, Heebo) and all real content, but adds: full
Hebrew RTL, an editorial serif, a component architecture with a content config,
a real motion system, the cinematic scroll-scrub hero, sticky storytelling,
3D/parallax depth, animated counters, and accessible anchor navigation.
