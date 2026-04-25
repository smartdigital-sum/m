# Smart Digital — Complete Website Documentation

> **For developers:** This document describes the full structure, features, and technical implementation of the Smart Digital website. Read this to understand everything that has been built.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Architecture](#2-tech-stack--architecture)
3. [Folder Structure](#3-folder-structure)
4. [Main Website (index.html)](#4-main-website-indexhtml)
5. [Global Configuration (config.js)](#5-global-configuration-configjs)
6. [AI-Powered Apps (apps/)](#6-ai-powered-apps-apps)
   - [ExamCraft Pro](#61-examcraft-pro)
   - [BizWrite](#62-bizwrite)
   - [PatraLekhak](#63-patralekhak)
   - [ScriptWala](#64-scriptwala)
   - [ShopWrite AI](#65-shopwrite-ai)
   - [LipiAntar (Translator)](#66-lipiantar-translator)
   - [Resume Builder](#67-resume-builder)
   - [ID Card & Certificate Maker](#68-id-card--certificate-maker)
   - [QR Code Generator](#69-qr-code-generator)
7. [Free Built-in Tools](#7-free-built-in-tools)
8. [Games Section (games/)](#8-games-section-games)
9. [AI Chatbot (chatbot/)](#9-ai-chatbot-chatbot)
10. [Business Generator (generator/)](#10-business-generator-generator)
11. [Firebase Integration](#11-firebase-integration)
12. [Netlify Deployment](#12-netlify-deployment)
13. [Billing & Freemium Model](#13-billing--freemium-model)
14. [Bilingual System (EN / Assamese)](#14-bilingual-system-en--assamese)
15. [Contact & Business Info](#15-contact--business-info)

---

## 1. Project Overview

**Smart Digital** is a local digital services shop and online AI tool hub based in **Kampur, Assam, India**. The website serves two purposes:

1. **Showcase / Business Website** — Presents offline services (website creation, WhatsApp bot automation, documentation), demo websites for prospective clients, and contact information.
2. **Online AI Tool Hub** — A suite of 9 AI-powered and utility web apps that users can open and use directly in the browser — no installation needed.

The entire project is **pure HTML, CSS, and JavaScript** — no React, no Vue, no backend server. Every app is a standalone webpage.

**Target audience:** Small businesses, students, teachers, and common people in Northeast India (especially Assam). Many features have Assamese language support.

---

## 2. Tech Stack & Architecture

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Hosting | Netlify (static hosting + serverless functions) |
| Database | Firebase Realtime Database |
| Authentication | Firebase Auth (Email + Password) |
| AI Provider (primary) | Groq API — model: `llama-3.3-70b-versatile` |
| AI Provider (secondary) | Anthropic Claude API — model: `claude-haiku-4-5-20251001` |
| PDF Export | `html2pdf.js`, `jsPDF` |
| DOCX Export | `docx` (npm CDN build) |
| File Save | `FileSaver.js` |
| Icons | Font Awesome 6.4.0 |
| Fonts | Google Fonts (various per app) |

**Key design decisions:**
- No build step, no bundler — every file is served as-is. This keeps the project simple and easy to edit.
- All AI API calls are made directly from the browser (frontend). On production (Netlify), API keys are proxied through a Netlify serverless function so they are not exposed in the page source. On `localhost` / local file, the real key is read from `config.js`.
- Each app inside `apps/` is fully self-contained: its own `index.html`, `style.css`, and `app.js`. They all link back to `../../index.html` for navigation.

---

## 3. Folder Structure

```
smartdigital/
│
├── index.html                  # Main website (homepage)
│
├── assets/
│   ├── css/
│   │   ├── style.css           # Main stylesheet for index.html
│   │   └── fonts.css           # Preloaded Google Fonts
│   ├── js/
│   │   ├── config.js           # Global AI config (API keys, model settings)
│   │   ├── script.js           # Main JS for index.html (Firebase, theme, language, admin)
│   │   ├── firebase-app-compat.js
│   │   └── firebase-database-compat.js
│   ├── img/
│   │   └── logo.png            # Smart Digital logo
│   └── spline-bg.html          # 3D animated hero background (Spline embed)
│
├── apps/
│   ├── examcraft/              # AI Question Paper Generator
│   ├── bizwrite/               # Business Profile Kit Generator
│   ├── patralekhak/            # Complaint & Legal Letter Writer
│   ├── scriptwala/             # WhatsApp Script Generator
│   ├── shopwrite/              # Product Description Generator
│   ├── translator/             # Document Translator (LipiAntar)
│   ├── resume-builder/         # AI Resume Builder
│   ├── id-maker/               # ID Card & Certificate Maker (free)
│   └── qr-generator/           # QR Code Generator (free)
│
├── games/
│   ├── Snake Game/
│   ├── Memory Match/
│   ├── Flappy Bird/
│   ├── Space Shooter/
│   ├── Dice Roller/
│   ├── Click Counter/
│   ├── Rock Paper Scissors/
│   ├── Simon Says/
│   ├── Tic-Tac-Toe/
│   └── Typing Speed/
│
├── chatbot/
│   ├── bot.js                  # Groq-powered AI chatbot logic
│   └── bot.css                 # Chatbot widget styles
│
├── generator/
│   ├── generator.html          # "Imagine Your Business" tool
│   ├── generator.css
│   └── generator.js
│
├── netlify/
│   └── functions/              # Netlify serverless functions (API key proxy)
│
├── firebase-rules.json         # Firebase Realtime Database security rules
└── netlify.toml                # Netlify build & functions config
```

---

## 4. Main Website (index.html)

The homepage is a single long-scroll page with these sections:

### Sections (top to bottom)

| Section | ID | Description |
|---|---|---|
| Navbar | `#navbar` | Logo, nav links, theme toggle, language toggle, Call/WhatsApp buttons |
| Urgent Banner | `#urgentBanner` | Dismissable promo banner with countdown timer |
| Hero | `#home` | 3D Spline background, headline, CTA buttons, animated desktop/laptop graphic, shop status card |
| Shop Opening Countdown | `.opening-countdown-bar` | Live countdown to physical shop opening date |
| Updates / Notice Board | `#updates` | Firebase-powered live announcements with a scrolling ticker |
| Services | `#services` | Tabbed: "AI Powered Services" (cards scroll area) + "Offline Services" |
| Websites | `#websites` | Tabbed: "Demo Sites" (external demo links) + "Games & Projects" |
| Gallery | `#gallery` | Photo gallery |
| Certificates | `#certificates` | Developer's skill certifications |
| Admin Panel | hidden overlay | Password-protected panel to post updates to Firebase |
| AI Chatbot | floating widget | Bottom-right corner chatbot |

### Notable Features

**Bilingual UI**
Every user-visible text element has `data-en="..."` and `data-as="..."` attributes. A single `toggleLanguage()` call in `script.js` reads the current lang and swaps all text nodes simultaneously, including nav, buttons, cards, and section headings.

**Theme Toggle**
Dark/light theme stored in `localStorage`. Applied via `data-theme="dark"` on `<html>`. CSS variables in `style.css` drive all colors.

**Shop Status Card**
A live card in the hero section that shows whether the physical shop is open or closed based on the current time (9 AM – 6 PM, Mon–Sat). Updates every second with a live clock and countdown.

**Punch / Hype Widget**
A fun "👊 hypes" counter present in several places (hero, websites section, demo cards). Counts are stored in Firebase Realtime Database so they persist across all visitors globally.

**Admin Panel**
Accessed via a hidden admin button. Password-protected. Allows the owner to post new notices, events, and announcements to Firebase, which then appear in the Notice Board section in real-time for all visitors.

**AI Services Search**
The AI Powered Services tab has a live search input. Typing in it filters the tool cards in real-time using `data-name` attributes on each card.

---

## 5. Global Configuration (config.js)

**File:** `assets/js/config.js`

This is the single source of truth for all AI credentials and business defaults. Every app that uses AI imports this file.

```javascript
window.SMART_DIGITAL_CONFIG = {
  GROQ: {
    API_KEY: "...",         // Real key on localhost, "SECURE_PROXIED_VIA_NETLIFY" on prod
    PROVIDER: "GROQ",
    MODEL: "llama-3.3-70b-versatile",
    MAX_TOKENS: 4000,
    TEMPERATURE: 0.5,
    ENDPOINT: "https://api.groq.com/openai/v1/chat/completions"
  },
  CLAUDE: {
    API_KEY: "...",         // Anthropic Claude API key
    MODEL: "claude-haiku-4-5-20251001",
    ENDPOINT: "https://api.anthropic.com/v1/messages"
  },
  ADMIN_EMAIL: "sumanbisas123@gmail.com"
};

// Compatibility alias — older apps look for window.GLOBAL_CONFIG
window.GLOBAL_CONFIG = window.SMART_DIGITAL_CONFIG.GROQ;
```

All apps include this script tag:
```html
<script src="../../assets/js/config.js"></script>
```

---

## 6. AI-Powered Apps (apps/)

### 6.1 ExamCraft Pro

**Path:** `apps/examcraft/`  
**Purpose:** Generates professional school/college question papers using AI.

**Files:**
- `index.html` — full UI with auth, wizard, output
- `style.css` — app-specific styles
- `app.js` — wizard logic, AI call, paper rendering
- `prompt-templates.js` — board-specific rules for SEBA, AHSEC, CBSE, ICSE
- `syllabus-data.js` — Assam curriculum data (classes, subjects, chapters)
- `assam_curriculum_data.js` — extended Assamese medium curriculum
- `firebase-auth.js` — user login/signup with Firebase Auth
- `firebase-config.js` — Firebase project config for ExamCraft

**How it works:**
1. User signs in (or stays on demo, limited to 2 papers, max 20 questions, only first 3 visible).
2. User selects board (SEBA/AHSEC/CBSE/ICSE), class, subject, chapters, difficulty, and question types.
3. **Alternatively**, user can upload a photo of a textbook page/syllabus and the app extracts topics from the image.
4. On "Generate", a structured prompt is sent to the Groq API (or Claude API for Assamese medium) with board-specific rules from `prompt-templates.js`.
5. The AI returns a formatted question paper which is rendered in the UI.
6. Users can include answers, print, or download.

**Credit system:** Credits are stored in Firebase (per user account). Demo users get 2 free papers. Paid plans unlock more.

**Supported Boards:** SEBA, AHSEC, CBSE, ICSE  
**Supported Languages:** English, Hindi, Assamese

---

### 6.2 BizWrite

**Path:** `apps/bizwrite/`  
**Purpose:** Generates a complete "Business Profile Kit" — all the marketing copy a local business needs.

**Files:** `index.html`, `style.css`, `app.js`

**Output sections generated:**
- Google Business Profile description
- Facebook Page Bio
- WhatsApp Business "About" text
- Instagram Bio
- Tagline options (3–5 variants)
- SEO Meta description
- Product / Service highlights

**How it works:**
1. User fills in: Business Name, Type, Location, Years in Business, USPs, Products/Services, Tone (Professional / Friendly / Bold / Traditional), and Output Language (English / Hindi / Assamese).
2. User picks which sections to generate using toggle checkboxes.
3. On click, all selected sections are requested in a single Groq API call using a structured prompt with clear section markers (e.g., `---GOOGLE_BUSINESS---`).
4. The response is parsed by marker and each section is rendered in its own card with a copy button.
5. The last 8 generated kits are saved to `localStorage` as history.

**Additional pages:** Pricing (manual payment via UPI), Invoice generator.

**Languages:** UI in EN/HI/AS; output in the language the user selects.

---

### 6.3 PatraLekhak

**Path:** `apps/patralekhak/`  
**Purpose:** Converts a plain-language description of a problem into a formal complaint or legal letter.

**Files:** `index.html`, `style.css`, `app.js`  
**External library:** `jsPDF` (for PDF export)

**Letter types supported:**
- Bank Dispute
- Electricity / Water complaint
- Telecom complaint
- School / College request
- RTI Application
- Legal Notice
- Government Office complaint

**How it works:**
1. User selects the letter type.
2. User fills in: Sender Name, Address, Phone/Email, Recipient (e.g. "The Branch Manager, SBI"), Recipient Address, Reference Number (optional).
3. User describes the problem in simple words.
4. User selects output language (English / Hindi / Assamese) and letter tone (Formal / Assertive / Polite).
5. A Groq API call is made with a prompt instructing the AI to produce a properly formatted formal letter.
6. Output is displayed in a styled letter preview.
7. User can copy, save to `localStorage`, or export to PDF (via jsPDF).

**Free tier:** 1 free letter per browser. Credits system for paid use.  
**Languages:** UI in EN/HI/AS; letter output in EN/HI/AS.

---

### 6.4 ScriptWala

**Path:** `apps/scriptwala/`  
**Purpose:** Generates ready-to-send WhatsApp scripts for businesses.

**Files:** `index.html`, `style.css`, `app.js`

**Script categories (selectable):**
- Customer Reply Templates
- Product / Service Descriptions
- Promotional Offers
- Festive / Seasonal Messages

**Tone options:**
- Formal (Professional & official)
- Friendly (Warm & approachable)
- Hinglish (Hindi + English mix)
- Assamese (Local NE India feel)

**How it works:**
1. User enters: Business Name, Business Type, Products/Services, Owner/Contact Name (optional).
2. Selects one tone and one or more template categories.
3. On "Generate", a Groq API call returns a full pack of scripts organized by category.
4. Scripts are displayed with individual copy buttons.
5. The full pack can be downloaded as a `.txt` file.
6. History of last generated scripts is saved in `localStorage`.

**Pricing model:** One-time packs (Quick Pack, Starter Pack, Freelancer Pack, Agency Pack) — paid via UPI.

---

### 6.5 ShopWrite AI

**Path:** `apps/shopwrite/`  
**Purpose:** Generates product descriptions + SEO keywords + hashtags for e-commerce listings.

**Files:** `index.html`, `style.css`, `app.js`

**Product categories:** Grocery, Medical, Clothing, Electronics, Beauty, Furniture, Food & Snacks, Stationery, Sports, Jewellery, Toys, Other.

**How it works:**
1. User enters: Product Name, selects a Category, adds optional details (brand, price, special features).
2. On "Generate", a Groq API call returns three variants:
   - Variant 1 — Detailed
   - Variant 2 — Concise
   - Variant 3 — Creative
3. Each variant has a character count and copy button.
4. Below the variants, SEO keywords and hashtags are displayed with a "Copy All Hashtags" button.

**API key:** Users can optionally supply their own Groq API key via a settings modal. If not provided, uses the global key from `config.js`.

**Languages:** EN/HI/AS UI; output in the user's chosen language.

---

### 6.6 LipiAntar (Translator)

**Path:** `apps/translator/`  
**Purpose:** Professional translation of documents for government, legal, and official use.

**Files:** `index.html`, `style.css`, `app.js`

**Language pairs:** Assamese ↔ Hindi ↔ Bodo ↔ English (any direction)

**Important:** This app uses the **Claude API (Anthropic)**, NOT Groq. Claude was chosen specifically because it handles Assamese script more accurately.

**How it works:**
1. User selects source and target language (or clicks the swap button).
2. User pastes text OR uploads a file (plain text `.txt`).
3. Selects translation tone: Official / Simple / Academic.
4. On "Translate", the Claude API is called with the source text and a prompt specifying target language and tone.
5. Translated text appears in the output panel.
6. Output shows word count and estimated translation quality meta.
7. User can copy, download as `.txt`, or download as `.docx`.
8. An optional side-by-side view shows source and translation simultaneously.

**Credits system:** Stored in `localStorage`. 1 free translation. Paid plans unlock more.  
**Pricing:** Single Document (₹20), 5-Pack (₹60).

---

### 6.7 Resume Builder

**Path:** `apps/resume-builder/`  
**Purpose:** Creates professional, ATS-friendly resumes via a guided wizard.

**Files:** `index.html`, `style.css`, `app.js`, `settings.js`, `firebase-auth.js`, `firebase-config.js`, `export.js`, `templates.js`  
**External libraries:** `html2pdf.js`, `docx` (for .docx export), `FileSaver.js`

**How it works:**
1. User must sign in (Firebase Auth). The wizard is locked behind authentication.
2. The wizard has 5 steps:
   - **Step 1:** Personal Info (name, contact, summary)
   - **Step 2:** Work Experience
   - **Step 3:** Education
   - **Step 4:** Skills & Projects
   - **Step 5:** Template selection + Generate
3. On "Generate", all data is sent to the Groq API which fills in professional language, enhances bullet points, and writes a compelling summary.
4. The resume is rendered live in the browser using the selected template from `templates.js`.
5. User can export as PDF (`html2pdf.js`) or as a `.docx` file (`docx` library).

**Free tier:** 1 free demo resume (watermarked). Credits needed for full resumes.  
**Templates:** Multiple modern resume templates defined in `templates.js`.  
**Config:** `settings.js` allows the shop owner to set UPI ID, pricing, and branding without touching app logic.

---

### 6.8 ID Card & Certificate Maker

**Path:** `apps/id-maker/`  
**Purpose:** Design and download custom ID cards and certificates. Completely free, no AI.

**Files:** `index.html`, `style.css`, `app.js`

**Use cases:** School ID cards, office ID badges, event badges, certificates of participation/achievement.  
**Output:** High-quality PNG download.

---

### 6.9 QR Code Generator

**Path:** `apps/qr-generator/`  
**Purpose:** Generate QR codes for any URL, WhatsApp link, or UPI payment. Free.

**Files:** `index.html`, `style.css`, `app.js`

**Features:** Instant generation, downloadable PNG, common presets (WhatsApp, UPI, Website link).

---

## 7. Free Built-in Tools

These tools are embedded directly in `index.html` and don't require navigating away.

### Background Remover
- Accessible via a card in the AI Services section.
- Uses a hidden `<input type="file">` (`#hero-bg-input`).
- Removes the background from a selected image using browser AI.
- No signup, no cost.

### "Imagine Your Business" Preview
- Links to `generator/generator.html`.
- User enters a business name, tagline, optional phone/location, and picks an industry.
- The app renders a styled mockup of how that business's website could look.
- Free, purely visual.

---

## 8. Games Section (games/)

Located under the "Games & Projects" tab inside the Websites section of `index.html`. Each game is a standalone HTML file.

| Game | Folder |
|---|---|
| Snake Game | `games/Snake Game/` |
| Memory Match (Assamese icons) | `games/Memory Match/` |
| Flappy Bird | `games/Flappy Bird/` |
| Space Shooter | `games/Space Shooter/` |
| Dice Roller | `games/Dice Roller/` |
| Click Counter | `games/Click Counter/` |
| Rock Paper Scissors | `games/Rock Paper Scissors/` |
| Simon Says | `games/Simon Says/` |
| Tic-Tac-Toe | `games/Tic-Tac-Toe/` |
| Typing Speed | `games/Typing Speed/` |

These were built as interactive demos for the portfolio / to entertain visitors. No external libraries — all vanilla JS canvas or DOM-based.

---

## 9. AI Chatbot (chatbot/)

**Files:** `chatbot/bot.js`, `chatbot/bot.css`  
The chatbot widget is embedded in `index.html` as a floating button (bottom-right area).

**How it works:**
- Powered by Groq API (same `llama-3.3-70b-versatile` model).
- Uses the **OpenAI-compatible** chat completions endpoint on Groq.
- Maintains full conversation history in memory (`conversationHistory` array) so the AI has context across multiple turns in the same session.
- System prompt (`BOT_SYSTEM`) is a detailed instruction set telling the AI:
  - What Smart Digital is and its location
  - All services, prices, and links
  - All demo website categories
  - All AI tool descriptions
  - Strict Assamese language rules (to prevent Bengali substitution)
  - Response style (under 70 words, friendly, use emojis)
- A greeting message is shown when the page loads (not part of the AI history, just a warm welcome).
- The chat window can be opened/closed by clicking the bot icon.

**Bilingual awareness:** The bot can respond in Assamese when the user writes in Assamese. Special rules in the system prompt ensure correct Assamese characters (`ৰ`, `ৱ`) are used and Bengali words are avoided.

---

## 10. Business Generator (generator/)

**Files:** `generator/generator.html`, `generator/generator.css`, `generator/generator.js`

A standalone tool that lets users see what their business could look like as a professional website. The user enters:
- Business Name
- Tagline or service description
- Phone (optional)
- Location (optional)
- Industry (Medical / School / Salon / Grocery / Restaurant / Gym / DG Demo / Clothing)

The app instantly renders a styled business card / website mockup using the inputs, giving potential clients a visual idea of what Smart Digital can build for them.

---

## 11. Firebase Integration

**Project:** `smart-digital-ce0a7`  
**Region:** `asia-southeast1` (Singapore — closest to Assam)

### Services Used

| Service | Used For |
|---|---|
| Realtime Database | Notice board posts, hype/punch counts |
| Firebase Auth | User accounts in ExamCraft and Resume Builder |

### Database Structure (Realtime DB)
- `/notices/` — Admin-posted announcements read by the Notice Board section
- `/punchCounts/` — Per-widget "hype" count stored by widget ID

### Auth (Firebase)
- Email + Password authentication
- Used in ExamCraft (`apps/examcraft/firebase-auth.js`) and Resume Builder (`apps/resume-builder/firebase-auth.js`)
- Each app has its own `firebase-config.js` with the Firebase project details

### Security
- Firebase Database rules are defined in `firebase-rules.json`
- Auth is read-protected: user data is only accessible to the logged-in user

---

## 12. Netlify Deployment

**Config file:** `netlify.toml`

```toml
[build]
  publish = "."          # Entire repo root is the published site

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

### Serverless Functions
Located in `netlify/functions/`. These act as a **secure proxy** for API keys. On production:
- AI API calls from the browser go to a Netlify function endpoint instead of directly to Groq/Anthropic.
- The function injects the real API key server-side and forwards the request.
- This means the API key is never exposed in the browser's network tab on the live site.

On `localhost` or when opened as a local file, `config.js` uses the real key directly (for development convenience).

---

## 13. Billing & Freemium Model

All paid apps use a **manual UPI payment flow** — there is no automated payment gateway (no Razorpay, no Stripe). The flow is:

1. User hits the credit limit (or tries a premium feature).
2. A modal appears showing the pricing plans.
3. User selects a plan, sees the UPI ID and QR code.
4. User pays via any UPI app (PhonePe, GPay, etc.) and takes a screenshot.
5. User sends the screenshot to the owner on WhatsApp (+91 86387 59478).
6. Owner manually verifies and adds credits to the user's account (Firebase for ExamCraft/Resume Builder; `localStorage` for others).

**Credit storage per app:**
- ExamCraft: Firebase (linked to user account)
- Resume Builder: Firebase (linked to user account)
- LipiAntar: `localStorage` (browser-only, not tied to account)
- PatraLekhak: `localStorage`
- ScriptWala: per-pack payment, no persistent credits

---

## 14. Bilingual System (EN / Assamese)

The entire main website supports English and Assamese. Implementation:

**HTML markup:**
```html
<span data-en="Our Services" data-as="আমাৰ সেৱাসমূহ">Our Services</span>
```

**JavaScript (`script.js`):**
```javascript
function applyTranslations() {
  document.querySelectorAll("[data-en]").forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    // Updates text content, preserving child icons/spans
  });
}
```

The current language is stored in `currentLang` variable and toggled by `toggleLanguage()`. The `<html>` element gets `data-lang="as"` or `data-lang="en"` which can also be targeted by CSS for font changes.

**Inside apps** (BizWrite, PatraLekhak, ScriptWala, ShopWrite): Each app has its own `translations` / `i18n` object — a plain JavaScript dictionary with `en`, `hi`, and `as` keys for all UI strings. A `setLang(lang)` function applies them on demand.

---

## 15. Contact & Business Info

| Info | Value |
|---|---|
| Business Name | Smart Digital |
| Owner/Developer | Suman Bisa |
| Email | smartdigitalassam@gmail.com |
| WhatsApp | +91 86387 59478 |
| Physical Location | Kachua Tiniali, Kampur, Assam — 782426 |
| Shop Hours | Monday–Saturday, 9 AM – 6 PM |
| GitHub (demos) | smartdigital-sum.github.io |

**Offline service enquiries:**
- Website Creation: Manual discussion on WhatsApp
- n8n WhatsApp Bot Automation: Manual discussion on WhatsApp
- Documentation (PAN, Aadhaar, Printing, Scanning, Ticket Booking): Ask on WhatsApp or at the shop

---

*Last updated: April 2026*
