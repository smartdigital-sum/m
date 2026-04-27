/* ===========================
   LIPIANTAR — APP.JS
   Claude API–powered translation
   =========================== */

// ── PLANS ────────────────────────────────────────────────────────────
const PAYMENT_PLANS = {
  single: { label: 'Single Document', base: 20, credits: 1 },
  pack:   { label: '5 Documents Pack', base: 60, credits: 5 },
};

// ── STATE ────────────────────────────────────────────────────────────
let isFileUpload = false;
let pendingPlan  = null;
let payMethod    = 'upi';
let currentTone  = 'official';   // 'official' | 'simple' | 'academic'
let isSideBySide = false;        // Feature 5

// ── DOM REFS ─────────────────────────────────────────────────────────
const sourceLangEl  = document.getElementById("sourceLang");
const targetLangEl  = document.getElementById("targetLang");
const swapBtn       = document.getElementById("swapBtn");
const fileInput     = document.getElementById("fileInput");
const fileNameEl    = document.getElementById("fileName");
const sourceTextEl  = document.getElementById("sourceText");
const wordCountEl   = document.getElementById("wordCount");
const priceEstEl    = document.getElementById("priceEstimate");
const translateBtn  = document.getElementById("translateBtn");
const btnText       = translateBtn?.querySelector(".btn-text");
const btnLoader     = document.getElementById("btnLoader");
const outputArea    = document.getElementById("outputArea");
const outputTextEl  = document.getElementById("outputText");
const outputMetaEl  = document.getElementById("outputMeta");
const copyBtn       = document.getElementById("copyBtn");
const downloadBtn   = document.getElementById("downloadBtn");
const downloadDocxBtn = document.getElementById("downloadDocxBtn");
const errorArea     = document.getElementById("errorArea");
const errorMsg      = document.getElementById("errorMsg");
const creditsEl     = document.getElementById("creditsDisplay");
const fileModeBar   = document.getElementById("fileModeBar");
const clearFileBtn  = document.getElementById("clearFileBtn");
const scriptWarning = document.getElementById("scriptWarning");
const scriptWarnMsg = document.getElementById("scriptWarningMsg");

// Fail fast if the core translator shell is missing from the page.
// Without these elements the script would throw later at random call sites
// and leave the UI in a half-initialised state.
const REQUIRED_ELEMENTS = {
  sourceLang: sourceLangEl, targetLang: targetLangEl, swapBtn,
  fileInput, sourceText: sourceTextEl, wordCount: wordCountEl,
  priceEstimate: priceEstEl, translateBtn, btnText,
  outputText: outputTextEl,
};
const MISSING_ELEMENTS = Object.entries(REQUIRED_ELEMENTS)
  .filter(([, el]) => !el)
  .map(([id]) => id);
if (MISSING_ELEMENTS.length) {
  console.error(
    "[Lipiantar] Translator init aborted — missing elements:",
    MISSING_ELEMENTS.join(", ")
  );
  throw new Error(`Translator init failed: missing ${MISSING_ELEMENTS.join(", ")}`);
}

// ── CREDITS SYSTEM (Firestore-backed) ────────────────────────────────
// Legacy localStorage helpers kept for glossary/history only.
// Doc credits now live in Firestore via firebase-auth.js.

function getCredits() {
  // Return Firestore credits if logged in, else 0
  if (window.currentUserData) return window.currentUserData.docsRemaining || 0;
  return 0;
}

function updateCreditsDisplay() {
  // Delegated to firebase-auth.js updateCreditsDisplay() when logged in.
  // Also update the inline credits bar in the translator card.
  if (creditsEl) {
    const u = window.currentUserData;
    if (!u) { creditsEl.style.display = 'none'; return; }
    const remaining = u.docsRemaining || 0;
    if (remaining > 0) {
      creditsEl.textContent = `📄 ${remaining} file credit${remaining !== 1 ? 's' : ''} remaining`;
      creditsEl.style.display = 'inline-block';
    } else {
      creditsEl.style.display = 'none';
    }
  }
  // Also update the header badge via firebase-auth.js helper
  if (typeof window.currentUserData !== 'undefined') {
    const badge = document.getElementById('creditsBadge');
    if (!badge) return;
    const u = window.currentUserData;
    if (!u) return;
    const demoUsed  = u.demoUsed      || 0;
    const remaining = u.docsRemaining || 0;
    const hasPlan   = !!u.plan;
    if (hasPlan && remaining > 0) {
      badge.textContent      = `${remaining} doc${remaining !== 1 ? 's' : ''} left`;
      badge.style.background = '#2563EB';
    } else if (hasPlan && remaining <= 0) {
      badge.textContent      = 'Credits used';
      badge.style.background = '#dc2626';
    } else if (demoUsed < 1) {
      badge.textContent      = '1 free demo';
      badge.style.background = '#f59e0b';
    } else {
      badge.textContent      = 'Demo used — Buy plan';
      badge.style.background = '#dc2626';
    }
  }
}

