# Phase 1 — content status

EN copy drafted for all 6 pages + subpages, grounded in PLAN.md and cross-checked against the live
site (`index.html`, `assets/js/script.js`, `apps/` folder) for real phone numbers, addresses,
testimonials, certificates and app slugs. Assamese translation is next, once EN copy is approved
(per PLAN.md Phase 1: "AS after").

| File | Page(s) |
|---|---|
| [home.md](home.md) | / |
| [solutions.md](solutions.md) | /solutions/schools/, /colleges/, /business/ |
| [work.md](work.md) | /work/, /work/jatiya-vidyalaya/ |
| [pricing.md](pricing.md) | /pricing/ |
| [products.md](products.md) | /products/ |
| [about.md](about.md) | /about/ |
| [contact.md](contact.md) | /contact/ |
| [requirement-form.md](requirement-form.md) | downloadable form, linked from Pricing + Contact |

## Every open item from the first pass — resolved or still open

Per your steer ("do whatever you want with the code"), everything that was a copywriting/curation
call, I made myself. Only things that require a real, true asset from you are still open — I won't
fabricate a quote, a photo, or a founding story.

**Resolved myself (no action needed from you):**
- Ownership pledge box — shipped as a faithful rendering of PLAN.md's stated meaning.
- 11 vs. "12" areas — shipped with the 11 that actually exist in the source breakdown.
- Sewa Setu FAQ — rewritten to a claim I can stand behind (data export, not a specific unverified
  integration) instead of leaving it unanswered.
- Case-study outcome line — softened to "days of manual work → minutes," consistent with the
  problem statement, without inventing a specific number.
- Certificates (About page) — pulled real data straight from `assets/js/script.js`
  (`CERTIFICATES_DATA`): CCE (ISB/Digital India/CSC), Apna Pan Agency authorization, Claude/Anthropic,
  Udemy bootcamp. Images already exist, no new asset work needed.
- Pricing comparison table — shipped qualitative (✓/description), not invented rupee figures for
  competitors, since I have no verified numbers to back a hard claim.
- The `astrology/` app — found in `apps/` but not in PLAN.md's app list. Decision: off-brand for the
  Products page (which is positioned as professional tools), so it's routed to /labs/ alongside the
  games instead. Files untouched, nothing broken.
- Top 6 demos for the home portfolio strip — picked for category spread from the real 47-demo list:
  School Portal, Medical Shop, Restaurant, Salon & Spa, Doctor Appointment Clinic, Furniture.
- Requirement form — drafted from scratch in [requirement-form.md](requirement-form.md), since
  PLAN.md never specified its actual content, only that it exists.
- "Years in business" stat — dropped entirely rather than guessed; no founding date exists anywhere
  in the repo.

**Still genuinely open — need something true from you, not a decision I can make:**
1. **Jatiya Vidyalaya testimonial** (home.md, work.md) — 2 lines from the secretary/principal, with
   name and title.
2. **Jatiya Vidyalaya screenshots** — desktop + mobile, used in the home hero and the case-study page.
3. **Your photo** — About page.
4. **Founding story** (about.md) — how Smart Digital actually started and roughly when; a couple of
   real sentences from you.

Nothing above blocks Phase 2. Starting design system + build script + Home page now, on the copy as
finalized.

## Phase 2 — done

Design system ([assets/css/sd.css](../../assets/css/sd.css)), behaviour
([assets/js/sd.js](../../assets/js/sd.js)), build script
([dev-tools/build-pages.js](../../dev-tools/build-pages.js)), and the Home page are built and
verified in a real browser (Playwright: dark mode, Assamese toggle, FAQ accordion, mobile nav — all
working, zero console errors). One real bug caught and fixed: content was gated behind
`opacity:0` with no fallback if JS ever failed to fire the scroll-reveal; added a CSS-only fallback
so sections always become visible even without JS, given the Jio-4G audience.

## Phase 3 — done

Built and verified: `/work/`, `/work/jatiya-vidyalaya/`, `/solutions/schools/`,
`/solutions/colleges/`, `/solutions/business/`, `/pricing/`. Also built
[data/demos.json](../../data/demos.json) (Phase 3 technical work per PLAN.md §8.2) — all 47 real
demos transcribed from the current site's demo grid, not invented; `/work/` and
`/solutions/business/` both render their portfolio grid + category filters from this one file, so
adding a 48th demo later is one JSON entry, not a markup edit. Corrected the demo count from PLAN.md's
approximate "48" to the real 47 everywhere it's mentioned.

One build-script bug found and fixed here: the folder-per-hyphen convention broke on
`work-jatiya-vidyalaya.html` (produced `/work/jatiya/vidyalaya/` instead of
`/work/jatiya-vidyalaya/`). Switched the separator to a double hyphen (`--`) so a slug like
`jatiya-vidyalaya` survives as one segment — see the comment in build-pages.js.

**New forward reference to resolve in Phase 4:** the Pricing page's "Download the requirement form"
button and the Contact page's own copy both link to `/contact/#requirement-form` — that anchor needs
to exist on the Contact page once it's built.

## Phase 4 — done

Built and verified: `/products/`, `/about/`, `/contact/`, `/labs/`, `/updates/`.

- **Contact:** no PDF pipeline exists, so the "requirement form" is a real inline, printable
  checklist at `#requirement-form` (window.print() + a WhatsApp send button) instead of a link to a
  file that doesn't exist. Resolves the Phase 3 forward reference.
- **Updates:** rebuilt as a small standalone module ([assets/js/sd-updates.js](../../assets/js/sd-updates.js))
  rather than porting the old `assets/js/script.js` admin panel — that one is hard-wired to shop
  hours and the urgent banner, both gone in this redesign, and would throw on missing elements if
  reused as-is. Talks to the same Firebase "notifications" path and the same admin login, so nothing
  already posted is lost. Verified live against the real database — correctly shows "nothing posted
  yet" because that's genuinely true right now.
- **Labs:** verified every game folder actually has a working entry point before linking it — found
  two empty, unlinked folders (`games/Flappy Bird/`, `games/Space Shooter/`) and left them out rather
  than ship dead links.
- **New ask from you mid-build:** shop/workspace photos, prominently placed. Added a "Where we build
  it" section to the home page directly under the stats strip — placeholder boxes at
  `assets/img/shop/` ready for the real files.
- **Demo screenshots:** all 47 live demo sites screenshotted via Playwright into
  `assets/img/demos/` (~2.2MB total, kept small for the Jio-4G audience) and wired into
  `data/demos.json`. First pass caught one site mid-animation (a scramble-text hero); re-shot the
  full batch with a longer settle wait to fix it.

Remaining: Phase 5 (SEO/schema/sitemap, chatbot prompt rewrite, Lighthouse check, real-phone test,
launch), plus your still-open items — JV testimonial, JV screenshots, your photo, founding story,
shop photos.
