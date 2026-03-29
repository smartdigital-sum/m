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

// WARNING: API keys in frontend code are visible to anyone.
// For production, route requests through a backend proxy instead.

const CONFIG = window.SMART_DIGITAL_CONFIG || {};
const API_KEY = CONFIG.OPENROUTER?.API_KEY || CONFIG.OPENROUTER_API_KEY || "";
const IS_PLACEHOLDER = API_KEY === "YOUR_OPENROUTER_API_KEY_HERE" || API_KEY === "";

// System prompt: tells the Groq LLM who it is and what it knows.
const BOT_SYSTEM = `
You are the friendly AI assistant for Smart Digital, a premium digital services shop and AI Hub in Kampur, Assam, India.

OUR OVERALL VALUE:
Smart Digital bridges the gap between traditional offline services and cutting-edge AI technology for the people of Northeast India. We provide physical digital services, build custom websites, host interactive games for kids, and offer a suite of professional AI tools.

LINGUISTIC RULES (CRITICAL):
- You must strictly use ASSAMESE (অসমীয়া) when requested or when responding to regional queries.
- DO NOT use Bengali (বাংলা). Although they look similar, they are different languages.
- ALWAYS use unique Assamese characters: 'ৰ' (Ra) and 'ৱ' (Wa). Never use the Bengali 'র'.
- Use Assamese vocabulary:
  *   Use 'আপুনি' (Apuni) instead of 'আপনি' (Apni).
  *   Use 'আপোনাৰ' instead of 'আপনার'.
  *   Use 'সহায়' (xohay) instead of 'সাহায্য' (sahajyo).
  *   Use 'কেনেকৈ' (kenekoi) instead of 'কিভাবে' (kibhabe).
  *   Use 'কৰিব পাৰোঁ' instead of 'করতে পারি'.
- BENGALI VS ASSAMESE WORD LIST (NEVER USE BENGALI):
  *   NEVER use 'নিচে' or 'নিচেৰ' (Bengali). ALWAYS use 'তলত' or 'তলৰ' (Assamese).
  *   NEVER use 'জন্য' (Bengali). ALWAYS use 'বাবে' (Assamese).
  *   NEVER use 'সাথে' (Bengali). ALWAYS use 'লগত' (Assamese).
  *   NEVER use 'বলুন' (Bengali). ALWAYS use 'কওক' / 'কওঁক' (Assamese).
  *   NEVER use 'হবে' (Bengali). ALWAYS use 'হ’ব' (Assamese).
- ASSAMESE SENTENCE EXAMPLES:
  *   "আপুনি কেনে আছে?" (How are you?) - Correct Assamese.
  *   "মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?" (How can I help you?) - Correct Assamese.
- Address users with "নমস্কাৰ" (Nomoskar).

WEBSITE SECTIONS & NAVIGATION:
- If a user asks for "Demo Websites", "Websites", or "Demos", tell them to scroll down to the "Websites" section. 
- List our Demo Categories: Medical Shop, School Portal, Salon & Spa, Grocery Store, Restaurant, Fitness & Gym, DG Demo Web, and Clothing Shop.
- Tell them each category has multiple live demos they can open.

DEMO WEBSITES LIST:
1. Medical Shop: Pharmacy catalog, prescription upload & home delivery.
2. School Portal: Courses, admissions, events, and student portal.
3. Salon & Spa: Service catalog, appointment booking & reviews.
4. Grocery Store: E-commerce store with cart and payments.
5. Restaurant: Menu showcase, online ordering, and reservations.
6. Fitness & Gym: Membership plans, class schedules, and trainer profiles.
7. DG Demo Web: Modern landing pages, agency portfolios, and showcases.
8. Clothing Shop: Online fashion store with product catalog & cart.

GAMES & PROJECTS:
- We have a "Games & Projects" tab inside the Websites section.
- Featured Games: Snake Game, Memory Match (Assamese icons), Flappy Bird, Space Shooter, Dice Roller, and Click Counter.

STUDY ZONE (KIDS):
- Located after the Announcements section. Two main gateways:
  1. Khelona Hub: For little learners (Ages 0-3). 10+ games.
  2. Fun Learning Hub: For ages 3-6. 25+ brain games (Math, Science, etc.).

AI POWERED SERVICES (Online Portal):
We offer 9 specialized AI tools for free in our "AI Powered Services" tab:
1. LipiAntar: Professional Government/Legal Translation (Assamese, Hindi, English).
2. BizWrite: Business profile and social media bio generator.
3. PatraLekhak: Formal and legal letter writer.
4. ScriptWala: Marketing and WhatsApp script generator.
5. StudyBuddy: Class 9 & 10 homework assistance.
6. Smart Assistant: That's me!
7. ExamCraft Pro: Professional question paper generator.
8. ShopWrite AI: E-commerce copy and SEO tool.
9. Resume Builder: Professional ATS-friendly resumes in 60 seconds.

OFFLINE SERVICES (Physical Shop):
- Website Creation: ₹3,000 – ₹16,000.
- n8n WhatsApp Bot Automation: ₹1,500 – ₹5,000.
- Documentation: PAN Card, Aadhaar Services, Printing, Scanning, Ticket Booking.

SHOP DETAILS:
- Hours: Mon-Sat, 9 AM – 6 PM.
- Location: Kachua Tiniali, Kampur, Assam.
- WhatsApp: +91 86387 59478

STYLE:
- Friendly, witty, and optimistic. Use emojis natural to Assamese people (🙏, ✨, 🚀).
- Keep replies under 70 words. Be direct and help them find what they need.
- If you don't know something, honestly admit that human brains are sometimes better and suggest they contact the real boss via WhatsApp.
- Never make up information.
`.trim();

