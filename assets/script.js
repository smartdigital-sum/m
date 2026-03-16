// ============================================================
// Smart Digital v3 — script.js
// Firebase + Bilingual (EN/Assamese) + Admin Panel + All Features
// ============================================================

// ─── FIREBASE ─────────────────────────────────────────────
const db = firebase.database();

// ─── THEME ────────────────────────────────────────────────
let currentTheme = localStorage.getItem("theme") || "light";

function initTheme() {
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    const icon = document.getElementById("themeIcon");
    if (icon) icon.className = "fas fa-sun";
  }
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);

  const icon = document.getElementById("themeIcon");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (icon) icon.className = "fas fa-sun";
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (icon) icon.className = "fas fa-moon";
  }
}

// ─── LANGUAGE ─────────────────────────────────────────────
let currentLang = "en";

function toggleLanguage() {
  currentLang = currentLang === "en" ? "as" : "en";
  document.documentElement.setAttribute("data-lang", currentLang);
  document.getElementById("langLabel").textContent =
    currentLang === "en" ? "অসমীয়া" : "English";
  applyTranslations();
}

function applyTranslations() {
  const lang = currentLang;
  // Translate all elements with data-en / data-as
  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      // Only update textContent if no children we care about
      if (
        !el.querySelector("i") &&
        !el.querySelector("span") &&
        !el.querySelector("img")
      ) {
        el.textContent = text;
      } else {
        // Try smart inner text replacement preserving icons
        const icons = el.querySelectorAll("i");
        const spans = el.querySelectorAll("span[data-en]");
        // If only this element has the translation attribute, update its own text node
        el.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            node.textContent = " ";
          }
        });
        // Set via innerHTML carefully
        if (!el.querySelector("i, img, button, select, input")) {
          el.textContent = text;
        }
      }
    }
  });

  // Handle simple text-only elements properly
  document
    .querySelectorAll("[data-en]:not(:has(i)):not(:has(img)):not(:has(button))")
    .forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) el.textContent = text;
    });

  // Translate select options
  document.querySelectorAll("option[data-en]").forEach((opt) => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  // Translate placeholders
  document.querySelectorAll(`[data-${lang}-placeholder]`).forEach((el) => {
    el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
  });
}

// ─── ADMIN ─────────────────────────────────────────────────
const ADMIN_PASSWORD = "SmartDigital2026"; // Change this!
let adminMode = false;

function openAdminLogin() {
  document.getElementById("adminLoginModal").classList.add("show");
  setTimeout(() => document.getElementById("adminPwd").focus(), 100);
}
function closeAdminLogin() {
  document.getElementById("adminLoginModal").classList.remove("show");
  document.getElementById("adminPwd").value = "";
}
function verifyAdmin() {
  const pwd = document.getElementById("adminPwd").value;
  if (pwd === ADMIN_PASSWORD) {
    closeAdminLogin();
    openAdminPanel();
  } else {
    const input = document.getElementById("adminPwd");
    input.style.borderColor = "#ef4444";
    input.style.animation = "shake 0.4s ease";
    setTimeout(() => {
      input.style.borderColor = "";
      input.style.animation = "";
    }, 800);
    input.value = "";
    input.focus();
    showToast("❌ Incorrect password!", "error");
  }
}

function openAdminPanel() {
  adminMode = true;
  document.getElementById("adminModal").classList.add("show");
  document.body.style.overflow = "hidden";
  loadAdminData();
}
function closeAdminPanel() {
  adminMode = false;
  document.getElementById("adminModal").classList.remove("show");
  document.body.style.overflow = "";
}

function loadAdminData() {
  db.ref("shopHours").once("value", (snap) => {
    const d = snap.val() || {};
    document.getElementById("shopOpenInput").value = d.opening || "09:00";
    document.getElementById("shopCloseInput").value = d.closing || "18:00";
  });
  db.ref("urgentNotice").once("value", (snap) => {
    const d = snap.val() || {};
    document.getElementById("urgentText").value = d.text || "";
    document.getElementById("urgentDeadline").value = d.deadline || "";
    document.getElementById("urgentToggle").checked = d.show || false;
  });
  db.ref("notifications").once("value", (snap) => {
    const data = snap.val();
    renderAdminNotifList(Array.isArray(data) ? data : []);
  });
}

