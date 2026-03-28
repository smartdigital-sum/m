/* Khelona Shared Utilities */
(function() {
  'use strict';

  // ===== Audio =====
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playSound(type) {
    const ac = getAudioCtx();
    if (ac.state === 'suspended') ac.resume();
    const gain = ac.createGain();
    gain.connect(ac.destination);
    if (type === 'tap') {
      const o = ac.createOscillator(); o.connect(gain);
      o.frequency.value = 600; o.type = 'sine';
      gain.gain.setValueAtTime(0.08, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
      o.start(); o.stop(ac.currentTime + 0.1);
    } else if (type === 'correct') {
      [523, 659, 784].forEach((f, i) => {
        const o = ac.createOscillator(); o.connect(gain);
        o.frequency.value = f; o.type = 'sine';
        gain.gain.setValueAtTime(0.1, ac.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.12 + 0.25);
        o.start(ac.currentTime + i * 0.12); o.stop(ac.currentTime + i * 0.12 + 0.25);
      });
    } else if (type === 'wrong') {
      const o = ac.createOscillator(); o.connect(gain);
      o.frequency.value = 300; o.type = 'square';
      gain.gain.setValueAtTime(0.07, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.2);
      o.start(); o.stop(ac.currentTime + 0.2);
    } else if (type === 'win') {
      [523, 659, 784, 1047].forEach((f, i) => {
        const o = ac.createOscillator(); o.connect(gain);
        o.frequency.value = f; o.type = 'sine';
        gain.gain.setValueAtTime(0.1, ac.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.15 + 0.35);
        o.start(ac.currentTime + i * 0.15); o.stop(ac.currentTime + i * 0.15 + 0.35);
      });
    }
  }

  // ===== Shuffle (in-place) =====
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ===== How-to-Play Overlay =====
  function initHtp(key) {
    try {
      if (!sessionStorage.getItem(key)) {
        document.getElementById('htpOverlay').classList.add('show');
      }
    } catch(e) {
      document.getElementById('htpOverlay').classList.add('show');
    }
  }

  function dismissHtp(key) {
    try { sessionStorage.setItem(key, '1'); } catch(e) {}
    document.getElementById('htpOverlay').classList.remove('show');
  }

  // ===== Confetti =====
  function spawnConfetti(x, y, count) {
    var cols = ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#C77DFF","#f783ac","#FF922B"];
    for (var i = 0; i < count; i++) {
      var el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = x + (Math.random() - 0.5) * 150 + "px";
      el.style.top = y + "px";
      el.style.background = cols[Math.floor(Math.random() * cols.length)];
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";
      el.style.animationDelay = Math.random() * 0.38 + "s";
      el.style.animationDuration = 0.7 + Math.random() * 0.55 + "s";
      document.body.appendChild(el);
      setTimeout(el.remove.bind(el), 1600);
    }
  }

  // ===== Accessibility: Live Announcements =====
  function announce(message) {
    var region = document.getElementById('liveRegion');
    if (!region) return;
    region.textContent = '';
    setTimeout(function() { region.textContent = message; }, 50);
  }

  // ===== Keyboard Support for Buttons =====
  function enableButtonKeyboard() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var focused = document.activeElement;
        if (focused && focused.tagName === 'BUTTON' && !focused.disabled) {
          e.preventDefault();
          focused.click();
        }
      }
    });
  }

  // Expose globally
  window.KhelonaShared = {
    playSound: playSound,
    shuffle: shuffle,
    initHtp: initHtp,
    dismissHtp: dismissHtp,
    spawnConfetti: spawnConfetti,
    announce: announce,
    enableButtonKeyboard: enableButtonKeyboard
  };
})();