// ── TONE SELECTOR ────────────────────────────────────────────────────
function selectTone(tone) {
  currentTone = tone;
  ['official', 'simple', 'academic'].forEach(t => {
    document.getElementById(`tone-${t}`)?.classList.toggle('active', t === tone);
  });
}

// ── FILE MODE ────────────────────────────────────────────────────────
function setFileMode(filename) {
  isFileUpload = true;
  if (fileModeBar) {
    fileModeBar.style.display = 'flex';
    const nameSpan = fileModeBar.querySelector('.fmb-name');
    if (nameSpan) nameSpan.textContent = filename;
  }
  updateWordCount();
  updateTranslateBtn();
}

function clearFileMode() {
  isFileUpload = false;
  if (fileModeBar) fileModeBar.style.display = 'none';
  sourceTextEl.value = '';
  fileInput.value = '';
  if (fileNameEl) fileNameEl.textContent = '';
  hideOutput();
  updateWordCount();
  updateTranslateBtn();
}

function updateTranslateBtn() {
  const c = getCredits();
  const loggedIn = !!window.auth?.currentUser;
  if (isFileUpload && !loggedIn) {
    btnText.textContent = 'Sign In to Translate →';
  } else if (isFileUpload && c === 0) {
    btnText.textContent = 'Pay & Translate →';
  } else if (isFileUpload && c > 0) {
    btnText.textContent = `Translate Document (${c} credit${c !== 1 ? 's' : ''} left)`;
  } else {
    btnText.textContent = 'Translate Free →';
  }
}

if (clearFileBtn) clearFileBtn.addEventListener('click', clearFileMode);

// ── WORD COUNT ───────────────────────────────────────────────────────
function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function updateWordCount() {
  const words = countWords(sourceTextEl.value);
  wordCountEl.textContent = words === 1 ? "1 word" : `${words.toLocaleString()} words`;
  if (isFileUpload) {
    const c = getCredits();
    priceEstEl.textContent = c > 0 ? `File mode · 1 credit will be used` : `File mode · Requires ₹20 credit`;
    wordCountEl.style.color = '';
  } else {
    if (words > FREE_WORD_LIMIT) {
      wordCountEl.textContent += ` — limit ${FREE_WORD_LIMIT} (free)`;
      wordCountEl.style.color = '#e53e3e';
      priceEstEl.textContent = `Over limit · Upload as file for ₹20`;
    } else if (words > FREE_WORD_LIMIT * 0.85) {
      wordCountEl.style.color = '#dd6b20';
      priceEstEl.textContent = `${FREE_WORD_LIMIT - words} words remaining (free)`;
    } else {
      wordCountEl.style.color = '';
      priceEstEl.textContent = words > 0 ? `✓ Paste mode — Free (up to ${FREE_WORD_LIMIT} words)` : '';
    }
  }
}

sourceTextEl.addEventListener("input", updateWordCount);

// ── SWAP LANGUAGES ───────────────────────────────────────────────────
swapBtn.addEventListener("click", () => {
  const src = sourceLangEl.value;
  const tgt = targetLangEl.value;
  if ([...sourceLangEl.options].some(o => o.value === tgt)) sourceLangEl.value = tgt;
  if ([...targetLangEl.options].some(o => o.value === src)) targetLangEl.value = src;
  if (outputTextEl.textContent && sourceTextEl.value) {
    const currentSource = sourceTextEl.value;
    sourceTextEl.value = outputTextEl.textContent;
    outputTextEl.textContent = currentSource;
    updateWordCount();
  }
});

// ── FILE UPLOAD ──────────────────────────────────────────────────────
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  hideError();
  const ext = file.name.split(".").pop().toLowerCase();
  try {
    if (ext === "txt")       sourceTextEl.value = await readAsText(file);
    else if (ext === "pdf")  await readPDF(file);
    else if (ext === "docx") await readDOCX(file);
    else { showError("Unsupported file type. Please upload .txt, .pdf, or .docx"); return; }
    setFileMode(file.name);
  } catch (err) {
    showError("Could not read the file. Please try pasting your text directly.");
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
    fullText += content.items.map(item => item.str).join(" ") + "\n";
  }
  sourceTextEl.value = fullText.trim();
}

async function readDOCX(file) {
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
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── TRANSLATION ──────────────────────────────────────────────────────
translateBtn.addEventListener("click", handleTranslate);

// Ctrl+Enter shortcut
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    if (!translateBtn.disabled) handleTranslate();
  }
});

