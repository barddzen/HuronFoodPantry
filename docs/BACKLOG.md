# Backlog — Huron Helping Hands Website

Stage vocab: TODO, In progress, Blocked, Deferred, Won't do, Done, Archived.

Mirrored in Todoist: **[Huron Food Pantry](https://app.todoist.com/app/project/6hHGxvXJfqJ7m98M)** — sections match the stages above. Keep the two in sync; `/done` reconciles them.

## In progress

(none)

## TODO

- **Photography** (design overhaul): pull usable images from Facebook; request specific shots from client for the gaps.
- **Optional design polish**: warm accent (`--hhh-warm`) used more, hero imagery.
- **Current Needs date stale.** [ways-to-give-current-needs.html](../site/ways-to-give-current-needs.html) still reads "Last updated: January 2026." Refresh the list + date (address already updated).
- **Client action — delete stray S3 object:** `aws s3 rm s3://www.huronhelpinghands.org/.DS_Store` (run on admin profile — deletes are blocked on the `claude` profile).
- **Flag to confirm — Vine & Olive location.** Research places it in Sandusky (4917 Milan Rd), not Huron. Cards omit city so nothing wrong is shown, but confirm it's the intended sponsor.
- **Flag to confirm — GFS** = Gordon Food Service, a national distributor (HQ Grand Rapids, MI) — included as supplier/sponsor.

## Blocked

- **CashApp/Venmo block** (monetary page): tap-to-pay deep-link buttons (primary on mobile) + QR with "tap vs scan" explainer. Waiting on handles + QR images.
- **Meet the Team + volunteer spotlight.** Waiting on photos + bios.

## Deferred

(none)

## Won't do

(none)

## Done

### Batch 1 (2026-07-06, deployed + verified live)

- Hero secondary buttons fixed — were rendering white-on-white; `.hero .btn` now keeps navy text, no underline ([style.css](../site/css/style.css)).
- Address relocation 820 Cleveland Rd E → **607 S. Main St** across all pages, footer ([main.js](../site/js/main.js)), Google Maps links, and CLAUDE.md.
- 501(c)(3) highlighted: footer line, About callout, monetary-page copy (no EIN — client didn't have it).
- Newsletter unlinked from nav. Page file + AWS infra (Lambda/DynamoDB/API GW) intentionally kept dormant (~$0).
- Simply Give master off-switch: `CAMPAIGNS` flag in [main.js](../site/js/main.js) hides every `[data-campaign="simply-give"]` surface (home banner, events promos, monetary highlight, About mention, Projects nav link). Flip to `true` to restore.
- Community Partners section on homepage — Firelands Vending, Humane Society of Erie County, Gordon Food Service, Cornell's Foods, Vine & Olive. Logos hosted locally under `site/images/sponsors/`, cards link out to each site.
- CLAUDE.md CloudFront note corrected to "live".

### Batch 2/3 (2026-07-06, deployed + verified live)

- NFC/QR digital card at **[/card](https://www.huronhelpinghands.org/card)** — standalone `card/index.html` + vCard (`huron-helping-hands.vcf`). Save-to-Contacts, contact rows, Donate/Facebook/Website buttons. `/card` 302-redirects to `/card/` via the S3 website origin. URL handed to client for card production.
- Facebook feed on the homepage — Page Plugin iframe, sized to container (up to 500px) via a guarded script in main.js so it never clips on mobile. Confirmed pulling live posts.
- Design overhaul **iteration 1** — "warm & community" system pass (cream neutrals, larger radii, softer navy-tinted shadows, more section spacing). Applies site-wide via shared CSS. Direction chosen by client.

### Batch 4 (2026-07-07)

- **Logo swap — corrected hands.** The prior upscaled mark had AI-mangled fingers (two thumbs); replaced with new transparent master `print-assets/hhh_transv2.png`. Regenerated the webp set (header/card `hhh-logo-full.webp`, favicon `hhh-logo.webp`) + `hhh-logo.jpg` — deployed to S3, CloudFront-invalidated, verified live (byte-match). No HTML/CSS change: header + card already plate the logo on white.
- **QR + print collateral for [/card](https://www.huronhelpinghands.org/card/).** Standalone QR — vector PDF (scales for print) + 2400px PNG, navy modules, center logo, error-correction H so the logo doesn't break decoding. Plus a 24-up **Avery 22805** label sheet (`hhh-card-qr-labels-avery22805.pdf`). All in `print-assets/` — local print deliverables, not deployed. Print at 100% / actual size. Real 22805 die verified (side margin 0.78125", col pitch 1.8125", top 0.5", row 1.7"); positions confirmed perfect on a test print.

### Design overhaul

- Homepage restructured (compact two-column hero, split sections, logo strip).
- Interior content pages restructured with a reusable `.two-col` wrapper (about, events, receiving-goods, monetary, current-needs, guidelines, volunteers) + two-column FAQ + tighter section padding. `get-involved-projects` (Simply Give, unlinked) and `get-involved-newsletter` (unlinked) left on the old structure since they're dormant.

## Archived

(none)