function saveAdminSettings() {
  const opening = document.getElementById("shopOpenInput").value;
  const closing = document.getElementById("shopCloseInput").value;
  if (!opening || !closing) {
    showToast("⚠️ Please set both opening and closing times!", "error");
    return;
  }
  Promise.all([
    db.ref("shopHours").set({ opening, closing }),
    db.ref("urgentNotice").set({
      text: document.getElementById("urgentText").value,
      deadline: document.getElementById("urgentDeadline").value,
      show: document.getElementById("urgentToggle").checked,
    }),
  ])
    .then(() => {
      showToast("✅ All settings saved!", "success");
      closeAdminPanel();
    })
    .catch((err) => showToast("❌ Error: " + err.message, "error"));
}

// ─── NOTIFICATIONS ─────────────────────────────────────────
function getTypeIcon(type) {
  return (
    { info: "📢", success: "✅", warning: "⚠️", event: "🎉" }[type] || "📢"
  );
}
function relTime(ts) {
  if (!ts) return "";
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function renderAdminNotifList(notifs) {
  const el = document.getElementById("adminNotifList");
  if (!el) return;
  if (!notifs || notifs.length === 0) {
    el.innerHTML =
      '<div style="color:#94a3b8;font-size:13px;padding:8px 0;">No notifications yet.</div>';
    return;
  }
  el.innerHTML = notifs
    .map(
      (n, i) => `
    <div class="admin-notif-item">
      <span>${getTypeIcon(n.type)}</span>
      <span class="admin-notif-text">${n.text}</span>
      <span style="font-size:11px;color:#94a3b8;">${relTime(n.timestamp)}</span>
      <button class="admin-notif-delete" onclick="deleteNotif(${i})"><i class="fas fa-trash-alt"></i></button>
    </div>
  `,
    )
    .join("");
}

function addNotification() {
  const input = document.getElementById("notifInput");
  const type = document.getElementById("notifType").value;
  const text = input.value.trim();
  if (!text) {
    input.style.borderColor = "#ef4444";
    setTimeout(() => (input.style.borderColor = ""), 600);
    return;
  }
  db.ref("notifications").once("value", (snap) => {
    const current = Array.isArray(snap.val()) ? snap.val() : [];
    const updated = [{ text, type, timestamp: Date.now() }, ...current];
    db.ref("notifications")
      .set(updated)
      .then(() => {
        input.value = "";
        showToast("📢 Notification added!", "success");
        renderAdminNotifList(updated);
      })
      .catch((err) => showToast("❌ " + err.message, "error"));
  });
}

function deleteNotif(i) {
  db.ref("notifications").once("value", (snap) => {
    const current = Array.isArray(snap.val()) ? snap.val() : [];
    current.splice(i, 1);
    db.ref("notifications")
      .set(current)
      .then(() => {
        showToast("🗑️ Removed", "info");
        renderAdminNotifList(current);
      });
  });
}

function displayNotifications(notifs) {
  const container = document.getElementById("notifContainer");
  const empty = document.getElementById("boardEmpty");
  const ticker = document.getElementById("boardTickerText");
  if (!container) return;
  container.querySelectorAll(".notif-card").forEach((c) => c.remove());
  if (!notifs || notifs.length === 0) {
    if (empty) empty.style.display = "flex";
    if (ticker)
      ticker.textContent =
        currentLang === "en"
          ? "No notifications yet — Check back soon!"
          : "এতিয়া কোনো জাননী নাই — সোনকালে পুনৰ চাওক!";
    return;
  }
  if (empty) empty.style.display = "none";
  if (ticker)
    ticker.textContent = notifs
      .map((n) => `${getTypeIcon(n.type)}  ${n.text}`)
      .join("   •   ");
  notifs.forEach((n, i) => {
    const card = document.createElement("div");
    card.className = `notif-card notif-type-${n.type || "info"} reveal`;
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <div class="notif-card-icon">${getTypeIcon(n.type)}</div>
      <div class="notif-card-body">
        <p class="notif-card-text">${n.text}</p>
        <span class="notif-card-time"><i class="far fa-clock"></i> ${relTime(n.timestamp)}</span>
      </div>
      <div class="notif-card-tag notif-tag-${n.type || "info"}">${(n.type || "info").toUpperCase()}</div>
    `;
    container.appendChild(card);
    setTimeout(() => card.classList.add("active"), 50 + i * 80);
  });
}

// ─── URGENT BANNER ─────────────────────────────────────────
let urgentBannerTimeout = null;

function setUrgentBanner(data) {
  const banner = document.getElementById("urgentBanner");
  if (!banner) return;

  if (urgentBannerTimeout) {
    clearTimeout(urgentBannerTimeout);
  }

  if (data && data.show && data.text) {
    banner.style.display = "";
    document.getElementById("urgentNoticeText").textContent = data.text;
    window._urgentDeadline = data.deadline || "";

    // Auto-hide after 9 seconds
    urgentBannerTimeout = setTimeout(() => {
      if (banner.style.display !== "none") {
        banner.style.opacity = "0";
        setTimeout(() => {
          banner.style.display = "none";
          banner.style.opacity = "1";
        }, 300);
      }
    }, 9000);

  } else {
    banner.style.display = "none";
    window._urgentDeadline = "";
  }
}

function tickUrgentCountdown() {
  const el = document.getElementById("urgentCountdown");
  if (!el) return;
  const deadline = window._urgentDeadline;
  if (!deadline) {
    el.textContent = "";
    return;
  }
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) {
    el.textContent = "Deadline passed!";
    return;
  }
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);
  el.textContent =
    d > 0 ? `${d}d ${h}h ${m}m remaining` : `${h}h ${m}m ${s}s remaining`;
}

// ─── SHOP STATUS ──────────────────────────────────────────
window._shopHours = { opening: "09:00", closing: "18:00" };

function setShopStatus(data) {
  if (data && data.opening && data.closing) window._shopHours = data;
  const { opening, closing } = window._shopHours;
  const fmt = (t) => {
    const [h, m] = t.split(":").map(Number);
    const ap = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ap}`;
  };
  document.getElementById("shopOpenTime").textContent = fmt(opening);
  document.getElementById("shopCloseTime").textContent = fmt(closing);
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = opening.split(":").map(Number);
  const [ch, cm] = closing.split(":").map(Number);
  const ot = oh * 60 + om,
    ct = ch * 60 + cm;
  const open = cur >= ot && cur < ct;

  const badge = document.getElementById("shopBadge");
  const titleEl = document.getElementById("shopTitle");
  const card = document.getElementById("shopStatusCard");
  const glow = document.getElementById("shopGlow");
  const iconWrap = document.getElementById("shopIconWrap");

  if (open) {
    badge.textContent = "OPEN";
    badge.className = "shop-badge open";
    titleEl.setAttribute("data-en", "Shop is Open");
    titleEl.setAttribute("data-as", "দোকান খোলা আছে");
    titleEl.textContent =
      currentLang === "en" ? "Shop is Open" : "দোকান খোলা আছে";
    card.className = "shop-status-card is-open";
    glow.className = "shop-glow glow-open";
    iconWrap.className = "shop-icon-wrap icon-open";
  } else {
    badge.textContent = "CLOSED";
    badge.className = "shop-badge closed";
    titleEl.setAttribute("data-en", "Shop is Closed");
    titleEl.setAttribute("data-as", "দোকান বন্ধ আছে");
    titleEl.textContent =
      currentLang === "en" ? "Shop is Closed" : "দোকান বন্ধ আছে";
    card.className = "shop-status-card is-closed";
    glow.className = "shop-glow glow-closed";
    iconWrap.className = "shop-icon-wrap icon-closed";
  }
  tickShopCountdown();
}

function tickShopCountdown() {
  const { opening, closing } = window._shopHours;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const [oh, om] = opening.split(":").map(Number);
  const [ch, cm] = closing.split(":").map(Number);
  const ot = oh * 60 + om,
    ct = ch * 60 + cm;
  let diff, label;
  if (cur < ot) {
    diff = ot - cur;
    label = "Opens in";
  } else if (cur < ct) {
    diff = ct - cur;
    label = "Closes in";
  } else {
    diff = ot + 1440 - cur;
    label = "Opens tomorrow in";
  }
  const h = Math.floor(diff / 60),
    m = Math.floor(diff % 60),
    s = Math.floor((diff * 60) % 60);
  const el = document.getElementById("shopCountdown");
  if (el) el.textContent = `${label}: ${h}h ${m}m ${s}s`;
}

function tickClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const el = document.getElementById("shopLiveClock");
  if (el) el.textContent = `${h}:${m}:${s} ${ap}`;
}

// ─── BOARD DATE TIME ───────────────────────────────────────
function tickBoardTime() {
  const el = document.getElementById("boardDateTime");
  if (!el) return;
  el.textContent = new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── SERVICE TIMER ─────────────────────────────────────────
function updateServiceTimer() {
  const startDate = new Date("2026-01-01T00:00:00");
  const now = new Date();
  let diff = now - startDate;

  if (diff < 0) diff = 0;

  let totalSeconds = Math.floor(diff / 1000);
  let totalMinutes = Math.floor(totalSeconds / 60);
  let totalHours = Math.floor(totalMinutes / 60);
  let totalDays = Math.floor(totalHours / 24);

  const years = Math.floor(totalDays / 365);
  totalDays %= 365;
  const months = Math.floor(totalDays / 30);
  totalDays %= 30;
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  const parts_en = [];
  const parts_as = [];

  if (years > 0) {
    parts_en.push(`${years} year${years > 1 ? "s" : ""}`);
    parts_as.push(`${translateNumber(years)} বছৰ`);
  }
  if (months > 0) {
    parts_en.push(`${months} month${months > 1 ? "s" : ""}`);
    parts_as.push(`${translateNumber(months)} মাহ`);
  }
  if (weeks > 0) {
    parts_en.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
    parts_as.push(`${translateNumber(weeks)} সপ্তাহ`);
  }
  if (remainingDays > 0 || (years === 0 && months === 0 && weeks === 0)) {
    parts_en.push(`${remainingDays} day${remainingDays !== 1 ? "s" : ""}`);
    parts_as.push(`${translateNumber(remainingDays)} দিন`);
  }

  const text_en = "Served " + parts_en.join(" ");
  const text_as = parts_as.join(" ") + " সেৱা আগবঢ়াইছো";

  const el = document.getElementById("customerCount");
  if (el) {
    el.setAttribute("data-en", text_en);
    el.setAttribute("data-as", text_as);
    el.textContent = currentLang === "en" ? text_en : text_as;
  }
}

function translateNumber(n) {
  const assameseDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n)
    .split("")
    .map((d) => assameseDigits[d] || d)
    .join("");
}

// ─── FIREBASE LISTENERS ────────────────────────────────────
function initFirebase() {
  db.ref("shopHours").on("value", (snap) => {
    setShopStatus(snap.val() || { opening: "09:00", closing: "18:00" });
  });
  db.ref("urgentNotice").on("value", (snap) => {
    setUrgentBanner(snap.val() || {});
  });
  db.ref("notifications").on("value", (snap) => {
    displayNotifications(Array.isArray(snap.val()) ? snap.val() : []);
  });
}

// ─── TICKER ────────────────────────────────────────────────
setInterval(() => {
  tickClock();
  tickShopCountdown();
  tickUrgentCountdown();
  tickBoardTime();
  updateServiceTimer();
  if (new Date().getSeconds() === 0) setShopStatus();
}, 1000);

// ─── HAMBURGER ─────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");
});
document.querySelectorAll(".nav-link").forEach((l) =>
  l.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
  }),
);
document.addEventListener("click", (e) => {
  if (!document.querySelector(".nav-container").contains(e.target)) {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
  }
});

