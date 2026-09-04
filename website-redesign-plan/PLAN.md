# Smart Digital → Web-App & Software Services company site
## Transformation plan (read before touching code)

Date: 4 Sept 2026 · Author: Claude, for Suman Biswas
Scope: smartdigitalassam.com — the copy of `smartdigital/` this folder sits in.
Nothing in this document changes code. It is the plan we agree on first.

---

## 0. One-line verdict

The site today is a **CSC shop homepage with an AI-tool hub bolted on**. You now sell **₹47k–₹72k institutional software projects** (Jatiya Vidyalaya done, Kachua Tiniali College quoted, SD-2026-002 quoted). A principal who opens the current site sees "PAN Card, Aadhaar Update, Photocopy, B&W Xerox ₹2" before he sees anything about school software. That mismatch is the whole problem — and it is a **positioning + information-architecture problem, not a CSS problem**. Re-skinning `index.html` will not fix it. Splitting it into a small multi-page company site will.

**Recommendation:** rebuild as a 6-page static company site (vanilla HTML/CSS/JS, same Netlify + Firebase, no framework), lead with institutions (schools/colleges), keep every demo, app and game but move them off the front door into their own sections, and remove all CSC/print/shop content from the site — this is now a software company site, not a CSC counter with an AI hub bolted on.

---

## 1. What the project is right now (audit)

| Area | What exists | Verdict for the new site |
|---|---|---|
| `index.html` | 218 KB single page, 11 sections: hero (shop status card, opening countdown), notice board, services (AI / offline tabs), websites (47 demo links + games), Service Enquiry (PAN, Aadhaar, Xerox quantity form), gallery, testimonials, certificates, map, contact | Split into pages. Hero, enquiry form, shop status, countdown, "hype" counters all go. |
| `<title>` / meta | "Website, PAN Card, Aadhaar & Digital Services \| Kampur" | Rewrite. This is the first thing Google shows. |
| `pricing/index.html` | Xerox / photo print / sticker / brochure / design / QR / "Starter Website ₹6,500", "Business Website ₹9,500" | Print/xerox/photo/sticker rates dropped from the site entirely. Website tiers replaced by institutional packages (see §5). |
| `apps/` (9 AI apps) | ExamCraft Pro (Razorpay, Firebase auth, admin dashboard), BizWrite, PatraLekhak, ScriptWala, ShopWrite, LipiAntar, Resume Builder, ID Maker, QR Generator | **Keep untouched.** Become the "Products" section. ExamCraft Pro is the flagship product. |
| `games/` (10) + `ideas-implementaion/periodic_table.html` | Vanilla HTML5 games, "Fun!" tab | Keep files, remove from main nav. Live at `/labs/`. |
| Demo sites (47 links to `smartdigital-sum.github.io/m-*`) | Medical shop, School Portal, Salon, Grocery, Restaurant, Gym, Clothing, Clinic, Travel, Kids School, Furniture… | **Keep all.** Curate into a portfolio grid with screenshots and filters instead of a wall of links. |
| `chatbot/` (Groq) | CSC helper persona | Keep; rewrite system prompt to qualify leads for websites/software, hand off to WhatsApp. |
| Notice board (Firebase) + admin panel | Shop announcements | Keep the mechanism; rename to "Updates" and use it for launches/case studies. |
| `generator/` "Imagine Your Business" | Lead-gen toy | Keep as a tool under Products. |
| Certificates (Apna PAN, ISB CCE, Claude) | Hero-level trust | Move to `/about/`. |
| Testimonials (Ranjit Das, Puja Bora…) | Local shop customers | Keep, but institution testimonials must come first. |
| Bilingual EN/AS (`data-en`/`data-as`), dark mode, WhatsApp-first, low-bandwidth | Real strengths | Keep. These are differentiators — no competitor has AS. |
| Tech | Netlify static + functions (Groq/Claude proxy, Razorpay), Firebase RTDB/Auth, no build step | Keep. Add one tiny build step for shared header/footer (see §7). |
| Loose files at root | `apply_seo.py`, `update_seo.py`, `diff_*.txt`, `ExamCraft_Pro_Board_Specific_Implementation_Plan.md`, `promotional.md/`, `dev-tools/`, `.kilo/`, `.qodo/` | Move into `dev-tools/` or delete in the copy. Not part of the site. |

