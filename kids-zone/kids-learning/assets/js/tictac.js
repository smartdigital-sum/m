(function () {
  'use strict';

  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameOver = false;
  let mode = 'friend';
  let scores = { X: 0, O: 0, draw: 0 };
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function init() {
    const saved = KidUtils.loadScore('tictac');
    if (saved.mode) mode = saved.mode;
    scores.X = saved.X || 0;
    scores.O = saved.O || 0;
    scores.draw = saved.draw || 0;
    updateScoreDisplay();

    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => selectMode(btn.dataset.mode));
    });

    document.getElementById('new-game-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      resetGame();
    });

    const modeBtn = document.querySelector('[data-mode="' + mode + '"]');
    if (modeBtn) {
      document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
      modeBtn.classList.add('active');
    }

    buildBoard();
    resetGame();
  }

  function selectMode(m) {
    if (window.KidsSound) KidsSound.tab();
    mode = m;
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="' + m + '"]').classList.add('active');
    KidUtils.saveScore('tictac', { mode: m });
    resetGame();
  }

  function buildBoard() {
    const container = document.getElementById('ttt-board');
    container.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'ttt-cell';
      cell.dataset.index = i;
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', 'Cell ' + (i + 1) + ', empty');
      cell.addEventListener('click', () => makeMove(i));
      container.appendChild(cell);
    }
  }

  function resetGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameOver = false;
    document.querySelectorAll('.ttt-cell').forEach(cell => {
      cell.textContent = '';
      cell.className = 'ttt-cell';
      cell.disabled = false;
      cell.setAttribute('aria-label', 'Cell empty');
    });
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    updateTurnDisplay();
  }

  function makeMove(index) {
    if (gameOver || board[index] !== '') return;
    if (mode !== 'friend' && currentPlayer === 'O') return;

    board[index] = currentPlayer;
    const cell = document.querySelector('[data-index="' + index + '"]');
    cell.textContent = currentPlayer === 'X' ? '❌' : '⭕';
    cell.classList.add('ttt-cell-' + currentPlayer.toLowerCase());
    cell.disabled = true;
    cell.setAttribute('aria-label', 'Cell ' + currentPlayer);

    if (window.KidsSound) KidsSound.pop();

    const winner = checkWinner();
    if (winner) {
      endGame(winner);
      return;
    }

    if (board.every(c => c !== '')) {
      endGame('draw');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();

    if (mode !== 'friend' && currentPlayer === 'O') {
      setTimeout(botMove, 400);
    }
  }

  function botMove() {
    if (gameOver) return;
    let index;
    if (mode === 'hard') {
      index = minimax(board, 'O').index;
    } else {
      // Easy: random empty cell
      const empty = board.map((c, i) => c === '' ? i : -1).filter(i => i >= 0);
      index = empty[Math.floor(Math.random() * empty.length)];
    }
    if (index !== undefined) makeMove(index);
  }

  function minimax(b, player) {
    const empty = b.map((c, i) => c === '' ? i : -1).filter(i => i >= 0);
    const winner = checkWinnerBoard(b);

    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (empty.length === 0) return { score: 0 };

    const moves = [];
    for (const i of empty) {
      const newBoard = b.slice();
      newBoard[i] = player;
      const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
      moves.push({ index: i, score: result.score });
    }

    let best;
    if (player === 'O') {
      best = moves.reduce((a, m) => m.score > a.score ? m : a, { score: -Infinity });
    } else {
      best = moves.reduce((a, m) => m.score < a.score ? m : a, { score: Infinity });
    }
    return best;
  }

  function checkWinner() {
    return checkWinnerBoard(board);
  }

  function checkWinnerBoard(b) {
    for (const [a, c, d] of winPatterns) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    return null;
  }

  function endGame(result) {
    gameOver = true;
    document.querySelectorAll('.ttt-cell').forEach(c => c.disabled = true);

    if (result === 'draw') {
      scores.draw++;
      document.getElementById('message').textContent = '🤝 It\'s a draw!';
      document.getElementById('message').className = 'kid-msg';
      if (window.KidsSound) KidsSound.pop();
    } else {
      scores[result]++;
      const emoji = result === 'X' ? '❌' : '⭕';
      document.getElementById('message').textContent = '🎉 ' + emoji + ' ' + result + ' wins! 🎉';
      document.getElementById('message').className = 'kid-msg is-correct';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();

      // Highlight winning cells
      for (const [a, c, d] of winPatterns) {
        if (board[a] === result && board[c] === result && board[d] === result) {
          document.querySelector('[data-index="' + a + '"]').classList.add('ttt-win');
          document.querySelector('[data-index="' + c + '"]').classList.add('ttt-win');
          document.querySelector('[data-index="' + d + '"]').classList.add('ttt-win');
        }
      }
    }

    updateScoreDisplay();
    KidUtils.saveScore('tictac', { X: scores.X, O: scores.O, draw: scores.draw, mode });
  }

  function updateTurnDisplay() {
    const emoji = currentPlayer === 'X' ? '❌' : '⭕';
    document.getElementById('turn-display').textContent = emoji + ' ' + currentPlayer + "'s turn";
  }

  function updateScoreDisplay() {
    document.getElementById('x-score').textContent = scores.X;
    document.getElementById('o-score').textContent = scores.O;
    document.getElementById('draws').textContent = scores.draw;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
