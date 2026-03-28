// ===========================
//   BIZWRITE — app.js
// ===========================

// ====== i18n ======
const translations = {
  en: {
    hero_eyebrow: "AI-Powered · Instant · Professional",
    hero_title: "Write Your Business Profile<br/><em>in Seconds</em>",
    hero_sub: "Google Business · Facebook Bio · Product Descriptions — all generated at once.",
    form_title: "Tell us about your business",
    label_name: "Business Name",
    label_type: "Business Type",
    label_location: "Location",
    label_years: "Years in Business",
    label_usp: "Unique Selling Points (USPs)",
    label_products: "Products / Services Offered",
    label_tone: "Tone",
    label_lang_out: "Output Language",
    label_generate: "Generate:",
    btn_generate: "✨ Generate Descriptions",
    pricing_eyebrow: "Simple & Transparent",
    pricing_title: "Pricing Plans",
    pricing_sub: "Perfect add-on for your web design service.",
  },
  hi: {
    hero_eyebrow: "AI-संचालित · तत्काल · पेशेवर",
    hero_title: "अपना बिज़नेस प्रोफ़ाइल लिखें<br/><em>सेकंड में</em>",
    hero_sub: "Google Business · Facebook Bio · Product Descriptions — सब एक साथ।",
    form_title: "अपने बिज़नेस के बारे में बताएं",
    label_name: "व्यवसाय का नाम",
    label_type: "व्यवसाय का प्रकार",
    label_location: "स्थान",
    label_years: "व्यवसाय में वर्ष",
    label_usp: "अनूठी विशेषताएं (USPs)",
    label_products: "उत्पाद / सेवाएं",
    label_tone: "टोन",
    label_lang_out: "आउटपुट भाषा",
    label_generate: "जनरेट करें:",
    btn_generate: "✨ विवरण जनरेट करें",
    pricing_eyebrow: "सरल और पारदर्शी",
    pricing_title: "मूल्य योजनाएं",
    pricing_sub: "आपकी वेब डिज़ाइन सेवा के लिए परफेक्ट ऐड-ऑन।",
  },
  as: {
    hero_eyebrow: "AI-চালিত · তাৎক্ষণিক · পেছাদাৰী",
    hero_title: "আপোনাৰ ব্যৱসায়িক প্ৰফাইল লিখক<br/><em>ছেকেণ্ডতে</em>",
    hero_sub: "Google Business · Facebook Bio · Product Descriptions — একেলগে।",
    form_title: "আপোনাৰ ব্যৱসায়ৰ বিষয়ে কওক",
    label_name: "ব্যৱসায়ৰ নাম",
    label_type: "ব্যৱসায়ৰ ধৰণ",
    label_location: "স্থান",
    label_years: "ব্যৱসায়ত বছৰ",
    label_usp: "অনন্য বিশেষত্ব (USPs)",
    label_products: "সামগ্ৰী / সেৱাসমূহ",
    label_tone: "ভাব",
    label_lang_out: "আউটপুটৰ ভাষা",
    label_generate: "তৈয়াৰ কৰক:",
    btn_generate: "✨ বিৱৰণ তৈয়াৰ কৰক",
    pricing_eyebrow: "সহজ আৰু স্বচ্ছ",
    pricing_title: "মূল্য পৰিকল্পনা",
    pricing_sub: "আপোনাৰ ৱেব ডিজাইন সেৱাৰ বাবে আদৰ্শ।",
  }
};

let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.lang-btn[onclick="setLang('${lang}')"]`).classList.add('active');
  applyTranslations();
}

function applyTranslations() {
  const t = translations[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerHTML = t[key];
  });
}

// ====== PAGE NAVIGATION ======
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== AI GENERATION ======
async function generateDescriptions() {
  const name = document.getElementById('bizName').value.trim();
  const type = document.getElementById('bizType').value.trim();
  const location = document.getElementById('bizLocation').value.trim();
  const years = document.getElementById('bizYears').value.trim();
  const usp = document.getElementById('bizUSP').value.trim();
  const products = document.getElementById('bizProducts').value.trim();
  const tone = document.getElementById('bizTone').value;
  const outputLang = document.getElementById('outputLang').value;
  const doGoogle = document.getElementById('chkGoogle').checked;
  const doFacebook = document.getElementById('chkFacebook').checked;
  const doProduct = document.getElementById('chkProduct').checked;

  if (!name || !type || !location) {
    showToast('Please fill in Business Name, Type, and Location.');
    return;
  }
  if (!doGoogle && !doFacebook && !doProduct) {
    showToast('Please select at least one output type.');
    return;
  }

  // Show loading
  const btn = document.getElementById('generateBtn');
  btn.querySelector('.btn-label').classList.add('hidden');
  btn.querySelector('.btn-loading').classList.remove('hidden');
  btn.disabled = true;

  const businessInfo = `
