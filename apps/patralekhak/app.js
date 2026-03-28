// ===========================
//   PATRALEKHAK — app.js
//   Complaint & Legal Letter Writer
// ===========================

// ====== STATE ======
let currentType = 'Bank Dispute';
let generatedLetter = '';
let generatedPlainText = '';
let savedLetters = JSON.parse(localStorage.getItem('patralekhak_letters') || '[]');
let currentUILang = 'en';

// ====== i18n ======
const i18n = {
  en: {
    hero_eyebrow: 'Professional · Formal · Ready to Send',
    hero_title: 'Your Voice.<br/><em>Their Language.</em>',
    hero_sub: "Describe your problem in simple words — we'll write a powerful formal letter for you.",
    step1: 'Choose Letter Type',
    step2: 'Your Details & Recipient',
    step3: 'Describe Your Problem',
    step4: 'Letter Options',
    type_bank: 'Bank Dispute',
    type_elec: 'Electricity / Water',
    type_telecom: 'Telecom',
    type_school: 'School / College',
    type_rti: 'RTI Application',
    type_legal: 'Legal Notice',
    type_govt: 'Govt Office',
    label_sender_name: 'Your Full Name',
    label_sender_addr: 'Your Address',
    label_sender_phone: 'Phone / Email',
    label_recipient: 'Addressed To',
    label_recipient_addr: 'Recipient Office / Address',
    label_ref: 'Reference No. (if any)',
    label_out_lang: 'Letter Language',
    label_tone: 'Tone',
    chk_deadline: 'Include 15-day response deadline',
    chk_cc: 'Add CC to higher authority',
    chk_rti: 'Mention RTI threat if ignored',
    btn_generate: '✍️ Generate Formal Letter',
    preview_title: 'Letter Preview',
    placeholder_text: 'Your formal letter will appear here after generation.',
    char_hint: 'More detail = better letter. Include dates, amounts, names where possible.',
  },
  hi: {
    hero_eyebrow: 'पेशेवर · औपचारिक · भेजने के लिए तैयार',
    hero_title: 'आपकी बात.<br/><em>उनकी भाषा में.</em>',
    hero_sub: 'अपनी समस्या सरल शब्दों में बताएं — हम आपके लिए एक शक्तिशाली औपचारिक पत्र लिखेंगे।',
    step1: 'पत्र का प्रकार चुनें',
    step2: 'आपकी जानकारी और प्राप्तकर्ता',
    step3: 'अपनी समस्या बताएं',
    step4: 'पत्र विकल्प',
    type_bank: 'बैंक विवाद',
    type_elec: 'बिजली / पानी',
    type_telecom: 'दूरसंचार',
    type_school: 'स्कूल / कॉलेज',
    type_rti: 'RTI आवेदन',
    type_legal: 'कानूनी नोटिस',
    type_govt: 'सरकारी कार्यालय',
    label_sender_name: 'आपका पूरा नाम',
    label_sender_addr: 'आपका पता',
    label_sender_phone: 'फोन / ईमेल',
    label_recipient: 'किसे भेजें',
    label_recipient_addr: 'प्राप्तकर्ता कार्यालय / पता',
    label_ref: 'संदर्भ संख्या (यदि हो)',
    label_out_lang: 'पत्र की भाषा',
    label_tone: 'भाव',
    chk_deadline: '15 दिन की प्रतिक्रिया समय सीमा शामिल करें',
    chk_cc: 'उच्च प्राधिकारी को CC जोड़ें',
    chk_rti: 'अनदेखी पर RTI का उल्लेख करें',
    btn_generate: '✍️ औपचारिक पत्र तैयार करें',
    preview_title: 'पत्र पूर्वावलोकन',
    placeholder_text: 'पत्र तैयार होने के बाद यहाँ दिखेगा।',
    char_hint: 'अधिक विवरण = बेहतर पत्र। तारीख, राशि, नाम जरूर लिखें।',
  },
  as: {
    hero_eyebrow: 'পেছাদাৰী · আনুষ্ঠানিক · পঠিয়াবলৈ সাজু',
    hero_title: 'আপোনাৰ কথা.<br/><em>তেওঁলোকৰ ভাষাত.</em>',
    hero_sub: 'আপোনাৰ সমস্যা সহজ ভাষাত কওক — আমি আপোনাৰ বাবে এখন শক্তিশালী আনুষ্ঠানিক পত্ৰ লিখিম।',
    step1: 'পত্ৰৰ ধৰণ বাছক',
    step2: 'আপোনাৰ বিৱৰণ আৰু প্ৰাপক',
    step3: 'আপোনাৰ সমস্যা বৰ্ণনা কৰক',
    step4: 'পত্ৰৰ বিকল্পসমূহ',
    type_bank: 'বেংক বিবাদ',
    type_elec: 'বিদ্যুৎ / পানী',
    type_telecom: 'টেলিকম',
    type_school: 'বিদ্যালয় / মহাবিদ্যালয়',
    type_rti: 'RTI আবেদন',
    type_legal: 'আইনী নোটিচ',
    type_govt: 'চৰকাৰী কাৰ্যালয়',
    label_sender_name: 'আপোনাৰ সম্পূৰ্ণ নাম',
    label_sender_addr: 'আপোনাৰ ঠিকনা',
    label_sender_phone: 'ফোন / ইমেইল',
    label_recipient: 'কাক পঠিয়াব',
    label_recipient_addr: 'প্ৰাপক কাৰ্যালয় / ঠিকনা',
    label_ref: 'প্ৰসংগ নম্বৰ (যদি থাকে)',
    label_out_lang: 'পত্ৰৰ ভাষা',
    label_tone: 'সুৰ',
    chk_deadline: '১৫ দিনৰ সাঁড়-দিন অন্তৰ্ভুক্ত কৰক',
    chk_cc: 'উচ্চ কৰ্তৃপক্ষলৈ CC যোগ কৰক',
    chk_rti: 'অগ্ৰাহ্য হলে RTI উল্লেখ কৰক',
    btn_generate: '✍️ আনুষ্ঠানিক পত্ৰ তৈয়াৰ কৰক',
    preview_title: 'পত্ৰ পূৰ্বদৰ্শন',
    placeholder_text: 'পত্ৰ তৈয়াৰ হোৱাৰ পিছত ইয়াত দেখা যাব।',
    char_hint: 'অধিক বিৱৰণ = ভাল পত্ৰ। তাৰিখ, পৰিমাণ, নাম উল্লেখ কৰক।',
  }
};

