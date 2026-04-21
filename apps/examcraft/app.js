// ---- TOAST ----
let _toastTimer = null;
function showToast(msg, type = 'info', duration = 4000) {
  const el = document.getElementById('ec-toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.className = `toast-${type} show`;
  _toastTimer = setTimeout(() => { el.classList.remove('show'); }, duration);
}

// ---- STATE ----
let currentLang = 'en';
let currentPaperData = null;
let isPaid = false;
let includeAnswers = false;
let activePlanIdx = 0;
let activeOptionIdx = 0;
let selectedMethod = 'upi';
let hasAnswersForCurrentPaper = false;
const DEMO_PAPER_LIMIT = 2;
const DEMO_MAX_QUESTIONS = 20;
const DEMO_VISIBLE_QUESTIONS = 3;

// ---- IMAGE UPLOAD STATE ----
let inputMode = 'type'; // 'type' | 'image'
let uploadedImages = []; // [{ data: string, mediaType: string, name: string }]

function setInputMode(mode) {
  inputMode = mode;
  const typeBtn = document.getElementById('imt-type');
  const imageBtn = document.getElementById('imt-image');
  const topicBoard = document.getElementById('fieldBoard');
  const topicClassSubj = document.getElementById('fieldClassSubj');
  const topicChapters = document.getElementById('fieldChapters');
  const imageSection = document.getElementById('imageInputSection');
  const genBtnText = document.getElementById('genBtnText');

  if (mode === 'image') {
    typeBtn?.classList.remove('active');
    imageBtn?.classList.add('active');
    if (topicBoard) topicBoard.style.display = 'none';
    if (topicClassSubj) topicClassSubj.style.display = 'none';
    if (topicChapters) topicChapters.style.display = 'none';
    imageSection?.classList.remove('hidden');
    if (genBtnText) {
      genBtnText.textContent = '📷 Generate from Images';
      genBtnText.setAttribute('data-en', '📷 Generate from Images');
      genBtnText.setAttribute('data-hi', '📷 इमेज से प्रश्नपत्र बनाएं');
      genBtnText.setAttribute('data-as', '📷 ছবিৰ পৰা প্ৰশ্নপত্ৰ তৈয়াৰ কৰক');
    }
  } else {
    imageBtn?.classList.remove('active');
    typeBtn?.classList.add('active');
    if (topicBoard) topicBoard.style.display = '';
    if (topicClassSubj) topicClassSubj.style.display = '';
    if (topicChapters) topicChapters.style.display = '';
    imageSection?.classList.add('hidden');
    if (genBtnText) {
      genBtnText.setAttribute('data-en', '✦ Generate Question Paper');
      genBtnText.setAttribute('data-hi', '✦ प्रश्नपत्र बनाएं');
      genBtnText.setAttribute('data-as', '✦ প্ৰশ্নপত্ৰ তৈয়াৰ কৰক');
      const txt = genBtnText.getAttribute(`data-${currentLang}`) || '✦ Generate Question Paper';
      genBtnText.textContent = txt;
    }
  }
}

function handleImageDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('imageDropZone')?.classList.add('drag-over');
}

function handleImageDragLeave(e) {
  e.preventDefault();
  document.getElementById('imageDropZone')?.classList.remove('drag-over');
}

function handleImageDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('imageDropZone')?.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer?.files || []);
  addImageFiles(files);
}

function handleImageFileSelect(e) {
  const files = Array.from(e.target.files || []);
  addImageFiles(files);
  e.target.value = '';
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addImageFiles(files) {
  const MAX_IMAGES = 10;
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  for (const file of files) {
    if (uploadedImages.length >= MAX_IMAGES) {
      showToast(`Maximum ${MAX_IMAGES} images allowed.`, 'warn');
      break;
    }
    if (!allowed.includes(file.type)) {
      showToast(`${file.name}: Only JPEG, PNG, WebP images supported.`, 'warn');
      continue;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(`${file.name}: Too large (max 5 MB per image).`, 'warn');
      continue;
    }
    const base64 = await fileToBase64(file);
    uploadedImages.push({ data: base64, mediaType: file.type, name: file.name });
  }
  renderImageThumbnails();
}

function removeImage(idx) {
  uploadedImages.splice(idx, 1);
  renderImageThumbnails();
}

function renderImageThumbnails() {
  const container = document.getElementById('imageThumbnails');
  if (!container) return;
  if (uploadedImages.length === 0) { container.innerHTML = ''; return; }
  container.innerHTML = uploadedImages.map((img, idx) => `
    <div class="thumb-item">
      <img src="data:${img.mediaType};base64,${img.data}" alt="Page ${idx + 1}" class="thumb-img" />
      <button class="thumb-remove" onclick="removeImage(${idx})" title="Remove">✕</button>
      <span class="thumb-label">Page ${idx + 1}</span>
    </div>
  `).join('');
}

// Check if user has an active paid plan (for blurring logic)
function userHasPaidPlan() {
  const ud = window.currentUserData;
  if (!ud) return false;
  // User has a plan if they have purchased one (plan is set)
  const hasPlan = !!ud.plan;
  const isUnlimited = ud.papersTotal === 9999;
  const hasRemaining = (ud.papersRemaining || 0) > 0;
  return hasPlan && (isUnlimited || hasRemaining || ud.papersUsed > 0);
}

// Check if user's plan includes answers
function userPlanIncludesAnswers() {
  const ud = window.currentUserData;
  if (!ud) return false;
  return ud.includesAnswers === true;
}

// ---- PLANS DATA (mirroring payment-system.jsx) ----
const PLANS = [
  {
    id: 'individual', icon: '👤', label: 'Individual Teacher', tagline: 'Pay per paper, no commitment', color: '#E85D26',
    options: [
      { label: 'Single Paper',         papers: 1,   qOnly: 19,   qAndA: 30,   tagQ: null,                 tagQA: null },
      { label: '5 Papers Pack',        papers: 5,   qOnly: 79,   qAndA: 124,  tagQ: 'Save ₹16',           tagQA: 'Save ₹26' },
      { label: '15 Papers Pack',       papers: 15,  qOnly: 199,  qAndA: 314,  tagQ: 'Most Popular',       tagQA: 'Best Deal' },
    ]
  },
  // Answer Key Upgrade option (shown only to users who already bought a paper)
  {
    id: 'answerUpgrade', icon: '🔑', label: 'Answer Key Upgrade', tagline: 'Already bought a paper? Unlock answers only', color: '#059669',
    options: [
      { label: 'Unlock Answers',    papers: 1,   qOnly: 11,   qAndA: 11,   tagQ: 'Already paid ₹19',   tagQA: 'Just ₹11 extra' },
    ]
  },
  {
    id: 'group', icon: '👥', label: 'Group / Coaching', tagline: 'For coaching centers & study groups', color: '#2563EB',
    options: [
      { label: '20 Papers Pack',  papers: 20,  qOnly: 299,  qAndA: 479,  tagQ: '₹14.95/paper', tagQA: '₹23.95/paper' },
      { label: '50 Papers Pack',  papers: 50,  qOnly: 599,  qAndA: 929,  tagQ: '₹11.98/paper', tagQA: '₹18.58/paper' },
      { label: '100 Papers Pack', papers: 100, qOnly: 999,  qAndA: 1499, tagQ: 'Best Value',    tagQA: 'Best Value' },
    ]
  },
  {
    id: 'school', icon: '🏫', label: 'School / Institute', tagline: 'Bulk paper credits for institutions', color: '#059669',
    options: [
      { label: '100 Papers Pack',   papers: 100,  qOnly: 799,  qAndA: 999,  tagQ: 'School Starter', tagQA: 'School Starter' },
      { label: '350 Papers Pack',   papers: 350,  qOnly: 2499, qAndA: 3199, tagQ: 'Most Popular',   tagQA: 'Best Value' },
      { label: '1000 Papers Pack',  papers: 1000, qOnly: 5999, qAndA: 7499, tagQ: 'Institution Max', tagQA: 'Institution Max' },
    ]
  }
];

// ---- TAB SWITCHING ----
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tab-' + tab);
  if (btn) btn.classList.add('active');

  if (tab === 'preview') {
    document.getElementById('view-preview').classList.remove('hidden');
    document.getElementById('view-pricing').classList.add('hidden');
  } else {
    document.getElementById('view-preview').classList.add('hidden');
    document.getElementById('view-pricing').classList.remove('hidden');
    renderOptionsGrid();
  }
}

// ---- PLAN TYPE SELECTOR ----
function selectPlanType(idx) {
  activePlanIdx = idx;
  activeOptionIdx = 0;
  
  // 4 plan tabs: 0=Individual, 1=AnswerKey, 2=Group, 3=School
  const planIds = ['pt-individual', 'pt-answerkey', 'pt-group', 'pt-school'];
  planIds.forEach((id, i) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (i === idx) {
      btn.classList.add('active');
      btn.style.background = PLANS[i].color;
      btn.style.borderColor = PLANS[i].color;
      btn.style.color = '#fff';
    } else {
      btn.classList.remove('active');
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }
  });

  // Hide the step note on the answer upgrade tab because that tab is already step 2.
  const toggleGroup = document.querySelector('.toggle-switch-group');
  if (toggleGroup) {
    toggleGroup.style.display = (idx === 1) ? 'none' : 'flex';
  }

  renderOptionsGrid();
}

// Check if user qualifies for Answer Key Upgrade (already bought a paper without answers)
function userHasQualifyingPaper() {
  const ud = window.currentUserData;
  if (!ud) return false;
  // User must have bought at least 1 paper AND not have answers AND have a generated paper
  return ud.papersUsed >= 1 && 
         ud.papersTotal >= 1 && 
         !ud.includesAnswers &&
         currentPaperData !== null;
}

// Check if user qualifies for Answer Key Upgrade (has a generated question paper)
function canUseAnswerKeyUpgrade() {
  return currentPaperData !== null && canUserExport();
}

// ---- ANSWER KEY TOGGLE ----
function setIncludeAnswers(val) {
  includeAnswers = val;
  const qBtn  = document.getElementById('toggle-q-only');
  const qaBtn = document.getElementById('toggle-q-ans');
  if (qBtn)  { qBtn.classList.toggle('active-q',  !val); }
  if (qaBtn) { qaBtn.classList.toggle('active-qa',  val); }
  renderOptionsGrid();
}

