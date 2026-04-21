/* =============================================
   Smart Digital QR Generator — app.js
   ============================================= */

let currentType = 'url';
let qrInstance = null;
let debounceTimer = null;

// ---- TYPE SWITCHING ----
function setType(type, btn) {
  currentType = type;
  document.querySelectorAll('.qr-form').forEach(f => f.classList.remove('active'));
  document.getElementById('form-' + type).classList.add('active');
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  liveGenerate();
}

// ---- BUILD QR DATA STRING ----
function buildQRData() {
  switch (currentType) {
    case 'url': {
      const url = document.getElementById('input-url').value.trim();
      if (!url) return null;
      return url.startsWith('http') ? url : 'https://' + url;
    }
    case 'whatsapp': {
      const num = document.getElementById('input-wa-number').value.trim().replace(/\s+/g, '').replace(/^\+/, '');
      const msg = document.getElementById('input-wa-msg').value.trim();
      if (!num) return null;
      const base = 'https://wa.me/' + num;
      return msg ? base + '?text=' + encodeURIComponent(msg) : base;
    }
    case 'upi': {
      const id = document.getElementById('input-upi-id').value.trim();
      const name = document.getElementById('input-upi-name').value.trim();
      const amount = document.getElementById('input-upi-amount').value.trim();
      const note = document.getElementById('input-upi-note').value.trim();
      if (!id) return null;
      let upi = `upi://pay?pa=${encodeURIComponent(id)}`;
      if (name) upi += `&pn=${encodeURIComponent(name)}`;
      if (amount) upi += `&am=${amount}`;
      if (note) upi += `&tn=${encodeURIComponent(note)}`;
      upi += '&cu=INR';
      return upi;
    }
    case 'text': {
      const text = document.getElementById('input-text').value.trim();
      return text || null;
    }
    case 'phone': {
      const phone = document.getElementById('input-phone').value.trim().replace(/\s+/g, '');
      if (!phone) return null;
      return 'tel:' + (phone.startsWith('+') ? phone : '+91' + phone.replace(/^0/, ''));
    }
    default:
      return null;
  }
}

// ---- LIVE GENERATE (debounced) ----
function liveGenerate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateQR, 300);
}

// ---- GENERATE QR ----
function generateQR() {
  const data = buildQRData();
  const output = document.getElementById('qrOutput');
  const actions = document.getElementById('qrActions');
  const meta = document.getElementById('qrMeta');

  if (!data) {
    output.innerHTML = `<div class="qr-placeholder">
      <i class="fas fa-qrcode"></i>
      <p>Fill in the details on the left<br>to generate your QR code</p>
    </div>`;
    actions.style.display = 'none';
    meta.style.display = 'none';
    qrInstance = null;
    return;
  }

  const size = parseInt(document.getElementById('qrSize').value);
  const errorLevel = document.getElementById('qrError').value;
  const fg = document.getElementById('qrFg').value;
  const bg = document.getElementById('qrBg').value;

  // Clear previous
  output.innerHTML = '';
  qrInstance = null;

  try {
    qrInstance = new QRCode(output, {
      text: data,
      width: Math.min(size, 400),
      height: Math.min(size, 400),
      colorDark: fg,
      colorLight: bg,
      correctLevel: QRCode.CorrectLevel[errorLevel]
    });

    actions.style.display = 'flex';
    meta.style.display = 'block';
    meta.innerHTML = `<strong>Data:</strong> ${data.length > 80 ? data.substring(0, 80) + '...' : data}`;
  } catch (e) {
    output.innerHTML = `<div class="qr-placeholder">
      <i class="fas fa-exclamation-triangle" style="color:#ef4444;"></i>
      <p>Could not generate QR. Please check your input.</p>
    </div>`;
    actions.style.display = 'none';
    meta.style.display = 'none';
  }
}

// ---- GET QR CANVAS ----
function getQRCanvas() {
  const output = document.getElementById('qrOutput');
  return output.querySelector('canvas') || output.querySelector('img');
}

// ---- DOWNLOAD ----
function downloadQR() {
  const el = getQRCanvas();
  if (!el) return showToast('Generate a QR code first', 'error');

  const canvas = (el.tagName === 'CANVAS') ? el : canvasFromImg(el);
  const link = document.createElement('a');
  link.download = 'qrcode-smartdigital.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('QR Code downloaded!', 'success');
}

function canvasFromImg(img) {
  const c = document.createElement('canvas');
  c.width = img.width || 300;
  c.height = img.height || 300;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return c;
}

// ---- COPY ----
async function copyQR() {
  const el = getQRCanvas();
  if (!el) return showToast('Generate a QR code first', 'error');

  try {
    const canvas = (el.tagName === 'CANVAS') ? el : canvasFromImg(el);
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('QR Code copied to clipboard!', 'success');
      } catch {
        showToast('Copy not supported — use Download instead', 'error');
      }
    });
  } catch {
    showToast('Could not copy image', 'error');
  }
}

// ---- SHARE ----
async function shareQR() {
  const el = getQRCanvas();
  if (!el) return showToast('Generate a QR code first', 'error');

  if (!navigator.share) {
    showToast('Sharing not supported on this browser — use Download', 'error');
    return;
  }

  const canvas = (el.tagName === 'CANVAS') ? el : canvasFromImg(el);
  canvas.toBlob(async (blob) => {
    try {
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      await navigator.share({ files: [file], title: 'QR Code — Smart Digital' });
    } catch {
      showToast('Could not share', 'error');
    }
  });
}

// ---- TOAST ----
let toastTimer = null;
function showToast(msg, type = '') {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = '';
  if (type === 'success') toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + msg;
  else if (type === 'error') toast.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + msg;
  else toast.textContent = msg;
  toast.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- THEME ----
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById('themeIcon');
  if (html.getAttribute('data-theme') === 'dark') {
    html.setAttribute('data-theme', 'light');
    icon.className = 'fas fa-sun';
    localStorage.setItem('qr-theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    icon.className = 'fas fa-moon';
    localStorage.setItem('qr-theme', 'dark');
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('qr-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('themeIcon').className = 'fas fa-sun';
  }
});
