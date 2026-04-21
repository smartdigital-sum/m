# ExamCraft Payment Integration Plan

## Overview
This document started as the payment-gating implementation plan for ExamCraft. The current app already implements the core pricing modal and demo preview directly inside `app.js` / `firebase-auth.js`.

Current implemented behavior:

- After a paper is generated, demo users see the first 2 questions clearly and the rest blurred.
- The answer key stays locked until the user buys access.
- Export is blocked for demo users and enabled for unlocked users.
- User credits and history are stored in Firestore.
- Payment success is still simulated client-side for now; Razorpay is not wired yet.

## Stack
- Vanilla JS, dark navy theme
- CSS variables already defined in `style.css`
- Firebase Auth + Firestore
- Netlify function proxy for production AI calls
- Razorpay will be wired later — currently simulated with a timeout in `app.js`

---

## Files to Create / Edit

### Current Repo Status
This plan was originally written around a standalone `payment.js` module, but the current repo keeps the payment and gating logic inside:

- `apps/examcraft/app.js`
- `apps/examcraft/firebase-auth.js`
- `apps/examcraft/index.html`

There is currently **no `payment.js` file in use**.

**Key responsibilities:**
- `PRICING_PLANS` array — 3 tiers: Individual, Group/Coaching, School/Institute
- Demo mode: watermark + blur questions 3+ + lock marking scheme
- Export bar state: current app disables existing export buttons until unlocked
- Pricing modal: confirm → processing → success
- Credit tracking: Firestore plan credits + history
- Answer-key upgrade flow for already generated papers

The historical standalone `payment.js` design is kept below for reference only.

<details>
<summary>Full payment.js source</summary>

