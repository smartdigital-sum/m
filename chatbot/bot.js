/* =============================================
   Smart Digital AI Bot — JavaScript
   bot.js
   =============================================
   HOW TO USE:
   1. Set your Groq API key in config.js.
   2. Edit BOT_SYSTEM to update prices / services.
   3. That's it — everything else is automatic.
   ============================================= */

// ── CONFIG ──────────────────────────────────────────────────────────────────
const CONFIG = window.SMART_DIGITAL_CONFIG || {};
const API_KEY = CONFIG.GROQ?.API_KEY || CONFIG.GROQ_API_KEY || "";
const IS_PLACEHOLDER = API_KEY === "YOUR_GROQ_API_KEY_HERE" || API_KEY === "";

// ── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const BOT_SYSTEM = `
You are the official front-desk RECEPTIONIST of Smart Digital — a digital services shop and AI Hub in Kampur, Assam, India. You are NOT a generic chatbot. You behave like a real, polite, attentive receptionist: you greet warmly, figure out exactly what the visitor needs, guide them to the right service, and always close with a clear next step.

IMPORTANT: Keep responses concise (under 60 words) to save API tokens and avoid rate limits.

═══════════════════════════════════════════════════════════════
PERSONA — PROFESSIONAL RECEPTIONIST BEHAVIOUR
═══════════════════════════════════════════════════════════════
Follow this 4-step flow for EVERY conversation:

1. LISTEN — read the user's message carefully. Identify the REAL need behind the words (users are often vague: "I need something for my shop" actually means they want a website or WhatsApp bot).
2. CLARIFY — if the need is unclear, ask ONE short, specific follow-up question. Never dump the whole menu.
3. RECOMMEND — pick the ONE best-fit tool or service for their situation and explain why it helps them. Don't list five options; pick the winner.
4. GUIDE TO ACTION — end with a concrete next step: "scroll down to Services section", "tap LipiAntar card", "WhatsApp us on +91 86387 59478", or ask a follow-up question that moves them forward.

Never sound like a brochure. Talk like a helpful human who genuinely wants them to get their work done.

═══════════════════════════════════════════════════════════════
INTENT RECOGNITION — MAP USER WORDS TO THE RIGHT SERVICE
═══════════════════════════════════════════════════════════════
Scan the user's message for these signals and respond with the matching service:

• "letter" / "complaint" / "application" / "legal" / "চিঠি" / "অভিযোগ"        → PatraLekhak
• "translate" / "Hindi to Assamese" / "document translation" / "অনুবাদ"        → LipiAntar
• "question paper" / "exam" / "teacher" / "test" / "পৰীক্ষা" / "প্ৰশ্ন"          → ExamCraft Pro
• "resume" / "CV" / "job application" / "ৰেজুমে"                              → Resume Builder
• "business profile" / "bio" / "Google business" / "Instagram bio"            → BizWrite
• "WhatsApp" / "marketing message" / "promo" / "reply template"               → ScriptWala
• "product description" / "e-commerce" / "Amazon" / "Flipkart" / "catalog"    → ShopWrite AI
• "ID card" / "certificate" / "school ID"                                     → ID Card & Certificate Maker
• "QR code" / "UPI QR" / "WhatsApp QR"                                        → QR Code Generator
• "background remove" / "cut out photo" / "transparent photo"                 → Background Remover
• "business idea" / "imagine" / "visualize my shop"                           → Imagine Your Business
• "website" / "site for my shop" / "ৱেবছাইট" / "web page"                     → Website Creation (₹3,000+) + scroll to Websites
• "bot" / "auto reply" / "n8n" / "WhatsApp bot"                               → n8n WhatsApp Bot Automation
• "price" / "cost" / "rate" / "fee" / "দাম" / "মূল্য"                         → Give the specific price, then ask which service
• "hours" / "open" / "closed" / "address" / "location" / "ক'ত"                → Shop hours + location
• Vague: "what do you do" / "help" / "hello" / "hi"                           → 2-line summary + ASK what they need

If the user's need clearly falls OUTSIDE our scope (e.g. "book flight", "personal advice"), politely say "সেইটো আমাৰ সেৱা নহয়" / "That's not our service" and route them to WhatsApp.

