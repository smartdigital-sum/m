/* ============================================================
   ExamCraft Pro — app.js
   Handles: language, API call, paper render, PDF, DOCX, print
   ============================================================ */

// ---- STATE ----
let currentLang = 'en';
let currentPaperData = null;

// ---- TRANSLATIONS ----
const T = {
  en: {
    generating: "Generating your question paper…",
    genBtn: "✦ Generate Question Paper",
    fillRequired: "Please select: Board, Class, Subject and Chapters.",
    apiKeyMissing: "Please set your Groq API key in ⚙ Settings first.",
    errorParsing: "Could not parse AI response. Please try again.",
    errorNetwork: "Network error. Please check your API key and try again.",
    answerKey: "MARKING SCHEME / ANSWER KEY",
    questPaper: "QUESTION PAPER",
    classLabel: "Class:",
    subjectLabel: "Subject:",
    timeLabel: "Time:",
    marksLabel: "Max. Marks:",
    genInstructions: "All questions are compulsory unless stated. Write legibly.",
    mins: "mins",
    marks: "Marks",
    qMCQ: "Section A — Multiple Choice Questions",
    qShort: "Section B — Short Answer Questions",
    qLong: "Section C — Long Answer Questions",
    qTF: "Section D — True / False",
    qFill: "Section E — Fill in the Blanks",
  },
  hi: {
    generating: "आपका प्रश्नपत्र बन रहा है…",
    genBtn: "✦ प्रश्नपत्र बनाएं",
    fillRequired: "कृपया चुनें: बोर्ड, कक्षा, विषय और कम से कम एक अध्याय।",
    apiKeyMissing: "कृपया पहले ⚙ Settings में Groq API Key सेट करें।",
    errorParsing: "AI उत्तर पार्स नहीं हो सका। कृपया पुनः प्रयास करें।",
    errorNetwork: "नेटवर्क त्रुटि। अपनी API Key जांचें और फिर प्रयास करें।",
    answerKey: "उत्तर कुंजी / अंक योजना",
    questPaper: "प्रश्न पत्र",
    classLabel: "कक्षा:",
    subjectLabel: "विषय:",
    timeLabel: "समय:",
    marksLabel: "अधिकतम अंक:",
    genInstructions: "जब तक न कहा जाए, सभी प्रश्न अनिवार्य हैं। स्पष्ट लिखें।",
    mins: "मिनट",
    marks: "अंक",
    qMCQ: "खंड अ — बहुविकल्पीय प्रश्न",
    qShort: "खंड ब — लघु उत्तरीय प्रश्न",
    qLong: "खंड स — दीर्घ उत्तरीय प्रश्न",
    qTF: "खंड द — सत्य / असत्य",
    qFill: "खंड इ — रिक्त स्थान भरिए",
  },
  as: {
    generating: "আপোনাৰ প্ৰশ্নপত্ৰ তৈয়াৰ হৈ আছে…",
    genBtn: "✦ প্ৰশ্নপত্ৰ তৈয়াৰ কৰক",
    fillRequired: "অনুগ্ৰহ কৰি বাছক: ব'ৰ্ড, শ্ৰেণী, বিষয় আৰু অতি কমেও এটা অধ্যায়।",
    apiKeyMissing: "অনুগ্ৰহ কৰি প্ৰথমে ⚙ Settings-ত API Key ছেট কৰক।",
    errorParsing: "AI উত্তৰ পাৰ্ছ কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পুনৰায় চেষ্টা কৰক।",
    errorNetwork: "নেটৱাৰ্ক ত্ৰুটি। আপোনাৰ API Key পৰীক্ষা কৰক।",
    answerKey: "উত্তৰ কুঁজি / নম্বৰ আঁচনি",
    questPaper: "প্ৰশ্নপত্ৰ",
    classLabel: "শ্ৰেণী:",
    subjectLabel: "বিষয়:",
    timeLabel: "সময়:",
    marksLabel: "সৰ্বোচ্চ নম্বৰ:",
    genInstructions: "নির্দেশ নথকালৈকে সকলো প্ৰশ্ন বাধ্যতামূলক। স্পষ্টকৈ লিখক।",
    mins: "মিনিট",
    marks: "নম্বৰ",
    qMCQ: "অংশ ক — বহু বিকল্পৰ প্ৰশ্ন",
    qShort: "অংশ খ — চুটি উত্তৰৰ প্ৰশ্ন",
    qLong: "অংশ গ — দীঘল উত্তৰৰ প্ৰশ্ন",
    qTF: "অংশ ঘ — সত্য / মিছা",
    qFill: "অংশ ঙ — খালী ঠাই পূৰণ কৰক",
  }
};

