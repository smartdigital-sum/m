(function () {
  'use strict';

  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function loadMute() {
    try {
      muted = localStorage.getItem('kidsGameMuted') === '1';
    } catch (e) {
      muted = false;
    }
  }

  function saveMute() {
    try {
      localStorage.setItem('kidsGameMuted', muted ? '1' : '0');
    } catch (e) {}
  }

  function setMuted(value) {
    muted = !!value;
    saveMute();
    window.dispatchEvent(new CustomEvent('kids-sound-mute', { detail: { muted } }));
  }

  function isMuted() {
    return muted;
  }

  function beep(freq, duration, type, gainValue, slideTo) {
    if (muted) return;
    const c = getCtx();
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + duration);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gainValue || 0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  function chord(freqs, duration) {
    if (muted) return;
    const c = getCtx();
    const t0 = c.currentTime;
    freqs.forEach(function (f, i) {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.06 - i * 0.01, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    });
  }

  function noiseBurst(duration, gainValue) {
    if (muted) return;
    const c = getCtx();
    const t0 = c.currentTime;
    const bufferSize = c.sampleRate * duration;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = c.createBufferSource();
    const g = c.createGain();
    src.buffer = buffer;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gainValue || 0.08, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    src.connect(g);
    g.connect(c.destination);
    src.start(t0);
  }

  const KidsSound = {
    init: function () {
      loadMute();
    },
    unlock: function () {
      try {
        getCtx();
      } catch (e) {}
    },
    setMuted: setMuted,
    isMuted: isMuted,
    toggleMute: function () {
      setMuted(!muted);
      return muted;
    },
    click: function () {
      beep(520, 0.06, 'sine', 0.1);
    },
    hover: function () {
      beep(380, 0.04, 'sine', 0.06);
    },
    correct: function () {
      chord([523.25, 659.25, 783.99], 0.35);
    },
    wrong: function () {
      beep(180, 0.22, 'sawtooth', 0.09, 90);
      noiseBurst(0.08, 0.04);
    },
    win: function () {
      if (muted) return;
      const notes = [
        { f: 523.25, d: 0.14 },
        { f: 659.25, d: 0.14 },
        { f: 783.99, d: 0.14 },
        { f: 1046.5, d: 0.4 }
      ];
      let delay = 0;
      notes.forEach(function (n) {
        setTimeout(function () {
          beep(n.f, n.d, 'triangle', 0.1);
        }, delay);
        delay += 110;
      });
    },
    pop: function () {
      beep(600, 0.05, 'square', 0.07, 880);
    },
    draw: function () {
      if (muted) return;
      beep(1200 + Math.random() * 400, 0.02, 'sine', 0.03);
    },
    fill: function () {
      chord([440, 554.37], 0.2);
    },
    clear: function () {
      noiseBurst(0.12, 0.06);
    },
    tab: function () {
      beep(440, 0.08, 'sine', 0.08);
      setTimeout(function () {
        beep(660, 0.08, 'sine', 0.07);
      }, 60);
    }
  };

  window.KidsSound = KidsSound;
  KidsSound.init();

  document.addEventListener(
    'click',
    function once() {
      KidsSound.unlock();
      document.removeEventListener('click', once);
    },
    { once: true }
  );
})();