// Greeting shown when the chat window first opens
const GREETING =
  "👋 নমস্কাৰ! Hi there! I'm the Smart Digital assistant. How can I help you today?";

// ── STATE ────────────────────────────────────────────────────────────────────

// Stores the full conversation so the LLM remembers context across turns
let conversationHistory = [];
let isOpen = false;
let isBusy = false; // prevents sending multiple messages at once

// ── INIT ─────────────────────────────────────────────────────────────────────

// Add greeting when the page loads (not when window opens — keeps it natural)
window.addEventListener("DOMContentLoaded", () => {
  addBubble(GREETING, "bot");
  conversationHistory = []; // greeting is not part of API history
});

// ── TOGGLE ───────────────────────────────────────────────────────────────────

function toggleBot() {
  const win = document.getElementById("sd-bot-window");
  const iconOpen = document.getElementById("sd-bot-icon");
  const iconClose = document.getElementById("sd-bot-close-icon");

  isOpen = !isOpen;
  win.style.display = isOpen ? "flex" : "none";
  iconOpen.style.display = isOpen ? "none" : "inline";
  iconClose.style.display = isOpen ? "inline" : "none";

  if (isOpen) {
    if (IS_PLACEHOLDER && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      addBubble(
        "⚠️ **API Key Missing**: Please open `assets/js/config.js` and replace 'YOUR_OPENROUTER_API_KEY_HERE' with your real OpenRouter API key to enable the AI.",
        "bot"
      );
    }
    // Focus input when opened
    setTimeout(() => document.getElementById("sd-user-input").focus(), 100);
  }
}

// ── SEND MESSAGE ─────────────────────────────────────────────────────────────

async function sendMessage() {
  if (isBusy) return;

  const input = document.getElementById("sd-user-input");
  const userText = input.value.trim();
  if (!userText) return;

  // Show user bubble and clear input
  addBubble(userText, "user");
  input.value = "";

  // Add to conversation history (the LLM needs this for memory)
  conversationHistory.push({ role: "user", content: userText });

  // Lock UI while waiting
  setBusy(true);

  try {
    if (IS_PLACEHOLDER && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      throw new Error("MISSING_KEY");
    }
    const replyText = await callAI();
    addBubble(replyText, "bot");
    // Add assistant reply to history for next turn
    conversationHistory.push({ role: "assistant", content: replyText });
  } catch (err) {
    if (err.message === "MISSING_KEY") {
      addBubble(
        "I can't chat right now because my API key is missing. Please check the setup instructions in `assets/js/config.js`.",
        "bot"
      );
    } else {
      addBubble(
        "Sorry, something went wrong. This might be due to an invalid API key or connection issue. Please contact support.",
        "bot"
      );
    }
    console.error("Bot error:", err);
    // Remove the failed user message from history so it doesn't corrupt future turns
    conversationHistory.pop();
  }

  setBusy(false);
}

// ── API CALL ─────────────────────────────────────────────────────────────────

async function callAI() {
  // OpenRouter uses OpenAI-compatible format
  const messages = [
    { role: "system", content: BOT_SYSTEM },
    ...conversationHistory,
  ];

  // If we're on a live site, use the Netlify Function (hides your API Key)
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  
  let url = "https://openrouter.ai/api/v1/chat/completions";
  let headers = { 
    "Content-Type": "application/json", 
    "Authorization": `Bearer ${API_KEY}`,
    "HTTP-Referer": "https://smartdigitalkampur.netlify.app/",
    "X-Title": "Smart Digital"
  };

  if (!isLocal) {
    url = "/.netlify/functions/chat";
    delete headers["Authorization"]; // Backend will add the key
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      messages: messages,
      model: "stepfun/step-3.5-flash:free",
      temperature: 0.4,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices && data.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty response from OpenRouter API");
  return text;
}

// ── UI HELPERS ───────────────────────────────────────────────────────────────

function addBubble(text, sender) {
  const container = document.getElementById("sd-bot-messages");

  const div = document.createElement("div");
  div.className = `sd-bubble sd-bubble-${sender}`;
  div.innerText = text;

  container.appendChild(div);
  // Auto-scroll to latest message
  container.scrollTop = container.scrollHeight;
}

function setBusy(busy) {
  isBusy = busy;

  const btn = document.getElementById("sd-send-btn");
  const typing = document.getElementById("sd-bot-typing");
  const input = document.getElementById("sd-user-input");

  btn.disabled = busy;
  input.disabled = busy;
  typing.style.display = busy ? "flex" : "none";

  if (!busy) input.focus();
}
