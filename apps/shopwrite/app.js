/* ============================================================
   ShopWrite AI — app.js
   ============================================================ */

// ---- CATEGORIES ----
const CATEGORIES = [
  { id: 'grocery',    icon: '🛒', en: 'Grocery',     hi: 'किराना',     as: 'মুদিখানা' },
  { id: 'medical',    icon: '💊', en: 'Medical',     hi: 'दवाई',       as: 'চিকিৎসা' },
  { id: 'clothing',   icon: '👗', en: 'Clothing',    hi: 'कपड़े',      as: 'পোছাক' },
  { id: 'electronics',icon: '📱', en: 'Electronics', hi: 'इलेक्ट्रॉनिक',as: 'ইলেক্ট্ৰনিক' },
  { id: 'beauty',     icon: '💄', en: 'Beauty',      hi: 'सौंदर्य',    as: 'সৌন্দৰ্য' },
  { id: 'furniture',  icon: '🪑', en: 'Furniture',   hi: 'फर्नीचर',    as: 'আচবাব' },
  { id: 'food',       icon: '🍱', en: 'Food & Snacks',hi: 'खाना',      as: 'খাদ্য' },
  { id: 'stationery', icon: '📚', en: 'Stationery',  hi: 'स्टेशनरी',   as: 'ষ্টেচনাৰী' },
  { id: 'sports',     icon: '⚽', en: 'Sports',      hi: 'खेल',        as: 'ক্ৰীড়া' },
  { id: 'jewellery',  icon: '💍', en: 'Jewellery',   hi: 'गहने',       as: 'গহনা' },
  { id: 'toys',       icon: '🧸', en: 'Toys',        hi: 'खिलौने',     as: 'খেলনা' },
  { id: 'other',      icon: '📦', en: 'Other',       hi: 'अन्य',       as: 'অন্যান্য' },
];

let selectedCategory = '';
let currentLang = 'en';
let currentResult = null;
let activeTab = 0;

// ---- TRANSLATIONS ----
const T = {
  en: {
    loading: 'Crafting your product copy…',
    genBtn: '✦ Generate Descriptions',
    fillRequired: 'Please fill in the Product Name and select a Category.',
    apiMissing: 'Please set your Groq API key in ⚙ Settings first.',
    errorMsg: 'Something went wrong. Please check your API key and try again.',
    variantLabel: ['Variant 1 — Detailed', 'Variant 2 — Concise', 'Variant 3 — Creative'],
    chars: 'chars',
    copy: 'Copy',
    copied: '✓ Copied!',
    seoTitle: 'SEO Keywords',
    hashTitle: 'Hashtags',
    copyAllHash: 'Copy All Hashtags',
  },
  hi: {
    loading: 'आपका उत्पाद विवरण तैयार हो रहा है…',
    genBtn: '✦ विवरण बनाएं',
    fillRequired: 'कृपया उत्पाद नाम भरें और श्रेणी चुनें।',
    apiMissing: 'कृपया पहले Settings में API Key सेट करें।',
    errorMsg: 'कुछ गलत हुआ। अपनी API Key जांचें और पुनः प्रयास करें।',
    variantLabel: ['संस्करण 1 — विस्तृत', 'संस्करण 2 — संक्षिप्त', 'संस्करण 3 — रचनात्मक'],
    chars: 'अक्षर',
    copy: 'कॉपी',
    copied: '✓ कॉपी हो गया!',
    seoTitle: 'SEO कीवर्ड',
    hashTitle: 'हैशटैग',
    copyAllHash: 'सभी हैशटैग कॉपी करें',
  },
  as: {
    loading: 'আপোনাৰ পণ্যৰ বিৱৰণ তৈয়াৰ হৈ আছে…',
    genBtn: '✦ বিৱৰণ তৈয়াৰ কৰক',
    fillRequired: 'অনুগ্ৰহ কৰি পণ্যৰ নাম পূৰণ কৰক আৰু শ্ৰেণী বাছক।',
    apiMissing: 'অনুগ্ৰহ কৰি প্ৰথমে Settings-ত API Key ছেট কৰক।',
    errorMsg: 'কিবা সমস্যা হৈছে। আপোনাৰ API Key পৰীক্ষা কৰক।',
    variantLabel: ['ভেৰিয়েণ্ট ১ — বিশদ', 'ভেৰিয়েণ্ট ২ — সংক্ষিপ্ত', 'ভেৰিয়েণ্ট ৩ — সৃজনশীল'],
    chars: 'আখৰ',
    copy: 'কপি',
    copied: '✓ কপি হৈছে!',
    seoTitle: 'SEO কীৱাৰ্ড',
    hashTitle: 'হেচটেগ',
    copyAllHash: 'সকলো হেচটেগ কপি কৰক',
  }
};

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  buildCategoryGrid();
  setLang('en');
  renderHistory();
});

