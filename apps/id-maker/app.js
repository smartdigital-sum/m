/* =============================================
   Smart Digital ID Card & Certificate Maker
   app.js
   ============================================= */

let currentMode = 'id';
let idAccentColor = '#6366f1';
let certAccentColor = '#6366f1';
let photoDataUrl = null;
let currentIdTemplate = 'school';
let currentCertTemplate = 'achievement';

const CERT_BADGE = {
  achievement:   { icon: '🏆', title: 'CERTIFICATE OF ACHIEVEMENT' },
  participation: { icon: '🌟', title: 'CERTIFICATE OF PARTICIPATION' },
  appreciation:  { icon: '🙏', title: 'CERTIFICATE OF APPRECIATION' },
  completion:    { icon: '📜', title: 'CERTIFICATE OF COMPLETION' }
};

// ─── MODE SWITCH ─────────────────────────────────────────────
function setMode(mode, btn) {
  currentMode = mode;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('id-form').classList.toggle('active', mode === 'id');
  document.getElementById('cert-form').classList.toggle('active', mode === 'cert');
  document.getElementById('id-preview-wrap').style.display = mode === 'id' ? 'flex' : 'none';
  document.getElementById('cert-preview-wrap').style.display = mode === 'cert' ? 'flex' : 'none';
}

