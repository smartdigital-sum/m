(function () {
  'use strict';

  const colors = ['green', 'red', 'yellow', 'blue'];
  const freqs = { green: 392, red: 330, yellow: 440, blue: 494 };

  let sequence = [];
  let playerIndex = 0;
  let round = 0;
  let best = 0;
  let playing = false;
  let accepting = false;
  let audioCtx = null;

  function getAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTone(color, dur) {
    if (window.KidsSound && KidsSound.isMuted()) return;
    const ctx = getAudio();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqs[color], t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  function init() {
    const saved = KidUtils.loadScore('simon');
    best = saved.best || 0;
    document.getElementById('best').textContent = best;

    document.querySelectorAll('.simon-btn').forEach(btn => {
      btn.addEventListener('click', () => handlePress(btn.dataset.color));
    });

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      startGame();
    });

    document.addEventListener('click', () => {
      try { getAudio(); } catch(e) {}
    }, { once: true });
  }

  function startGame() {
    if (window.KidsSound) KidsSound.click();
    sequence = [];
    round = 0;
    playing = true;
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('start-btn').style.display = 'none';
    nextRound();
  }

  function nextRound() {
    round++;
    document.getElementById('round').textContent = round;
    accepting = false;
    playerIndex = 0;

    // Add random color
    sequence.push(colors[Math.floor(Math.random() * 4)]);

    document.getElementById('simon-status').textContent = 'Watch carefully...';

    // Play sequence
    let delay = 600;
    sequence.forEach((color, i) => {
      setTimeout(() => lightUp(color), delay);
      delay += 600;
    });

    setTimeout(() => {
      accepting = true;
      document.getElementById('simon-status').textContent = 'Your turn! Tap the colors.';
    }, delay + 200);
  }

  function lightUp(color) {
    const btn = document.querySelector('[data-color="' + color + '"]');
    btn.classList.add('simon-lit');
    playTone(color, 0.4);
    setTimeout(() => btn.classList.remove('simon-lit'), 400);
  }

  function handlePress(color) {
    if (!accepting || !playing) return;

    lightUp(color);

    if (color === sequence[playerIndex]) {
      playerIndex++;
      if (playerIndex === sequence.length) {
        // Round complete
        accepting = false;
        if (window.KidsSound) KidsSound.correct();

        if (round > best) {
          best = round;
          document.getElementById('best').textContent = best;
          KidUtils.saveScore('simon', { best });
        }

        document.getElementById('simon-status').textContent = '🎉 Correct! Next round...';

        if (round % 5 === 0 && window.KidEffects) KidEffects.confetti();

        setTimeout(nextRound, 1000);
      }
    } else {
      // Wrong
      gameOver();
    }
  }

  function gameOver() {
    playing = false;
    accepting = false;
    if (window.KidsSound) KidsSound.wrong();

    document.getElementById('game-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    if (round >= 10) {
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Incredible!';
      if (window.KidEffects) KidEffects.confetti();
    } else if (round >= 5) {
      document.getElementById('result-icon').textContent = '🎉';
      document.getElementById('result-title').textContent = 'Great memory!';
      if (window.KidEffects) KidEffects.confetti();
    } else {
      document.getElementById('result-icon').textContent = '💪';
      document.getElementById('result-title').textContent = 'Keep trying!';
    }

    document.getElementById('result-message').textContent =
      'You reached round ' + round + '! Best: ' + best;

    document.getElementById('start-btn').style.display = 'inline-block';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