// ─── NAV SCROLL SPY ────────────────────────────────────────
window.addEventListener("scroll", () => {
  let current = "";
  document.querySelectorAll("section[id]").forEach((s) => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll(".nav-link").forEach((l) => {
    l.classList.toggle("active", l.getAttribute("href") === "#" + current);
  });
});

// ─── STAT COUNTERS ─────────────────────────────────────────
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll(".stat-number").forEach((el) => {
        const target = +el.getAttribute("data-target");
        const inc = target / 60;
        let cur = 0;
        const tick = () => {
          cur += inc;
          if (cur < target) {
            el.textContent = Math.floor(cur);
            requestAnimationFrame(tick);
          } else el.textContent = target;
        };
        tick();
      });
      statsObserver.unobserve(e.target);
    });
  },
  { threshold: 0.5 },
);
const statsEl = document.querySelector(".statistics");
if (statsEl) statsObserver.observe(statsEl);

// ─── SERVICES DATA ─────────────────────────────────────────
const SERVICE_DATA = {
  pan: {
    icon: "fas fa-id-card",
    color: "linear-gradient(135deg,#6366f1,#818cf8)",
    price: "₹150–300",
    desc: "Quick and hassle-free PAN Card application, correction and tracking.",
    includes: [
      "New PAN application",
      "PAN correction / reprint",
      "Tracking status help",
      "Document guidance",
    ],
  },
  aadhaar: {
    icon: "fas fa-fingerprint",
    color: "linear-gradient(135deg,#f59e0b,#fbbf24)",
    price: "₹100–200",
    desc: "Complete Aadhaar enrollment, update and verification services.",
    includes: [
      "Aadhaar update (name/DOB/address)",
      "Mobile number linking",
      "Aadhaar download & DigiLocker",
      "Biometric correction guidance",
    ],
  },
  print: {
    icon: "fas fa-print",
    color: "linear-gradient(135deg,#06b6d4,#22d3ee)",
    price: "₹2–15/page",
    desc: "High-quality B&W and color printing, scanning & PDF creation.",
    includes: [
      "B&W printing ₹5/page",
      "Color printing ₹15/page",
      "Photocopy ₹2/page",
      "Scanning & PDF ₹20/doc",
      "Lamination ₹20/sheet",
    ],
  },
  photo: {
    icon: "fas fa-camera",
    color: "linear-gradient(135deg,#ec4899,#f43f5e)",
    price: "₹30–50/set",
    desc: "Professional passport-size and ID photos taken on the spot.",
    includes: [
      "Passport-size photos",
      "Visa size photos",
      "Government ID photos",
      "Printed & digital copies",
    ],
  },
  form: {
    icon: "fas fa-file-alt",
    color: "linear-gradient(135deg,#10b981,#34d399)",
    price: "₹50–200",
    desc: "All government online form filling and application submission.",
    includes: [
      "Income certificate",
      "Residence certificate",
      "Caste certificate",
      "Birth/death certificate",
      "Government scheme applications",
    ],
  },
  ticket: {
    icon: "fas fa-ticket-alt",
    color: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
    price: "₹30–60/ticket",
    desc: "Railway, bus and flight ticket booking with fast confirmation.",
    includes: [
      "IRCTC railway tickets",
      "Bus tickets (RedBus etc.)",
      "Flight tickets",
      "Seat selection help",
      "Cancellation assistance",
    ],
  },
  recharge: {
    icon: "fas fa-mobile-alt",
    color: "linear-gradient(135deg,#f97316,#fb923c)",
    price: "No Extra Charge",
    desc: "Instant mobile and DTH recharge for all operators.",
    includes: [
      "Airtel, Jio, BSNL, Vi",
      "DTH recharge (Tata, Dish etc.)",
      "Postpaid bill payment",
      "Data & talk time plans",
    ],
  },
  voter: {
    icon: "fas fa-vote-yea",
    color: "linear-gradient(135deg,#0ea5e9,#38bdf8)",
    price: "₹100–150",
    desc: "Voter ID new registration, correction and verification help.",
    includes: [
      "New voter registration",
      "Name/address correction",
      "Profile update",
      "Voter slip download",
    ],
  },
  website: {
    icon: "fas fa-globe",
    color: "linear-gradient(135deg,#1e293b,#334155)",
    price: "₹3,000–10,000",
    desc: "Basic websites for local businesses, shops, and personal use.",
    includes: [
      "1-page or multi-page site",
      "Mobile-friendly design",
      "Contact & location section",
      "Google Maps integration",
      "1 month free support",
    ],
  },
};

