# Just A Second — Website

A premium, animated, **Hebrew RTL** website for **Just A Second** (justasecond.co.il)
— Israel's reuse & upcycling initiative. Built as a custom, editorial, scroll-driven
experience: an **Apple-style cinematic scroll-scrub hero video**, infinite tickers,
3D tilt cards, zoom-on-scroll imagery, sticky storytelling, parallax depth, animated
counters, and polished anchor navigation with active-section tracking.

Warm, bright identity: **ivory / recycled-paper base** with **clay (terracotta)** and
**sage (olive)** accents and **deep-forest** headings — dark tones used only sparingly
(stats band + footer).

> The original English single-file landing page is preserved at
> [`/legacy/index.html`](./legacy/index.html).

---

## Tech stack

| Concern    | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | **Next.js 14 (App Router) + TypeScript**          |
| Styling    | **Tailwind CSS** (warm ivory brand tokens)        |
| Animation  | **Framer Motion 12**                              |
| Icons      | lucide-react                                      |
| Fonts      | Heebo (UI) + Frank Ruhl Libre (editorial Hebrew serif) |
| Hosting    | Vercel (zero-config) / Netlify (Next runtime)     |

## Run it

```bash
npm install
npm run dev        # http://localhost:8080  → scroll the hero to test the scrub
npm run build      # production build
npm run start      # serve the production build on :8080
```

Requires Node 18+ (built/tested on Node 22).

## Project structure

```
app/
  layout.tsx          # <html lang=he dir=rtl>, SEO/OG metadata, fonts, JSON-LD, MotionProvider
  page.tsx            # section composition (the whole site)
  globals.css         # Tailwind layers, RTL base, warm textures, buttons, reduced-motion
components/           # all UI + reusable motion primitives (flat, "use client")
  Header · MobileMenu · ScrollHero · SectionWrapper · AnimatedText · ScrollRevealText
  ZoomScrollImage · InfiniteTicker · TiltCard3D · ParallaxSection · StickyStorySection
  Counter · MotionProvider
  About · ImpactCards · ProcessTimeline · GalleryPreview · Mosaic · ExperienceCards
  ActivityAreas · StatsSection · Team · Partners · QuoteBand · LocationSection
  VolunteerDonationSection · ContactSection · Footer
data/
  siteContent.ts      # ← ALL copy, photos, stats, products, links (single source of truth)
lib/
  animations.ts       # reusable Framer variants + spring presets + easing
  useActiveSection.ts # IntersectionObserver → active nav + URL hash sync
  smoothScroll.ts     # header-offset smooth anchor scroll + on-load hash scroll
  utils.ts            # cn() helper
public/
  hero.mp4            # cinematic scroll-scrub hero video (H.264, all browsers)
  videos/hero.webm    # smaller fallback clip
  images/             # photography + logo (drop-in replaceable)
```

## The scroll-scrub hero (`components/ScrollHero.tsx`)

`"use client"` · 300vh container · sticky full-viewport `<video>` (object-cover) ·
muted/playsInline/preload, **paused on mount** · scroll progress from
`getBoundingClientRect` → target time · rAF loop that **lerps `currentTime`
(smoothing 0.22)** for a gliding playhead · cleanup on unmount · 200ms fade-in ·
subtle gradient scrim + Hebrew headline/subheadline/CTAs/scroll-cue overlay ·
`prefers-reduced-motion` fallback. Background + encoding tips:
[`docs/SCROLL_SCRUB_HERO.md`](./docs/SCROLL_SCRUB_HERO.md).

To swap the video, replace `public/hero.mp4` (no code change). For the smoothest
scrub, re-encode with dense keyframes (`ffmpeg -g 2 -keyint_min 2 …` — see the doc).

## Anchor navigation

Header links map to section `id`s; clicking smooth-scrolls (with header offset),
updates `location.hash`, and the active link tracks the viewport. Refreshing on a
`#hash` scrolls to that section. Sections: `home, about, gallery, experience,
activity, team, volunteer, contact` (+ `impact, process, impact-numbers, location`).

## Editing content

Everything lives in **`data/siteContent.ts`** — copy (Hebrew; `\n` = line break in
titles), photos (`asset("file.jpeg")` → `/public/images`), products/stats/team/
partners/activities (typed arrays), contact/hours/links, and the `NAV` array.

## Accessibility & SEO

Semantic landmarks, one `<h1>`, skip link, focus rings, keyboard menu (Esc + scroll
lock), Hebrew `alt`, `prefers-reduced-motion` via `MotionProvider` + CSS. Hebrew
title/description, Open Graph/Twitter, Organization JSON-LD, canonical (Next Metadata API).

## Performance

Transform/opacity-only animations, fixed aspect ratios (no CLS), lazy/`async` images,
`fetchPriority` poster, vendor code-split. Replace the source JPEGs with optimized,
resized `.webp`/`.avif` before launch — the biggest remaining win.

## Deploy

- **Vercel (recommended):** import the repo — Next.js is auto-detected, zero config.
- **Netlify:** `netlify.toml` enables the official Next.js runtime plugin; import the repo.

Both build on the provider's infra. (The original `justasecond.co.il` content and idea
are preserved; this is a full premium rebuild with a warm new identity.)