// ---- LANGUAGE ----
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + lang).classList.add('active');

  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      // skip
    } else {
      el.textContent = txt;
    }
  });
}

// ---- API KEY ----
function openSettings() {
  document.getElementById('settingsModal').classList.remove('hidden');
  const stored = localStorage.getItem('ec_api_key') || '';
  document.getElementById('apiKeyInput').value = stored;
}
function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}
function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (key) {
    localStorage.setItem('ec_api_key', key);
    document.getElementById('apiKeyWarning').classList.add('hidden');
  }
  closeSettings();
}
function toggleKey() {
  const inp = document.getElementById('apiKeyInput');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}
// Close modal on overlay click
document.getElementById('settingsModal').addEventListener('click', function(e) {
  if (e.target === this) closeSettings();
});

// ---- HELPERS ----
function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(e => e.value);
}
function getDifficulty() {
  const el = document.querySelector('input[name="difficulty"]:checked');
  return el ? el.value : 'Medium';
}

// ---- CASCADING DROPDOWNS ----
function onBoardChange() {
  const board = document.getElementById('boardSelect').value;
  const classSelect = document.getElementById('classSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const chapterContainer = document.getElementById('chapterContainer');

  classSelect.innerHTML = '<option value="">— Select Class —</option>';
  subjectSelect.innerHTML = '<option value="">— Select Subject —</option>';
  subjectSelect.disabled = true;
  chapterContainer.innerHTML = '<div class="chapter-placeholder">Select a subject to view chapters</div>';

  if (!board) {
    classSelect.disabled = true;
    return;
  }
  
  classSelect.disabled = false;
  const classes = window.SYLLABUS_DATA[board].classes;
  for (const c in classes) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    classSelect.appendChild(opt);
  }
}

function onClassChange() {
  const board = document.getElementById('boardSelect').value;
  const cls = document.getElementById('classSelect').value;
  const subjectSelect = document.getElementById('subjectSelect');
  const chapterContainer = document.getElementById('chapterContainer');

  subjectSelect.innerHTML = '<option value="">— Select Subject —</option>';
  chapterContainer.innerHTML = '<div class="chapter-placeholder">Select a subject to view chapters</div>';

  if (!cls) {
    subjectSelect.disabled = true;
    return;
  }

  subjectSelect.disabled = false;
  const subjects = window.SYLLABUS_DATA[board].classes[cls].subjects;
  for (const s in subjects) {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    subjectSelect.appendChild(opt);
  }
}

function onSubjectChange() {
  const board = document.getElementById('boardSelect').value;
  const cls = document.getElementById('classSelect').value;
  const subject = document.getElementById('subjectSelect').value;
  const chapterContainer = document.getElementById('chapterContainer');

  if (!subject) {
    chapterContainer.innerHTML = '<div class="chapter-placeholder">Select a subject to view chapters</div>';
    return;
  }

  const chapters = window.SYLLABUS_DATA[board].classes[cls].subjects[subject].chapters;
  
  // Group chapters by section if available
  const groups = {};
  chapters.forEach(ch => {
    const sec = ch.section || 'General';
    if (!groups[sec]) groups[sec] = [];
    groups[sec].push(ch);
  });

  let html = '';
  // Add "Select All" toggle
  html += `<div class="chapter-select-all">
    <label><input type="checkbox" onchange="toggleAllChapters(this)" /> <strong>Select All Chapters</strong></label>
  </div>`;

  for (const sec in groups) {
    if (sec !== 'General') {
      html += `<div class="chapter-section-title">${sec}</div>`;
    }
    html += `<div class="chapter-list">`;
    groups[sec].forEach(ch => {
      let weightageStr = ch.weightage ? ` <i>(${ch.weightage} marks)</i>` : '';
      let noteStr = ch.note ? ` <span class="chapter-note">[${ch.note}]</span>` : '';
      html += `<label class="chapter-item">
        <input type="checkbox" name="selectedChapters" value="${ch.name}" />
        <span>${ch.name}${weightageStr}${noteStr}</span>
      </label>`;
    });
    html += `</div>`;
  }
  
  chapterContainer.innerHTML = html;
}

