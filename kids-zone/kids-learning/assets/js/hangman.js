(function () {
  'use strict';

  const MAX_LIVES = 6;

  const wordBank = {
    animals: [
      { word: 'ELEPHANT', hint: 'Largest land animal' },
      { word: 'DOLPHIN', hint: 'Smart ocean mammal' },
      { word: 'PENGUIN', hint: 'Bird that swims but cannot fly' },
      { word: 'GIRAFFE', hint: 'Tallest animal on Earth' },
      { word: 'BUTTERFLY', hint: 'Insect with colorful wings' },
      { word: 'CHEETAH', hint: 'Fastest land animal' },
      { word: 'OCTOPUS', hint: 'Sea creature with 8 arms' },
      { word: 'PARROT', hint: 'Colorful bird that can talk' },
      { word: 'KANGAROO', hint: 'Hops and carries babies in a pouch' },
      { word: 'TURTLE', hint: 'Carries its home on its back' },
      { word: 'FLAMINGO', hint: 'Pink bird that stands on one leg' },
      { word: 'HAMSTER', hint: 'Small fluffy pet that runs on a wheel' }
    ],
    food: [
      { word: 'PIZZA', hint: 'Round, flat, and cheesy' },
      { word: 'BANANA', hint: 'Yellow curved fruit' },
      { word: 'CHOCOLATE', hint: 'Sweet brown treat' },
      { word: 'SANDWICH', hint: 'Food between two slices of bread' },
      { word: 'SPAGHETTI', hint: 'Long thin Italian noodles' },
      { word: 'PANCAKE', hint: 'Flat breakfast cake with syrup' },
      { word: 'WATERMELON', hint: 'Green outside, red inside summer fruit' },
      { word: 'COOKIE', hint: 'Sweet baked treat, often with chocolate chips' },
      { word: 'POPCORN', hint: 'Popped corn, great for movies' },
      { word: 'AVOCADO', hint: 'Green fruit used in guacamole' },
      { word: 'CUPCAKE', hint: 'Small cake in a paper cup' },
      { word: 'HAMBURGER', hint: 'Meat patty in a round bun' }
    ],
    places: [
      { word: 'AUSTRALIA', hint: 'Country with kangaroos' },
      { word: 'EGYPT', hint: 'Land of pyramids and pharaohs' },
      { word: 'JAPAN', hint: 'Island country with cherry blossoms' },
      { word: 'BRAZIL', hint: 'South American country, famous for carnival' },
      { word: 'FRANCE', hint: 'Home of the Eiffel Tower' },
      { word: 'CANADA', hint: 'Northern country with maple leaves' },
      { word: 'ICELAND', hint: 'Nordic island with volcanoes and hot springs' },
      { word: 'MEXICO', hint: 'Country known for tacos and sombreros' },
      { word: 'KOREA', hint: 'Asian peninsula, home of K-pop' },
      { word: 'KENYA', hint: 'African country famous for safaris' },
      { word: 'PERU', hint: 'South American country with Machu Picchu' },
      { word: 'GREECE', hint: 'Ancient civilization, home of the Olympics' }
    ]
  };

  let currentCategory = 'animals';
  let currentWord = '';
  let currentHint = '';
  let guessedLetters = [];
  let wrongLetters = [];
  let lives = MAX_LIVES;
  let wins = 0;
  let losses = 0;
  let streak = 0;
  let gameOver = false;
  let canvas, ctx;

  function init() {
    canvas = document.getElementById('hangman-canvas');
    ctx = canvas.getContext('2d');

    const saved = KidUtils.loadScore('hangman');
    wins = saved.wins || 0;
    losses = saved.losses || 0;
    streak = saved.streak || 0;
    if (saved.category && wordBank[saved.category]) {
      currentCategory = saved.category;
    }

    document.getElementById('wins').textContent = wins;
    document.getElementById('losses').textContent = losses;
    document.getElementById('streak').textContent = streak;

    document.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => selectCategory(btn.dataset.cat));
    });

    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('new-word-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      newGame();
    });
    document.getElementById('play-again-btn').addEventListener('click', () => {
      if (window.KidsSound) KidsSound.click();
      document.getElementById('result-area').classList.remove('is-show');
      document.getElementById('game-panel').style.display = 'block';
      newGame();
    });

    document.addEventListener('keydown', handleKeyPress);

    const catBtn = document.querySelector('[data-cat="' + currentCategory + '"]');
    if (catBtn) {
      document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
      catBtn.classList.add('active');
    }

    createKeyboard();
    newGame();
  }

  function selectCategory(cat) {
    if (window.KidsSound) KidsSound.tab();
    currentCategory = cat;
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-cat="' + cat + '"]').classList.add('active');
    KidUtils.saveScore('hangman', { category: cat });
    newGame();
  }

  function newGame() {
    const words = wordBank[currentCategory];
    const pick = words[Math.floor(Math.random() * words.length)];
    currentWord = pick.word;
    currentHint = pick.hint;
    guessedLetters = [];
    wrongLetters = [];
    lives = MAX_LIVES;
    gameOver = false;

    document.getElementById('message').className = 'kid-msg';
    document.getElementById('message').textContent = '';
    document.getElementById('category-label').textContent = 'Category: ' + capitalize(currentCategory);
    document.getElementById('wrong-letters').innerHTML = '';

    updateWordDisplay();
    updateLives();
    drawHangman();
    resetKeyboard();
  }

  function updateWordDisplay() {
    const display = currentWord.split('').map(letter => {
      if (guessedLetters.includes(letter)) return letter;
      return '_';
    }).join(' ');
    document.getElementById('word-display').textContent = display;
  }

  function updateLives() {
    const hearts = [];
    for (let i = 0; i < MAX_LIVES; i++) {
      hearts.push(i < lives ? '❤️' : '🖤');
    }
    document.getElementById('lives-display').textContent = hearts.join(' ');
  }

  function guessLetter(letter) {
    if (gameOver) return;
    if (guessedLetters.includes(letter) || wrongLetters.includes(letter)) return;

    if (window.KidsSound) KidsSound.click();

    if (currentWord.includes(letter)) {
      guessedLetters.push(letter);
      if (window.KidsSound) KidsSound.correct();
      updateWordDisplay();
      disableKey(letter, true);

      if (isWordComplete()) {
        winGame();
      }
    } else {
      wrongLetters.push(letter);
      lives--;
      if (window.KidsSound) KidsSound.wrong();
      updateLives();
      drawHangman();
      updateWrongLetters();
      disableKey(letter, false);

      if (lives <= 0) {
        loseGame();
      }
    }
  }

  function isWordComplete() {
    return currentWord.split('').every(letter => guessedLetters.includes(letter));
  }

  function winGame() {
    gameOver = true;
    wins++;
    streak++;
    document.getElementById('wins').textContent = wins;
    document.getElementById('streak').textContent = streak;

    const msg = document.getElementById('message');
    msg.textContent = '🎉 You got it! The word was "' + currentWord + '"! 🎉';
    msg.className = 'kid-msg is-correct';
    msg.setAttribute('aria-live', 'polite');

    if (window.KidsSound) KidsSound.win();
    if (window.KidEffects) {
      KidEffects.confetti();
      KidEffects.bumpScore(document.getElementById('wins'));
    }

    KidUtils.saveScore('hangman', { wins, losses, streak, category: currentCategory });

    setTimeout(() => showResult(true), 1500);
  }

  function loseGame() {
    gameOver = true;
    losses++;
    streak = 0;
    document.getElementById('losses').textContent = losses;
    document.getElementById('streak').textContent = streak;

    const msg = document.getElementById('message');
    msg.textContent = '💔 The word was "' + currentWord + '". Try again! 💪';
    msg.className = 'kid-msg is-wrong';
    msg.setAttribute('aria-live', 'polite');

    revealWord();

    if (window.KidsSound) KidsSound.wrong();

    KidUtils.saveScore('hangman', { wins, losses, streak, category: currentCategory });

    setTimeout(() => showResult(false), 2000);
  }

  function revealWord() {
    document.getElementById('word-display').textContent = currentWord.split(' ').join(' ');
  }

  function showResult(won) {
    document.getElementById('game-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    if (won) {
      document.getElementById('result-icon').textContent = '🏆';
      document.getElementById('result-title').textContent = 'Amazing!';
      document.getElementById('result-message').textContent =
        'You guessed "' + currentWord + '" with ' + (MAX_LIVES - lives) + ' wrong guess' + (MAX_LIVES - lives !== 1 ? 'es' : '') + '!';
    } else {
      document.getElementById('result-icon').textContent = '😢';
      document.getElementById('result-title').textContent = 'So close!';
      document.getElementById('result-message').textContent =
        'The word was "' + currentWord + '". You\'ll get it next time!';
    }
  }

  function showHint() {
    if (gameOver) return;
    if (window.KidsSound) KidsSound.pop();
    const msg = document.getElementById('message');
    msg.textContent = '💡 Hint: ' + currentHint;
    msg.className = 'kid-msg is-correct';
    msg.setAttribute('aria-live', 'polite');
  }

  function updateWrongLetters() {
    const container = document.getElementById('wrong-letters');
    container.innerHTML = wrongLetters.map(l =>
      '<span class="hangman-wrong-letter">' + l + '</span>'
    ).join('');
  }

  function disableKey(letter, correct) {
    const key = document.querySelector('.hangman-key[data-letter="' + letter + '"]');
    if (key) {
      key.disabled = true;
      key.classList.add(correct ? 'is-correct' : 'is-wrong');
    }
  }

  function resetKeyboard() {
    document.querySelectorAll('.hangman-key').forEach(key => {
      key.disabled = false;
      key.classList.remove('is-correct', 'is-wrong');
    });
  }

  function createKeyboard() {
    const container = document.getElementById('keyboard');
    container.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    letters.split('').forEach(letter => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hangman-key';
      btn.textContent = letter;
      btn.dataset.letter = letter;
      btn.setAttribute('aria-label', 'Letter ' + letter);
      btn.addEventListener('click', () => guessLetter(letter));
      container.appendChild(btn);
    });
  }

  function handleKeyPress(e) {
    if (gameOver) return;
    const letter = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letter)) {
      guessLetter(letter);
    }
  }

  // --- Hangman Drawing ---
  function drawHangman() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Base - always visible
    ctx.beginPath();
    ctx.moveTo(20, h - 20);
    ctx.lineTo(w - 20, h - 20);
    ctx.stroke();

    // Pole
    ctx.beginPath();
    ctx.moveTo(60, h - 20);
    ctx.lineTo(60, 30);
    ctx.stroke();

    // Top bar
    ctx.beginPath();
    ctx.moveTo(60, 30);
    ctx.lineTo(140, 30);
    ctx.stroke();

    // Rope
    ctx.beginPath();
    ctx.moveTo(140, 30);
    ctx.lineTo(140, 55);
    ctx.stroke();

    const wrongCount = MAX_LIVES - lives;

    // Head
    if (wrongCount >= 1) {
      ctx.beginPath();
      ctx.arc(140, 75, 20, 0, Math.PI * 2);
      ctx.stroke();

      if (wrongCount >= 6) {
        // Dead face
        ctx.beginPath();
        ctx.moveTo(132, 70);
        ctx.lineTo(138, 76);
        ctx.moveTo(138, 70);
        ctx.lineTo(132, 76);
        ctx.moveTo(142, 70);
        ctx.lineTo(148, 76);
        ctx.moveTo(148, 70);
        ctx.lineTo(142, 76);
        ctx.stroke();
        // Sad mouth
        ctx.beginPath();
        ctx.arc(140, 88, 6, Math.PI, 0);
        ctx.stroke();
      } else {
        // Eyes
        ctx.fillStyle = '#2d3436';
        ctx.beginPath();
        ctx.arc(133, 72, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(147, 72, 2, 0, Math.PI * 2);
        ctx.fill();
        // Smile
        ctx.beginPath();
        ctx.arc(140, 78, 6, 0, Math.PI);
        ctx.stroke();
      }
    }

    // Body
    if (wrongCount >= 2) {
      ctx.beginPath();
      ctx.moveTo(140, 95);
      ctx.lineTo(140, 160);
      ctx.stroke();
    }

    // Left arm
    if (wrongCount >= 3) {
      ctx.beginPath();
      ctx.moveTo(140, 115);
      ctx.lineTo(110, 145);
      ctx.stroke();
    }

    // Right arm
    if (wrongCount >= 4) {
      ctx.beginPath();
      ctx.moveTo(140, 115);
      ctx.lineTo(170, 145);
      ctx.stroke();
    }

    // Left leg
    if (wrongCount >= 5) {
      ctx.beginPath();
      ctx.moveTo(140, 160);
      ctx.lineTo(110, 200);
      ctx.stroke();
    }

    // Right leg (death)
    if (wrongCount >= 6) {
      ctx.beginPath();
      ctx.moveTo(140, 160);
      ctx.lineTo(170, 200);
      ctx.stroke();
      // X eyes already drawn above
    }

    // Support beam
    ctx.beginPath();
    ctx.moveTo(60, 60);
    ctx.lineTo(90, 30);
    ctx.stroke();
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
