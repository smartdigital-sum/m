(function () {
  'use strict';

  // Pictures defined as arrays of {x, y} points (0-100 normalized)
  const pictures = {
    easy: [
      { name: 'Star', emoji: '⭐', points: [{x:50,y:10},{x:62,y:38},{x:92,y:38},{x:68,y:56},{x:78,y:85},{x:50,y:68},{x:22,y:85},{x:32,y:56},{x:8,y:38},{x:38,y:38}] },
      { name: 'House', emoji: '🏠', points: [{x:20,y:80},{x:20,y:50},{x:50,y:20},{x:80,y:50},{x:80,y:80},{x:55,y:80},{x:55,y:60},{x:45,y:60},{x:45,y:80},{x:20,y:80}] },
      { name: 'Heart', emoji: '❤️', points: [{x:50,y:85},{x:20,y:55},{x:10,y:35},{x:15,y:20},{x:30,y:15},{x:50,y:30},{x:70,y:15},{x:85,y:20},{x:90,y:35},{x:80,y:55}] },
      { name: 'Fish', emoji: '🐟', points: [{x:15,y:50},{x:25,y:35},{x:45,y:30},{x:65,y:35},{x:80,y:45},{x:85,y:50},{x:80,y:55},{x:65,y:65},{x:45,y:70},{x:25,y:65}] },
      { name: 'Flower', emoji: '🌸', points: [{x:50,y:15},{x:65,y:25},{x:75,y:40},{x:75,y:58},{x:65,y:72},{x:50,y:80},{x:35,y:72},{x:25,y:58},{x:25,y:40},{x:35,y:25}] }
    ],
    medium: [
      { name: 'Rocket', emoji: '🚀', points: [{x:50,y:8},{x:58,y:20},{x:62,y:40},{x:62,y:60},{x:72,y:75},{x:68,y:90},{x:58,y:80},{x:50,y:92},{x:42,y:80},{x:32,y:90},{x:28,y:75},{x:38,y:60},{x:38,y:40},{x:42,y:20},{x:50,y:8}] },
      { name: 'Butterfly', emoji: '🦋', points: [{x:50,y:15},{x:35,y:20},{x:20,y:30},{x:15,y:50},{x:25,y:65},{x:40,y:70},{x:50,y:85},{x:60,y:70},{x:75,y:65},{x:85,y:50},{x:80,y:30},{x:65,y:20},{x:50,y:15}] },
      { name: 'Cat', emoji: '🐱', points: [{x:30,y:20},{x:25,y:10},{x:35,y:25},{x:50,y:20},{x:65,y:25},{x:75,y:10},{x:70,y:20},{x:80,y:40},{x:75,y:60},{x:60,y:75},{x:50,y:80},{x:40,y:75},{x:25,y:60},{x:20,y:40},{x:30,y:20}] },
      { name: 'Crown', emoji: '👑', points: [{x:15,y:70},{x:15,y:45},{x:25,y:55},{x:35,y:30},{x:50,y:50},{x:65,y:30},{x:75,y:55},{x:85,y:45},{x:85,y:70},{x:15,y:70}] },
      { name: 'Car', emoji: '🚗', points: [{x:10,y:60},{x:15,y:45},{x:30,y:40},{x:40,y:30},{x:60,y:30},{x:70,y:40},{x:85,y:45},{x:90,y:60},{x:85,y:70},{x:75,y:70},{x:70,y:55},{x:30,y:55},{x:25,y:70},{x:15,y:70},{x:10,y:60}] }
    ],
    hard: [
      { name: 'Dragon', emoji: '🐉', points: [{x:20,y:30},{x:15,y:20},{x:25,y:25},{x:35,y:15},{x:45,y:25},{x:55,y:20},{x:65,y:30},{x:75,y:25},{x:85,y:35},{x:90,y:50},{x:80,y:55},{x:85,y:65},{x:75,y:70},{x:65,y:65},{x:55,y:75},{x:45,y:70},{x:35,y:75},{x:25,y:65},{x:15,y:70},{x:10,y:50}] },
      { name: 'Castle', emoji: '🏰', points: [{x:15,y:85},{x:15,y:50},{x:10,y:50},{x:15,y:35},{x:20,y:50},{x:25,y:50},{x:25,y:40},{x:20,y:40},{x:25,y:25},{x:30,y:40},{x:35,y:40},{x:35,y:50},{x:50,y:50},{x:50,y:30},{x:45,y:30},{x:50,y:15},{x:55,y:30},{x:50,y:30},{x:50,y:50},{x:65,y:50}] },
      { name: 'Unicorn', emoji: '🦄', points: [{x:30,y:80},{x:25,y:65},{x:20,y:50},{x:25,y:40},{x:35,y:35},{x:40,y:25},{x:45,y:15},{x:48,y:25},{x:50,y:35},{x:55,y:30},{x:65,y:35},{x:70,y:45},{x:75,y:60},{x:70,y:75},{x:60,y:80},{x:50,y:85},{x:40,y:85},{x:30,y:80}] },
      { name: 'Dinosaur', emoji: '🦕', points: [{x:25,y:75},{x:20,y:60},{x:15,y:45},{x:20,y:35},{x:15,y:25},{x:25,y:30},{x:30,y:20},{x:35,y:30},{x:40,y:25},{x:45,y:35},{x:55,y:40},{x:65,y:35},{x:75,y:40},{x:80,y:50},{x:85,y:65},{x:80,y:75},{x:70,y:80},{x:55,y:82},{x:40,y:80},{x:25,y:75}] },
      { name: 'Spaceship', emoji: '🛸', points: [{x:50,y:10},{x:45,y:25},{x:30,y:35},{x:20,y:50},{x:25,y:60},{x:40,y:55},{x:35,y:65},{x:45,y:75},{x:55,y:75},{x:65,y:65},{x:60,y:55},{x:75,y:60},{x:80,y:50},{x:70,y:35},{x:55,y:25},{x:50,y:10}] }
    ]
  };

  let difficulty = 'easy';
  let currentPic = null;
  let currentDot = 0;
  let canvas, ctx;
  let dotRadius = 18;

  function init() {
    canvas = document.getElementById('dots-canvas');
    ctx = canvas.getContext('2d');

    const saved = KidUtils.loadScore('dots');
    if (saved.difficulty && pictures[saved.difficulty]) difficulty = saved.difficulty;

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('new-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      newGame();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      newGame();
    });

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    const diffBtn = document.querySelector('[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    newGame();
  }

  function resizeCanvas() {
    const size = Math.min(400, window.innerWidth - 80);
    canvas.width = size;
    canvas.height = size;
    if (currentPic) draw();
  }

  function setDifficulty(level) {
    if (window.KidsSound) KidsSound.click();
    difficulty = level;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
    document.querySelector('[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('dots', { difficulty: level });
    newGame();
  }

  function newGame() {
    const pool = pictures[difficulty];
    currentPic = pool[Math.floor(Math.random() * pool.length)];
    currentDot = 0;

    document.getElementById('next-num').textContent = '1';
    document.getElementById('dots-hint').textContent = currentPic.emoji + ' ' + currentPic.name;
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('game-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');

    resizeCanvas();
    draw();
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, w, h);

    // Grid lines (subtle)
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * w / 10, 0);
      ctx.lineTo(i * w / 10, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * h / 10);
      ctx.lineTo(w, i * h / 10);
      ctx.stroke();
    }

    const pts = currentPic.points;
    const total = pts.length;

    // Draw lines between connected dots
    if (currentDot > 0) {
      ctx.strokeStyle = '#6c5ce7';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x * w / 100, pts[0].y * h / 100);
      for (let i = 1; i <= currentDot && i < total; i++) {
        ctx.lineTo(pts[i].x * w / 100, pts[i].y * h / 100);
      }
      ctx.stroke();
    }

    // Draw dots
    for (let i = 0; i < total; i++) {
      const x = pts[i].x * w / 100;
      const y = pts[i].y * h / 100;
      const r = dotRadius * (w / 400);

      if (i < currentDot) {
        // Connected
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#00b894';
        ctx.fill();
      } else if (i === currentDot) {
        // Next (pulsing)
        ctx.beginPath();
        ctx.arc(x, y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(108, 92, 231, 0.2)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#6c5ce7';
        ctx.fill();
      } else {
        // Future
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#dfe6e9';
        ctx.fill();
      }

      // Number
      ctx.fillStyle = i < currentDot ? 'white' : (i === currentDot ? 'white' : '#636e72');
      ctx.font = 'bold ' + (r * 0.9) + 'px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('' + (i + 1), x, y + 1);
    }

    // Show completed picture overlay
    if (currentDot >= total) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font = 'bold ' + (w * 0.2) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentPic.emoji, w / 2, h / 2);
    }
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    checkDot(x, y);
  }

  function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width * 100;
    const y = (touch.clientY - rect.top) / rect.height * 100;
    checkDot(x, y);
  }

  function checkDot(clickX, clickY) {
    if (currentDot >= currentPic.points.length) return;

    const pt = currentPic.points[currentDot];
    const threshold = 8; // tolerance in normalized units
    const dx = Math.abs(clickX - pt.x);
    const dy = Math.abs(clickY - pt.y);

    if (dx < threshold && dy < threshold) {
      currentDot++;
      if (window.KidsSound) KidsSound.pop();
      document.getElementById('next-num').textContent =
        currentDot < currentPic.points.length ? '' + (currentDot + 1) : 'Done!';

      draw();

      if (currentDot >= currentPic.points.length) {
        gameWon();
      }
    }
  }

  function gameWon() {
    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();

    const msg = document.getElementById('message');
    msg.textContent = '🎉 It\'s a ' + currentPic.emoji + ' ' + currentPic.name + '! 🎉';
    msg.className = 'kid-msg is-correct';

    setTimeout(() => {
      document.getElementById('game-panel').style.display = 'none';
      const resultArea = document.getElementById('result-area');
      resultArea.classList.add('is-show');
      document.getElementById('result-icon').textContent = currentPic.emoji;
      document.getElementById('result-title').textContent = 'It\'s a ' + currentPic.name + '!';
      document.getElementById('result-message').textContent =
        'You connected all ' + currentPic.points.length + ' dots!';

      const saved = KidUtils.loadScore('dots');
      const totalDone = (saved.totalDone || 0) + 1;
      KidUtils.saveScore('dots', { totalDone, difficulty });
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