```javascript
/* ============================================================
   ExamCraft Pro — payment.js
   Handles: pricing plans, payment modal, paper gating (demo mode)
   Razorpay will be wired here later — currently simulated
   ============================================================ */

const PRICING_PLANS = [
  {
    id: "individual",
    icon: "👤",
    label: "Individual Teacher",
    tagline: "Pay per paper, no commitment",
    color: "#E85D26",
    options: [
      { id: "single",  label: "Single Paper",    papers: 1,   qOnly: 19,  qAndA: 30,  tag: null },
      { id: "pack5",   label: "5 Papers Pack",   papers: 5,   qOnly: 79,  qAndA: 124, tag: "Save ₹16" },
      { id: "pack15",  label: "15 Papers Pack",  papers: 15,  qOnly: 199, qAndA: 314, tag: "Most Popular" },
    ]
  },
  {
    id: "group",
    icon: "👥",
    label: "Group / Coaching",
    tagline: "For coaching centers & study groups",
    color: "#2563EB",
    options: [
      { id: "g20",  label: "20 Papers Pack",  papers: 20,  qOnly: 299,  qAndA: 479,  tag: "₹14.95/paper" },
      { id: "g50",  label: "50 Papers Pack",  papers: 50,  qOnly: 599,  qAndA: 929,  tag: "₹11.98/paper" },
      { id: "g100", label: "100 Papers Pack", papers: 100, qOnly: 999,  qAndA: 1499, tag: "Best Value" },
    ]
  },
  {
    id: "school",
    icon: "🏫",
    label: "School / Institute",
    tagline: "Unlimited papers + teacher dashboard",
    color: "#059669",
    options: [
      { id: "s_monthly", label: "Monthly Unlimited", papers: "∞", qOnly: 799,  qAndA: 999,  tag: "Up to 10 teachers" },
      { id: "s_term",    label: "Term (4 months)",   papers: "∞", qOnly: 2499, qAndA: 3199, tag: "Save ₹697" },
      { id: "s_yearly",  label: "Annual Unlimited",  papers: "∞", qOnly: 5999, qAndA: 7499, tag: "Save ₹3,589" },
    ]
  }
];

const Payment = (() => {
  // ---- STATE ----
  let locked = true;
  let paidAnswers = false;
  let activePlanIdx = 0;
  let activeOptionIdx = 0;
  let includeAnswers = false;
  let payMethod = "upi";
  let addingAnswerKeyOnly = false; // true when upgrading from Q-only to Q+A

  // ---- PUBLIC: called by app.js after renderPaper() ----
  function onPaperGenerated() {
    locked = true;
    paidAnswers = false;
    _applyDemoMode();
    _updateExportBar();
  }

  // ---- PUBLIC: reset on new generation ----
  function reset() {
    locked = true;
    paidAnswers = false;
    addingAnswerKeyOnly = false;
    _clearDemoMode();
    _updateExportBar();
  }

  // ---- PUBLIC: check locked state (used by app.js) ----
  function isLocked() { return locked; }
  function hasPaidAnswers() { return paidAnswers; }

  // ---- PUBLIC: open pricing modal ----
  function openPricingModal(withAnswers = false) {
    addingAnswerKeyOnly = false;
    includeAnswers = withAnswers;
    activePlanIdx = 0;
    activeOptionIdx = 0;
    payMethod = "upi";
    _renderModal("confirm");
  }

  // ---- PUBLIC: add answer key (post-unlock upgrade) ----
  function openAddAnswerKeyModal() {
    addingAnswerKeyOnly = true;
    includeAnswers = true;
    activePlanIdx = 0;
    activeOptionIdx = 0;
    payMethod = "upi";
    _renderModal("confirm");
  }

  // ---- APPLY DEMO MODE (watermark + blur) ----
  function _applyDemoMode() {
    const preview = document.getElementById('paperPreview');
    if (!preview) return;

    // Ensure relative positioning for watermark
    preview.style.position = 'relative';

    // Inject watermark
    if (!preview.querySelector('.paper-watermark')) {
      const wm = document.createElement('div');
      wm.className = 'paper-watermark';
      const positions = [
        { top: '8%',  left: '4%'  },
        { top: '8%',  left: '52%' },
        { top: '38%', left: '4%'  },
        { top: '38%', left: '52%' },
        { top: '68%', left: '4%'  },
        { top: '68%', left: '52%' },
      ];
      positions.forEach(pos => {
        const s = document.createElement('span');
        s.textContent = 'DEMO ONLY';
        s.style.top = pos.top;
        s.style.left = pos.left;
        wm.appendChild(s);
      });
      preview.appendChild(wm);
    }

    // Blur questions after 2nd
    const questions = preview.querySelectorAll('.question-item');
    questions.forEach((q, i) => {
      if (i >= 2) q.classList.add('question-blurred');
    });

    // Lock marking scheme section
    const scheme = preview.querySelector('.marking-scheme');
    if (scheme) {
      scheme.innerHTML = `
        <div class="scheme-locked">
          <div class="scheme-locked-icon">🔒</div>
          <div class="scheme-locked-title">Answer Key Locked</div>
          <p class="scheme-locked-text">Unlock the full paper to view the marking scheme and model answers.</p>
          <button class="scheme-unlock-btn" onclick="Payment.openPricingModal(true)">Unlock with Answers — ₹30</button>
        </div>`;
    }

    // Demo banner at top
    if (!preview.querySelector('.demo-banner')) {
      const banner = document.createElement('div');
      banner.className = 'demo-banner';
      banner.innerHTML = `<span>🔒 Demo Preview — Questions 3+ blurred · Answers locked</span><button onclick="Payment.openPricingModal()">Unlock Paper →</button>`;
      preview.insertBefore(banner, preview.firstChild);
    }
  }

  // ---- CLEAR DEMO MODE ----
  function _clearDemoMode() {
    const preview = document.getElementById('paperPreview');
    if (!preview) return;
    preview.querySelector('.paper-watermark')?.remove();
    preview.querySelector('.demo-banner')?.remove();
    preview.querySelectorAll('.question-blurred').forEach(el => el.classList.remove('question-blurred'));
    // scheme-locked will be replaced when renderPaper re-runs
  }

  // ---- UPDATE EXPORT BAR ----
  function _updateExportBar() {
    const unlockBar  = document.getElementById('unlockBar');
    const exportArea = document.getElementById('exportArea');
    const addKeyBtn  = document.getElementById('addAnswerKeyBtn');
    if (!unlockBar || !exportArea) return;

    if (locked) {
      unlockBar.classList.remove('hidden');
      exportArea.classList.add('hidden');
    } else {
      unlockBar.classList.add('hidden');
      exportArea.classList.remove('hidden');
      // Show "Add Answer Key" button only if answers not yet paid
      if (addKeyBtn) {
        addKeyBtn.style.display = paidAnswers ? 'none' : '';
      }
    }
  }

  // ---- MODAL RENDER ----
  function _renderModal(step) {
    let mount = document.getElementById('paymentModalMount');
    if (!mount) {
      mount = document.createElement('div');
      mount.id = 'paymentModalMount';
      document.body.appendChild(mount);
    }

    if (step === "confirm") {
      mount.innerHTML = _buildConfirmHTML();
    } else if (step === "paying") {
      mount.innerHTML = _buildPayingHTML();
      setTimeout(() => _renderModal("done"), 2200);
    } else if (step === "done") {
      mount.innerHTML = _buildDoneHTML();
    }
  }

  function _closeModal() {
    const mount = document.getElementById('paymentModalMount');
    if (mount) mount.innerHTML = '';
  }

  function _getPrice() {
    const plan = PRICING_PLANS[activePlanIdx];
    const opt  = plan.options[activeOptionIdx];
    if (addingAnswerKeyOnly) return 11; // flat add-on price
    return includeAnswers ? opt.qAndA : opt.qOnly;
  }

  function _buildConfirmHTML() {
    const plan = PRICING_PLANS[activePlanIdx];
    const opt  = plan.options[activeOptionIdx];
    const price = _getPrice();
    const gst   = Math.round(price * 0.18);
    const total  = price + gst;

    // Plan tabs
    const planTabs = PRICING_PLANS.map((p, i) => `
      <button class="pm-plan-tab ${i === activePlanIdx ? 'active' : ''}"
        style="${i === activePlanIdx ? `background:${p.color};border-color:${p.color};` : ''}"
        onclick="Payment._setPlan(${i})">${p.icon} ${p.label}</button>
    `).join('');

    // Option cards
    const optCards = plan.options.map((o, i) => {
      const p = includeAnswers ? o.qAndA : o.qOnly;
      const isSelected = i === activeOptionIdx;
      return `
        <div class="pm-option-card ${isSelected ? 'selected' : ''}"
          style="${isSelected ? `border-color:${plan.color};box-shadow:0 0 0 2px ${plan.color}40;` : ''}"
          onclick="Payment._setOption(${i})">
          ${o.tag ? `<div class="pm-option-tag" style="background:${plan.color}">${o.tag}</div>` : ''}
          <div class="pm-option-label">${o.label}</div>
          <div class="pm-option-price" style="color:${plan.color}">₹${p}</div>
          <div class="pm-option-sub">${typeof o.papers === 'number' ? `${o.papers} paper${o.papers > 1 ? 's' : ''}` : 'Unlimited'}${includeAnswers ? ' + answers' : ''}</div>
        </div>`;
    }).join('');

    // Payment methods
    const methods = [
      { id: "upi",  label: "UPI / GPay / PhonePe", icon: "📱" },
      { id: "card", label: "Debit / Credit Card",  icon: "💳" },
      { id: "net",  label: "Net Banking",           icon: "🏦" },
    ];
    const methodRows = methods.map(m => `
      <div class="pm-method-row ${payMethod === m.id ? 'selected' : ''}"
        style="${payMethod === m.id ? `border-color:${plan.color};background:${plan.color}18;` : ''}"
        onclick="Payment._setMethod('${m.id}')">
        <span class="pm-method-icon">${m.icon}</span>
        <span class="pm-method-label">${m.label}</span>
        ${payMethod === m.id ? `<span class="pm-method-check" style="color:${plan.color}">✓</span>` : ''}
      </div>`).join('');

    const answerKeySection = addingAnswerKeyOnly ? `
      <div class="pm-upgrade-note">
        <span>📋 Adding Answer Key to your existing paper — flat fee ₹11</span>
      </div>` : `
      <div class="pm-answer-toggle">
        <div class="pm-answer-toggle-label">
          <div class="pm-field-title">📋 Include Answer Key?</div>
          <div class="pm-field-sub">Step-by-step solutions for every question</div>
        </div>
        <div class="pm-toggle-btns">
          <button class="pm-toggle-btn ${!includeAnswers ? 'active-q' : ''}" onclick="Payment._setAnswers(false)">📄 Q Only  ₹19</button>
          <button class="pm-toggle-btn ${includeAnswers ? 'active-a' : ''}" onclick="Payment._setAnswers(true)">📄+✅ With Answers  ₹30</button>
        </div>
      </div>`;

    return `
      <div class="pm-overlay" id="pmOverlay" onclick="Payment._overlayClick(event)">
        <div class="pm-box">
          <div class="pm-header">
            <div>
              <div class="pm-header-title">${addingAnswerKeyOnly ? '📋 Add Answer Key' : '🔓 Unlock Your Paper'}</div>
              <div class="pm-header-sub">${addingAnswerKeyOnly ? 'Get step-by-step solutions for ₹11' : 'Choose a plan that works for you'}</div>
            </div>
            <button class="pm-close" onclick="Payment._closeModal()">✕</button>
          </div>

          <div class="pm-body">
            ${!addingAnswerKeyOnly ? `<div class="pm-plan-tabs">${planTabs}</div>` : ''}

            ${answerKeySection}

            ${!addingAnswerKeyOnly ? `<div class="pm-options-grid">${optCards}</div>` : ''}

            <div class="pm-breakdown">
              ${includeAnswers && !addingAnswerKeyOnly ? `
                <div class="pm-breakdown-row"><span>Question Paper</span><span>₹${opt.qOnly}</span></div>
                <div class="pm-breakdown-row accent"><span>Answer Key add-on</span><span>+₹${opt.qAndA - opt.qOnly}</span></div>
              ` : `
                <div class="pm-breakdown-row"><span>${addingAnswerKeyOnly ? 'Answer Key' : 'Question Paper'}</span><span>₹${price}</span></div>
              `}
              <div class="pm-breakdown-row"><span>GST (18%)</span><span>₹${gst}</span></div>
              <div class="pm-breakdown-total"><span>Total</span><span>₹${total}</span></div>
            </div>

            <div class="pm-methods-title">Payment Method</div>
            <div class="pm-methods">${methodRows}</div>

            <button class="pm-pay-btn" style="background:${plan.color}" onclick="Payment._startPayment()">
              Pay ₹${total} →
            </button>
            <div class="pm-secure-note">🔒 Secured by Razorpay · 256-bit SSL</div>
          </div>
        </div>
      </div>`;
  }

  function _buildPayingHTML() {
    return `
      <div class="pm-overlay">
        <div class="pm-box">
          <div class="pm-paying">
            <div class="pm-spinner">⏳</div>
            <div class="pm-paying-title">Processing Payment…</div>
            <div class="pm-paying-sub">Do not close this window</div>
          </div>
        </div>
      </div>`;
  }

  function _buildDoneHTML() {
    const willIncludeAnswers = includeAnswers || addingAnswerKeyOnly;
    return `
      <div class="pm-overlay">
        <div class="pm-box">
          <div class="pm-success">
            <div class="pm-success-icon">🎉</div>
            <div class="pm-success-title">Payment Successful!</div>
            <div class="pm-success-sub">${addingAnswerKeyOnly ? 'Answer Key unlocked' : (includeAnswers ? 'Full paper + Answer Key unlocked' : 'Full paper unlocked')} &nbsp;✅</div>
            <button class="pm-success-btn" onclick="Payment._handleSuccess()">
              View & Download ↓
            </button>
          </div>
        </div>
      </div>`;
  }

  // ---- INTERNAL HANDLERS (called from modal HTML) ----
  function _setPlan(idx) {
    activePlanIdx = idx;
    activeOptionIdx = 0;
    _renderModal("confirm");
  }

  function _setOption(idx) {
    activeOptionIdx = idx;
    _renderModal("confirm");
  }

  function _setAnswers(val) {
    includeAnswers = val;
    _renderModal("confirm");
  }

  function _setMethod(m) {
    payMethod = m;
    _renderModal("confirm");
  }

  function _startPayment() {
    _renderModal("paying");
  }

  function _overlayClick(e) {
    if (e.target.id === 'pmOverlay') _closeModal();
  }

  function _handleSuccess() {
    locked = false;
    if (includeAnswers || addingAnswerKeyOnly) paidAnswers = true;

    _clearDemoMode();

    // If answers were paid for, re-render paper so marking scheme appears
    if (paidAnswers && typeof renderPaper === 'function' && typeof currentPaperData !== 'undefined' && currentPaperData) {
      renderPaper(currentPaperData);
    }

    _updateExportBar();
    _closeModal();
  }

  // Expose internal methods needed by inline onclick handlers
  return {
    onPaperGenerated,
    reset,
    isLocked,
    hasPaidAnswers,
    openPricingModal,
    openAddAnswerKeyModal,
    // internal (called from modal HTML)
    _setPlan,
    _setOption,
    _setAnswers,
    _setMethod,
    _startPayment,
    _overlayClick,
    _closeModal,
    _handleSuccess,
  };
})();
```

