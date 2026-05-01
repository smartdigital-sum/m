// ============================================================
// Smart Digital v3 — script.js
// Firebase + Bilingual (EN/Assamese) + Admin Panel + All Features
// ============================================================

// ─── FIREBASE ─────────────────────────────────────────────
let db;
function getDb() {
  if (db) return db;
  try {
    if (typeof firebase !== 'undefined') {
      db = firebase.database();
      return db;
    }
  } catch (e) {
    console.error("Firebase DB init error:", e);
  }
  return null;
}

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
  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.getAttribute(`data-${lang}`);
    if (!text) return;

    if (el.children.length === 0) {
      el.textContent = text;
      return;
    }

    const firstText = Array.from(el.childNodes).find(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
    );
    if (firstText) {
      const leading = firstText.textContent.match(/^\s*/)[0];
      const trailing = firstText.textContent.match(/\s*$/)[0];
      firstText.textContent = leading + text + trailing;
    }
  });

  document.querySelectorAll("option[data-en]").forEach((opt) => {
    const text = opt.getAttribute(`data-${lang}`);
    if (text) opt.textContent = text;
  });

  document.querySelectorAll(`[data-${lang}-placeholder]`).forEach((el) => {
    el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
  });
}

// ─── ADMIN ─────────────────────────────────────────────────
let adminMode = false;

// ─── AUTH STATE LISTENER ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("🔓 Admin logged in:", user.email);
    } else {
      console.log("🔒 Admin logged out");
      closeAdminPanel();
    }
  });
});

function openAdminLogin() {
  // If already logged in, just open the panel
  if (firebase.auth().currentUser) {
    openAdminPanel();
    return;
  }
  document.getElementById("adminLoginModal").classList.add("show");
  setTimeout(() => document.getElementById("adminPwd").focus(), 100);
}
function closeAdminLogin() {
  document.getElementById("adminLoginModal").classList.remove("show");
  document.getElementById("adminPwd").value = "";
}
function verifyAdmin() {
  const email = window.SMART_DIGITAL_CONFIG?.ADMIN_EMAIL || "";
  const pwd = document.getElementById("adminPwd").value;

  if (!email) {
    showToast("❌ Admin email not configured!", "error");
    return;
  }

  // Show loading state on button
  const loginBtn = document.querySelector("#adminLoginModal .btn-primary");
  const originalText = loginBtn.innerHTML;
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

  firebase
    .auth()
    .signInWithEmailAndPassword(email, pwd)
    .then(() => {
      closeAdminLogin();
      openAdminPanel();
      showToast("✅ Successfully logged in!", "success");
    })
    .catch((err) => {
      const input = document.getElementById("adminPwd");
      input.style.borderColor = "#ef4444";
      input.style.animation = "shake 0.4s ease";
      setTimeout(() => {
        input.style.borderColor = "";
        input.style.animation = "";
      }, 800);
      input.value = "";
      input.focus();
      showToast("❌ Error: " + err.message, "error");
    })
    .finally(() => {
      loginBtn.disabled = false;
      loginBtn.innerHTML = originalText;
    });
}

