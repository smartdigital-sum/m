(function () {
  'use strict';

  const difficulties = {
    easy: { speed: 0.4, spawnRate: 2200, maxLives: 5 },
    medium: { speed: 0.7, spawnRate: 1600, maxLives: 4 },
    hard: { speed: 1.1, spawnRate: 1100, maxLives: 3 }
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fallColors = ['#ff7675', '#74b9ff', '#55efc4', '#fdcb6e', '#a29bfe', '#fd79a8', '#e17055', '#0984e3'];

  let difficulty = 'easy';
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let lives = 5;
  let maxLives = 5;
  let totalTyped = 0;
  let correctTyped = 0;
  let gameRunning = false;
  let fallingLetters = [];
  let spawnTimer = null;
  let animFrame = null;
  let lastTime = 0;

  function init() {
    const saved = KidUtils.loadScore('typing');
    if (saved.difficulty && difficulties[saved.difficulty]) difficulty = saved.difficulty;

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      startGame();
    });
    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      startGame();
    });

    document.addEventListener('keydown', handleKeyPress);

    createOnScreenKeyboard();

    const diffBtn = document.querySelector('[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    updateLivesDisplay();
  }

  function setDifficulty(level) {
    if (gameRunning) return;
    if (window.KidsSound) KidsSound.click();
    difficulty = level;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
    document.querySelector('[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('typing', { difficulty: level });
    updateLivesDisplay();
  }

  function updateLivesDisplay() {
    const config = difficulties[difficulty];
    maxLives = config.maxLives;
    lives = maxLives;
    let hearts = '';
    for (let i = 0; i < maxLives; i++) hearts += '❤️';
    document.getElementById('lives-display').textContent = hearts;
  }

  function startGame() {
    const config = difficulties[difficulty];
    maxLives = config.maxLives;
    lives = maxLives;
    score = 0;
    streak = 0;
    bestStreak = 0;
    totalTyped = 0;
    correctTyped = 0;
    gameRunning = true;
    fallingLetters = [];

    document.getElementById('score').textContent = '0';
    document.getElementById('streak').textContent = '0';
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'inline-block';

    let hearts = '';
    for (let i = 0; i < maxLives; i++) hearts += '❤️';
    document.getElementById('lives-display').textContent = hearts;

    const field = document.getElementById('typing-field');
    field.innerHTML = '';

    // Start spawning
    spawnLetter();
    spawnTimer = setInterval(spawnLetter, config.spawnRate);

    // Start game loop
    lastTime = performance.now();
    gameLoop(lastTime);
  }

  function stopGame() {
    gameRunning = false;
    clearInterval(spawnTimer);
    cancelAnimationFrame(animFrame);
    spawnTimer = null;
    animFrame = null;
  }

  function spawnLetter() {
    if (!gameRunning) return;
    const config = difficulties[difficulty];
    const field = document.getElementById('typing-field');
    const fieldWidth = field.clientWidth;

    const letter = letters[Math.floor(Math.random() * letters.length)];
    const color = fallColors[Math.floor(Math.random() * fallColors.length)];
    const x = 20 + Math.random() * (fieldWidth - 60);

    const el = document.createElement('div');
    el.className = 'typing-letter';
    el.textContent = letter;
    el.style.left = x + 'px';
    el.style.top = '-50px';
    el.style.background = color;
    el.style.boxShadow = '0 4px 12px ' + color + '66';
    field.appendChild(el);

    fallingLetters.push({
      el,
      letter,
      y: -50,
      speed: config.speed + Math.random() * 0.3
    });
  }

  function gameLoop(timestamp) {
    if (!gameRunning) return;

    const dt = (timestamp - lastTime) / 16.67; // normalize to ~60fps
    lastTime = timestamp;

    const field = document.getElementById('typing-field');
    const fieldHeight = field.clientHeight;

    // Update positions
    for (let i = fallingLetters.length - 1; i >= 0; i--) {
      const fl = fallingLetters[i];
      fl.y += fl.speed * dt;
      fl.el.style.top = fl.y + 'px';

      // Reached bottom
      if (fl.y > fieldHeight - 40) {
        loseLife();
        fl.el.classList.add('typing-missed');
        setTimeout(() => {
          if (fl.el.parentNode) fl.el.remove();
        }, 300);
        fallingLetters.splice(i, 1);
      }
    }

    if (gameRunning) {
      animFrame = requestAnimationFrame(gameLoop);
    }
  }

  function handleKeyPress(e) {
    if (!gameRunning) return;
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      hitLetter(key);
    }
  }

  function hitLetter(letter) {
    totalTyped++;

    // Find the lowest matching letter
    let matchIdx = -1;
    let matchY = -1;

    for (let i = 0; i < fallingLetters.length; i++) {
      if (fallingLetters[i].letter === letter && fallingLetters[i].y > matchY) {
        matchIdx = i;
        matchY = fallingLetters[i].y;
      }
    }

    if (matchIdx >= 0) {
      // Hit!
      correctTyped++;
      streak++;
      if (streak > bestStreak) bestStreak = streak;

      const points = 10 + Math.min(streak * 2, 20);
      score += points;

      document.getElementById('score').textContent = score;
      document.getElementById('streak').textContent = streak;

      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects && streak % 5 === 0) KidEffects.confetti();

      const fl = fallingLetters[matchIdx];
      fl.el.classList.add('typing-hit');
      setTimeout(() => {
        if (fl.el.parentNode) fl.el.remove();
      }, 300);
      fallingLetters.splice(matchIdx, 1);

      // Highlight on-screen keyboard
      highlightKey(letter, true);
    } else {
      // Miss - no matching letter on screen
      streak = 0;
      document.getElementById('streak').textContent = '0';
      if (window.KidsSound) KidsSound.wrong();
      highlightKey(letter, false);
    }
  }

  function highlightKey(letter, correct) {
    const key = document.querySelector('.typing-key[data-key="' + letter + '"]');
    if (!key) return;
    key.classList.add(correct ? 'typing-key-hit' : 'typing-key-miss');
    setTimeout(() => {
      key.classList.remove('typing-key-hit', 'typing-key-miss');
    }, 300);
  }

  function loseLife() {
    lives--;
    streak = 0;
    document.getElementById('streak').textContent = '0';

    let hearts = '';
    for (let i = 0; i < maxLives; i++) {
      hearts += i < lives ? '❤️' : '🖤';
    }
    document.getElementById('lives-display').textContent = hearts;

    if (window.KidsSound) KidsSound.wrong();

    if (lives <= 0) {
      gameOver();
    }
  }

  function gameOver() {
    stopGame();

    // Remove remaining letters
    fallingLetters.forEach(fl => {
      fl.el.classList.add('typing-missed');
      setTimeout(() => {
        if (fl.el.parentNode) fl.el.remove();
      }, 300);
    });
    fallingLetters = [];

    const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0;

    document.getElementById('game-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    if (score >= 200) {
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Typing Master!';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (score >= 100) {
      document.getElementById('result-icon').textContent = '🎉';
      document.getElementById('result-title').textContent = 'Great job!';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else {
      document.getElementById('result-icon').textContent = '💪';
      document.getElementById('result-title').textContent = 'Keep practicing!';
      if (window.KidsSound) KidsSound.pop();
    }

    document.getElementById('result-message').textContent =
      'You typed ' + correctTyped + ' letters correctly!';

    document.getElementById('result-stats').innerHTML =
      '<div><div class="val">' + score + '</div><div>Score</div></div>' +
      '<div><div class="val">' + bestStreak + '</div><div>Best Streak</div></div>' +
      '<div><div class="val">' + accuracy + '%</div><div>Accuracy</div></div>';

    const saved = KidUtils.loadScore('typing');
    const bestScore = Math.max(saved.bestScore || 0, score);
    KidUtils.saveScore('typing', { bestScore, bestStreak: Math.max(saved.bestStreak || 0, bestStreak), difficulty });

    document.getElementById('start-btn').style.display = 'inline-block';
    document.getElementById('restart-btn').style.display = 'none';
  }

  function createOnScreenKeyboard() {
    const container = document.getElementById('on-screen-kb');
    container.innerHTML = '';
    letters.split('').forEach(letter => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'typing-key';
      btn.textContent = letter;
      btn.dataset.key = letter;
      btn.setAttribute('aria-label', 'Type ' + letter);
      btn.addEventListener('click', () => {
        if (gameRunning) hitLetter(letter);
      });
      container.appendChild(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