Business Name: ${name}
Business Type: ${type}
Location: ${location}
${years ? `Years in Business: ${years}` : ''}
${usp ? `USPs: ${usp}` : ''}
${products ? `Products/Services: ${products}` : ''}
Tone: ${tone}
Output Language: ${outputLang}
  `.trim();

  const sections = [];
  if (doGoogle) sections.push('GOOGLE_BUSINESS');
  if (doFacebook) sections.push('FACEBOOK_BIO');
  if (doProduct) sections.push('PRODUCT_DESCRIPTIONS');

  const prompt = `You are a professional business copywriter specializing in local Indian businesses. 
Write compelling, authentic descriptions for the following business.
Output ONLY in ${outputLang} language.
Tone: ${tone}

Business Details:
${businessInfo}

Generate the following sections. Use EXACTLY these section headers (in English, as markers):
${sections.includes('GOOGLE_BUSINESS') ? `
=== GOOGLE_BUSINESS ===
Write a Google Business Profile description (150–250 words). Include: what the business does, location, years of experience, key services/products, USPs, and a call to action.
` : ''}
${sections.includes('FACEBOOK_BIO') ? `
=== FACEBOOK_BIO ===
Write a Facebook Page "About" bio (80–120 words). Make it friendly, warm, and engaging. Include a tagline, brief description, and a CTA.
` : ''}
${sections.includes('PRODUCT_DESCRIPTIONS') ? `
=== PRODUCT_DESCRIPTIONS ===
Write short product/service descriptions (2–4 sentences each) for the main products or services. Number each one. Make them enticing and highlight benefits.
` : ''}

