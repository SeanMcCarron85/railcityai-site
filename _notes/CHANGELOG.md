# Changelog (railcityai-site)

## 2026-11-18 — storefront-preview branch — NOT DEPLOYED
Branch `storefront-preview` off `main` @ 1e11360. Preview only. Not merged, not deployed. Merge/deploy needs Sean's yes in his own words to Grok Bot.

- New creator-storefront homepage (`/`) in the existing dark theme: cinematic hero, five-card channel grid (all hidden), templates / gear / merch as coming-soon sections, quiet Custom Builds band. Header markup and CSS unchanged (nav links only).
- Old consulting homepage moved to `/custom/`; `/showcase/` -> `/custom/tour/`; `/agents/` -> `/custom/agents/`; `/websites/` -> `/custom/websites/`; `/pricing/` -> `/custom/pricing/`. Old URLs are noindex redirect stubs. `/video/` is a noindex redirect stub to `/`.
- Removed: the 14-day delivery guarantee and its first-payment refund copy, the free video pilot that required an honest review/testimonial, the "Zero-Leak" claim, `/preview/showcase/` and `/preview/websites/`.
- Terms: removed video delivery-guarantee, refunds and free-pilot sections; renumbered. Full Terms/Privacy rewrite still pending (Copy Chief + lawyer).
- Sitemap and robots updated. New `assets/storefront.css`.
- Notes live in `_notes/` (Jekyll never publishes `_` folders; the build script also strips `*.md`).