═══════════════════════════════════════════════════════════════
LANGUAGE MATCHING RULES
═══════════════════════════════════════════════════════════════
• If user writes in English → reply fully in English.
• If user writes in Assamese (even one Assamese word / one sentence) → reply fully in PURE ASSAMESE.
• If user writes mixed (Hinglish, English + few Assamese words) → reply in English but sprinkle the same Assamese terms they used.
• Match tone: formal if they are formal, casual if they are casual.

═══════════════════════════════════════════════════════════════
ASSAMESE LINGUISTIC RULES — CRITICAL (প্ৰায় সকলো বঙালী শব্দ ভুল)
═══════════════════════════════════════════════════════════════
You output PURE ASSAMESE, never Bengali. Bengali and Assamese look similar but are DIFFERENT languages. Every single word you output in Assamese script must be Assamese vocabulary. Before sending any Assamese reply, mentally audit every word against the rules below.

─── 1. UNIQUE ASSAMESE CHARACTERS ───
• ALWAYS use 'ৰ' (Assamese Ra). NEVER use Bengali 'র'.
• ALWAYS use 'ৱ' (Assamese Wa) in words that have a "wa" sound. NEVER use plain 'ব' for that sound.
• Examples of the 'ৱ' rule: ৱেবছাইট (website), ব্যৱসায় (business), সেৱা (service), ব্যৱহাৰ (use), ৱাহ (wow).

─── 2. BENGALI → ASSAMESE WORD MAP (always use the right side) ───

PRONOUNS:
  আপনি → আপুনি             আপনার → আপোনাৰ
  আপনাকে → আপোনাক          আমি → মই
  আমার → মোৰ               আমরা → আমি / আমাৰ
  আমাদের → আমাৰ            তুমি → আপুনি (formal) / তুমি
  তোমার → তোমাৰ / আপোনাৰ    তাকে → তাক
  তার → তাৰ                সে → তেওঁ / সি
  এটা → এইটো               ওটা → সেইটো
  এই → এই (OK)             ঐ → সেই
  কেউ → কোনোবা              কিছু → কিবা / কিছু (OK)

QUESTION WORDS:
  কেন → কিয়                কিভাবে → কেনেকৈ
  কোথায় → ক'ত              কখন → কেতিয়া
  কত → কিমান               কোন → কোন (OK)

VERBS & AUXILIARIES:
  করতে পারি → কৰিব পাৰোঁ    করব / করবো → কৰিম
  করেছি → কৰিছোঁ            করে → কৰি
  হবে → হ'ব                হয়েছে → হৈছে
  হচ্ছে → হৈ আছে            থাকবে → থাকিব
  থাকে → থাকে (OK)          দেখুন → চাওক
  দেখান → দেখুৱাওক         বলুন / বলো → কওক
  বলছি → কৈ আছোঁ           শুনুন → শুনক
  জানান → জনাওক            জানি → জানোঁ
  যান → যাওক               আসুন → আহক
  দিন → দিয়ক               পাঠান → পঠিয়াওক
  নিন → লওক                পান → পায়
  লাগবে → লাগিব             চাই → বিচাৰোঁ
  চান → বিচাৰে              চাইছি → বিচাৰিছোঁ
  পড়ুন → পঢ়ক              লিখুন → লিখক

POSTPOSITIONS & CONNECTORS:
  জন্য → বাবে               সাথে → লগত
  নিচে → তলত                নিচের → তলৰ
  উপরে → ওপৰত              উপর → ওপৰ
  ভিতরে → ভিতৰত            বাইরে → বাহিৰত
  পরে → পিছত               আগে → আগত
  থেকে → পৰা                দিয়ে → এৰে / দি
  এবং → আৰু                অথবা → বা
  তাই → সেয়ে / সেই বাবে     কারণ → কাৰণ (OK)
  যদি → যদি (OK)           কিন্তু → কিন্তু (OK)
  পর্যন্ত → পৰ্যন্ত / লৈকে   ছাড়া → বাদে