// ---- RENDER OPTIONS GRID ----
function renderOptionsGrid() {
  const plan = PLANS[activePlanIdx];
  const iconEl = document.getElementById('plan-hd-icon');
  const nameEl = document.getElementById('plan-hd-name');
  const tagEl  = document.getElementById('plan-hd-tagline');
  const pBox   = document.getElementById('planOptionsBox');
  
  if (iconEl) iconEl.textContent = plan.icon;
  if (nameEl) nameEl.textContent = plan.label;
  if (tagEl)  tagEl.textContent  = plan.tagline;
  if (pBox)   pBox.style.borderColor = plan.color + '55';

  const grid = document.getElementById('optionsGrid');
  if (!grid) return;

  grid.innerHTML = plan.options.map((opt, i) => {
    const isBundle = plan.id !== 'answerUpgrade' && includeAnswers;
    const price = plan.id === 'answerUpgrade' ? opt.qOnly : (isBundle ? opt.qAndA : opt.qOnly);
    const tag   = plan.id === 'answerUpgrade' ? opt.tagQ : (isBundle ? opt.tagQA : opt.tagQ);
    const papers = typeof opt.papers === 'number'
      ? `${opt.papers} paper${opt.papers > 1 ? 's' : ''}${isBundle ? ' + answers' : ''}`
      : (isBundle ? 'Pack + answers' : 'Question paper pack');
    const selected = i === activeOptionIdx;
    return `
      <div class="option-card ${selected ? 'selected' : ''}"
           style="${selected ? `border-color:${plan.color};background:${plan.color}0c` : ''}"
           onclick="selectOption(${i})">
        ${tag ? `<div class="option-card-tag" style="background:${plan.color}">${tag}</div>` : ''}
        <div class="option-card-label">${opt.label}</div>
        <div class="option-card-price" style="color:${plan.color}">₹${price}</div>
        <div class="option-card-sub">${papers}</div>
      </div>`;
  }).join('');

  // Per-paper breakdown
  const opt = plan.options[activeOptionIdx];
  const bd  = document.getElementById('planBreakdown');
  if (bd) {
    if (plan.id === 'answerUpgrade') {
  const hasUnlockedPaper = canUseAnswerKeyUpgrade();
  
  const noticeBox = `
    <div style="padding:12px; background:#fffbeb; border:1px solid #fbbf24; border-radius:8px; margin-bottom:8px;">
      <div style="display:flex; gap:8px; align-items:flex-start;">
        <span style="font-size:1.2rem;">💡</span>
        <div style="font-size:0.82rem; color:#92400e; line-height:1.4;">
          <strong>Answer Key Service — Who Can Use:</strong><br/>
          ✅ You must <b>generate a question paper first</b> using the Generator tab.<br/>
          ✅ You must <b>unlock that question paper first</b> from the Question Paper plan.<br/>
          ❌ You cannot pay only <b>₹11</b> and get both questions + answers together.<br/>
          ${hasUnlockedPaper
            ? '<span style="color:#059669; font-weight:600;">✅ This paper is already unlocked. You can now add the answer key.</span>'
            : '<span style="color:#dc2626; font-weight:600;">⚠️ Unlock the question paper first with the ₹19 plan, then come back here.</span>'}
        </div>
      </div>
    </div>`;

  bd.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${noticeBox}
      <div style="display:flex; align-items:center; gap:12px; padding:12px; background:#f0fdf4; border:1px solid #86efac; border-radius:8px;">
        <span style="font-size:1.1rem; font-weight:800; color:#059669;">₹11</span>
        <span style="font-size:0.8rem; color:#64748b;">(+ ~₹2 GST) = ~₹13 total</span>
      </div>
      <span style="font-size:0.78rem; color:#059669; font-weight:600;">💡 Step 2 only: add answers after the question paper is already visible.</span>
    </div>`;
    } else {
      const qp = opt.qOnly;
      const qap = opt.qAndA;
      const ppq = typeof opt.papers === 'number' && opt.papers > 1 ? ` (₹${(qp/opt.papers).toFixed(2)}/paper)` : '';
      const ppqa = typeof opt.papers === 'number' && opt.papers > 1 ? ` (₹${(qap/opt.papers).toFixed(2)}/paper)` : '';
      if (includeAnswers) {
        bd.innerHTML = `
          <span>📄+🔑 This pack includes both question papers and answer keys for each paper you generate.</span>
          <span>✅ Pack price: <b style="color:#059669">₹${qap}</b>${ppqa}</span>
          <span>📊 Each generation will consume one paper credit and usage will be tracked on the dashboard.</span>`;
      } else {
        bd.innerHTML = `
          <span>📄 Question paper pack price: <b style="color:#E85D26">₹${qp}</b>${ppq}</span>
          <span>🔑 If you want answers later for a generated paper, use the Answer Key tab for <b style="color:#059669">₹11</b> per paper.</span>
          <span>📊 Each generation will consume one paper credit and usage will be tracked on the dashboard.</span>`;
      }
    }

    if (plan.id !== 'answerUpgrade' && !includeAnswers) {
      bd.innerHTML += `<div class="plan-warning" style="margin-top:12px; padding:10px 12px; background:#fef3c7; border:1px solid #fbbf24; border-radius:8px; font-size:0.78rem; color:#92400e;">
        ⚠️ <strong>Important:</strong> This payment unlocks only question-paper generation. To see answers for a generated paper later, unlock that paper first and then use the <b>Answer Key</b> tab for the separate ₹11 step.
      </div>`;
    }
  }

  // Update Pay button
  let price, total;
  if (plan.id === 'answerUpgrade') {
    price = 11;
    total = price + Math.round(price * 0.18);
  } else {
    price = includeAnswers ? opt.qAndA : opt.qOnly;
    total = price + Math.round(price * 0.18);
  }
  const payBtn = document.getElementById('planPayBtn');
  if (payBtn) {
    const canUpgrade = plan.id !== 'answerUpgrade' || canUseAnswerKeyUpgrade();
    payBtn.textContent = plan.id === 'answerUpgrade'
      ? (canUpgrade ? `Pay ₹${total} & Unlock Answers →` : 'Unlock Question Paper First')
      : (includeAnswers ? `Pay ₹${total} & Unlock Questions + Answers →` : `Pay ₹${total} & Unlock Questions →`);
    payBtn.style.background = plan.color;
    payBtn.disabled = !canUpgrade;
    payBtn.style.opacity = canUpgrade ? '1' : '0.55';
    payBtn.style.cursor = canUpgrade ? 'pointer' : 'not-allowed';
  }
}

function selectOption(idx) {
  activeOptionIdx = idx;
  renderOptionsGrid();
}

// ---- PAYMENT METHOD SELECTOR ----
function selectMethod(method) {
  selectedMethod = method;
  ['upi','card','net'].forEach(m => {
    const el = document.getElementById('pm-' + m);
    const chk = document.getElementById('chk-' + m);
    if (el)  el.classList.toggle('selected', m === method);
    if (chk) chk.style.display = m === method ? 'block' : 'none';
    if (el && m === method) {
      el.style.borderColor = PLANS[activePlanIdx].color;
      el.style.background = PLANS[activePlanIdx].color + '10';
    } else if (el) {
      el.style.borderColor = '';
      el.style.background = '';
    }
  });
}

// ---- INITIATE PAYMENT ----
function initiatePayment() {
  // Check if user is logged in
  if (!window.auth || !window.auth.currentUser) {
    showToast("Please sign in first to purchase a plan.", 'warn');
    openAuthModal('login');
    return;
  }

  const plan = PLANS[activePlanIdx];
  const opt  = plan.options[activeOptionIdx];
  const isUpgrade = plan.id === 'answerUpgrade';

  if (isUpgrade && !canUseAnswerKeyUpgrade()) {
    showToast("Unlock the question paper first with the ₹19 plan. Then return here and pay ₹11 for answers.", 'info');
    openQuestionPaperPricing();
    return;
  }

  const base = isUpgrade ? 11 : (includeAnswers ? opt.qAndA : opt.qOnly);
  const ansAddon = isUpgrade ? 0 : Math.max(0, opt.qAndA - opt.qOnly);
  const gst  = Math.round(base * 0.18);
  const total = base + gst;

  // Modal details
  document.getElementById('pay-title').textContent = opt.label;
  document.getElementById('pay-sub').textContent   = plan.label;
  document.getElementById('pay-bk-base').textContent = `₹${base}`;
  document.getElementById('pay-bk-gst').textContent  = `₹${gst}`;
  document.getElementById('pay-bk-total').textContent = `₹${total}`;
  document.getElementById('pay-confirm-btn').textContent = `Pay ₹${total} →`;
  document.getElementById('pay-confirm-btn').style.background = plan.color;

  const ansRow    = document.getElementById('pay-bk-ans-row');
  const badgeAns  = document.getElementById('pay-badge-ans');
  const badgeNo   = document.getElementById('pay-badge-no');
  if (isUpgrade) {
    ansRow.classList.add('hidden');
    badgeAns.classList.remove('hidden');
    badgeNo.classList.add('hidden');
  } else if (includeAnswers) {
    document.getElementById('pay-bk-ans').textContent = `+₹${ansAddon}`;
    ansRow.classList.remove('hidden');
    badgeAns.classList.remove('hidden');
    badgeNo.classList.add('hidden');
  } else {
    ansRow.classList.add('hidden');
    badgeAns.classList.add('hidden');
    badgeNo.classList.remove('hidden');
  }

  // Steps
  document.getElementById('pay-step-confirm').classList.add('active');
  document.getElementById('pay-step-proc').classList.remove('active');
  document.getElementById('pay-step-success').classList.remove('active');
  selectMethod('upi');

  // Show warning badge if Q-only is selected
  const payBadgeNo = document.getElementById('pay-badge-no');
  if (isUpgrade && payBadgeNo) {
    payBadgeNo.innerHTML = 'Question already unlocked';
    payBadgeNo.style.background = '';
    payBadgeNo.style.color = '';
  } else if (includeAnswers && payBadgeNo) {
    payBadgeNo.innerHTML = 'Answers included in this pack';
    payBadgeNo.style.background = '#dcfce7';
    payBadgeNo.style.color = '#166534';
  } else if (payBadgeNo) {
    payBadgeNo.innerHTML = 'Answers sold separately';
    payBadgeNo.style.background = '#fef3c7';
    payBadgeNo.style.color = '#92400e';
  }

  document.getElementById('payModal').classList.remove('hidden');
  document.getElementById('payModal').classList.add('open');
}

function confirmPayment() {
  document.getElementById('pay-step-confirm').classList.remove('active');
  document.getElementById('pay-step-proc').classList.add('active');

  setTimeout(async () => {
    document.getElementById('pay-step-proc').classList.remove('active');
    document.getElementById('pay-step-success').classList.add('active');

    const plan = PLANS[activePlanIdx];
    const opt  = plan.options[activeOptionIdx];

    // Handle Answer Key Upgrade
    if (plan.id === 'answerUpgrade') {
      document.getElementById('pay-success-msg').textContent =
        '✅ Answer Key unlocked! You can now view and download complete solutions for your paper.';
      hasAnswersForCurrentPaper = true;
      includeAnswers = true;
      isPaid = true;
      // Refresh to show answers and scroll to answer key section
      if (currentPaperData) {
        renderPaper(currentPaperData);
        updateAnswerKeyBar();
        // Scroll to answer key section after a short delay to allow re-render
        setTimeout(() => {
          const answerKeySection = document.querySelector('.paper-marking-scheme');
          if (answerKeySection) {
            answerKeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } else {
        updateAnswerKeyBar();
      }
      return;
    }

    // Regular plan purchase
    const papers = typeof opt.papers === 'number' ? `${opt.papers} papers` : 'Unlimited';
    document.getElementById('pay-success-msg').textContent =
      includeAnswers
        ? `${papers} with answer access unlocked successfully. Credits will now reflect in your dashboard.`
        : `${papers} unlocked successfully. Your current paper is now fully visible.`;

    // New plan purchase
    isPaid = true;
    if (window.auth?.currentUser && typeof applyPlanToUser === 'function') {
      await applyPlanToUser({
        planId:         plan.id,
        optionLabel:    `${opt.label}${includeAnswers ? ' + Answers' : ' (Question Only)'}`,
        papers:         opt.papers,
        includesAnswers: includeAnswers
      });
    }
    if (includeAnswers) {
      hasAnswersForCurrentPaper = true;
    }
  }, 2000);
}

function closePaymentModal() {
  document.getElementById('payModal').classList.add('hidden');
  // Refresh user data from Firestore
  if (window.auth?.currentUser) {
    loadOrCreateUser(window.auth.currentUser).then(() => {
      if (currentPaperData) renderPaper(currentPaperData);
      switchTab('preview');
    });
  } else {
    switchTab('preview');
  }
}

// ---- CREDITS EXHAUSTED MODAL ----
function showCreditsExhaustedModal() {
  const ud = window.currentUserData;
  if (!ud) return;

  const planLabel = ud.planLabel || 'Your Plan';
  const used = ud.papersUsed || 0;
  const total = ud.papersTotal || 0;

  const confirmPurchase = confirm(
    `📄 Credits Exhausted!\n\n` +
    `You've used all ${total} papers from "${planLabel}".\n` +
    `Used: ${used} / ${total}\n\n` +
    `Would you like to purchase a new plan to continue generating papers?`
  );

  if (confirmPurchase) {
    switchTab('pricing');
  }
}

function showDemoExhaustedModal() {
  const used = window.currentUserData?.demoUsed || 0;
  const confirmPurchase = confirm(
    `Free demo limit reached.\n\n` +
    `You have already used ${used} of ${DEMO_PAPER_LIMIT} free demo papers.\n\n` +
    `Would you like to view plans and continue with a paid option?`
  );

  if (confirmPurchase) {
    showOutput('result');
    switchTab('pricing');
    selectPlanType(0);
  }
}

// ---- TRANSLATIONS ----
const T = {
  en: {
    generating: "Generating your question paper…",
    genBtn: "✦ Generate Question Paper",
    fillRequired: "Please select: Board, Class, Subject and Chapters.",
    apiKeyMissing: "Local development requires a Groq API key before generating papers.",
    errorParsing: "Could not parse AI response. Please try again.",
    errorNetwork: "Network error. Please check your API key and retry.",
    answerKey: "MARKING SCHEME / ANSWER KEY",
    questPaper: "QUESTION PAPER",
    classLabel: "Class:",
    subjectLabel: "Subject:",
    timeLabel: "Time:",
    marksLabel: "Max. Marks:",
    genInstructions: "All questions are compulsory unless stated. Write legibly.",
    mins: "mins",
    marks: "Marks",
  },
  hi: {
    generating: "प्रश्नपत्र बन रहा है…",
    genBtn: "✦ प्रश्नपत्र बनाएं",
    fillRequired: "कृपया चुनें: बोर्ड, कक्षा, विषय और कम से कम एक अध्याय।",
    apiKeyMissing: "लोकल डेवलपमेंट में प्रश्नपत्र बनाने से पहले Groq API Key आवश्यक है।",
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
  },
  as: {
    generating: "প্ৰশ্নপত্ৰ তৈয়াৰ হৈ আছে…",
    genBtn: "✦ প্ৰশ্নপত্ৰ তৈয়াৰ কৰক",
    fillRequired: "অনুগ্ৰহ কৰি বাছক: ব'ৰ্ড, শ্ৰেণী, বিষয় আৰু অতি কমেও এটা অধ্যায়।",
    apiKeyMissing: "লোকেল ডেভেলপমেন্টত প্ৰশ্নপত্ৰ তৈয়াৰ কৰাৰ আগতে Groq API Key লাগিব।",
    errorParsing: "AI উত্তৰ পাৰ্ছ কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি পুনৰায় চেষ্টা কৰক।",
    errorNetwork: "নেটৱাৰ্ক ত্ৰুটি। আপোনাৰ API Key পৰীক্ষা কৰক।",
    answerKey: "উত্তৰ কুঁচি / নম্বৰ আঁচনি",
    questPaper: "প্ৰশ্নপত্ৰ",
    classLabel: "শ্ৰেণী:",
    subjectLabel: "বিষয়:",
    timeLabel: "সময়:",
    marksLabel: "সৰ্বোচ্চ নম্বৰ:",
    genInstructions: "নিৰ্দেশ নথকালৈকে সকলো প্ৰশ্ন বাধ্যতামূলক। স্পষ্টকৈ লিখক।",
    mins: "মিনিট",
    marks: "নম্বৰ",
  }
};

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + lang).classList.add('active');

  // Update static elements
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        // skip
    } else {
        el.textContent = txt;
    }
  });

  // Refresh dynamic syllabus UI if already selected
  const board = document.getElementById('boardSelect').value;
  if (board) {
    // We don't want to clear EVERYTHING, just refresh the labels
    refreshDropdownLabels();
  }
}

// New helper to refresh labels without losing selection
function refreshDropdownLabels() {
  const board = document.getElementById('boardSelect').value;
  const cls = document.getElementById('classSelect').value;
  const subject = document.getElementById('subjectSelect').value;

  if (!board || !window.SYLLABUS_DATA[board]) return;

  // Refresh Class dropdown labels
  const classSelect = document.getElementById('classSelect');
  const classes = window.SYLLABUS_DATA[board].classes;
  for (let i = 1; i < classSelect.options.length; i++) {
    const opt = classSelect.options[i];
    const val = opt.value;
    if (classes[val]) {
      opt.textContent = classes[val].names?.[currentLang] || val;
    }
  }

  // Refresh Subject dropdown labels
  if (cls && window.SYLLABUS_DATA[board].classes[cls]) {
    const subjectSelect = document.getElementById('subjectSelect');
    const subjects = window.SYLLABUS_DATA[board].classes[cls].subjects;
    for (let i = 1; i < subjectSelect.options.length; i++) {
      const opt = subjectSelect.options[i];
      const val = opt.value;
      if (subjects[val]) {
        opt.textContent = subjects[val].names?.[currentLang] || val;
      }
    }
  }

  // Refresh Chapters
  if (subject) {
    onSubjectChange({ preserveSelection: true });
  }
}

// Can user export/download papers?
function canUserExport() {
  return isPaid || userHasPaidPlan();
}

// ---- HELPERS ----
function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(e => e.value);
}
function getDifficulty() {
  const el = document.querySelector('input[name="difficulty"]:checked');
  return el ? el.value : 'Medium';
}

function getSubjectContext(board, cls, subject) {
  const subjectData = window.SYLLABUS_DATA?.[board]?.classes?.[cls]?.subjects?.[subject];
  const classData = window.SYLLABUS_DATA?.[board]?.classes?.[cls];

  return {
    subjectData,
    subjectName: subjectData?.names?.[currentLang] || subject,
    canonicalSubjectName: subjectData?.names?.en || subject,
    className: classData?.names?.[currentLang] || cls,
    canonicalClassName: classData?.names?.en || cls
  };
}

function getSelectedChapterContext(board, cls, subject, selectedChapters) {
  const chapters = window.SYLLABUS_DATA?.[board]?.classes?.[cls]?.subjects?.[subject]?.chapters || [];
  const selectedSet = new Set(selectedChapters);

  return chapters
    .map((chapter, index) => {
      const canonicalName = chapter.names?.en || chapter.name || `Chapter ${index + 1}`;
      return {
        index: index + 1,
        canonicalName,
        displayName: chapter.names?.[currentLang] || canonicalName
      };
    })
    .filter((chapter) => selectedSet.has(chapter.canonicalName));
}

function getRequestedQuestionTypeDescriptors(qtypes) {
  const labels = {
    MCQ: 'Multiple Choice Questions',
    ShortAnswer: 'Short Answer Questions',
    LongAnswer: 'Long Answer Questions'
  };

  return qtypes.map((type, index) => {
    const sectionLetter = String.fromCharCode(65 + index);
    return {
      type,
      title: `Section ${sectionLetter} - ${labels[type] || type}`,
      marksHint: type === 'MCQ' ? '1 mark each' : type === 'ShortAnswer' ? '2-4 marks each' : '4-8 marks each'
    };
  });
}

function estimateGenerationMaxTokens(totalQ, wantsAnswers, configuredMaxTokens, nonLatinScript) {
  // MCQ needs ~60 tokens (question + 4 options + answer); Short/Long Answer needs ~100-150
  // Use 100 as a balanced per-question estimate with answers
  const perQTokens = wantsAnswers ? 100 : 70;
  const estimated = 300 + (totalQ * perQTokens);
  // Non-Latin scripts (Assamese, Hindi) use ~3x more tokens per character
  const scriptMultiplier = nonLatinScript ? 3 : 1;
  // Groq llama-3.3-70b supports up to 8192 output tokens
  // Allow full model capacity for non-Latin to prevent truncation
  const modelMax = nonLatinScript ? 8000 : Math.max(1200, configuredMaxTokens || 4000);
  return Math.min(modelMax, Math.max(1400, estimated * scriptMultiplier));
}

