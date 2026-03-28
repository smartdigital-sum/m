(function () {
  'use strict';

  const riddles = [
    { q: 'What has hands but cannot clap?', a: 'A clock', wrong: ['A statue', 'A robot', 'A doll'] },
    { q: 'What has a face but no body?', a: 'A clock', wrong: ['A painting', 'A mirror', 'A coin'] },
    { q: 'What gets wetter the more it dries?', a: 'A towel', wrong: ['A sponge', 'Rain', 'A river'] },
    { q: 'What has legs but cannot walk?', a: 'A table', wrong: ['A snake', 'A chair', 'A bed'] },
    { q: 'What can you catch but not throw?', a: 'A cold', wrong: ['A ball', 'A fish', 'A star'] },
    { q: 'What has teeth but cannot bite?', a: 'A comb', wrong: ['A saw', 'A zipper', 'A gear'] },
    { q: 'What goes up but never comes down?', a: 'Your age', wrong: ['A balloon', 'Smoke', 'A rocket'] },
    { q: 'What has ears but cannot hear?', a: 'Corn', wrong: ['A statue', 'A wall', 'A picture'] },
    { q: 'What can travel around the world while staying in a corner?', a: 'A stamp', wrong: ['A map', 'A compass', 'A globe'] },
    { q: 'What has a neck but no head?', a: 'A bottle', wrong: ['A giraffe', 'A shirt', 'A guitar'] },
    { q: 'What runs but never walks?', a: 'Water', wrong: ['A dog', 'A clock', 'A car'] },
    { q: 'What has one eye but cannot see?', a: 'A needle', wrong: ['A cyclops', 'A storm', 'A camera'] },
    { q: 'What is full of holes but still holds water?', a: 'A sponge', wrong: ['A net', 'A bucket', 'A colander'] },
    { q: 'What can you break without touching it?', a: 'A promise', wrong: ['Glass', 'An egg', 'A bone'] },
    { q: 'What has a thumb and four fingers but is not alive?', a: 'A glove', wrong: ['A hand', 'A puppet', 'A statue'] },
    { q: 'What is always coming but never arrives?', a: 'Tomorrow', wrong: ['A bus', 'Rain', 'Spring'] },
    { q: 'What has words but never speaks?', a: 'A book', wrong: ['A phone', 'A sign', 'A computer'] },
    { q: 'What can fill a room but takes up no space?', a: 'Light', wrong: ['Air', 'Music', 'A ghost'] },
    { q: 'What gets smaller the more you put in it?', a: 'A hole', wrong: ['A bag', 'A box', 'A jar'] },
    { q: 'What has a spine but no bones?', a: 'A book', wrong: ['A fish', 'A cactus', 'A leaf'] }
  ];

  const PER_GAME = 10;
  let questions = [];
  let idx = 0;
  let score = 0;
  let answered = false;

  function init() {
    document.getElementById('next-btn').addEventListener('click', nextQ);
    document.getElementById('restart-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      startGame();
    });
    startGame();
  }

  function startGame() {
    questions = KidUtils.shuffleArray(riddles.slice()).slice(0, PER_GAME);
    idx = 0;
    score = 0;
    answered = false;
    document.getElementById('score').textContent = '0';
    document.getElementById('total-q').textContent = questions.length;
    document.getElementById('quiz-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    createDots();
    showQ();
  }

  function createDots() {
    const c = document.getElementById('progress-dots');
    c.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
      const d = document.createElement('div');
      d.className = 'kid-dot';
      c.appendChild(d);
    }
  }

  function showQ() {
    const q = questions[idx];
    answered = false;
    document.getElementById('q-num').textContent = idx + 1;
    document.getElementById('riddle-icon').textContent = '🤔';
    document.getElementById('riddle-text').textContent = q.q;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';

    const optC = document.getElementById('options');
    optC.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    const opts = KidUtils.shuffleArray([q.a, ...q.wrong]);
    opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kid-opt';
      btn.innerHTML = '<span class="kid-opt-letter">' + letters[i] + '</span> <span>' + opt + '</span>';
      btn.addEventListener('click', () => selectAnswer(opt, btn));
      optC.appendChild(btn);
    });
  }

  function selectAnswer(selected, btn) {
    if (answered) return;
    answered = true;
    if (window.KidsSound) KidsSound.click();

    const q = questions[idx];
    const isCorrect = selected === q.a;
    const options = document.querySelectorAll('.kid-opt');

    if (isCorrect) {
      btn.classList.add('is-correct');
      score++;
      document.getElementById('score').textContent = score;
      document.getElementById('riddle-icon').textContent = '😄';
      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects) KidEffects.confetti();
    } else {
      btn.classList.add('is-wrong');
      document.getElementById('riddle-icon').textContent = '😅';
      options.forEach(o => {
        if (o.textContent.includes(q.a)) o.classList.add('is-correct');
      });
      if (window.KidsSound) KidsSound.wrong();
    }

    options.forEach(o => o.disabled = true);
    const dots = document.querySelectorAll('.kid-dot');
    dots[idx].classList.add(isCorrect ? 'ok' : 'bad');
    const nb = document.getElementById('next-btn');
    nb.style.display = 'block';
    nb.textContent = idx === questions.length - 1 ? 'See results 🏆' : 'Next riddle ➡';
    nb.focus();
  }

  function nextQ() {
    if (window.KidsSound) KidsSound.pop();
    idx++;
    if (idx >= questions.length) showResults();
    else showQ();
  }

  function showResults() {
    document.getElementById('quiz-panel').style.display = 'none';
    const ra = document.getElementById('result-area');
    ra.classList.add('is-show');
    const pct = (score / questions.length) * 100;
    if (pct === 100) {
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Riddle Master!';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 60) {
      document.getElementById('result-icon').textContent = '🎉';
      document.getElementById('result-title').textContent = 'Sharp mind!';
      if (window.KidsSound) KidsSound.win();
    } else {
      document.getElementById('result-icon').textContent = '💪';
      document.getElementById('result-title').textContent = 'Keep thinking!';
      if (window.KidsSound) KidsSound.pop();
    }
    document.getElementById('result-message').textContent = 'You solved ' + score + ' out of ' + questions.length + ' riddles!';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
