/* ===========================
   LIPIANTAR — APP.JS
   Claude API–powered translation
   =========================== */

// ── CONFIGURATION ──────────────────────────────────────────────────
// Using global GLOBAL_CONFIG from ../../config.js

// Pricing tiers (words → price in ₹)
const PRICING = [
  { max: 300,  price: 50,  label: "Short Notice"      },
  { max: 800,  price: 100, label: "Standard Document"  },
  { max: Infinity, price: 150, label: "Long Document"  },
];

// ── DOM REFS ────────────────────────────────────────────────────────
const sourceLangEl   = document.getElementById("sourceLang");
const targetLangEl   = document.getElementById("targetLang");
const swapBtn        = document.getElementById("swapBtn");
const fileInput      = document.getElementById("fileInput");
const fileNameEl     = document.getElementById("fileName");
const sourceTextEl   = document.getElementById("sourceText");
const wordCountEl    = document.getElementById("wordCount");
const priceEstEl     = document.getElementById("priceEstimate");
const translateBtn   = document.getElementById("translateBtn");
const btnText        = translateBtn.querySelector(".btn-text");
const btnLoader      = document.getElementById("btnLoader");
const outputArea     = document.getElementById("outputArea");
const outputTextEl   = document.getElementById("outputText");
const outputMetaEl   = document.getElementById("outputMeta");
const copyBtn        = document.getElementById("copyBtn");
const downloadBtn    = document.getElementById("downloadBtn");
const errorArea      = document.getElementById("errorArea");
const errorMsg       = document.getElementById("errorMsg");

// ── WORD COUNT & PRICING ESTIMATE ──────────────────────────────────
function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function getPriceTier(wordCount) {
  return PRICING.find(tier => wordCount <= tier.max) || PRICING[PRICING.length - 1];
}

function updateWordCount() {
  const words = countWords(sourceTextEl.value);
  wordCountEl.textContent = words === 1 ? "1 word" : `${words.toLocaleString()} words`;

  if (words === 0) {
    priceEstEl.textContent = "";
  } else {
    const tier = getPriceTier(words);
    priceEstEl.textContent = `Estimated: ₹${tier.price} (${tier.label})`;
  }
}

sourceTextEl.addEventListener("input", updateWordCount);

// ── SWAP LANGUAGES ──────────────────────────────────────────────────
swapBtn.addEventListener("click", () => {
  const src = sourceLangEl.value;
  const tgt = targetLangEl.value;

  // Swap selection values
  if ([...sourceLangEl.options].some(o => o.value === tgt)) {
    sourceLangEl.value = tgt;
  }
  if ([...targetLangEl.options].some(o => o.value === src)) {
    targetLangEl.value = src;
  }

  // Also swap text if there's a translation showing
  if (outputTextEl.textContent && sourceTextEl.value) {
    const currentSource = sourceTextEl.value;
    sourceTextEl.value = outputTextEl.textContent;
    outputTextEl.textContent = currentSource;
    updateWordCount();
  }
});

// ── FILE UPLOAD ─────────────────────────────────────────────────────
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  fileNameEl.textContent = file.name;
  hideError();

  const ext = file.name.split(".").pop().toLowerCase();

  try {
    if (ext === "txt") {
      const text = await readAsText(file);
      sourceTextEl.value = text;
    } else if (ext === "pdf") {
      await readPDF(file);
    } else if (ext === "docx") {
      await readDOCX(file);
    } else {
      showError("Unsupported file type. Please upload .txt, .pdf, or .docx");
    }
    updateWordCount();
  } catch (err) {
    showError("Could not read the file. Please try pasting your text directly.");
    console.error(err);
  }
});

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file, "UTF-8");
  });
}

async function readPDF(file) {
  // Dynamically load PDF.js from CDN
  if (!window.pdfjsLib) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }

  sourceTextEl.value = fullText.trim();
}

async function readDOCX(file) {
  // Dynamically load mammoth from CDN
  if (!window.mammoth) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js");
  }

  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  sourceTextEl.value = result.value.trim();
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── TRANSLATION ─────────────────────────────────────────────────────
translateBtn.addEventListener("click", handleTranslate);

async function handleTranslate() {
  const text = sourceTextEl.value.trim();
  if (!text) { showError("Please enter or upload text to translate."); return; }

  const src = sourceLangEl.value;
  const tgt = targetLangEl.value;

  if (src === tgt) {
    showError("Source and target languages are the same. Please select different languages.");
    return;
  }

  hideError();
  hideOutput();
  setLoading(true);

  const words = countWords(text);
  const tier  = getPriceTier(words);

  const systemPrompt = buildSystemPrompt(src, tgt);
  const userPrompt   = buildUserPrompt(text, src, tgt);

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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
        temperature: GLOBAL_CONFIG.TEMPERATURE,
      }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.choices && data.choices[0]?.message?.content?.trim();
    if (!translated) throw new Error("Empty response from AI");

    showOutput(translated, src, tgt, words, tier);

  } catch (err) {
    console.error(err);
    if (err.message.includes("401") || err.message.includes("403")) {
      showError("API authentication error. Please check your API key configuration.");
    } else if (err.message.includes("429")) {
      showError("Rate limit reached. Please wait a moment and try again.");
    } else {
      showError("Translation failed. Please check your connection and try again. (" + err.message + ")");
    }
  } finally {
    setLoading(false);
  }
}

function buildSystemPrompt(src, tgt) {
  return `You are LipiAntar, a professional document translator specializing in ${src} and ${tgt} for Indian government, legal, and official documents.

Your task is to translate documents accurately while:
- Preserving the formal, official tone of government notices, legal documents, and circulars
- Maintaining proper formatting (paragraph breaks, lists, numbering)
- Using appropriate official terminology for the target language
- For Assamese: use proper অসমীয়া script and official register
- For Hindi: use proper देवनागरी script and sarkari/official style
- For English: use formal British/Indian-government English

Provide ONLY the translated text. No explanations, no notes, no preamble. Just the clean translation.`;
}

function buildUserPrompt(text, src, tgt) {
  return `Translate the following ${src} document to ${tgt}:

${text}`;
}

// ── UI HELPERS ──────────────────────────────────────────────────────
function setLoading(on) {
  translateBtn.disabled = on;
  btnText.hidden = on;
  btnLoader.hidden = !on;
}

function showOutput(text, src, tgt, words, tier) {
  outputTextEl.textContent = text;
  outputMetaEl.textContent =
    `${src} → ${tgt}  ·  ${words} words  ·  ${countWords(text)} words translated  ·  Recommended charge: ₹${tier.price} (${tier.label})`;
  outputArea.hidden = false;
  outputArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideOutput() { outputArea.hidden = true; outputTextEl.textContent = ""; }

function showError(msg) {
  errorMsg.textContent = msg;
  errorArea.hidden = false;
}

function hideError() { errorArea.hidden = true; }

// ── COPY ────────────────────────────────────────────────────────────
copyBtn.addEventListener("click", async () => {
  const text = outputTextEl.textContent;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const original = copyBtn.textContent;
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => { copyBtn.textContent = original; }, 2000);
  } catch {
    showError("Could not copy. Please select and copy the text manually.");
  }
});

// ── DOWNLOAD ────────────────────────────────────────────────────────
downloadBtn.addEventListener("click", () => {
  const text = outputTextEl.textContent;
  if (!text) return;

  const src  = sourceLangEl.value;
  const tgt  = targetLangEl.value;
  const date = new Date().toISOString().slice(0, 10);
  const filename = `LipiAntar_${src}_to_${tgt}_${date}.txt`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── INIT ────────────────────────────────────────────────────────────
updateWordCount();