// ─── ID TEMPLATE ─────────────────────────────────────────────
function setIdTemplate(tmpl, btn) {
  currentIdTemplate = tmpl;
  document.querySelectorAll('#id-template-list .tmpl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const card = document.getElementById('id-card');
  card.className = 'id-card ' + tmpl + '-tmpl';

  // Adjust labels
  const label1 = document.getElementById('id-field1-label');
  const label2 = document.getElementById('id-field2-label');
  const f1 = document.getElementById('id-field1');
  const f2 = document.getElementById('id-field2');

  if (tmpl === 'school') {
    label1.textContent = 'Class / Section';
    label2.textContent = 'Parent Phone';
    f1.placeholder = 'Class X – A';
    f2.placeholder = '+91 98765 43210';
    document.getElementById('id-field1').parentElement.querySelector('.fas') && null;
    updateFieldIcon('prev-field1', 'fas fa-graduation-cap');
    updateFieldIcon('prev-field2', 'fas fa-phone');
  } else if (tmpl === 'office') {
    label1.textContent = 'Designation';
    label2.textContent = 'Department';
    f1.placeholder = 'Senior Manager';
    f2.placeholder = 'Sales & Marketing';
    updateFieldIcon('prev-field1', 'fas fa-briefcase');
    updateFieldIcon('prev-field2', 'fas fa-building');
  } else if (tmpl === 'club') {
    label1.textContent = 'Role / Title';
    label2.textContent = 'Membership No.';
    f1.placeholder = 'Vice President';
    f2.placeholder = 'MEM-2025-042';
    updateFieldIcon('prev-field1', 'fas fa-star');
    updateFieldIcon('prev-field2', 'fas fa-hashtag');
  }

  renderCard();
}

function updateFieldIcon(elId, iconClass) {
  const el = document.getElementById(elId);
  if (el) {
    const i = el.querySelector('i');
    if (i) i.className = iconClass;
  }
}

// ─── CERT TEMPLATE ───────────────────────────────────────────
function setCertTemplate(tmpl, btn) {
  currentCertTemplate = tmpl;
  document.querySelectorAll('#cert-template-list .tmpl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCert();
}

// ─── COLORS ──────────────────────────────────────────────────
function setAccentColor(color, btn) {
  idAccentColor = color;
  if (btn) {
    document.querySelectorAll('#id-form .swatch').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  applyIdAccent(color);
  renderCard();
}

function applyIdAccent(color) {
  const card = document.getElementById('id-card');
  card.style.setProperty('--accent', color);
  // also update photo border & valid text
  const photoPlaceholder = card.querySelector('.id-photo-placeholder');
  if (photoPlaceholder) photoPlaceholder.style.borderColor = color;
  const photoImg = card.querySelector('#prev-photo');
  if (photoImg) photoImg.style.borderColor = color;
  const validEl = card.querySelector('#prev-valid');
  if (validEl) validEl.style.color = color;
  const issuerEl = card.querySelector('#id-header-el');
  if (issuerEl) issuerEl.style.background = color;
  const idFields = card.querySelectorAll('.id-field i');
  idFields.forEach(i => i.style.color = color);
}

function setCertAccent(color, btn) {
  certAccentColor = color;
  if (btn) {
    document.querySelectorAll('#cert-form .swatch').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const card = document.getElementById('cert-card');
  card.style.setProperty('--accent', color);
  // Update elements
  const outer = card.querySelector('.cert-border-outer');
  if (outer) outer.style.borderColor = color;
  const inner = card.querySelector('.cert-border-inner');
  if (inner) inner.style.borderColor = color + '33';
  const issuer = card.querySelector('.cert-issuer');
  if (issuer) issuer.style.color = color;
  const forText = card.querySelector('.cert-for-text');
  if (forText) forText.style.color = color;
  const divider = card.querySelector('.cert-divider');
  if (divider) divider.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
}

// ─── PHOTO ───────────────────────────────────────────────────
function loadPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    photoDataUrl = e.target.result;
    // show preview in upload area
    const img = document.getElementById('photoPreviewImg');
    img.src = photoDataUrl;
    img.style.display = 'block';
    document.getElementById('photoPlaceholder').style.display = 'none';
    document.getElementById('removePhotoBtn').style.display = 'inline-flex';
    renderCard();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  photoDataUrl = null;
  document.getElementById('photoPreviewImg').style.display = 'none';
  document.getElementById('photoPlaceholder').style.display = 'flex';
  document.getElementById('removePhotoBtn').style.display = 'none';
  document.getElementById('photoInput').value = '';
  renderCard();
}

// ─── RENDER ID CARD ──────────────────────────────────────────
function renderCard() {
  const org     = document.getElementById('id-org').value.trim() || 'Organisation Name';
  const name    = document.getElementById('id-name').value.trim() || 'Full Name';
  const field1  = document.getElementById('id-field1').value.trim() || '—';
  const field2  = document.getElementById('id-field2').value.trim() || '—';
  const idNo    = document.getElementById('id-number').value.trim() || '—';
  const valid   = document.getElementById('id-valid').value.trim();
  const address = document.getElementById('id-address').value.trim();

  setText('prev-org', org);
  setText('prev-name', name);
  setFieldText('prev-field1', field1);
  setFieldText('prev-field2', field2);
  setFieldText('prev-id-number', idNo);

  const validEl = document.getElementById('prev-valid');
  if (validEl) validEl.textContent = valid ? 'Valid: ' + valid : '';

  const addrEl = document.getElementById('prev-address');
  if (addrEl) addrEl.textContent = address;

  // org logo initials
  const logoEl = document.querySelector('.id-org-logo');
  if (logoEl) logoEl.textContent = org.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'SD';

  // photo
  const prevPhoto = document.getElementById('prev-photo');
  const prevPh = document.getElementById('prev-photo-placeholder');
  if (photoDataUrl) {
    prevPhoto.src = photoDataUrl;
    prevPhoto.style.display = 'block';
    prevPh.style.display = 'none';
  } else {
    prevPhoto.style.display = 'none';
    prevPh.style.display = 'flex';
  }

  applyIdAccent(idAccentColor);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setFieldText(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const span = el.querySelector('span');
  if (span) span.textContent = val;
  else el.childNodes[el.childNodes.length - 1].textContent = ' ' + val;
}

// ─── RENDER CERTIFICATE ──────────────────────────────────────
function renderCert() {
  const org      = document.getElementById('cert-org').value.trim() || 'Organisation Name';
  const name     = document.getElementById('cert-name').value.trim() || 'Recipient Name';
  const title    = document.getElementById('cert-title').value.trim() || 'Certificate Title';
  const desc     = document.getElementById('cert-desc').value.trim() || '';
  const date     = document.getElementById('cert-date').value.trim() || '';
  const no       = document.getElementById('cert-no').value.trim() || '';
  const signName = document.getElementById('cert-sign-name').value.trim() || 'Authorised Signatory';
  const signTitle= document.getElementById('cert-sign-title').value.trim() || '';

  const badge = CERT_BADGE[currentCertTemplate] || CERT_BADGE.achievement;

  setText('cert-badge-icon', badge.icon);
  setText('prev-cert-org', org.toUpperCase());
  setText('prev-cert-name', name);
  setText('prev-cert-title', badge.title);
  setText('prev-cert-desc', desc);
  setText('prev-cert-date', date);
  setText('prev-cert-no', no);
  setText('prev-cert-sign-name', signName);
  setText('prev-cert-sign-title', signTitle);

  // Update the "for text" to include user's title below badge title
  const forEl = document.getElementById('prev-cert-title');
  if (forEl && title) {
    forEl.innerHTML = badge.title + '<br><span style="font-size:11px;font-weight:500;opacity:0.7;">' + title + '</span>';
  }

  setCertAccent(certAccentColor);
}

// ─── DOWNLOAD ────────────────────────────────────────────────
async function downloadCurrent() {
  const targetId = currentMode === 'id' ? 'id-card' : 'cert-card';
  const el = document.getElementById(targetId);
  if (!el) return;

  showToast('Preparing download...', '');
  try {
    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const link = document.createElement('a');
    const name = currentMode === 'id'
      ? (document.getElementById('id-name').value.trim() || 'id-card')
      : (document.getElementById('cert-name').value.trim() || 'certificate');
    link.download = `smartdigital-${currentMode === 'id' ? 'id-card' : 'certificate'}-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Downloaded successfully!', 'success');
  } catch (e) {
    showToast('Download failed — please try again', 'error');
    console.error(e);
  }
}

// ─── THEME ───────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById('themeIcon');
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    icon.className = 'fas fa-sun';
    localStorage.setItem('idmaker-theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    icon.className = 'fas fa-moon';
    localStorage.setItem('idmaker-theme', 'dark');
  }
}

// ─── TOAST ───────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type = '') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  if (type === 'success') toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + msg;
  else if (type === 'error') toast.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + msg;
  else toast.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + msg;
  toast.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  if (type !== '') toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Restore theme
  const saved = localStorage.getItem('idmaker-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeIcon').className = 'fas fa-sun';
  }

  // Set today's date in cert form
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const certDateEl = document.getElementById('cert-date');
  if (certDateEl && !certDateEl.value) certDateEl.value = dateStr;

  // Initial render
  applyIdAccent(idAccentColor);
  setCertAccent(certAccentColor);
  renderCard();
  renderCert();
});
