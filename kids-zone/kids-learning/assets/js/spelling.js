(function () {
  'use strict';

  const words = [
    { word: 'APPLE', category: 'Fruit', hint: 'A red or green fruit that keeps doctors away' },
    { word: 'BANANA', category: 'Fruit', hint: 'A long yellow fruit that monkeys love' },
    { word: 'ORANGE', category: 'Fruit', hint: 'A round citrus fruit, also a color' },
    { word: 'GRAPE', category: 'Fruit', hint: 'Small round fruits used to make wine' },
    { word: 'WATER', category: 'Nature', hint: 'We drink it every day; it falls from clouds' },
    { word: 'SUNNY', category: 'Nature', hint: 'The opposite of cloudy — bright and warm' },
    { word: 'FLOWER', category: 'Nature', hint: 'Plants have these; they smell nice' },
    { word: 'RAINBOW', category: 'Nature', hint: 'Appears after rain with many colors' },
    { word: 'HAPPY', category: 'Feelings', hint: 'The opposite of sad — feeling good' },
    { word: 'BRAVE', category: 'Feelings', hint: 'Not scared — being courageous' },
    { word: 'PLANET', category: 'Space', hint: 'Earth is one — we live on it' },
    { word: 'STAR', category: 'Space', hint: 'Shines in the night sky' },
    { word: 'MOON', category: 'Space', hint: 'Visible at night; orbits Earth' },
    { word: 'ROBOT', category: 'Technology', hint: 'A machine that can do tasks' },
    { word: 'SCHOOL', category: 'Places', hint: 'Where children go to learn' },
    { word: 'FRIEND', category: 'People', hint: 'Someone you play with' },
    { word: 'FAMILY', category: 'People', hint: 'Your mom, dad, brothers and sisters' },
    { word: 'GARDEN', category: 'Places', hint: 'Where flowers and vegetables grow' },
    { word: 'OCEAN', category: 'Nature', hint: 'Very big body of salt water' },
    { word: 'BUTTERFLY', category: 'Animals', hint: 'An insect with beautiful wings' }
  ];

  let currentWordIndex = 0;
  let currentAnswer = '';
  let correctCount = 0;
  let skipCount = 0;
  let shuffledWords = [];

  function initGame() {
    shuffledWords = KidUtils.shuffleArray(words);
    document.getElementById('total-words').textContent = shuffledWords.length;

    const saved = KidUtils.loadScore('spelling');
    correctCount = saved.correctCount || 0;
    skipCount = saved.skipCount || 0;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('skip-count').textContent = skipCount;

    loadWord();
  }

  function loadWord() {
    if (currentWordIndex >= shuffledWords.length) {
      currentWordIndex = 0;
      shuffledWords = KidUtils.shuffleArray(words);
    }
    const word = shuffledWords[currentWordIndex];
    document.getElementById('category').textContent = word.category;
    document.getElementById('hint').textContent = word.hint;
    currentAnswer = '';
    updateAnswerDisplay();
    createLetterButtons();
    const msg = document.getElementById('message');
    msg.className = 'kid-msg';
    msg.textContent = '';
    updateProgress();
  }

  function updateAnswerDisplay() {
    const word = shuffledWords[currentWordIndex];
    let display = '';
    for (let i = 0; i < word.word.length; i++) {
      display += currentAnswer[i] ? currentAnswer[i] + ' ' : '_ ';
    }
    document.getElementById('answer-display').textContent = display.trim();

    let mask = '';
    for (let j = 0; j < word.word.length; j++) {
      mask += '_ ';
    }
    document.getElementById('word-display').textContent = mask.trim();
  }

  function createLetterButtons() {
    const container = document.getElementById('letter-buttons');
    container.innerHTML = '';
    const word = shuffledWords[currentWordIndex];
    const allLetters = KidUtils.shuffleArray(word.word.split(''));
    let extraLetters = KidUtils.shuffleArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')).slice(0, 6);
    const letters = KidUtils.shuffleArray(allLetters.concat(extraLetters));

    letters.forEach((letter) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kid-letter';
      btn.textContent = letter;
      btn.setAttribute('aria-label', 'Letter ' + letter);
      btn.addEventListener('click', () => selectLetter(letter, btn));
      container.appendChild(btn);
    });
  }

  function selectLetter(letter, btn) {
    if (window.KidsSound) KidsSound.pop();
    btn.disabled = true;
    btn.classList.add('is-used');
    currentAnswer += letter;
    updateAnswerDisplay();
  }

  function undoLetter() {
    if (currentAnswer.length === 0) return;
    if (window.KidsSound) KidsSound.click();
    const lastLetter = currentAnswer[currentAnswer.length - 1];
    currentAnswer = currentAnswer.slice(0, -1);
    const buttons = document.querySelectorAll('.kid-letter');
    for (const btn of buttons) {
      if (btn.textContent === lastLetter && btn.disabled) {
        btn.disabled = false;
        btn.classList.remove('is-used');
        break;
      }
    }
    updateAnswerDisplay();
  }

  function checkAnswer() {
    if (window.KidsSound) KidsSound.click();
    const word = shuffledWords[currentWordIndex];
    const message = document.getElementById('message');

    if (currentAnswer === word.word) {
      correctCount++;
      document.getElementById('correct-count').textContent = correctCount;
      message.textContent = '🎉 Amazing! You spelled "' + word.word + '" correctly! 🎉';
      message.className = 'kid-msg is-correct';
      message.setAttribute('aria-live', 'polite');
      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects) {
        KidEffects.confetti();
        KidEffects.bumpScore(document.getElementById('correct-count'));
      }
      KidUtils.saveScore('spelling', { correctCount, skipCount });
      setTimeout(() => {
        currentWordIndex++;
        loadWord();
      }, 1500);
    } else {
      message.textContent = 'Not quite right! Keep trying! 💪';
      message.className = 'kid-msg is-wrong';
      message.setAttribute('aria-live', 'assertive');
      if (window.KidsSound) KidsSound.wrong();
      currentAnswer = '';
      updateAnswerDisplay();
      enableAllButtons();
    }
  }

  function skipWord() {
    if (window.KidsSound) KidsSound.tab();
    skipCount++;
    document.getElementById('skip-count').textContent = skipCount;
    const message = document.getElementById('message');
    const word = shuffledWords[currentWordIndex];
    message.textContent = 'The word was "' + word.word + '". Next one! 📚';
    message.className = 'kid-msg is-wrong';
    message.setAttribute('aria-live', 'polite');
    KidUtils.saveScore('spelling', { correctCount, skipCount });
    setTimeout(() => {
      currentWordIndex++;
      loadWord();
    }, 1500);
  }

  function enableAllButtons() {
    document.querySelectorAll('.kid-letter').forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove('is-used');
    });
  }

  function updateProgress() {
    document.getElementById('word-count').textContent = currentWordIndex;
    const progress = (currentWordIndex / shuffledWords.length) * 100;
    document.getElementById('progress').style.width = progress + '%';
  }

  function init() {
    document.getElementById('check-btn').addEventListener('click', checkAnswer);
    document.getElementById('skip-btn').addEventListener('click', skipWord);
    document.getElementById('undo-btn').addEventListener('click', undoLetter);
    initGame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