function openServiceModal(title, key) {
  const s = SERVICE_DATA[key];
  if (!s) return;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = s.desc;
  document.getElementById("modalPrice").textContent = s.price;
  const iconEl = document.getElementById("modalIcon");
  iconEl.style.background = s.color;
  iconEl.innerHTML = `<i class="${s.icon}"></i>`;
  const ul = document.getElementById("modalIncludes");
  ul.innerHTML = s.includes.map((i) => `<li>${i}</li>`).join("");
  const msg = encodeURIComponent(
    `Hi Smart Digital! I want to enquire about ${title}.`,
  );
  document.getElementById("modalWhatsApp").href =
    `https://wa.me/91XXXXXXXXXX?text=${msg}`;
  document.getElementById("serviceModal").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeServiceModal() {
  document.getElementById("serviceModal").classList.remove("show");
  document.body.style.overflow = "";
}

// ─── QUOTE CALCULATOR ──────────────────────────────────────
function calcQuote() {
  const price = parseFloat(document.getElementById("quoteService").value) || 0;
  const qty = parseInt(document.getElementById("quoteQty").value) || 1;
  const total = price * qty;
  document.getElementById("calcTotal").textContent = total;
  const box = document.getElementById("calcResult");
  box.style.background =
    total > 0
      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
      : "linear-gradient(135deg,#94a3b8,#64748b)";
}

// ─── GALLERY ───────────────────────────────────────────────
function filterGallery(cat, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".gallery-item").forEach((el) => {
    el.classList.toggle(
      "hidden",
      cat !== "all" && el.getAttribute("data-category") !== cat,
    );
  });
}