function toggleAllChapters(checkbox) {
  const checkboxes = document.querySelectorAll('input[name="selectedChapters"]');
  checkboxes.forEach(cb => cb.checked = checkbox.checked);
}

// ---- MAIN GENERATE ----
async function generatePaper() {
  const apiKey = GLOBAL_CONFIG.API_KEY;

  const board = document.getElementById('boardSelect').value;
  const schoolName = document.getElementById('schoolName').value.trim() || 'Your School';
  const cls = document.getElementById('classSelect').value;
  const subject = document.getElementById('subjectSelect').value;
  const selectedChaptersCheckboxes = document.querySelectorAll('input[name="selectedChapters"]:checked');
  const selectedChapters = Array.from(selectedChaptersCheckboxes).map(cb => cb.value);
  const topic = selectedChapters.join(', ');

  const totalQ = parseInt(document.getElementById('totalQ').value) || 20;
  const totalMarks = parseInt(document.getElementById('totalMarks').value) || 50;
  const timeLimit = parseInt(document.getElementById('timeLimit').value) || 90;
  const difficulty = getDifficulty();
  const qtypes = getCheckedValues('qtype');
  const extraInstructions = document.getElementById('instructions').value.trim();

  if (!board || !cls || !subject || selectedChapters.length === 0) {
    alert(T[currentLang].fillRequired);
    return;
  }
  if (qtypes.length === 0) {
    alert('Please select at least one question type.');
    return;
  }

  // Show loading
  document.getElementById('outputPlaceholder').classList.add('hidden');
  document.getElementById('outputResult').classList.add('hidden');
  document.getElementById('outputLoading').classList.remove('hidden');
  document.getElementById('loadingText').textContent = T[currentLang].generating;

  const qtypeLabels = {
    MCQ: 'Multiple Choice Questions (4 options each, indicate correct answer)',
    ShortAnswer: 'Short Answer Questions (2-3 sentence answers)',
    LongAnswer: 'Long Answer / Essay Questions (detailed answers)',
    TrueFalse: 'True or False Questions',
    FillBlank: 'Fill in the Blank Questions',
  };
  const selectedTypeDescriptions = qtypes.map(t => qtypeLabels[t]).join(', ');

  const boardSpecificRules = window.PROMPT_TEMPLATES && window.PROMPT_TEMPLATES[board] ? window.PROMPT_TEMPLATES[board] : '';

  const prompt = `You are an expert Indian school teacher and exam paper setter for ${board} Board.

Create a complete question paper for:
- Board: ${board}
- School: ${schoolName}
- Class: ${cls}
- Subject: ${subject}
- Selected Chapters: ${topic}
- Difficulty: ${difficulty}
- Total Questions: ${totalQ}
- Total Marks: ${totalMarks}
- Time: ${timeLimit} minutes
- Question Types to include: ${selectedTypeDescriptions}
${extraInstructions ? `- Special Instructions from teacher: ${extraInstructions}` : ''}

${boardSpecificRules}

STRICT INSTRUCTION: Only generate questions strictly from the 'Selected Chapters' listed above. Do not include topics from other chapters.
Distribute questions proportionally across the selected types. Assign marks per question appropriately (MCQ=1, True/False=1, Fill blank=1, Short=2-3, Long=5-8).

Respond ONLY with valid JSON in this exact structure (no markdown, no explanation):
{
  "sections": [
    {
      "type": "MCQ",
      "title": "Section A — Multiple Choice Questions",
      "marks_per_q": 1,
      "questions": [
        {
          "qno": 1,
          "text": "Question text here?",
          "options": ["(a) Option A", "(b) Option B", "(c) Option C", "(d) Option D"],
          "answer": "(b) Option B",
          "marks": 1
        }
      ]
    },
    {
      "type": "ShortAnswer",
      "title": "Section B — Short Answer Questions",
      "marks_per_q": 3,
      "questions": [
        {
          "qno": 6,
          "text": "Question text here?",
          "options": [],
          "answer": "Model answer here.",
          "marks": 3
        }
      ]
    }
  ]
}

Only include sections for the selected question types: ${qtypes.join(', ')}.
Make questions educationally appropriate for ${cls} students studying ${subject}.
Total marks across ALL questions should sum to approximately ${totalMarks}.
`;

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
        max_tokens: 4000, 
        temperature: GLOBAL_CONFIG.TEMPERATURE
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'API Error ' + response.status);
    }

    const data = await response.json();
    const rawText = data.choices && data.choices[0]?.message?.content?.trim();
    if (!rawText) throw new Error("Empty response from AI");

    // Parse JSON
    let paperData;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      paperData = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch (e) {
      throw new Error(T[currentLang].errorParsing);
    }

    // Attach metadata
    paperData.meta = { schoolName, cls, subject, topic, totalMarks, timeLimit, difficulty, extraInstructions };
    currentPaperData = paperData;

    // Render
    renderPaper(paperData);

    document.getElementById('outputLoading').classList.add('hidden');
    document.getElementById('outputResult').classList.remove('hidden');

  } catch (err) {
    document.getElementById('outputLoading').classList.add('hidden');
    document.getElementById('outputPlaceholder').classList.remove('hidden');
    alert('❌ ' + (err.message || T[currentLang].errorNetwork));
    console.error(err);
  }
}