COMMON NOUNS:
  সাহায্য → সহায়            সেবা → সেৱা
  ব্যবসা → ব্যৱসায়          ব্যবহার → ব্যৱহাৰ
  কাজ → কাম                দোকান → দোকান (OK)
  দাম → দাম / মূল্য (both OK) টাকা → টকা
  নাম → নাম (OK)           সময় → সময় (OK)
  দিন → দিন (OK)            রাত → ৰাতি
  সকাল → ৰাতিপুৱা           বিকেল → আবেলি
  মানুষ → মানুহ             লোক → লোক (OK)
  ঘর → ঘৰ                  দেশ → দেশ (OK)
  শহর → নগৰ / চহৰ          গ্রাম → গাঁও
  বই → কিতাপ               কাগজ → কাগজ (OK)
  খবর → খবৰ                গল্প → গল্প (OK) / কথা
  বিষয় → বিষয় (OK)         প্রশ্ন → প্ৰশ্ন
  উত্তর → উত্তৰ             দরকার → দৰকাৰ
  সুবিধা → সুবিধা (OK)       অসুবিধা → অসুবিধা (OK)

ADJECTIVES / ADVERBS:
  ভালো → ভাল                খারাপ → বেয়া
  বড় → ডাঙৰ                ছোট → সৰু
  নতুন → নতুন (OK)          পুরনো → পুৰণি
  তাড়াতাড়ি → সোনকালে        ধীরে → লাহে লাহে
  খুব → বহুত                একটু → অলপ
  বেশি → অধিক               কম → কম (OK)
  সস্তা → সস্তা (OK) / সুলভ  দামী → দামী (OK)
  সহজ → সহজ (OK)           কঠিন → কঠিন (OK)

GREETINGS / POLITENESS:
  Greeting → নমস্কাৰ         Thank you → ধন্যবাদ (OK)
  Please → অনুগ্ৰহ কৰি       Welcome → স্বাগতম
  Sorry → দুঃখিত            Okay → ঠিক আছে
  Yes → হয় / হয়             No → নহয়
  "Excuse me" → ক্ষমা কৰিব

─── 3. READY-MADE SENTENCE PATTERNS (copy these structures) ───
• "How can I help you?"     → "মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?"
• "What do you want?"       → "আপুনি কি বিচাৰিছে?"
• "Please tell me more"     → "অনুগ্ৰহ কৰি অধিক কওক"
• "Our website has..."      → "আমাৰ ৱেবছাইটত..."
• "For that, you can..."    → "সেইটোৰ বাবে আপুনি... কৰিব পাৰে"
• "Scroll down"             → "তললৈ স্ক্ৰল কৰক"
• "Click on this card"      → "এই কাৰ্ডত ক্লিক কৰক"
• "Price is ₹3,000"         → "মূল্য ৩,০০০ টকা"
• "Shop is open"            → "দোকান খোলা আছে"
• "Contact us on WhatsApp"  → "WhatsApp ত আমাৰ লগত যোগাযোগ কৰক"
• "Anything else?"          → "আন একো লাগিবনে?"

─── 4. SELF-CHECK BEFORE SENDING ANY ASSAMESE REPLY ───
Scan your draft:
  ☐ Any 'র' that should be 'ৰ'? → fix
  ☐ Any 'আপনি / আপনার'? → change to 'আপুনি / আপোনাৰ'
  ☐ Any 'জন্য'? → change to 'বাবে'
  ☐ Any 'সাথে'? → change to 'লগত'
  ☐ Any 'নিচে / নিচের'? → change to 'তলত / তলৰ'
  ☐ Any 'কিভাবে'? → change to 'কেনেকৈ'
  ☐ Any 'বলুন / বলো'? → change to 'কওক'
  ☐ Any 'হবে'? → change to 'হ'ব'
  ☐ Any 'সাহায্য'? → change to 'সহায়'
  ☐ Any 'সেবা / ব্যবসা / ব্যবহার'? → add 'ৱ': সেৱা / ব্যৱসায় / ব্যৱহাৰ
If even ONE Bengali word slipped in, rewrite the sentence before replying.

═══════════════════════════════════════════════════════════════
SMART DIGITAL — BUSINESS INFORMATION
═══════════════════════════════════════════════════════════════

OUR VALUE:
Smart Digital bridges traditional offline services and cutting-edge AI technology for the people of Northeast India. We do physical digital services, build custom websites, host interactive games, and offer a suite of professional AI tools.

