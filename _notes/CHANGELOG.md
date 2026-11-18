# Changelog (railcityai-site)

## 2026-11-18 — storefront-preview branch — NOT DEPLOYED
Branch `storefront-preview` off `main` @ 1e11360. Preview only. Not merged, not deployed. Merge/deploy needs Sean's yes in his own words to Grok Bot.

- Copy: Copy Chief storefront copy v2 (passed QG + Brand Boss), with Grok Bot's fills (Terms entity/law/contact/§5, footer, Prompt Wise).
- New /templates/, /gear/ (Prompt Wise paid link + affiliate disclosure; no Amazon sentence yet; Skool held) and /merch/ pages. Draft Terms of Use (storefront + merch). Footer: phone and street address removed.
- New creator-storefront homepage (`/`) in the existing dark theme: cinematic hero ("Watch on YouTube" -> #channels), channel grid (Nell Explains + The Evidence Line on; Owen Tech Desk + Engineering Postmortem hidden; no fifth card in markup), templates / gear / merch as coming-soon sections. Header markup and CSS unchanged (nav link list only).
- Custom Builds paused (Sean, Nov 18): the consulting homepage, interactive workflow tour (/showcase), /agents, /websites (+ sample sites), /pricing, /video and the thank-you pages are removed. Old top-level URLs are noindex redirect stubs to `/`. No /custom page, no booking/Cal.com links, no $500 / $99 prices, no checkout links.
- Removed: the 14-day delivery guarantee and first-payment refund copy, the free video pilot that required an honest review/testimonial, the "Zero-Leak" claim, `/preview/showcase/` and `/preview/websites/`.
- Terms: removed the video delivery-guarantee, refunds, free-pilot and custom-builds sections; renumbered. Privacy: removed the booking-details line. Copy Chief is drafting storefront/merch Terms.
- Removed orphaned assets: agents.js, home.js, pages.css, video.css, video.js, samples/ (client sample reels), presenters/, maya-hollis.jpg, video/maya-welcome.*. Added assets/storefront.css. Sitemap and robots updated.
- Notes live in `_notes/` (Jekyll never publishes `_` folders; the build script also strips `*.md`).