// ---- RENDER PAPER ----
function renderPaper(data) {
  const t = T[currentLang];
  const { meta, sections } = data;

  let html = '';

  // Header
  html += `<div class="paper-header">
    <div class="paper-school-name">${meta.schoolName}</div>
    <div class="paper-exam-title">${t.questPaper} — ${meta.subject} | ${meta.cls}</div>
    <div style="font-size:0.85rem;color:#455080;margin-top:4px">${meta.topic}</div>
    <div class="paper-meta">
      <span>${t.classLabel} ${meta.cls}</span>
      <span>${t.subjectLabel} ${meta.subject}</span>
      <span>${t.timeLabel} ${meta.timeLimit} ${t.mins}</span>
      <span>${t.marksLabel} ${meta.totalMarks}</span>
    </div>
  </div>`;

  // Instructions
  const instructionText = meta.extraInstructions || t.genInstructions;
  html += `<div class="paper-instructions"><strong>General Instructions:</strong> ${instructionText}</div>`;

  // Sections (questions only)
  let qCounter = 1;
  sections.forEach(section => {
    const totalSectionMarks = section.questions.reduce((s, q) => s + (q.marks || section.marks_per_q || 1), 0);
    html += `<div class="paper-section">
      <div class="paper-section-title">
        ${section.title}
        <span class="marks-badge">${totalSectionMarks} ${t.marks}</span>
      </div>`;

    section.questions.forEach(q => {
      html += `<div class="question-item">
        <span class="question-number">Q${q.qno || qCounter}.</span>
        ${escapeHtml(q.text)}
        <span style="float:right;font-size:0.75rem;color:#8a93b2;font-weight:600">[${q.marks} ${t.marks}]</span>`;

      if (q.options && q.options.length > 0) {
        html += `<div class="mcq-options">`;
        q.options.forEach(opt => {
          html += `<div class="mcq-option">${escapeHtml(opt)}</div>`;
        });
        html += `</div>`;
      }
      html += `</div>`;
      qCounter++;
    });

    html += `</div>`;
  });

  // Marking Scheme
  html += `<div class="marking-scheme">
    <div class="marking-scheme-title">🔑 ${t.answerKey}</div>`;

  let aCounter = 1;
  sections.forEach(section => {
    html += `<div style="font-size:0.78rem;font-weight:700;color:#455080;text-transform:uppercase;letter-spacing:.05em;margin:1rem 0 .5rem">${section.title}</div>`;
    section.questions.forEach(q => {
      html += `<div class="answer-item">
        <span class="answer-qnum">Q${q.qno || aCounter}.</span>
        <span class="answer-text">${escapeHtml(q.answer || '—')}</span>
        <span class="answer-marks">${q.marks} ${t.marks}</span>
      </div>`;
      aCounter++;
    });
  });

  html += `</div>`;

  document.getElementById('paperPreview').innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---- PRINT ----
function printPaper() {
  window.print();
}

// ---- EXPORT PDF ----
function exportPDF() {
  if (!currentPaperData) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const meta = currentPaperData.meta;
  const t = T[currentLang];

  const pageW = 210;
  const margin = 18;
  const contentW = pageW - margin * 2;
  let y = 20;

  const addPageIfNeeded = (height = 10) => {
    if (y + height > 275) { doc.addPage(); y = 20; }
  };

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(meta.schoolName, pageW / 2, y, { align: 'center' });
  y += 7;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${t.questPaper} | ${meta.subject} | ${meta.cls}`, pageW / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Topic: ${meta.topic}`, pageW / 2, y, { align: 'center' });
  y += 6;

  // Meta row
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30);
  doc.text(`${t.classLabel} ${meta.cls}`, margin, y);
  doc.text(`${t.subjectLabel} ${meta.subject}`, margin + 45, y);
  doc.text(`${t.timeLabel} ${meta.timeLimit} ${t.mins}`, margin + 100, y);
  doc.text(`${t.marksLabel} ${meta.totalMarks}`, margin + 150, y);
  y += 5;
  doc.setLineWidth(0.5);
  doc.setDrawColor(15, 31, 61);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // Instructions
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80);
  const instrText = `General Instructions: ${meta.extraInstructions || t.genInstructions}`;
  const instrLines = doc.splitTextToSize(instrText, contentW);
  doc.text(instrLines, margin, y);
  y += instrLines.length * 4.5 + 4;
  doc.setTextColor(30);

  // Sections
  currentPaperData.sections.forEach(section => {
    addPageIfNeeded(14);
    doc.setFillColor(15, 31, 61);
    doc.roundedRect(margin, y, contentW, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, margin + 4, y + 5.5);
    y += 11;
    doc.setTextColor(30);

    section.questions.forEach(q => {
      addPageIfNeeded(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      const qLabel = `Q${q.qno}. `;
      const qText = qLabel + q.text;
      const lines = doc.splitTextToSize(qText, contentW - 20);
      doc.text(lines, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`[${q.marks} ${t.marks}]`, pageW - margin, y, { align: 'right' });
      doc.setTextColor(30);
      y += lines.length * 4.5;

      if (q.options && q.options.length > 0) {
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        const half = Math.ceil(q.options.length / 2);
        q.options.forEach((opt, i) => {
          const col = i < half ? margin + 8 : margin + contentW / 2;
          const row = y + (i % half) * 4.5;
          addPageIfNeeded(5);
          doc.text(opt, col, row);
        });
        y += half * 4.5 + 2;
      }
      y += 3;
    });
    y += 4;
  });

  // Marking Scheme
  addPageIfNeeded(20);
  doc.setLineWidth(0.4);
  doc.setDrawColor(15, 31, 61);
  doc.setLineDash([2, 2]);
  doc.line(margin, y, pageW - margin, y);
  doc.setLineDash([]);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 31, 61);
  doc.text(`🔑 ${t.answerKey}`, margin, y);
  y += 8;

  currentPaperData.sections.forEach(section => {
    addPageIfNeeded(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(70, 80, 128);
    doc.text(section.title, margin, y);
    y += 6;

    section.questions.forEach(q => {
      addPageIfNeeded(8);
      doc.setFillColor(247, 244, 238);
      doc.roundedRect(margin, y - 3, contentW, 7, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 31, 61);
      doc.text(`Q${q.qno}.`, margin + 2, y + 1.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30);
      const aLines = doc.splitTextToSize(q.answer || '—', contentW - 30);
      doc.text(aLines, margin + 12, y + 1.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 150, 42);
      doc.text(`${q.marks}M`, pageW - margin - 2, y + 1.5, { align: 'right' });
      doc.setTextColor(30);
      y += Math.max(aLines.length * 4.5, 7) + 1;
    });
    y += 3;
  });

  const filename = `${meta.schoolName}_${meta.subject}_${meta.cls}_QuestionPaper.pdf`
    .replace(/\s+/g, '_').replace(/[^\w_.]/g, '');
  doc.save(filename);
}

