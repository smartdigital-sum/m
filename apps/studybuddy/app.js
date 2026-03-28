// ===========================
//   STUDYBUDDY — app.js
//   Class 9 & 10 Assignment Helper
// ===========================

// ====== STATE ======
let currentSubject = 'Maths';
let currentClass = '9';
let currentMode = 'text';
let currentImageBase64 = null;
let currentImageType = null;
let lastAnswer = '';
let conversationHistory = [];
let sessions = JSON.parse(localStorage.getItem('studybuddy_sessions') || '[]');
let streak = parseInt(localStorage.getItem('studybuddy_streak') || '0');
let lastStudyDate = localStorage.getItem('studybuddy_last_date') || '';

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  setGreeting();
  updateStreakDisplay();
  checkStreak();
  renderHistory();
  initPomodoro();

  // Char counter
  document.getElementById('questionInput').addEventListener('input', function () {
    const len = this.value.length;
    document.getElementById('charCount').textContent = len;
    if (len > 500) this.value = this.value.slice(0, 500);
  });
});

// ====== GREETING ======
function setGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning! 👋' : h < 17 ? 'Good afternoon! 👋' : 'Good evening! 👋';
  document.getElementById('greeting').textContent = greet;
}

// ====== STREAK ======
function checkStreak() {
  const today = new Date().toDateString();
  if (lastStudyDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastStudyDate === yesterday) {
    streak += 1;
  } else if (lastStudyDate !== today) {
    streak = 1;
  }
  localStorage.setItem('studybuddy_streak', streak);
  localStorage.setItem('studybuddy_last_date', today);
  lastStudyDate = today;
  updateStreakDisplay();
}

function updateStreakDisplay() {
  document.getElementById('streakCount').textContent = streak;
}

// ====== PAGE NAV ======
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  if (page === 'history') renderHistory();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== SUBJECT & CLASS ======
function setSubject(btn) {
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentSubject = btn.dataset.subject;
  updateSuggestions();
}

function setClass(btn) {
  document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentClass = btn.dataset.class;
}

// ====== INPUT MODE ======
function setMode(mode, btn) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('modeText').classList.toggle('hidden', mode !== 'text');
  document.getElementById('modePhoto').classList.toggle('hidden', mode !== 'photo');
}

// ====== FILE UPLOAD ======
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Image too large. Max 5MB.'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    currentImageBase64 = dataUrl.split(',')[1];
    currentImageType = file.type;
    document.getElementById('previewImg').src = dataUrl;
    document.getElementById('imagePreview').classList.remove('hidden');
    document.getElementById('uploadZone').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  currentImageBase64 = null;
  currentImageType = null;
  document.getElementById('previewImg').src = '';
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('uploadZone').classList.remove('hidden');
  document.getElementById('fileInput').value = '';
}

// ====== EXPLANATION STYLE ======
function getExplainStyle() {
  const val = document.querySelector('input[name="style"]:checked')?.value || 'step';
  const map = {
    step: 'step-by-step with numbered steps, showing your full working/reasoning',
    simple: 'a simple, clear summary that is easy to understand',
    exam: 'a well-structured exam-ready answer with key points, suitable for CBSE board exams'
  };
  return map[val];
}

// ====== SYSTEM PROMPT ======
function buildSystemPrompt() {
  return `You are StudyBuddy, a friendly and encouraging study assistant for Indian students in Class ${currentClass} (CBSE curriculum).

Subject: ${currentSubject}
Class: ${currentClass}
Explanation style: ${getExplainStyle()}

Your role:
- Explain concepts clearly, step by step, at the right level for Class ${currentClass}
- Use simple language — be like a friendly senior student, not a textbook
- For Maths: show every step of the working. Use clear notation.
- For Science: relate concepts to real life where possible. Mention diagrams if relevant.
- For English: explain grammar rules, help with comprehension, guide essay/letter writing
- For Social Science / History: give clear timelines, causes and effects, key facts
- Always end with a quick "💡 Key Takeaway" — one sentence summary
- If you see a photo of homework, read it carefully and answer the specific question shown
- Never just give the answer — always explain WHY so the student understands
- Be encouraging! Use phrases like "Great question!", "Let's break this down together", etc.
- Keep explanations focused and not too long — students need clarity, not essays
- Format your response clearly with sections where helpful`;
}

