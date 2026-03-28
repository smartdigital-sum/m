(function () {
  'use strict';

  const colors = [
    '#ff7675', '#d63031', '#ff9f43', '#fdcb6e',
    '#00b894', '#00cec9', '#0984e3', '#6c5ce7',
    '#a29bfe', '#fd79a8', '#e84393', '#2d3436',
    '#636e72', '#dfe6e9', '#ffffff', '#000000'
  ];

  let canvas, ctx;
  let isDrawing = false;
  let currentColor = '#ff7675';
  let currentTool = 'brush';
  let brushSize = 8;
  let currentTemplate = 'blank';
  let lastDrawSound = 0;

  function init() {
    canvas = document.getElementById('drawing-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    createColorPalette();
    setupCanvas();
    selectTemplate('blank', document.querySelector('.kid-tpl.is-selected'));

    window.addEventListener('resize', resizeCanvas);

    document.querySelectorAll('.kid-tpl').forEach(btn => {
      btn.addEventListener('click', () => selectTemplate(btn.dataset.template, btn));
    });

    document.querySelectorAll('.kid-tool').forEach(btn => {
      btn.addEventListener('click', () => setTool(btn.dataset.tool));
    });

    document.querySelectorAll('.kid-brush').forEach(btn => {
      btn.addEventListener('click', () => setBrushSize(parseInt(btn.dataset.size, 10), btn));
    });

    document.getElementById('clear-btn').addEventListener('click', clearCanvas);
    document.getElementById('save-btn').addEventListener('click', saveDrawing);
  }

  function resizeCanvas() {
    const wrap = canvas.parentElement;
    const maxWidth = Math.min(700, wrap.clientWidth - 32);
    const ratio = canvas.height / canvas.width;
    canvas.style.width = maxWidth + 'px';
    canvas.style.height = (maxWidth * ratio) + 'px';
  }

  function createColorPalette() {
    const palette = document.getElementById('color-palette');
    colors.forEach((color, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kid-swatch' + (index === 0 ? ' is-on' : '');
      btn.style.background = color;
      if (color === '#ffffff') btn.style.border = '3px solid #b2bec3';
      btn.setAttribute('aria-label', 'Color ' + color);
      btn.addEventListener('click', () => selectColor(color, btn));
      palette.appendChild(btn);
    });
  }

  function selectColor(color, btn) {
    currentColor = color;
    if (window.KidsSound) KidsSound.pop();
    document.querySelectorAll('.kid-swatch').forEach(b => b.classList.remove('is-on'));
    btn.classList.add('is-on');
    if (currentTool === 'eraser') setTool('brush');
  }

  function setTool(tool) {
    currentTool = tool;
    if (window.KidsSound) KidsSound.click();
    document.querySelectorAll('.kid-tool').forEach(b => b.classList.remove('is-on'));
    document.querySelector('.kid-tool[data-tool="' + tool + '"]').classList.add('is-on');
    canvas.style.cursor = tool === 'fill' ? 'cell' : 'crosshair';
  }

  function setBrushSize(size, el) {
    brushSize = size;
    if (window.KidsSound) KidsSound.pop();
    document.querySelectorAll('.kid-brush').forEach(b => b.classList.remove('is-on'));
    el.classList.add('is-on');
  }

  function selectTemplate(template, el) {
    currentTemplate = template;
    if (window.KidsSound) KidsSound.tab();
    document.querySelectorAll('.kid-tpl').forEach(b => b.classList.remove('is-selected'));
    el.classList.add('is-selected');
    clearCanvas();
  }

  function drawTemplate(template) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    if (template === 'heart') {
      ctx.beginPath();
      ctx.moveTo(cx, cy + 50);
      ctx.bezierCurveTo(cx + 100, cy - 50, cx + 150, cy + 50, cx, cy + 150);
      ctx.bezierCurveTo(cx - 150, cy + 50, cx - 100, cy - 50, cx, cy + 50);
      ctx.stroke();
    } else if (template === 'star') {
      drawStar(cx, cy, 5, 100, 50);
    } else if (template === 'flower') {
      ctx.beginPath();
      ctx.moveTo(cx, cy + 150);
      ctx.lineTo(cx, cy - 50);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx - 30, cy + 50, 30, 15, -0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx + 30, cy + 30, 30, 15, 0.5, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = cx + Math.cos(angle) * 40;
        const py = cy - 50 + Math.sin(angle) * 40;
        ctx.beginPath();
        ctx.arc(px, py, 30, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy - 50, 20, 0, Math.PI * 2);
      ctx.stroke();
    } else if (template === 'sun') {
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.stroke();
      for (let r = 0; r < 12; r++) {
        const ang = (r * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * 100, cy + Math.sin(ang) * 100);
        ctx.lineTo(cx + Math.cos(ang) * 140, cy + Math.sin(ang) * 140);
        ctx.stroke();
      }
    } else if (template === 'rainbow') {
      const arcY = cy + 100;
      const radii = [180, 150, 120, 90, 60, 30];
      const arcColors = ['#ff7675', '#fdcb6e', '#00b894', '#0984e3', '#6c5ce7', '#e84393'];
      radii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = arcColors[idx];
        ctx.arc(cx, arcY, r, Math.PI, 0);
        ctx.stroke();
      });
      ctx.strokeStyle = '#2d3436';
    } else if (template === 'tree') {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(cx - 25, cy + 50, 50, 150);
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.arc(cx, cy - 50, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - 50, cy, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 50, cy, 50, 0, Math.PI * 2);
      ctx.fill();
    } else if (template === 'house') {
      ctx.fillStyle = '#fdcb6e';
      ctx.fillRect(cx - 100, cy, 200, 150);
      ctx.fillStyle = '#d63031';
      ctx.beginPath();
      ctx.moveTo(cx - 130, cy);
      ctx.lineTo(cx, cy - 80);
      ctx.lineTo(cx + 130, cy);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(cx - 25, cy + 70, 50, 80);
      ctx.fillStyle = '#74b9ff';
      ctx.fillRect(cx - 80, cy + 30, 40, 40);
      ctx.fillRect(cx + 40, cy + 30, 40, 40);
    }
  }

  function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.stroke();
  }

  function setupCanvas() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
  }

  function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    if (e.type === 'touchstart') {
      startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
    } else if (e.type === 'touchmove') {
      draw({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }

  function startDrawing(e) {
    isDrawing = true;
    const pos = getCoordinates(e);
    if (currentTool === 'fill') {
      floodFill(pos.x, pos.y);
      isDrawing = false;
      return;
    }
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!isDrawing) return;
    const pos = getCoordinates(e);
    const now = Date.now();
    if ((currentTool === 'brush' || currentTool === 'eraser') && now - lastDrawSound > 45 && window.KidsSound) {
      KidsSound.draw();
      lastDrawSound = now;
    }
    if (currentTool === 'brush' || currentTool === 'eraser') {
      ctx.strokeStyle = currentTool === 'eraser' ? 'white' : currentColor;
      ctx.lineWidth = currentTool === 'eraser' ? brushSize * 2 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  function floodFill(startX, startY) {
    if (window.KidsSound) KidsSound.fill();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;
    const ix = Math.floor(startX);
    const iy = Math.floor(startY);
    if (ix < 0 || ix >= w || iy < 0 || iy >= h) return;

    const startPos = (iy * w + ix) * 4;
    const startColor = { r: data[startPos], g: data[startPos + 1], b: data[startPos + 2] };
    const fillColor = KidUtils.hexToRgb(currentColor);

    if (startColor.r === fillColor.r && startColor.g === fillColor.g && startColor.b === fillColor.b) return;

    const tolerance = 32;
    const visited = new Uint8Array(w * h);
    const stack = [ix + iy * w];

    while (stack.length) {
      const pos = stack.pop();
      const x = pos % w;
      const y = (pos - x) / w;
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      if (visited[pos]) continue;

      const dataPos = pos * 4;
      if (!colorsMatch(data, dataPos, startColor, tolerance)) continue;

      visited[pos] = 1;
      data[dataPos] = fillColor.r;
      data[dataPos + 1] = fillColor.g;
      data[dataPos + 2] = fillColor.b;
      data[dataPos + 3] = 255;

      stack.push((x + 1) + y * w, (x - 1) + y * w, x + (y + 1) * w, x + (y - 1) * w);
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function colorsMatch(data, pos, target, tolerance) {
    return (
      Math.abs(data[pos] - target.r) <= tolerance &&
      Math.abs(data[pos + 1] - target.g) <= tolerance &&
      Math.abs(data[pos + 2] - target.b) <= tolerance
    );
  }

  function clearCanvas() {
    if (window.KidsSound) KidsSound.clear();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (currentTemplate !== 'blank') {
      drawTemplate(currentTemplate);
    }
  }

  function saveDrawing() {
    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) KidEffects.confetti();
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-kids-art.png';
    link.href = dataUrl;
    link.click();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
