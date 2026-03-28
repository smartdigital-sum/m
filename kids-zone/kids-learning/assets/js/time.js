(function () {
  'use strict';

  const QUESTIONS_PER_QUIZ = 8;

  const difficulties = {
    easy: { hourOnly: true, roundTo: 60, elapsedMax: 1 },
    medium: { hourOnly: false, roundTo: 30, elapsedMax: 3 },
    hard: { hourOnly: false, roundTo: 5, elapsedMax: 6 }
  };

  let currentMode = 'read';
  let difficulty = 'easy';
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;
  let canvas, ctx;

  function init() {
    canvas = document.getElementById('clock-canvas');
    ctx = canvas.getContext('2d');

    const saved = KidUtils.loadScore('time');
    if (saved.mode) currentMode = saved.mode;
    if (saved.difficulty && difficulties[saved.difficulty]) difficulty = saved.difficulty;

    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => selectMode(btn.dataset.mode));
    });

    document.querySelectorAll('[data-diff]').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      startQuiz();
    });

    // Set initial active states
    const modeBtn = document.querySelector('[data-mode="' + currentMode + '"]');
    if (modeBtn) {
      document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
      modeBtn.classList.add('active');
    }
    const diffBtn = document.querySelector('[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    startQuiz();
  }

  function selectMode(mode) {
    if (window.KidsSound) KidsSound.tab();
    currentMode = mode;
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="' + mode + '"]').classList.add('active');
    KidUtils.saveScore('time', { mode });
    startQuiz();
  }

  function setDifficulty(level) {
    if (window.KidsSound) KidsSound.click();
    difficulty = level;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('is-on'));
    document.querySelector('[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('time', { difficulty: level });
    startQuiz();
  }

  function startQuiz() {
    questions = generateQuestions();
    currentQuestionIndex = 0;
    score = 0;
    answered = false;

    document.getElementById('score').textContent = '0';
    document.getElementById('total-q').textContent = questions.length;
    document.getElementById('quiz-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';

    createDots();
    showQuestion();
  }

  function generateQuestions() {
    const config = difficulties[difficulty];
    const qs = [];

    for (let i = 0; i < QUESTIONS_PER_QUIZ; i++) {
      if (currentMode === 'read') {
        qs.push(genReadQuestion(config));
      } else if (currentMode === 'match') {
        qs.push(genMatchQuestion(config));
      } else {
        qs.push(genElapsedQuestion(config));
      }
    }
    return qs;
  }

  function randMinute(roundTo) {
    if (roundTo >= 60) return 0;
    return Math.floor(Math.random() * (60 / roundTo)) * roundTo;
  }

  function formatTime12(h, m) {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const minStr = m === 0 ? 'o\'clock' : (m < 10 ? '0' + m : '' + m);
    if (m === 0) return hour12 + ' ' + minStr;
    return hour12 + ':' + (m < 10 ? '0' : '') + m + ' ' + period;
  }

  function formatTimeShort(h, m) {
    const hour12 = h % 12 || 12;
    return hour12 + ':' + (m < 10 ? '0' : '') + m;
  }

  function genReadQuestion(config) {
    const h = Math.floor(Math.random() * 12);
    const m = randMinute(config.roundTo);
    const correct = formatTime12(h, m);
    const wrongs = generateWrongTimes(h, m, config.roundTo, 3);
    return {
      type: 'read',
      hour: h,
      minute: m,
      question: 'What time is it?',
      correct,
      options: KidUtils.shuffleArray([correct, ...wrongs])
    };
  }

  function genMatchQuestion(config) {
    const h = Math.floor(Math.random() * 12);
    const m = randMinute(config.roundTo);
    const digital = formatTimeShort(h, m);
    const correct = digital;
    const wrongs = generateWrongTimes(h, m, config.roundTo, 3).map(t => {
      const parts = t.split(' ')[0].split(':');
      return parts[0] + ':' + parts[1];
    });
    return {
      type: 'match',
      hour: h,
      minute: m,
      question: 'Which digital time matches the clock?',
      correct,
      options: KidUtils.shuffleArray([correct, ...wrongs])
    };
  }

  function genElapsedQuestion(config) {
    const h = Math.floor(Math.random() * 12);
    const m = randMinute(config.roundTo);
    const addHours = Math.floor(Math.random() * config.elapsedMax) + 1;
    const totalMin = (h * 60 + m + addHours * 60) % (12 * 60);
    const newH = Math.floor(totalMin / 60);
    const newM = totalMin % 60;
    const correct = formatTime12(newH, newM);
    const wrongs = generateWrongTimes(newH, newM, config.roundTo, 3);
    return {
      type: 'elapsed',
      hour: h,
      minute: m,
      addHours,
      question: 'What time will it be in ' + addHours + ' hour' + (addHours > 1 ? 's' : '') + '?',
      correct,
      options: KidUtils.shuffleArray([correct, ...wrongs])
    };
  }

  function generateWrongTimes(h, m, roundTo, count) {
    const wrongs = new Set();
    let attempts = 0;
    while (wrongs.size < count && attempts < 50) {
      attempts++;
      let wh = h + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3));
      let wm = m + (Math.random() > 0.5 ? 1 : -1) * roundTo * (Math.floor(Math.random() * 3) + 1);
      if (wh < 0) wh += 12;
      if (wh >= 12) wh -= 12;
      if (wm < 0) wm += 60;
      if (wm >= 60) wm -= 60;
      if (roundTo < 60) wm = Math.round(wm / roundTo) * roundTo;
      if (wm >= 60) wm = 0;
      const wt = formatTime12(wh, wm);
      if (wt !== formatTime12(h, m)) wrongs.add(wt);
    }
    return Array.from(wrongs);
  }

  function createDots() {
    const container = document.getElementById('progress-dots');
    container.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'kid-dot';
      container.appendChild(dot);
    }
  }

  function showQuestion() {
    const q = questions[currentQuestionIndex];
    answered = false;
    document.getElementById('q-num').textContent = currentQuestionIndex + 1;
    document.getElementById('question').textContent = q.question;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';

    drawClock(q.hour, q.minute);

    const optContainer = document.getElementById('options');
    optContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kid-opt';
      btn.innerHTML = '<span class="kid-opt-letter">' + letters[index] + '</span> <span>' + option + '</span>';
      btn.addEventListener('click', () => selectAnswer(option, btn));
      optContainer.appendChild(btn);
    });
  }

  function drawClock(hour, minute) {
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) - 12;

    ctx.clearRect(0, 0, w, h);

    // Clock face
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#dfe6e9';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hour marks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI / 6) - Math.PI / 2;
      const innerR = r - 20;
      const outerR = r - 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.strokeStyle = '#2d3436';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Minute marks
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const angle = (i * Math.PI / 30) - Math.PI / 2;
      const innerR = r - 14;
      const outerR = r - 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.strokeStyle = '#b2bec3';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Numbers
    ctx.fillStyle = '#2d3436';
    ctx.font = 'bold 16px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
      const angle = (i * Math.PI / 6) - Math.PI / 2;
      const numR = r - 32;
      ctx.fillText('' + i, cx + Math.cos(angle) * numR, cy + Math.sin(angle) * numR);
    }

    // Hour hand
    const hourAngle = ((hour % 12) * 30 + minute * 0.5) * Math.PI / 180 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(hourAngle) * (r - 55), cy + Math.sin(hourAngle) * (r - 55));
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Minute hand
    const minuteAngle = minute * 6 * Math.PI / 180 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(minuteAngle) * (r - 25), cy + Math.sin(minuteAngle) * (r - 25));
    ctx.strokeStyle = '#e17055';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#2d3436';
    ctx.fill();
  }

  function selectAnswer(selected, btn) {
    if (answered) return;
    answered = true;
    if (window.KidsSound) KidsSound.click();

    const q = questions[currentQuestionIndex];
    const isCorrect = selected === q.correct;
    const options = document.querySelectorAll('.kid-opt');

    if (isCorrect) {
      btn.classList.add('is-correct');
      score++;
      document.getElementById('score').textContent = score;
      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects) {
        KidEffects.confetti();
        KidEffects.bumpScore(document.getElementById('score'));
      }
    } else {
      btn.classList.add('is-wrong');
      options.forEach(opt => {
        if (opt.textContent.includes(q.correct)) opt.classList.add('is-correct');
      });
      if (window.KidsSound) KidsSound.wrong();
    }

    options.forEach(opt => opt.disabled = true);

    const dots = document.querySelectorAll('.kid-dot');
    dots[currentQuestionIndex].classList.add(isCorrect ? 'ok' : 'bad');

    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'See results 🏆' : 'Next question ➡';
    nextBtn.focus();
  }

  function nextQuestion() {
    if (window.KidsSound) KidsSound.pop();
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
      showResults();
    } else {
      showQuestion();
    }
  }

  function showResults() {
    document.getElementById('quiz-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    const pct = (score / questions.length) * 100;

    if (pct === 100) {
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Time Master!';
      document.getElementById('result-message').textContent = 'Perfect! You got all ' + score + ' right! You can tell any time! 🌟';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 75) {
      document.getElementById('result-icon').textContent = '🎉';
      document.getElementById('result-title').textContent = 'Great clock reader!';
      document.getElementById('result-message').textContent = 'You got ' + score + ' out of ' + questions.length + '! Almost perfect! 🚀';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 50) {
      document.getElementById('result-icon').textContent = '👍';
      document.getElementById('result-title').textContent = 'Good job!';
      document.getElementById('result-message').textContent = 'You got ' + score + ' out of ' + questions.length + '. Keep practicing! 🕐';
      if (window.KidsSound) KidsSound.correct();
    } else {
      document.getElementById('result-icon').textContent = '💪';
      document.getElementById('result-title').textContent = 'Keep learning!';
      document.getElementById('result-message').textContent = 'You got ' + score + ' out of ' + questions.length + '. Time takes practice! 📚';
      if (window.KidsSound) KidsSound.pop();
    }

    const saved = KidUtils.loadScore('time');
    const bestScore = Math.max(saved.bestScore || 0, score);
    KidUtils.saveScore('time', { bestScore, mode: currentMode, difficulty });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