Contradictions a visitor sees today: shop-opening countdown next to "AI agents"; "Fun!" games tab beside "School Portal" demo; a xerox price list on the same pricing page as "Website Design". A company site cannot carry those.

---

## 2. What the top companies do (research summary)

Reviewed: Fedena, Entab, Skolaro, Edunext (school ERP vendors) and SchoolPixel, Inside Softwares (school-website agencies, the closest to your size), plus general agency roundups. Full notes in `research-notes.md`. The pattern is remarkably consistent:

1. **Hero = one promise + one action.** "College and School Management Software" → *Book a Live Demo*. Never nine things at once.
2. **Numbers strip directly under the hero.** "40,000+ institutions · 20+ languages" (Fedena), "1,800+ institutions" (Skolaro), "50+ schools across 18 states · 7-day launch" (SchoolPixel). Even SchoolPixel — a small Patna shop — leads with numbers.
3. **Modules grid.** Six to twelve cards: Admission, Attendance, Exams & Results, Fees, Parent App, Website… Your "12 areas" document is *already* this grid.
4. **Case studies with an outcome**, not a screenshot: "cut admin workload 70%", "first admission, first receipt, first report card from this system".
5. **Testimonials with name + designation + institution.** "Principal, Vidya Vikas Academy" beats "Ranjit Das".
6. **Process timeline.** SchoolPixel's "Day 1 discovery → Day 7 live" is their strongest selling block. Your requirement-form → written quotation → build → training → handover flow is a better one.
7. **Transparent pricing (small players) or "Book a demo" (big players).** SchoolPixel shows ₹14,999 / ₹29,999 / ₹59,999 and a comparison table vs freelancers/agencies. For a rural-Assam buyer who is price-anxious, showing "from ₹" is the right call.
8. **Risk-reversal language.** "Free demo first, pay only if you approve", "You own the domain, data and code" — you already say this in the quotation; put it on the website.
9. **FAQ + final lead form + footer with legal/company identity** (UDYAM, address, policies).
10. **Products & Solutions are separate nav items.** Product = the software; Solutions = "for schools", "for colleges", "for local business".

What the agencies add: portfolio grid with real screenshots, hover → "view live", filter by industry; case-study pages with a before/after; restrained motion, big type, lots of whitespace, one accent colour.

---

## 3. Positioning

**Name:** Smart Digital — Web-App & Software Services
**Tagline (recommended):** *Websites and management software for schools, colleges and businesses in Assam — built here, owned by you.*
**Assamese line under it:** ওয়েবছাইট আৰু ব্যৱস্থাপনা ছফ্টৱেৰ — অসমৰ বিদ্যালয়, মহাবিদ্যালয় আৰু ব্যৱসায়ৰ বাবে।

Three differentiators to repeat everywhere (these come straight from your quotations and no competitor in the district has them):
- **Ownership:** one-time build, school owns domain, data, code, every account. No monthly fee.
- **Bilingual:** every page in Assamese and English with one-click switch.
- **Local:** we sit 3 km away, train your office staff in person, WhatsApp-first support.

Primary audience: school and college management (principals, committee secretaries). Secondary: local businesses wanting a website. Tertiary: teachers/students using the AI apps. The home page is ordered in that priority.

---

## 4. New site map (6 pages + subpages)

```
/                         Home — company site
/solutions/schools/       School Website + Management System (your 12 areas)
/solutions/colleges/      College website + optional add-on systems (KTC quotation structure)
/solutions/business/      Business websites (the 47 demos live here as portfolio)
/work/                    Portfolio grid: 1 real case study + curated demos, filter by type
/work/jatiya-vidyalaya/   Case study page (the one that matters most)
/pricing/                 Packages "from ₹" + "how a quotation works"
/products/                ExamCraft Pro (flagship) + the other 8 apps + Imagine Your Business
/about/                   Suman, story, UDYAM, certificates
/contact/                 Form → WhatsApp + requirement-form download + map
/labs/                    Games, Periodic Table, Astrology app, experiments (not in nav; linked from footer)
/updates/                 Firebase notice board, renamed
privacy-policy.html, terms-and-conditions.html, cancellation-refund-policy.html   (keep)
apps/*, games/*, generator/*, chatbot/*                                             (keep paths — nothing breaks)
```

