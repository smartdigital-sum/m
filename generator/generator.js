const industryConfig = {
  medical:     { emoji: '🏥', badge: 'Trusted Care',      cta: 'Book Appointment'  },
  school:      { emoji: '🎓', badge: 'Quality Education', cta: 'Enroll Now'        },
  salon:       { emoji: '✂️', badge: 'Premium Style',     cta: 'Book Session'      },
  grocery:     { emoji: '🛒', badge: 'Fresh & Local',     cta: 'Shop Now'          },
  restaurant:  { emoji: '🍽️', badge: 'Fine Dining',       cta: 'Reserve Table'     },
  gym:         { emoji: '💪', badge: 'Train Hard',         cta: 'Join Now'          },
  pharmacy:    { emoji: '💊', badge: 'Your Health First',  cta: 'Order Now'         },
  coaching:    { emoji: '📖', badge: 'Expert Guidance',   cta: 'Enroll Today'      },
  clothing:    { emoji: '👗', badge: 'Latest Fashion',    cta: 'Shop Collection'   },
  cafe:        { emoji: '☕', badge: 'Freshly Brewed',    cta: 'Order Online'      },
  realestate:  { emoji: '🏠', badge: 'Dream Properties',  cta: 'View Listings'     },
  photography: { emoji: '📷', badge: 'Capture Moments',   cta: 'Book a Shoot'      },
  beauty:      { emoji: '💅', badge: 'Glow Up',           cta: 'Book Now'          },
  hardware:    { emoji: '🔧', badge: 'Build Better',      cta: 'Shop Tools'        },
};

let selectedLayout = 'classic';
let userAccent = null;
let currentEmoji = '🏪';
let activeView = 'website';

// ── Restore saved inputs from localStorage ─────────────────
(function restoreSaved() {
  const fields = ['biz-name', 'biz-tagline', 'biz-phone', 'biz-location'];
  fields.forEach(id => {
    const saved = localStorage.getItem('sd_' + id);
    if (saved) document.getElementById(id).value = saved;
  });
  const savedIndustry = localStorage.getItem('sd_industry');
  if (savedIndustry) document.getElementById('industry').value = savedIndustry;
})();

// ── Layout picker ──────────────────────────────────────────
document.querySelectorAll('.layout-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.layout-opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedLayout = btn.dataset.layout;
  });
});

// ── Color swatches ──────────────────────────────────────────
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    swatch.classList.add('active');
    userAccent = swatch.dataset.color || null;
    // Live-update if mockup already visible
    if (document.getElementById('mockup-result').style.display !== 'none') {
      applyAccentColor(userAccent);
    }
  });
});

function applyAccentColor(color) {
  const badge   = document.getElementById('mockup-badge');
  const cta     = document.getElementById('mockup-cta');
  const accentBar = document.getElementById('card-accent-bar');

  if (!color) {
    // Reset inline styles so theme CSS takes over
    badge.style.cssText = '';
    cta.style.cssText   = '';
    if (accentBar) accentBar.style.background = '';
    return;
  }

  badge.style.background   = color + '22';
  badge.style.color         = color;
  badge.style.borderColor   = color + 'aa';
  cta.style.background      = color;
  cta.style.color           = '#fff';
  cta.style.border          = 'none';
  if (accentBar) accentBar.style.background = color;
}

// ── View tabs ───────────────────────────────────────────────
document.querySelectorAll('.view-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeView = tab.dataset.view;

    document.getElementById('view-website').style.display = activeView === 'website' ? 'block' : 'none';
    document.getElementById('view-card').style.display    = activeView === 'card'    ? 'block' : 'none';

    // Download button label changes per view
    document.getElementById('download-btn').textContent =
      activeView === 'card' ? '⬇ Download Card' : '⬇ Download Preview';
  });
});