// ---- LANGUAGE ----
function setLang(lang) {
  currentLang = lang;
  ['en','hi','as'].forEach(l => {
    document.getElementById('lbtn-' + l)?.classList.toggle('active', l === lang);
  });
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
    if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') el.textContent = txt;
  });
  // Update category grid labels
  document.querySelectorAll('.cat-chip').forEach(chip => {
    const id = chip.dataset.id;
    const cat = CATEGORIES.find(c => c.id === id);
    if (cat) chip.querySelector('.cat-label').textContent = cat[lang] || cat.en;
  });
}

// ---- CATEGORIES ----
function buildCategoryGrid() {
  const grid = document.getElementById('catGrid');
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="cat-chip ${selectedCategory === cat.id ? 'active' : ''}" 
         data-id="${cat.id}" onclick="selectCategory('${cat.id}', this)">
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-label">${cat.en}</span>
    </div>
  `).join('');
}

function selectCategory(id, el) {
  selectedCategory = id;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ---- API KEY ----
function openSettings() {
  document.getElementById('settingsModal').classList.remove('hidden');
  document.getElementById('apiKeyInput').value = localStorage.getItem('sw_api_key') || '';
}
function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}
function saveKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (val) localStorage.setItem('sw_api_key', val);
  closeSettings();
}
function toggleKeyVis() {
  const el = document.getElementById('apiKeyInput');
  el.type = el.type === 'password' ? 'text' : 'password';
}
document.getElementById('settingsModal').addEventListener('click', e => {
  if (e.target === document.getElementById('settingsModal')) closeSettings();
});

// ---- INLINE MESSAGES ----
function showValidation(msg) {
  document.getElementById('validationMsg').textContent = msg;
  document.getElementById('validationWarn').classList.remove('hidden');
  document.getElementById('errorWarn').classList.add('hidden');
}
function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  document.getElementById('errorWarn').classList.remove('hidden');
  document.getElementById('validationWarn').classList.add('hidden');
}
function clearMessages() {
  document.getElementById('validationWarn').classList.add('hidden');
  document.getElementById('errorWarn').classList.add('hidden');
}

// ---- GENERATE ----
async function generateDescriptions() {
  const apiKey = GLOBAL_CONFIG.API_KEY;

  const productName = document.getElementById('productName').value.trim();
  const features    = document.getElementById('features').value.trim();
  const price       = document.getElementById('price').value.trim();
  const audience    = document.getElementById('audience').value;
  const tone        = document.querySelector('input[name="tone"]:checked')?.value || 'professional';
  const outLang     = document.querySelector('input[name="outlang"]:checked')?.value || 'English';
  const catObj      = CATEGORIES.find(c => c.id === selectedCategory);

  if (!productName || !selectedCategory) {
    showValidation(T[currentLang].fillRequired); return;
  }

  clearMessages();
  // Show loading
  document.getElementById('outPlaceholder').classList.add('hidden');
  document.getElementById('outResults').classList.add('hidden');
  document.getElementById('outLoading').classList.remove('hidden');
  document.getElementById('loadMsg').textContent = T[currentLang].loading;
  document.getElementById('generateBtn').disabled = true;

  const prompt = `You are an expert Indian e-commerce copywriter helping local shop owners write product descriptions for their websites.

Product Information:
- Product Name: ${productName}
- Category: ${catObj ? catObj.en : selectedCategory}
- Key Features / USPs: ${features || 'Not provided'}
- Price: ${price ? '₹' + price : 'Not specified'}
- Target Audience: ${audience}
- Tone: ${tone}
- Output Language: ${outLang}

Generate 3 DIFFERENT website product page description variants for this product. Each variant should feel distinct:
1. Variant 1 — Detailed & comprehensive (full product page description)
2. Variant 2 — Concise & punchy (shorter, scannable)
3. Variant 3 — Creative & story-driven (emotional connection)

Also generate:
- 8–10 SEO keywords (short phrases people search for)
- 10–12 relevant hashtags (include mix of English and local language if applicable)

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "variants": [
    {
      "label": "Detailed",
      "productName": "exact product name",
      "tagline": "catchy one-liner tagline",
      "description": "2-3 paragraph description",
      "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
      "callToAction": "Buy Now text",
      "metaDescription": "SEO meta description under 160 chars"
    },
    {
      "label": "Concise",
      "productName": "exact product name",
      "tagline": "catchy one-liner tagline",
      "description": "1 tight paragraph",
      "features": ["feature 1", "feature 2", "feature 3"],
      "callToAction": "Buy Now text",
      "metaDescription": "SEO meta description under 160 chars"
    },
    {
      "label": "Creative",
      "productName": "exact product name",
      "tagline": "creative emotional tagline",
      "description": "story-driven paragraph",
      "features": ["feature 1", "feature 2", "feature 3"],
      "callToAction": "Buy Now text",
      "metaDescription": "SEO meta description under 160 chars"
    }
  ],
  "seoKeywords": ["keyword 1", "keyword 2", "..."],
  "hashtags": ["#hashtag1", "#hashtag2", "..."]
}`;

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

    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
        temperature: GLOBAL_CONFIG.TEMPERATURE
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API Error ' + res.status);
    }

    const data = await res.json();
    const raw = data.choices && data.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error("Empty response from AI");

    let parsed;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(match ? match[0] : raw);
    } catch {
      throw new Error('Could not parse response. Please try again.');
    }

    currentResult = parsed;
    activeTab = 0;
    renderResults(parsed, price);
    saveToHistory(productName, catObj ? catObj.en : selectedCategory, parsed);

    document.getElementById('outLoading').classList.add('hidden');
    document.getElementById('outResults').classList.remove('hidden');

  } catch (err) {
    document.getElementById('outLoading').classList.add('hidden');
    document.getElementById('outPlaceholder').classList.remove('hidden');
    showError(err.message || T[currentLang].errorMsg);
  } finally {
    document.getElementById('generateBtn').disabled = false;
  }
}

// ---- RENDER ----
function renderResults(data, price) {
  const t = T[currentLang];

  // Build tabs
  const tabsEl = document.getElementById('resultTabs');
  tabsEl.innerHTML = data.variants.map((v, i) =>
    `<button class="tab-btn ${i === activeTab ? 'active' : ''}" onclick="switchTab(${i})">${t.variantLabel[i] || v.label}</button>`
  ).join('');

  // Render active tab
  renderVariant(data.variants[activeTab], price, activeTab);

  // SEO Keywords
  const seoEl = document.getElementById('seoTags');
  seoEl.innerHTML = (data.seoKeywords || []).map(kw =>
    `<span class="seo-tag" onclick="copyText('${kw.replace(/'/g, "\\'")}')">${kw}</span>`
  ).join('');

  // Hashtags
  const hashEl = document.getElementById('hashTags');
  hashEl.innerHTML = (data.hashtags || []).map(h =>
    `<span class="hash-tag" onclick="copyText('${h.replace(/'/g, "\\'")}')">${h}</span>`
  ).join('');
}

