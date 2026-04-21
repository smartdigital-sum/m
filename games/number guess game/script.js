document.addEventListener("DOMContentLoaded", function () {
  // Audio context for sound effects
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSound(type) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    switch (type) {
      case "guess":
        oscillator.frequency.value = 440;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
        break;
      case "high":
        oscillator.frequency.value = 300;
        oscillator.type = "square";
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
        break;
      case "low":
        oscillator.frequency.value = 200;
        oscillator.type = "square";
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
        break;
      case "win":
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.value = freq;
          osc.type = "sine";
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.3);
          osc.start(audioCtx.currentTime + i * 0.15);
          osc.stop(audioCtx.currentTime + i * 0.15 + 0.3);
        });
        break;
      case "lose":
        oscillator.frequency.value = 200;
        oscillator.type = "sawtooth";
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
        break;
    }
  }

  // Game state
  let secretNumber = Math.floor(Math.random() * 10) + 1;
  let attempts = 0;
  let gameActive = true;
  let difficulty = "easy";
  let timeAttackMode = false;
  let timeRemaining = 60;
  let timerInterval;
  let bestScore = localStorage.getItem("bestScore") || "-";
  let totalGames = parseInt(localStorage.getItem("totalGames") || "0");
  let wins = parseInt(localStorage.getItem("wins") || "0");

  const guessInput = document.getElementById("guessInput");
  const guessBtn = document.getElementById("guessBtn");
  const messageDiv = document.getElementById("message");
  const hintDiv = document.getElementById("hint");
  const resetBtn = document.getElementById("resetBtn");
  const giveUpBtn = document.getElementById("giveUpBtn");
  const difficultyBtns = document.querySelectorAll(".difficulty-btn");
  const themeToggle = document.getElementById("themeToggle");
  const timeAttackModeCheckbox = document.getElementById("timeAttackMode");
  const timerDisplay = document.getElementById("timerDisplay");
  const timerValue = document.getElementById("timerValue");
  const progressBar = document.getElementById("progressBar");
  const progressFill = progressBar.querySelector(".progress-fill");
  const historyDiv = document.getElementById("history");
  const bestScoreDisplay = document.getElementById("bestScore");
  const winRateDisplay = document.getElementById("winRate");

  // Update stats display
  function updateStats() {
    bestScoreDisplay.textContent = bestScore;
    if (totalGames > 0) {
      const winRate = Math.round((wins / totalGames) * 100);
      winRateDisplay.textContent = winRate;
    }
  }

  // Set difficulty
  function setDifficulty(level) {
    difficulty = level;
    let maxNum;
    switch (level) {
      case "easy":
        maxNum = 10;
        break;
      case "medium":
        maxNum = 50;
        break;
      case "hard":
        maxNum = 100;
        break;
    }
    guessInput.max = maxNum;
    guessInput.placeholder = `Enter your guess (1-${maxNum})`;
  }

  // Start timer for time attack mode
  function startTimer() {
    timeRemaining = 60;
    timerValue.textContent = timeRemaining;
    timerInterval = setInterval(() => {
      timeRemaining--;
      timerValue.textContent = timeRemaining;

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        gameOver(false, "Time up!");
      }
    }, 1000);
  }

  // Update progress bar
  function updateProgress(guess) {
    let maxNum;
    switch (difficulty) {
      case "easy":
        maxNum = 10;
        break;
      case "medium":
        maxNum = 50;
        break;
      case "hard":
        maxNum = 100;
        break;
    }
    const distance = Math.abs(guess - secretNumber);
    const percentage = Math.max(0, 100 - (distance / maxNum) * 100);
    progressFill.style.width = percentage + "%";
  }

  // Add guess to history
  function addGuessToHistory(guess, result) {
    const guessEl = document.createElement("div");
    guessEl.className = "history-item";
    guessEl.innerHTML = `
            <span class="guess-value">${guess}</span>
            <span class="guess-result">${result}</span>
        `;
    historyDiv.appendChild(guessEl);

    // Keep only last 5 guesses
    if (historyDiv.children.length > 5) {
      historyDiv.removeChild(historyDiv.firstChild);
    }
  }

  // Clear history
  function clearHistory() {
    historyDiv.innerHTML = "";
  }

  // Check guess
  function checkGuess() {
    if (!gameActive) return;

    const guess = parseInt(guessInput.value);

    // Validate input
    if (isNaN(guess) || guess < 1 || guess > guessInput.max) {
      messageDiv.textContent = "Please enter a valid number within the range";
      messageDiv.style.color = "red";
      return;
    }

    attempts++;
    playSound("guess");
    guessInput.value = "";
    guessInput.focus();

    // Clear previous hints
    hintDiv.textContent = "";

    if (guess === secretNumber) {
      playSound("win");
      gameOver(true, "Congratulations!");
    } else if (guess < secretNumber) {
      playSound("low");
      messageDiv.textContent = "Too low! Try a higher number. 🔼";
      messageDiv.style.color = "orange";
      hintDiv.textContent = `Attempt ${attempts}`;
      updateProgress(guess);
      addGuessToHistory(guess, "Too Low");
      guessInput.classList.add("shake");
      setTimeout(() => guessInput.classList.remove("shake"), 400);
    } else {
      playSound("high");
      messageDiv.textContent = "Too high! Try a lower number. 🔽";
      messageDiv.style.color = "orange";
      hintDiv.textContent = `Attempt ${attempts}`;
      updateProgress(guess);
      addGuessToHistory(guess, "Too High");
      guessInput.classList.add("shake");
      setTimeout(() => guessInput.classList.remove("shake"), 400);
    }
  }

  // Game over
  function gameOver(won, reason) {
    gameActive = false;
    clearInterval(timerInterval);
    guessInput.disabled = true;
    guessBtn.disabled = true;
    giveUpBtn.style.display = "none";
    resetBtn.style.display = "inline-block";

    if (won) {
      messageDiv.textContent = `${reason} You guessed the number in ${attempts} attempts! 🎉`;
      messageDiv.style.color = "green";

      // Final update to progress bar on win
      progressFill.style.width = "100%";

      // Update stats
      totalGames++;
      wins++;
      localStorage.setItem("totalGames", totalGames);
      localStorage.setItem("wins", wins);

      // Update best score
      if (bestScore === "-" || attempts < parseInt(bestScore)) {
        bestScore = attempts;
        localStorage.setItem("bestScore", bestScore);
      }

      // Confetti effect
      createConfetti();
    } else {
      playSound("lose");
      messageDiv.textContent = `${reason} The number was ${secretNumber}`;
      messageDiv.style.color = "red";
      totalGames++;
      localStorage.setItem("totalGames", totalGames);
    }

    updateStats();
  }

  // Create confetti effect
  function createConfetti() {
    const colors = [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
    ];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = Math.random() * 100 + "%";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  }

  // Reset game
  function resetGame() {
    gameActive = true;
    attempts = 0;
    timeAttackMode = timeAttackModeCheckbox.checked;

    // Clear UI
    messageDiv.textContent = "";
    messageDiv.style.color = "";
    hintDiv.textContent = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    guessInput.value = "";
    guessInput.focus();
    resetBtn.style.display = "none";
    giveUpBtn.style.display = "inline-block";
    clearHistory();
    progressFill.style.width = "0%";

    // Generate new number
    let maxNum;
    switch (difficulty) {
      case "easy":
        maxNum = 10;
        break;
      case "medium":
        maxNum = 50;
        break;
      case "hard":
        maxNum = 100;
        break;
    }
    secretNumber = Math.floor(Math.random() * maxNum) + 1;

    // Start timer if in time attack mode
    if (timeAttackMode) {
      timerDisplay.style.display = "block";
      startTimer();
    } else {
      timerDisplay.style.display = "none";
    }

    updateStats();
  }

  // Theme toggle
  function toggleTheme() {
    document.body.classList.toggle("dark-theme");
  }

  // Event listeners
  guessBtn.addEventListener("click", checkGuess);

  guessInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      checkGuess();
    }
  });

  resetBtn.addEventListener("click", resetGame);

  giveUpBtn.addEventListener("click", function () {
    playSound("lose");
    gameOver(false, "You gave up!");
  });

  // Difficulty buttons
  difficultyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      difficultyBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      setDifficulty(this.dataset.difficulty);
      resetGame(); // Restart game with new difficulty
    });
  });


  // Theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !gameActive) {
      resetGame();
    }
  });

  // Time attack mode
  timeAttackModeCheckbox.addEventListener("change", function () {
    if (this.checked) {
      timerDisplay.style.display = "block";
    } else {
      timerDisplay.style.display = "none";
    }
  });

  // Initialize
  updateStats();
  setDifficulty(difficulty);
});
