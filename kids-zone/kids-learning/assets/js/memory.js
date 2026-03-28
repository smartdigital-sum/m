(function () {
  'use strict';

  const allEmojis = [
    '🐶', '🐱', '🐰', '🦊', '🐻', '🐼',
    '🦁', '🐸', '🐵', '🦄', '🐙', '🦋',
    '🌈', '⭐', '🌙', '☀️', '🌸', '🎈',
    '🍎', '🍕', '🎸', '🚀', '⚽', '🎨'
  ];

  const difficulties = {
    easy: { pairs: 6, cols: 4 },
    medium: { pairs: 8, cols: 4 },
    hard: { pairs: 12, cols: 6 }
  };

  let difficulty = 'easy';
  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let totalPairs = 0;
  let moves = 0;
  let locked = false;
  let timerInterval = null;
  let seconds = 0;
  let gameStarted = false;

  function getDifficulty() {
    return difficulties[difficulty] || difficulties.easy;
  }

  function shuffle(array) {
    return KidUtils.shuffleArray(array);
  }

  function startTimer() {
    if (timerInterval) return;
    gameStarted = true;
    timerInterval = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    stopTimer();
    seconds = 0;
    gameStarted = false;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    document.getElementById('timer').textContent = m + ':' + (s < 10 ? '0' : '') + s;
  }

  function initGame() {
    const config = getDifficulty();
    totalPairs = config.pairs;
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    locked = false;
    resetTimer();

    document.getElementById('moves').textContent = '0';
    document.getElementById('pairs-found').textContent = '0';
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('game-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');

    const selectedEmojis = shuffle(allEmojis).slice(0, totalPairs);
    cards = shuffle([...selectedEmojis, ...selectedEmojis]);

    renderGrid(config.cols);
  }

  function renderGrid(cols) {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';

    cards.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = index;
      card.setAttribute('role', 'gridcell');
      card.setAttribute('aria-label', 'Card ' + (index + 1) + ', hidden');
      card.innerHTML =
        '<div class="memory-card-inner">' +
        '<div class="memory-card-front">❓</div>' +
        '<div class="memory-card-back">' + emoji + '</div>' +
        '</div>';

      card.addEventListener('click', () => flipCard(index, card));
      grid.appendChild(card);
    });
  }

  function flipCard(index, cardEl) {
    if (locked) return;
    if (cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched')) return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.some(f => f.index === index)) return;

    if (!gameStarted) startTimer();

    if (window.KidsSound) KidsSound.pop();
    cardEl.classList.add('is-flipped');
    cardEl.setAttribute('aria-label', 'Card ' + (index + 1) + ', ' + cards[index]);

    flippedCards.push({ index, el: cardEl, emoji: cards[index] });

    if (flippedCards.length === 2) {
      moves++;
      document.getElementById('moves').textContent = moves;
      checkMatch();
    }
  }

  function checkMatch() {
    const [a, b] = flippedCards;

    if (a.emoji === b.emoji) {
      locked = true;
      setTimeout(() => {
        a.el.classList.add('is-matched');
        b.el.classList.add('is-matched');
        a.el.setAttribute('aria-label', 'Card ' + (a.index + 1) + ', ' + a.emoji + ', matched');
        b.el.setAttribute('aria-label', 'Card ' + (b.index + 1) + ', ' + b.emoji + ', matched');
        matchedPairs++;
        document.getElementById('pairs-found').textContent = matchedPairs;

        if (window.KidsSound) KidsSound.correct();
        if (window.KidEffects) KidEffects.bumpScore(document.getElementById('pairs-found'));

        flippedCards = [];
        locked = false;

        if (matchedPairs === totalPairs) {
          gameWon();
        }
      }, 400);
    } else {
      locked = true;
      setTimeout(() => {
        if (window.KidsSound) KidsSound.wrong();
        a.el.classList.remove('is-flipped');
        b.el.classList.remove('is-flipped');
        a.el.setAttribute('aria-label', 'Card ' + (a.index + 1) + ', hidden');
        b.el.setAttribute('aria-label', 'Card ' + (b.index + 1) + ', hidden');
        flippedCards = [];
        locked = false;
      }, 800);
    }
  }

  function gameWon() {
    stopTimer();

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const timeStr = m + ':' + (s < 10 ? '0' : '') + s;

    const stars = getStarRating(moves, totalPairs);
    let starStr = '';
    for (let i = 0; i < 3; i++) {
      starStr += i < stars ? '⭐' : '☆';
    }

    document.getElementById('result-icon').textContent = '🎉';
    document.getElementById('result-title').textContent =
      stars === 3 ? 'Perfect memory!' : stars === 2 ? 'Great job!' : 'Well done!';
    document.getElementById('result-message').textContent =
      'You matched all ' + totalPairs + ' pairs!';

    document.getElementById('result-stats').innerHTML =
      '<div><div class="val">' + moves + '</div><div>Moves</div></div>' +
      '<div><div class="val">' + timeStr + '</div><div>Time</div></div>' +
      '<div><div class="val">' + starStr + '</div><div>Stars</div></div>';

    document.getElementById('game-panel').style.display = 'none';
    document.getElementById('result-area').classList.add('is-show');

    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();

    const saved = KidUtils.loadScore('memory');
    const bestMoves = saved.bestMoves ? Math.min(saved.bestMoves, moves) : moves;
    const bestTime = saved.bestTime ? Math.min(saved.bestTime, seconds) : seconds;
    KidUtils.saveScore('memory', { bestMoves, bestTime, difficulty, lastStars: stars });
  }

  function getStarRating(moves, pairs) {
    const ratio = moves / pairs;
    if (ratio <= 1.5) return 3;
    if (ratio <= 2.5) return 2;
    return 1;
  }

  function setDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.kid-diff').forEach(b => b.classList.remove('is-on'));
    document.querySelector('.kid-diff[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('memory', { difficulty: level });
    initGame();
  }

  function init() {
    const saved = KidUtils.loadScore('memory');
    if (saved.difficulty && difficulties[saved.difficulty]) {
      difficulty = saved.difficulty;
    }

    document.querySelectorAll('.kid-diff').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      initGame();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      initGame();
    });

    const diffBtn = document.querySelector('.kid-diff[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('.kid-diff').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    initGame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
