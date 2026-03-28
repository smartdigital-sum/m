(function () {
  'use strict';

  const confettiColors = ['#ff7675', '#fdcb6e', '#55efc4', '#74b9ff', '#a29bfe', '#fd79a8', '#ffeaa7', '#fab1a0'];
  const sparkleColors = ['#ffd93d', '#ff6b6b', '#55efc4', '#a29bfe', '#fd79a8', '#fff'];
  const floaterEmojis = ['⭐', '🌟', '✨', '💫', '❤️', '🎈', '🌈', '🦋', '🌸', '🎵'];

  let confettiCanvas, confettiCtx;
  let confettiParticles = [];
  let confettiRunning = false;

  // --- Confetti ---
  function createConfettiCanvas() {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.className = 'kid-confetti-canvas';
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    document.body.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext('2d');
    window.addEventListener('resize', () => {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    });
  }

  function launchConfetti(x, y) {
    if (!confettiCanvas) createConfettiCanvas();
    const cx = x || window.innerWidth / 2;
    const cy = y || window.innerHeight / 3;

    for (let i = 0; i < 60; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 4 + Math.random() * 8;
      confettiParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.12 + Math.random() * 0.08,
        life: 1,
        decay: 0.008 + Math.random() * 0.006
      });
    }

    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles = confettiParticles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      if (p.life <= 0) return false;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.min(p.life, 1);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
      return true;
    });

    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfetti);
    } else {
      confettiRunning = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // --- Sparkles on mouse ---
  let lastSparkle = 0;
  function initSparkles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastSparkle < 80) return;
      lastSparkle = now;
      createSparkle(e.clientX, e.clientY);
    });
  }

  function createSparkle(x, y) {
    const el = document.createElement('div');
    el.className = 'kid-sparkle';
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    const size = 4 + Math.random() * 6;
    el.style.cssText = `left:${x - size/2}px;top:${y - size/2}px;width:${size}px;height:${size}px;background:${color};box-shadow:0 0 ${size*2}px ${color}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  // --- Floating emojis ---
  function initFloaters() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = document.createElement('div');
    container.className = 'kid-floaters';
    document.body.prepend(container);

    for (let i = 0; i < 10; i++) {
      const el = document.createElement('span');
      el.className = 'kid-floater';
      el.textContent = floaterEmojis[Math.floor(Math.random() * floaterEmojis.length)];
      const dur = 14 + Math.random() * 14;
      const delay = Math.random() * dur;
      const left = Math.random() * 100;
      const rot = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360);
      el.style.cssText = `left:${left}%;--dur:${dur}s;--delay:${-delay}s;--rot:${rot}deg;font-size:${1.2 + Math.random() * 1.2}rem`;
      container.appendChild(el);
    }
  }

  // --- Score bump animation ---
  function bumpScore(el) {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
  }

  // --- Problem pop animation ---
  function popElement(el) {
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
    el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
  }

  // --- Init ---
  function init() {
    initFloaters();
    initSparkles();
  }

  const KidEffects = {
    confetti: launchConfetti,
    sparkle: createSparkle,
    bumpScore: bumpScore,
    pop: popElement
  };

  window.KidEffects = KidEffects;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