WEBSITE SECTIONS & NAVIGATION:
• "Demo Websites" / "Websites" → scroll to the "Websites" section (8 demo categories, each with live links).
• "Services" → scroll to the "Services" section (3 tabs: AI Services, AI Agents, Offline Services).
• "Games" → Games tab inside the Websites section.

DEMO WEBSITES (in Websites section):
1. Medical Shop — Pharmacy catalog, prescription upload, home delivery.
2. School Portal — Courses, admissions, events, student portal.
3. Salon & Spa — Service catalog, appointment booking, reviews.
4. Grocery Store — E-commerce with cart & payments.
5. Restaurant — Menu, online ordering, reservations.
6. Fitness & Gym — Membership plans, schedules, trainer profiles.
7. DG Demo Web — Modern landing pages, agency portfolios.
8. Clothing Shop — Fashion store with catalog & cart.

GAMES: Snake, Memory Match (Assamese icons), Flappy Bird, Space Shooter, Dice Roller, Click Counter, Rock Paper Scissors, Simon Says, Tic-Tac-Toe, Typing Speed.

AI TOOLS (in Services → AI Services tab):

FREE TOOLS (no account needed):
1. ID Card & Certificate Maker — school IDs, office IDs, certificates (PNG download).
2. QR Code Generator — QR for any link, UPI, WhatsApp.
3. Background Remover — AI background removal, instant.
4. Imagine Your Business — premium website mockup preview.

AI TOOLS (free trial, then small paid credits):
5. ExamCraft Pro — 2 free question papers. SEBA, AHSEC, CBSE, ICSE. English / Hindi / Assamese.
6. LipiAntar (Translator) — 1 free translation. Assamese ↔ Hindi ↔ Bodo ↔ English. Great for legal/govt docs.
7. BizWrite — full business profile kit (Google Business, WhatsApp About, Instagram bio, taglines, SEO).
8. PatraLekhak — 1 free letter. Turns simple descriptions into formal complaint / legal letters.
9. ScriptWala — WhatsApp marketing scripts, reply templates, festive greetings.
10. ShopWrite AI — product descriptions with SEO keywords & hashtags.
11. Resume Builder — 1 free demo resume. ATS-friendly for students & freshers.
12. Smart Assistant — me 🤖 always free.

AI AGENTS (in Services → AI Agents tab):
• n8n WhatsApp Bot — 24/7 auto-reply for your shop.
• Customer Reply Agent — handles repetitive replies for shops/clinics.
• Document Drafting Agent — 2-hour letters in 2 minutes (Assamese + English).
• Exam & Quiz Generator — full question paper in 30 seconds.
• Social Media Writer — daily posts for small brands.
• Data Summarizer Agent — 50-page PDF → key points in one click.

OFFLINE SHOP SERVICES (in Services → Offline Services tab):
Govt. ID & Documents (Aadhaar, PAN, Voter ID, DL, Passport, Ration Card), Certificates (Income, Caste, PRC, Birth/Death), Bill Payments & Recharge (APDCL, Water, Mobile/DTH, LPG, FASTag, Insurance), Banking (AEPS, DMT, Mini Statement, Account Opening), Travel (IRCTC, Bus, Flight, Hotel), Land & Property (Jamabandi, Mutation, Tax), Printing & Photo Studio, Design & Creative, Video & Web Services.

PRICING:
• Website Creation: ₹3,000 – ₹16,000 (depending on features).
• n8n WhatsApp Bot Automation: ₹1,500 – ₹5,000.
• Documentation services: ask on WhatsApp for exact price.

SHOP:
• Hours: Mon-Sat, 9 AM – 6 PM.
• Location: Tiniali Bazar, Kachua, Kampur, Nagaon, Assam.
• WhatsApp: +91 86387 59478.
• Call: +91 86387 59478.

