(function () {
  'use strict';

  const QUESTIONS_PER_GAME = 10;

  // Pattern building blocks
  const emojiSets = [
    ['🔴', '🔵', '🟢', '🟡', '🟣'],
    ['⭐', '❤️', '🔵', '⭐', '❤️'],
    ['🐶', '🐱', '🐶', '🐱', '🐶'],
    ['🍎', '🍌', '🍇', '🍎', '🍌'],
    ['🌙', '☀️', '🌙', '☀️', '🌙'],
    ['🌸', '🌻', '🌷', '🌸', '🌻'],
    ['🦋', '🐛', '🦋', '🐛', '🦋'],
    ['🎵', '🎶', '🎵', '🎶', '🎵']
  ];

  const shapeColors = ['#ff7675', '#74b9ff', '#55efc4', '#fdcb6e', '#a29bfe', '#fd79a8'];
  const shapeTypes = ['circle', 'square', 'triangle', 'diamond', 'star'];

  // Pattern generators by difficulty
  const patternGenerators = {
    easy: [genAbabEmoji, genAbabColor, genCountUp, genAbabShape],
    medium: [genAbcAbcEmoji, genCountBy, genAabbShape, genAbcAbcColor],
    hard: [genAabbAabb, genSkipCount, genComplexEmoji, genFibonacciLike]
  };

  let difficulty = 'easy';
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;

  // --- Pattern Generators ---

  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function genAbabEmoji() {
    const set = rand(emojiSets.slice(0, 4));
    const a = set[0], b = set[1];
    const seq = [a, b, a, b, a];
    const answer = b;
    const wrongs = set.slice(2, 5).filter(x => x !== answer);
    return { type: 'emoji', seq, answer, options: shuffleWith([answer, ...wrongs.slice(0, 2)]), label: 'What comes next?' };
  }

  function genAbabColor() {
    const colors = KidUtils.shuffleArray(shapeColors).slice(2);
    const a = colors[0], b = colors[1];
    const seq = [a, b, a, b, a];
    const answer = b;
    const wrongs = shapeColors.filter(c => c !== a && c !== b).slice(0, 2);
    return { type: 'color', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'What color comes next?' };
  }

  function genAbabShape() {
    const shapes = KidUtils.shuffleArray(shapeTypes).slice(2);
    const a = shapes[0], b = shapes[1];
    const seq = [a, b, a, b, a];
    const answer = b;
    const wrongs = shapeTypes.filter(s => s !== a && s !== b).slice(0, 2);
    return { type: 'shape', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'What shape comes next?' };
  }

  function genCountUp() {
    const start = Math.floor(Math.random() * 5) + 1;
    const step = 1;
    const seq = [];
    for (let i = 0; i < 5; i++) seq.push(start + i * step);
    const answer = start + 5 * step;
    const wrongs = [answer + 1, answer - 2, answer + 2].filter(x => x > 0);
    return { type: 'number', seq, answer, options: shuffleWith([answer, ...wrongs.slice(0, 2)]), label: 'What number comes next?' };
  }

  function genAbcAbcEmoji() {
    const set = KidUtils.shuffleArray(emojiSets[0]).slice(0, 3);
    const [a, b, c] = set;
    const seq = [a, b, c, a, b];
    const answer = c;
    const wrongs = set.slice(3).length ? set.slice(3) : ['🟠', '⚫'];
    return { type: 'emoji', seq, answer, options: shuffleWith([answer, ...wrongs.slice(0, 3)]), label: 'What comes next?' };
  }

  function genAbcAbcColor() {
    const colors = KidUtils.shuffleArray(shapeColors).slice(0, 3);
    const [a, b, c] = colors;
    const seq = [a, b, c, a, b];
    const answer = c;
    const wrongs = shapeColors.filter(x => !colors.includes(x)).slice(0, 3);
    return { type: 'color', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'What color comes next?' };
  }

  function genCountBy() {
    const step = (Math.floor(Math.random() * 3) + 1) * 2; // 2, 4, 6
    const start = step;
    const seq = [];
    for (let i = 0; i < 5; i++) seq.push(start + i * step);
    const answer = start + 5 * step;
    const wrongs = [answer + step, answer - step, answer + 1];
    return { type: 'number', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'Count by ' + step + '. What comes next?' };
  }

  function genAabbShape() {
    const shapes = KidUtils.shuffleArray(shapeTypes).slice(0, 2);
    const [a, b] = shapes;
    const seq = [a, a, b, b, a];
    const answer = a;
    const wrongs = shapeTypes.filter(s => s !== a && s !== b).slice(0, 3);
    return { type: 'shape', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'What shape comes next?' };
  }

  function genAabbAabb() {
    const set = KidUtils.shuffleArray(emojiSets[0]).slice(0, 2);
    const [a, b] = set;
    const seq = [a, a, b, b, a, a];
    const answer = b;
    const wrongs = ['🟠', '⚫', '⚪'];
    return { type: 'emoji', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'What comes next?' };
  }

  function genSkipCount() {
    const step = Math.floor(Math.random() * 5) + 5; // 5-9
    const start = step;
    const seq = [];
    for (let i = 0; i < 5; i++) seq.push(start + i * step);
    const answer = start + 5 * step;
    const wrongs = [answer + step + 1, answer - 1, answer + step - 1];
    return { type: 'number', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'Skip count by ' + step + '. What comes next?' };
  }

  function genComplexEmoji() {
    const set = KidUtils.shuffleArray(emojiSets[4]).slice(0, 4);
    const [a, b, c, d] = set;
    const seq = [a, b, c, d, a];
    const answer = b;
    const wrongs = [c, d, set[0] || '🟠'];
    return { type: 'emoji', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'What comes next?' };
  }

  function genFibonacciLike() {
    const start = Math.floor(Math.random() * 3) + 1;
    const seq = [start, start, start + start, start + (start + start)];
    // next is sum of last two
    const answer = seq[seq.length - 1] + seq[seq.length - 2];
    const wrongs = [answer + 1, answer - 2, answer + 3];
    return { type: 'number', seq, answer, options: shuffleWith([answer, ...wrongs]), label: 'Add the last two numbers. What comes next?' };
  }

  function shuffleWith(arr) {
    return KidUtils.shuffleArray(arr);
  }

  // --- Game Logic ---

  function generateQuestions() {
    const generators = patternGenerators[difficulty] || patternGenerators.easy;
    questions = [];
    for (let i = 0; i < QUESTIONS_PER_GAME; i++) {
      const gen = rand(generators);
      questions.push(gen());
    }
  }

  function startGame() {
    generateQuestions();
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    document.getElementById('score').textContent = '0';
    document.getElementById('total-q').textContent = questions.length;
    document.getElementById('game-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    createDots();
    showQuestion();
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
    document.getElementById('label').textContent = q.label;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';

    // Render sequence
    const seqContainer = document.getElementById('pattern-sequence');
    seqContainer.innerHTML = '';

    q.seq.forEach((item, i) => {
      const el = document.createElement('span');
      el.className = 'pattern-item pattern-item-' + q.type;
      if (q.type === 'emoji') {
        el.textContent = item;
      } else if (q.type === 'color') {
        el.style.background = item;
      } else if (q.type === 'shape') {
        el.classList.add('pattern-shape', 'shape-' + item);
      } else if (q.type === 'number') {
        el.textContent = item;
      }
      el.style.animationDelay = (i * 0.08) + 's';
      seqContainer.appendChild(el);

      if (i < q.seq.length - 1) {
        const sep = document.createElement('span');
        sep.className = 'pattern-sep';
        sep.textContent = '→';
        seqContainer.appendChild(sep);
      }
    });

    // Render options
    const optContainer = document.getElementById('pattern-options');
    optContainer.innerHTML = '';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pattern-opt';

      if (q.type === 'emoji') {
        btn.innerHTML = '<span class="pattern-opt-inner">' + opt + '</span>';
      } else if (q.type === 'color') {
        btn.innerHTML = '<span class="pattern-opt-inner pattern-opt-color" style="background:' + opt + '"></span>';
      } else if (q.type === 'shape') {
        btn.innerHTML = '<span class="pattern-opt-inner pattern-shape shape-' + opt + '"></span>';
      } else if (q.type === 'number') {
        btn.innerHTML = '<span class="pattern-opt-inner pattern-opt-num">' + opt + '</span>';
      }

      btn.addEventListener('click', () => selectAnswer(opt, btn));
      btn.style.animationDelay = (i * 0.1 + 0.2) + 's';
      optContainer.appendChild(btn);
    });

    if (window.KidEffects) KidEffects.pop(seqContainer);
  }

  function selectAnswer(selected, btn) {
    if (answered) return;
    answered = true;
    if (window.KidsSound) KidsSound.click();

    const q = questions[currentQuestionIndex];
    const isCorrect = selected === q.answer;
    const allBtns = document.querySelectorAll('.pattern-opt');

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
      // Highlight correct answer
      allBtns.forEach(b => {
        const inner = b.querySelector('.pattern-opt-inner');
        if (inner) {
          const val = q.type === 'color' ? inner.style.background :
                      q.type === 'number' ? parseInt(inner.textContent) :
                      q.type === 'emoji' ? inner.textContent :
                      inner.className;
          if (matchesAnswer(val, q)) {
            b.classList.add('is-correct');
          }
        }
      });
      if (window.KidsSound) KidsSound.wrong();
    }

    allBtns.forEach(b => b.disabled = true);

    const dots = document.querySelectorAll('.kid-dot');
    dots[currentQuestionIndex].classList.add(isCorrect ? 'ok' : 'bad');

    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'See results 🏆' : 'Next question ➡';
    nextBtn.focus();
  }

  function matchesAnswer(val, q) {
    if (q.type === 'number') return val === q.answer;
    if (q.type === 'emoji') return val === q.answer;
    if (q.type === 'color') return val === q.answer;
    // shape - check class
    return val && val.includes('shape-' + q.answer);
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
    document.getElementById('game-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    const pct = (score / questions.length) * 100;
    let icon, title, message;

    if (pct === 100) {
      icon = '🏆';
      title = 'Perfect!';
      message = 'You got all ' + score + ' patterns right! You\'re a pattern genius! 🌟';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 80) {
      icon = '🎉';
      title = 'Amazing!';
      message = 'You got ' + score + ' out of ' + questions.length + '! Great pattern skills! 🚀';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 60) {
      icon = '👍';
      title = 'Good job!';
      message = 'You got ' + score + ' out of ' + questions.length + '. Keep practicing! 🔬';
      if (window.KidsSound) KidsSound.correct();
    } else {
      icon = '💪';
      title = 'Keep trying!';
      message = 'You got ' + score + ' out of ' + questions.length + '. Practice makes perfect! 📚';
      if (window.KidsSound) KidsSound.pop();
    }

    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;

    const saved = KidUtils.loadScore('pattern');
    const bestScore = Math.max(saved.bestScore || 0, score);
    KidUtils.saveScore('pattern', { bestScore, difficulty, lastScore: score });

    resultArea.setAttribute('aria-live', 'polite');
  }

  function setDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.kid-diff').forEach(b => b.classList.remove('is-on'));
    document.querySelector('.kid-diff[data-diff="' + level + '"]').classList.add('is-on');
    KidUtils.saveScore('pattern', { difficulty: level });
    startGame();
  }

  function init() {
    const saved = KidUtils.loadScore('pattern');
    if (saved.difficulty && patternGenerators[saved.difficulty]) {
      difficulty = saved.difficulty;
    }

    document.querySelectorAll('.kid-diff').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      startGame();
    });

    const diffBtn = document.querySelector('.kid-diff[data-diff="' + difficulty + '"]');
    if (diffBtn) {
      document.querySelectorAll('.kid-diff').forEach(b => b.classList.remove('is-on'));
      diffBtn.classList.add('is-on');
    }

    startGame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
