/* ================================
   SCRIPTWALA — APP.JS
   Claude API–powered WhatsApp script
   generator with tabbed output,
   per-template copy, and bulk download.
   ================================ */

// ── DOM REFS ────────────────────────────────────────────────────────
const bizNameEl      = document.getElementById("bizName");
const bizTypeEl      = document.getElementById("bizType");
const productsEl     = document.getElementById("products");
const ownerNameEl    = document.getElementById("ownerName");
const generateBtn    = document.getElementById("generateBtn");
const genBtnText     = generateBtn.querySelector(".gen-btn-text");
const genLoader      = document.getElementById("genLoader");
const errorBox       = document.getElementById("errorBox");
const errorMsgEl     = document.getElementById("errorMsg");
const outputSection  = document.getElementById("outputSection");
const tabBar         = document.getElementById("tabBar");
const panelsCont     = document.getElementById("panelsContainer");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const regenBtn       = document.getElementById("regenBtn");

// ── TEMPLATE META ───────────────────────────────────────────────────
const TEMPLATE_META = {
  reply:   { label: "💬 Reply Templates",      icon: "💬" },
  product: { label: "🛒 Product Descriptions", icon: "🛒" },
  promo:   { label: "🎯 Promo & Offers",        icon: "🎯" },
  festive: { label: "🪔 Festive Messages",      icon: "🪔" },
};

// Store generated results for download
let generatedData = {};

// ── GENERATE ────────────────────────────────────────────────────────
generateBtn.addEventListener("click", handleGenerate);
regenBtn.addEventListener("click", () => {
  outputSection.hidden = true;
  generatedData = {};
  document.getElementById("generator").scrollIntoView({ behavior: "smooth" });
});

