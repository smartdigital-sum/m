// ================================================================
//  app.js — Wizard logic, API calls, rendering
// ================================================================

// ─── State ───────────────────────────────────────────────────────

let currentStep = 1;
window.selectedTemplate = 'modern';
window.generatedResumeData = null;

// ─── Init ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Inject config-driven text
  document.getElementById('brandName').textContent    = CONFIG.BRAND_NAME;
  document.getElementById('headerPrice').textContent  = CONFIG.RESUME_PRICE;
  document.getElementById('heroPriceBtn').textContent = CONFIG.RESUME_PRICE;
  document.getElementById('upiId').textContent        = CONFIG.UPI_ID;
  document.getElementById('upiName').textContent      = CONFIG.UPI_NAME;
  document.getElementById('coverLetterPrice').textContent = CONFIG.COVER_LETTER_PRICE;
  document.getElementById('osPriceResume').textContent    = CONFIG.RESUME_PRICE;
  document.getElementById('osPriceCoverLetter').textContent = CONFIG.COVER_LETTER_PRICE;
  document.getElementById('footerText').textContent   = `© ${new Date().getFullYear()} ${CONFIG.BRAND_NAME}. All rights reserved.`;
  updateTotal();

  // WhatsApp button
  if (CONFIG.WHATSAPP_NUMBER) {
    const btn = document.createElement('a');
    btn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`;
    btn.target = '_blank';
    btn.className = 'whatsapp-fab';
    btn.innerHTML = '💬';
    btn.title = 'Chat on WhatsApp';
    document.body.appendChild(btn);
  }
});

// ─── Wizard Navigation ───────────────────────────────────────────

function startWizard() {
  document.getElementById('heroSection').classList.add('hidden');
  document.getElementById('wizardSection').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  goToStep(1);
}

function nextStep(from) {
  if (!validateStep(from)) return;
  goToStep(from + 1);
}

function prevStep(from) {
  goToStep(from - 1);
}

function goToStep(n) {
  // Hide all steps
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  // Show target step
  const target = document.getElementById(`step-${n}`);
  if (target) {
    target.classList.add('active');
    currentStep = n;
  }
  // Update progress
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(n) {
  const totalNav = 6; // steps shown in nav
  const fill = Math.min(((n - 1) / (totalNav - 1)) * 100, 100);
  document.getElementById('progressFill').style.width = fill + '%';

  document.querySelectorAll('.ps-step').forEach(el => {
    const sn = parseInt(el.dataset.step);
    el.classList.toggle('active',    sn === n);
    el.classList.toggle('completed', sn < n);
  });
}

// ─── Validation ──────────────────────────────────────────────────

function validateStep(step) {
  const errors = [];

  if (step === 1) {
    if (!val('name'))      errors.push('Full Name is required.');
    if (!val('email'))     errors.push('Email is required.');
    if (!val('phone'))     errors.push('Phone Number is required.');
    if (!val('location'))  errors.push('City / Location is required.');
    if (!val('jobTarget')) errors.push('Job Target / Role is required.');
  }

  if (step === 2) {
    const degrees = document.querySelectorAll('.edu-degree');
    if (!degrees[0]?.value.trim()) errors.push('Please add at least one education entry.');
  }

  if (step === 3) {
    if (!val('technicalSkills')) errors.push('Please enter at least one technical skill.');
  }

  if (errors.length) {
    showToast(errors[0], 'error');
    return false;
  }
  return true;
}

function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

// ─── Dynamic Fields ──────────────────────────────────────────────

function addEducation() {
  const container = document.getElementById('educationEntries');
  const idx = container.children.length;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `edu-${idx}`;
  div.innerHTML = `
    <button class="btn-remove" onclick="this.parentElement.remove()">✕</button>
    <div class="form-grid">
      <div class="form-group full"><label>Degree / Course</label><input type="text" class="edu-degree" placeholder="e.g. B.Com" /></div>
      <div class="form-group full"><label>Institution Name</label><input type="text" class="edu-institution" placeholder="e.g. Cotton University" /></div>
      <div class="form-group"><label>Year of Passing</label><input type="text" class="edu-year" placeholder="e.g. 2022" /></div>
      <div class="form-group"><label>Percentage / CGPA</label><input type="text" class="edu-grade" placeholder="e.g. 82%" /></div>
    </div>`;
  container.appendChild(div);
}

function addProject() {
  const container = document.getElementById('projectEntries');
  const idx = container.children.length;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `proj-${idx}`;
  div.innerHTML = `
    <button class="btn-remove" onclick="this.parentElement.remove()">✕</button>
    <div class="form-grid">
      <div class="form-group full"><label>Project Name</label><input type="text" class="proj-name" placeholder="e.g. Library Management System" /></div>
      <div class="form-group full"><label>Project Description</label><textarea class="proj-desc" rows="3" placeholder="What did you build and why?"></textarea></div>
      <div class="form-group full"><label>Technologies Used</label><input type="text" class="proj-tech" placeholder="e.g. Java, MySQL" /></div>
    </div>`;
  container.appendChild(div);
}

function addExperience() {
  const container = document.getElementById('experienceEntries');
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.innerHTML = `
    <button class="btn-remove" onclick="this.parentElement.remove()">✕</button>
    <div class="form-grid">
      <div class="form-group"><label>Job Title</label><input type="text" class="exp-title" placeholder="e.g. Marketing Executive" /></div>
      <div class="form-group"><label>Company Name</label><input type="text" class="exp-company" placeholder="e.g. XYZ Pvt Ltd" /></div>
      <div class="form-group"><label>Duration</label><input type="text" class="exp-duration" placeholder="e.g. Jan 2023 – Dec 2023" /></div>
      <div class="form-group full"><label>Key Responsibilities</label><textarea class="exp-desc" rows="3" placeholder="Describe your role and achievements..."></textarea></div>
    </div>`;
  container.appendChild(div);
}

function toggleExperienceMode() {
  const isExp = document.getElementById('isExperienced').checked;
  document.getElementById('projectsSection').style.display    = isExp ? 'none' : 'block';
  document.getElementById('experienceSection').style.display  = isExp ? 'block' : 'none';
}

// ─── Template Selection ──────────────────────────────────────────

function selectTemplate(name, el) {
  window.selectedTemplate = name;
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ─── Totals ──────────────────────────────────────────────────────

function updateTotal() {
  const wantsCL = document.getElementById('wantsCoverLetter')?.checked;
  const total = CONFIG.RESUME_PRICE + (wantsCL ? CONFIG.COVER_LETTER_PRICE : 0);

  document.getElementById('osTotal').textContent       = total;
  document.getElementById('paymentTotal').textContent  = total;
  document.getElementById('paymentTotal2').textContent = total;

  const clRow = document.getElementById('osCoverRow');
  if (clRow) clRow.classList.toggle('hidden', !wantsCL);
}

// ─── Collect Form Data ───────────────────────────────────────────

function collectFormData() {
  const edu = Array.from(document.querySelectorAll('#educationEntries .entry-card')).map(card => ({
    degree:      card.querySelector('.edu-degree')?.value.trim()      || '',
    institution: card.querySelector('.edu-institution')?.value.trim() || '',
    year:        card.querySelector('.edu-year')?.value.trim()        || '',
    grade:       card.querySelector('.edu-grade')?.value.trim()       || ''
  })).filter(e => e.degree);

  const isExp = document.getElementById('isExperienced')?.checked;

  const projects = isExp ? [] :
    Array.from(document.querySelectorAll('#projectEntries .entry-card')).map(card => ({
      name:         card.querySelector('.proj-name')?.value.trim() || '',
      description:  card.querySelector('.proj-desc')?.value.trim() || '',
      technologies: card.querySelector('.proj-tech')?.value.trim() || ''
    })).filter(p => p.name);

  const experience = !isExp ? [] :
    Array.from(document.querySelectorAll('#experienceEntries .entry-card')).map(card => ({
      title:       card.querySelector('.exp-title')?.value.trim()    || '',
      company:     card.querySelector('.exp-company')?.value.trim()  || '',
      duration:    card.querySelector('.exp-duration')?.value.trim() || '',
      description: card.querySelector('.exp-desc')?.value.trim()     || ''
    })).filter(e => e.title);

  return {
    name:             val('name'),
    email:            val('email'),
    phone:            val('phone'),
    location:         val('location'),
    jobTarget:        val('jobTarget'),
    linkedin:         val('linkedin'),
    github:           val('github'),
    education:        edu,
    technicalSkills:  val('technicalSkills'),
    softSkills:       val('softSkills'),
    languages:        val('languages'),
    experience,
    projects,
    isExperienced:    isExp,
    wantsCoverLetter: document.getElementById('wantsCoverLetter')?.checked || false,
    selectedTemplate: window.selectedTemplate
  };
}

// ─── Generate Resume (API Call) ───────────────────────────────────

async function generateResume() {
  const apiKey = GLOBAL_CONFIG.API_KEY;

  const formData = collectFormData();
  goToStep(7);
  showLoading(true);

  const wantsCL = formData.wantsCoverLetter;
  const prompt  = buildPrompt(formData);

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
        max_tokens: wantsCL ? 3000 : 2000,
        temperature: GLOBAL_CONFIG.TEMPERATURE
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const apiData = await res.json();
    const rawText = apiData.choices && apiData.choices[0]?.message?.content?.trim();

    // Parse JSON — strip any markdown fences Claude might add
    const cleaned = rawText.replace(/```json|```/gi, '').trim();
    const match   = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Could not parse resume JSON from AI response.');

    const resumeData = JSON.parse(match[0]);
    window.generatedResumeData = resumeData;

    showLoading(false);
    renderResult(resumeData);

  } catch (err) {
    console.error(err);
    showLoading(false);
    showToast('Error: ' + err.message + ' — Please check your API key in config.js.', 'error');
    goToStep(6);
  }
}

// ─── Prompt Builder ───────────────────────────────────────────────

function buildPrompt(fd) {
  const clInstruction = fd.wantsCoverLetter
    ? `Also include a "coverLetter" field: a professional, warm cover letter (250-320 words) tailored to the target role.`
    : 'Do NOT include a coverLetter field.';

  return `You are an expert resume writer specialising in the Indian job market, particularly for students and freshers from Northeast India.

Candidate Details:
- Name: ${fd.name}
- Email: ${fd.email}
- Phone: ${fd.phone}
- Location: ${fd.location}
- Target Role: ${fd.jobTarget}
- LinkedIn: ${fd.linkedin || 'N/A'}
- GitHub: ${fd.github || 'N/A'}

Education:
${fd.education.map(e => `- ${e.degree} from ${e.institution} (${e.year}) — ${e.grade}`).join('\n') || 'Not provided'}

Technical Skills: ${fd.technicalSkills || 'Not provided'}
Soft Skills: ${fd.softSkills || 'Not provided'}
Languages Known: ${fd.languages || 'Not provided'}

${fd.isExperienced ? `Work Experience:
${fd.experience.map(e => `- ${e.title} at ${e.company} (${e.duration}): ${e.description}`).join('\n') || 'Not provided'}` : `Academic / Personal Projects:
${fd.projects.map(p => `- ${p.name} (${p.technologies}): ${p.description}`).join('\n') || 'Not provided'}`}

Instructions:
1. Write a polished, ATS-friendly, professional resume.
2. For experience bullet points, use strong action verbs (Developed, Designed, Increased, Led, etc.).
3. Keep language concise and impactful.
4. Infer a suitable professional headline from the candidate's background.
5. Write a compelling 2-3 sentence professional summary.
6. ${clInstruction}
7. Return ONLY valid JSON — no markdown fences, no explanation, nothing else.

JSON structure:
{
  "name": "",
  "headline": "Professional headline",
  "summary": "2-3 sentence summary",
  "contact": { "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "education": [{ "degree": "", "institution": "", "year": "", "grade": "", "highlights": [] }],
  "experience": [{ "title": "", "company": "", "duration": "", "bullets": ["","",""] }],
  "projects":   [{ "name": "", "description": "", "technologies": "" }],
  "skills": { "technical": [], "soft": [], "languages": [] }${fd.wantsCoverLetter ? ',\n  "coverLetter": ""' : ''}
}`;
}

// ─── Render Result ─────────────────────────────────────────────────

function renderResult(data) {
  document.getElementById('resultState').classList.remove('hidden');

  // Render resume preview
  const tpl = window.selectedTemplate || 'modern';
  document.getElementById('resumePreview').innerHTML = getTemplate(tpl, data);

  // Cover letter
  const hasCL = !!data.coverLetter;
  document.getElementById('coverLetterResult').classList.toggle('hidden', !hasCL);

  const clTabBtn = document.getElementById('clTabBtn');
  if (clTabBtn) clTabBtn.style.display = hasCL ? 'inline-flex' : 'none';

  if (hasCL) {
    document.getElementById('coverLetterPreview').innerHTML =
      `<div style="white-space:pre-line;font-family:Calibri,sans-serif;font-size:14px;line-height:1.8;color:#222;">${esc2(data.coverLetter)}</div>`;
  }
}

function esc2(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Tabs ──────────────────────────────────────────────────────────

function showTab(tab) {
  document.getElementById('resumePreviewWrapper').classList.toggle('hidden', tab !== 'resume');
  document.getElementById('coverLetterPreviewWrapper').classList.toggle('hidden', tab !== 'coverLetter');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

// ─── Loading ───────────────────────────────────────────────────────

const loadingMessages = [
  'Reading your details...',
  'AI is polishing your resume...',
  'Optimising for ATS systems...',
  'Adding the finishing touches...',
  'Almost ready...'
];

function showLoading(show) {
  document.getElementById('loadingState').classList.toggle('hidden', !show);
  document.getElementById('resultState').classList.toggle('hidden', show);

  if (show) {
    let i = 0;
    window._loadingInterval = setInterval(() => {
      document.getElementById('loadingText').textContent = loadingMessages[i % loadingMessages.length];
      i++;
    }, 3000);
  } else {
    clearInterval(window._loadingInterval);
  }
}

// ─── Toast ─────────────────────────────────────────────────────────

function showToast(msg, type = 'info') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 50);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4000);
}

// ─── Start Over ─────────────────────────────────────────────────────

function startOver() {
  if (!confirm('Start a new resume? Your current resume will be lost.')) return;
  window.generatedResumeData = null;
  location.reload();
}