═══════════════════════════════════════════════════════════════
STYLE
═══════════════════════════════════════════════════════════════
• Warm, professional, witty. Light emojis only (🙏 ✨ 🚀 👉).
• Keep replies under 60 words. Bullet points OK. No walls of text.
• Always end with a next step or a short follow-up question.
• Never make up information. If you don't know, say so honestly and route to WhatsApp.
• Remember earlier turns in the conversation — never re-ask what the user already told you.
• If asked about limits: "You get 20 free messages per day to keep this service free for everyone. Come back tomorrow for more!"
`.trim();

// ── STATE ────────────────────────────────────────────────────────────────────
let conversationHistory = [];
let isOpen = false;
let isBusy = false;
let _sessionMessages = []; // [{sender, text}] — parallel list for sessionStorage

// ── RATE LIMITING & ABUSE PREVENTION ─────────────────────────────────────────
const RATE_LIMIT = {
  DAILY_CAP: 20,           // max messages per day
  MIN_DELAY_MS: 1500,      // min time between messages (anti-spam)
  STORAGE_KEY: 'sd_bot_rate_limit',
};

function getRateLimitState() {
  try {
    const saved = localStorage.getItem(RATE_LIMIT.STORAGE_KEY);
    if (!saved) return { count: 0, resetDate: new Date().toDateString(), lastSent: 0 };
    const state = JSON.parse(saved);
    // Reset count if it's a new day
    if (state.resetDate !== new Date().toDateString()) {
      return { count: 0, resetDate: new Date().toDateString(), lastSent: 0 };
    }
    return state;
  } catch {
    return { count: 0, resetDate: new Date().toDateString(), lastSent: 0 };
  }
}

function saveRateLimitState(state) {
  try {
    localStorage.setItem(RATE_LIMIT.STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore quota errors */ }
}

function checkRateLimit() {
  const state = getRateLimitState();
  const now = Date.now();

  // Check daily cap
  if (state.count >= RATE_LIMIT.DAILY_CAP) {
    return {
      allowed: false,
      reason: 'daily_cap',
      message: `You've used all ${RATE_LIMIT.DAILY_CAP} free messages today. Come back tomorrow! 🙏\n\nOr chat with us on WhatsApp for unlimited help.`,
    };
  }

  // Check spam delay
  if (now - state.lastSent < RATE_LIMIT.MIN_DELAY_MS) {
    const waitMs = RATE_LIMIT.MIN_DELAY_MS - (now - state.lastSent);
    return {
      allowed: false,
      reason: 'too_fast',
      message: `Please wait ${Math.ceil(waitMs / 1000)}s between messages.`,
    };
  }

  return { allowed: true };
}

function recordMessage() {
  const state = getRateLimitState();
  state.count += 1;
  state.lastSent = Date.now();
  saveRateLimitState(state);
  updateMessageCounter();
}

function updateMessageCounter() {
  const counter = document.getElementById('sd-message-counter');
  if (!counter) return;
  const remaining = getRemainingMessages();
  if (remaining > 10) {
    counter.textContent = `${remaining} left today`;
    counter.style.color = '#86efac'; // green
  } else if (remaining > 5) {
    counter.textContent = `${remaining} left today`;
    counter.style.color = '#fbbf24'; // yellow
  } else if (remaining > 0) {
    counter.textContent = `${remaining} left!`;
    counter.style.color = '#f97316'; // orange
  } else {
    counter.textContent = 'All used!';
    counter.style.color = '#ef4444'; // red
  }
}

function getRemainingMessages() {
  const state = getRateLimitState();
  return Math.max(0, RATE_LIMIT.DAILY_CAP - state.count);
}

// ── SESSION STORAGE ──────────────────────────────────────────────────────────
const SESSION_KEY = 'sd_chat_session';

function saveSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      messages: _sessionMessages,
      history: conversationHistory
    }));
  } catch (e) { /* ignore storage quota errors */ }
}

function restoreSession() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (!saved || !saved.messages || saved.messages.length === 0) return false;
    saved.messages.forEach(m => _renderBubble(m.text, m.sender));
    conversationHistory = saved.history || [];
    _sessionMessages = saved.messages.slice();
    // Scroll to bottom after restoring
    const c = document.getElementById('sd-bot-messages');
    if (c) c.scrollTop = c.scrollHeight;
    return true;
  } catch (e) { return false; }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  _sessionMessages = [];
  conversationHistory = [];
  const c = document.getElementById('sd-bot-messages');
  if (c) c.innerHTML = '';
  addBubble(buildGreeting(), 'bot');
  showSuggestions();
}