function signOutAdmin() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      showToast("🔒 Logged out successfully", "info");
      closeAdminPanel();
    });
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

  const bar = document.getElementById("shopProgressBar");
  const pLabel = document.getElementById("shopProgressLabel");
  if (bar && pLabel) {
    const totalOpen = ct - ot;
    if (cur >= ot && cur < ct) {
      const elapsed = cur - ot;
      const pct = Math.min(100, Math.round((elapsed / totalOpen) * 100));
      bar.style.width = pct + "%";
      pLabel.textContent = pct + "% through open hours";
    } else {
      bar.style.width = "0%";
      pLabel.textContent = "Shop is currently closed";
    }
  }
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
  const firebaseDb = getDb();
  if (!firebaseDb) {
    console.warn("Firebase not initialized! Check config.");
    return;
  }
  console.log("🔥 Firebase initialized");
  firebaseDb.ref("shopHours").on("value", (snap) => {
    setShopStatus(snap.val() || { opening: "09:00", closing: "18:00" });
  });
  firebaseDb.ref("urgentNotice").on("value", (snap) => {
    setUrgentBanner(snap.val() || {});
  });
  firebaseDb.ref("notifications").on("value", (snap) => {
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
    price: "Contact on WhatsApp",
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
    price: "Contact on WhatsApp",
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
    price: "Contact on WhatsApp",
    desc: "High-quality B&W and color printing, scanning & PDF creation.",
    includes: [
      "B&W printing",
      "Color printing",
      "Photocopy",
      "Scanning & PDF creation",
      "Lamination",
    ],
  },
  photo: {
    icon: "fas fa-camera",
    color: "linear-gradient(135deg,#ec4899,#f43f5e)",
    price: "Contact on WhatsApp",
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
    price: "Contact on WhatsApp",
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
    price: "Contact on WhatsApp",
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
    price: "Contact on WhatsApp",
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
    price: "Contact on WhatsApp",
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
    price: "Contact on WhatsApp",
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
    `https://wa.me/918638759478?text=${msg}`;
  document.getElementById("serviceModal").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeServiceModal() {
  document.getElementById("serviceModal").classList.remove("show");
  document.body.style.overflow = "";
}

// ─── AI AGENT MODAL ────────────────────────────────────────
const AGENT_DATA = {
  "whatsapp-bot": {
    title: "n8n WhatsApp Bot",
    icon: "🤖",
    color: "linear-gradient(135deg,#25d366,#059669)",
    tagline: "Your shop never sleeps — replies flow even at 2 AM.",
    problem: "You lose customers every night. Messages pile up on WhatsApp at midnight, weekends, during pujas — and by the time you reply, they've bought from someone else.",
    solution: "An intelligent WhatsApp bot built on n8n + AI that replies instantly, 24/7. Handles menu queries, service details, booking requests, and even forwards hot leads to your phone with full context.",
    features: [
      "24/7 instant replies in English + Assamese",
      "Auto-sends your product catalog",
      "Collects customer info → saves to Google Sheet",
      "Sends daily status updates automatically",
      "Flags 'hot' leads to you via notification",
      "Works with your existing WhatsApp Business number",
    ],
    perfectFor: ["Local shops & restaurants", "Home-based businesses", "Tuition centers", "Beauty parlours, salons", "Small e-commerce sellers"],
    useCase: "A grocery shop in Kampur was losing 10+ orders/week to late-night WhatsApp messages. After setup, the bot handled 80% of queries automatically — orders jumped 40% in the first month.",
  },
  "customer-reply": {
    title: "Customer Reply Agent",
    icon: "💬",
    color: "linear-gradient(135deg,#7c3aed,#a855f7)",
    tagline: "Stop typing the same reply 50 times a day.",
    problem: "You answer the same timings, delivery, and service-detail questions hundreds of times each week. That's 2-3 hours a day gone — time you could spend actually running your business.",
    solution: "A smart reply agent that understands customer questions (even typos, Hinglish, Assamese mix) and drafts the perfect response. You review and send with one tap — or let it auto-reply to routine queries.",
    features: [
      "Understands English, Assamese, Hinglish",
      "Learns your tone — sounds like YOU, not a robot",
      "Drafts replies for WhatsApp, Instagram DMs, website chat",
      "Handles FAQs, service details, availability queries",
      "Escalates complex queries to you with summary",
      "Gets smarter with every conversation",
    ],
    perfectFor: ["Clinics & diagnostic centers", "Shops with heavy DM traffic", "Coaching institutes", "Hotels & guest houses", "Service professionals (tutors, photographers, etc.)"],
    useCase: "A dental clinic was getting 60+ DMs daily asking the same 5 questions. The agent now handles 90% automatically — the doctor saves 3 hours/day and books 30% more appointments.",
  },
  "doc-drafting": {
    title: "Document Drafting Agent",
    icon: "📄",
    color: "linear-gradient(135deg,#0ea5e9,#3b82f6)",
    tagline: "2-hour paperwork in 2 minutes. Professional, every time.",
    problem: "Drafting a simple letter, notice, or application eats hours. You stare at Microsoft Word, reword the same line 5 times, and still end up with something that sounds 'off'. And if it's in Assamese? Even worse.",
    solution: "Tell the agent what you need in plain words. It writes a polished, formal document in seconds — letters, contracts, notices, reports, applications, legal drafts. In English OR Assamese. Edit-ready.",
    features: [
      "Generates in English + Assamese (proper formal tone)",
      "Templates for letters, contracts, notices, RTIs, applications",
      "Stores your letterhead, signature, office details",
      "Export as Word, PDF, or direct print",
      "Legal-format drafts (agreements, affidavits, notices)",
      "One-click 'make it more formal' / 'shorten' / 'translate'",
    ],
    perfectFor: ["Law firms & legal consultants", "NGOs & social organizations", "Schools & college offices", "Panchayat & govt. office staff", "Small business owners"],
    useCase: "A local NGO spent 4-5 hours drafting each funding proposal. Now they generate a polished draft in 3 minutes, edit for 20 mins, and submit. They've doubled their grant applications this year.",
  },
  "exam-gen": {
    title: "Exam & Quiz Generator",
    icon: "📝",
    color: "linear-gradient(135deg,#f59e0b,#f97316)",
    tagline: "Topic in. Full question paper out. 30 seconds.",
    problem: "Teachers spend entire Sundays making question papers. Typing questions, formatting, balancing difficulty, making different sets for different sections — it eats your weekends and still feels rushed.",
    solution: "Just type the chapter name. Choose class level, subject, number of questions, difficulty mix. The agent generates a ready-to-print question paper — MCQs, short answers, long answers, with marks, in your preferred format.",
    features: [
      "Any subject, any class (1 to 12, college level)",
      "Mix of MCQ, short, long, fill-in-the-blanks",
      "Auto-balanced difficulty (easy/medium/hard ratio)",
      "Answer key generated alongside",
      "Assamese & English medium supported",
      "Print-ready PDF with school/institute letterhead",
    ],
    perfectFor: ["Schools (all boards — SEBA, CBSE, ICSE)", "Coaching centers & tuition classes", "College professors", "Home tutors", "Competitive exam trainers"],
    useCase: "A coaching center owner was losing 6 hours/week making weekly tests for 5 batches. Now each test takes 2 minutes. He used the free time to add 2 more batches — 40% more revenue.",
  },
  "social-writer": {
    title: "Social Media Writer",
    icon: "📱",
    color: "linear-gradient(135deg,#ec4899,#f43f5e)",
    tagline: "Post daily like a big brand. Without hiring one.",
    problem: "You know social media grows business. But every time you open Facebook to post, you stare at the blank box. What do I write? Does this sound silly? Eventually you just... don't post. Your competitors do.",
    solution: "Upload your product or type what you sold today. The agent writes 3-5 catchy captions instantly — for Facebook, Instagram, WhatsApp status — with the right hashtags, emojis, and local flavor.",
    features: [
      "Generates FB, Instagram, WhatsApp-status ready captions",
      "Festival & trending topic posts (Bihu, Durga Puja, etc.)",
      "Caption + relevant hashtags + emoji suggestions",
      "Product-launch posts, sale posts, story posts",
      "Works in English + Assamese mix (your customers' language)",
      "30 days of content ideas in one click",
    ],
    perfectFor: ["Clothing & boutique shops", "Food businesses & home bakers", "Beauty salons & spas", "Handicraft & gift sellers", "Any brand with zero time for content"],
    useCase: "A home baker in Nagaon was posting once a month. With the agent, she now posts daily — orders grew 3x in 2 months without spending on ads.",
  },
  "data-summarizer": {
    title: "Data Summarizer Agent",
    icon: "📊",
    color: "linear-gradient(135deg,#10b981,#059669)",
    tagline: "50-page PDF? Get the key points in one click.",
    problem: "Your desk has a stack of reports, circulars, meeting minutes, policy PDFs, Excel sheets. Nobody has time to read all of it. Important points get missed. Decisions get delayed.",
    solution: "Drop in any PDF, Excel, CSV, or Word file. The agent gives you: a 1-paragraph summary, 5 key bullet points, action items, and answers to any question you ask about the document.",
    features: [
      "Upload PDF, Excel, CSV, Word — any document",
      "1-paragraph executive summary",
      "Top 5 key points / decisions / numbers",
      "Ask questions: 'What's our Q3 revenue?' → instant answer",
      "Extracts tables, dates, names, figures",
      "Works on Assamese + English documents",
    ],
    perfectFor: ["Govt. offices & panchayats", "Schools & college admin", "NGOs handling reports", "Business owners reviewing contracts", "Anyone drowning in paperwork"],
    useCase: "A school principal received a 120-page education policy update. Instead of reading for hours, the agent gave her the 8 key changes affecting her school in 30 seconds.",
  },
};

function openAgentModal(key) {
  const a = AGENT_DATA[key];
  if (!a) return;
  const modal = document.getElementById("agentModal");
  document.getElementById("agentIcon").style.background = a.color;
  document.getElementById("agentIcon").textContent = a.icon;
  document.getElementById("agentTitle").textContent = a.title;
  document.getElementById("agentTagline").textContent = a.tagline;
  document.getElementById("agentProblem").textContent = a.problem;
  document.getElementById("agentSolution").textContent = a.solution;
  document.getElementById("agentFeatures").innerHTML = a.features.map(f => `<li>${f}</li>`).join("");
  document.getElementById("agentPerfectFor").innerHTML = a.perfectFor.map(p => `<span class="agent-chip">${p}</span>`).join("");
  document.getElementById("agentUseCase").textContent = a.useCase;
  const msg = encodeURIComponent(`Hi Smart Digital! I want to know more about the ${a.title} ${a.icon}`);
  document.getElementById("agentWhatsApp").href = `https://wa.me/918638759478?text=${msg}`;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeAgentModal() {
  document.getElementById("agentModal").classList.remove("show");
  document.body.style.overflow = "";
}

// ─── QUOTE CALCULATOR ──────────────────────────────────────
function calcQuote() {
  const result = document.getElementById("calcTotal");
  if (result) result.textContent = "WhatsApp";
  const box = document.getElementById("calcResult");
  box.style.background =
    "linear-gradient(135deg,#6366f1,#8b5cf6)";
}

// ─── GALLERY ───────────────────────────────────────────────
const GALLERY_DATA = [
  // Graphic Design (7)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770420864/output_01_jepg_w9i6bq.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770420864/output_01_jepg_w9i6bq.jpg", title: "Cover Page Design", desc: "Professional cover page design for your business needs.", category: "design", sub: "design" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1777226696/ass-01_wtfhxs.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1777226696/ass-01_wtfhxs.png", title: "Marketing Poster (Assamese 1)", desc: "Creative promotional poster designed in Assamese.", category: "design", sub: "design" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1777226696/eng-01_vlesgx.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1777226696/eng-01_vlesgx.png", title: "Marketing Poster (English 1)", desc: "Creative promotional poster designed in English.", category: "design", sub: "design" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1777226696/ass-03_xm54s9.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1777226696/ass-03_xm54s9.png", title: "Marketing Poster (Assamese 2)", desc: "Creative promotional poster designed in Assamese.", category: "design", sub: "design" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1777226697/eng-02_p7ed6f.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1777226697/eng-02_p7ed6f.png", title: "Marketing Poster (English 2)", desc: "Creative promotional poster designed in English.", category: "design", sub: "design" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1777226696/ass-02_uuna8a.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1777226696/ass-02_uuna8a.png", title: "Marketing Poster (Assamese 3)", desc: "Creative promotional poster designed in Assamese.", category: "design", sub: "design" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1777226780/timing_xdpqmj.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1777226780/timing_xdpqmj.png", title: "Shop Timing Poster", desc: "Custom designed shop timing and schedule poster.", category: "design", sub: "design" },

  // Canvas Art (7)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321830/IMG20221030094856_o3zotg.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321830/IMG20221030094856_o3zotg.jpg", title: "Winter Sunset", desc: "A beautiful winter sunset artwork painted on canvas.", category: "canvas", sub: "canvas" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321827/IMG20220925120350_bscbpz.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321827/IMG20220925120350_bscbpz.jpg", title: "Sunny Day", desc: "A beautiful sunny day artwork painted on canvas.", category: "canvas", sub: "canvas" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321828/IMG20220925220718_bmq0lz.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321828/IMG20220925220718_bmq0lz.jpg", title: "Golden Landscape", desc: "A beautiful golden landscape artwork painted on canvas.", category: "canvas", sub: "canvas" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321832/IMG20221030093923_vszgob.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321832/IMG20221030093923_vszgob.jpg", title: "River Sunset", desc: "A beautiful river sunset artwork painted on canvas.", category: "canvas", sub: "canvas" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321832/IMG20221118163135_jwta1r.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321832/IMG20221118163135_jwta1r.jpg", title: "Lachit Barphkon", desc: "A beautiful lachit barphkon artwork painted on canvas.", category: "canvas", sub: "canvas" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770505930/20210722_010657-01_syus5h.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770505930/20210722_010657-01_syus5h.jpg", title: "Modern Canvas Print", desc: "A beautiful modern canvas print artwork painted on canvas.", category: "canvas", sub: "canvas" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770505930/20230523_215032_afygf7.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770505930/20230523_215032_afygf7.jpg", title: "Abstract Canvas Art", desc: "A beautiful abstract canvas art artwork painted on canvas.", category: "canvas", sub: "canvas" },

  // Digital Art (5)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770420843/Illustration6_apzdyo.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770420843/Illustration6_apzdyo.jpg", title: "Digital Illustration 1", desc: "A creative digital illustration 1 created digitally.", category: "digital", sub: "digital" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770420846/screaming_boy_lepxlp.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770420846/screaming_boy_lepxlp.jpg", title: "Screaming Boy", desc: "A creative screaming boy created digitally.", category: "digital", sub: "digital" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770420845/Illustration9_t49bsv.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770420845/Illustration9_t49bsv.jpg", title: "Digital Illustration 3", desc: "A creative digital illustration 3 created digitally.", category: "digital", sub: "digital" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770420847/still_life_mmx9jc.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770420847/still_life_mmx9jc.jpg", title: "Still Life", desc: "A creative still life created digitally.", category: "digital", sub: "digital" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770420846/jar_portrait_s4jbvx.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770420846/jar_portrait_s4jbvx.jpg", title: "Jar Portrait", desc: "A creative jar portrait created digitally.", category: "digital", sub: "digital" },

  // Photo Restoration (3)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770671360/1_gp7nf0.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770671360/1_gp7nf0.png", title: "Vintage Photo Restoration", desc: "High-quality vintage photo restoration bringing old memories back to life.", category: "restore", sub: "restore" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770671361/3_zfoq3c.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770671361/3_zfoq3c.png", title: "Old Family Photo Restoration", desc: "High-quality old family photo restoration bringing old memories back to life.", category: "restore", sub: "restore" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770671372/2_qvtoqu.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770671372/2_qvtoqu.png", title: "Heritage Photo Restoration", desc: "High-quality heritage photo restoration bringing old memories back to life.", category: "restore", sub: "restore" },

  // Wall Art - Space Underwater Room Mural (4)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321111/20220601_141158_nzotoa.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321111/20220601_141158_nzotoa.jpg", title: "Space Underwater Mural", desc: "A stunning space underwater mural wall mural for interior decoration.", category: "wallart", sub: "space-underwater" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321112/20211028_140808_grei88.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321112/20211028_140808_grei88.jpg", title: "Underwater Scene", desc: "A stunning underwater scene wall mural for interior decoration.", category: "wallart", sub: "space-underwater" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321111/IMG_20230320_234018_177_npcqlt.webp", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321111/IMG_20230320_234018_177_npcqlt.webp", title: "Cosmic Room Art", desc: "A stunning cosmic room art wall mural for interior decoration.", category: "wallart", sub: "space-underwater" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321291/20211227_232420_toq2xm.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321291/20211227_232420_toq2xm.jpg", title: "Galaxy Mural", desc: "A stunning galaxy mural wall mural for interior decoration.", category: "wallart", sub: "space-underwater" },

  // Wall Art - Happy Family (4)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770316854/IMG20220612035857_dohxpm.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770316854/IMG20220612035857_dohxpm.jpg", title: "Family Portrait Art 1", desc: "A stunning family portrait art 1 wall mural for interior decoration.", category: "wallart", sub: "happy-family" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770316855/IMG20220612151506_ompbyn.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770316855/IMG20220612151506_ompbyn.jpg", title: "Family Portrait Art 2", desc: "A stunning family portrait art 2 wall mural for interior decoration.", category: "wallart", sub: "happy-family" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770316856/IMG20220612151448_blgogd.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770316856/IMG20220612151448_blgogd.jpg", title: "Family Portrait Art 3", desc: "A stunning family portrait art 3 wall mural for interior decoration.", category: "wallart", sub: "happy-family" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770317569/IMG20220606194904_a5ytfk.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770317569/IMG20220606194904_a5ytfk.jpg", title: "Family Portrait Art 4", desc: "A stunning family portrait art 4 wall mural for interior decoration.", category: "wallart", sub: "happy-family" },

  // Wall Art - Rhino Elephant B&W (5)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320673/IMG_20210204_165331-01_uhm2ni.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320673/IMG_20210204_165331-01_uhm2ni.jpg", title: "Wildlife Sketch 1", desc: "A stunning wildlife sketch 1 wall mural for interior decoration.", category: "wallart", sub: "wildlife-bw" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320642/IMG_20201108_112939-01_xqmtke.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320642/IMG_20201108_112939-01_xqmtke.jpg", title: "Wildlife Sketch 2", desc: "A stunning wildlife sketch 2 wall mural for interior decoration.", category: "wallart", sub: "wildlife-bw" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320731/IMG_20201106_164324_zqoe26.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320731/IMG_20201106_164324_zqoe26.jpg", title: "Wildlife Sketch 3", desc: "A stunning wildlife sketch 3 wall mural for interior decoration.", category: "wallart", sub: "wildlife-bw" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320733/IMG_20201103_161926_acfmgh.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320733/IMG_20201103_161926_acfmgh.jpg", title: "Wildlife Sketch 4", desc: "A stunning wildlife sketch 4 wall mural for interior decoration.", category: "wallart", sub: "wildlife-bw" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320729/IMG_20201030_155748_yuzmjq.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320729/IMG_20201030_155748_yuzmjq.jpg", title: "Wildlife Sketch 5", desc: "A stunning wildlife sketch 5 wall mural for interior decoration.", category: "wallart", sub: "wildlife-bw" },

  // Wall Art - Bholenath (3)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318022/IMG_20210527_000613_375_vjdtcb.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318022/IMG_20210527_000613_375_vjdtcb.jpg", title: "Bholenath Art 1", desc: "A stunning bholenath art 1 wall mural for interior decoration.", category: "wallart", sub: "bholenath" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318025/20210525_202925_wm6mkv.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318025/20210525_202925_wm6mkv.jpg", title: "Bholenath Art 2", desc: "A stunning bholenath art 2 wall mural for interior decoration.", category: "wallart", sub: "bholenath" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318024/20210525_202816_dq9a7j.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318024/20210525_202816_dq9a7j.jpg", title: "Bholenath Art 3", desc: "A stunning bholenath art 3 wall mural for interior decoration.", category: "wallart", sub: "bholenath" },

  // Wall Art - Mushrooms Forest (6)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318856/IMG_20200820_130753_bfuzej.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318856/IMG_20200820_130753_bfuzej.jpg", title: "Mushroom Forest 1", desc: "A stunning mushroom forest 1 wall mural for interior decoration.", category: "wallart", sub: "mushrooms" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318481/IMG_20200820_130712mmm_yib2cm.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318481/IMG_20200820_130712mmm_yib2cm.jpg", title: "Mushroom Forest 2", desc: "A stunning mushroom forest 2 wall mural for interior decoration.", category: "wallart", sub: "mushrooms" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318857/IMG_20200820_130940_s01tsg.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318857/IMG_20200820_130940_s01tsg.jpg", title: "Mushroom Forest 3", desc: "A stunning mushroom forest 3 wall mural for interior decoration.", category: "wallart", sub: "mushrooms" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318858/IMG_20200820_130726_jinoy4.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318858/IMG_20200820_130726_jinoy4.jpg", title: "Mushroom Forest 4", desc: "A stunning mushroom forest 4 wall mural for interior decoration.", category: "wallart", sub: "mushrooms" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318859/IMG_20200820_130743_g2mq86.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318859/IMG_20200820_130743_g2mq86.jpg", title: "Mushroom Forest 5", desc: "A stunning mushroom forest 5 wall mural for interior decoration.", category: "wallart", sub: "mushrooms" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770318859/IMG_20200820_130734_imlduo.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770318859/IMG_20200820_130734_imlduo.jpg", title: "Mushroom Forest 6", desc: "A stunning mushroom forest 6 wall mural for interior decoration.", category: "wallart", sub: "mushrooms" },

  // Wall Art - Fantasy Kingdom (4)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319224/20210406_174942_amcwic.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319224/20210406_174942_amcwic.jpg", title: "Fantasy Kingdom 1", desc: "A stunning fantasy kingdom 1 wall mural for interior decoration.", category: "wallart", sub: "fantasy" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319221/20210406_160626_czd5nt.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319221/20210406_160626_czd5nt.jpg", title: "Fantasy Kingdom 2", desc: "A stunning fantasy kingdom 2 wall mural for interior decoration.", category: "wallart", sub: "fantasy" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319232/bbbb_bzuybo.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319232/bbbb_bzuybo.jpg", title: "Fantasy Kingdom 3", desc: "A stunning fantasy kingdom 3 wall mural for interior decoration.", category: "wallart", sub: "fantasy" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319219/20210406_153544_tnnyin.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319219/20210406_153544_tnnyin.jpg", title: "Fantasy Kingdom 4", desc: "A stunning fantasy kingdom 4 wall mural for interior decoration.", category: "wallart", sub: "fantasy" },

  // Wall Art - Deer Abstract (3)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319516/backupPreview_q35prt.png", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319516/backupPreview_q35prt.png", title: "Deer Abstract 1", desc: "A stunning deer abstract 1 wall mural for interior decoration.", category: "wallart", sub: "deer" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319518/20201210_120624_v1twdj.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319518/20201210_120624_v1twdj.jpg", title: "Deer Abstract 2", desc: "A stunning deer abstract 2 wall mural for interior decoration.", category: "wallart", sub: "deer" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319518/20201209_135956_hzbeo1.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319518/20201209_135956_hzbeo1.jpg", title: "Deer Abstract 3", desc: "A stunning deer abstract 3 wall mural for interior decoration.", category: "wallart", sub: "deer" },

  // Wall Art - Waterfall Landscape (3)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319882/IMG20220622090549_navqma.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319882/IMG20220622090549_navqma.jpg", title: "Waterfall Landscape 1", desc: "A stunning waterfall landscape 1 wall mural for interior decoration.", category: "wallart", sub: "waterfall" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319880/IMG20220621003252_pieteh.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319880/IMG20220621003252_pieteh.jpg", title: "Waterfall Landscape 2", desc: "A stunning waterfall landscape 2 wall mural for interior decoration.", category: "wallart", sub: "waterfall" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770319879/IMG20220617041455_bvd4f2.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770319879/IMG20220617041455_bvd4f2.jpg", title: "Waterfall Landscape 3", desc: "A stunning waterfall landscape 3 wall mural for interior decoration.", category: "wallart", sub: "waterfall" },

  // Wall Art - Iron Man (3)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320176/20210530_143554_d3rqd2.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320176/20210530_143554_d3rqd2.jpg", title: "Iron Man Art 1", desc: "A stunning iron man art 1 wall mural for interior decoration.", category: "wallart", sub: "ironman" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320173/20210530_014453_w4kovr.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320173/20210530_014453_w4kovr.jpg", title: "Iron Man Art 2", desc: "A stunning iron man art 2 wall mural for interior decoration.", category: "wallart", sub: "ironman" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770320172/20210530_014234_k7w9al.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770320172/20210530_014234_k7w9al.jpg", title: "Iron Man Art 3", desc: "A stunning iron man art 3 wall mural for interior decoration.", category: "wallart", sub: "ironman" },

  // Wall Art - Other Murals (8)
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321410/20230103_153546_lhxau5.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321410/20230103_153546_lhxau5.jpg", title: "Room Mural 1", desc: "A stunning room mural 1 wall mural for interior decoration.", category: "wallart", sub: "murals" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321408/20221106_141204_fnlcic.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321408/20221106_141204_fnlcic.jpg", title: "Room Mural 2", desc: "A stunning room mural 2 wall mural for interior decoration.", category: "wallart", sub: "murals" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321406/20220312_105242_vemi42.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321406/20220312_105242_vemi42.jpg", title: "Room Mural 3", desc: "A stunning room mural 3 wall mural for interior decoration.", category: "wallart", sub: "murals" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321403/20220312_105224_jdbehl.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321403/20220312_105224_jdbehl.jpg", title: "Room Mural 4", desc: "A stunning room mural 4 wall mural for interior decoration.", category: "wallart", sub: "murals" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321403/20220309_193407_mizuoo.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321403/20220309_193407_mizuoo.jpg", title: "Room Mural 5", desc: "A stunning room mural 5 wall mural for interior decoration.", category: "wallart", sub: "murals" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321400/20220221_232830_b3scqe.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321400/20220221_232830_b3scqe.jpg", title: "Room Mural 6", desc: "A stunning room mural 6 wall mural for interior decoration.", category: "wallart", sub: "murals" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321411/IMG-20220603-WA0000_gdxcf2.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321411/IMG-20220603-WA0000_gdxcf2.jpg", title: "Room Mural 7", desc: "A stunning room mural 7 wall mural for interior decoration.", category: "wallart", sub: "murals" },
  { thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770321412/20230401_164517_hiddt5.jpg", full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770321412/20230401_164517_hiddt5.jpg", title: "Room Mural 8", desc: "A stunning room mural 8 wall mural for interior decoration.", category: "wallart", sub: "murals" },
];

const GALLERY_CATEGORIES = {
  all: { label: "All", labelAs: "সকলো" },
  canvas: { label: "Canvas Art", labelAs: "কেনভাছ আৰ্ট" },
  wallart: { label: "Wall Art", labelAs: "ৱল আৰ্ট" },
  digital: { label: "Digital Art", labelAs: "ডিজিটেল আৰ্ট" },
  restore: { label: "Photo Restore", labelAs: "ফটো ৰিষ্টোৰ" },
  design: { label: "Graphic Design", labelAs: "গ্ৰাফিক ডিজাইন" },
};

const GALLERY_SUB_FILTERS = {
  wallart: [
    { key: "space-underwater", label: "Space & Underwater", labelAs: "স্পেছ আৰু আণ্ডাৰৱাটাৰ" },
    { key: "happy-family", label: "Family Portraits", labelAs: "পৰিবাৰ পৰ্ট্ৰেইট" },
    { key: "wildlife-bw", label: "Wildlife B&W", labelAs: "ৱাইল্ডলাইফ B&W" },
    { key: "bholenath", label: "Bholenath", labelAs: "ভোলেনাথ" },
    { key: "mushrooms", label: "Mushroom Forest", labelAs: "মাশৰুম ফৰেষ্ট" },
    { key: "fantasy", label: "Fantasy Kingdom", labelAs: "ফেন্টাছী কিংডম" },
    { key: "deer", label: "Deer Abstract", labelAs: "হৰিণ এবষ্ট্ৰেক্ট" },
    { key: "waterfall", label: "Waterfall", labelAs: "ৱাটাৰফল" },
    { key: "ironman", label: "Iron Man", labelAs: "আইৰন মেন" },
    { key: "murals", label: "Room Murals", labelAs: "ৰুম মিউৰেল" },
  ],
};

const INITIAL_LOAD = 12;
const LOAD_MORE_COUNT = 12;
let currentCategory = "all";
let currentSubFilter = "all";
let visibleCount = INITIAL_LOAD;

function getCategoryCount(cat) {
  if (cat === "all") return GALLERY_DATA.length;
  return GALLERY_DATA.filter((img) => img.category === cat).length;
}

function getSubFilterCount(sub) {
  return GALLERY_DATA.filter((img) => img.sub === sub).length;
}

function getFilteredImages() {
  let filtered = GALLERY_DATA;
  if (currentCategory !== "all") {
    filtered = filtered.filter((img) => img.category === currentCategory);
  }
  if (currentSubFilter !== "all") {
    filtered = filtered.filter((img) => img.sub === currentSubFilter);
  }
  return filtered;
}

function buildFilterButtons() {
  const container = document.getElementById("galleryFilterBtns");
  if (!container) return;
  container.innerHTML = "";
  Object.entries(GALLERY_CATEGORIES).forEach(([key, val]) => {
    const count = getCategoryCount(key);
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (key === currentCategory ? " active" : "");
    btn.setAttribute("data-category", key);
    btn.innerHTML = `${val.label} <span class="filter-count">${count}</span>`;
    btn.onclick = function () {
      filterGallery(key, this);
    };
    container.appendChild(btn);
  });
}

function buildSubFilters() {
  const existing = document.querySelector(".sub-filter-btns");
  if (existing) existing.remove();

  const subs = GALLERY_SUB_FILTERS[currentCategory];
  if (!subs) return;

  const container = document.createElement("div");
  container.className = "sub-filter-btns";

  const allBtn = document.createElement("button");
  allBtn.className = "sub-filter-btn" + (currentSubFilter === "all" ? " active" : "");
  allBtn.textContent = "All";
  allBtn.onclick = function () {
    currentSubFilter = "all";
    visibleCount = INITIAL_LOAD;
    buildSubFilters();
    renderGallery();
  };
  container.appendChild(allBtn);

  subs.forEach((sub) => {
    const count = getSubFilterCount(sub.key);
    const btn = document.createElement("button");
    btn.className = "sub-filter-btn" + (currentSubFilter === sub.key ? " active" : "");
    btn.textContent = `${sub.label} (${count})`;
    btn.onclick = function () {
      currentSubFilter = sub.key;
      visibleCount = INITIAL_LOAD;
      buildSubFilters();
      renderGallery();
    };
    container.appendChild(btn);
  });

  const filterBtns = document.getElementById("galleryFilterBtns");
  filterBtns.parentNode.insertBefore(container, filterBtns.nextSibling);
}

function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  const loadWrap = document.getElementById("loadMoreWrap");
  if (!grid) return;

  const filtered = getFilteredImages();
  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = "";
  toShow.forEach((img, i) => {
    const item = document.createElement("div");
    item.className = "gallery-item fade-in";
    item.style.animationDelay = `${i * 0.05}s`;
    item.setAttribute("data-category", img.category);
    item.setAttribute("data-sub", img.sub);
    item.setAttribute("data-index", GALLERY_DATA.indexOf(img));
    item.onclick = function () {
      openLightbox(this);
    };
    item.innerHTML = `
      <img src="${img.thumb}" alt="${img.title}" loading="lazy">
      <div class="gallery-overlay">
        <div class="overlay-icon"><i class="fas fa-search-plus"></i></div>
        <div class="overlay-title">${img.title}</div>
        <div class="overlay-tag">${img.category}</div>
      </div>
    `;
    grid.appendChild(item);
  });

  if (loadWrap) {
    loadWrap.style.display = toShow.length < filtered.length ? "block" : "none";
  }
}

function filterGallery(cat, btn) {
  currentCategory = cat;
  currentSubFilter = "all";
  visibleCount = INITIAL_LOAD;

  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  buildSubFilters();
  renderGallery();
}

function loadMoreGallery() {
  visibleCount += LOAD_MORE_COUNT;
  renderGallery();
}

// ── Lightbox ──
let lbImages = [],
  lbData = [],
  lbIndex = 0;

function openLightbox(el) {
  const filtered = getFilteredImages();
  lbData = filtered;
  lbImages = filtered.map((img) => img.full);
  const globalIdx = parseInt(el.getAttribute("data-index"));
  lbIndex = filtered.indexOf(GALLERY_DATA[globalIdx]);
  if (lbIndex < 0) lbIndex = 0;

  updateLightbox();
  document.getElementById("lightbox").classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateLightbox() {
  if (!lbImages.length) return;
  document.getElementById("lbImage").src = lbImages[lbIndex];
  document.getElementById("lbCaption").textContent = lbData[lbIndex].title;
  
  const descEl = document.getElementById("lbDesc");
  if (descEl) {
    descEl.textContent = lbData[lbIndex].desc || "";
  }

  document.getElementById("lbCounter").textContent = `${lbIndex + 1} / ${lbImages.length}`;
  document.getElementById("lbDownload").href = lbImages[lbIndex];
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}

function nextImg(e) {
  if (e) e.stopPropagation();
  lbIndex = (lbIndex + 1) % lbImages.length;
  updateLightbox();
}

function prevImg(e) {
  if (e) e.stopPropagation();
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  updateLightbox();
}

document.addEventListener("keydown", (e) => {
  if (!document.getElementById("lightbox").classList.contains("active")) return;
  if (e.key === "ArrowRight") nextImg(e);
  else if (e.key === "ArrowLeft") prevImg(e);
  else if (e.key === "Escape") closeLightbox();
});

// Initialize gallery on load
document.addEventListener("DOMContentLoaded", () => {
  try {
    initTheme();
    initFirebase();
    buildFilterButtons();
    buildSubFilters();
    renderGallery();
    renderCertificates();
    initPunchWidgets();
    createParticles();
    initMagicRemover();
    
    // Basic UI setup
    document.body.style.opacity = "1";
    tickClock();
    tickBoardTime();
    updateServiceTimer();
    setupReveal();
    console.log("✅ Site initialized successfully");
  } catch (err) {
    console.error("❌ Critical initialization error:", err);
  }
});

// ─── CERTIFICATES ─────────────────────────────────────────
const CERTIFICATES_DATA = [
  {
    thumb: "assets/img/certs/cert-isb-cce.png",
    full: "assets/img/certs/cert-isb-cce.png",
    title: "Certificate of Completion — CCE",
    platform: "ISB · Digital India · CSC",
    icon: "fas fa-university",
  },
  {
    thumb: "assets/img/certs/cert-apna-pan.png",
    full: "assets/img/certs/cert-apna-pan.png",
    title: "Certificate of Authorization",
    platform: "Apna Pan Agency",
    icon: "fas fa-id-card",
  },
  {
    thumb: "assets/img/certs/cert-claude.png",
    full: "assets/img/certs/cert-claude.png",
    title: "Demonstrated Skill & Capability",
    platform: "Claude · Anthropic",
    icon: "fas fa-award",
  },
  {
    thumb: "https://res.cloudinary.com/duzr2cnth/image/upload/w_600,c_fill,f_auto,q_auto/v1770315598/UC-c4fd8c29-b30c-4d38-bbf3-0afd42d46292_d8z3ty.jpg",
    full: "https://res.cloudinary.com/duzr2cnth/image/upload/v1770315598/UC-c4fd8c29-b30c-4d38-bbf3-0afd42d46292_d8z3ty.jpg",
    title: "Web Development Bootcamp",
    platform: "Udemy",
    icon: "fas fa-graduation-cap",
  },
];

function renderCertificates() {
  const grid = document.getElementById("certGrid");
  if (!grid) return;
  grid.innerHTML = "";

  CERTIFICATES_DATA.forEach((cert) => {
    const card = document.createElement("div");
    card.className = "cert-card";
    card.onclick = function () {
      openCertLightbox(cert);
    };
    card.innerHTML = `
      <div style="overflow:hidden;">
        <img class="cert-card-img" src="${cert.thumb}" alt="${cert.title}" loading="lazy">
      </div>
      <div class="cert-card-body">
        <div class="cert-card-title">${cert.title}</div>
        <div class="cert-card-platform"><i class="${cert.icon}"></i> ${cert.platform}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openCertLightbox(cert) {
  lbData = [cert];
  lbImages = [cert.full];
  lbIndex = 0;
  updateLightbox();
  document.getElementById("lbCaption").textContent = cert.title + " — " + cert.platform;
  document.getElementById("lbDownload").href = cert.full;
  document.getElementById("lightbox").classList.add("active");
  document.body.style.overflow = "hidden";
}

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
  const form = e.target;
  const to = "smartdigitalassam@gmail.com";
  const name = form.elements.name?.value.trim() || "Website visitor";
  const phone = form.elements.phone?.value.trim() || "Not provided";
  const service = form.elements.service?.value || "Not selected";
  const message = form.elements.message?.value.trim() || "No message provided";
  const subject = `Smart Digital enquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service Required: ${service}`,
    "",
    "Message:",
    message,
    "",
    "Sent from smartdigitalassam.com"
  ].join("\n");

  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast("✅ Opening email app to send your message.", "success");
  form.reset();
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

// ─── PUNCH BUTTON / HYPE COUNTER ───────────────────────────
// Initialize punch widgets on page load
function initPunchWidgets() {
  document
    .querySelectorAll(".punch-widget, .punch-widget-inline, .punch-widget-demo")
    .forEach((w) => {
      const id = w.dataset.id;
      loadPunchCount(w, id);
    });
}

// Load punch count from Firebase
function loadPunchCount(widget, id) {
  const countEl = widget.querySelector(
    ".punch-count, .punch-count-sm, .punch-count-xs",
  );
  if (!countEl) return;

  const firebaseDb = getDb();
  if (!firebaseDb) return;

  firebaseDb.ref("punches/" + id).on("value", (snap) => {
    const count = snap.val() || 0;
    countEl.textContent = count;
  });
}

// Handle punch click - no per-user limits
function doPunch(btn) {
  const widget = btn.closest(
    ".punch-widget, .punch-widget-inline, .punch-widget-demo",
  );
  if (!widget) return;

  const id = widget.dataset.id;
  const countEl = widget.querySelector(
    ".punch-count, .punch-count-sm, .punch-count-xs",
  );

  // Optimistic UI update
  if (countEl) {
    const current = parseInt(countEl.textContent) || 0;
    countEl.textContent = current + 1;
  }

  // Animate button
  btn.classList.add("punching");
  setTimeout(() => btn.classList.remove("punching"), 300);

  // Increment in Firebase
  const firebaseDb = getDb();
  if (!firebaseDb) {
    showToast("❌ Firebase not connected", "error");
    return;
  }
  
  const ref = firebaseDb.ref("punches/" + id);
  ref
    .transaction((current) => {
      return (current || 0) + 1;
    })
    .catch((err) => {
      console.error("Punch error:", err);
      showToast("❌ Could not save hype: " + err.message, "error");
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
  // Any heavy initialization that can wait
});

// ─── MAGIC BG REMOVER ──────────────────────────────────────
function initMagicRemover() {
  const input = document.getElementById("hero-bg-input");

  if (!input) return;

  input.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleMagicRemove(e.target.files[0]);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  });
}

function openMagicModal() {
  const modal = document.getElementById("magicRemoverModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeMagicModal() {
  const modal = document.getElementById("magicRemoverModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

async function handleMagicRemove(file) {
  openMagicModal();

  // Reset UI
  const loading = document.getElementById("magic-loading");
  const resultContainer = document.getElementById("magic-result-container");
  const actions = document.getElementById("magic-actions");
  const errorEl = document.getElementById("magic-error");
  const statusEl = document.getElementById("magic-status");
  const resultImg = document.getElementById("magic-result-img");

  loading.style.display = "flex";
  resultContainer.style.display = "none";
  actions.style.display = "none";
  errorEl.style.display = "none";
  statusEl.textContent = currentLang === "en" ? "AI is processing your image..." : "এআই- এ আপোনাৰ ছবিটো প্ৰক্ৰিয়াকৰণ কৰি আছে...";

  const apiKey = "aMjaN6B37Xu32zDpxuAvfRz9"; // Found in generator.js

  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");
  formData.append("bg_color", "white");

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors ? errorData.errors[0].title : `API Error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Success! Update UI
    resultImg.src = url;
    loading.style.display = "none";
    resultContainer.style.display = "block";
    actions.style.display = "flex";
    statusEl.textContent = currentLang === "en" ? "Check out the magic! ✨" : "ম্যাজিকটো চাওক! ✨";

    // Setup download button
    const downloadBtn = document.getElementById("magic-download-btn");
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = `smart-digital-no-bg-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(currentLang === "en" ? "✅ Image downloaded!" : "✅ ছবি ডাউনলোড কৰা হ'ল!", "success");
    };

  } catch (error) {
    console.error("Magic BG Error:", error);
    loading.style.display = "none";
    errorEl.textContent = "❌ " + error.message;
    errorEl.style.display = "block";
    statusEl.textContent = currentLang === "en" ? "Oops! Something went wrong." : "ওহো! কিবা এটা ভুল হ'ল।";
  }
}

console.log(
  "%c✨ Smart Digital v3 ✨",
  "color:#6366f1;font-size:22px;font-weight:bold;",
);
console.log(
  "%cTiniali Bazar, Kachua, Kampur, Nagaon, Assam — Your Digital Partner",
  "color:#f97316;font-size:13px;",
);

// ─── TAB SWITCHING LOGIC ──────────────────────────────────
function switchTab(group, targetId, btn) {
  // Find all tab contents in the same group
  const contents = document.querySelectorAll(`.${group}-tab`);
  contents.forEach(el => el.classList.remove('active'));
  
  // Find all buttons in the parent container
  const btns = btn.parentNode.querySelectorAll('.filter-btn');
  btns.forEach(b => b.classList.remove('active'));
  
  // Activate target
  document.getElementById(targetId).classList.add('active');
  btn.classList.add('active');
}


// ─── AI PORTAL TOOL SEARCH ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const aiSearchInput = document.getElementById('toolSearch');
    const aiToolCards = document.querySelectorAll('.ai-svc-card');
    const aiNoResults = document.getElementById('noResults');

    if (aiSearchInput) {
        aiSearchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            let hasVisible = false;

            aiToolCards.forEach(card => {
                const name = card.getAttribute('data-name');
                if (name.includes(term)) {
                    card.style.display = 'flex';
                    hasVisible = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (aiNoResults) {
                aiNoResults.style.display = hasVisible ? 'none' : 'block';
            }
        });
    }
});

// ─── SHOP OPENING COUNTDOWN ──────────────────────────────────
(function () {
    // ⚙️  SET YOUR SHOP OPENING DATE HERE (YYYY, Month-1, Day, Hour, Minute)
    // Example: new Date(2025, 5, 15, 9, 0) = June 15 2025 at 9:00 AM
    const OPENING_DATE = new Date(2025, 5, 1, 9, 0, 0); // June 1 2025

    const bar = document.getElementById('openingCountdownBar');
    if (!bar) return;

    const elDays = document.getElementById('ocb-days');
    const elHours = document.getElementById('ocb-hours');
    const elMins = document.getElementById('ocb-mins');
    const elSecs = document.getElementById('ocb-secs');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const now = Date.now();
        const diff = OPENING_DATE.getTime() - now;

        if (diff <= 0) {
            // Shop is open — hide the bar (or show "We're Open!")
            bar.innerHTML = `<div class="ocb-inner" style="justify-content:center; gap:12px;">
                <span style="font-size:22px;">🎉</span>
                <span class="ocb-text" style="font-weight:800; font-size:16px;">Smart Digital is NOW OPEN at Tiniali Bazar, Kachua, Kampur!</span>
                <a href="https://wa.me/918638759478" target="_blank" class="ocb-notify-btn"><i class="fab fa-whatsapp"></i> Chat Now</a>
            </div>`;
            return; // stop ticking
        }

        const totalSecs = Math.floor(diff / 1000);
        const days  = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const mins  = Math.floor((totalSecs % 3600) / 60);
        const secs  = totalSecs % 60;

        if (elDays)  elDays.textContent  = pad(days);
        if (elHours) elHours.textContent = pad(hours);
        if (elMins)  elMins.textContent  = pad(mins);
        if (elSecs)  elSecs.textContent  = pad(secs);

        setTimeout(tick, 1000);
    }

    tick();
})();


// ============================================================
// UX IMPROVEMENTS — v3.1
// ============================================================

// ── 1. BACK TO TOP ──────────────────────────────────────────
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── 2. SERVICE CARD HOVER TOOLTIPS ──────────────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ai-svc-card').forEach(card => {
      const desc = card.querySelector('p');
      if (!desc) return;
      // Only add tooltip if not already present
      if (card.querySelector('.ai-svc-tooltip')) return;
      const tip = document.createElement('div');
      tip.className = 'ai-svc-tooltip';
      tip.textContent = desc.textContent.trim();
      card.appendChild(tip);
    });
  });
})();

// ── 4. NAV ACTIVE HIGHLIGHT — already handled by scroll spy ─
// (Existing scroll spy sets .active class; CSS now gives it a stronger style)

// ── 5. SEARCH EMPTY STATE WITH WHATSAPP CTA ─────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('toolSearch');
    const enhanced = document.getElementById('noResultsEnhanced');
    const legacy = document.getElementById('noResults');
    const waLink = document.getElementById('noResultsWaLink');
    if (!input || !enhanced) return;

    input.addEventListener('input', (e) => {
      const term = e.target.value.trim();
      const cards = document.querySelectorAll('.ai-svc-card');
      let hasVisible = false;

      cards.forEach(card => {
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const match = name.includes(term.toLowerCase());
        card.style.display = match ? 'flex' : 'none';
        if (match) hasVisible = true;
      });

      const showEmpty = !hasVisible && term.length > 0;

      // Hide legacy empty state, use enhanced one
      if (legacy) legacy.style.display = 'none';
      enhanced.classList.toggle('visible', showEmpty);

      // Update WhatsApp link with the search term
      if (waLink && term) {
        const msg = encodeURIComponent(`Hi Smart Digital! I was searching for "${term}" but couldn't find it. Can you help?`);
        waLink.href = `https://wa.me/918638759478?text=${msg}`;
      }
    });
  });
})();