function buildPaperPrompt({
  board,
  cls,
  subject,
  selectedChapters,
  totalQ,
  totalMarks,
  timeLimit,
  difficulty,
  qtypes,
  extraInstr,
  boardTemplate,
  subjectLanguageInstruction,
  isAssamese
}) {
  const { canonicalSubjectName, canonicalClassName } = getSubjectContext(board, cls, subject);
  const chapterContext = getSelectedChapterContext(board, cls, subject, selectedChapters);
  const requestedSections = getRequestedQuestionTypeDescriptors(qtypes);

  const chapterList = chapterContext.length
    ? chapterContext.map((chapter) => `- ${chapter.canonicalName}`).join('\n')
    : selectedChapters.map((chapter) => `- ${chapter}`).join('\n');

  const sectionRules = requestedSections.map((section) => (
    `- type: "${section.type}", title: "${section.title}", typical marks: ${section.marksHint}`
  )).join('\n');

  const assameseReminder = isAssamese
    ? `\n\nFINAL REMINDER — LANGUAGE CHECK BEFORE OUTPUT: Every single word in your JSON output (questions, options, answers, titles) MUST be in pure Assamese (অসমীয়া). Use ৰ (U+09F0) not র (U+09B0) for the "ra" character. Do NOT use Bengali words. Do NOT use English words. A fluent Assamese reader must find zero foreign words.`
    : '';

  return `${subjectLanguageInstruction}

${boardTemplate}
TASK: Create a school question paper as JSON.

SELECTION:
- Board: ${board} | Class: ${canonicalClassName} | Subject: ${canonicalSubjectName} | Difficulty: ${difficulty}
- Total Questions: exactly ${totalQ} | Total Marks: exactly ${totalMarks} | Time: ${timeLimit} mins
- Question Types: ${qtypes.join(', ')}
- Extra Instructions: ${extraInstr || 'All questions are compulsory.'}

ALLOWED CHAPTERS (use ONLY these, "chapter" field must match exactly):
${chapterList}

SECTIONS REQUIRED:
${sectionRules}

JSON SHAPE:
{"sections":[{"type":"MCQ|ShortAnswer|LongAnswer","title":"Section title","questions":[{"qno":1,"chapter":"exact chapter name","text":"question text","options":["(a)...","(b)...","(c)...","(d)..."],"answer":"correct answer","marks":1}]}]}

Rules: every question needs qno, chapter, text, answer, marks. MCQ must have exactly 4 options. ShortAnswer/LongAnswer omit options. Output JSON only.${assameseReminder}`;
}

/**
 * Post-processor for Assamese AI output.
 * 1. Fixes character-level errors: Bengali র → Assamese ৰ (except in conjuncts)
 * 2. Fixes word-level Bengali contamination with an Assamese dictionary.
 *    Words are matched as whole tokens (word boundaries) to avoid partial replacements.
 */