const FREE_WORD_LIMIT = 300;

async function handleTranslate() {
  const text = sourceTextEl.value.trim();
  if (!text) { showError("Please enter or upload text to translate."); return; }

  const src = sourceLangEl.value;
  const tgt = targetLangEl.value;
  if (src === tgt) {
    showError("Source and target languages are the same. Please select different languages.");
    return;
  }

  // Enforce 300-word limit for free (paste) mode
  if (!isFileUpload) {
    const wc = countWords(text);
    if (wc > FREE_WORD_LIMIT) {
      showError(`Free plan is limited to ${FREE_WORD_LIMIT} words. Your text has ${wc.toLocaleString()} words. Upload your document as a file (₹20) to translate the full text.`);
      return;
    }
  }

  if (isFileUpload) {
    // Require login for file uploads
    if (!window.auth?.currentUser) {
      window._pendingTranslate = true;
      openAuthModal('login');
      return;
    }
    if (getCredits() === 0) { openPayModal('single'); return; }
    // Reserve credit via Firestore transaction
    try {
      await reserveDocCredit();
    } catch (err) {
      if (err.code === 'lipi/no-credits') { openPayModal('single'); return; }
      showError("Could not reserve credit. Please try again.");
      return;
    }
  }

  hideError();
  hideOutput();
  setLoading(true);

  // Paid file uploads get full token budget; free paste gets a smaller cap
  const maxTokens = isFileUpload ? 32768 : GLOBAL_CONFIG.MAX_TOKENS;

  try {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    let url = GLOBAL_CONFIG.ENDPOINT;
    let headers = { "Content-Type": "application/json", "Authorization": `Bearer ${GLOBAL_CONFIG.API_KEY}` };
    if (!isLocal) { url = "/.netlify/functions/chat"; delete headers["Authorization"]; }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: [
          { role: "system", content: buildSystemPrompt(src, tgt) },
          { role: "user",   content: buildUserPrompt(text, src, tgt) }
        ],
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: maxTokens,
        temperature: GLOBAL_CONFIG.TEMPERATURE,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.choices?.[0]?.message?.content?.trim();
    if (!translated) throw new Error("Empty response from AI");

    showOutput(translated, src, tgt, isFileUpload);
    saveToHistory(text, translated, src, tgt);

  } catch (err) {
    if (isFileUpload) releaseDocCredit();
    if (err.message.includes("401") || err.message.includes("403")) {
      showError("API authentication error. Please check your API key configuration.");
    } else if (err.message.includes("429")) {
      showError("Rate limit reached. Please wait a moment and try again.");
    } else {
      showError("Translation failed. Please check your connection and try again. (" + err.message + ")");
    }
  } finally {
    setLoading(false);
    updateTranslateBtn();
    updateCreditsDisplay();
  }
}

// ── LANGUAGE-SPECIFIC PROMPTS ────────────────────────────────────────

const ASSAMESE_RULES = `
CRITICAL — YOU ARE TRANSLATING INTO ASSAMESE (অসমীয়া), NOT BENGALI (বাংলা).
These are two different languages. Follow every rule below strictly.

━━ SCRIPT RULES ━━
1. Use Assamese ৰ (U+09F0) — NEVER Bengali র (U+09B0).
   Correct: কৰা, হৰ, বৰ, পৰা, ধৰা, মৰা, তৰা, নৰম, ৰাজ্য, আৰু
   WRONG:   করা, হর, বর, পরা, ধরা, মরা, তরা, নরম, রাজ্য, এবং
2. Use Assamese ৱ (U+09F1) for 'w' sound — NEVER Bengali ব.

━━ VOCABULARY ━━
Assamese ✓ → Bengali ✗ (NEVER use)
কৰা/কৰিব → করা/করবে     |  হ'ব → হবে
আপুনি → আপনি             |  তেওঁ → তিনি
আমাৰ → আমাদের            |  চৰকাৰ → সরকার
কাৰ্যালয় → কার্যালয়     |  কাম → কাজ
তাৰিখ → তারিখ            |  পত্ৰ → পত্র
জাননী → বিজ্ঞপ্তি        |  জিলা → জেলা
ৰাজ্য → রাজ্য            |  অনুগ্ৰহ কৰি → অনুগ্রহ করে
সেয়েহে → সেজন্য          |  সকলো → সবাই
আৰু → এবং/আর             |  বিভাগ → বিভাগ (OK)

━━ GRAMMAR ━━
- Possessive suffix: ৰ (e.g., চৰকাৰৰ, আসামৰ) — NOT Bengali র/এর
- Verb endings: -ক, -ব, -লে, -হে — NOT Bengali -বে, -বো

━━ FORMAL REGISTER ━━
- "মহোদয়" for Sir/Madam
- "আদেশক্ৰমে" / "নিৰ্দেশক্ৰমে" for "as per order"
- Use Government of Assam standard terminology throughout
`;