async function handleGenerate() {
  const bizName   = bizNameEl.value.trim();
  const bizType   = bizTypeEl.value.trim();
  const products  = productsEl.value.trim();
  const ownerName = ownerNameEl.value.trim();
  const tone      = document.querySelector('input[name="tone"]:checked')?.value || "Friendly & Casual";
  const selected  = [...document.querySelectorAll('input[name="templates"]:checked')].map(el => el.value);

  hideError();

  if (!bizName) { showError("Please enter your business name."); bizNameEl.focus(); return; }
  if (!bizType) { showError("Please enter your business type."); bizTypeEl.focus(); return; }
  if (!products) { showError("Please list at least one product or service."); productsEl.focus(); return; }
  if (selected.length === 0) { showError("Please select at least one template type."); return; }

  setLoading(true);
  outputSection.hidden = true;
  tabBar.innerHTML = "";
  panelsCont.innerHTML = "";
  generatedData = {};

  const bizInfo = {
    name: bizName,
    type: bizType,
    products,
    ownerName: ownerName || bizName,
    tone,
    selected,
  };

  // Generate all selected template types in parallel
  const promises = selected.map(type => generateTemplates(type, bizInfo));

  try {
    const results = await Promise.all(promises);

    results.forEach((result, idx) => {
      const type = selected[idx];
      generatedData[type] = result;
    });

    renderOutput(selected, generatedData);
    outputSection.hidden = false;
    outputSection.scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (err) {
    console.error(err);
    if (err.message.includes("401") || err.message.includes("403")) {
      showError("API authentication error. Please check your API key configuration.");
    } else if (err.message.includes("429")) {
      showError("Rate limit reached. Please wait a moment and try again.");
    } else {
      showError("Generation failed. Please check your connection and try again. (" + err.message + ")");
    }
  } finally {
    setLoading(false);
  }
}

// ── SINGLE TEMPLATE TYPE GENERATION ────────────────────────────────
async function generateTemplates(type, bizInfo) {
  const systemPrompt = buildSystem(bizInfo.tone, bizInfo.name);
  const userPrompt   = buildPrompt(type, bizInfo);

  try {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    let url = GLOBAL_CONFIG.ENDPOINT;
    let headers = { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${GLOBAL_CONFIG.API_KEY}`
    };

    if (!isLocal) {
      url = "/.netlify/functions/chat";
      delete headers["Authorization"];
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        messages: [
          { role: 'system', content: buildSystem(bizInfo.tone, bizInfo.name) },
          { role: 'user', content: buildPrompt(type, bizInfo) }
        ],
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices && data.choices[0]?.message?.content?.trim();
    if (!result) throw new Error("Empty response from AI");

    return parseTemplates(result);
  } catch (err) {
    console.error("Single generation error:", err);
    throw err;
  }
}

// ── SYSTEM PROMPT ───────────────────────────────────────────────────
function buildSystem(tone, bizName) {
  const toneGuide = {
    "Formal / Professional": "Use formal, professional language. Proper grammar. No slang. Suitable for established businesses and corporate clients.",
    "Friendly & Casual": "Use warm, friendly, conversational language. Emojis welcome. Feel like chatting with a helpful neighbour.",
    "Hinglish (Hindi+English mix)": "Mix Hindi and English naturally as spoken in Indian cities. Use Devanagari words in Roman script (e.g., 'aapka', 'bahut accha', 'special offer hai'). Emojis are great.",
    "Assamese regional feel": "Reflect Northeast Indian warmth. Use some Assamese words in Roman script (e.g., 'apunar', 'bohot', 'ধন্যবাদ' written as 'Dhanyabaad'). Friendly, community-feel tone.",
  };

  return `You are ScriptWala, an expert WhatsApp Business copywriter for Indian small businesses.

Business: ${bizName}
Tone style: ${tone}
Tone guidance: ${toneGuide[tone] || toneGuide["Friendly & Casual"]}

CRITICAL OUTPUT FORMAT:
- Always output templates as a numbered list
- Start each template with: [TEMPLATE N: Short Title]
- Then the actual WhatsApp message on the next line(s)
- End each template with --- on its own line
- No extra explanation, no preamble, just the templates

Example:
[TEMPLATE 1: Welcome Greeting]
Namaste! 🙏 Welcome to our store...
---
[TEMPLATE 2: Order Confirmation]
Thank you for your order! ✅...
---`;
}

// ── USER PROMPTS PER TYPE ───────────────────────────────────────────
function buildPrompt(type, b) {
  const base = `Business Name: ${b.name}
Business Type: ${b.bizType || b.type}
Products/Services: ${b.products}
Contact/Owner Name: ${b.ownerName}`;

  const prompts = {
    reply: `${base}

Generate 6 WhatsApp reply templates:
1. First welcome / greeting message for a new customer
2. Response when asked about product availability
3. Order received / confirmation message
4. Delivery update / when order is out for delivery
5. Thank you message after purchase
6. Follow-up message to check customer satisfaction (send 2 days after purchase)

Make each message feel real and ready-to-send. Include relevant emojis.`,

    product: `${base}

Generate 5 WhatsApp product description messages. For each:
- Pick one of the products/services listed above
- Write a short punchy WhatsApp message showcasing it
- Include: what it is, why it's good, price hint (say 'at great prices' if no price given), CTA to message/order
- Keep it under 100 words each
- Include relevant emojis

These will be sent as catalogue messages or broadcast messages to customers.`,

    promo: `${base}

Generate 5 WhatsApp promotional messages:
1. Flash sale / limited-time offer (create a believable offer)
2. Weekend special message
3. Bulk/wholesale discount offer
4. First-time customer welcome discount
5. Referral offer (refer a friend)

Each message should feel urgent and exciting. Include emojis, call-to-action to message back or visit. Keep each under 120 words.`,

    festive: `${base}

Generate 5 WhatsApp festive messages:
1. Diwali special offer / greeting
2. Eid Mubarak with a special offer
3. Bihu / New Year greetings (relevant for Assam / NE India)
4. Christmas / New Year combo offer
5. Generic "Festival Season" offer message (usable for any festival)

Each should feel warm, celebratory, and include a business offer or CTA. Use relevant emojis for each festival. Keep each under 110 words.`,
  };

  return prompts[type] || prompts.reply;
}

// ── PARSE TEMPLATES FROM AI RESPONSE ───────────────────────────────
function parseTemplates(raw) {
  const templates = [];
  // Split on --- separator
  const blocks = raw.split(/\n---\n?/).filter(b => b.trim());

  for (const block of blocks) {
    const titleMatch = block.match(/\[TEMPLATE\s*\d+:\s*(.+?)\]/i);
    const title = titleMatch ? titleMatch[1].trim() : `Template ${templates.length + 1}`;
    // Remove the title line, get the message body
    const body = block.replace(/\[TEMPLATE\s*\d+:\s*.+?\]\n?/i, "").trim();
    if (body) {
      templates.push({ title, body });
    }
  }

  // Fallback: if parsing failed, split by double newline and treat each chunk as a template
  if (templates.length === 0) {
    const chunks = raw.split(/\n{2,}/).filter(c => c.trim().length > 30);
    chunks.forEach((chunk, i) => {
      templates.push({ title: `Message ${i + 1}`, body: chunk.trim() });
    });
  }

  return templates;
}

// ── RENDER OUTPUT ───────────────────────────────────────────────────
function renderOutput(selectedTypes, data) {
  tabBar.innerHTML = "";
  panelsCont.innerHTML = "";

  selectedTypes.forEach((type, idx) => {
    const meta = TEMPLATE_META[type];
    const templates = data[type] || [];

    // Tab pill
    const pill = document.createElement("button");
    pill.className = "tab-pill" + (idx === 0 ? " active" : "");
    pill.textContent = meta.label;
    pill.dataset.type = type;
    pill.addEventListener("click", () => switchTab(type));
    tabBar.appendChild(pill);

    // Panel
    const panel = document.createElement("div");
    panel.className = "template-panel" + (idx === 0 ? " active" : "");
    panel.id = `panel-${type}`;

    const items = document.createElement("div");
    items.className = "template-items";

    templates.forEach((tmpl, i) => {
      const item = document.createElement("div");
      item.className = "template-item";
      item.innerHTML = `
        <div class="item-header">
          <span class="item-label">${meta.icon} ${tmpl.title}</span>
          <button class="copy-single-btn" data-idx="${i}" data-type="${type}">📋 Copy</button>
        </div>
        <div class="item-body">${escapeHtml(tmpl.body)}</div>
      `;
      items.appendChild(item);
    });

    panel.appendChild(items);
    panelsCont.appendChild(panel);
  });

  // Copy single button events
  panelsCont.querySelectorAll(".copy-single-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const type = btn.dataset.type;
      const idx  = parseInt(btn.dataset.idx);
      const text = (generatedData[type] || [])[idx]?.body || "";
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = "✅ Copied!";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = orig; btn.classList.remove("copied"); }, 2000);
      } catch { /* ignore */ }
    });
  });
}

function switchTab(type) {
  document.querySelectorAll(".tab-pill").forEach(p => p.classList.toggle("active", p.dataset.type === type));
  document.querySelectorAll(".template-panel").forEach(p => p.classList.toggle("active", p.id === `panel-${type}`));
}

// ── DOWNLOAD ALL ────────────────────────────────────────────────────
downloadAllBtn.addEventListener("click", () => {
  const bizName = bizNameEl.value.trim() || "Business";
  const lines = [`SCRIPTWALA — WhatsApp Script Pack for: ${bizName}`, `Generated on: ${new Date().toLocaleString("en-IN")}`, "=".repeat(60), ""];

  Object.entries(generatedData).forEach(([type, templates]) => {
    const meta = TEMPLATE_META[type];
    lines.push(meta.label.toUpperCase());
    lines.push("─".repeat(40));
    templates.forEach((tmpl, i) => {
      lines.push(`\n[${i + 1}] ${tmpl.title}`);
      lines.push(tmpl.body);
      lines.push("─".repeat(30));
    });
    lines.push("\n");
  });

  lines.push("=".repeat(60));
  lines.push("Generated by ScriptWala · WhatsApp Scripts for Indian Businesses");

  const content  = lines.join("\n");
  const blob     = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url      = URL.createObjectURL(blob);
  const a        = document.createElement("a");
  const safeName = bizName.replace(/[^a-zA-Z0-9]/g, "_");
  a.href         = url;
  a.download     = `ScriptWala_${safeName}_WhatsApp_Scripts.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── HELPERS ─────────────────────────────────────────────────────────
function setLoading(on) {
  generateBtn.disabled = on;
  genBtnText.hidden    = on;
  genLoader.hidden     = !on;
}

function showError(msg) {
  errorMsgEl.textContent = msg;
  errorBox.hidden = false;
  errorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideError() { errorBox.hidden = true; }

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
