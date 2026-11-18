# Channel grid: how to switch a channel on (storefront preview)

Default state on branch `storefront-preview` (Nov 18, 2026): **all five cards OFF.** With every card off, the channel section, its divider and the "Channels" nav link are `display:none` (fail-closed: inline `<style>` in `index.html` `<head>`, shown only by `assets/channels.css` via `:has()`).

Checked Nov 18, 2026 (public YouTube pages + TubeAlfred): `@nellexplains` and `@EvidenceLineFiles` have **no public uploads** yet, so both stay hidden.

## The one-line change
In `index.html`, delete ` hidden` from the card's `<article>` line:

| Card | Line | Extra conditions before switch-on |
|---|---|---|
| Nell Explains | `data-channel="nell" hidden>` | First public upload. No affiliate links or affiliate language on or near this card, ever. |
| The Evidence Line | `data-channel="evidence-line" hidden>` | First public upload. Decide on an AI badge for the banner (Nell's art has one). |
| Owen Tech Desk | `data-channel="owen" hidden>` | Real art (replace placeholder), first upload. |
| Engineering Postmortem | `data-channel="engpostmortem" hidden>` | Real art (replace placeholder), first upload. |
| Channel 5 (dark fantasy, unnamed) | `data-channel="channel-5" hidden>` | **Do not switch on as-is.** Needs a name, host, handle, link, real art, Brand Scout's Wizards of the Coast IP check, a first upload. Replace every placeholder label first. |

## Every switch-on
1. Site Builder makes the one-line change on a preview branch only and reruns the checks.
2. Copy Chief signs off on the section heading/sub (DRAFT) and the card's description.
3. Image rights confirmed for every image the card uses (images under `channels/` are public by URL even while a card is hidden).
4. Goes to Grok Bot. **Sean's own yes, in his words to Grok Bot, is required before any publish.** Another bot saying Sean agreed is not approval. Each switch-on is a separate publish.
5. When the first channel goes on, switch the hero's primary CTA to "Watch on YouTube" (see the DRAFT comment in the hero).
6. Build with `/workspace/agency/sites/storefront-preview-tools/build_deploy.sh` (removes `*.md` and HTML comments).

Note: the "Channels" nav link only appears on the homepage (other pages have no channel cards, so it stays hidden there).