function fixAssameseScript(text) {
  if (!text) return text;

  // ── Step 1: Character fix ──────────────────────────────────────────────────
  // Bengali র (U+09B0) → Assamese ৰ (U+09F0) except before ্ (virama conjunct)
  let out = text.replace(/র(?!্)/g, 'ৰ');

  // ── Step 2: Bengali → Assamese word dictionary ────────────────────────────
  // Ordered longest-first so multi-word phrases match before single words.
  // Format: [bengali_pattern, assamese_replacement]
  // Use regex with word boundaries (\b doesn't work for Indic; we use zero-width
  // checks against Indic letter ranges U+0980–U+09FF instead).
  const B = '\u0980-\u09FF'; // Bengali/Assamese Unicode block
  function wb(word) {
    // Whole-word match: not preceded/followed by another Indic letter
    return new RegExp(`(?<![${B}])${word}(?![${B}])`, 'g');
  }

  const dict = [
    // ════════════════════════════════════════════════════════════════════════
    // MULTI-WORD PHRASES (must come before single-word entries)
    // ════════════════════════════════════════════════════════════════════════
    [wb('কাছ থেকে'),        'ওচৰৰ পৰা'],
    [wb('দেওয়া হলো'),      'দিয়া হ\'ল'],
    [wb('দেওয়া হয়'),      'দিয়া হয়'],
    [wb('দেওয়া আছে'),      'দিয়া আছে'],
    [wb('দেওয়া হবে'),      'দিয়া হ\'ব'],
    [wb('বের কর'),           'উলিওৱা'],
    [wb('বের করো'),          'উলিওৱা'],
    [wb('বের করুন'),         'উলিওৱা'],
    [wb('খুঁজে বের কর'),    'বিচাৰি উলিওৱা'],
    [wb('খুঁজে বের করো'),   'বিচাৰি উলিওৱা'],
    [wb('বলে মনে কর'),      'বুলি ধৰা'],
    [wb('ধরা যাক'),          'ধৰা যাওক'],
    [wb('মনে কর'),           'ধৰা'],
    [wb('মনে করো'),          'ধৰা'],
    [wb('মনে করুন'),         'ধৰক'],
    [wb('প্রমাণ কর'),        'প্ৰমাণ কৰা'],
    [wb('প্রমাণ করো'),       'প্ৰমাণ কৰা'],
    [wb('প্রমাণ করুন'),      'প্ৰমাণ কৰক'],
    [wb('ব্যাখ্যা কর'),      'ব্যাখ্যা কৰা'],
    [wb('ব্যাখ্যা করো'),     'ব্যাখ্যা কৰা'],
    [wb('ব্যাখ্যা করুন'),    'ব্যাখ্যা কৰক'],
    [wb('বর্ণনা কর'),        'বৰ্ণনা কৰা'],
    [wb('বর্ণনা করো'),       'বৰ্ণনা কৰা'],
    [wb('বর্ণনা করুন'),      'বৰ্ণনা কৰক'],
    [wb('আলোচনা কর'),        'আলোচনা কৰা'],
    [wb('আলোচনা করো'),       'আলোচনা কৰা'],
    [wb('আলোচনা করুন'),      'আলোচনা কৰক'],
    [wb('সংজ্ঞা দাও'),       'সংজ্ঞা দিয়া'],
    [wb('সংজ্ঞা দিন'),       'সংজ্ঞা দিয়া'],
    [wb('উদাহরণ দাও'),       'উদাহৰণ দিয়া'],
    [wb('উদাহরণ দিন'),       'উদাহৰণ দিয়া'],
    [wb('পূরণ কর'),          'পূৰণ কৰা'],
    [wb('পূরণ করো'),         'পূৰণ কৰা'],
    [wb('সমাধান কর'),        'সমাধান কৰা'],
    [wb('সমাধান করো'),       'সমাধান কৰা'],
    [wb('সমাধান করুন'),      'সমাধান কৰক'],
    [wb('গণনা কর'),          'গণনা কৰা'],
    [wb('গণনা করো'),         'গণনা কৰা'],
    [wb('গণনা করুন'),        'গণনা কৰক'],
    [wb('নির্ধারণ কর'),      'নিৰ্ধাৰণ কৰা'],
    [wb('নির্ধারণ করো'),     'নিৰ্ধাৰণ কৰা'],
    [wb('নির্ধারণ করুন'),    'নিৰ্ধাৰণ কৰক'],
    [wb('রূপান্তর কর'),      'ৰূপান্তৰ কৰা'],
    [wb('রূপান্তর করো'),     'ৰূপান্তৰ কৰা'],
    [wb('সরল কর'),           'সৰল কৰা'],
    [wb('সরল করো'),          'সৰল কৰা'],
    [wb('চিহ্নিত কর'),       'চিহ্নিত কৰা'],
    [wb('চিহ্নিত করো'),      'চিহ্নিত কৰা'],
    [wb('লিখে দাও'),         'লিখি দিয়া'],
    [wb('লিখে দিন'),         'লিখি দিয়া'],
    [wb('দেখিয়ে দাও'),      'দেখুৱাই দিয়া'],
    [wb('সংক্ষেপে লেখ'),     'চমুকৈ লিখা'],
    [wb('সংক্ষেপে লেখো'),    'চমুকৈ লিখা'],
    [wb('সংক্ষেপে লিখুন'),   'চমুকৈ লিখক'],
    [wb('নিম্নোক্ত'),         'তলত উল্লেখ কৰা'],
    [wb('নিম্নলিখিত'),        'তলত লিখা'],
    [wb('উপরোক্ত'),           'ওপৰত উল্লেখ কৰা'],
    [wb('যেকোনো একটি'),      'যিকোনো এটা'],
    [wb('যেকোনো দুটি'),      'যিকোনো দুটা'],
    [wb('যেকোনো তিনটি'),     'যিকোনো তিনটা'],
    [wb('যেকোনো পাঁচটি'),    'যিকোনো পাঁচটা'],
    [wb('যেকোনো'),            'যিকোনো'],
    [wb('প্রতিটি প্রশ্নের'), 'প্ৰতিটো প্ৰশ্নৰ'],
    [wb('প্রতিটির'),          'প্ৰতিটোৰ'],
    [wb('সমস্ত প্রশ্ন'),      'সকলো প্ৰশ্ন'],
    [wb('সব প্রশ্ন'),         'সকলো প্ৰশ্ন'],

    // ════════════════════════════════════════════════════════════════════════
    // COUNTERS / CLASSIFIERS  (-টি → -টা)
    // ════════════════════════════════════════════════════════════════════════
    [wb('একটি'),   'এটা'],
    [wb('দুটি'),   'দুটা'],
    [wb('তিনটি'),  'তিনটা'],
    [wb('চারটি'),  'চাৰিটা'],
    [wb('পাঁচটি'), 'পাঁচটা'],
    [wb('ছয়টি'),  'ছটা'],
    [wb('সাতটি'),  'সাতটা'],
    [wb('আটটি'),   'আঠটা'],
    [wb('নয়টি'),  'নটা'],
    [wb('দশটি'),   'দহটা'],
    [wb('এটি'),    'এটা'],
    [wb('ওটি'),    'সেইটা'],
    [wb('সেটি'),   'সেইটা'],
    [wb('যেটি'),   'যেটা'],
    [wb('কোনটি'),  'কোনটা'],
    [wb('প্রতিটি'), 'প্ৰতিটো'],
    // -জন (person counters)
    [wb('একজন'),   'এজন'],
    [wb('দুজন'),   'দুজন'],
    [wb('তিনজন'),  'তিনিজন'],
    [wb('চারজন'),  'চাৰিজন'],
    [wb('পাঁচজন'), 'পাঁচজন'],
    [wb('কতজন'),   'কিমানজন'],
    [wb('কেউ'),    'কোনো'],
    [wb('কাউকে'),  'কাকো'],
    [wb('কারো'),   'কাৰো'],

    // ════════════════════════════════════════════════════════════════════════
    // VERB ENDINGS
    // ════════════════════════════════════════════════════════════════════════
    [wb('করিবে'),   'কৰিব'],
    [wb('করিবা'),   'কৰিবা'],
    [wb('করিবেন'),  'কৰিব'],
    [wb('করিবেক'),  'কৰিব'],
    [wb('করিতে'),   'কৰিবলৈ'],
    [wb('করিয়া'),  'কৰি'],
    [wb('করেছে'),   'কৰিছে'],
    [wb('করেছেন'),  'কৰিছে'],
    [wb('করেছি'),   'কৰিছো'],
    [wb('করছে'),    'কৰি আছে'],
    [wb('করছেন'),   'কৰি আছে'],
    [wb('করেছিল'),  'কৰিছিল'],
    [wb('করেছিলেন'), 'কৰিছিল'],
    [wb('করা'),     'কৰা'],
    [wb('করে'),     'কৰে'],
    [wb('করেন'),    'কৰে'],
    [wb('কর'),      'কৰ'],
    [wb('হইবে'),    'হ\'ব'],
    [wb('হইবেক'),   'হ\'ব'],
    [wb('হইবা'),    'হ\'বা'],
    [wb('হইয়া'),   'হৈ'],
    [wb('হইলে'),    'হ\'লে'],
    [wb('হইতে'),    'হ\'বলৈ'],
    [wb('হয়েছে'),  'হৈছে'],
    [wb('হয়েছিল'), 'হৈছিল'],
    [wb('হচ্ছে'),   'হৈ আছে'],
    [wb('হবে'),     'হ\'ব'],
    [wb('হোক'),     'হওক'],
    [wb('হলে'),     'হ\'লে'],
    [wb('হলো'),     'হ\'ল'],
    [wb('হয়'),     'হয়'],
    [wb('দেওয়া'),  'দিয়া'],
    [wb('দেওয়'),   'দিয়'],
    [wb('দেখাও'),   'দেখুৱাও'],
    [wb('দেখান'),   'দেখুৱাওক'],
    [wb('নেওয়া'),  'লোৱা'],
    [wb('পাওয়া'),  'পোৱা'],
    [wb('যাওয়া'),  'যোৱা'],
    [wb('আসা'),     'অহা'],
    [wb('আসে'),     'আহে'],
    [wb('আসেন'),    'আহে'],
    [wb('আসিয়া'),  'আহি'],
    [wb('আসিলে'),   'আহিলে'],
    [wb('আসিবে'),   'আহিব'],
    [wb('এসেছে'),   'আহিছে'],
    [wb('এসেছিল'),  'আহিছিল'],
    [wb('বলা'),     'কোৱা'],
    [wb('বলে'),     'কয়'],
    [wb('বলেন'),    'কয়'],
    [wb('বলিয়া'),  'কৈ'],
    [wb('বলেছে'),   'কৈছে'],
    [wb('বলো'),     'কোৱা'],
    [wb('বলুন'),    'কওক'],
    [wb('লেখা'),    'লিখা'],
    [wb('লেখ'),     'লিখা'],
    [wb('লেখো'),    'লিখা'],
    [wb('লিখুন'),   'লিখক'],
    [wb('লেখে'),    'লিখে'],
    [wb('লেখেন'),   'লিখে'],
    [wb('লেখিয়া'), 'লিখি'],
    [wb('পড়া'),    'পঢ়া'],
    [wb('পড়'),     'পঢ়া'],
    [wb('পড়ো'),    'পঢ়া'],
    [wb('পড়ুন'),   'পঢ়ক'],
    [wb('পড়ে'),    'পঢ়ে'],
    [wb('পাঠ করা'), 'পঢ়া'],
    [wb('মেলাও'),   'মিলোৱা'],
    [wb('মেলান'),   'মিলোৱক'],
    [wb('মিলাও'),   'মিলোৱা'],
    [wb('মিলান'),   'মিলোৱক'],
    [wb('দাও'),     'দিয়া'],
    [wb('দিন'),     'দিয়ক'],
    [wb('নাও'),     'লোৱা'],
    [wb('নিন'),     'লওক'],
    [wb('চাও'),     'বিচাৰা'],
    [wb('চান'),     'বিচাৰক'],
    [wb('জানো'),    'জানা'],
    [wb('জানুন'),   'জানক'],
    [wb('শেখো'),    'শিকা'],
    [wb('শিখুন'),   'শিকক'],
    [wb('বোঝো'),    'বুজা'],
    [wb('বুঝুন'),   'বুজক'],
    [wb('বোঝ'),     'বুজা'],
    [wb('বোঝায়'),  'বুজায়'],
    [wb('বোঝানো'),  'বুজোৱা'],

    // ════════════════════════════════════════════════════════════════════════
    // PRONOUNS / NOUNS
    // ════════════════════════════════════════════════════════════════════════
    [wb('ইহা'),      'ই'],
    [wb('উহা'),      'সেই'],
    [wb('তাহা'),     'সেই'],
    [wb('যাহা'),     'যি'],
    [wb('কাহা'),     'কাৰ'],
    [wb('ইহাদের'),   'এওঁলোকৰ'],
    [wb('তাহাদের'),  'সেওঁলোকৰ'],
    [wb('তাদের'),    'তেওঁলোকৰ'],
    [wb('আমাদের'),   'আমাৰ'],
    [wb('তোমাদের'),  'তোমালোকৰ'],
    [wb('আপনাদের'),  'আপোনালোকৰ'],
    [wb('আপনি'),     'আপুনি'],
    [wb('তিনি'),     'তেওঁ'],
    [wb('তারা'),     'তেওঁলোক'],
    [wb('তাহারা'),   'তেওঁলোক'],
    [wb('আমরা'),     'আমি'],
    [wb('তোমরা'),    'তোমালোক'],
    [wb('সবাই'),     'সকলো'],
    [wb('সকলে'),     'সকলো'],
    [wb('কেউকে'),    'কাকো'],
    [wb('নিজে'),     'নিজে'],
    [wb('নিজের'),    'নিজৰ'],
    [wb('নিজেকে'),   'নিজকে'],

    // ════════════════════════════════════════════════════════════════════════
    // POSTPOSITIONS / CASE MARKERS
    // ════════════════════════════════════════════════════════════════════════
    [wb('থেকে'),     'পৰা'],
    [wb('হতে'),      'পৰা'],
    [wb('দিয়ে'),    'দি'],
    [wb('কাছে'),     'ওচৰত'],
    [wb('কাছের'),    'ওচৰৰ'],
    [wb('মধ্যে'),    'মাজত'],
    [wb('মধ্যের'),   'মাজৰ'],
    [wb('ভেতরে'),    'ভিতৰত'],
    [wb('ভেতর'),     'ভিতৰ'],
    [wb('ভেতরের'),   'ভিতৰৰ'],
    [wb('বাইরে'),    'বাহিৰত'],
    [wb('বাইরের'),   'বাহিৰৰ'],
    [wb('উপরে'),     'ওপৰত'],
    [wb('উপরের'),    'ওপৰৰ'],
    [wb('নিচে'),     'তলত'],
    [wb('নিচের'),    'তলৰ'],
    [wb('পাশে'),     'কাষত'],
    [wb('পাশের'),    'কাষৰ'],
    [wb('সাথে'),     'লগত'],
    [wb('সঙ্গে'),    'লগত'],
    [wb('কারণে'),    'কাৰণে'],
    [wb('জন্য'),     'বাবে'],
    [wb('জন্যে'),    'বাবে'],
    [wb('পর্যন্ত'),  'পৰ্যন্ত'],
    [wb('অনুযায়ী'), 'অনুযায়ী'],
    [wb('অনুসারে'),  'অনুসৰি'],
    [wb('বিষয়ে'),   'বিষয়ে'],
    [wb('সম্পর্কে'), 'সম্পৰ্কে'],
    [wb('ক্ষেত্রে'), 'ক্ষেত্ৰত'],
    [wb('সময়ে'),    'সময়ত'],

    // ════════════════════════════════════════════════════════════════════════
    // QUESTION WORDS
    // ════════════════════════════════════════════════════════════════════════
    [wb('কখন'),      'কেতিয়া'],
    [wb('কোথায়'),   'ক\'ত'],
    [wb('কোথা'),     'ক\'ত'],
    [wb('কোথাকার'),  'ক\'ৰ'],
    [wb('কীভাবে'),   'কেনেকৈ'],
    [wb('কিভাবে'),   'কেনেকৈ'],
    [wb('কেমনে'),    'কেনেকৈ'],
    [wb('কেন'),      'কিয়'],
    [wb('কতটুকু'),   'কিমান'],
    [wb('কতটা'),     'কিমান'],
    [wb('কত'),       'কিমান'],
    [wb('কতগুলো'),   'কিমানটা'],
    [wb('কোনটা'),    'কোনটা'],
    [wb('কোনটি'),    'কোনটা'],
    [wb('কোনো'),     'কোনো'],
    [wb('কীসের'),    'কিহৰ'],
    [wb('কীসে'),     'কিহত'],
    [wb('কার'),      'কাৰ'],
    [wb('কাদের'),    'কাৰ'],

    // ════════════════════════════════════════════════════════════════════════
    // CONJUNCTIONS / CONNECTORS
    // ════════════════════════════════════════════════════════════════════════
    [wb('এবং'),      'আৰু'],
    [wb('তাই'),      'সেইকাৰণে'],
    [wb('তাহলে'),    'তেন্তে'],
    [wb('তবে'),      'তেন্তে'],
    [wb('তবুও'),     'তথাপিও'],
    [wb('যেহেতু'),   'যিহেতু'],
    [wb('সুতরাং'),   'সেয়েহে'],
    [wb('অতএব'),     'সেয়েহে'],
    [wb('তাছাড়া'),  'তদুপৰি'],
    [wb('তাছাড়াও'), 'তদুপৰি'],
    [wb('তবুও'),     'তথাপিও'],
    [wb('নইলে'),     'নহ\'লে'],
    [wb('নাহলে'),    'নহ\'লে'],
    [wb('তাহলেও'),   'তথাপিও'],
    [wb('প্রথমত'),   'প্ৰথমতে'],
    [wb('দ্বিতীয়ত'), 'দ্বিতীয়তে'],
    [wb('তৃতীয়ত'),  'তৃতীয়তে'],
    [wb('শেষে'),     'শেষত'],
    [wb('অবশেষে'),   'অৱশেষত'],
    [wb('প্রথমে'),   'প্ৰথমে'],

    // ════════════════════════════════════════════════════════════════════════
    // GENERAL EXAM / PAPER WORDS
    // ════════════════════════════════════════════════════════════════════════
    [wb('প্রশ্নপত্র'), 'প্ৰশ্নকাকত'],
    [wb('প্রশ্ন'),     'প্ৰশ্ন'],
    [wb('উত্তর'),      'উত্তৰ'],
    [wb('উত্তরঃ'),     'উত্তৰঃ'],
    [wb('উত্তরপত্র'),  'উত্তৰকাকত'],
    [wb('বিভাগ'),      'বিভাগ'],
    [wb('অংশ'),        'অংশ'],
    [wb('পরীক্ষা'),    'পৰীক্ষা'],
    [wb('পরীক্ষার'),   'পৰীক্ষাৰ'],
    [wb('বিষয়'),      'বিষয়'],
    [wb('শ্রেণী'),     'শ্ৰেণী'],
    [wb('পূর্ণমান'),   'পূৰ্ণমান'],
    [wb('নম্বর'),      'নম্বৰ'],
    [wb('নম্বরঃ'),     'নম্বৰঃ'],
    [wb('নির্দেশ'),    'নিৰ্দেশ'],
    [wb('নির্দেশনা'),  'নিৰ্দেশনা'],
    [wb('নির্দেশিকা'), 'নিৰ্দেশিকা'],
    [wb('সঠিক'),       'শুদ্ধ'],
    [wb('সঠিকটি'),     'শুদ্ধটো'],
    [wb('সঠিকটা'),     'শুদ্ধটো'],
    [wb('ভুল'),        'ভুল'],
    [wb('সত্য'),       'সঁচা'],
    [wb('মিথ্যা'),     'মিছা'],
    [wb('সত্যি'),      'সঁচা'],
    [wb('নির্বাচন'),   'বাছনি'],
    [wb('নির্বাচন করো'), 'বাছনি কৰা'],
    [wb('নির্বাচন করুন'), 'বাছনি কৰক'],
    [wb('নিচের'),      'তলৰ'],
    [wb('নিম্নের'),    'তলৰ'],
    [wb('নিম্নে'),     'তলত'],
    [wb('উপরের'),      'ওপৰৰ'],
    [wb('গুরুত্বপূর্ণ'), 'গুৰুত্বপূৰ্ণ'],
    [wb('প্রয়োজনীয়'),  'প্ৰয়োজনীয়'],
    [wb('উদাহরণ'),      'উদাহৰণ'],
    [wb('উদাহরণস্বরূপ'), 'উদাহৰণস্বৰূপ'],
    [wb('বিশেষ'),       'বিশেষ'],
    [wb('সাধারণ'),      'সাধাৰণ'],
    [wb('সাধারণত'),     'সাধাৰণতে'],
    [wb('বিভিন্ন'),     'বিভিন্ন'],
    [wb('একাধিক'),      'একাধিক'],
    [wb('প্রত্যেক'),    'প্ৰতিজন'],
    [wb('প্রতিটি'),     'প্ৰতিটো'],
    [wb('সর্বোচ্চ'),    'সৰ্বোচ্চ'],
    [wb('সর্বনিম্ন'),   'সৰ্বনিম্ন'],
    [wb('সম্পূর্ণ'),    'সম্পূৰ্ণ'],
    [wb('সম্পূর্ণরূপে'), 'সম্পূৰ্ণৰূপে'],
    [wb('অসম্পূর্ণ'),   'অসম্পূৰ্ণ'],

    // ════════════════════════════════════════════════════════════════════════
    // MATH — GEOMETRY, ARITHMETIC, ALGEBRA
    // ════════════════════════════════════════════════════════════════════════
    [wb('বড়ো'),       'ডাঙৰ'],
    [wb('বড়'),        'ডাঙৰ'],
    [wb('ছোট'),        'সৰু'],
    [wb('ছোটো'),       'সৰু'],
    [wb('দীর্ঘ'),      'দীঘল'],
    [wb('দীর্ঘতর'),    'দীঘলতৰ'],
    [wb('খাটো'),       'চুটি'],
    [wb('ত্রিভুজ'),    'ত্ৰিভুজ'],
    [wb('চতুর্ভুজ'),   'চতুৰ্ভুজ'],
    [wb('আয়তক্ষেত্র'), 'আয়তক্ষেত্ৰ'],
    [wb('বর্গক্ষেত্র'), 'বৰ্গক্ষেত্ৰ'],
    [wb('সমান্তরাল'),  'সমান্তৰাল'],
    [wb('ব্যাসার্ধ'),  'ব্যাসাৰ্ধ'],
    [wb('ব্যাসার্ধের'), 'ব্যাসাৰ্ধৰ'],
    [wb('পরিমাপ'),     'জোখ-মাখ'],
    [wb('পরিমাপ কর'),  'জোখ-মাখ কৰা'],
    [wb('পরিমাপ করো'), 'জোখ-মাখ কৰা'],
    [wb('ক্ষেত্রফল'),  'কালি'],
    [wb('পরিসীমা'),    'পৰিসীমা'],
    [wb('পরিধি'),      'পৰিধি'],
    [wb('ব্যাস'),      'ব্যাস'],
    [wb('কোণ'),        'কোণ'],
    [wb('রেখা'),       'ৰেখা'],
    [wb('রেখার'),      'ৰেখাৰ'],
    [wb('রেখাংশ'),     'ৰেখাংশ'],
    [wb('বিন্দু'),     'বিন্দু'],
    [wb('ভগ্নাংশ'),    'ভগ্নাংশ'],
    [wb('দশমিক'),      'দশমিক'],
    [wb('লসাগু'),      'লসাগু'],
    [wb('গসাগু'),      'গসাগু'],
    [wb('বর্গমূল'),    'বৰ্গমূল'],
    [wb('ঘনমূল'),      'ঘনমূল'],
    [wb('সূত্র'),      'সূত্ৰ'],
    [wb('সূত্রের'),    'সূত্ৰৰ'],
    [wb('সূত্র ব্যবহার করে'), 'সূত্ৰ ব্যৱহাৰ কৰি'],
    [wb('হিসাব'),      'হিচাপ'],
    [wb('হিসেব'),      'হিচাপ'],
    [wb('হিসাবে'),     'হিচাপে'],
    [wb('হিসেবে'),     'হিচাপে'],
    [wb('হিসাব কর'),   'হিচাপ কৰা'],
    [wb('হিসাব করো'),  'হিচাপ কৰা'],
    [wb('গাণিতিক'),    'গণিতৰ'],
    [wb('অনুপাত'),     'অনুপাত'],
    [wb('শতাংশ'),      'শতাংশ'],
    [wb('শতকরা'),      'শতাংশ'],
    [wb('সুদ'),        'সুদ'],
    [wb('আসল'),        'মূলধন'],
    [wb('মুনাফা'),     'লাভ'],
    [wb('ক্ষতি'),      'লোকচান'],
    [wb('সমীকরণ'),     'সমীকৰণ'],
    [wb('সমীকরণের'),   'সমীকৰণৰ'],
    [wb('চলক'),        'চলক'],
    [wb('নির্ণয় কর'), 'নিৰ্ণয় কৰা'],
    [wb('নির্ণয় করো'), 'নিৰ্ণয় কৰা'],
    [wb('নির্ণয় করুন'), 'নিৰ্ণয় কৰক'],
    [wb('প্রমাণ'),     'প্ৰমাণ'],

    // ════════════════════════════════════════════════════════════════════════
    // SCIENCE — PHYSICS, CHEMISTRY, BIOLOGY
    // ════════════════════════════════════════════════════════════════════════
    [wb('আলো'),        'পোহৰ'],
    [wb('আলোর'),       'পোহৰৰ'],
    [wb('আলোক'),       'পোহৰ'],
    [wb('জল'),         'পানী'],
    [wb('জলের'),       'পানীৰ'],
    [wb('তাপ'),        'তাপ'],
    [wb('তাপমাত্রা'),  'তাপমাত্ৰা'],
    [wb('বায়ু'),       'বায়ু'],
    [wb('বায়ুর'),      'বায়ুৰ'],
    [wb('মাটি'),       'মাটি'],
    [wb('পাথর'),       'শিল'],
    [wb('পাথরের'),     'শিলৰ'],
    [wb('শক্তি'),      'শক্তি'],
    [wb('শক্তির'),     'শক্তিৰ'],
    [wb('বিদ্যুৎ'),    'বিদ্যুৎ'],
    [wb('বিদ্যুতের'),  'বিদ্যুতৰ'],
    [wb('চুম্বক'),     'চুম্বক'],
    [wb('মাধ্যাকর্ষণ'), 'মাধ্যাকৰ্ষণ'],
    [wb('পরিবর্তন'),   'পৰিৱৰ্তন'],
    [wb('পরিবর্তনের'), 'পৰিৱৰ্তনৰ'],
    [wb('পরিবেশ'),     'পৰিৱেশ'],
    [wb('পরিবেশের'),   'পৰিৱেশৰ'],
    [wb('প্রাণী'),     'প্ৰাণী'],
    [wb('প্রাণীর'),    'প্ৰাণীৰ'],
    [wb('উদ্ভিদ'),     'উদ্ভিদ'],
    [wb('উদ্ভিদের'),   'উদ্ভিদৰ'],
    [wb('কোষ'),        'কোষ'],
    [wb('কোষের'),      'কোষৰ'],
    [wb('শ্বাস'),      'উশাহ'],
    [wb('শ্বাসক্রিয়া'), 'উশাহ-নিশাহ'],
    [wb('পুষ্টি'),     'পুষ্টি'],
    [wb('খাদ্য'),      'খাদ্য'],
    [wb('খাদ্যের'),    'খাদ্যৰ'],
    [wb('রোগ'),        'ৰোগ'],
    [wb('রোগের'),      'ৰোগৰ'],
    [wb('ওষুধ'),       'দৰব'],
    [wb('স্বাস্থ্য'),  'স্বাস্থ্য'],
    [wb('রক্ত'),       'তেজ'],
    [wb('রক্তের'),     'তেজৰ'],
    [wb('হৃদয়'),      'হৃদয়'],
    [wb('ফুসফুস'),     'হাওঁফাওঁ'],
    [wb('মস্তিষ্ক'),  'মগজু'],
    [wb('মিশ্রণ'),     'মিশ্ৰণ'],
    [wb('মিশ্রণের'),   'মিশ্ৰণৰ'],
    [wb('দ্রবণ'),      'দ্ৰৱণ'],
    [wb('অম্ল'),       'অম্ল'],
    [wb('ক্ষার'),      'ক্ষাৰ'],
    [wb('রাসায়নিক'),  'ৰাসায়নিক'],
    [wb('রাসায়নিকের'), 'ৰাসায়নিকৰ'],
    [wb('প্রতিক্রিয়া'), 'প্ৰতিক্ৰিয়া'],
    [wb('পরমাণু'),     'পৰমাণু'],
    [wb('অণু'),        'অণু'],
    [wb('মৌলিক'),      'মৌলিক'],
    [wb('যৌগিক'),      'যৌগিক'],
    [wb('পদার্থ'),     'পদাৰ্থ'],
    [wb('পদার্থের'),   'পদাৰ্থৰ'],
    [wb('ঘনত্ব'),      'ঘনত্ব'],
    [wb('চাপ'),        'চাপ'],
    [wb('তরঙ্গ'),      'তৰংগ'],
    [wb('শব্দ'),       'শব্দ'],
    [wb('শব্দের'),     'শব্দৰ'],

    // ════════════════════════════════════════════════════════════════════════
    // SOCIAL STUDIES — HISTORY, GEOGRAPHY, CIVICS, ECONOMICS
    // ════════════════════════════════════════════════════════════════════════
    [wb('শহর'),        'চহৰ'],
    [wb('শহরের'),      'চহৰৰ'],
    [wb('গ্রাম'),      'গাঁও'],
    [wb('গ্রামের'),    'গাঁৱৰ'],
    [wb('রাজ্য'),      'ৰাজ্য'],
    [wb('রাজ্যের'),    'ৰাজ্যৰ'],
    [wb('দেশ'),        'দেশ'],
    [wb('দেশের'),      'দেশৰ'],
    [wb('নদী'),        'নদী'],
    [wb('নদীর'),       'নদীৰ'],
    [wb('পর্বত'),      'পৰ্বত'],
    [wb('পর্বতের'),    'পৰ্বতৰ'],
    [wb('মরুভূমি'),    'মৰুভূমি'],
    [wb('সমুদ্র'),     'সমুদ্ৰ'],
    [wb('সমুদ্রের'),   'সমুদ্ৰৰ'],
    [wb('মহাসাগর'),    'মহাসাগৰ'],
    [wb('মহাসাগরের'),  'মহাসাগৰৰ'],
    [wb('মহাদেশ'),     'মহাদেশ'],
    [wb('জলবায়ু'),    'জলবায়ু'],
    [wb('আবহাওয়া'),   'বতৰ'],
    [wb('ঋতু'),        'ঋতু'],
    [wb('বর্ষা'),      'বৰষুণ'],
    [wb('বর্ষার'),     'বৰষুণৰ'],
    [wb('ভূমি'),       'ভূমি'],
    [wb('ভূমির'),      'ভূমিৰ'],
    [wb('সরকার'),      'চৰকাৰ'],
    [wb('সরকারের'),    'চৰকাৰৰ'],
    [wb('সরকারি'),     'চৰকাৰী'],
    [wb('জনসংখ্যা'),   'জনসংখ্যা'],
    [wb('জনগণ'),       'জনগণ'],
    [wb('নাগরিক'),     'নাগৰিক'],
    [wb('নাগরিকের'),   'নাগৰিকৰ'],
    [wb('সংবিধান'),    'সংবিধান'],
    [wb('সংবিধানের'),  'সংবিধানৰ'],
    [wb('সংসদ'),       'সংসদ'],
    [wb('নির্বাচন'),   'নিৰ্বাচন'],
    [wb('ইতিহাস'),     'ইতিহাস'],
    [wb('ইতিহাসের'),   'ইতিহাসৰ'],
    [wb('সভ্যতা'),     'সভ্যতা'],
    [wb('সংস্কৃতি'),   'সংস্কৃতি'],
    [wb('ঐতিহাসিক'),   'ঐতিহাসিক'],
    [wb('প্রাচীন'),    'প্ৰাচীন'],
    [wb('মধ্যযুগীয়'), 'মধ্যযুগীয়'],
    [wb('আধুনিক'),     'আধুনিক'],
    [wb('স্বাধীনতা'),  'স্বাধীনতা'],
    [wb('স্বাধীনতার'), 'স্বাধীনতাৰ'],
    [wb('বিপ্লব'),     'বিপ্লৱ'],
    [wb('যুদ্ধ'),      'যুদ্ধ'],
    [wb('যুদ্ধের'),    'যুদ্ধৰ'],
    [wb('সম্রাট'),     'সম্ৰাট'],
    [wb('রাজা'),       'ৰজা'],
    [wb('রাজার'),      'ৰজাৰ'],
    [wb('রাণী'),       'ৰাণী'],
    [wb('শাসন'),       'শাসন'],
    [wb('শাসনকাল'),    'শাসনকাল'],
    [wb('কৃষি'),       'কৃষি'],
    [wb('কৃষিকাজ'),    'কৃষিকাম'],
    [wb('শিল্প'),      'উদ্যোগ'],
    [wb('শিল্পের'),    'উদ্যোগৰ'],
    [wb('বাণিজ্য'),    'বাণিজ্য'],
    [wb('বাণিজ্যের'),  'বাণিজ্যৰ'],
    [wb('অর্থনীতি'),   'অৰ্থনীতি'],
    [wb('আয়'),        'উপাৰ্জন'],
    [wb('ব্যয়'),       'ব্যয়'],
    [wb('মুদ্রা'),      'মুদ্ৰা'],

    // ════════════════════════════════════════════════════════════════════════
    // EVS / ENVIRONMENT
    // ════════════════════════════════════════════════════════════════════════
    [wb('প্রকৃতি'),    'প্ৰকৃতি'],
    [wb('প্রকৃতির'),   'প্ৰকৃতিৰ'],
    [wb('বন'),         'হাবি'],
    [wb('বনের'),       'হাবিৰ'],
    [wb('বন্যপ্রাণী'), 'বনৰীয়া জন্তু'],
    [wb('গাছ'),        'গছ'],
    [wb('গাছের'),      'গছৰ'],
    [wb('ফুল'),        'ফুল'],
    [wb('ফলের'),       'ফলৰ'],
    [wb('পাখি'),       'চৰাই'],
    [wb('পাখির'),      'চৰাইৰ'],
    [wb('মাছ'),        'মাছ'],
    [wb('মাটির'),      'মাটিৰ'],
    [wb('দূষণ'),       'প্ৰদূষণ'],
    [wb('দূষণের'),     'প্ৰদূষণৰ'],
    [wb('দূষিত'),      'প্ৰদূষিত'],
    [wb('সংরক্ষণ'),    'সংৰক্ষণ'],
    [wb('সংরক্ষণের'),  'সংৰক্ষণৰ'],
    [wb('পুনর্ব্যবহার'), 'পুনৰ ব্যৱহাৰ'],
    [wb('নবায়নযোগ্য'), 'নবীকৰণযোগ্য'],
    [wb('সৌরশক্তি'),   'সৌৰশক্তি'],
    [wb('বৃষ্টিপাত'),  'বৰষুণ'],
    [wb('বন্যা'),      'বানপানী'],
    [wb('খরা'),        'খৰাং'],
    [wb('ভূমিকম্প'),   'ভূমিকম্প'],

    // ════════════════════════════════════════════════════════════════════════
    // COMPUTER STUDIES
    // ════════════════════════════════════════════════════════════════════════
    [wb('কম্পিউটার'),      'কম্পিউটাৰ'],
    [wb('কম্পিউটারের'),    'কম্পিউটাৰৰ'],
    [wb('সফটওয়্যার'),     'চফ্টৱেৰ'],
    [wb('হার্ডওয়্যার'),   'হাৰ্ডৱেৰ'],
    [wb('প্রসেসর'),        'প্ৰচেছৰ'],
    [wb('মেমোরি'),         'মেমৰি'],
    [wb('ইন্টারনেট'),      'ইন্টাৰনেট'],
    [wb('নেটওয়ার্ক'),     'নেটৱৰ্ক'],
    [wb('প্রোগ্রাম'),      'প্ৰগ্ৰাম'],
    [wb('প্রোগ্রামিং'),    'প্ৰগ্ৰামিং'],
    [wb('তথ্য'),           'তথ্য'],
    [wb('তথ্যের'),         'তথ্যৰ'],
    [wb('তথ্যপ্রযুক্তি'),  'তথ্যপ্ৰযুক্তি'],
    [wb('ডেটা'),           'ডেটা'],
    [wb('ফাইল'),           'ফাইল'],
    [wb('ফোল্ডার'),        'ফোল্ডাৰ'],
    [wb('কীবোর্ড'),        'কীবোৰ্ড'],
    [wb('মাউস'),           'মাউছ'],
    [wb('মনিটর'),          'মনিটৰ'],
    [wb('প্রিন্টার'),      'প্ৰিন্টাৰ'],
    [wb('স্ক্যানার'),      'স্কেনাৰ'],
    [wb('অপারেটিং সিস্টেম'), 'অপাৰেটিং চিস্টেম'],
  ];

  for (const [pattern, replacement] of dict) {
    out = out.replace(pattern, replacement);
  }

  return out;
}