// ── 6. WHATSAPP FLOAT LABEL ──────────────────────────────────
(function () {
  const label = document.getElementById('waFloatLabel');
  if (!label) return;

  // Show label after 3 seconds on first visit
  const shown = sessionStorage.getItem('wa_label_shown');
  if (!shown) {
    setTimeout(() => {
      label.classList.add('show');
      setTimeout(() => {
        label.classList.remove('show');
        sessionStorage.setItem('wa_label_shown', '1');
      }, 4000);
    }, 3000);
  }

  // Also show on hover of the WhatsApp button
  const waBtn = document.getElementById('whatsappFloat');
  if (waBtn) {
    waBtn.addEventListener('mouseenter', () => label.classList.add('show'));
    waBtn.addEventListener('mouseleave', () => label.classList.remove('show'));
  }
})();

// ── 7. SHOP STATUS CARD MOBILE COLLAPSE ─────────────────────
function toggleShopExpand() {
  const card = document.getElementById('shopStatusCard');
  const labelEl = document.getElementById('shopExpandLabel');
  if (!card) return;
  const isExpanded = card.classList.toggle('expanded');
  if (labelEl) {
    labelEl.textContent = isExpanded ? 'Hide details' : 'Show details';
  }
}

// ── 8. BUTTON RIPPLE EFFECT ──────────────────────────────────
(function () {
  function addRipple(e) {
    const btn = e.currentTarget;
    const existing = btn.querySelector('.btn-ripple');
    if (existing) existing.remove();

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Apply to call, whatsapp, and hero CTA buttons
    document.querySelectorAll('.btn-call, .btn-whatsapp, .btn-hero-cta, .btn-liquid-glass, .btn-primary').forEach(btn => {
      // Ensure position relative for ripple positioning
      const pos = getComputedStyle(btn).position;
      if (pos === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', addRipple);
    });
  });
})();