function setUILang(lang) {
  currentUILang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.lang-btn[onclick="setUILang('${lang}')"]`).classList.add('active');
  applyI18n();
}

function applyI18n() {
  const t = i18n[currentUILang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });
}

// ====== PAGE NAV ======
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  if (page === 'saved') renderSaved();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== TYPE SELECTION ======
function setType(btn) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentType = btn.dataset.type;
}

// ====== BUILD PROMPT ======
function buildPrompt(data) {
  const deadlineText = data.includeDeadline
    ? 'Include a clear statement that if no response is received within 15 days, further legal/regulatory action will be taken.'
    : '';
  const ccText = data.includeCC
    ? 'At the end, add a CC section mentioning the appropriate higher authority (e.g., RBI Ombudsman for banks, TRAI for telecom, Consumer Forum, District Collector, etc.).'
    : '';
  const rtiText = data.includeRTI
    ? 'Include a line that if this complaint is ignored, an RTI application will be filed under the RTI Act 2005 to seek information on the matter.'
    : '';

  const typeInstructions = {
    'Bank Dispute': 'Write a formal bank complaint letter. Reference RBI guidelines on customer grievance redressal. Mention that the complainant may approach the Banking Ombudsman if unresolved.',
    'Electricity / Water Complaint': 'Write a formal complaint to the electricity/water authority. Reference relevant state electricity/water regulatory provisions. Mention possible escalation to the State Electricity Regulatory Commission (SERC) or State Consumer Disputes Redressal Forum.',
    'Telecom Complaint': 'Write a formal telecom complaint. Reference TRAI regulations. Mention that the complainant may escalate to TRAI or the Telecom Ombudsman (CGPDTM) if unresolved within the stipulated time.',
    'School / College Grievance': 'Write a formal grievance letter to school/college management or education authority. Maintain a respectful but firm tone. Reference relevant education board guidelines if applicable.',
    'RTI Application': 'Write a formal RTI (Right to Information) application under Section 6 of the RTI Act, 2005. Address it to the Public Information Officer (PIO). State the specific information requested clearly and precisely. Mention payment of applicable RTI fee.',
    'Legal Notice': 'Write a formal legal notice. Use strict legal language. Clearly state the grievance, the legal basis, the relief demanded, and a time limit for compliance. Mention that failure to comply will result in legal proceedings.',
    'Government Office Complaint': 'Write a formal complaint to a government office. Reference relevant government circulars/policies if applicable. Maintain a formal tone and clearly state the relief sought.',
  };

  return `You are an expert Indian legal and government correspondence writer. Write a formal ${data.type} letter in ${data.outputLang}.

LETTER DETAILS:
- Type: ${data.type}
- Sender: ${data.senderName}
- Sender Address: ${data.senderAddr}
- Sender Contact: ${data.senderContact}
- Addressed To: ${data.recipientName}
- Recipient Address: ${data.recipientAddr}
${data.refNumber ? `- Reference Number: ${data.refNumber}` : ''}
- Tone: ${data.tone}
- Output Language: ${data.outputLang}

PROBLEM DESCRIPTION (user's own words — may be in any language):
"${data.problem}"

INSTRUCTIONS:
${typeInstructions[data.type] || 'Write a formal complaint letter.'}
${deadlineText}
${ccText}
${rtiText}

FORMAT THE LETTER EXACTLY AS FOLLOWS (use these exact HTML-like markers):
[DATE] — today's date written formally
[SENDER_BLOCK] — sender's name, address, contact on separate lines
[RECIPIENT_BLOCK] — recipient name and address on separate lines
[SUBJECT] — Subject: (one clear line, underlined in the actual letter)
[SALUTATION] — e.g. Respected Sir/Madam,
[BODY] — the formal letter body in 3-4 well-structured paragraphs:
  Paragraph 1: State who you are and the nature of your complaint
  Paragraph 2: Describe the problem with dates and specifics
  Paragraph 3: State what action you expect from them
  Paragraph 4: Closing statement with deadline/next steps (if applicable)
[CLOSING] — Yours faithfully / Yours sincerely,
[SIGNATURE] — sender's name
${data.includeCC ? '[CC] — CC list with appropriate authority' : ''}

Write ONLY the letter content with these markers. No explanations. No preamble.
The letter must be written entirely in ${data.outputLang}.
Make it professional, formal, and appropriate for submission to Indian government/corporate offices.`;
}

// ====== GENERATE LETTER ======
async function generateLetter() {
  const senderName = document.getElementById('senderName').value.trim();
  const senderAddr = document.getElementById('senderAddr').value.trim();
  const senderContact = document.getElementById('senderContact').value.trim();
  const recipientName = document.getElementById('recipientName').value.trim();
  const recipientAddr = document.getElementById('recipientAddr').value.trim();
  const refNumber = document.getElementById('refNumber').value.trim();
  const problem = document.getElementById('problemDesc').value.trim();
  const outputLang = document.getElementById('outputLang').value;
  const tone = document.getElementById('letterTone').value;
  const includeDeadline = document.getElementById('chkDeadline').checked;
  const includeCC = document.getElementById('chkCC').checked;
  const includeRTI = document.getElementById('chkRTI').checked;

  if (!senderName) { showToast('Please enter your name.'); return; }
  if (!recipientName) { showToast('Please enter who the letter is addressed to.'); return; }
  if (!problem) { showToast('Please describe your problem.'); return; }

  setLoading(true);

  const prompt = buildPrompt({
    type: currentType, senderName, senderAddr, senderContact,
    recipientName, recipientAddr, refNumber, problem,
    outputLang, tone, includeDeadline, includeCC, includeRTI
  });

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
        temperature: 0.5
      }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices && data.choices[0]?.message?.content?.trim();

    generatedPlainText = result;
    renderLetter(result, { senderName, recipientName, outputLang });

    // Store metadata for saving
    window._letterMeta = { senderName, recipientName, outputLang, type: currentType, problem };

  } catch (err) {
    showToast('Connection error. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
}

// ====== RENDER LETTER ======
function renderLetter(raw) {
  const extract = (tag) => {
    const start = raw.indexOf(`[${tag}]`);
    if (start === -1) return '';
    const end = raw.indexOf('[', start + tag.length + 2);
    return (end === -1 ? raw.slice(start + tag.length + 2) : raw.slice(start + tag.length + 2, end)).trim();
  };

  const date = extract('DATE');
  const senderBlock = extract('SENDER_BLOCK');
  const recipientBlock = extract('RECIPIENT_BLOCK');
  const subject = extract('SUBJECT');
  const salutation = extract('SALUTATION');
  const body = extract('BODY');
  const closing = extract('CLOSING');
  const signature = extract('SIGNATURE');
  const cc = extract('CC');

  // Format body paragraphs
  const bodyHTML = body.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');

  const html = `
    <div class="letter-date">${date || new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}</div>
    <div class="letter-sender">${(senderBlock || '').replace(/\n/g,'<br/>')}</div>
    <br/>
    <div class="letter-recipient">${(recipientBlock || '').replace(/\n/g,'<br/>')}</div>
    <br/>
    <div class="letter-subject">${subject || ''}</div>
    <div class="letter-body">
      <p>${salutation || 'Respected Sir/Madam,'}</p>
      ${bodyHTML || `<p>${body}</p>`}
    </div>
    <div class="letter-closing">${(closing || 'Yours faithfully,').replace(/\n/g,'<br/>')}</div>
    <div class="letter-signature">${(signature || '').replace(/\n/g,'<br/>')}</div>
    ${cc ? `<br/><div><strong>CC:</strong><br/>${cc.replace(/\n/g,'<br/>')}</div>` : ''}
  `;

  const content = document.getElementById('letterContent');
  content.innerHTML = html;
  content.classList.remove('hidden');
  document.getElementById('paperPlaceholder').classList.add('hidden');
  document.getElementById('previewActions').style.display = 'flex';
  document.getElementById('postActions').classList.remove('hidden');

  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ====== EDITABLE ======
function makeEditable() {
  const el = document.getElementById('letterContent');
  el.contentEditable = 'true';
  el.focus();
  showToast('Letter is now editable. Click anywhere to start editing.');
}

// ====== COPY ======
function copyLetter() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => showToast('Letter copied! 📋')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    showToast('Copied!');
  });
}

// ====== DOWNLOAD TXT ======
function downloadTXT() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;
  if (!text.trim()) { showToast('No letter to download.'); return; }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Letter_${(window._letterMeta?.type || 'Complaint').replace(/\s+/g,'_')}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('TXT downloaded!');
}

// ====== DOWNLOAD PDF ======
function downloadPDF() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;
  if (!text.trim()) { showToast('No letter to download.'); return; }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxW = pageW - margin * 2;

    doc.setFont('times', 'normal');
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(text, maxW);
    let y = margin;
    const lineH = 6;
    const pageH = doc.internal.pageSize.getHeight();

    lines.forEach(line => {
      if (y + lineH > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineH;
    });

    const filename = `Letter_${(window._letterMeta?.type || 'Complaint').replace(/\s+/g,'_')}.pdf`;
    doc.save(filename);
    showToast('PDF downloaded! 📄');
  } catch(e) {
    showToast('PDF error. Please try TXT download.');
    console.error(e);
  }
}

// ====== SAVE / LOAD ======
function saveLetter() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;
  if (!text.trim()) { showToast('No letter to save.'); return; }
  const meta = window._letterMeta || {};
  const entry = {
    id: Date.now(),
    type: meta.type || currentType,
    recipientName: meta.recipientName || '',
    outputLang: meta.outputLang || 'English',
    senderName: meta.senderName || '',
    problem: (meta.problem || '').slice(0, 120),
    html: el.innerHTML,
    plainText: text,
    date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
  };
  savedLetters.unshift(entry);
  if (savedLetters.length > 30) savedLetters.pop();
  localStorage.setItem('patralekhak_letters', JSON.stringify(savedLetters));
  showToast('Letter saved! 💾');
}

function renderSaved() {
  const list = document.getElementById('savedList');
  const empty = document.getElementById('savedEmpty');
  if (savedLetters.length === 0) {
    empty.classList.remove('hidden'); list.innerHTML = ''; return;
  }
  empty.classList.add('hidden');
  list.innerHTML = savedLetters.map(s => `
    <div class="saved-item">
      <div style="flex:1;min-width:0">
        <div class="saved-meta">
          <span class="saved-type-badge">${escHtml(s.type)}</span>
          <span class="saved-lang-badge">${escHtml(s.outputLang)}</span>
          <span class="saved-date">${s.date}</span>
        </div>
        <div class="saved-recipient">To: ${escHtml(s.recipientName || '—')}</div>
        <div class="saved-preview">${escHtml(s.problem)}</div>
      </div>
      <div class="saved-actions">
        <button class="saved-btn" onclick="loadSaved(${s.id})">View</button>
        <button class="saved-btn" onclick="downloadSavedPDF(${s.id})">PDF</button>
        <button class="saved-btn danger" onclick="deleteSaved(${s.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function loadSaved(id) {
  const s = savedLetters.find(x => x.id === id);
  if (!s) return;
  showPage('writer');
  setTimeout(() => {
    const content = document.getElementById('letterContent');
    content.innerHTML = s.html;
    content.classList.remove('hidden');
    document.getElementById('paperPlaceholder').classList.add('hidden');
    document.getElementById('previewActions').style.display = 'flex';
    document.getElementById('postActions').classList.remove('hidden');
    window._letterMeta = { type: s.type, recipientName: s.recipientName, outputLang: s.outputLang, senderName: s.senderName, problem: s.problem };
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

function downloadSavedPDF(id) {
  const s = savedLetters.find(x => x.id === id);
  if (!s) return;
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const maxW = doc.internal.pageSize.getWidth() - 40;
    doc.setFont('times','normal'); doc.setFontSize(11);
    const lines = doc.splitTextToSize(s.plainText, maxW);
    let y = 20;
    lines.forEach(line => {
      if (y + 6 > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
      doc.text(line, 20, y); y += 6;
    });
    doc.save(`Letter_${s.type.replace(/\s+/g,'_')}.pdf`);
    showToast('PDF downloaded!');
  } catch(e) { showToast('PDF error.'); }
}

function deleteSaved(id) {
  savedLetters = savedLetters.filter(x => x.id !== id);
  localStorage.setItem('patralekhak_letters', JSON.stringify(savedLetters));
  renderSaved();
  showToast('Deleted.');
}

// ====== FAQ TOGGLE ======
function toggleFAQ(el) {
  el.classList.toggle('open');
  const ans = el.nextElementSibling;
  ans.classList.toggle('open');
}

// ====== LOADING ======
function setLoading(on) {
  const btn = document.getElementById('generateBtn');
  btn.querySelector('.btn-label').classList.toggle('hidden', on);
  btn.querySelector('.btn-loading').classList.toggle('hidden', !on);
  btn.disabled = on;
}

// ====== TOAST ======
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
}

// ====== UTILS ======
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
});
