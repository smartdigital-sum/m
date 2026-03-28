(function () {
  'use strict';

  const DIFF_COUNT = 5;

  // Scene generators
  const scenes = [
    function garden(ctx, w, h) {
      // Sky
      ctx.fillStyle = '#74b9ff';
      ctx.fillRect(0, 0, w, h * 0.5);
      // Ground
      ctx.fillStyle = '#55efc4';
      ctx.fillRect(0, h * 0.5, w, h * 0.5);
      // Sun
      ctx.fillStyle = '#fdcb6e';
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.2, 25, 0, Math.PI * 2);
      ctx.fill();
      // Clouds
      drawCloud(ctx, w * 0.2, h * 0.15, 30);
      drawCloud(ctx, w * 0.6, h * 0.1, 25);
      // Tree
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(w * 0.3 - 8, h * 0.35, 16, 40);
      ctx.fillStyle = '#00b894';
      ctx.beginPath();
      ctx.arc(w * 0.3, h * 0.32, 30, 0, Math.PI * 2);
      ctx.fill();
      // Flowers
      drawFlower(ctx, w * 0.15, h * 0.65, '#ff7675');
      drawFlower(ctx, w * 0.5, h * 0.7, '#fd79a8');
      drawFlower(ctx, w * 0.75, h * 0.6, '#a29bfe');
      // House
      ctx.fillStyle = '#fdcb6e';
      ctx.fillRect(w * 0.6, h * 0.45, 60, 50);
      ctx.fillStyle = '#d63031';
      ctx.beginPath();
      ctx.moveTo(w * 0.6 - 5, h * 0.45);
      ctx.lineTo(w * 0.6 + 30, h * 0.32);
      ctx.lineTo(w * 0.6 + 65, h * 0.45);
      ctx.fill();
    },
    function underwater(ctx, w, h) {
      // Water
      ctx.fillStyle = '#0984e3';
      ctx.fillRect(0, 0, w, h);
      // Sand
      ctx.fillStyle = '#ffeaa7';
      ctx.fillRect(0, h * 0.75, w, h * 0.25);
      // Seaweed
      ctx.fillStyle = '#00b894';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(w * (0.15 + i * 0.25), h * 0.7, 8, 30, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Fish
      drawFish(ctx, w * 0.3, h * 0.3, '#ff7675');
      drawFish(ctx, w * 0.7, h * 0.5, '#fdcb6e');
      drawFish(ctx, w * 0.5, h * 0.2, '#a29bfe');
      // Bubbles
      for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(w * (0.1 + Math.random() * 0.8), h * (0.1 + Math.random() * 0.5), 4 + Math.random() * 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    function space(ctx, w, h) {
      // Space
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, w, h);
      // Stars
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Planet
      ctx.fillStyle = '#a29bfe';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6c5ce7';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(w * 0.5, h * 0.5, 55, 15, -0.3, 0, Math.PI * 2);
      ctx.stroke();
      // Rocket
      ctx.font = '40px serif';
      ctx.fillText('🚀', w * 0.15, h * 0.35);
      // Moon
      ctx.fillStyle = '#dfe6e9';
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.25, 18, 0, Math.PI * 2);
      ctx.fill();
    },
    function kitchen(ctx, w, h) {
      // Wall
      ctx.fillStyle = '#ffeaa7';
      ctx.fillRect(0, 0, w, h * 0.6);
      // Floor
      ctx.fillStyle = '#dfe6e9';
      ctx.fillRect(0, h * 0.6, w, h * 0.4);
      // Table
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(w * 0.1, h * 0.55, w * 0.8, 12);
      ctx.fillRect(w * 0.15, h * 0.66, 8, 30);
      ctx.fillRect(w * 0.8, h * 0.66, 8, 30);
      // Plate
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(w * 0.4, h * 0.52, 25, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#dfe6e9';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Cup
      ctx.fillStyle = '#ff7675';
      ctx.fillRect(w * 0.65, h * 0.42, 20, 22);
      ctx.fillStyle = '#d63031';
      ctx.beginPath();
      ctx.arc(w * 0.65 + 20, h * 0.48, 6, -Math.PI/2, Math.PI/2);
      ctx.fill();
      // Window
      ctx.fillStyle = '#74b9ff';
      ctx.fillRect(w * 0.3, h * 0.1, 50, 40);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.strokeRect(w * 0.3, h * 0.1, 50, 40);
      ctx.beginPath();
      ctx.moveTo(w * 0.3 + 25, h * 0.1);
      ctx.lineTo(w * 0.3 + 25, h * 0.1 + 40);
      ctx.stroke();
    }
  ];

  // Possible differences: {x, y, radius, type, property, value1, value2}
  function generateDifferences() {
    const diffs = [];
    const types = ['color', 'size', 'add', 'remove', 'move'];
    // We'll create differences as canvas draw changes
    return diffs;
  }

  let canvas1, canvas2, ctx1, ctx2;
  let differences = [];
  let foundDiffs = [];
  let currentScene = 0;

  function init() {
    canvas1 = document.getElementById('canvas-1');
    canvas2 = document.getElementById('canvas-2');
    ctx1 = canvas1.getContext('2d');
    ctx2 = canvas2.getContext('2d');

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

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    canvas1.addEventListener('click', (e) => handleCanvasClick(e, canvas1, 1));
    canvas2.addEventListener('click', (e) => handleCanvasClick(e, canvas2, 2));
    canvas1.addEventListener('touchstart', (e) => { e.preventDefault(); handleCanvasClick(e.touches[0], canvas1, 1); }, { passive: false });
    canvas2.addEventListener('touchstart', (e) => { e.preventDefault(); handleCanvasClick(e.touches[0], canvas2, 2); }, { passive: false });

    newGame();
  }

  function resizeCanvases() {
    const size = Math.min(280, (window.innerWidth - 100) / 2);
    [canvas1, canvas2].forEach(c => {
      c.width = size;
      c.height = size;
      c.style.width = size + 'px';
      c.style.height = size + 'px';
    });
    if (differences.length) drawAll();
  }

  function newGame() {
    foundDiffs = [];
    currentScene = Math.floor(Math.random() * scenes.length);
    generateScene();
    document.getElementById('found-count').textContent = '0';
    document.getElementById('total-diffs').textContent = DIFF_COUNT;
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('game-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');
    drawAll();
  }

  function generateScene() {
    const w = canvas1.width;
    const h = canvas1.height;
    differences = [];

    // Generate differences randomly
    const diffTypes = [
      // Color changes
      () => {
        const colors = ['#ff7675','#fdcb6e','#55efc4','#74b9ff','#a29bfe','#fd79a8','#e17055','#00b894'];
        return {
          x: 0.15 + Math.random() * 0.7,
          y: 0.15 + Math.random() * 0.7,
          r: 0.08,
          type: 'circle',
          color1: colors[Math.floor(Math.random() * colors.length)],
          color2: colors[Math.floor(Math.random() * colors.length)]
        };
      },
      // Size change
      () => ({
        x: 0.15 + Math.random() * 0.7,
        y: 0.15 + Math.random() * 0.7,
        r: 0.05 + Math.random() * 0.04,
        type: 'circle',
        color1: '#fdcb6e',
        color2: '#fdcb6e',
        size1: 0.05,
        size2: 0.09
      }),
      // Add/remove shape
      () => ({
        x: 0.15 + Math.random() * 0.7,
        y: 0.15 + Math.random() * 0.7,
        r: 0.06,
        type: 'star',
        color1: '#ffd93d',
        color2: 'transparent'
      }),
      // Emoji difference
      () => {
        const emojis1 = ['⭐','❤️','🌸','🎵','🎈','🦋'];
        const emojis2 = ['🌙','💜','🌻','🎶','🎀','🐛'];
        const i = Math.floor(Math.random() * emojis1.length);
        return {
          x: 0.15 + Math.random() * 0.7,
          y: 0.15 + Math.random() * 0.7,
          r: 0.06,
          type: 'emoji',
          emoji1: emojis1[i],
          emoji2: emojis2[i]
        };
      },
      // Square difference
      () => ({
        x: 0.15 + Math.random() * 0.7,
        y: 0.15 + Math.random() * 0.7,
        r: 0.05,
        type: 'square',
        color1: '#e17055',
        color2: '#00b894'
      })
    ];

    // Pick random positions that don't overlap
    const used = [];
    for (let i = 0; i < DIFF_COUNT; i++) {
      let diff;
      let attempts = 0;
      do {
        diff = diffTypes[Math.floor(Math.random() * diffTypes.length)]();
        attempts++;
      } while (attempts < 20 && used.some(u => Math.abs(u.x - diff.x) < 0.15 && Math.abs(u.y - diff.y) < 0.15));
      used.push(diff);
      differences.push(diff);
    }
  }

  function drawAll() {
    const w = canvas1.width;
    const h = canvas1.height;
    const scene = scenes[currentScene];

    // Draw base scene on both
    ctx1.clearRect(0, 0, w, h);
    ctx2.clearRect(0, 0, w, h);
    scene(ctx1, w, h);
    scene(ctx2, w, h);

    // Apply differences
    differences.forEach((d, i) => {
      const x = d.x * w;
      const y = d.y * h;
      const r = (d.r || 0.06) * w;

      // Image 1
      drawDiffElement(ctx1, d, x, y, r, 1);
      // Image 2 (different)
      drawDiffElement(ctx2, d, x, y, r, 2);

      // Draw circle marker for found differences
      if (foundDiffs.includes(i)) {
        [ctx1, ctx2].forEach(ctx => {
          ctx.strokeStyle = '#00b894';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, y, r + 6, 0, Math.PI * 2);
          ctx.stroke();
        });
      }
    });
  }

  function drawDiffElement(ctx, d, x, y, r, imgNum) {
    if (d.type === 'circle') {
      const color = imgNum === 1 ? d.color1 : d.color2;
      const size = imgNum === 1 ? (d.size1 || d.r) : (d.size2 || d.r);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size * canvas1.width, 0, Math.PI * 2);
      ctx.fill();
    } else if (d.type === 'star') {
      const color = imgNum === 1 ? d.color1 : d.color2;
      if (color === 'transparent') return;
      ctx.fillStyle = color;
      drawStar(ctx, x, y, 5, r, r * 0.4);
      ctx.fill();
    } else if (d.type === 'emoji') {
      const emoji = imgNum === 1 ? d.emoji1 : d.emoji2;
      ctx.font = (r * 2.5) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, x, y);
    } else if (d.type === 'square') {
      const color = imgNum === 1 ? d.color1 : d.color2;
      ctx.fillStyle = color;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
    let rot = -Math.PI / 2;
    const step = Math.PI / spikes;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      ctx.lineTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r);
      rot += step;
    }
    ctx.closePath();
  }

  function drawCloud(ctx, x, y, size) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.5, y - size * 0.2, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size, y, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFlower(ctx, x, y, color) {
    ctx.fillStyle = '#00b894';
    ctx.fillRect(x - 2, y, 4, 20);
    ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fdcb6e';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFish(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 18, y);
    ctx.lineTo(x + 30, y - 10);
    ctx.lineTo(x + 30, y + 10);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 8, y - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.arc(x - 8, y - 3, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function handleCanvasClick(e, canvas, imgNum) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    for (let i = 0; i < differences.length; i++) {
      if (foundDiffs.includes(i)) continue;
      const d = differences[i];
      const dist = Math.sqrt((x - d.x) ** 2 + (y - d.y) ** 2);
      if (dist < 0.1) {
        foundDiffs.push(i);
        document.getElementById('found-count').textContent = foundDiffs.length;
        if (window.KidsSound) KidsSound.correct();
        if (window.KidEffects) KidEffects.bumpScore(document.getElementById('found-count'));

        drawAll();

        const msg = document.getElementById('message');
        msg.textContent = '🎉 Found ' + foundDiffs.length + ' of ' + DIFF_COUNT + '! 🎉';
        msg.className = 'kid-msg is-correct';

        if (foundDiffs.length === DIFF_COUNT) {
          gameWon();
        }
        return;
      }
    }

    // Miss
    if (window.KidsSound) KidsSound.wrong();
  }

  function gameWon() {
    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();

    setTimeout(() => {
      document.getElementById('game-panel').style.display = 'none';
      const resultArea = document.getElementById('result-area');
      resultArea.classList.add('is-show');
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Eagle eyes!';
      document.getElementById('result-message').textContent =
        'You found all ' + DIFF_COUNT + ' differences!';

      const saved = KidUtils.loadScore('spotdiff');
      const solved = (saved.solved || 0) + 1;
      KidUtils.saveScore('spotdiff', { solved });
    }, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