// ── Generate ────────────────────────────────────────────────
document.getElementById('generate-btn').addEventListener('click', async () => {
  const fileInput   = document.getElementById('image-upload');
  const bizName     = document.getElementById('biz-name').value.trim();
  const bizTagline  = document.getElementById('biz-tagline').value.trim();
  const bizPhone    = document.getElementById('biz-phone').value.trim();
  const bizLocation = document.getElementById('biz-location').value.trim();
  const industry    = document.getElementById('industry').value;
  const config      = industryConfig[industry];

  if (!bizName) {
    alert('Please enter your business name!');
    return;
  }

  // Save inputs to localStorage
  localStorage.setItem('sd_biz-name',     bizName);
  localStorage.setItem('sd_biz-tagline',  bizTagline);
  localStorage.setItem('sd_biz-phone',    bizPhone);
  localStorage.setItem('sd_biz-location', bizLocation);
  localStorage.setItem('sd_industry',     industry);

  const loadingText = document.getElementById('loading-text');
  loadingText.style.display = 'block';
  document.getElementById('mockup-result').style.display = 'none';

  currentEmoji = config.emoji;
  const hasFile = fileInput.files[0];

  // Show skeleton while processing
  document.getElementById('mockup-result').style.display = 'block';
  document.getElementById('mockup-skeleton').style.display = 'block';
  document.getElementById('hero-layout').style.display = 'none';
  document.getElementById('mockup-result').scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (hasFile) {
    // Show the uploaded image immediately in creative frame — no waiting
    const rawUrl = URL.createObjectURL(fileInput.files[0]);
    showFramedPhoto(rawUrl, config.badge);

    // Try background removal to upgrade to floating style
    const formData = new FormData();
    formData.append('image_file', fileInput.files[0]);
    formData.append('size', 'auto');
    const apiKey = 'aMjaN6B37Xu32zDpxuAvfRz9';

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData,
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const blob = await response.blob();
      const transformedUrl = URL.createObjectURL(blob);

      // Upgrade: hide frame, show floating bg-removed image
      hideAllRightCol();
      document.getElementById('mockup-image').src = transformedUrl;
      document.getElementById('mockup-image').style.display = 'block';
    } catch (error) {
      // API failed — framed photo is already showing, nothing to do
      console.warn('BG removal skipped, showing original photo.');
    }
  } else {
    showEmojiFallback(config.emoji);
  }

  // ── Populate website mockup ──
  const urlSlug = bizName.toLowerCase().replace(/\s+/g, '');
  document.getElementById('mockup-title').innerText   = bizName;
  document.getElementById('mockup-logo').innerText    = bizName;
  document.getElementById('mockup-badge').innerText   = config.badge;
  document.getElementById('mockup-cta').innerText     = config.cta;
  document.getElementById('mockup-tagline').innerText = bizTagline || 'Experience the best services in the city. Designed for excellence, tailored for you.';
  document.getElementById('browser-url').innerText    = urlSlug + '.com';

  // Apply theme + layout class
  document.getElementById('hero-layout').className = `hero-layout layout-${selectedLayout} theme-${industry}`;

  // ── Populate business card ──
  document.getElementById('card-emoji').textContent           = config.emoji;
  document.getElementById('card-name').textContent            = bizName;
  document.getElementById('card-tagline').textContent         = bizTagline || config.badge;
  document.getElementById('card-phone-display').textContent   = bizPhone   ? '📞 ' + bizPhone   : '📞 +91 98765 43210';
  document.getElementById('card-location-display').textContent= bizLocation? '📍 ' + bizLocation : '📍 Assam, India';
  document.getElementById('card-web').textContent             = '🌐 ' + urlSlug + '.com';

  // Apply theme class to business card too
  document.getElementById('biz-card').className = `biz-card theme-${industry}`;

  // Apply accent color override if selected
  applyAccentColor(userAccent);

  // Hide skeleton, reveal real mockup
  loadingText.style.display = 'none';
  document.getElementById('mockup-skeleton').style.display = 'none';
  document.getElementById('hero-layout').style.display = 'block';
});

function hideAllRightCol() {
  document.getElementById('mockup-image').style.display = 'none';
  document.getElementById('mockup-emoji').style.display = 'none';
  document.getElementById('mockup-photo-frame').style.display = 'none';
  document.getElementById('deco-blob-1').style.display = 'none';
  document.getElementById('deco-blob-2').style.display = 'none';
}

function showEmojiFallback(emoji) {
  hideAllRightCol();
  const el = document.getElementById('mockup-emoji');
  el.textContent = emoji;
  el.style.display = 'flex';
}

function showFramedPhoto(url, badgeText) {
  hideAllRightCol();
  document.getElementById('mockup-photo-raw').src = url;
  document.getElementById('photo-frame-badge').textContent = '✨ ' + (badgeText || 'Premium');
  document.getElementById('mockup-photo-frame').style.display = 'block';
  document.getElementById('deco-blob-1').style.display = 'block';
  document.getElementById('deco-blob-2').style.display = 'block';
}

// ── Download ────────────────────────────────────────────────
async function downloadMockup() {
  const btn = document.getElementById('download-btn');
  btn.textContent = '⏳ Preparing...';
  btn.disabled = true;

  const target = activeView === 'card'
    ? document.getElementById('biz-card')
    : document.getElementById('hero-layout');

  const bizName = document.getElementById('biz-name').value.trim() || 'business';

  try {
    const canvas = await html2canvas(target, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      logging: false,
    });
    const link = document.createElement('a');
    link.download = bizName + (activeView === 'card' ? '-card' : '-preview') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (e) {
    alert('Could not download. Try right-clicking the mockup to save as image.');
    console.error(e);
  }

  btn.textContent = activeView === 'card' ? '⬇ Download Card' : '⬇ Download Preview';
  btn.disabled = false;
}

// ── WhatsApp Share ──────────────────────────────────────────
function shareWhatsApp() {
  const bizName = document.getElementById('biz-name').value.trim() || 'my business';
  const pageUrl = 'https://smartdigital.in';
  const message = `Check out the website preview I created for *${bizName}* using Smart Digital's free tool! 🚀\n\nGet yours here: ${pageUrl}`;
  window.open('https://wa.me/?text=' + encodeURIComponent(message), '_blank');
}

// ── Lead Capture Form ───────────────────────────────────────
function submitLead() {
  const name    = document.getElementById('lead-name').value.trim();
  const phone   = document.getElementById('lead-phone').value.trim();
  const message = document.getElementById('lead-message').value.trim();
  const bizName = document.getElementById('biz-name').value.trim();
  const note    = document.getElementById('lead-note');

  if (!name || !phone) {
    note.textContent = 'Please enter your name and WhatsApp number.';
    note.style.color = '#ef4444';
    return;
  }

  const SMART_DIGITAL_WHATSAPP = '919876543210'; // ← replace with actual number
  const text = `Hi Smart Digital! 👋\n\nI just created a website preview for *${bizName || 'my business'}* and I'm interested in getting the real thing built.\n\n*Name:* ${name}\n*Phone:* ${phone}${message ? '\n*Message:* ' + message : ''}`;

  window.open(`https://wa.me/${SMART_DIGITAL_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');

  note.textContent = "✅ Opening WhatsApp... We'll reply within 24 hours!";
  note.style.color = '#10b981';
  document.getElementById('lead-submit-btn').textContent = 'Sent!';
  document.getElementById('lead-submit-btn').disabled = true;
}
