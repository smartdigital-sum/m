(function () {
  'use strict';

  const wordBanks = {
    animals: ['CAT', 'DOG', 'FISH', 'BIRD', 'FROG', 'LION', 'BEAR', 'DEER', 'DUCK', 'GOAT',
              'HEN', 'OWL', 'PIG', 'COW', 'ANT', 'BEE', 'BAT', 'FOX', 'HEN', 'RAM'],
    colors: ['RED', 'BLUE', 'GREEN', 'PINK', 'GOLD', 'GRAY', 'TAN', 'LIME', 'NAVY', 'PLUM',
             'RUBY', 'JADE', 'AQUA', 'AMBER', 'CORAL', 'IVORY', 'PEACH', 'MAUVE', 'BEIGE', 'CYAN'],
    food: ['CAKE', 'MILK', 'CORN', 'RICE', 'SOUP', 'TACO', 'PLUM', 'LIME', 'PEAR', 'PEAR',
           'FIG', 'NUT', 'JAM', 'PIE', 'HAM', 'YAM', 'BUN', 'TEA', 'EGG', 'PEA']
  };

  const difficulties = {
    easy: { size: 8, wordCount: 4 },
    medium: { size: 10, wordCount: 6 },
    hard: { size: 12, wordCount: 8 }
  };

  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // diagonal up-left
    [1, -1]   // diagonal down-left
  ];

  let currentCategory = 'animals';
  let difficulty = 'easy';
  let grid = [];
  let gridSize = 8;
  let wordsToFind = [];
  let foundWords = [];
  let wordPositions = {};
  let selecting = false;
  let selectStart = null;
  let selectEnd = null;
  let selectedCells = [];

  function init() {
    const saved = KidUtils.loadScore('wordsearch');
    if (saved.category && wordBanks[saved.category]) currentCategory = saved.category;
    if (saved.difficulty && difficulties[saved.difficulty]) difficulty = saved.difficulty;

    document.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => selectCategory(btn.dataset.cat));
    });

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('new-puzzle-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      newGame();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      newGame();
    });

    // Set initial active states
    const catBtn = document.querySelector('[data-cat="' + currentCategory + '"]');
    if (catBtn) {
      document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
      catBtn.classList.add('active');
    }
    const diffBtn = document.querySelector('[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    newGame();
  }

  function selectCategory(cat) {
    if (window.KidsSound) KidsSound.tab();
    currentCategory = cat;
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-cat="' + cat + '"]').classList.add('active');
    KidUtils.saveScore('wordsearch', { category: cat });
    newGame();
  }

  function setDifficulty(level) {
    if (window.KidsSound) KidsSound.click();
    difficulty = level;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
    document.querySelector('[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('wordsearch', { difficulty: level });
    newGame();
  }

  function newGame() {
    const config = difficulties[difficulty];
    gridSize = config.size;
    foundWords = [];
    wordPositions = {};
    selecting = false;
    selectStart = null;
    selectEnd = null;
    selectedCells = [];

    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('game-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');

    generatePuzzle(config.wordCount);
  }

  function generatePuzzle(wordCount) {
    const allWords = KidUtils.shuffleArray(wordBanks[currentCategory].slice());
    wordsToFind = [];

    // Pick words that fit in the grid
    for (const word of allWords) {
      if (wordsToFind.length >= wordCount) break;
      if (word.length <= gridSize) wordsToFind.push(word);
    }

    // Initialize empty grid
    grid = [];
    for (let r = 0; r < gridSize; r++) {
      grid.push(new Array(gridSize).fill(''));
    }

    // Place words
    const placed = {};
    for (const word of wordsToFind) {
      const pos = placeWord(word);
      if (pos) {
        placed[word] = pos;
        wordPositions[word] = pos;
      }
    }

    // Remove words that couldn't be placed
    wordsToFind = wordsToFind.filter(w => placed[w]);

    // Fill empty cells with random letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (!grid[r][c]) {
          grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    renderGrid();
    renderWordList();

    document.getElementById('found-count').textContent = '0';
    document.getElementById('total-words').textContent = wordsToFind.length;
  }

  function placeWord(word) {
    const shuffledDirs = KidUtils.shuffleArray(directions.slice());
    const maxAttempts = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const dir = shuffledDirs[attempt % shuffledDirs.length];
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlace(word, row, col, dir)) {
        const cells = [];
        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i;
          const c = col + dir[1] * i;
          grid[r][c] = word[i];
          cells.push({ r, c });
        }
        return { cells, dir };
      }
    }
    return null;
  }

  function canPlace(word, row, col, dir) {
    for (let i = 0; i < word.length; i++) {
      const r = row + dir[0] * i;
      const c = col + dir[1] * i;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
      if (grid[r][c] && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  function renderGrid() {
    const container = document.getElementById('letter-grid');
    container.innerHTML = '';
    container.style.gridTemplateColumns = 'repeat(' + gridSize + ', 1fr)';

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'ws-cell';
        cell.textContent = grid[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', grid[r][c]);

        cell.addEventListener('mousedown', (e) => startSelect(r, c, e));
        cell.addEventListener('mouseenter', () => extendSelect(r, c));
        cell.addEventListener('touchstart', (e) => { e.preventDefault(); startSelect(r, c, e); }, { passive: false });
        cell.addEventListener('touchmove', handleTouchMove);

        container.appendChild(cell);
      }
    }

    document.addEventListener('mouseup', endSelect);
    document.addEventListener('touchend', endSelect);
  }

  function renderWordList() {
    const container = document.getElementById('word-list');
    container.innerHTML = '';
    wordsToFind.forEach(word => {
      const span = document.createElement('span');
      span.className = 'ws-word' + (foundWords.includes(word) ? ' ws-found' : '');
      span.textContent = word;
      span.id = 'ws-word-' + word;
      container.appendChild(span);
    });
  }

  function startSelect(r, c, e) {
    if (e.type === 'touchstart') e.preventDefault();
    selecting = true;
    selectStart = { r, c };
    selectEnd = { r, c };
    updateSelection();
    if (window.KidsSound) KidsSound.pop();
  }

  function extendSelect(r, c) {
    if (!selecting) return;

    // Determine direction from start to this cell
    const dr = r - selectStart.r;
    const dc = c - selectStart.c;

    // Lock to 8 directions
    let nr = selectStart.r;
    let nc = selectStart.c;

    if (dr === 0 && dc === 0) {
      selectEnd = { r: selectStart.r, c: selectStart.c };
    } else if (dr === 0) {
      selectEnd = { r: selectStart.r, c };
    } else if (dc === 0) {
      selectEnd = { r, c: selectStart.c };
    } else if (Math.abs(dr) === Math.abs(dc)) {
      selectEnd = { r, c };
    } else {
      // Snap to closest direction
      const absDr = Math.abs(dr);
      const absDc = Math.abs(dc);
      if (absDr > absDc) {
        selectEnd = { r, c: selectStart.c };
      } else if (absDc > absDr) {
        selectEnd = { r: selectStart.r, c };
      } else {
        selectEnd = { r, c };
      }
    }

    updateSelection();
  }

  function handleTouchMove(e) {
    if (!selecting) return;
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.dataset.row !== undefined) {
      extendSelect(parseInt(el.dataset.row, 10), parseInt(el.dataset.col, 10));
    }
  }

  function endSelect() {
    if (!selecting) return;
    selecting = false;
    checkSelection();
    clearHighlight();
    selectStart = null;
    selectEnd = null;
  }

  function updateSelection() {
    clearHighlight();
    selectedCells = getLineCells(selectStart, selectEnd);
    selectedCells.forEach(({ r, c }) => {
      const cell = getCell(r, c);
      if (cell) cell.classList.add('ws-selecting');
    });
  }

  function clearHighlight() {
    document.querySelectorAll('.ws-selecting').forEach(c => c.classList.remove('ws-selecting'));
  }

  function getLineCells(start, end) {
    if (!start || !end) return [];
    const dr = Math.sign(end.r - start.r);
    const dc = Math.sign(end.c - start.c);
    const len = Math.max(Math.abs(end.r - start.r), Math.abs(end.c - start.c)) + 1;
    const cells = [];
    for (let i = 0; i < len; i++) {
      cells.push({ r: start.r + dr * i, c: start.c + dc * i });
    }
    return cells;
  }

  function checkSelection() {
    if (selectedCells.length < 2) return;

    const selectedWord = selectedCells.map(({ r, c }) => grid[r][c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    let matchedWord = null;
    if (wordsToFind.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      matchedWord = selectedWord;
    } else if (wordsToFind.includes(reversedWord) && !foundWords.includes(reversedWord)) {
      matchedWord = reversedWord;
    }

    if (matchedWord) {
      foundWords.push(matchedWord);
      markWordFound(matchedWord);

      document.getElementById('found-count').textContent = foundWords.length;

      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects) KidEffects.bumpScore(document.getElementById('found-count'));

      const wordEl = document.getElementById('ws-word-' + matchedWord);
      if (wordEl) wordEl.classList.add('ws-found');

      const msg = document.getElementById('message');
      msg.textContent = '🎉 Found "' + matchedWord + '"! 🎉';
      msg.className = 'kid-msg is-correct';
      msg.setAttribute('aria-live', 'polite');

      if (foundWords.length === wordsToFind.length) {
        setTimeout(() => gameWon(), 800);
      }
    }
  }

  function markWordFound(word) {
    const pos = wordPositions[word];
    if (!pos) return;
    const colorIdx = foundWords.length % 6;
    const colors = ['#00b894', '#6c5ce7', '#e17055', '#0984e3', '#fdcb6e', '#e84393'];
    pos.cells.forEach(({ r, c }) => {
      const cell = getCell(r, c);
      if (cell) {
        cell.classList.add('ws-found');
        cell.style.background = colors[colorIdx];
        cell.style.color = 'white';
        cell.style.borderColor = colors[colorIdx];
      }
    });
  }

  function getCell(r, c) {
    return document.querySelector('.ws-cell[data-row="' + r + '"][data-col="' + c + '"]');
  }

  function gameWon() {
    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();

    document.getElementById('game-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    document.getElementById('result-icon').textContent = '🏆';
    document.getElementById('result-title').textContent = 'Amazing!';
    document.getElementById('result-message').textContent =
      'You found all ' + wordsToFind.length + ' words!';

    const saved = KidUtils.loadScore('wordsearch');
    const totalFound = (saved.totalFound || 0) + wordsToFind.length;
    KidUtils.saveScore('wordsearch', { totalFound, category: currentCategory, difficulty });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