const BODO_RULES = `
CRITICAL — YOU ARE TRANSLATING INTO BODO (बड़ो/बर'), a Scheduled Language of Assam.
Bodo uses the Devanagari script but is NOT Hindi. They are completely different languages.

━━ SCRIPT ━━
Use Devanagari script, but with Bodo vocabulary and grammar — NOT Hindi words.

━━ KEY BODO VOCABULARY ━━
Bodo ✓ → Hindi/English equivalent
आं → I/me (NOT मैं)
नि → you (singular, NOT तुम)
नुं → you (plural/formal, NOT आप)
मा / थि → he/she (NOT वह)
बिसोम → world/place
गोनां → for/because
थांनाय → going
रावनाय → staying/living
होनाय → saying/telling
सानाय → thinking
बायदि → like/similar
फिसाजों → from/since
दाव → right side
बावजों → left side
हादोर → sky/above
नोगोर → town/city
गांव → village (same as Hindi but Bodo context)
सरकार → government (same script, Bodo context)
बिथांखि → department/office
सिरि → letter/document
जिला → district (same)

━━ GRAMMAR ━━
- Bodo follows Subject-Object-Verb (SOV) order
- Do NOT use Hindi verb conjugations — use Bodo verb forms
- Bodo has its own postpositions — do not substitute Hindi prepositions
- Bodo tonal patterns differ from Hindi — preserve natural Bodo rhythm

━━ REGISTER ━━
- For official documents, use the formal Bodo register used in Government of Assam Bodo-medium offices
- Bodo has official use in Bodoland Territorial Council (BTC) areas
`;

const TONE_INSTRUCTIONS = {
  official: `Use a formal, official, bureaucratic tone as used in Government of Assam documents. Use proper honorifics, passive constructions where appropriate, and standard official phrasing.`,
  simple:   `Use simple, plain, everyday language that an ordinary person without formal education can understand. Write short sentences. Avoid jargon, technical terms, and complex vocabulary. Make every sentence clear and direct.`,
  academic: `Use an academic, scholarly tone suitable for university documents, research papers, educational institutions, and formal academic correspondence.`,
};

function buildSystemPrompt(src, tgt) {
  const isAssamese = src === "Assamese" || tgt === "Assamese";
  const isBodo     = src === "Bodo"     || tgt === "Bodo";
  const toneInstr  = TONE_INSTRUCTIONS[currentTone];

  let prompt = `You are LipiAntar, a professional document translator for Assamese, Bodo, Hindi, and English — specializing in Indian government, legal, and official documents in Assam and Northeast India.

Your task:
- Translate accurately with the correct register and tone.
- TONE: ${toneInstr}
- Preserve all formatting: paragraph breaks, numbered lists, bullet points, headings.
- For Hindi: use proper देवनागरी script, sarkari register.
- For English: use formal British/Indian-government English.

Provide ONLY the translated text. No explanations, no notes, no preamble. Just the clean translation.`;

  if (isAssamese) prompt += "\n" + ASSAMESE_RULES;
  if (isBodo)     prompt += "\n" + BODO_RULES;

  // Feature 6: inject glossary
  const glossary = getGlossary();
  if (glossary.length > 0) {
    prompt += `\n\n━━ CUSTOM GLOSSARY (MANDATORY) ━━\nThe following term mappings MUST be respected exactly — do not deviate:\n`;
    glossary.forEach(({ src: s, tgt: t }) => {
      prompt += `  "${s}" → "${t}"\n`;
    });
    prompt += `If any of the above source terms appear in the text, always use the specified target term. No exceptions.`;
  }

  return prompt;
}

function buildUserPrompt(text, src, tgt) {
  let reminder = "";
  if (tgt === "Assamese") {
    reminder = `\n\n[REMINDER: Pure Assamese অসমীয়া output only — use ৰ not র, আৰু not এবং, কৰা not করা. Zero Bengali characters or words.]`;
  } else if (tgt === "Bodo") {
    reminder = `\n\n[REMINDER: Pure Bodo बड़ो output only — use Bodo vocabulary, NOT Hindi. Devanagari script, but Bodo words and grammar.]`;
  }
  return `Translate the following ${src} document to ${tgt} (Tone: ${currentTone}):${reminder}\n\n${text}`;
}

