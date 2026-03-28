(function () {
  'use strict';

  const difficulties = { easy: 3, hard: 4 };
  let gridSize = 3;
  let tiles = [];
  let moves = 0;
  let solved = false;

  function init() {
    const saved = KidUtils.loadScore('slide');
    if (saved.difficulty && difficulties[saved.difficulty]) {
      gridSize = difficulties[saved.difficulty];
    }
    updateBestDisplay();

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('shuffle-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      shuffle();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      shuffle();
    });

    const diffBtn = document.querySelector('[data-diff="' + (gridSize === 3 ? 'easy' : 'hard') + '"]');
    if (diffBtn) {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    buildBoard();
    shuffle();
  }

  function setDifficulty(level) {
    if (window.KidsSound) KidsSound.click();
    gridSize = difficulties[level];
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
    document.querySelector('[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('slide', { difficulty: level });
    buildBoard();
    shuffle();
    updateBestDisplay();
  }

  function updateBestDisplay() {
    const saved = KidUtils.loadScore('slide');
    const key = 'best' + gridSize;
    document.getElementById('best-moves').textContent = saved[key] || '-';
  }

  function buildBoard() {
    const board = document.getElementById('slide-board');
    board.innerHTML = '';
    const size = Math.min(320, window.innerWidth - 80);
    const cellSize = size / gridSize;
    board.style.width = size + 'px';
    board.style.height = size + 'px';
    board.style.gridTemplateColumns = 'repeat(' + gridSize + ', 1fr)';

    tiles = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'slide-tile';
      tile.style.width = cellSize + 'px';
      tile.style.height = cellSize + 'px';
      tile.dataset.index = i;
      tile.addEventListener('click', () => moveTile(i));
      board.appendChild(tile);
      tiles.push(tile);
    }
  }

  function shuffle() {
    moves = 0;
    solved = false;
    document.getElementById('moves').textContent = '0';
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';

    // Create solved state then shuffle with valid moves
    let state = [];
    for (let i = 1; i < gridSize * gridSize; i++) state.push(i);
    state.push(0); // blank at end

    // Make random valid moves to shuffle
    const shuffleMoves = gridSize * gridSize * 20;
    for (let i = 0; i < shuffleMoves; i++) {
      const blankIdx = state.indexOf(0);
      const neighbors = getNeighbors(blankIdx);
      const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      [state[blankIdx], state[pick]] = [state[pick], state[blankIdx]];
    }

    renderBoard(state);
  }

  function getNeighbors(idx) {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    const neighbors = [];
    if (row > 0) neighbors.push(idx - gridSize);
    if (row < gridSize - 1) neighbors.push(idx + gridSize);
    if (col > 0) neighbors.push(idx - 1);
    if (col < gridSize - 1) neighbors.push(idx + 1);
    return neighbors;
  }

  function renderBoard(state) {
    for (let i = 0; i < state.length; i++) {
      const tile = tiles[i];
      if (state[i] === 0) {
        tile.textContent = '';
        tile.className = 'slide-tile slide-blank';
      } else {
        tile.textContent = state[i];
        tile.className = 'slide-tile slide-number';
        // Check if in correct position
        if (state[i] === i + 1) {
          tile.classList.add('slide-correct');
        }
      }
      tile.dataset.value = state[i];
    }
  }

  function getState() {
    return tiles.map(t => parseInt(t.dataset.value, 10));
  }

  function moveTile(idx) {
    if (solved) return;
    const state = getState();
    const blankIdx = state.indexOf(0);
    const neighbors = getNeighbors(blankIdx);

    if (!neighbors.includes(idx)) return;

    // Swap
    [state[blankIdx], state[idx]] = [state[idx], state[blankIdx]];
    moves++;
    document.getElementById('moves').textContent = moves;

    if (window.KidsSound) KidsSound.pop();
    renderBoard(state);

    // Check win
    if (isSolved(state)) {
      solved = true;
      gameWon();
    }
  }

  function isSolved(state) {
    for (let i = 0; i < state.length - 1; i++) {
      if (state[i] !== i + 1) return false;
    }
    return state[state.length - 1] === 0;
  }

  function gameWon() {
    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();

    const msg = document.getElementById('message');
    msg.textContent = '🎉 Puzzle solved in ' + moves + ' moves! 🎉';
    msg.className = 'kid-msg is-correct';

    const saved = KidUtils.loadScore('slide');
    const key = 'best' + gridSize;
    const best = saved[key];
    if (!best || moves < best) {
      saved[key] = moves;
      saved.difficulty = gridSize === 3 ? 'easy' : 'hard';
      KidUtils.saveScore('slide', saved);
    }

    setTimeout(() => {
      document.getElementById('game-panel').style.display = 'none';
      const resultArea = document.getElementById('result-area');
      resultArea.classList.add('is-show');
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Puzzle solved!';
      document.getElementById('result-message').textContent =
        'You solved the ' + gridSize + 'x' + gridSize + ' puzzle!';
      document.getElementById('result-stats').innerHTML =
        '<div><div class="val">' + moves + '</div><div>Moves</div></div>';
      updateBestDisplay();
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
