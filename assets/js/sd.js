/* Smart Digital — company-site behaviour (PLAN.md §7/§8).
   Deliberately separate from assets/js/script.js: that file drives the
   legacy single-page shop site (punch widgets, admin panel, notice board,
   certificate lightbox…) and none of that belongs on the new pages. This
   file only does what the new pages actually need. */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "918638759478";

  /* ── Theme — same localStorage key as the legacy site, so the toggle
     state feels consistent whether you're on a new page or an old app. ── */
  function initTheme() {
    var saved = localStorage.getItem("theme") || "dark";
    applyTheme(saved);
  }
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.querySelectorAll("[data-sd-theme-icon]").forEach(function (el) {
      el.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    });
  }
  function toggleTheme() {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  /* ── Language — new "sd-lang" key. The legacy site never persisted
     language across page loads; a multi-page company site makes that gap
     obvious, so this fixes it going forward. ── */
  function initLang() {
    var saved = localStorage.getItem("sd-lang") || "en";
    applyLang(saved);
  }
  function applyLang(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    document.querySelectorAll("[data-sd-lang-label]").forEach(function (el) {
      el.textContent = lang === "en" ? "As" : "En";
    });
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var text = el.getAttribute("data-" + lang);
      if (!text) return;
      if (el.children.length === 0) {
        el.textContent = text;
      } else {
        var firstText = Array.prototype.find.call(el.childNodes, function (n) {
          return n.nodeType === Node.TEXT_NODE && n.textContent.trim();
        });
        if (firstText) firstText.textContent = text;
      }
    });
    document.querySelectorAll("[data-" + lang + "-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-" + lang + "-placeholder"));
    });
  }
  function toggleLang() {
    var next = document.documentElement.getAttribute("data-lang") === "as" ? "en" : "as";
    localStorage.setItem("sd-lang", next);
    applyLang(next);
  }

  /* ── Mobile nav ───────────────────────────────────────────────────── */
  function initMobileNav() {
    var btn = document.querySelector("[data-sd-hamburger]");
    var panel = document.querySelector("[data-sd-mobile-panel]");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  /* ── FAQ accordion ────────────────────────────────────────────────── */
  function initFaq() {
    document.querySelectorAll(".sd-faq-item").forEach(function (item) {
      var q = item.querySelector(".sd-faq-q");
      if (!q) return;
      q.addEventListener("click", function () {
        var wasOpen = item.classList.contains("is-open");
        item.parentElement.querySelectorAll(".sd-faq-item").forEach(function (i) {
          i.classList.remove("is-open");
        });
        if (!wasOpen) item.classList.add("is-open");
      });
    });
  }

  /* ── Filter buttons (Work / Business portfolio grids) ────────────── */
  function wireFilterGroup(group) {
    var targetSel = group.getAttribute("data-sd-filters");
    var cards = document.querySelectorAll(targetSel);
    group.querySelectorAll(".sd-filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll(".sd-filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var cat = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = cat === "all" || card.getAttribute("data-category") === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }
  function initFilters() {
    document.querySelectorAll("[data-sd-filters]").forEach(wireFilterGroup);
  }

  /* ── Demo portfolio grid (Work + Solutions/Business pages) — renders
     from data/demos.json so adding a demo later is one JSON entry, not a
     markup edit. Screenshots are added by the Phase 4 Playwright pass;
     until a demo has one, it shows a category icon instead of a broken
     <img>. ── */
  function initDemoGrid() {
    var grids = document.querySelectorAll("[data-sd-demo-grid]");
    if (!grids.length) return;
    fetch("/data/demos.json")
      .then(function (r) { return r.json(); })
      .then(function (demos) {
        grids.forEach(function (grid) {
          var gridId = grid.id || "sd-demo-grid-" + Math.random().toString(36).slice(2);
          grid.id = gridId;
          var filtersId = grid.getAttribute("data-sd-demo-grid");
          var filtersEl = filtersId ? document.getElementById(filtersId) : null;

          grid.innerHTML = demos.map(function (d) {
            var shot = d.screenshot
              ? '<img src="' + d.screenshot + '" alt="' + d.name + '" loading="lazy">'
              : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><i class="fas ' + d.icon + '" style="font-size:26px;color:var(--sd-ink-faint);"></i></div>';
            var label = d.name.split(" — ")[1] || d.name;
            return (
              '<a class="sd-card sd-card--demo" data-category="' + d.categorySlug + '" href="' + d.url + '" target="_blank" rel="noopener">' +
              '<div class="sd-demo-shot">' + shot + "</div>" +
              '<div class="sd-demo-body"><span class="sd-demo-cat">' + d.category + "</span>" +
              '<h3 class="sd-h3" style="font-size:15px;margin-top:4px;">' + label + " — View live →</h3></div></a>"
            );
          }).join("");

          if (filtersEl) {
            var seen = [];
            var cats = [];
            demos.forEach(function (d) {
              if (seen.indexOf(d.categorySlug) === -1) {
                seen.push(d.categorySlug);
                cats.push({ slug: d.categorySlug, name: d.category });
              }
            });
            var buttons = '<button class="sd-filter-btn is-active" data-filter="all">All</button>' +
              cats.map(function (c) { return '<button class="sd-filter-btn" data-filter="' + c.slug + '">' + c.name + "</button>"; }).join("");
            filtersEl.innerHTML = buttons;
            filtersEl.setAttribute("data-sd-filters", "#" + gridId + " [data-category]");
            wireFilterGroup(filtersEl);
          }
        });
      })
      .catch(function (err) { console.warn("Could not load /data/demos.json:", err); });
  }

  /* ── Scroll reveal — fade-up only ─────────────────────────────────── */
  function initReveal() {
    var els = document.querySelectorAll(".sd-reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── Navbar — subtle shadow once the page has scrolled past the top ── */
  function initNavbarScroll() {
    var navbar = document.querySelector(".sd-navbar");
    if (!navbar) return;
    var ticking = false;
    function apply() {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(apply);
      },
      { passive: true }
    );
    apply();
  }

  /* ── Homepage hero — a few px of cursor-driven parallax on the photo
     background. Desktop/mouse only: touch has no continuous pointer to
     react to, so this stays out of the way there entirely. ── */
  function initHeroParallax() {
    var hero = document.querySelector(".sd-hero--photo");
    if (!hero) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      hero.style.backgroundPosition = 50 + x * 6 + "% " + (50 + y * 6) + "%";
    });
    hero.addEventListener("mouseleave", function () {
      hero.style.backgroundPosition = "";
    });
  }

  /* ── Stat strip — count up from 0 once it scrolls into view ── */
  function initStatCounters() {
    var nums = document.querySelectorAll(".sd-stat-num");
    if (!nums.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function animate(el) {
      var match = /^(\d+)(.*)$/.exec(el.textContent.trim());
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];
      var duration = 900;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ── Contact form → WhatsApp deep link (always works) + a best-effort
     Firebase record using the same project the notice board already
     writes to (assets/js/firebase-app-compat.js, loaded on the page).
     If the write fails (rules, offline, whatever) the WhatsApp message
     still goes out — that's the part that must never break. ── */
  function initContactForm() {
    var form = document.querySelector("[data-sd-contact-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: (form.querySelector("[name=name]") || {}).value || "",
        org: (form.querySelector("[name=org]") || {}).value || "",
        role: (form.querySelector("[name=role]") || {}).value || "",
        phone: (form.querySelector("[name=phone]") || {}).value || "",
        need: (form.querySelector("[name=need]") || {}).value || "",
        ts: Date.now(),
      };

      try {
        if (window.firebase && firebase.apps && firebase.apps.length) {
          firebase.database().ref("leads").push(data);
        }
      } catch (err) {
        console.warn("Lead not saved to Firebase (non-blocking):", err);
      }

      var msg =
        "Hi Smart Digital! I'd like a quotation.\n" +
        "Name: " + data.name + "\n" +
        "Institution/Business: " + data.org + "\n" +
        "Role: " + data.role + "\n" +
        "Phone: " + data.phone + "\n" +
        "What I need: " + data.need;
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
      window.open(url, "_blank");

      var note = form.querySelector("[data-sd-form-note]");
      if (note) note.textContent = "Opening WhatsApp… if it didn't open, message us directly at +91 86387 59478.";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initLang();
    initMobileNav();
    initFaq();
    initFilters();
    initDemoGrid();
    initReveal();
    initNavbarScroll();
    initHeroParallax();
    initStatCounters();
    initContactForm();
  });

  window.sdToggleTheme = toggleTheme;
  window.sdToggleLang = toggleLang;
})();