</details>

---

### FILE 2 — EDIT `index.html`

#### Edit A: Replace the `<div class="export-bar">` block (lines 167–185)

Find this exact block:
```html
      <!-- Export Bar -->
      <div class="export-bar">
        <span class="export-label" data-en="Export as:" data-hi="निर्यात करें:" data-as="ৰপ্তানি কৰক:">Export as:</span>
        <button class="export-btn pdf-btn" onclick="exportPDF()">
          ...PDF button...
        </button>
        <button class="export-btn docx-btn" onclick="exportDOCX()">
          ...DOCX button...
        </button>
        <button class="export-btn print-btn" onclick="printPaper()">
          ...Print button...
        </button>
        <button class="export-btn regen-btn" onclick="generatePaper()">
          ...Regenerate button...
        </button>
      </div>
```

Replace with:
```html
      <!-- Export Bar -->
      <div class="export-bar">
        <!-- LOCKED: shown after generation before payment -->
        <div id="unlockBar" class="hidden">
          <span class="export-label">🔒 Demo Preview:</span>
          <button class="export-btn unlock-btn" onclick="Payment.openPricingModal()">
            🔓 Unlock Paper
          </button>
          <button class="export-btn unlock-ans-btn" onclick="Payment.openPricingModal(true)">
            📋 + Answer Key
          </button>
          <button class="export-btn regen-btn" onclick="generatePaper()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            <span data-en="Regenerate" data-hi="पुनः बनाएं" data-as="পুনৰায় তৈয়াৰ কৰক">Regenerate</span>
          </button>
        </div>
        <!-- UNLOCKED: shown after payment -->
        <div id="exportArea" class="hidden">
          <span class="export-label" data-en="Export as:" data-hi="निर्यात करें:" data-as="ৰপ্তানি কৰক:">Export as:</span>
          <button class="export-btn pdf-btn" onclick="exportPDF()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            PDF
          </button>
          <button class="export-btn docx-btn" onclick="exportDOCX()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            DOCX
          </button>
          <button class="export-btn print-btn" onclick="printPaper()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span data-en="Print" data-hi="प्रिंट" data-as="প্ৰিণ্ট">Print</span>
          </button>
          <button id="addAnswerKeyBtn" class="export-btn add-answer-btn" onclick="Payment.openAddAnswerKeyModal()" style="display:none">
            ✅ Add Answer Key +₹11
          </button>
          <button class="export-btn regen-btn" onclick="generatePaper()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            <span data-en="Regenerate" data-hi="पुनः बनाएं" data-as="পুনৰায় তৈয়াৰ কৰক">Regenerate</span>
          </button>
        </div>
      </div>
```