let lbImages = [],
  lbIndex = 0;
function openLightbox(el) {
  const visible = Array.from(
    document.querySelectorAll(".gallery-item:not(.hidden)"),
  );
  lbIndex = visible.indexOf(el);
  lbImages = visible.map((i) => i.querySelector("img").src);
  document.getElementById("lbImage").src = lbImages[lbIndex];
  document.getElementById("lightbox").classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}
function nextImg(e) {
  e.stopPropagation();
  lbIndex = (lbIndex + 1) % lbImages.length;
  document.getElementById("lbImage").src = lbImages[lbIndex];
}
function prevImg(e) {
  e.stopPropagation();
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  document.getElementById("lbImage").src = lbImages[lbIndex];
}
document.addEventListener("keydown", (e) => {
  if (!document.getElementById("lightbox").classList.contains("active")) return;
  if (e.key === "ArrowRight") nextImg(e);
  else if (e.key === "ArrowLeft") prevImg(e);
  else if (e.key === "Escape") closeLightbox();
});

// ─── MODAL CLOSE ON OUTSIDE CLICK ──────────────────────────
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("show");
    document.body.style.overflow = "";
    adminMode = false;
  }
});

// ─── CONTACT FORM ──────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  showToast("✅ Thank you! We will contact you soon.", "success");
  e.target.reset();
}