Nav (desktop): **Solutions ▾ · Work · Pricing · Products · About** — right side: EN/AS toggle, theme, **WhatsApp**, **Get a quotation** (primary button).
Existing external links (`apps/examcraft/index.html`, demo URLs) stay valid — no redirects needed. Sitemap gets regenerated.

---

## 5. Home page, section by section

1. **Hero.** Headline + tagline from §3. Two buttons: *Get a free quotation* (→ /contact/) and *See our work* (→ /work/). Right side: a device mockup (laptop + phone) showing the Jatiya Vidyalaya portal — real screenshots, not the Spline 3D scene. Remove shop-status card, countdown, urgent banner.
2. **Numbers strip.** Use honest numbers you actually have: *1 school system live · 47 demo websites · 9 AI apps in use · 50+ design clients since 2020 · 100% Assamese + English*. Update as projects land.
3. **Who we build for.** Three cards → Schools / Colleges / Businesses, each linking to its solution page.
4. **What a school system includes.** The 12-area grid from *Our Services and What We Build* (Foundation & identity, Public website, Student records, Attendance, Exams & results, Fees & accounts, Academic ops, Parent communication, Logins & dashboards, Mobile & advanced, Setup & training). Icons, one line each.
5. **Featured case study.** Jatiya Vidyalaya Kachua Tiniali: problem → what was built → outcome (weighted four-exam marksheet system, results in minutes). Link to the full page.
6. **How we work.** Five steps: Visit & discussion → Requirement form (you tick what you need) → Written quotation, nothing you didn't ask for → Build & review → Training at your office & handover in your name. This is your actual process from the quotations; it is more credible than anything a Delhi agency writes.
7. **Ownership pledge block.** The "What this means" box from SD-2026-002, verbatim: you pay once, you own everything, if you ever stop working with us it all keeps working.
8. **Products.** ExamCraft Pro hero card + a row of the other apps → /products/.
9. **Testimonials.** Institution voices first (get one line each from the Jatiya Vidyalaya secretary/principal and, once signed, KTC's principal), then existing local ones.
10. **Portfolio strip.** Six best demos with screenshots → /work/.
11. **FAQ.** Ownership, monthly fees, Sewa Setu compatibility, timeline, what if internet is slow, Assamese support, training.
12. **Final CTA + contact form** (name, institution, role, phone, what you need) → WhatsApp message prefilled + Firebase copy.
13. **Footer.** Company identity (Smart Digital, UDYAM-AS-22-0062414 — from your KTC quotation, not on the site yet — Tiniali Bazar, Kachua, Kampur, Nagaon 782426), nav columns (Solutions / Products / Company / Legal), social.

---

## 6. Pricing page (public, "from ₹")

Derived from the two live quotations so the site and the paper never disagree — **updated 2026-09-04**
to revised rates you gave directly; if the written quotations (SD/KTC/2026/01, SD-2026-002) still show
the old numbers, reconcile those too so paper and site keep matching:

| Package | From | Based on |
|---|---|---|
| Business Website | ₹10,000 – ₹15,000 | revised 2026-09-04 |
| College Informational Website (≈40 pages, AS+EN, notice panel, gallery, online enquiry with payment) | ₹67,000 one-time | revised 2026-09-04, was SD/KTC/2026/01 |
| School Website + Management System (records, exams, fees, dashboards) | ₹85,000 one-time | revised 2026-09-04, was SD-2026-002 |
| Add-on systems (student records, library, fee tracking, student portal, attendance) | ₹2,000 – ₹5,000 each | KTC Part B |
| Yearly (domain, hosting, SSL, security, support) | ₹15,000 – ₹20,000 / year | revised 2026-09-04 |

Below the table: "Every project is quoted from a requirement form. You only pay for what you tick." + download button for the requirement form + a comparison table (Smart Digital vs Delhi agency vs monthly-subscription ERP) on price, ownership, Assamese, on-site training, yearly cost.

Decision for you: show prices publicly or "request quotation" only. **Recommend public "from" prices** — the buyer here is price-anxious, and SchoolPixel proves it converts.

---

## 7. Design system

- **Layout:** max-width 1200 px, generous whitespace, 8-pt spacing scale, 12-col grid. No full-page 3D background; one subtle gradient in the hero.
- **Type:** Inter for Latin (already in `fonts.css`), add Noto Sans Bengali for Assamese so the AS toggle stops falling back to system fonts. Headline 48–64 px desktop, 32 px mobile. Body 17 px.
- **Colour:** one deep primary (navy `#0B2A4A` or deep teal `#0E5C63`), one accent (saffron `#F5A524` — reads "Assam / institutional"), neutral greys. Keep dark mode via existing CSS variables.
- **Components (new `assets/css/sd.css`):** navbar, hero, stat strip, card (solution / module / product / demo), case-study block, step timeline, pricing table, testimonial, FAQ accordion, CTA band, footer, form. Everything bilingual via the existing `data-en`/`data-as` system.
- **Imagery:** real screenshots of the Jatiya Vidyalaya portal inside device frames; screenshots (not links) of the 47 demos generated once with a Playwright script; your own photo on About. No stock "happy students" photos.
- **Motion:** fade-up on scroll only. Remove hype counters, liquid-glass effects, marquee tickers from company pages (keep them inside the apps if you like them there).
- **Logo:** keep the mark, add the wordmark "SMART DIGITAL" + small line "Web-App & Software Services".

---

## 8. Technical approach

Stay static, stay on Netlify, no framework. Two changes only:

1. **Shared header/footer.** With 6+ pages you cannot copy-paste the navbar. Add `dev-tools/build-pages.js` (Node, ~40 lines) that replaces `<!-- include:header -->` / `<!-- include:footer -->` in `src/pages/*.html` and writes to root. Netlify build command becomes `node dev-tools/build-pages.js`. Apps, games, chatbot are untouched. If you'd rather avoid even that, a `<script>` that injects the nav works — but it hurts SEO, so the build script is the recommendation.
2. **Portfolio data as JSON.** `data/demos.json` (name, category, url, screenshot, description EN/AS). The `/work/` grid renders from it; adding a demo becomes one JSON line.

SEO: new titles/descriptions per page, `Organization` + `LocalBusiness` + `Service` schema.org JSON-LD, regenerated `sitemap.xml`, `hreflang` kept. Chatbot system prompt rewritten. Contact form → Netlify function → WhatsApp link + Firebase record (email to you).

---

## 9. Phases (do them in this order)

| Phase | What | You need to supply | Effort |
|---|---|---|---|
| 0 | Freeze: this copy is the working copy; tag the old site in git | — | done |
| 1 | **Content first.** Write final EN copy for all 6 pages (AS after), collect Jatiya Vidyalaya screenshots + 2 testimonial lines, requirement form PDF, your photo | screenshots, testimonials, photo | 2–3 days |
| 2 | Design system + build script + Home page | approve colour/type | 3–4 days |
| 3 | Solutions ×3, Pricing, Work + case study | approve prices shown | 3 days |
| 4 | Products, About, Contact, Labs, Updates; re-point every existing link; delete old CSC/shop content (`pricing/index.html` xerox rates, service-enquiry form, shop-status widget); demo screenshots via Playwright | — | 2 days |
| 5 | SEO, schema, sitemap, chatbot prompt, Lighthouse ≥ 90 on mobile, real-phone test on Jio 4G, launch | — | 1 day |

Phase 1 is the one people skip and the one that decides whether the site looks professional. Copy and real screenshots make it professional; CSS does not.

---

## 10. Decisions — locked (4 Sept 2026)

1. **Name:** "Smart Digital — Web-App & Software Services", exactly, everywhere.
2. **Pricing:** Show "from ₹" prices publicly — yes.
3. **CSC/shop:** Drop entirely. No `/shop/` page, no PAN/Aadhaar/xerox/print content anywhere on the site (see §4, §5.13, §9 Phase 4). Note: this is a website-content decision only — it doesn't touch the legal registered business name used on legal pages/footer.
4. **Jatiya Vidyalaya:** Use their real name and real screenshots publicly, in the case study and testimonials.
5. **Colour:** Navy `#0B2A4A` + saffron `#F5A524`, as recommended in §7.

Phase 1 starts.