// ---- EXPORT DOCX ----
async function exportDOCX() {
  if (!currentPaperData || !window.docx) return;
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType } = window.docx;
  const meta = currentPaperData.meta;
  const t = T[currentLang];

  const children = [];

  // School name
  children.push(new Paragraph({
    children: [new TextRun({ text: meta.schoolName, bold: true, size: 32 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 }
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `${t.questPaper} | ${meta.subject} | ${meta.cls}`, size: 22 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 }
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `Topic: ${meta.topic}`, italics: true, size: 20, color: '455080' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  }));

  // Meta row
  children.push(new Paragraph({
    children: [
      new TextRun({ text: `${t.classLabel} ${meta.cls}   |   ${t.subjectLabel} ${meta.subject}   |   ${t.timeLabel} ${meta.timeLimit} ${t.mins}   |   ${t.marksLabel} ${meta.totalMarks}`, size: 18, bold: true })
    ],
    alignment: AlignmentType.CENTER,
    border: { bottom: { color: '0f1f3d', size: 8, style: BorderStyle.SINGLE } },
    spacing: { after: 200 }
  }));

  // Instructions
  children.push(new Paragraph({
    children: [
      new TextRun({ text: 'General Instructions: ', bold: true, size: 18 }),
      new TextRun({ text: meta.extraInstructions || t.genInstructions, italics: true, size: 18 })
    ],
    spacing: { after: 300 }
  }));

  // Sections
  currentPaperData.sections.forEach(section => {
    const totalSectionMarks = section.questions.reduce((s, q) => s + (q.marks || 1), 0);
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `${section.title}  [${totalSectionMarks} ${t.marks}]`, bold: true, color: 'FFFFFF', size: 22 })
      ],
      shading: { type: ShadingType.SOLID, color: '0f1f3d' },
      spacing: { before: 300, after: 150 }
    }));

    section.questions.forEach(q => {
      const qRuns = [
        new TextRun({ text: `Q${q.qno}. `, bold: true, size: 20 }),
        new TextRun({ text: q.text, size: 20 }),
        new TextRun({ text: `  [${q.marks} ${t.marks}]`, size: 18, color: '8a93b2', bold: true })
      ];
      children.push(new Paragraph({ children: qRuns, spacing: { after: 80 } }));

      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          children.push(new Paragraph({
            children: [new TextRun({ text: `     ${opt}`, size: 18, color: '455080' })],
            spacing: { after: 40 }
          }));
        });
      }
      children.push(new Paragraph({ children: [new TextRun({ text: '' })], spacing: { after: 100 } }));
    });
  });

  // Marking Scheme
  children.push(new Paragraph({
    children: [new TextRun({ text: `🔑 ${t.answerKey}`, bold: true, size: 24, color: '0f1f3d' })],
    border: { top: { color: '0f1f3d', size: 8, style: BorderStyle.DASHED } },
    spacing: { before: 400, after: 200 }
  }));

  currentPaperData.sections.forEach(section => {
    children.push(new Paragraph({
      children: [new TextRun({ text: section.title, bold: true, size: 18, color: '455080' })],
      spacing: { after: 100 }
    }));
    section.questions.forEach(q => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `Q${q.qno}. `, bold: true, size: 18 }),
          new TextRun({ text: q.answer || '—', size: 18 }),
          new TextRun({ text: `  [${q.marks} ${t.marks}]`, size: 16, bold: true, color: 'c8962a' })
        ],
        spacing: { after: 80 },
        shading: { type: ShadingType.SOLID, color: 'f7f4ee' }
      }));
    });
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `${meta.schoolName}_${meta.subject}_${meta.cls}_QuestionPaper.docx`
    .replace(/\s+/g, '_').replace(/[^\w_.]/g, '');
  saveAs(blob, filename);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  setLang('en');
  // Preload API key display
  if (localStorage.getItem('ec_api_key')) {
    document.getElementById('apiKeyWarning').classList.add('hidden');
  }
});