function validateGeneratedPaper(paperData, { selectedChapters, qtypes, totalQ }) {
  if (!paperData || !Array.isArray(paperData.sections) || paperData.sections.length === 0) {
    return { ok: false, reason: 'No valid sections were returned.' };
  }

  const allowedTypes = new Set(qtypes);
  function normalizeStr(s) {
    return s.trim().toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, ' ');
  }
  const allowedChapters = new Set(selectedChapters);
  const allowedChaptersNorm = new Set(selectedChapters.map(normalizeStr));
  let totalQuestions = 0;

  for (const section of paperData.sections) {
    if (!section || !allowedTypes.has(section.type)) {
      return { ok: false, reason: `Unexpected section type "${section?.type || 'unknown'}".` };
    }
    if (!Array.isArray(section.questions) || section.questions.length === 0) {
      return { ok: false, reason: `Section "${section.title || section.type}" has no questions.` };
    }

    for (const question of section.questions) {
      totalQuestions++;

      if (!question?.text || typeof question.text !== 'string') {
        return { ok: false, reason: 'A question is missing text.' };
      }
      if (!question?.chapter || (!allowedChapters.has(question.chapter) && !allowedChaptersNorm.has(normalizeStr(question.chapter)))) {
        return { ok: false, reason: `A question used an unselected chapter "${question?.chapter || 'unknown'}".` };
      }

      const marks = Number(question.marks);
      if (!Number.isFinite(marks) || marks <= 0) {
        return { ok: false, reason: `Question "${question.text.slice(0, 40)}" has invalid marks.` };
      }

      if (!question.answer || typeof question.answer !== 'string') {
        return { ok: false, reason: `Question "${question.text.slice(0, 40)}" is missing an answer.` };
      }

      if (section.type === 'MCQ') {
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          return { ok: false, reason: `MCQ "${question.text.slice(0, 40)}" must have exactly 4 options.` };
        }
      }
    }
  }

  if (totalQuestions !== totalQ) {
    return { ok: false, reason: `Expected exactly ${totalQ} questions, but received ${totalQuestions}.` };
  }

  return { ok: true };
}

function normalizeGeneratedPaper(paperData, allowedTypes, selectedChapters) {
  const allowedTypeSet = new Set(allowedTypes);

  // Resolve partial/truncated chapter names to their full allowed counterpart.
  // The AI sometimes returns only the first lesson of a multi-lesson unit chapter
  // (e.g. "Unit 1: Fun with Friends — My Bicycle" instead of the full
  // "Unit 1: Fun with Friends — My Bicycle, Picture Reading").
  function normalizeStr(s) {
    return s.trim().toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, ' ');
  }
  function resolveChapterName(chapterName) {
    if (!chapterName || !selectedChapters?.length) return chapterName;
    const trimmed = chapterName.trim();
    // 1. Exact match
    if (selectedChapters.includes(trimmed)) return trimmed;
    // 2. Case-insensitive + smart-quote normalized match
    const norm = normalizeStr(trimmed);
    const exactCI = selectedChapters.find(c => normalizeStr(c) === norm);
    if (exactCI) return exactCI;
    // 3. Prefix match (AI sometimes truncates long chapter names)
    const prefixMatch = selectedChapters.find(c => {
      const cn = normalizeStr(c);
      return cn.startsWith(norm) || norm.startsWith(cn);
    });
    return prefixMatch || trimmed;
  }

  return {
    ...paperData,
    sections: paperData.sections
      .filter((section) => section && allowedTypeSet.has(section.type))
      .map((section) => ({
        type: section.type,
        title: section.title || getRequestedQuestionTypeDescriptors([section.type])[0].title,
        questions: (section.questions || []).map((question, index) => ({
          qno: Number(question.qno) || index + 1,
          chapter: resolveChapterName(String(question.chapter || '').trim()),
          text: String(question.text || '').trim(),
          options: Array.isArray(question.options)
            ? question.options.map((option) => String(option || '').trim()).filter(Boolean)
            : undefined,
          answer: String(question.answer || '').trim(),
          marks: Number(question.marks) || 1
        }))
      }))
  };
}