#### Edit B: Before `</body>` (last line of body), add:
```html
<div id="paymentModalMount"></div>
<script src="payment.js"></script>
```

The final lines should look like:
```html
<script src="syllabus-data.js"></script>
<script src="prompt-templates.js"></script>
<script src="app.js"></script>
<div id="paymentModalMount"></div>
<script src="payment.js"></script>
</body>
</html>
```

---

### FILE 3 — EDIT `app.js`

Three surgical changes:

#### Edit A: In `generatePaper()` — add Payment.reset() call
Find the block right after the validation checks (after the `qtypes.length === 0` alert block):
```js
  if (qtypes.length === 0) {
    alert('Please select at least one question type.');
    return;
  }

  // Show loading
```

Insert between `return;` and `// Show loading`:
```js
  // Reset payment state for new paper
  if (typeof Payment !== 'undefined') Payment.reset();
```

#### Edit B: In `renderPaper(data)` — add Payment.onPaperGenerated() hook
Find the last line of `renderPaper`:
```js
  document.getElementById('paperPreview').innerHTML = html;
```

Append after it:
```js
  // Apply payment gating after render
  if (typeof Payment !== 'undefined') Payment.onPaperGenerated();
```

#### Edit C: Fix broken `apiKeyWarning` reference in DOMContentLoaded
Find:
```js
  if (localStorage.getItem('ec_api_key')) {
    document.getElementById('apiKeyWarning').classList.add('hidden');
  }
```