Write only the content under each section header. Be authentic to the local Indian business context.`;

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
        messages: [{ role: "user", content: prompt }],
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
        temperature: GLOBAL_CONFIG.TEMPERATURE
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    const fullText = data.choices && data.choices[0]?.message?.content?.trim();
    if (!fullText) throw new Error("Empty response from AI");

    // Parse sections
    if (doGoogle) {
      const txt = extractSection(fullText, 'GOOGLE_BUSINESS');
      document.getElementById('googleText').textContent = txt || 'Could not generate. Please try again.';
      document.getElementById('googleCard').classList.remove('hidden');
    } else {
      document.getElementById('googleCard').classList.add('hidden');
    }

    if (doFacebook) {
      const txt = extractSection(fullText, 'FACEBOOK_BIO');
      document.getElementById('facebookText').textContent = txt || 'Could not generate. Please try again.';
      document.getElementById('facebookCard').classList.remove('hidden');
    } else {
      document.getElementById('facebookCard').classList.add('hidden');
    }

    if (doProduct) {
      const txt = extractSection(fullText, 'PRODUCT_DESCRIPTIONS');
      document.getElementById('productText').textContent = txt || 'Could not generate. Please try again.';
      document.getElementById('productCard').classList.remove('hidden');
    } else {
      document.getElementById('productCard').classList.add('hidden');
    }

    document.getElementById('outputSection').classList.remove('hidden');
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Store for invoice prefill
    window._lastBizName = name;
    window._lastBizType = type;

  } catch (err) {
    showToast('Error connecting to AI. Please check your connection.');
    console.error(err);
  } finally {
    btn.querySelector('.btn-label').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;
  }
}

function extractSection(text, marker) {
  const startTag = `=== ${marker} ===`;
  const start = text.indexOf(startTag);
  if (start === -1) return '';
  const after = text.indexOf('===', start + startTag.length);
  const end = after === -1 ? text.length : after;
  return text.slice(start + startTag.length, end).trim();
}

// ====== COPY ======
function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => showToast('Copied to clipboard!')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = el.textContent;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!');
  });
}

// ====== DOWNLOAD ======
function downloadAll() {
  const parts = [];
  const sections = [
    { id: 'googleText', label: 'GOOGLE BUSINESS PROFILE' },
    { id: 'facebookText', label: 'FACEBOOK BIO' },
    { id: 'productText', label: 'PRODUCT DESCRIPTIONS' }
  ];
  sections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el && !document.getElementById(s.id.replace('Text','Card')).classList.contains('hidden')) {
      parts.push(`=== ${s.label} ===\n\n${el.textContent}\n`);
    }
  });
  if (!parts.length) { showToast('Nothing to download.'); return; }

  const blob = new Blob([parts.join('\n\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(window._lastBizName || 'business')}_descriptions.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ====== INVOICE ======
let invoiceItems = [];

function initInvoice() {
  // Set today's date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inv_date').value = today;
  // Set random invoice number
  document.getElementById('inv_number').value = 'BW-' + String(Math.floor(Math.random() * 900) + 100);

  // Live preview sync
  ['inv_your_name','inv_your_contact','inv_client_name','inv_client_contact','inv_date','inv_number'].forEach(id => {
    document.getElementById(id).addEventListener('input', syncInvoicePreview);
  });

  if (invoiceItems.length === 0) addInvoiceItem('Business Description Writing', 499);
  renderInvoiceItems();
  syncInvoicePreview();
}

function addInvoiceItem(service = '', amount = '') {
  invoiceItems.push({ service, amount });
  renderInvoiceItems();
  syncInvoicePreview();
}

function renderInvoiceItems() {
  const container = document.getElementById('inv_items');
  container.innerHTML = '';
  invoiceItems.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'inv-item-row';
    row.innerHTML = `
      <input type="text" placeholder="Service description" value="${escHtml(item.service)}"
        oninput="invoiceItems[${i}].service=this.value;syncInvoicePreview()" />
      <input type="number" placeholder="₹" value="${item.amount}" style="width:90px"
        oninput="invoiceItems[${i}].amount=parseFloat(this.value)||0;syncInvoicePreview()" />
      <button class="remove-btn" onclick="removeItem(${i})">✕</button>
    `;
    container.appendChild(row);
  });
}

function removeItem(i) {
  invoiceItems.splice(i, 1);
  renderInvoiceItems();
  syncInvoicePreview();
}

function syncInvoicePreview() {
  setValue('prev_your_name', 'inv_your_name', 'Your Studio');
  setValue('prev_your_contact', 'inv_your_contact', '');
  setValue('prev_client_name', 'inv_client_name', 'Client Name');
  setValue('prev_client_contact', 'inv_client_contact', '');
  setValue('prev_number', 'inv_number', 'BW-001');
  setValue('prev_date', 'inv_date', '');

  // Items
  const tbody = document.getElementById('prev_items');
  tbody.innerHTML = '';
  let total = 0;
  invoiceItems.forEach(item => {
    const tr = document.createElement('tr');
    const amt = parseFloat(item.amount) || 0;
    total += amt;
    tr.innerHTML = `<td>${escHtml(item.service) || '—'}</td><td>₹${amt.toFixed(0)}</td>`;
    tbody.appendChild(tr);
  });
  document.getElementById('prev_total').textContent = '₹' + total.toFixed(0);
  document.getElementById('inv_total_display').textContent = '₹' + total.toFixed(0);
}

function setValue(previewId, inputId, fallback) {
  const val = document.getElementById(inputId)?.value || '';
  document.getElementById(previewId).textContent = val || fallback;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function prefillInvoice() {
  showPage('invoice');
  if (window._lastBizName) {
    setTimeout(() => {
      document.getElementById('inv_client_name').value = window._lastBizName;
      syncInvoicePreview();
    }, 100);
  }
}

function prefillInvoiceAmount(amount) {
  showPage('invoice');
  setTimeout(() => {
    if (invoiceItems.length > 0) {
      invoiceItems[0].amount = amount;
    } else {
      invoiceItems.push({ service: 'Business Description Writing', amount });
    }
    renderInvoiceItems();
    syncInvoicePreview();
  }, 100);
}

function printInvoice() {
  window.print();
}

// ====== TOAST ======
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2500);
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  initInvoice();
});
