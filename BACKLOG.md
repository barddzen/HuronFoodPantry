# Backlog — Huron Helping Hands Website

Stage vocab: TODO, In progress, Blocked, Deferred, Won't do, Done, Archived.

## Done — Batch 1 (2026-07-06, deployed + verified live)

- Hero secondary buttons fixed — were rendering white-on-white; `.hero .btn` now keeps navy text, no underline ([style.css](site/css/style.css)).
- Address relocation 820 Cleveland Rd E → **607 S. Main St** across all pages, footer ([main.js](site/js/main.js)), Google Maps links, and CLAUDE.md.
- 501(c)(3) highlighted: footer line, About callout, monetary-page copy (no EIN — client didn't have it).
- Newsletter unlinked from nav. Page file + AWS infra (Lambda/DynamoDB/API GW) intentionally kept dormant (~$0).
- Simply Give master off-switch: `CAMPAIGNS` flag in [main.js](site/js/main.js) hides every `[data-campaign="simply-give"]` surface (home banner, events promos, monetary highlight, About mention, Projects nav link). Flip to `true` to restore.
- Community Partners section on homepage — Firelands Vending, Humane Society of Erie County, Gordon Food Service, Cornell's Foods, Vine & Olive. Logos hosted locally under `site/images/sponsors/`, cards link out to each site.
- CLAUDE.md CloudFront note corrected to "live".

## Batch 2 — Design overhaul (TODO)

- Design-system pass (typography scale, spacing rhythm, section treatments, softer hero) + per-page content tightening; pull imagery from Facebook.
- Facebook feed — **Page Plugin iframe** (decided over API/Lambda), styled to fit the new design.
- **Blocked — CashApp/Venmo block** on the monetary page: tap-to-pay deep-link buttons (primary on mobile) + QR with a "tap vs scan" explainer. Waiting on handles + QR images.

## Batch 3 — New builds (TODO)

- NFC/QR digital card at **`/card`** (`card/index.html` + CloudFront routing), mirroring hookedonyutz.com/david.html: logo, Save Contact vCard, address/phone/email, Facebook/Donate/Directions buttons. URL already handed to client for card production.
- **Blocked — Meet the Team + volunteer spotlight.** Waiting on photos + bios.
- **Blocked — Logo upscale swap** (webp set + favicon + all refs). Waiting on the Gemini-upscaled asset.

## Open content

- **TODO — Current Needs date stale.** [ways-to-give-current-needs.html](site/ways-to-give-current-needs.html) still reads "Last updated: January 2026." Refresh the list + date (address already updated).

## Flags to confirm

- **Vine & Olive location** — research places it in Sandusky (4917 Milan Rd), not Huron. Cards omit city so nothing wrong is shown, but confirm it's the intended sponsor.
- **GFS** = Gordon Food Service, a national distributor (HQ Grand Rapids, MI) — included as supplier/sponsor.