Replace with:
```js
  const apiKeyWarning = document.getElementById('apiKeyWarning');
  if (apiKeyWarning && localStorage.getItem('ec_api_key')) {
    apiKeyWarning.classList.add('hidden');
  }
```

---

### FILE 4 — APPEND to `style.css`

Append the entire CSS block below at the very end of `style.css`. It covers:
- `.paper-watermark` — absolute positioned DEMO ONLY text spans
- `.question-blurred` — blur filter on locked questions
- `.demo-banner` — red banner at top of preview
- `.scheme-locked` — lock placeholder for answer key
- `.unlock-btn`, `.unlock-ans-btn`, `.add-answer-btn` — export bar button styles
- `.pm-overlay`, `.pm-box`, `.pm-header`, `.pm-body` — modal shell
- `.pm-plan-tabs`, `.pm-plan-tab` — tier selector tabs
- `.pm-answer-toggle`, `.pm-toggle-btns`, `.pm-toggle-btn` — Q-only vs Q+A toggle
- `.pm-options-grid`, `.pm-option-card`, `.pm-option-tag` — pricing cards
- `.pm-breakdown`, `.pm-breakdown-row`, `.pm-breakdown-total` — price summary
- `.pm-methods`, `.pm-method-row` — payment method selector
- `.pm-pay-btn`, `.pm-secure-note` — CTA button
- `.pm-paying`, `.pm-spinner` — processing state with spin animation
- `.pm-success` — success state
- `.pm-upgrade-note` — add-on note
- `@media print` overrides to hide all payment UI

