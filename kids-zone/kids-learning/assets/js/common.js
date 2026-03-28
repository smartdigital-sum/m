(function () {
  'use strict';

  function syncSoundButton(btn) {
    if (!btn || !window.KidsSound) return;
    const muted = KidsSound.isMuted();
    btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    btn.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
    const label = btn.querySelector('.kid-sound-label');
    if (label) label.textContent = muted ? 'Sound off' : 'Sound on';
    const icon = btn.querySelector('.kid-sound-icon');
    if (icon) icon.textContent = muted ? '🔇' : '🔊';
  }

  function initSoundButton() {
    const btn = document.getElementById('kid-sound-btn');
    if (!btn || !window.KidsSound) return;
    syncSoundButton(btn);
    btn.addEventListener('click', () => {
      const was = KidsSound.isMuted();
      KidsSound.toggleMute();
      if (!KidsSound.isMuted() && was) KidsSound.click();
      syncSoundButton(btn);
    });
    window.addEventListener('kids-sound-mute', () => syncSoundButton(btn));
  }

  function initSkipLink() {
    const skip = document.querySelector('.kid-skip-link');
    if (!skip) return;
    skip.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skip.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  function initCardHovers() {
    const cards = document.querySelectorAll('.kid-game-card');
    let lastHover = 0;
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const now = Date.now();
        if (now - lastHover < 180) return;
        lastHover = now;
        if (window.KidsSound && !KidsSound.isMuted()) KidsSound.hover();
      });
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initSoundButton();
        initSkipLink();
        initCardHovers();
      });
    } else {
      initSoundButton();
      initSkipLink();
      initCardHovers();
    }
  }

  init();
})();