// ── 9. LANGUAGE TOGGLE FADE TRANSITION ──────────────────────
(function () {
  const origToggle = window.toggleLanguage;
  window.toggleLanguage = function () {
    document.body.classList.add('lang-transitioning');
    setTimeout(() => {
      origToggle();
      document.body.classList.remove('lang-transitioning');
    }, 180);
  };
})();

// ── 10. NOTIFICATION TIMESTAMP — relative time already exists ─
// relTime() function already handles this. Enhancing to show full date on hover.
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Add title attribute with full date to all notif time elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.notif-card-time').forEach(el => {
        if (el.dataset.tsEnhanced) return;
        // Try to find timestamp from parent card's data or text
        const timeText = el.textContent.trim();
        if (timeText && !el.title) {
          el.title = 'Posted: ' + timeText.replace(/[^\w\s,]/g, '').trim();
        }
        el.dataset.tsEnhanced = '1';
      });
    });
    const container = document.getElementById('notifContainer');
    if (container) observer.observe(container, { childList: true, subtree: true });
  });
})();

// ── 11. KEYBOARD NAVIGATION FOR AI SCROLL ───────────────────
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('aiScrollWrapper');
    if (!wrapper) return;

    // Make it focusable
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-label', 'AI Tools — use arrow keys to scroll');

    wrapper.addEventListener('keydown', (e) => {
      const scrollAmount = 260;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else if (e.key === 'Home') {
        e.preventDefault();
        wrapper.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (e.key === 'End') {
        e.preventDefault();
        wrapper.scrollTo({ left: wrapper.scrollWidth, behavior: 'smooth' });
      }
    });
  });
})();