function buildRepairPrompt({ rawJson, validationReason, selectedChapters, qtypes, totalQ, subjectLanguageInstruction }) {
  return `${subjectLanguageInstruction}

Fix the following exam paper JSON.

VALIDATION ERROR: ${validationReason}

REQUIREMENTS:
- Exactly ${totalQ} questions total.
- Question types: ${qtypes.join(', ')}
- Allowed chapters: ${selectedChapters.join(' | ')}
- Every question needs a "chapter" field matching an allowed chapter exactly.
- MCQ must have exactly 4 options. ShortAnswer/LongAnswer have no options field.
- Output JSON only.

JSON TO FIX:
${rawJson}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isLocalEnvironment() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

// ---- CASCADING DROPDOWNS ----
function onBoardChange() {
  const board = document.getElementById('boardSelect').value;
  const classSelect = document.getElementById('classSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const chapterContainer = document.getElementById('chapterContainer');

  // Clear everything
  classSelect.innerHTML = '<option value="">— Select Class —</option>';
  subjectSelect.innerHTML = '<option value="">— Select Subject —</option>';
  classSelect.disabled = true;
  subjectSelect.disabled = true;
  chapterContainer.innerHTML = '<div class="chapter-placeholder">Select a subject to view chapters</div>';

  if (!board || !window.SYLLABUS_DATA[board]) {
    return;
  }

  const classes = window.SYLLABUS_DATA[board].classes;
  if (!classes) {
    return;
  }

  classSelect.disabled = false;

  for (const c in classes) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = classes[c].names?.[currentLang] || c;
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
    const displayName = subjects[s].names?.[currentLang] || s;
    subjectSelect.innerHTML += `<option value="${s}">${displayName}</option>`;
  }
}

function getChapterDisplayLang() {
  const medium = document.querySelector('input[name="medium"]:checked')?.value || 'English';
  if (medium === 'Assamese') return 'as';
  if (medium === 'Hindi') return 'hi';
  return 'en';
}

function onMediumChange() {
  // Re-render chapter list in the newly selected medium's language
  const subject = document.getElementById('subjectSelect').value;
  if (subject) onSubjectChange({ preserveSelection: true });
}

function onSubjectChange(options = {}) {
  const board = document.getElementById('boardSelect').value;
  const cls = document.getElementById('classSelect').value;
  const subject = document.getElementById('subjectSelect').value;
  const chapterContainer = document.getElementById('chapterContainer');
  const preserveSelection = options.preserveSelection === true;
  const selectedValues = preserveSelection
    ? new Set(
        [...chapterContainer.querySelectorAll('input[name="selectedChapters"]:checked')]
          .map(cb => cb.value)
      )
    : new Set();

  if (!subject) {
    chapterContainer.innerHTML = '<div class="chapter-placeholder">Select a subject to view chapters</div>';
    return;
  }

  // Auto-select medium based on subject — English and Hindi subjects lock their medium
  const subjectLower = subject.toLowerCase();
  if (subjectLower === 'english' || subjectLower.startsWith('english ')) {
    document.querySelector('input[name="medium"][value="English"]').checked = true;
  } else if (subjectLower.includes('hindi') || subjectLower.includes('हिंदी')) {
    document.querySelector('input[name="medium"][value="Hindi"]').checked = true;
  } else if (subjectLower.includes('assamese') || subjectLower.includes('অসমীয়া')) {
    document.querySelector('input[name="medium"][value="Assamese"]').checked = true;
  }
  // For all other subjects (Math, Science, etc.) keep whatever medium the teacher has chosen

  // Use the medium to decide which language to show chapter names in
  const displayLang = getChapterDisplayLang();

  const chapters = window.SYLLABUS_DATA[board].classes[cls].subjects[subject].chapters;
  let html = `<div class="chapter-list">`;
  chapters.forEach(ch => {
    const displayName = ch.names?.[displayLang] || ch.names?.en || ch.name || "Chapter";
    const value = ch.names?.en || ch.name;
    const checkedAttr = selectedValues.has(value) ? ' checked' : '';
    html += `<label class="chapter-item">
      <input type="checkbox" name="selectedChapters" value="${value}"${checkedAttr} />
      <span>${displayName}</span>
    </label>`;
  });
  html += `</div>`;
  chapterContainer.innerHTML = html;
}

// ---- CORE GENERATE ----
async function generatePaper() {
  if (inputMode === 'image') { await generatePaperFromImages(); return; }

  const board = document.getElementById('boardSelect').value;
  const schoolName = document.getElementById('schoolName').value.trim() || 'Your School';
  const cls = document.getElementById('classSelect').value;
  const subject = document.getElementById('subjectSelect').value;
  const selectedChapters = [...document.querySelectorAll('input[name="selectedChapters"]:checked')].map(cb => cb.value);
  
  let totalQ = Math.min(30, parseInt(document.getElementById('totalQ').value) || 10);
  const totalMarks = parseInt(document.getElementById('totalMarks').value) || 50;
  const timeLimit = parseInt(document.getElementById('timeLimit').value) || 90;
  const difficulty = getDifficulty();
  const qtypes = getCheckedValues('qtype');
  const extraInstr = document.getElementById('instructions').value.trim();

  if (!board || !cls || !subject || selectedChapters.length === 0) {
    showToast(T[currentLang].fillRequired, 'warn');
    return;
  }
  if (qtypes.length === 0) {
    showToast('Please select at least one question type.', 'warn');
    return;
  }

  // Require user sign-in
  if (window.auth && !window.auth.currentUser) {
    showToast("Please sign in to generate a paper.", 'warn');
    openAuthModal('login');
    return;
  }

  const ud = window.currentUserData;
  const hasPlan = !!ud?.plan;
  const isUnlimited = ud?.papersTotal === 9999;
  const hasRemaining = isUnlimited || (ud?.papersRemaining || 0) > 0;
  const demoUsed = ud?.demoUsed || 0;
  const demoRemaining = Math.max(0, DEMO_PAPER_LIMIT - demoUsed);

  // Check if user has credits available
  if (hasPlan && !hasRemaining) {
    showCreditsExhaustedModal();
    return;
  }

  // Enforce the free demo limit before calling the AI API
  if (!hasPlan && demoRemaining <= 0) {
    showDemoExhaustedModal();
    return;
  }

  const planIncludesAnswers = hasPlan ? (ud?.includesAnswers || false) : false;
  if (!hasPlan && totalQ > DEMO_MAX_QUESTIONS) {
    totalQ = DEMO_MAX_QUESTIONS;
    document.getElementById('totalQ').value = DEMO_MAX_QUESTIONS;
    showToast(`Free demo papers are limited to ${DEMO_MAX_QUESTIONS} questions. Adjusted automatically.`, 'info');
  }

  // Reset per-paper unlock state before generating a fresh paper.
  isPaid = false;
  hasAnswersForCurrentPaper = planIncludesAnswers;
  includeAnswers = planIncludesAnswers;

  // Build board-specific prompt template
  const boardTemplate = window.PROMPT_TEMPLATES?.[board] || '';

  // Read the Medium of Instruction selected by the user
  const selectedMedium = document.querySelector('input[name="medium"]:checked')?.value || 'English';

  // English and Hindi are language subjects — their papers must always be in their own language
  const subjectLower = subject.toLowerCase();
  const isEnglishSubject = subjectLower === 'english' || subjectLower.startsWith('english ');
  const isHindiSubject = subjectLower.includes('hindi') || subjectLower.includes('हिंदी');

  // Effective medium: language subjects override the medium selector
  let effectiveMedium = selectedMedium;
  if (isEnglishSubject) effectiveMedium = 'English';
  else if (isHindiSubject) effectiveMedium = 'Hindi';

  const isAssameseMedium = effectiveMedium === 'Assamese';
  const isHindiMedium = effectiveMedium === 'Hindi';

  // Build language instruction based on effective medium
  let subjectLanguageInstruction;
  if (isAssameseMedium) {
    subjectLanguageInstruction = 'CRITICAL LANGUAGE RULE: You MUST write every single word — questions, options, answers, section titles, instructions — in pure Assamese (অসমীয়া) script only. ZERO English words allowed anywhere in the output, including words like "Answer", "Section", "Q1", "marks" etc. — translate ALL of these to Assamese. ZERO Bengali words allowed — Assamese and Bengali share the same script but are different languages. Use authentic Assamese vocabulary and grammar only. Assamese-specific markers: use "ৰ" not Bengali "র", use "কিয়", "ক\'ত", "হাতী", "নহয়", "উত্তৰ", "খণ্ড", "নম্বৰ" etc. If any English or Bengali word appears in your output, it is a failure.';
  } else if (isHindiMedium) {
    subjectLanguageInstruction = 'IMPORTANT: The medium of instruction is Hindi. ALL question text, options, and answers MUST be written entirely in हिंदी (Hindi). Do NOT use English or any other language for question text.';
  } else {
    subjectLanguageInstruction = 'The medium of instruction is English. Write all question text, options, and answers in English.';
  }

  // Groq API Configuration
  const cfg = window.SMART_DIGITAL_CONFIG?.GROQ || window.GLOBAL_CONFIG || {};
  const GROQ_API_KEY = localStorage.getItem('groq_api_key') || cfg.API_KEY || '';
  const GROQ_ENDPOINT = cfg.ENDPOINT || "https://api.groq.com/openai/v1/chat/completions";
  const GROQ_MODEL = cfg.MODEL || "llama-3.3-70b-versatile";
  const configuredMaxTokens = cfg.MAX_TOKENS || 4000;
  const isLocal = isLocalEnvironment();
  const wantsAnswers = true;
  const nonLatinScript = isAssameseMedium || isHindiMedium;
  const GROQ_MAX_TOKENS = estimateGenerationMaxTokens(totalQ, wantsAnswers, configuredMaxTokens, nonLatinScript);

  // Claude config (used for Assamese medium only) — key read from central config
  const claudeCfg = window.SMART_DIGITAL_CONFIG?.CLAUDE || {};
  const CLAUDE_API_KEY = claudeCfg.API_KEY || '';
  const CLAUDE_ENDPOINT = claudeCfg.ENDPOINT || 'https://api.anthropic.com/v1/messages';
  const CLAUDE_MODEL = claudeCfg.MODEL || 'claude-haiku-4-5-20251001';

  const prompt = buildPaperPrompt({
    board,
    cls,
    subject,
    selectedChapters,
    totalQ,
    totalMarks,
    timeLimit,
    difficulty,
    qtypes,
    extraInstr,
    boardTemplate,
    subjectLanguageInstruction,
    isAssamese: isAssameseMedium
  });

  const systemMessage = isAssameseMedium
    ? `You are an expert Assamese-medium school exam paper creator for SEBA, AHSEC and other Assam boards. You output ONLY valid JSON. Never add text outside JSON. You write exclusively in pure Assamese (অসমীয়া) — not Bengali, not English. Every word in the JSON values must be Assamese. ${subjectLanguageInstruction}`
    : `You are an expert Indian school exam paper creator for SEBA, AHSEC, CBSE, ICSE, Jatiya Vidyalaya, and Shankardev boards. You output ONLY valid JSON in the exact shape requested. Never add text outside JSON. ${subjectLanguageInstruction}`;

  async function requestPaperFromModel(userPrompt, maxTokens) {
    let response;

    if (isAssameseMedium) {
      // Use Claude for Assamese — best instruction-following for pure Assamese output
      try {
        response = await fetch(CLAUDE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: maxTokens,
            temperature: 0.15,
            system: systemMessage,
            messages: [{ role: "user", content: userPrompt }]
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errorMessage = errData.error?.message || response.statusText;
          throw new Error(`Claude API Error ${response.status}: ${errorMessage}`);
        }

        const data = await response.json();
        const rawTextRaw = data.content?.[0]?.text?.trim();
        if (!rawTextRaw) throw new Error("Empty response from Claude");
        const rawText = fixAssameseScript(rawTextRaw);

        let parsed;
        try {
          parsed = JSON.parse(rawText);
        } catch {
          const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```|```\s*([\s\S]*?)```|\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[2] || jsonMatch[0]) : rawText;
          try {
            parsed = JSON.parse(jsonStr);
          } catch (parseErr) {
            // JSON parse failed, falling back
            throw new Error("Could not parse Claude response");
          }
        }
        return { rawText, parsed };
      } catch (claudeErr) {
        // Claude error — fall back to Groq with strong Assamese instruction
        // Claude failed, falling back to Groq
      }
    }

    // All other languages — use Groq
    let requestUrl = GROQ_ENDPOINT;
    const requestHeaders = { "Content-Type": "application/json" };

    if (isLocal) {
      if (!GROQ_API_KEY || GROQ_API_KEY === "SECURE_PROXIED_VIA_NETLIFY") {
        throw new Error(T[currentLang].apiKeyMissing);
      }
      requestHeaders.Authorization = `Bearer ${GROQ_API_KEY}`;
    } else {
      requestUrl = "/.netlify/functions/chat";
    }

    response = await fetch(requestUrl, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.15,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const errorMessage =
        errData.error?.message ||
        errData.error ||
        errData.message ||
        response.statusText;
      throw new Error(`API Error ${response.status}: ${errorMessage}`);
    }

    const data = await response.json();
    const rawTextRaw = data.choices?.[0]?.message?.content?.trim();
    if (!rawTextRaw) {
      throw new Error("Empty response from AI model");
    }
    const rawText = isAssameseMedium ? fixAssameseScript(rawTextRaw) : rawTextRaw;

    let parsed;
    try {
      // response_format: json_object guarantees valid JSON; fallback extraction for safety
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```|```\s*([\s\S]*?)```|\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[2] || jsonMatch[0]) : rawText;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseErr) {
        // JSON parse failed
        throw new Error("Could not parse AI response");
      }
    }

    return { rawText, parsed };
  }

  // For non-Assamese on local, require a Groq API key
  if (!isAssameseMedium && isLocal && (!GROQ_API_KEY || GROQ_API_KEY === "SECURE_PROXIED_VIA_NETLIFY")) {
    showToast(T[currentLang].apiKeyMissing, 'error');
    showOutput('placeholder');
    return;
  }

  let creditReserved = false;
  
  try {
    if (hasPlan && typeof reservePaperCredit === 'function') {
      await reservePaperCredit();
      creditReserved = true;
    }

    showOutput('loading');
    document.getElementById('loadingText').textContent = T[currentLang].generating;

    let { rawText, parsed } = await requestPaperFromModel(prompt, GROQ_MAX_TOKENS);
    let paperData = normalizeGeneratedPaper(parsed, qtypes, selectedChapters);
    let validation = validateGeneratedPaper(paperData, { selectedChapters, qtypes, totalQ });

    if (!validation.ok) {
      const repairPrompt = buildRepairPrompt({
        rawJson: rawText,
        validationReason: validation.reason,
        selectedChapters,
        qtypes,
        totalQ,
        subjectLanguageInstruction
      });
      const repairResult = await requestPaperFromModel(
        repairPrompt,
        Math.min(configuredMaxTokens, Math.max(1400, Math.round(GROQ_MAX_TOKENS * 0.75)))
      );
      paperData = normalizeGeneratedPaper(repairResult.parsed, qtypes, selectedChapters);
      validation = validateGeneratedPaper(paperData, { selectedChapters, qtypes, totalQ });
    }

    if (!validation.ok) {
      throw new Error(`Generated paper failed validation: ${validation.reason}`);
    }

    // Set whether this paper has answers based on plan or toggle
    const paperHasAnswers = planIncludesAnswers || includeAnswers;
    paperData.meta = { board, schoolName, cls, subject, topic: selectedChapters.join(', '), totalMarks, timeLimit, withAnswers: paperHasAnswers };
    currentPaperData = paperData;
    hasAnswersForCurrentPaper = paperHasAnswers;

    // Track usage in Firestore
    if (window.currentUserData?.plan) {
      await saveGeneratedPaperHistory(paperData.meta);
    } else {
      await incrementDemoUsed();                     // demo user — count demo usage
    }

    renderPaper(paperData);
    showOutput('result');

    // Show warning that paper cannot be accessed again
    showPaperSaveWarning();
    
    // Refresh credits display after generation
    updateCreditsDisplay();

  } catch (err) {
    if (creditReserved && typeof releaseReservedPaperCredit === 'function') {
      await releaseReservedPaperCredit();
      creditReserved = false;
    }

    if (err.code === 'examcraft/no-credits') {
      showCreditsExhaustedModal();
      return;
    }

    const isValidationErr = err.message?.startsWith('Generated paper failed validation');
    const isApiErr = err.message?.startsWith('API Error') || err.message?.startsWith('Claude API Error');
    const prefix = isValidationErr ? '' : isApiErr ? '' : `${T[currentLang].errorNetwork} — `;
    showToast(`${prefix}${err.message}`, 'error', 6000);
    showOutput('placeholder');
  }
}

// Added helper to centralize visibility logic
function showOutput(view) {
  const p = document.getElementById('outputPlaceholder');
  const l = document.getElementById('outputLoading');
  const r = document.getElementById('outputResult');

  if(p) p.classList.add('hidden');
  if(l) l.classList.add('hidden');
  if(r) r.classList.add('hidden');

  if(view === 'placeholder') p?.classList.remove('hidden');
  if(view === 'loading') l?.classList.remove('hidden');
  if(view === 'result') r?.classList.remove('hidden');
}

// ---- IMAGE-BASED PAPER GENERATION ----
async function generatePaperFromImages() {
  if (uploadedImages.length === 0) {
    showToast('Please upload at least one chapter page image.', 'warn');
    return;
  }

  const schoolName = document.getElementById('schoolName').value.trim() || 'Your School';
  let totalQ = Math.min(30, parseInt(document.getElementById('totalQ').value) || 10);
  const totalMarks = parseInt(document.getElementById('totalMarks').value) || 50;
  const timeLimit = parseInt(document.getElementById('timeLimit').value) || 90;
  const difficulty = getDifficulty();
  const qtypes = getCheckedValues('qtype');
  const extraInstr = document.getElementById('instructions').value.trim();
  const selectedMedium = document.querySelector('input[name="medium"]:checked')?.value || 'English';
  const imageSubject = document.getElementById('imageSubject')?.value.trim() || 'Chapter Pages';
  const imageClass = document.getElementById('imageClass')?.value.trim() || '';

  if (qtypes.length === 0) {
    showToast('Please select at least one question type.', 'warn');
    return;
  }

  if (window.auth && !window.auth.currentUser) {
    showToast('Please sign in to generate a paper.', 'warn');
    openAuthModal('login');
    return;
  }

  const ud = window.currentUserData;
  const hasPlan = !!ud?.plan;
  const isUnlimited = ud?.papersTotal === 9999;
  const hasRemaining = isUnlimited || (ud?.papersRemaining || 0) > 0;
  const demoUsed = ud?.demoUsed || 0;
  const demoRemaining = Math.max(0, DEMO_PAPER_LIMIT - demoUsed);

  if (hasPlan && !hasRemaining) { showCreditsExhaustedModal(); return; }
  if (!hasPlan && demoRemaining <= 0) { showDemoExhaustedModal(); return; }

  const planIncludesAnswers = hasPlan ? (ud?.includesAnswers || false) : false;
  if (!hasPlan && totalQ > DEMO_MAX_QUESTIONS) {
    totalQ = DEMO_MAX_QUESTIONS;
    document.getElementById('totalQ').value = DEMO_MAX_QUESTIONS;
    showToast(`Free demo papers are limited to ${DEMO_MAX_QUESTIONS} questions. Adjusted automatically.`, 'info');
  }

  isPaid = false;
  hasAnswersForCurrentPaper = planIncludesAnswers;
  includeAnswers = planIncludesAnswers;

  const claudeCfg = window.SMART_DIGITAL_CONFIG?.CLAUDE || {};
  const CLAUDE_API_KEY = claudeCfg.API_KEY || '';
  const CLAUDE_ENDPOINT = claudeCfg.ENDPOINT || 'https://api.anthropic.com/v1/messages';
  const CLAUDE_MODEL = claudeCfg.MODEL || 'claude-haiku-4-5-20251001';

  if (!CLAUDE_API_KEY) {
    showToast('Claude API key not configured. Image upload requires Claude Vision.', 'error');
    return;
  }

  let creditReserved = false;
  try {
    if (hasPlan && typeof reservePaperCredit === 'function') {
      await reservePaperCredit();
      creditReserved = true;
    }

    showOutput('loading');
    const loadingEl = document.getElementById('loadingText');
    if (loadingEl) loadingEl.textContent = `Reading ${uploadedImages.length} page(s) and generating questions…`;

    // Build medium instruction
    let mediumInstruction;
    if (selectedMedium === 'Assamese') {
      mediumInstruction = 'Write ALL text in pure Assamese (অসমীয়া) script only. Zero English words anywhere.';
    } else if (selectedMedium === 'Hindi') {
      mediumInstruction = 'Write ALL question text in Hindi (हिंदी). Zero English words in questions.';
    } else {
      mediumInstruction = 'Write ALL question text in English.';
    }

    const qtypeDescriptions = qtypes.map(qt => {
      if (qt === 'MCQ') return '"MCQ" type with exactly 4 options';
      if (qt === 'ShortAnswer') return '"ShortAnswer" type (2–3 sentence answers)';
      if (qt === 'LongAnswer') return '"LongAnswer" type (paragraph answers)';
      return qt;
    }).join(', ');

    // Sentinel so validation can match chapter field
    const CHAPTER_SENTINEL = 'Chapter from Images';

    const textPrompt = `You are an expert school exam paper creator. Carefully read the textbook/chapter page(s) shown in the images, then generate a complete question paper based ONLY on the content visible in those pages.

STRICT REQUIREMENTS:
- Total questions: exactly ${totalQ}
- Total marks: ${totalMarks}
- Time: ${timeLimit} minutes
- Difficulty: ${difficulty}
- Include question types: ${qtypeDescriptions}
- Language rule: ${mediumInstruction}
- Every question's "chapter" field MUST be exactly the string: "${CHAPTER_SENTINEL}"
- MCQ questions MUST have exactly 4 options in the "options" array (e.g. ["A. ...", "B. ...", "C. ...", "D. ..."])
- Every question MUST have a non-empty "answer" field
${extraInstr ? `- Special instructions: ${extraInstr}` : ''}

Return ONLY valid JSON — no markdown fences, no explanation text. Use this exact structure:
{
  "sections": [
    {
      "type": "MCQ",
      "title": "Section A — Multiple Choice Questions",
      "questions": [
        { "qno": 1, "chapter": "${CHAPTER_SENTINEL}", "text": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "answer": "A. ...", "marks": 1 }
      ]
    },
    {
      "type": "ShortAnswer",
      "title": "Section B — Short Answer Questions",
      "questions": [
        { "qno": 5, "chapter": "${CHAPTER_SENTINEL}", "text": "...", "answer": "...", "marks": 2 }
      ]
    }
  ]
}`;

    const imageContents = uploadedImages.map(img => ({
      type: 'image',
      source: { type: 'base64', media_type: img.mediaType, data: img.data }
    }));

    const response = await fetch(CLAUDE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        temperature: 0.15,
        messages: [{ role: 'user', content: [...imageContents, { type: 'text', text: textPrompt }] }]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Claude API Error ${response.status}`);
    }

    const apiData = await response.json();
    const rawText = apiData.content?.[0]?.text?.trim();
    if (!rawText) throw new Error('Empty response from Claude Vision');

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)```|```\s*([\s\S]*?)```|\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[2] || jsonMatch[0]) : rawText;
      try { parsed = JSON.parse(jsonStr); } catch { throw new Error('Could not parse AI response as JSON'); }
    }

    const sentinelChapters = [CHAPTER_SENTINEL];
    let paperData = normalizeGeneratedPaper(parsed, qtypes, sentinelChapters);
    const validation = validateGeneratedPaper(paperData, { selectedChapters: sentinelChapters, qtypes, totalQ });
    if (!validation.ok) throw new Error(`Paper validation failed: ${validation.reason}`);

    paperData.meta = {
      board: '',
      schoolName,
      cls: imageClass,
      subject: imageSubject,
      topic: `${uploadedImages.length} uploaded page(s)`,
      totalMarks,
      timeLimit,
      withAnswers: planIncludesAnswers
    };
    currentPaperData = paperData;
    hasAnswersForCurrentPaper = planIncludesAnswers;

    if (window.currentUserData?.plan) {
      await saveGeneratedPaperHistory(paperData.meta);
    } else {
      await incrementDemoUsed();
    }

    renderPaper(paperData);
    showOutput('result');
    showPaperSaveWarning();
    updateCreditsDisplay();

  } catch (err) {
    if (creditReserved && typeof releaseReservedPaperCredit === 'function') {
      await releaseReservedPaperCredit();
    }
    if (err.code === 'examcraft/no-credits') { showCreditsExhaustedModal(); return; }
    showToast(err.message, 'error', 6000);
    showOutput('placeholder');
  }
}

function renderPaper(data) {
  const t = T[currentLang];
  const { meta, sections } = data;

  const watermarkOverlay = document.getElementById('watermarkOverlay');
  const unlockCallout = document.getElementById('unlockCallout');
  const exportBar = document.getElementById('exportBar');

  // Check if user has an active plan (even if credits are used)
  const ud = window.currentUserData;
  const hasPlan = !!ud?.plan;
  const planIncludesAnswers = hasPlan ? (ud?.includesAnswers || false) : false;
  
  // Check if user has a paid plan (questions should NOT be blurred for paid users)
  const userHasPaid = userHasPaidPlan();
  
  // Keep preview/export entitlement aligned so the last generated paid paper
  // stays downloadable even after its credit has just been consumed.
  const canExport = canUserExport();
  
  // For plan users without answers, show unlock callout
  const showUnlockCallout = !isPaid && !userHasPaid && !hasAnswersForCurrentPaper;

  if (!canExport) {
    if(watermarkOverlay) watermarkOverlay.classList.remove('hidden');
    if(showUnlockCallout && unlockCallout) unlockCallout.classList.remove('hidden');
    if(exportBar) {
      exportBar.style.opacity = '0.5';
      exportBar.style.pointerEvents = 'none';
      exportBar.title = "Payment required to export";
    }
    
    let wmHtml = '';
    for (let i = 0; i < 8; i++) {
        const top = (i % 4) * 24 + 6;
        const left = Math.floor(i / 4) * 48 + 4;
        wmHtml += `<span class="watermark-text" style="top:${top}%;left:${left}%">DEMO ONLY</span>`;
    }
    if(watermarkOverlay) watermarkOverlay.innerHTML = wmHtml;
  } else {
    if(watermarkOverlay) watermarkOverlay.classList.add('hidden');
    if(unlockCallout) unlockCallout.classList.add('hidden');
    if(exportBar) {
      exportBar.style.opacity = '1';
      exportBar.style.pointerEvents = 'auto';
      exportBar.title = "";
    }
  }

  const subjObj = window.SYLLABUS_DATA[meta.board]?.classes[meta.cls]?.subjects[meta.subject];
  const subjName = subjObj?.names?.[currentLang] || meta.subject;
  const clsName = window.SYLLABUS_DATA[meta.board]?.classes[meta.cls]?.names?.[currentLang] || meta.cls;
  const safeSchoolName = escapeHtml(meta.schoolName);
  const safeSubjName = escapeHtml(subjName);
  const safeClsName = escapeHtml(clsName);
  const safeTimeLimit = escapeHtml(meta.timeLimit);
  const safeTotalMarks = escapeHtml(meta.totalMarks);

  let html = `<div class="paper-header">
    <div class="paper-school-name">${safeSchoolName}</div>
    <div class="paper-exam-title">${escapeHtml(t.questPaper)} — ${safeSubjName} | ${safeClsName}</div>
    <div class="paper-meta">
      <span>${escapeHtml(t.classLabel)} ${safeClsName}</span> <span>${escapeHtml(t.subjectLabel)} ${safeSubjName}</span>
      <span>${escapeHtml(t.timeLabel)} ${safeTimeLimit} ${escapeHtml(t.mins)}</span> <span>${escapeHtml(t.marksLabel)} ${safeTotalMarks}</span>
    </div>
  </div>`;

  let qCount = 1;
  sections.forEach(sec => {
    const safeSectionTitle = escapeHtml(sec.title);
    html += `<div class="paper-section">
      <div class="paper-section-title">${safeSectionTitle}</div>`;
    sec.questions.forEach(q => {
      const blurClass = (!userHasPaid && !isPaid && qCount > DEMO_VISIBLE_QUESTIONS) ? 'blurred-text' : '';
      const safeQuestionText = escapeHtml(q.text);
      const safeQuestionMarks = escapeHtml(q.marks);
      html += `<div class="question-item ${blurClass}">
        <span class="qnum">Q${qCount}.</span> ${safeQuestionText} <span class="marks">[${safeQuestionMarks}M]</span>`;
      if (q.options) {
        html += `<div class="mcq-options">${q.options.map(o => `<div class="opt">${escapeHtml(o)}</div>`).join('')}</div>`;
      }
      html += `</div>`;
      qCount++;
    });
    html += `</div>`;
  });

  // Keep answer ownership separate from visibility so the UI can truly show/hide.
  const hasAnswerAccess = hasAnswersForCurrentPaper || planIncludesAnswers;
  const canViewAnswers = hasAnswerAccess && includeAnswers;
  const canUpgradeAnswers = canUseAnswerKeyUpgrade();
  
  // Answer Key Section - heading always visible, content locked for unpaid users
  html += `<div class="paper-marking-scheme" style="position:relative; border-radius:12px; overflow:hidden;">`;
  
  if (canViewAnswers) {
    // User owns answers and they are toggled ON — show full answer key
    html += `<div style="margin-top:40px; padding-top:20px; border-top: 3px dashed #e2e8f0;">
      <h3 style="color:#059669; font-weight:800; margin-bottom:15px; font-size:1.2rem;">🔑 ${escapeHtml(t.answerKey)}</h3>`;
    let aCount = 1;
    sections.forEach(sec => {
      sec.questions.forEach(q => {
        html += `<div style="margin-bottom:10px; font-size:0.9rem;">
            <b style="color:#334155">Q${aCount}.</b> ${escapeHtml(q.answer)}
        </div>`;
        aCount++;
      });
    });
    html += `</div>`;
  } else if (hasAnswerAccess) {
    // User owns the answers but has toggled them off — show the section heading with a "show" nudge, NO pay button
    html += `<div style="margin-top:40px; padding:20px 24px; background:linear-gradient(135deg, #f0fdf4, #ecfdf5); border:2px dashed #86efac; border-radius:12px; text-align:center;">
      <h3 style="color:#059669; font-weight:800; margin:0 0 6px 0; font-size:1.15rem;">🔑 ${escapeHtml(t.answerKey)}</h3>
      <p style="color:#64748b; font-size:0.85rem; margin:0 0 14px 0;">Answer key is ready — use the button above to show it.</p>
      <button onclick="handleAnswerKeyRequest()" style="padding:10px 24px; background:#059669; color:#fff; border:none; border-radius:8px; font-weight:700; font-size:0.95rem; cursor:pointer;">Show Answer Key</button>
    </div>`;
  } else {
    // User does NOT own answers — show lock overlay with pay button
    let aCount = 1;
    let lockedPlaceholder = '';
    sections.forEach(sec => {
      sec.questions.forEach(q => {
        lockedPlaceholder += `<span style="background:#e2e8f0; color:#94a3b8; padding:6px 12px; border-radius:6px; font-size:0.78rem; font-weight:600;">Q${aCount} • ${escapeHtml(q.marks)} Marks</span>`;
        aCount++;
      });
    });

    html += `<div style="margin-top:40px; padding:24px; background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%); border:2px dashed #86efac; border-radius:12px;">
      <h3 style="color:#059669; font-weight:800; margin:0 0 8px 0; font-size:1.25rem; letter-spacing:0.5px;">🔑 ${escapeHtml(t.answerKey)}</h3>
      <p style="color:#64748b; font-size:0.85rem; margin:0; font-weight:500;">Complete solutions & marking scheme for all questions</p>
      <div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">${lockedPlaceholder}</div>
    </div>`;

    html += `<div class="locked-content-overlay" style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,255,255,0.92); backdrop-filter:blur(4px); z-index:10; border-radius:12px;">
      <div style="text-align:center; padding:10px;">
        <div style="font-size:2.5rem; margin-bottom:12px;">🔒</div>
        <div style="font-size:1.15rem; font-weight:800; color:#0f172a; margin-bottom:4px;">Answer Key Locked</div>
        <div style="font-size:0.85rem; color:#475569; margin-bottom:20px; max-width:280px;">${canUpgradeAnswers ? `Pay once to unlock ${aCount - 1} answers with complete marking scheme.` : 'Unlock the question paper first. After that, you can add answers for this same paper for ₹11.'}</div>
        <button onclick="${canUpgradeAnswers ? 'handleAnswerKeyRequest()' : 'openQuestionPaperPricing()'}" style="padding:12px 28px; background:linear-gradient(135deg, #059669, #10b981); color:#fff; border:none; border-radius:10px; font-weight:800; font-size:1rem; cursor:pointer; box-shadow:0 4px 15px rgba(5,150,105,0.4); transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
          ${canUpgradeAnswers ? '🔓 Unlock All Answers' : '📄 Unlock Question Paper First'}
        </button>
        <div style="font-size:0.75rem; color:#94a3b8; margin-top:12px;">✅ Instant access &nbsp; ✅ PDF included</div>
      </div>
    </div>`;
  }
  
  html += `</div>`;

  const previewBox = document.getElementById('paperPreview');
  if(previewBox) previewBox.innerHTML = html;

  updateAnswerKeyBar();
}

// ---- ANSWER KEY BAR ----
function updateAnswerKeyBar() {
  const bar    = document.getElementById('answerKeyBar');
  const btn    = document.getElementById('answerKeyToggleBtn');
  const title  = document.getElementById('akBarTitle');
  const sub    = document.getElementById('akBarSub');
  if (!bar || !btn) return;

  if (!currentPaperData) { bar.style.display = 'none'; return; }
  bar.style.display = '';

  const ud = window.currentUserData;
  const hasPlan = !!ud?.plan;
  const planIncludesAnswers = hasPlan ? (ud?.includesAnswers || false) : false;
  const userHasPaid = userHasPaidPlan();

  const hasAnswerAccess = hasAnswersForCurrentPaper || planIncludesAnswers;
  const answersVisible = hasAnswerAccess && includeAnswers;

  if (answersVisible) {
    // User has answers visible - allow hiding them
    title.textContent = '✅ Answer Key Active';
    sub.textContent   = 'Showing answers & marking scheme below the paper.';
    btn.textContent   = 'Hide Answer Key';
    btn.style.background = '#059669';
  } else if (hasAnswerAccess) {
    // User already owns the answers, but they are currently hidden
    title.textContent = '🔑 Answer Key Ready';
    sub.textContent   = 'You already have access to the answer key for this paper.';
    btn.textContent   = 'Show Answer Key';
    btn.style.background = '#2563EB';
  } else if (isPaid && !includeAnswers) {
    // One-time payment completed but no answers selected
    title.textContent = '📋 Add Answer Key';
    sub.textContent   = 'Pay the answer key add-on to unlock answers for this paper.';
    btn.textContent   = 'Unlock Answer Key →';
    btn.style.background = '#E85D26';
  } else if (userHasPaid && !planIncludesAnswers) {
    // Paid plan user without answers - offer upgrade
    title.textContent = '🔑 Upgrade to Answer Key';
    sub.textContent   = 'Add answer key to your plan for this paper.';
    btn.textContent   = 'Add Answer Key →';
    btn.style.background = '#059669';
  } else {
    if (canUseAnswerKeyUpgrade()) {
      title.textContent = '📋 Want the Answer Key?';
      sub.textContent   = 'This paper is already unlocked. Add answers for this exact paper for ₹11.';
      btn.textContent   = 'Unlock Answers ₹11 →';
      btn.style.background = '#2563EB';
    } else {
      title.textContent = '📄 Unlock Question Paper First';
      sub.textContent   = 'First unlock the full question paper for ₹19. After that, the answer key can be added for ₹11.';
      btn.textContent   = 'Unlock Question Paper ₹19 →';
      btn.style.background = '#E85D26';
    }
  }
}

function handleAnswerKeyRequest() {
  const ud = window.currentUserData;
  const hasPlan = !!ud?.plan;
  const planIncludesAnswers = hasPlan ? (ud?.includesAnswers || false) : false;

  // If user already owns the answer key, toggle visibility.
  if (hasAnswersForCurrentPaper || planIncludesAnswers) {
    if (includeAnswers) {
      includeAnswers = false;
      renderPaper(currentPaperData);
      return;
    }

    includeAnswers = true;
    renderPaper(currentPaperData);
    // Scroll to answer key section after a brief delay for re-render
    setTimeout(() => {
      const answerKeySection = document.querySelector('.paper-marking-scheme');
      if (answerKeySection) {
        answerKeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return;
  }

  // Check if user has a generated paper to add answers to
  if (!canUseAnswerKeyUpgrade()) {
    showToast("Generate and unlock a question paper first (₹19), then return here to add the answer key for ₹11.", 'info');
    openQuestionPaperPricing();
    return;
  }

  // For plan users who have papers left but no answers, go to pricing
  if (hasPlan && !ud?.includesAnswers) {
    // Show pricing with Answer Key tab pre-selected
    switchTab('pricing');
    selectPlanType(1); // Answer Key Upgrade tab
    return;
  }

  // Default: go to pricing tab with Answer Key tab selected
  switchTab('pricing');
  selectPlanType(1); // Answer Key Upgrade tab
}

// ---- EXPORTS ----

function _buildPrintHTML(withAnswers) {
  if (!currentPaperData) return '';
  const { meta, sections } = currentPaperData;
  const t = T[currentLang];

  const subjObj = window.SYLLABUS_DATA?.[meta.board]?.classes?.[meta.cls]?.subjects?.[meta.subject];
  const subjName = subjObj?.names?.[currentLang] || meta.subject;
  const clsName  = window.SYLLABUS_DATA?.[meta.board]?.classes?.[meta.cls]?.names?.[currentLang] || meta.cls;
  const safeSchoolName = escapeHtml(meta.schoolName || 'Question Paper');
  const safeSubjName = escapeHtml(subjName);
  const safeClsName = escapeHtml(clsName);
  const safeTimeLimit = escapeHtml(meta.timeLimit);
  const safeTotalMarks = escapeHtml(meta.totalMarks);
  const safeQuestionPaperLabel = escapeHtml(t.questPaper || 'Question Paper');
  const safeClassLabel = escapeHtml(t.classLabel || 'Class:');
  const safeSubjectLabel = escapeHtml(t.subjectLabel || 'Subject:');
  const safeTimeLabel = escapeHtml(t.timeLabel || 'Time:');
  const safeMinsLabel = escapeHtml(t.mins || 'min');
  const safeMarksLabel = escapeHtml(t.marksLabel || 'Marks:');
  const safeAnswerKeyLabel = escapeHtml(t.answerKey || 'Answer Key');

  let questionsHTML = '';
  let qCount = 1;
  sections.forEach(sec => {
    const safeSectionTitle = escapeHtml(sec.title);
    questionsHTML += `<div class="p-section">
      <div class="p-section-title">${safeSectionTitle}</div>`;
    sec.questions.forEach(q => {
      const safeQuestionText = escapeHtml(q.text);
      const safeQuestionMarks = escapeHtml(q.marks);
      questionsHTML += `<div class="p-question">
        <span class="p-qnum">Q${qCount}.</span>
        <span class="p-qtext">${safeQuestionText}</span>
        <span class="p-marks">[${safeQuestionMarks}M]</span>`;
      if (q.options && q.options.length) {
        questionsHTML += `<div class="p-options">` +
          q.options.map(o => `<div class="p-opt">${escapeHtml(o)}</div>`).join('') +
          `</div>`;
      }
      questionsHTML += `</div>`;
      qCount++;
    });
    questionsHTML += `</div>`;
  });

  let answerHTML = '';
  if (withAnswers) {
    let aCount = 1;
    answerHTML = `<div class="p-answer-key">
      <h3>🔑 ${safeAnswerKeyLabel}</h3>`;
    sections.forEach(sec => {
      sec.questions.forEach(q => {
        answerHTML += `<div class="p-ans-row"><b>Q${aCount}.</b> ${escapeHtml(q.answer)}</div>`;
        aCount++;
      });
    });
    answerHTML += `</div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${safeSchoolName} — ${safeSubjName}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: "Times New Roman", Times, serif; font-size:13pt; color:#000; background:#fff; padding:20mm 18mm; }
  .p-header { text-align:center; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:18px; }
  .p-school { font-size:16pt; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
  .p-title  { font-size:13pt; font-weight:600; margin:4px 0; }
  .p-meta   { font-size:11pt; display:flex; justify-content:space-between; margin-top:8px; }
  .p-section { margin-bottom:18px; }
  .p-section-title { font-size:12pt; font-weight:700; border-bottom:1px solid #555; padding-bottom:4px; margin-bottom:10px; }
  .p-question { margin-bottom:12px; padding-left:4px; }
  .p-qnum  { font-weight:700; margin-right:4px; }
  .p-qtext { }
  .p-marks { font-weight:600; margin-left:6px; color:#333; }
  .p-options { margin:6px 0 0 20px; display:grid; grid-template-columns:1fr 1fr; gap:2px 16px; }
  .p-opt { font-size:12pt; }
  .p-answer-key { margin-top:30px; padding-top:16px; border-top:3px dashed #555; }
  .p-answer-key h3 { font-size:13pt; font-weight:700; margin-bottom:12px; color:#000; }
  .p-ans-row { margin-bottom:8px; font-size:12pt; }
  @media print {
    body { padding:10mm 12mm; }
    .p-header { page-break-after:avoid; }
    .p-section { page-break-inside:avoid; }
    .p-question { page-break-inside:avoid; }
    .p-answer-key { page-break-before:always; }
  }
</style>
</head>
<body>
  <div class="p-header">
    <div class="p-school">${safeSchoolName}</div>
    <div class="p-title">${safeQuestionPaperLabel} — ${safeSubjName} | ${safeClsName}</div>
    <div class="p-meta">
      <span>${safeClassLabel} ${safeClsName}</span>
      <span>${safeSubjectLabel} ${safeSubjName}</span>
      <span>${safeTimeLabel} ${safeTimeLimit} ${safeMinsLabel}</span>
      <span>${safeMarksLabel} ${safeTotalMarks}</span>
    </div>
  </div>
  ${questionsHTML}
  ${answerHTML}
</body>
</html>`;
}

function exportPDF() {
  if (!canUserExport()) { showToast("Please complete payment to download.", 'warn'); return; }
  if (!currentPaperData) { showToast("No paper generated yet.", 'info'); return; }

  const { meta, sections } = currentPaperData;
  const t = T[currentLang];
  const subjObj = window.SYLLABUS_DATA?.[meta.board]?.classes?.[meta.cls]?.subjects?.[meta.subject];
  const subjName = subjObj?.names?.[currentLang] || meta.subject;
  const clsName  = window.SYLLABUS_DATA?.[meta.board]?.classes?.[meta.cls]?.names?.[currentLang] || meta.cls;

  // Check if jsPDF is available
  const jsPDF = window.jspdf?.jsPDF || window.jsPDF;
  if (!jsPDF) {
    // Fallback to print if jsPDF not loaded
    const blob = new Blob([_buildPrintHTML(includeAnswers || userPlanIncludesAnswers())], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (!win) { showToast("Pop-up blocked. Please allow pop-ups for this site.", 'warn'); URL.revokeObjectURL(url); return; }
    win.addEventListener('load', () => { win.print(); URL.revokeObjectURL(url); });
    return;
  }

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 15;

    function checkPage(needed) {
      if (y + needed > 280) {
        doc.addPage();
        y = 15;
      }
    }

    // Reset text color to black
    doc.setTextColor(0, 0, 0);

    // Header - School Name
    checkPage(20);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(meta.schoolName || 'Question Paper', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${t.questPaper || 'Question Paper'} — ${subjName} | ${clsName}`, pageWidth / 2, y, { align: 'center' });
    y += 7;

    // Meta info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t.timeLabel || 'Time:'} ${meta.timeLimit} ${t.mins || 'min'}  |  ${t.marksLabel || 'Marks:'} ${meta.totalMarks}`, pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Questions
    let qCount = 1;
    sections.forEach(sec => {
      checkPage(15);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(sec.title, margin, y);
      y += 7;
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;

      sec.questions.forEach(q => {
        checkPage(20);
        const qText = `Q${qCount}. ${q.text}`;
        const marksText = `[${q.marks}${t.marks || 'M'}]`;

        // Split question text if too long
        const lines = doc.splitTextToSize(qText, contentWidth - 20);
        checkPage(lines.length * 5 + 5);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Q${qCount}.`, margin, y);
        doc.setFont('helvetica', 'normal');
        const qTextLines = doc.splitTextToSize(q.text, contentWidth - 25);
        doc.text(qTextLines, margin + 12, y);
        y += qTextLines.length * 5;

        // Marks aligned to right
        doc.setFontSize(8);
        doc.text(marksText, pageWidth - margin - 5, y - 5, { align: 'right' });

        // Options
        if (q.options && q.options.length) {
          y += 3;
          q.options.forEach(opt => {
            checkPage(8);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(opt, margin + 10, y);
            y += 5;
          });
        }
        y += 5;
        qCount++;
      });
    });

    // Answer Key (if included)
    const shouldExportAnswers = includeAnswers || userPlanIncludesAnswers();
    if (shouldExportAnswers) {
      checkPage(20);
      doc.addPage();
      y = 15;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 152, 110);
      doc.text(t.answerKey || 'Answer Key', pageWidth / 2, y, { align: 'center' });
      y += 10;
      doc.setTextColor(0, 0, 0);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      let aCount = 1;
      sections.forEach(sec => {
        sec.questions.forEach(q => {
          checkPage(12);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(51, 65, 85);
          doc.text(`Q${aCount}.`, margin, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          const ansLines = doc.splitTextToSize(q.answer || 'N/A', contentWidth - 20);
          doc.text(ansLines, margin + 15, y);
          y += Math.max(7, ansLines.length * 5);
          aCount++;
        });
      });
    }

    // Save PDF
    const fileName = `ExamPaper_${subjName}_Class${clsName}.pdf`.replace(/\s+/g, '_');
    doc.save(fileName);
  } catch (err) {
    showToast('PDF generation failed. Trying print fallback...', 'warn');
    // Fallback to print
    printPaper();
  }
}

function exportText() {
  if (!canUserExport()) { showToast("Please complete payment to download.", 'warn'); return; }
  if (!currentPaperData) { showToast("No paper generated yet.", 'info'); return; }

  const { meta, sections } = currentPaperData;
  const t = T[currentLang];
  const subjObj = window.SYLLABUS_DATA?.[meta.board]?.classes?.[meta.cls]?.subjects?.[meta.subject];
  const subjName = subjObj?.names?.[currentLang] || meta.subject;
  const clsName  = window.SYLLABUS_DATA?.[meta.board]?.classes?.[meta.cls]?.names?.[currentLang] || meta.cls;
  const line40   = '─'.repeat(40);

  let text = `${meta.schoolName || ''}\n`;
  text += `${t.questPaper || 'Question Paper'} — ${subjName} | ${clsName}\n`;
  text += `${t.timeLabel || 'Time:'} ${meta.timeLimit} ${t.mins || 'min'}  |  ${t.marksLabel || 'Marks:'} ${meta.totalMarks}\n`;
  text += `${'═'.repeat(50)}\n\n`;

  let qCount = 1;
  sections.forEach(sec => {
    text += `\n${sec.title}\n${line40}\n`;
    sec.questions.forEach(q => {
      text += `Q${qCount}. ${q.text}  [${q.marks}M]\n`;
      if (q.options && q.options.length) {
        q.options.forEach(o => { text += `    ${o}\n`; });
      }
      text += '\n';
      qCount++;
    });
  });

  if (includeAnswers || userPlanIncludesAnswers()) {
    text += `\n${'═'.repeat(50)}\n${t.answerKey || 'ANSWER KEY'}\n${'═'.repeat(50)}\n`;
    let aCount = 1;
    sections.forEach(sec => {
      sec.questions.forEach(q => {
        text += `Q${aCount}. ${q.answer}\n`;
        aCount++;
      });
    });
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `ExamPaper_${subjName}_Class${clsName}.txt`.replace(/\s+/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function printPaper() {
  if (!canUserExport()) { showToast("Please complete payment to print full paper.", 'warn'); return; }
  if (!currentPaperData) { showToast("No paper generated yet.", 'info'); return; }

  const blob = new Blob([_buildPrintHTML(includeAnswers || userPlanIncludesAnswers())], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (!win) { showToast("Pop-up blocked. Please allow pop-ups for this site.", 'warn'); URL.revokeObjectURL(url); return; }
  win.addEventListener('load', () => {
    win.print();
    URL.revokeObjectURL(url);
  });
}

// Show warning after paper generation
// Go back to home/generator from pricing
function backToHome() {
  if (currentPaperData) {
    switchTab('preview');
  } else {
    showOutput('placeholder');
  }
}

function openQuestionPaperPricing() {
  showOutput('result');
  switchTab('pricing');
  selectPlanType(0);
  setIncludeAnswers(false);
}

// Open pricing from home (without generating a paper first)
function openPricingFromHome() {
  openQuestionPaperPricing();
}

// Show warning after paper generation
function showPaperSaveWarning() {
  const exportBar = document.getElementById('exportBar');
  if (!exportBar) return;

  const warningId = 'paper-save-warning';
  if (document.getElementById(warningId)) return;

  const warning = document.createElement('div');
  warning.id = warningId;
  warning.className = 'paper-save-warning';
  warning.innerHTML = `
    <span class="warning-icon">⚠️</span>
    <div class="warning-text">
      <strong>Important!</strong> Download or print this paper now. You won't be able to access it again later.
    </div>
    <button class="warning-close" onclick="this.parentElement.remove()">✕</button>
  `;
  exportBar.parentNode.insertBefore(warning, exportBar.nextSibling);
}

// ---- THEME TOGGLE ----
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('themeIcon');
  body.classList.toggle('dark-theme');
  const isDark = body.classList.contains('dark-theme');
  if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('examcraft-theme', isDark ? 'dark' : 'light');
}

// Load saved theme on init
function loadTheme() {
  const saved = localStorage.getItem('examcraft-theme');
  const icon = document.getElementById('themeIcon');
  if (saved === 'dark') {
    document.body.classList.add('dark-theme');
    if (icon) icon.textContent = '☀️';
  } else {
    if (icon) icon.textContent = '🌙';
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  setLang('en');
  selectPlanType(0);

  // Show API key warning only for local development without a usable key
  const cfg = window.SMART_DIGITAL_CONFIG?.GROQ || window.GLOBAL_CONFIG || {};
  const apiKey = localStorage.getItem('groq_api_key') || cfg.API_KEY || '';
  const warning = document.getElementById('apiKeyWarning');
  if (warning) {
    const shouldShowWarning = isLocalEnvironment() && (!apiKey || apiKey === 'SECURE_PROXIED_VIA_NETLIFY');
    warning.textContent = 'Local development requires a Groq API key before generating papers.';
    warning.style.display = shouldShowWarning ? '' : 'none';
  }
});
