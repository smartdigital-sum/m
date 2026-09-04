/* Smart Digital — Updates page (PLAN.md: "Keep the mechanism; rename to
   Updates"). Talks to the same Firebase RTDB "notifications" path and the
   same Firebase Auth admin login the old shop homepage used, so nothing
   already posted is lost — but this is a fresh, small implementation, not
   a port of the old admin panel. The old one (assets/js/script.js,
   openAdminPanel/loadAdminData) is tangled up with shop hours and the
   urgent banner, both gone in this redesign; reusing it here would either
   drag that dead UI along or throw on missing elements. This file only
   does notifications. */

(function () {
  "use strict";
  if (typeof firebase === "undefined") return;

  var db = firebase.database();
  var listEl, emptyEl, adminBox, loginForm, addForm, pwdInput, typeInput, textInput, authLabel, logoutBtn;

  function typeIcon(type) {
    return { info: "📢", success: "✅", warning: "⚠️", event: "🎉" }[type] || "📢";
  }
  function relTime(ts) {
    if (!ts) return "";
    var diff = Date.now() - ts;
    var m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function render(notifs) {
    var isAdmin = !!(firebase.auth().currentUser);
    if (!notifs || !notifs.length) {
      listEl.innerHTML = "";
      emptyEl.style.display = "block";
      return;
    }
    emptyEl.style.display = "none";
    listEl.innerHTML = notifs.map(function (n, i) {
      var del = isAdmin ? '<button class="sd-notice-admin-del" data-i="' + i + '" title="Delete"><i class="fas fa-trash-alt"></i></button>' : "";
      return (
        '<div class="sd-notice"><span class="sd-notice-icon">' + typeIcon(n.type) + "</span>" +
        '<div style="flex:1;"><p class="sd-notice-text">' + escapeHtml(n.text) + "</p>" +
        '<span class="sd-notice-time">' + relTime(n.timestamp) + "</span></div>" + del + "</div>"
      );
    }).join("");
    listEl.querySelectorAll(".sd-notice-admin-del").forEach(function (btn) {
      btn.addEventListener("click", function () { deleteNotice(parseInt(btn.getAttribute("data-i"), 10)); });
    });
  }
  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function loadAndRender() {
    db.ref("notifications").on("value", function (snap) {
      var data = snap.val();
      render(Array.isArray(data) ? data : []);
    });
  }

  function addNotice() {
    var text = textInput.value.trim();
    if (!text) { textInput.focus(); return; }
    db.ref("notifications").once("value", function (snap) {
      var current = Array.isArray(snap.val()) ? snap.val() : [];
      var updated = [{ text: text, type: typeInput.value, timestamp: Date.now() }].concat(current);
      db.ref("notifications").set(updated).then(function () { textInput.value = ""; });
    });
  }

  function deleteNotice(i) {
    db.ref("notifications").once("value", function (snap) {
      var current = Array.isArray(snap.val()) ? snap.val() : [];
      current.splice(i, 1);
      db.ref("notifications").set(current);
    });
  }

  function setAdminUi(loggedIn) {
    loginForm.style.display = loggedIn ? "none" : "grid";
    addForm.style.display = loggedIn ? "grid" : "none";
    logoutBtn.style.display = loggedIn ? "inline-flex" : "none";
    authLabel.textContent = loggedIn ? "Signed in as admin" : "Admin login";
  }

  function initAdmin() {
    adminBox = document.querySelector("[data-sd-admin-box]");
    if (!adminBox) return;
    loginForm = adminBox.querySelector("[data-sd-admin-login]");
    addForm = adminBox.querySelector("[data-sd-admin-add]");
    pwdInput = adminBox.querySelector("[name=adminPwd]");
    typeInput = adminBox.querySelector("[name=noticeType]");
    textInput = adminBox.querySelector("[name=noticeText]");
    authLabel = adminBox.querySelector("[data-sd-admin-label]");
    logoutBtn = adminBox.querySelector("[data-sd-admin-logout]");

    firebase.auth().onAuthStateChanged(function (user) {
      setAdminUi(!!user);
      db.ref("notifications").once("value", function (snap) {
        render(Array.isArray(snap.val()) ? snap.val() : []);
      });
    });

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (window.SMART_DIGITAL_CONFIG && window.SMART_DIGITAL_CONFIG.ADMIN_EMAIL) || "";
      firebase.auth().signInWithEmailAndPassword(email, pwdInput.value)
        .then(function () { pwdInput.value = ""; })
        .catch(function (err) { alert("Login failed: " + err.message); });
    });

    addForm.addEventListener("submit", function (e) {
      e.preventDefault();
      addNotice();
    });

    logoutBtn.addEventListener("click", function () {
      firebase.auth().signOut();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    listEl = document.getElementById("sdNoticeList");
    emptyEl = document.getElementById("sdNoticeEmpty");
    if (!listEl) return;
    loadAndRender();
    initAdmin();
  });
})();