function switchTab(idx) {
  activeTab = idx;
  document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  renderVariant(currentResult.variants[idx], document.getElementById('price').value.trim(), idx);
}

function renderVariant(v, price, idx) {
  const t = T[currentLang];
  const bodyText = [
    v.tagline || '',
    v.description || '',
    (v.features || []).join(' · '),
    v.callToAction || '',
    v.metaDescription || ''
  ].join(' ');
  const charLen = bodyText.length;

  const fullCopyText = [
    v.productName,
    v.tagline,
    '',
    v.description,
    '',
    ...(v.features || []).map(f => '• ' + f),
    '',
    price ? `Price: ₹${price}` : '',
    v.callToAction ? `CTA: ${v.callToAction}` : '',
    '',
    `Meta Description: ${v.metaDescription || ''}`
  ].filter(l => l !== undefined).join('\n');

  const html = `
    <div class="variant-card">
      <div class="variant-header">
        <div class="variant-label">
          <span>${['📄','⚡','🎨'][idx] || '📝'}</span>
          ${t.variantLabel[idx] || v.label}
        </div>
        <div class="variant-actions">
          <span class="char-count">${charLen} ${t.chars}</span>
          <button class="copy-btn" id="copybtn-${idx}" onclick="copyVariant(${idx}, \`${escJs(fullCopyText)}\`)">
            📋 ${t.copy}
          </button>
        </div>
      </div>
      <div class="variant-body">
        <div class="desc-product-name">${esc(v.productName)}</div>
        <div class="desc-tagline">"${esc(v.tagline)}"</div>
        <div class="desc-body">${esc(v.description)}</div>
        <ul class="desc-features">
          ${(v.features || []).map(f => `<li>${esc(f)}</li>`).join('')}
        </ul>
        <div class="desc-price-row">
          ${price ? `<span class="desc-price">₹${esc(price)}</span>` : ''}
          <span class="desc-cta">${esc(v.callToAction || 'Buy Now')}</span>
          ${v.metaDescription ? `<span class="desc-meta">🔍 ${esc(v.metaDescription)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
  document.getElementById('tabContent').innerHTML = html;
}

// ---- COPY ----
function copyVariant(idx, text) {
  copyText(text);
  const btn = document.getElementById('copybtn-' + idx);
  if (btn) {
    const t = T[currentLang];
    btn.textContent = t.copied;
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 ' + t.copy; btn.classList.remove('copied'); }, 2000);
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

function copyAll(containerId) {
  const tags = document.querySelectorAll(`#${containerId} .hash-tag, #${containerId} .seo-tag`);
  const text = [...tags].map(t => t.textContent).join(' ');
  copyText(text);
}

// ---- HISTORY ----
const HISTORY_KEY = 'sw_history';
const HISTORY_MAX = 10;

function saveToHistory(productName, category, data) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    productName,
    category,
    timestamp: new Date().toLocaleString(),
    seoKeywords: data.seoKeywords || [],
    hashtags: data.hashtags || [],
    variants: data.variants || []
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_MAX)));
  renderHistory();
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  const section = document.getElementById('historySection');
  const grid = document.getElementById('historyGrid');
  if (!history.length) { section.style.display = 'none'; return; }
  section.style.display = '';
  grid.innerHTML = history.map(item => `
    <div class="history-card" onclick="restoreFromHistory(${item.id})">
      <div class="history-card-top">
        <span class="history-product">${esc(item.productName)}</span>
        <span class="history-cat">${esc(item.category)}</span>
      </div>
      <div class="history-meta">${esc(item.timestamp)} · ${item.variants.length} variants · ${item.seoKeywords.length} keywords</div>
    </div>
  `).join('');
}

function restoreFromHistory(id) {
  const item = getHistory().find(h => h.id === id);
  if (!item) return;
  currentResult = item;
  activeTab = 0;
  renderResults(item, '');
  document.getElementById('outPlaceholder').classList.add('hidden');
  document.getElementById('outLoading').classList.add('hidden');
  document.getElementById('outResults').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- ESCAPE HELPERS ----
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
function escJs(str) {
  return String(str || '')
    .replace(/\\/g,'\\\\')
    .replace(/`/g,'\\`')
    .replace(/\$/g,'\\$');
}