// ── UI HELPERS ───────────────────────────────────────────────────────
function setLoading(on) {
  translateBtn.disabled = on;
  btnText.hidden = on;
  btnLoader.hidden = !on;
}

function showOutput(text, src, tgt, isPaidFile) {
  outputTextEl.textContent = text;

  // Feature 5: populate source panel for side-by-side
  const sourcePanelText = document.getElementById('sourcePanelText');
  if (sourcePanelText) sourcePanelText.textContent = sourceTextEl.value.trim();

  const words = countWords(sourceTextEl.value);
  const toneLabel = currentTone.charAt(0).toUpperCase() + currentTone.slice(1);
  outputMetaEl.textContent =
    `${src} → ${tgt}  ·  ${words} words  ·  ${countWords(text)} words translated  ·  ${toneLabel} tone` +
    (isPaidFile ? '  ·  File translation' : '  ·  Free paste mode');

  // Feature 7: show both download buttons only for paid file
  downloadBtn.style.display     = isPaidFile ? 'inline-flex' : 'none';
  downloadDocxBtn.style.display = isPaidFile ? 'inline-flex' : 'none';

  // Bengali script check for Assamese output
  if (tgt === "Assamese") {
    checkBengaliScript(text);
  } else {
    if (scriptWarning) scriptWarning.style.display = 'none';
  }

  outputArea.hidden = false;
  outputArea.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideOutput() {
  outputArea.hidden = true;
  outputTextEl.textContent = "";
  const sp = document.getElementById('sourcePanelText');
  if (sp) sp.textContent = '';
  if (scriptWarning) scriptWarning.style.display = 'none';
  const rf = document.getElementById('reportForm');
  if (rf) rf.style.display = 'none';
}

function showError(msg) { errorMsg.textContent = msg; errorArea.hidden = false; }
function hideError()    { errorArea.hidden = true; }

// ── BENGALI SCRIPT VALIDATOR ─────────────────────────────────────────
const BENGALI_RA  = '\u09B0'; // র — should NOT appear in Assamese
const ASSAMESE_RA = '\u09F0'; // ৰ — correct Assamese character

const BENGALI_PATTERNS = [
  { pattern: /করা/g,  label: 'করা (should be কৰা)' },
  { pattern: /করব/g,  label: 'করব (should be কৰিব)' },
  { pattern: /এবং/g,  label: 'এবং (should be আৰু)' },
  { pattern: /আপনি/g, label: 'আপনি (should be আপুনি)' },
  { pattern: /সরকার/g,label: 'সরকার (should be চৰকাৰ)' },
];

function checkBengaliScript(text) {
  if (!scriptWarning) return;
  const bengaliRaCount = (text.match(new RegExp(BENGALI_RA, 'g')) || []).length;
  const mixedWords = BENGALI_PATTERNS.filter(p => p.pattern.test(text));
  BENGALI_PATTERNS.forEach(p => p.pattern.lastIndex = 0);

  if (bengaliRaCount === 0 && mixedWords.length === 0) {
    scriptWarning.style.display = 'none';
    return;
  }
  let msg = '';
  if (bengaliRaCount > 0) {
    msg += `Bengali 'র' found ${bengaliRaCount} time${bengaliRaCount > 1 ? 's' : ''} — should be Assamese 'ৰ'. `;
  }
  if (mixedWords.length > 0) {
    msg += `Mixed words detected: ${mixedWords.map(p => p.label).join(', ')}.`;
  }
  scriptWarnMsg.textContent = msg;
  scriptWarning.style.display = 'flex';
}

function autoFixScript() {
  let text = outputTextEl.textContent;
  text = text.split(BENGALI_RA).join(ASSAMESE_RA);
  text = text.replace(/করা/g,  'কৰা')
             .replace(/করব/g,  'কৰিব')
             .replace(/করে/g,  'কৰে')
             .replace(/এবং/g,  'আৰু')
             .replace(/আপনি/g, 'আপুনি')
             .replace(/সরকার/g,'চৰকাৰ');
  outputTextEl.textContent = text;
  const sp = document.getElementById('sourcePanelText');
  if (sp && isSideBySide) {} // source panel stays unchanged
  checkBengaliScript(text);
  const btn = document.getElementById('autofixBtn');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ Fixed!';
    btn.style.background = 'rgba(52,211,153,0.25)';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
  }
}

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