// ====== ASK QUESTION ======
async function askQuestion() {
  const questionText = document.getElementById('questionInput').value.trim();
  const photoNote = document.getElementById('photoNote').value.trim();

  if (currentMode === 'text' && !questionText) {
    showToast('Please type your question first!'); return;
  }
  if (currentMode === 'photo' && !currentImageBase64) {
    showToast('Please upload a photo of your homework!'); return;
  }

  // Reset conversation for new question
  conversationHistory = [];

  setLoading(true);

  try {
    let userContent;

    if (currentMode === 'photo' && currentImageBase64) {
      userContent = [
        {
          type: 'image',
          source: { type: 'base64', media_type: currentImageType, data: currentImageBase64 }
        },
        {
          type: 'text',
          text: photoNote
            ? `Please look at this homework photo and help me understand it. Additional context: ${photoNote}`
            : `Please look at this homework photo and explain how to solve/answer this question step by step.`
        }
      ];
    } else {
      userContent = questionText;
    }

    conversationHistory.push({ role: 'user', content: userContent });

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
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: userContent }
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
    const answer = data.choices && data.choices[0]?.message?.content?.trim();
    if (!answer) throw new Error("Empty response from AI");

    conversationHistory.push({ role: 'assistant', content: answer });
    lastAnswer = answer;

    displayAnswer(answer, questionText || 'Homework photo');
    checkStreak();

  } catch (err) {
    showToast('Connection error. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
}

// ====== FOLLOW-UP ======
async function askFollowup() {
  const input = document.getElementById('followupInput');
  const followup = input.value.trim();
  if (!followup) { showToast('Type your follow-up question!'); return; }
  if (conversationHistory.length === 0) { showToast('Please ask a main question first!'); return; }

  input.value = '';
  setLoading(true);

  conversationHistory.push({ role: 'user', content: followup });

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
        messages: conversationHistory,
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
        temperature: 0.6
      })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices && data.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error("Empty response from AI");
    conversationHistory.push({ role: 'assistant', content: raw });
    lastAnswer = raw;

    document.getElementById('answerBody').textContent = raw;
    showToast('Follow-up answered!');

  } catch (err) {
    showToast('Connection error. Please try again.');
    console.error(err);
  } finally {
    setLoading(false);
  }
}

// ====== DISPLAY ANSWER ======
function displayAnswer(answer, question) {
  const subjectBadge = document.getElementById('answerSubjectBadge');
  const subjectColors = {
    'Maths': 'badge-maths',
    'Science': 'badge-science',
    'English': 'badge-english',
    'Social Science': 'badge-social'
  };
  subjectBadge.textContent = currentSubject;
  subjectBadge.className = `answer-subject-badge ${subjectColors[currentSubject] || ''}`;
  document.getElementById('answerClassBadge').textContent = `Class ${currentClass}`;
  document.getElementById('answerBody').textContent = answer;

  document.getElementById('answerSection').classList.remove('hidden');
  document.getElementById('answerSection').scrollIntoView({ behavior: 'smooth', block: 'start' });

  updateSuggestions();
  document.getElementById('followupInput').value = '';

  // Store question for saving
  window._lastQuestion = question;
}

// ====== SUGGESTIONS ======
const subjectSuggestions = {
  'Maths': [
    'Explain with a different example',
    'What formula is used here?',
    'Show me a shortcut method',
    'What are common mistakes to avoid?'
  ],
  'Science': [
    'Give me a real-life example',
    'Draw me a diagram description',
    'Explain the chemical equation',
    'How is this asked in board exams?'
  ],
  'English': [
    'Check my grammar',
    'Help me write this as an essay',
    'What are the key literary devices?',
    'Give me a model answer'
  ],
  'Social Science': [
    'Give me key dates and facts',
    'What are causes and effects?',
    'How is this related to today?',
    'Give a 5-point summary'
  ]
};

function updateSuggestions() {
  const row = document.getElementById('suggestionsRow');
  const chips = subjectSuggestions[currentSubject] || [];
  row.innerHTML = chips.map(c =>
    `<button class="suggestion-chip" onclick="useSuggestion('${c.replace(/'/g, "\\'")}')">${c}</button>`
  ).join('');
}

function useSuggestion(text) {
  document.getElementById('followupInput').value = text;
  document.getElementById('followupInput').focus();
}