Full CSS block to append: (copy from the original prompt's FILE 4 section)

---

## Implementation Order

1. Create `payment.js` (standalone, no dependencies to edit first)
2. Edit `app.js` (3 edits — read first, make surgical changes)
3. Edit `index.html` (replace export-bar block + add modal mount + script tag)
4. Append CSS to `style.css`

## How It All Connects

```
generatePaper()
  └── Payment.reset()          ← clears demo mode, hides both bars

renderPaper(data)
  └── Payment.onPaperGenerated()
        ├── _applyDemoMode()   ← adds watermark, blurs Q3+, locks scheme, adds banner
        └── _updateExportBar() ← shows #unlockBar, hides #exportArea

User clicks "Unlock Paper"
  └── Payment.openPricingModal()
        └── _renderModal("confirm") → _renderModal("paying") → _renderModal("done")
              └── Payment._handleSuccess()
                    ├── locked = false
                    ├── _clearDemoMode()
                    ├── renderPaper() (only if paidAnswers, to restore scheme)
                    └── _updateExportBar() ← hides #unlockBar, shows #exportArea
```

## Notes for Next Agent

- The `#unlockBar` and `#exportArea` divs both start with class `hidden` (CSS `display:none`)
- `Payment._updateExportBar()` toggles them based on `locked` state
- Before this integration, the export bar had no locking — all export buttons were always visible
- The `apiKeyWarning` element does not exist in the current HTML — that's a pre-existing bug fixed in Edit C of app.js
- No external payment SDK is needed yet — `_startPayment()` just sets a 2.2s timeout then shows success
- When Razorpay is wired later, replace `_startPayment()` body with the Razorpay SDK call
- `currentPaperData` and `renderPaper` are globals in `app.js` — `payment.js` accesses them directly (no module system)