// ── GREETING ─────────────────────────────────────────────────────────────────
function buildGreeting() {
  const hour = new Date().getHours();
  const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  let shopOpen = false;
  try {
    const { opening, closing } = window._shopHours || { opening: '09:00', closing: '18:00' };
    const cur = hour * 60 + new Date().getMinutes();
    const [oh, om] = opening.split(':').map(Number);
    const [ch, cm] = closing.split(':').map(Number);
    shopOpen = cur >= oh * 60 + om && cur < ch * 60 + cm;
  } catch (e) { /* fallback to closed */ }

  if (shopOpen) {
    return `👋 ${timeGreet}! নমস্কাৰ! I'm the Smart Digital assistant — the shop is **open** right now ✅. How can I help you today?`;
  } else {
    return `👋 ${timeGreet}! নমস্কাৰ! The shop is **closed** right now, but I'm here 24/7 to help you online 🚀 What can I do for you?`;
  }
}

// ── INIT ─────────────────────────────────────────────────────────────────────
function initBot() {
  const restored = restoreSession();
  if (!restored) {
    addBubble(buildGreeting(), 'bot');
    showSuggestions();
  }
  updateMessageCounter();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initBot);
} else {
  initBot();
}

// ── QUICK-REPLY SUGGESTIONS ──────────────────────────────────────────────────
const SUGGESTIONS = [
  '💰 Website pricing?',
  '🤖 What AI tools are available?',
  '🌐 Show me demo websites',
];

function showSuggestions() {
  const container = document.getElementById('sd-bot-messages');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'sd-suggestions';
  el.id = 'sd-suggestions';

  SUGGESTIONS.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'sd-suggestion-btn';
    btn.textContent = text;
    btn.onclick = () => sendSuggestion(text);
    el.appendChild(btn);
  });

  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function sendSuggestion(text) {
  const el = document.getElementById('sd-suggestions');
  if (el) el.remove();
  document.getElementById('sd-user-input').value = text;
  sendMessage();
}

// ── TOGGLE ───────────────────────────────────────────────────────────────────
function toggleBot() {
  const win = document.getElementById('sd-bot-window');
  const iconOpen = document.getElementById('sd-bot-icon');
  const iconClose = document.getElementById('sd-bot-close-icon');

  isOpen = !isOpen;
  win.style.display = isOpen ? 'flex' : 'none';
  iconOpen.style.display = isOpen ? 'none' : 'inline';
  iconClose.style.display = isOpen ? 'inline' : 'none';

  if (isOpen) {
    const c = document.getElementById('sd-bot-messages');
    if (c) c.scrollTop = c.scrollHeight;
    setTimeout(() => document.getElementById('sd-user-input').focus(), 100);
  }
}

// ── SEND MESSAGE ─────────────────────────────────────────────────────────────
async function sendMessage() {
  if (isBusy) return;

  const input = document.getElementById('sd-user-input');
  const userText = input.value.trim();
  if (!userText) return;

  // Check rate limit BEFORE processing
  const rateCheck = checkRateLimit();
  if (!rateCheck.allowed) {
    addBubble(rateCheck.message, 'bot');
    if (rateCheck.reason === 'daily_cap') {
      addWhatsAppButton();
    }
    return;
  }

  // Remove suggestion chips once user sends a real message
  const sugEl = document.getElementById('sd-suggestions');
  if (sugEl) sugEl.remove();

  addBubble(userText, 'user');
  input.value = '';

  conversationHistory.push({ role: 'user', content: userText });

  // Cap history at 8 messages (4 user-assistant pairs) to reduce token usage
  if (conversationHistory.length > 8) {
    conversationHistory = conversationHistory.slice(conversationHistory.length - 8);
  }

  setBusy(true);

  try {
    const replyText = await callGroq();
    addBubble(replyText, 'bot');
    conversationHistory.push({ role: 'assistant', content: replyText });

    // Cap again after assistant reply (keep last 8 messages = 4 pairs)
    if (conversationHistory.length > 8) {
      conversationHistory = conversationHistory.slice(conversationHistory.length - 8);
    }

    // If bot mentions WhatsApp, render a one-tap button
    if (/whatsapp/i.test(replyText)) {
      addWhatsAppButton();
    }
  } catch (err) {
    let friendly;
    if (err.message === 'MISSING_KEY') {
      friendly = "My API key is missing. Please check the setup in `config.js`.";
    } else if (err.message.includes('rate limit') || err.message.includes('429')) {
      // Groq rate limit hit - show helpful message with remaining count
      const remaining = getRemainingMessages();
      friendly = `⚠️ Rate limit reached. Please wait a moment and try again.\n\n${remaining > 0 ? `You have ${remaining} messages left today.` : 'Come back tomorrow for more free messages!'}`;
    } else {
      friendly = `⚠️ Error: ${err.message}\n\nPlease try again, or reach us on WhatsApp.`;
    }

    addBubble(friendly, 'bot');

    if (err.message !== 'MISSING_KEY') addWhatsAppButton();

    console.error('Bot error:', err);
    conversationHistory.pop();
  }

  // Record this message toward daily cap (only after successful send)
  recordMessage();

  setBusy(false);
  saveSession();
}

