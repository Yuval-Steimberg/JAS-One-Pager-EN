# Just A Second — One-Pager (English)

Single-page marketing site for **Just A Second (JAS)**, Israel's first venture for
reuse and upcycling. From waste to life — upcycling objects, uplifting lives.

## Contents

- `index.html` — the complete, self-contained one-pager (HTML + inline CSS + JS).
- `*.jpeg` — product, workshop, and gallery photography used across the page.
- `jas-logo.png` — brand logo, used as the site favicon.

The page is fully static: no build step, no dependencies, and no server required.
Fonts load from Google Fonts; everything else is bundled in the repo.

## Sections

Hero · Mission · Impact stats · Partners · Photo mosaic · Services · Gallery shop ·
Workshops & events · Team · Quote · Call to action with contact details.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Because the site is fully static, host it on any static host (GitHub Pages,
Netlify, Vercel, etc.) by publishing the repository root.

## Notes

- Content sections fade in on scroll. If JavaScript is unavailable, a `<noscript>`
  fallback shows all content immediately.
- Contact links (address, WhatsApp, email, Instagram) and the call-to-action
  buttons point to live JAS channels.
</content>