// ── DOWNLOAD .TXT ────────────────────────────────────────────────────
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
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── FEATURE 7: DOWNLOAD .DOCX ────────────────────────────────────────
downloadDocxBtn.addEventListener("click", async () => {
  const translatedText = outputTextEl.textContent;
  if (!translatedText) return;

  const src  = sourceLangEl.value;
  const tgt  = targetLangEl.value;
  const date = new Date().toISOString().slice(0, 10);
  const sourceText = sourceTextEl.value.trim();

  try {
    // Load docx library from CDN
    if (!window.docx) {
      await loadScript("https://unpkg.com/docx@8.5.0/build/index.umd.js");
    }
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;

    const titleStyle = { bold: true, size: 28, font: "Noto Serif" };
    const metaStyle  = { italics: true, size: 18, color: "888888", font: "Noto Serif" };
    const bodyStyle  = { size: 22, font: "Noto Serif" };

    // Split translated text into paragraphs
    const translatedParas = translatedText.split(/\n+/).filter(l => l.trim());
    const sourceParas     = sourceText.split(/\n+/).filter(l => l.trim());

    const doc = new Document({
      creator: "LipiAntar",
      title: `LipiAntar Translation — ${src} to ${tgt}`,
      description: `Translated on ${date}`,
      sections: [{
        children: [
          // Header
          new Paragraph({
            children: [new TextRun({ text: "LipiAntar — Official Translation", ...titleStyle })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `${src} → ${tgt}  ·  ${date}  ·  ${currentTone} tone`, ...metaStyle })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Translation heading
          new Paragraph({
            children: [new TextRun({ text: `Translated Text (${tgt})`, bold: true, size: 24, font: "Noto Serif" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 160 },
          }),
          // Translated paragraphs
          ...translatedParas.map(line => new Paragraph({
            children: [new TextRun({ text: line, ...bodyStyle })],
            spacing: { after: 120 },
          })),

          // Divider + Source heading
          new Paragraph({ children: [new TextRun({ text: "─".repeat(40), color: "CCCCCC", font: "Noto Serif" })], spacing: { before: 400, after: 200 } }),
          new Paragraph({
            children: [new TextRun({ text: `Source Text (${src})`, bold: true, size: 24, font: "Noto Serif", color: "888888" })],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 160 },
          }),
          // Source paragraphs
          ...sourceParas.map(line => new Paragraph({
            children: [new TextRun({ text: line, size: 22, font: "Noto Serif", color: "666666" })],
            spacing: { after: 120 },
          })),

          // Footer
          new Paragraph({
            children: [new TextRun({ text: `Translated by LipiAntar · smartdigital.in · ${date}`, size: 16, color: "AAAAAA", italics: true, font: "Noto Serif" })],
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `LipiAntar_${src}_to_${tgt}_${date}.docx`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Flash button
    const orig = downloadDocxBtn.textContent;
    downloadDocxBtn.textContent = "✓ Downloaded!";
    setTimeout(() => { downloadDocxBtn.textContent = orig; }, 2500);

  } catch (err) {
    showError("Could not generate .docx file. Please try downloading as .txt instead.");
  }
});

// ── FEATURE 5: SIDE-BY-SIDE VIEW ─────────────────────────────────────
function toggleSideBySide() {
  isSideBySide = !isSideBySide;
  outputArea.classList.toggle('side-by-side', isSideBySide);
  const btn = document.getElementById('viewToggleBtn');
  if (btn) btn.classList.toggle('active', isSideBySide);
}

// ── FEATURE 6: GLOSSARY / CUSTOM DICTIONARY ──────────────────────────
const GLOSSARY_KEY = 'lipi_glossary';

function getGlossary() {
  try { return JSON.parse(localStorage.getItem(GLOSSARY_KEY) || '[]'); }
  catch { return []; }
}

function saveGlossary(list) {
  localStorage.setItem(GLOSSARY_KEY, JSON.stringify(list));
}

function addGlossaryTerm() {
  const srcInput = document.getElementById('glossarySource');
  const tgtInput = document.getElementById('glossaryTarget');
  const s = srcInput.value.trim();
  const t = tgtInput.value.trim();
  if (!s || !t) return;

  const list = getGlossary();
  // Prevent duplicates
  if (list.some(e => e.src.toLowerCase() === s.toLowerCase())) {
    srcInput.style.borderColor = 'var(--saffron)';
    setTimeout(() => { srcInput.style.borderColor = ''; }, 1500);
    return;
  }
  list.push({ src: s, tgt: t });
  saveGlossary(list);
  srcInput.value = '';
  tgtInput.value = '';
  renderGlossary();
  updateGlossaryCount();
}

function deleteGlossaryTerm(index) {
  const list = getGlossary();
  list.splice(index, 1);
  saveGlossary(list);
  renderGlossary();
  updateGlossaryCount();
}

function renderGlossary() {
  const listEl = document.getElementById('glossaryList');
  if (!listEl) return;
  const list = getGlossary();
  if (list.length === 0) {
    listEl.innerHTML = '<p class="glossary-empty">No terms added yet.</p>';
    return;
  }
  listEl.innerHTML = list.map((entry, i) => `
    <div class="glossary-item">
      <span class="gi-src">${escHtml(entry.src)}</span>
      <span class="gi-arrow">→</span>
      <span class="gi-tgt">${escHtml(entry.tgt)}</span>
      <button class="gi-del" onclick="deleteGlossaryTerm(${i})" title="Remove">✕</button>
    </div>
  `).join('');
}

function updateGlossaryCount() {
  const countEl = document.getElementById('glossaryCount');
  if (!countEl) return;
  const n = getGlossary().length;
  countEl.textContent = n > 0 ? `${n} term${n !== 1 ? 's' : ''}` : '';
}

function toggleGlossary() {
  const body    = document.getElementById('glossaryBody');
  const chevron = document.getElementById('glossaryChevron');
  if (!body) return;
  const open = body.style.display === 'none' || body.style.display === '';
  body.style.display  = open ? 'block' : 'none';
  if (chevron) chevron.textContent = open ? '▴' : '▾';
}

// Allow Enter key in glossary inputs to add term
document.getElementById('glossaryTarget')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addGlossaryTerm();
});

// ── FEATURE 8: REPORT WRONG TRANSLATION ──────────────────────────────
const REPORTS_KEY = 'lipi_reports';

function toggleReportForm() {
  const form = document.getElementById('reportForm');
  if (!form) return;
  const isHidden = form.style.display === 'none' || form.style.display === '';
  form.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    document.getElementById('reportType').value = '';
    document.getElementById('reportNote').value = '';
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function submitReport() {
  const type = document.getElementById('reportType').value;
  const note = document.getElementById('reportNote').value.trim();
  if (!type) {
    document.getElementById('reportType').style.outline = '2px solid var(--saffron)';
    setTimeout(() => { document.getElementById('reportType').style.outline = ''; }, 1500);
    return;
  }

  const report = {
    id:         Date.now(),
    date:       new Date().toISOString(),
    src:        sourceLangEl.value,
    tgt:        targetLangEl.value,
    tone:       currentTone,
    type,
    note,
    sourceText: sourceTextEl.value.trim().slice(0, 500),
    outputText: outputTextEl.textContent.trim().slice(0, 500),
  };

  // Save to localStorage
  try {
    const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
    reports.unshift(report);
    if (reports.length > 50) reports.pop();
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (e) { /* ignore storage errors */ }

  // Show thank-you state
  const form = document.getElementById('reportForm');
  form.innerHTML = `
    <div class="rf-thankyou">
      <span class="rf-ty-icon">✓</span>
      <span>Thank you! Your feedback helps improve LipiAntar.</span>
    </div>
  `;
  setTimeout(() => {
    form.style.display = 'none';
    form.innerHTML = `
      <div class="rf-title">⚑ Report Translation Issue</div>
      <select class="rf-select" id="reportType">
        <option value="">Select issue type…</option>
        <option value="wrong_word">Wrong word / term used</option>
        <option value="bengali_script">Bengali script in Assamese output</option>
        <option value="wrong_tone">Wrong tone / register</option>
        <option value="missing_text">Text missing or skipped</option>
        <option value="glossary_ignored">Glossary term not respected</option>
        <option value="other">Other</option>
      </select>
      <textarea class="rf-note" id="reportNote" placeholder="Optional: describe the issue or paste the correct translation…" rows="3"></textarea>
      <div class="rf-actions">
        <button class="rf-submit-btn" onclick="submitReport()">Send Report</button>
        <button class="rf-cancel-btn" onclick="toggleReportForm()">Cancel</button>
      </div>
    `;
  }, 3000);
}

// ── TRANSLATION HISTORY ──────────────────────────────────────────────
const HISTORY_KEY = 'lipi_history';
const HISTORY_MAX = 10;

function saveToHistory(sourceText, translatedText, src, tgt) {
  const history = getHistory();
  const entry = {
    id:         Date.now(),
    date:       new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    time:       new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    src, tgt,
    tone:       currentTone,
    words:      countWords(sourceText),
    srcPreview: sourceText.trim().slice(0, 100) + (sourceText.length > 100 ? '…' : ''),
    tgtPreview: translatedText.trim().slice(0, 100) + (translatedText.length > 100 ? '…' : ''),
    srcFull:    sourceText.trim(),
    tgtFull:    translatedText.trim(),
  };
  history.unshift(entry);
  if (history.length > HISTORY_MAX) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
  // Also save to Firestore if logged in
  if (typeof saveTranslationHistory === 'function') {
    saveTranslationHistory({ src, tgt, tone: currentTone, mode: isFileUpload ? 'paid' : 'free', words: entry.words });
  }
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function restoreFromHistory(id) {
  const entry = getHistory().find(e => e.id === id);
  if (!entry) return;
  sourceTextEl.value = entry.srcFull;
  sourceLangEl.value = entry.src;
  targetLangEl.value = entry.tgt;
  selectTone(entry.tone || 'official');
  isFileUpload = false;
  if (fileModeBar) fileModeBar.style.display = 'none';
  updateWordCount();
  updateTranslateBtn();
  showOutput(entry.tgtFull, entry.src, entry.tgt, false);
  document.getElementById('translate').scrollIntoView({ behavior: 'smooth' });
}

function renderHistory() {
  const history = getHistory();
  const section = document.getElementById('historySection');
  const list    = document.getElementById('historyList');
  if (!section || !list) return;

  if (history.length === 0) { section.style.display = 'none'; return; }

  section.style.display = 'block';
  list.innerHTML = history.map(entry => `
    <div class="history-item" onclick="restoreFromHistory(${entry.id})">
      <div class="hi-meta">
        <span class="hi-langs">${entry.src} → ${entry.tgt}</span>
        <span class="hi-tone">${entry.tone}</span>
        <span class="hi-date">${entry.date} · ${entry.time}</span>
        <span class="hi-words">${entry.words} words</span>
      </div>
      <div class="hi-preview src">${escHtml(entry.srcPreview)}</div>
      <div class="hi-preview tgt">${escHtml(entry.tgtPreview)}</div>
    </div>
  `).join('');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── PAYMENT MODAL ────────────────────────────────────────────────────
function openPayModal(planKey) {
  pendingPlan = planKey;
  const plan  = PAYMENT_PLANS[planKey];
  const gst   = Math.round(plan.base * 0.18);
  const total = plan.base + gst;

  document.getElementById('pay-title').textContent       = plan.label;
  document.getElementById('pay-bk-base').textContent     = `₹${plan.base}`;
  document.getElementById('pay-bk-gst').textContent      = `₹${gst}`;
  document.getElementById('pay-bk-total').textContent    = `₹${total}`;
  document.getElementById('pay-confirm-btn').textContent = `Pay ₹${total} →`;

  document.getElementById('pay-step-confirm').classList.add('active');
  document.getElementById('pay-step-proc').classList.remove('active');
  document.getElementById('pay-step-success').classList.remove('active');
  selectPayMethod('upi');
  document.getElementById('payModal').style.display = 'flex';
}

function closePayModal() {
  document.getElementById('payModal').style.display = 'none';
  pendingPlan = null;
}

function selectPayMethod(method) {
  payMethod = method;
  ['upi', 'card', 'net'].forEach(m => {
    document.getElementById(`pm-${m}`)?.classList.toggle('selected', m === method);
    const chk = document.getElementById(`chk-${m}`);
    if (chk) chk.textContent = m === method ? '✓' : '';
  });
}

function confirmPayment() {
  document.getElementById('pay-step-confirm').classList.remove('active');
  document.getElementById('pay-step-proc').classList.add('active');

  setTimeout(async () => {
    const plan = PAYMENT_PLANS[pendingPlan];

    // If user is logged in, apply credits via Firestore
    if (window.auth?.currentUser && typeof applyPlanToUser === 'function') {
      try {
        await applyPlanToUser({
          planId: pendingPlan,
          label:  plan.label,
          docs:   plan.credits
        });
      } catch (err) {
        console.error("applyPlanToUser error:", err);
      }
    }

    document.getElementById('pay-step-proc').classList.remove('active');
    document.getElementById('pay-step-success').classList.add('active');
    const c = getCredits();
    document.getElementById('pay-success-msg').textContent =
      `${plan.credits} file credit${plan.credits > 1 ? 's' : ''} added. You now have ${c} credit${c !== 1 ? 's' : ''}.`;
  }, 2200);
}

function onPaymentSuccess() {
  closePayModal();
  updateTranslateBtn();
  updateCreditsDisplay();
  if (sourceTextEl.value.trim()) handleTranslate();
}

document.getElementById('payModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('payModal')) closePayModal();
});

// ── INIT ─────────────────────────────────────────────────────────────
updateWordCount();
updateCreditsDisplay();
updateTranslateBtn();
renderHistory();
renderGlossary();
updateGlossaryCount();

// ── USER DROPDOWN TOGGLE ─────────────────────────────────────────────
function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const panel = document.getElementById('userPanel');
  const dropdown = document.getElementById('userDropdown');
  if (dropdown && panel && !panel.contains(e.target)) {
    dropdown.classList.remove('open');
  }
});
