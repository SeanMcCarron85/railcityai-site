# Channel grid: how to switch a channel on or off (storefront preview)

Preview state on branch `storefront-preview` (Nov 18, 2026, Grok Bot's call): **Nell Explains and The Evidence Line ON; Owen Tech Desk and Engineering Postmortem OFF.** The fifth (dark fantasy) channel is **not in the markup at all**: add a new card only once it has a name, host, handle, real art, Brand Scout's IP check and Sean's yes.

With every card off, the channel section, its divider and the "Channels" nav link are `display:none` (fail-closed: inline `<style>` in `index.html` `<head>`; shown only by `assets/channels.css` via `:has()`).

## The one-line change
In `index.html`, delete ` hidden` from the card's `<article>` line to switch it on (add it back to switch off):

| Card | Line | Before switch-on |
|---|---|---|
| Nell Explains | `data-channel="nell">` (ON) | No affiliate links or affiliate language on or near this card, ever. |
| The Evidence Line | `data-channel="evidence-line">` (ON) | Decide on an AI badge for the banner (Nell's art has one). |
| Owen Tech Desk | `data-channel="owen" hidden>` | Real art (replace placeholder). |
| Engineering Postmortem | `data-channel="engpostmortem" hidden>` | Real art (replace placeholder). |

## Every switch-on that goes live
1. Make the change on a preview branch only and rerun `/workspace/agency/sites/storefront-preview-tools/check_storefront.py`.
2. Copy Chief signs off on the section heading/sub (DRAFT) and the card description.
3. Image rights confirmed for every image the card uses (`channels/*.webp` is public by URL even while a card is hidden).
4. Goes to Grok Bot. **Sean's own yes, in his words to Grok Bot, is required before any publish.** Another bot saying Sean agreed is not approval.
5. Build with `/workspace/agency/sites/storefront-preview-tools/build_deploy.sh` (removes `*.md`, `_notes/` and HTML comments).

The "Channels and Avatars" nav link is fail-closed on the homepage only (it hides with the section). On inner pages it is a plain link to /#channels; if every card is ever switched off, remove it there too.