// ====== SAVE / HISTORY ======
function saveSession() {
  if (!lastAnswer) { showToast('Nothing to save yet!'); return; }
  const session = {
    id: Date.now(),
    subject: currentSubject,
    class: currentClass,
    question: window._lastQuestion || 'Question',
    answer: lastAnswer,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };
  sessions.unshift(session);
  if (sessions.length > 30) sessions.pop();
  localStorage.setItem('studybuddy_sessions', JSON.stringify(sessions));
  showToast('Session saved! ✅');
}

function renderHistory() {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');

  if (sessions.length === 0) {
    empty.classList.remove('hidden');
    list.innerHTML = '';
    return;
  }
  empty.classList.add('hidden');

  const colors = { Maths: 'badge-maths', Science: 'badge-science', English: 'badge-english', 'Social Science': 'badge-social' };

  list.innerHTML = sessions.map(s => `
    <div class="history-item" onclick="loadSession(${s.id})">
      <div class="history-top">
        <div class="history-meta">
          <span class="answer-subject-badge ${colors[s.subject] || ''}">${s.subject}</span>
          <span class="answer-class-badge" style="background:var(--primary-light);color:var(--primary);font-size:0.72rem;font-weight:800;padding:0.25rem 0.7rem;border-radius:50px;text-transform:uppercase;letter-spacing:0.07em;">Class ${s.class}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <span class="history-date">${s.date}</span>
          <button class="del-btn" onclick="deleteSession(event,${s.id})">🗑</button>
        </div>
      </div>
      <div class="history-q">${escHtml(s.question)}</div>
      <div class="history-preview">${escHtml(s.answer)}</div>
    </div>
  `).join('');
}

function loadSession(id) {
  const s = sessions.find(x => x.id === id);
  if (!s) return;
  // Set state
  document.querySelectorAll('.subject-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.subject === s.subject);
  });
  document.querySelectorAll('.class-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.class === s.class);
  });
  currentSubject = s.subject;
  currentClass = s.class;
  lastAnswer = s.answer;
  window._lastQuestion = s.question;
  conversationHistory = [
    { role: 'user', content: s.question },
    { role: 'assistant', content: s.answer }
  ];
  displayAnswer(s.answer, s.question);
  showPage('ask');
}

function deleteSession(e, id) {
  e.stopPropagation();
  sessions = sessions.filter(x => x.id !== id);
  localStorage.setItem('studybuddy_sessions', JSON.stringify(sessions));
  renderHistory();
  showToast('Session deleted.');
}

// ====== COPY ======
function copyAnswer() {
  if (!lastAnswer) return;
  navigator.clipboard.writeText(lastAnswer).then(() => showToast('Answer copied! 📋')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = lastAnswer;
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    showToast('Copied!');
  });
}

// ====== LOADING ======
function setLoading(on) {
  const btn = document.getElementById('askBtn');
  btn.querySelector('.btn-label').classList.toggle('hidden', on);
  btn.querySelector('.btn-loading').classList.toggle('hidden', !on);
  btn.disabled = on;
}

// ====== POMODORO ======
let pomoSeconds = 25 * 60;
let pomoInterval = null;
let pomoRunning = false;

function initPomodoro() {
  updatePomoDIsplay();
}

function setPomodoro(minutes) {
  clearInterval(pomoInterval);
  pomoRunning = false;
  pomoSeconds = minutes * 60;
  document.getElementById('pomoBtn').textContent = '▶ Start';
  updatePomoDIsplay();
}

function togglePomodoro() {
  if (pomoRunning) {
    clearInterval(pomoInterval);
    pomoRunning = false;
    document.getElementById('pomoBtn').textContent = '▶ Resume';
  } else {
    pomoRunning = true;
    document.getElementById('pomoBtn').textContent = '⏸ Pause';
    pomoInterval = setInterval(() => {
      pomoSeconds--;
      updatePomoDIsplay();
      if (pomoSeconds <= 0) {
        clearInterval(pomoInterval);
        pomoRunning = false;
        document.getElementById('pomoBtn').textContent = '▶ Start';
        showToast('⏰ Time is up! Take a break.');
        try { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(); } catch(e){}
      }
    }, 1000);
  }
}

function updatePomoDIsplay() {
  const m = String(Math.floor(pomoSeconds / 60)).padStart(2, '0');
  const s = String(pomoSeconds % 60).padStart(2, '0');
  document.getElementById('pomoDisplay').textContent = `${m}:${s}`;
}

// ====== UTILS ======
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
}

// Init suggestions on load
updateSuggestions();
