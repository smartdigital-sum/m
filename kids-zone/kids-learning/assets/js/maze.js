(function () {
  'use strict';

  const difficulties = {
    easy: { cols: 8, rows: 8 },
    medium: { cols: 12, rows: 12 },
    hard: { cols: 16, rows: 16 }
  };

  const WALL_COLOR = '#2d3436';
  const PATH_COLOR = '#ffffff';
  const PLAYER_COLOR = '#6c5ce7';
  const GOAL_COLOR = '#ffd93d';
  const TRAIL_COLOR = 'rgba(108, 92, 231, 0.15)';

  let difficulty = 'easy';
  let maze = [];
  let cols = 8;
  let rows = 8;
  let player = { x: 0, y: 0 };
  let goal = { x: 0, y: 0 };
  let moves = 0;
  let solved = 0;
  let timerInterval = null;
  let seconds = 0;
  let gameWon = false;
  let canvas, ctx;
  let trail = [];

  function init() {
    canvas = document.getElementById('maze-canvas');
    ctx = canvas.getContext('2d');

    const saved = KidUtils.loadScore('maze');
    if (saved.difficulty && difficulties[saved.difficulty]) difficulty = saved.difficulty;
    solved = saved.solved || 0;
    document.getElementById('mazes-solved').textContent = solved;

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('new-maze-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      newMaze();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      newMaze();
    });

    document.addEventListener('keydown', handleKeyDown);

    document.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', () => movePlayer(btn.dataset.dir));
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); movePlayer(btn.dataset.dir); }, { passive: false });
    });

    const diffBtn = document.querySelector('[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    newMaze();
  }

  function setDifficulty(level) {
    if (window.KidsSound) KidsSound.click();
    difficulty = level;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
    document.querySelector('[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('maze', { difficulty: level });
    newMaze();
  }

  // --- Maze Generation (Recursive Backtracker) ---
  function generateMaze(c, r) {
    // Each cell has walls: top, right, bottom, left
    const grid = [];
    for (let y = 0; y < r; y++) {
      grid[y] = [];
      for (let x = 0; x < c; x++) {
        grid[y][x] = { top: true, right: true, bottom: true, left: true, visited: false };
      }
    }

    const stack = [];
    let current = { x: 0, y: 0 };
    grid[0][0].visited = true;
    stack.push(current);

    while (stack.length > 0) {
      const neighbors = getUnvisitedNeighbors(current.x, current.y, c, r, grid);
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWall(grid, current, next);
        grid[next.y][next.x].visited = true;
        stack.push(current);
        current = next;
      } else {
        current = stack.pop();
      }
    }

    return grid;
  }

  function getUnvisitedNeighbors(x, y, c, r, grid) {
    const neighbors = [];
    if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ x, y: y - 1, dir: 'top' });
    if (x < c - 1 && !grid[y][x + 1].visited) neighbors.push({ x: x + 1, y, dir: 'right' });
    if (y < r - 1 && !grid[y + 1][x].visited) neighbors.push({ x, y: y + 1, dir: 'bottom' });
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ x: x - 1, y, dir: 'left' });
    return neighbors;
  }

  function removeWall(grid, current, next) {
    const dx = next.x - current.x;
    const dy = next.y - current.y;

    if (dx === 1) {
      grid[current.y][current.x].right = false;
      grid[next.y][next.x].left = false;
    } else if (dx === -1) {
      grid[current.y][current.x].left = false;
      grid[next.y][next.x].right = false;
    } else if (dy === 1) {
      grid[current.y][current.x].bottom = false;
      grid[next.y][next.x].top = false;
    } else if (dy === -1) {
      grid[current.y][current.x].top = false;
      grid[next.y][next.x].bottom = false;
    }
  }

  // --- Game Logic ---
  function newMaze() {
    const config = difficulties[difficulty];
    cols = config.cols;
    rows = config.rows;
    maze = generateMaze(cols, rows);
    player = { x: 0, y: 0 };
    goal = { x: cols - 1, y: rows - 1 };
    moves = 0;
    gameWon = false;
    trail = [{ x: 0, y: 0 }];

    document.getElementById('moves').textContent = '0';
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';

    resetTimer();
    startTimer();
    resizeCanvas();
    drawMaze();
  }

  function resizeCanvas() {
    const maxSize = Math.min(400, window.innerWidth - 80);
    canvas.width = maxSize;
    canvas.height = maxSize;
  }

  function drawMaze() {
    const w = canvas.width;
    const h = canvas.height;
    const cellW = w / cols;
    const cellH = h / rows;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = PATH_COLOR;
    ctx.fillRect(0, 0, w, h);

    // Trail
    trail.forEach(pos => {
      ctx.fillStyle = TRAIL_COLOR;
      ctx.fillRect(pos.x * cellW, pos.y * cellH, cellW, cellH);
    });

    // Goal
    ctx.fillStyle = GOAL_COLOR;
    ctx.beginPath();
    const gx = goal.x * cellW + cellW / 2;
    const gy = goal.y * cellH + cellH / 2;
    drawStar(gx, gy, 5, cellW * 0.35, cellW * 0.15);
    ctx.fill();

    // Walls
    ctx.strokeStyle = WALL_COLOR;
    ctx.lineWidth = Math.max(2, cellW * 0.08);
    ctx.lineCap = 'round';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = maze[y][x];
        const px = x * cellW;
        const py = y * cellH;

        if (cell.top) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellW, py);
          ctx.stroke();
        }
        if (cell.right) {
          ctx.beginPath();
          ctx.moveTo(px + cellW, py);
          ctx.lineTo(px + cellW, py + cellH);
          ctx.stroke();
        }
        if (cell.bottom) {
          ctx.beginPath();
          ctx.moveTo(px, py + cellH);
          ctx.lineTo(px + cellW, py + cellH);
          ctx.stroke();
        }
        if (cell.left) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py + cellH);
          ctx.stroke();
        }
      }
    }

    // Player
    const px = player.x * cellW + cellW / 2;
    const py = player.y * cellH + cellH / 2;
    const pr = cellW * 0.35;

    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fillStyle = PLAYER_COLOR;
    ctx.fill();
    ctx.strokeStyle = '#5b4fcf';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Player face
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(px - pr * 0.25, py - pr * 0.15, pr * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + pr * 0.25, py - pr * 0.15, pr * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py + pr * 0.15, pr * 0.2, 0, Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Start marker
    ctx.fillStyle = '#00b894';
    ctx.font = 'bold ' + (cellW * 0.4) + 'px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏠', cellW / 2, cellH / 2);
  }

  function drawStar(cx, cy, spikes, outerR, innerR) {
    let rot = -Math.PI / 2;
    const step = Math.PI / spikes;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const x = cx + Math.cos(rot) * r;
      const y = cy + Math.sin(rot) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      rot += step;
    }
    ctx.closePath();
  }

  function movePlayer(dir) {
    if (gameWon) return;

    const cell = maze[player.y][player.x];
    let moved = false;

    if (dir === 'up' && !cell.top && player.y > 0) {
      player.y--;
      moved = true;
    } else if (dir === 'down' && !cell.bottom && player.y < rows - 1) {
      player.y++;
      moved = true;
    } else if (dir === 'left' && !cell.left && player.x > 0) {
      player.x--;
      moved = true;
    } else if (dir === 'right' && !cell.right && player.x < cols - 1) {
      player.x++;
      moved = true;
    }

    if (moved) {
      moves++;
      document.getElementById('moves').textContent = moves;
      if (window.KidsSound) KidsSound.pop();

      // Add to trail
      if (!trail.some(t => t.x === player.x && t.y === player.y)) {
        trail.push({ x: player.x, y: player.y });
      }

      drawMaze();

      if (player.x === goal.x && player.y === goal.y) {
        winGame();
      }
    }
  }

  function handleKeyDown(e) {
    if (gameWon) return;
    const keyMap = {
      ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
      w: 'up', s: 'down', a: 'left', d: 'right'
    };
    const dir = keyMap[e.key];
    if (dir) {
      e.preventDefault();
      movePlayer(dir);
    }
  }

  function startTimer() {
    stopTimer();
    seconds = 0;
    timerInterval = setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      document.getElementById('timer').textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    stopTimer();
    seconds = 0;
    document.getElementById('timer').textContent = '0:00';
  }

  function winGame() {
    gameWon = true;
    stopTimer();
    solved++;
    document.getElementById('mazes-solved').textContent = solved;

    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const timeStr = m + ':' + (s < 10 ? '0' : '') + s;

    document.getElementById('game-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    document.getElementById('result-icon').textContent = '🏆';
    document.getElementById('result-title').textContent = 'You made it!';
    document.getElementById('result-message').textContent =
      'You escaped the ' + cols + 'x' + rows + ' maze!';

    document.getElementById('result-stats').innerHTML =
      '<div><div class="val">' + moves + '</div><div>Moves</div></div>' +
      '<div><div class="val">' + timeStr + '</div><div>Time</div></div>' +
      '<div><div class="val">' + solved + '</div><div>Total Solved</div></div>';

    KidUtils.saveScore('maze', { solved, difficulty });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
