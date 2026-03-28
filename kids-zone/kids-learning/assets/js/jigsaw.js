(function () {
  'use strict';

  const difficulties = {
    easy: { grid: 2 },
    medium: { grid: 3 },
    hard: { grid: 4 }
  };

  // Puzzle image generators (draw colorful patterns on canvas)
  const imageGenerators = [
    function rainbow(ctx, w, h) {
      const colors = ['#ff7675','#fdcb6e','#55efc4','#74b9ff','#a29bfe','#fd79a8'];
      colors.forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.fillRect(0, i * h / colors.length, w, h / colors.length + 1);
      });
      ctx.fillStyle = 'white';
      ctx.font = 'bold 60px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌈', w/2, h/2);
    },
    function sun(ctx, w, h) {
      ctx.fillStyle = '#74b9ff';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#55efc4';
      ctx.fillRect(0, h*0.6, w, h*0.4);
      ctx.fillStyle = '#fdcb6e';
      ctx.beginPath();
      ctx.arc(w*0.7, h*0.35, w*0.15, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#2d3436';
      ctx.font = 'bold 50px serif';
      ctx.textAlign = 'center';
      ctx.fillText('☀️', w*0.7, h*0.35);
      ctx.font = 'bold 80px serif';
      ctx.fillText('🌳', w*0.3, h*0.55);
    },
    function space(ctx, w, h) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(Math.random()*w, Math.random()*h, 1+Math.random()*2, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.font = 'bold 60px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚀', w*0.5, h*0.6);
      ctx.fillText('🌙', w*0.75, h*0.25);
      ctx.fillText('⭐', w*0.25, h*0.3);
    },
    function ocean(ctx, w, h) {
      ctx.fillStyle = '#0984e3';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#74b9ff';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(w*0.5, h*0.2+i*h*0.15, w*0.6, 10, 0, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.font = 'bold 70px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐟', w*0.3, h*0.4);
      ctx.fillText('🐙', w*0.7, h*0.6);
      ctx.fillText('🦀', w*0.5, h*0.8);
    },
    function garden(ctx, w, h) {
      ctx.fillStyle = '#55efc4';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#00b894';
      ctx.fillRect(0, h*0.6, w, h*0.4);
      ctx.font = 'bold 60px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸', w*0.2, h*0.45);
      ctx.fillText('🌻', w*0.5, h*0.4);
      ctx.fillText('🌷', w*0.8, h*0.5);
      ctx.fillText('🦋', w*0.6, h*0.2);
    },
    function pizza(ctx, w, h) {
      ctx.fillStyle = '#ffeaa7';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fdcb6e';
      ctx.beginPath();
      ctx.arc(w/2, h/2, w*0.35, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#d63031';
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI/4;
        ctx.beginPath();
        ctx.arc(w/2+Math.cos(a)*w*0.15, h/2+Math.sin(a)*w*0.15, w*0.05, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.font = 'bold 80px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍕', w/2, h/2);
    }
  ];

  let difficulty = 'easy';
  let gridSize = 2;
  let pieces = [];
  let placedCount = 0;
  let sourceCanvas;
  let hintShowing = false;

  function init() {
    sourceCanvas = document.createElement('canvas');

    const saved = KidUtils.loadScore('jigsaw');
    if (saved.difficulty && difficulties[saved.difficulty]) difficulty = saved.difficulty;

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('new-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      newPuzzle();
    });

    document.getElementById('hint-btn').addEventListener('click', toggleHint);
    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      newPuzzle();
    });

    const diffBtn = document.querySelector('[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    newPuzzle();
  }

  function setDifficulty(level) {
    if (window.KidsSound) KidsSound.click();
    difficulty = level;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
    document.querySelector('[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('jigsaw', { difficulty: level });
    newPuzzle();
  }

  function generateImage() {
    const size = 300;
    sourceCanvas.width = size;
    sourceCanvas.height = size;
    const ctx = sourceCanvas.getContext('2d');
    const gen = imageGenerators[Math.floor(Math.random() * imageGenerators.length)];
    gen(ctx, size, size);
  }

  function newPuzzle() {
    gridSize = difficulties[difficulty].grid;
    placedCount = 0;
    hintShowing = false;

    document.getElementById('placed-count').textContent = '0';
    document.getElementById('total-pieces').textContent = gridSize * gridSize;
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('game-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');

    generateImage();
    createPuzzle();
  }

  function createPuzzle() {
    const board = document.getElementById('jigsaw-board');
    const tray = document.getElementById('jigsaw-tray');
    board.innerHTML = '';
    tray.innerHTML = '';

    const boardSize = Math.min(300, window.innerWidth - 80);
    const cellSize = boardSize / gridSize;
    board.style.width = boardSize + 'px';
    board.style.height = boardSize + 'px';
    board.style.gridTemplateColumns = 'repeat(' + gridSize + ', 1fr)';

    // Create board slots
    pieces = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const idx = r * gridSize + c;
        const slot = document.createElement('div');
        slot.className = 'jigsaw-slot';
        slot.dataset.index = idx;
        slot.style.width = cellSize + 'px';
        slot.style.height = cellSize + 'px';

        // Draw correct piece preview (faded)
        const preview = document.createElement('canvas');
        preview.width = cellSize;
        preview.height = cellSize;
        preview.className = 'jigsaw-preview';
        const pctx = preview.getContext('2d');
        pctx.globalAlpha = 0.15;
        pctx.drawImage(sourceCanvas,
          c * (300/gridSize), r * (300/gridSize), 300/gridSize, 300/gridSize,
          0, 0, cellSize, cellSize);
        slot.appendChild(preview);

        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('drop', e => handleDrop(e, idx));
        slot.addEventListener('touchend', e => handleTouchDrop(e, idx));

        board.appendChild(slot);
        pieces.push({ row: r, col: c, placed: false });
      }
    }

    // Create shuffled pieces in tray
    const shuffled = KidUtils.shuffleArray(
      Array.from({ length: gridSize * gridSize }, (_, i) => i)
    );

    shuffled.forEach(pieceIdx => {
      const r = Math.floor(pieceIdx / gridSize);
      const c = pieceIdx % gridSize;
      const piece = document.createElement('div');
      piece.className = 'jigsaw-piece';
      piece.draggable = true;
      piece.dataset.piece = pieceIdx;
      piece.style.width = (cellSize - 4) + 'px';
      piece.style.height = (cellSize - 4) + 'px';

      const pCanvas = document.createElement('canvas');
      pCanvas.width = cellSize - 4;
      pCanvas.height = cellSize - 4;
      const pctx = pCanvas.getContext('2d');
      pctx.drawImage(sourceCanvas,
        c * (300/gridSize), r * (300/gridSize), 300/gridSize, 300/gridSize,
        0, 0, cellSize - 4, cellSize - 4);
      piece.appendChild(pCanvas);

      piece.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', '' + pieceIdx);
        piece.classList.add('jigsaw-dragging');
      });
      piece.addEventListener('dragend', () => piece.classList.remove('jigsaw-dragging'));

      // Touch support
      piece.addEventListener('touchstart', (e) => {
        e.preventDefault();
        piece.classList.add('jigsaw-dragging');
        document.body.dataset.dragPiece = pieceIdx;
      }, { passive: false });

      tray.appendChild(piece);
    });

    // Touch move
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
  }

  function handleDrop(e, slotIdx) {
    e.preventDefault();
    const pieceIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    placePiece(pieceIdx, slotIdx);
  }

  function handleTouchMove(e) {
    if (document.body.dataset.dragPiece === undefined) return;
    e.preventDefault();
  }

  function handleTouchDrop(e, slotIdx) {
    const pieceIdx = parseInt(document.body.dataset.dragPiece, 10);
    if (!isNaN(pieceIdx)) {
      placePiece(pieceIdx, slotIdx);
    }
    delete document.body.dataset.dragPiece;
  }

  function placePiece(pieceIdx, slotIdx) {
    if (pieces[slotIdx].placed) return;
    if (pieceIdx !== slotIdx) {
      if (window.KidsSound) KidsSound.wrong();
      const msg = document.getElementById('message');
      msg.textContent = 'Not quite right! Try another spot. 💪';
      msg.className = 'kid-msg is-wrong';
      setTimeout(() => { msg.className = 'kid-msg'; }, 1000);
      return;
    }

    // Correct placement
    pieces[slotIdx].placed = true;
    placedCount++;
    document.getElementById('placed-count').textContent = placedCount;

    if (window.KidsSound) KidsSound.correct();

    // Move piece to slot
    const piece = document.querySelector('[data-piece="' + pieceIdx + '"]');
    const slot = document.querySelector('[data-index="' + slotIdx + '"]');
    if (piece && slot) {
      piece.draggable = false;
      piece.classList.add('jigsaw-placed');
      piece.style.position = 'absolute';
      piece.style.top = '2px';
      piece.style.left = '2px';
      slot.appendChild(piece);
      slot.classList.add('jigsaw-slot-filled');
    }

    if (placedCount === gridSize * gridSize) {
      gameWon();
    }
  }

  function toggleHint() {
    hintShowing = !hintShowing;
    const board = document.getElementById('jigsaw-board');
    if (hintShowing) {
      board.style.backgroundImage = 'url(' + sourceCanvas.toDataURL() + ')';
      board.style.backgroundSize = 'contain';
      board.style.backgroundRepeat = 'no-repeat';
      board.style.backgroundPosition = 'center';
      document.getElementById('hint-btn').textContent = '🙈 Hide picture';
    } else {
      board.style.backgroundImage = 'none';
      document.getElementById('hint-btn').textContent = '👁️ Show picture';
    }
  }

  function gameWon() {
    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();

    setTimeout(() => {
      document.getElementById('game-panel').style.display = 'none';
      const resultArea = document.getElementById('result-area');
      resultArea.classList.add('is-show');
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Puzzle complete!';
      document.getElementById('result-message').textContent =
        'You solved the ' + gridSize + 'x' + gridSize + ' puzzle!';

      const saved = KidUtils.loadScore('jigsaw');
      const solved = (saved.solved || 0) + 1;
      KidUtils.saveScore('jigsaw', { solved, difficulty });
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