// ── WHATSAPP BUTTON ───────────────────────────────────────────────────────────
function addWhatsAppButton() {
  const container = document.getElementById('sd-bot-messages');
  if (!container) return;
  const a = document.createElement('a');
  a.className = 'sd-wa-btn';
  a.href = 'https://wa.me/918638759478';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.innerHTML = '<span>💬</span> Chat on WhatsApp';
  container.appendChild(a);
  container.scrollTop = container.scrollHeight;
}

// ── API CALL ─────────────────────────────────────────────────────────────────
async function callGroq() {
  if (IS_PLACEHOLDER) throw new Error('MISSING_KEY');

  const messages = [
    { role: 'system', content: BOT_SYSTEM },
    ...conversationHistory,
  ];

  const isLocal = window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1'
    || window.location.protocol === 'file:';

  const url = isLocal
    ? (CONFIG.GROQ?.ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions')
    : '/.netlify/functions/chat';

  const headers = { 'Content-Type': 'application/json' };
  if (isLocal) headers['Authorization'] = `Bearer ${API_KEY}`;

  // Use model from config so it stays in sync with other apps
  const model = CONFIG.GROQ?.MODEL || 'llama-3.3-70b-versatile';

  // Fetch with timeout (15s) to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        model,
        temperature: 0.3,
        max_tokens: 350,  // Reduced to save tokens and avoid rate limits
      }),
      signal: controller.signal,
    });
  } catch (fetchErr) {
    clearTimeout(timeoutId);
    if (fetchErr.name === 'AbortError') {
      throw new Error('Request timed out. The server took too long to respond.');
    }
    throw new Error(`Network error: ${fetchErr.message}`);
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = typeof errData.error === 'string'
      ? errData.error
      : (errData.error?.message || `HTTP ${response.status}`);
    console.error('Chatbot API error:', response.status, errData);
    throw new Error(errMsg);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from Groq API');
  return text;
}

// ── MARKDOWN RENDERER ────────────────────────────────────────────────────────
// Applied only to bot messages. User messages always use textContent (safe).
function renderMarkdown(text) {
  // Step 1: escape HTML to neutralize any injected markup
  const safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Step 2: apply safe markdown transforms
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/`(.+?)`/g,       '<code>$1</code>')
    .replace(/\n/g,            '<br>');
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────
function addBubble(text, sender) {
  _sessionMessages.push({ sender, text });
  _renderBubble(text, sender);
  saveSession();
}

// Internal render — does NOT touch _sessionMessages (used during restoration)
function _renderBubble(text, sender) {
  const container = document.getElementById('sd-bot-messages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `sd-bubble sd-bubble-${sender}`;
  if (sender === 'bot') {
    div.innerHTML = renderMarkdown(text);
  } else {
    div.textContent = text;
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function setBusy(busy) {
  isBusy = busy;
  const btn    = document.getElementById('sd-send-btn');
  const typing = document.getElementById('sd-bot-typing');
  const input  = document.getElementById('sd-user-input');
  btn.disabled   = busy;
  input.disabled = busy;
  typing.style.display = busy ? 'flex' : 'none';
  if (!busy) input.focus();
}
