/* =============================================
   Smart Digital AI Bot — JavaScript
   bot.js
   =============================================
   HOW TO USE:
   1. Replace API_KEY below with your Anthropic key.
   2. Edit BOT_SYSTEM to update prices / services.
   3. That's it — everything else is automatic.
   ============================================= */

// ── CONFIG ──────────────────────────────────────────────────────────────────

// NOTE: For real projects, never ship API keys in frontend code.
// Using global GLOBAL_CONFIG from ../../config.js
const API_KEY = GLOBAL_CONFIG.API_KEY;

// System prompt: tells Claude who it is and what it knows.
// Edit this freely — no coding knowledge needed.
const BOT_SYSTEM = `
You are the friendly AI assistant for Smart Digital, a digital services shop in Assam, India.

SERVICES & PRICING:
- Website Creation: ₹3,000 – ₹16,000 (depends on complexity)
- WhatsApp Bot setup: ₹1,500 – ₹5,000
- Coming soon: PAN Card, Aadhaar, Printing, Ticket Booking

WORKING HOURS:
- Monday to Saturday, 9 AM – 6 PM IST
- Closed on Sundays and public holidays

CONTACT:
- WhatsApp / Phone: +91 86387 59478
- Email: smartdigital.assam@gmail.com

RULES:
- Be warm, helpful, and concise. Keep replies under 80 words unless the question genuinely needs more.
- If someone asks in Assamese, reply in Assamese.
- For pricing, always give the range and mention it depends on requirements.
- If you don't know something, say so honestly and suggest they contact via WhatsApp.
- Never make up information.
`.trim();

// Greeting shown when the chat window first opens
const GREETING =
  "👋 নমস্কাৰ! Hi there! I'm the Smart Digital assistant. How can I help you today?";

// ── STATE ────────────────────────────────────────────────────────────────────

// Stores the full conversation so Claude remembers context across turns
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

  // Add to conversation history (Claude needs this for memory)
  conversationHistory.push({ role: "user", content: userText });

  // Lock UI while waiting
  setBusy(true);

  try {
    const replyText = await callAI();
    addBubble(replyText, "bot");
    // Add assistant reply to history for next turn
    conversationHistory.push({ role: "assistant", content: replyText });
  } catch (err) {
    addBubble(
      "Sorry, something went wrong. Please try again or contact us on WhatsApp: +91 86387 59478",
      "bot",
    );
    console.error("Bot error:", err);
    // Remove the failed user message from history so it doesn't corrupt future turns
    conversationHistory.pop();
  }

  setBusy(false);
}

// ── API CALL ─────────────────────────────────────────────────────────────────

async function callAI() {
  // OpenRouter format
  const messages = [
    { role: "system", content: BOT_SYSTEM },
    ...conversationHistory
  ];

  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  let url = GLOBAL_CONFIG.ENDPOINT;
  let headers = { 
    "Content-Type": "application/json", 
    "Authorization": `Bearer ${API_KEY}`
  };

  if (!isLocal) {
    url = "/.netlify/functions/chat";
    delete headers["Authorization"];
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      messages: messages,
      model: GLOBAL_CONFIG.MODEL,
      temperature: GLOBAL_CONFIG.TEMPERATURE,
      max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
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
  div.className = `bubble bubble-${sender}`;
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
