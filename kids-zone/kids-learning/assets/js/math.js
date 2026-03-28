(function () {
  'use strict';

  const difficulties = {
    easy: { addMax: 10, subMax: 10, mulMax: 5 },
    medium: { addMax: 20, subMax: 20, mulMax: 10 },
    hard: { addMax: 50, subMax: 50, mulMax: 12 }
  };

  const scores = {
    addition: { correct: 0, wrong: 0, num1: 0, num2: 0, answer: 0 },
    subtraction: { correct: 0, wrong: 0, num1: 0, num2: 0, answer: 0 },
    multiplication: { correct: 0, wrong: 0, num1: 0, num2: 0, answer: 0 }
  };

  let difficulty = 'medium';

  function getDifficulty() {
    return difficulties[difficulty] || difficulties.medium;
  }

  function showGame(type) {
    if (window.KidsSound) KidsSound.tab();
    document.querySelectorAll('.kid-game-area').forEach(a => a.classList.remove('is-active'));
    document.querySelectorAll('.kid-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(type + '-game').classList.add('is-active');
    document.querySelector('.kid-tab.' + type).classList.add('active');
    newProblem(type);
  }

  function newProblem(type) {
    if (window.KidsSound) KidsSound.pop();
    const input = document.getElementById(type + '-answer');
    input.value = '';
    input.focus();
    const message = document.getElementById(type + '-message');
    message.className = 'kid-msg';
    message.textContent = '';
    const limits = getDifficulty();

    const problemEl = document.getElementById(type + '-problem');
    if (type === 'addition') {
      scores.addition.num1 = Math.floor(Math.random() * limits.addMax) + 1;
      scores.addition.num2 = Math.floor(Math.random() * limits.addMax) + 1;
      scores.addition.answer = scores.addition.num1 + scores.addition.num2;
      problemEl.textContent = scores.addition.num1 + ' + ' + scores.addition.num2 + ' = ?';
    } else if (type === 'subtraction') {
      scores.subtraction.num1 = Math.floor(Math.random() * limits.subMax) + 6;
      scores.subtraction.num2 = Math.floor(Math.random() * (scores.subtraction.num1 - 1)) + 1;
      scores.subtraction.answer = scores.subtraction.num1 - scores.subtraction.num2;
      problemEl.textContent = scores.subtraction.num1 + ' − ' + scores.subtraction.num2 + ' = ?';
    } else if (type === 'multiplication') {
      scores.multiplication.num1 = Math.floor(Math.random() * limits.mulMax) + 1;
      scores.multiplication.num2 = Math.floor(Math.random() * limits.mulMax) + 1;
      scores.multiplication.answer = scores.multiplication.num1 * scores.multiplication.num2;
      problemEl.textContent = scores.multiplication.num1 + ' × ' + scores.multiplication.num2 + ' = ?';
    }
    if (window.KidEffects) KidEffects.pop(problemEl);
  }

  function checkAnswer(type) {
    if (window.KidsSound) KidsSound.click();
    const input = document.getElementById(type + '-answer');
    const userAnswer = parseInt(input.value, 10);
    const message = document.getElementById(type + '-message');

    if (isNaN(userAnswer)) {
      message.textContent = 'Please enter a number! 😊';
      message.className = 'kid-msg is-wrong';
      message.setAttribute('aria-live', 'assertive');
      if (window.KidsSound) KidsSound.wrong();
      return;
    }

    if (userAnswer === scores[type].answer) {
      scores[type].correct++;
      message.textContent = '🎉 Awesome! Correct! 🎉';
      message.className = 'kid-msg is-correct';
      message.setAttribute('aria-live', 'polite');
      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects) {
        KidEffects.confetti();
        KidEffects.bumpScore(document.getElementById(type + '-correct'));
      }
      KidUtils.saveScore('math', { [type + 'Correct']: scores[type].correct, [type + 'Wrong']: scores[type].wrong });
      setTimeout(() => newProblem(type), 1200);
    } else {
      scores[type].wrong++;
      message.textContent = 'Oops! The answer was ' + scores[type].answer + '! Try again! 💪';
      message.className = 'kid-msg is-wrong';
      message.setAttribute('aria-live', 'assertive');
      if (window.KidsSound) KidsSound.wrong();
      KidUtils.saveScore('math', { [type + 'Correct']: scores[type].correct, [type + 'Wrong']: scores[type].wrong });
    }

    document.getElementById(type + '-correct').textContent = scores[type].correct;
    document.getElementById(type + '-wrong').textContent = scores[type].wrong;
  }

  function setDifficulty(level) {
    difficulty = level;
    document.querySelectorAll('.kid-diff').forEach(b => b.classList.remove('is-on'));
    const btn = document.querySelector('.kid-diff[data-diff="' + level + '"]');
    if (btn) btn.classList.add('is-on');
    KidUtils.saveScore('math', { difficulty: level });
    newProblem('addition');
    newProblem('subtraction');
    newProblem('multiplication');
  }

  function init() {
    const saved = KidUtils.loadScore('math');
    if (saved.difficulty && difficulties[saved.difficulty]) {
      difficulty = saved.difficulty;
    }

    ['addition', 'subtraction', 'multiplication'].forEach(type => {
      if (saved[type + 'Correct']) scores[type].correct = saved[type + 'Correct'];
      if (saved[type + 'Wrong']) scores[type].wrong = saved[type + 'Wrong'];
      document.getElementById(type + '-correct').textContent = scores[type].correct;
      document.getElementById(type + '-wrong').textContent = scores[type].wrong;
    });

    document.querySelectorAll('.kid-tab').forEach(btn => {
      btn.addEventListener('click', () => showGame(btn.dataset.type));
    });

    document.querySelectorAll('.kid-diff').forEach(btn => {
      btn.addEventListener('click', () => setDifficulty(btn.dataset.diff));
    });

    document.querySelectorAll('.kid-btn-check').forEach(btn => {
      btn.addEventListener('click', () => checkAnswer(btn.dataset.type));
    });

    document.querySelectorAll('.kid-btn-new').forEach(btn => {
      btn.addEventListener('click', () => newProblem(btn.dataset.type));
    });

    document.querySelectorAll('.kid-input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer(input.dataset.type);
      });
    });

    const diffBtn = document.querySelector('.kid-diff[data-diff="' + difficulty + '"]');
    if (diffBtn) diffBtn.classList.add('is-on');

    newProblem('addition');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