// ─── SCROLL REVEAL ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("active");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);

function setupReveal() {
  document
    .querySelectorAll(".service-card, .stat-card, .loc-item, .cta-card")
    .forEach((el) => {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
}

// ─── TOAST ─────────────────────────────────────────────────
function showToast(msg, type = "success") {
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

// ─── PARTICLES ─────────────────────────────────────────────
function createParticles() {
  const container = document.getElementById("heroParticles");
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      animation-delay:${Math.random() * 6}s;
      animation-duration:${Math.random() * 5 + 5}s;
      opacity:${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}

// ─── WHATSAPP HIDE ON SCROLL UP ────────────────────────────
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const wf = document.getElementById("whatsappFloat");
  const now = window.scrollY;
  if (wf) wf.style.opacity = now > 300 ? "1" : "0.7";
  lastScroll = now;
});

// ─── FOOTER YEAR ───────────────────────────────────────────
const fyear = document.getElementById("footerYear");
if (fyear) fyear.textContent = new Date().getFullYear();

// ─── INIT ──────────────────────────────────────────────────
window.addEventListener("load", () => {
  initTheme();
  document.body.style.opacity = "1";
  initFirebase();
  createParticles();
  tickClock();
  tickBoardTime();
  updateServiceTimer();
  setupReveal();
});

console.log(
  "%c✨ Smart Digital v3 ✨",
  "color:#6366f1;font-size:22px;font-weight:bold;",
);
console.log(
  "%cKachua Tiniali, Kampur, Assam — Your Digital Partner",
  "color:#f97316;font-size:13px;",
);


