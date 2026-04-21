"use strict";

// DOM Elements
const messageEl = document.querySelector(".message");
const targetEl = document.querySelector(".target");
const currentEl = document.querySelector(".current");
const btnAdd = document.querySelector(".btn-add");
const btnReset = document.querySelector(".btn-reset");
const gameEl = document.querySelector(".game");
const clickDisplayEl = document.querySelector(".click-display");
const difficultySelect = document.querySelector("#difficulty");
const winsEl = document.querySelector(".wins");
const lossesEl = document.querySelector(".losses");
const streakEl = document.querySelector(".streak");
const bestStreakEl = document.querySelector(".best-streak");
const btnInstructions = document.querySelector(".btn-instructions");
const btnUndo = document.querySelector(".btn-undo");
const btnHint = document.querySelector(".btn-hint");
const btnShare = document.querySelector(".btn-share");
const btnSettings = document.querySelector(".btn-settings");
const instructionsOverlay = document.getElementById("instructionsOverlay");
const settingsOverlay = document.getElementById("settingsOverlay");
const shareOverlay = document.getElementById("shareOverlay");
const btnCloseOverlay = document.querySelectorAll(".btn-close-overlay");
const shareTextEl = document.getElementById("shareText");
const btnShareTwitter = document.querySelector(".btn-share-twitter");
const btnShareFacebook = document.querySelector(".btn-share-facebook");
const btnCopyLink = document.querySelector(".btn-copy-link");
const soundToggle = document.getElementById("soundToggle");
const animationToggle = document.getElementById("animationToggle");
const themeSelect = document.getElementById("themeSelect");
const themeSwitch = document.getElementById("theme-switch");
const confettiContainer = document.getElementById("confettiContainer");

// Game state
let targetNumber;
let currentNumber;
let playing;
let score = {
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
};
let history = []; // For undo functionality
let lastStep = 0;
let settings = {
  sound: true,
  animations: true,
  theme: "default",
  lightTheme: false,
};

// Difficulty configurations
const difficulties = {
  easy: { targetMin: 5, targetMax: 15, stepMin: 1, stepMax: 3 },
  medium: { targetMin: 5, targetMax: 24, stepMin: 1, stepMax: 5 },
  hard: { targetMin: 10, targetMax: 30, stepMin: 1, stepMax: 7 },
};

// Initialize game
function init() {
  const difficulty = difficulties[difficultySelect.value];

  targetNumber =
    Math.trunc(
      Math.random() * (difficulty.targetMax - difficulty.targetMin + 1),
    ) + difficulty.targetMin;
  currentNumber = 0;
  playing = true;
  history = []; // Reset history on new game
  lastStep = 0;

  targetEl.textContent = targetNumber;
  currentEl.textContent = currentNumber;
  messageEl.textContent = "🎮 Start clicking to reach the target!";

  // Remove win/lose states
  gameEl.classList.remove("win", "lose");
  btnAdd.classList.remove("btn-disabled");
  btnAdd.style.pointerEvents = "auto";

  // Update button states
  updateButtonStates();

  // Apply animations setting
  if (!settings.animations) {
    document.documentElement.style.setProperty(
      "--animation-duration",
      "0.001ms",
    );
  } else {
    document.documentElement.style.removeProperty("--animation-duration");
  }

  // Apply theme
  applyTheme();

  // Clear confetti
  clearConfetti();
}

// Show click number animation
function showClickNumber(number) {
  if (settings.animations) {
    clickDisplayEl.classList.remove("show");
    clickDisplayEl.textContent = `+${number}`;

    // Trigger reflow to restart animation
    void clickDisplayEl.offsetWidth;

    clickDisplayEl.classList.add("show");
  }

  // Play sound if enabled
  if (settings.sound) {
    playClickSound();
  }
}

// Play sound effects
function playClickSound() {
  // Simple beep using Web Audio API
  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2,
    ); // Fade out

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    // Web Audio API not available, silently fail
  }
}

function playWinSound() {
  if (!settings.sound) return;

  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.frequency.value = 523.25; // C5
    oscillator2.frequency.value = 659.25; // E5
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator1.start();
    oscillator2.start();
    oscillator1.stop(audioContext.currentTime + 0.5);
    oscillator2.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Silently fail
  }
}

function playLoseSound() {
  if (!settings.sound) return;

  try {
    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 220; // A3
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3,
    );

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (e) {
    // Silently fail
  }
}

// Create confetti effect
function createConfetti() {
  if (!settings.animations) return;

  // Clear existing confetti
  clearConfetti();

  const colors = [
    [255, 99, 71],
    [60, 179, 113],
    [30, 144, 255],
    [221, 160, 221],
    [255, 215, 0],
    [255, 105, 180],
  ];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    // Random position
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = Math.random() * -20 + "vh";

    // Random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.background = `hsl(${Math.random() * 360}, 80%, 50%)`;

    // Random size
    const size = Math.random() * 8 + 5;
    confetti.style.width = size + "px";
    confetti.style.height = size + "px";

    // Random rotation and animation duration
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    confetti.style.animationDelay = Math.random() * 2 + "s";

    confettiContainer.appendChild(confetti);
  }
}

function clearConfetti() {
  confettiContainer.innerHTML = "";
}

// Update button states based on game state
function updateButtonStates() {
  btnUndo.disabled = history.length === 0 || !playing;
  btnHint.disabled = !playing;
  btnUndo.style.opacity = history.length === 0 || !playing ? "0.5" : "1";
  btnHint.style.opacity = !playing ? "0.5" : "1";
}

// Update score display
function updateScoreDisplay() {
  winsEl.textContent = score.wins;
  lossesEl.textContent = score.losses;
  streakEl.textContent = score.streak;
  bestStreakEl.textContent = score.bestStreak;
}

// Apply theme
function applyTheme() {
  // Remove all theme classes except theme-light (handled by toggle)
  document.body.classList.remove("theme-dark", "theme-ocean", "theme-forest");

  // Add selected theme
  if (settings.theme !== "default") {
    document.body.classList.add(`theme-${settings.theme}`);
  }

  // Sync toggle switch with theme
  if (themeSwitch) {
    // If theme is default (purple), toggle should be checked for light theme
    // Actually we need to think about this more carefully
    // For now, keep toggle state as is (it's managed by its own event listener)
  }
}

// Hint functionality
function showHint() {
  if (!playing) return;

  const difficulty = difficulties[difficultySelect.value];
  const possibleStep =
    Math.trunc(Math.random() * (difficulty.stepMax - difficulty.stepMin + 1)) +
    difficulty.stepMin;
  const potentialTotal = currentNumber + possibleStep;

  let hintMessage = "";
  if (potentialTotal === targetNumber) {
    hintMessage = `🎯 Next move could WIN! (+${possibleStep})`;
  } else if (potentialTotal > targetNumber) {
    hintMessage = `⚠️ Next move could LOSE! (+${possibleStep})`;
  } else {
    const remaining = targetNumber - potentialTotal;
    hintMessage = `✅ Next move: +${possibleStep} (${remaining} away)`;
  }

  messageEl.textContent = hintMessage;

  // Play hint sound if enabled
  if (settings.sound) {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 330; // E4
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {
      // Silently fail
    }
  }

  // Reset message after 2 seconds
  setTimeout(() => {
    if (playing) {
      messageEl.textContent = `✅ Added ${lastStep}! Keep going... (${targetNumber - currentNumber} away)`;
    }
  }, 2000);
}

// Handle undo
function undoLastMove() {
  if (!playing || history.length === 0) return;

  // Get last move from history
  const lastMove = history.pop();
  currentNumber = lastMove.current;
  lastStep = lastMove.step;

  currentEl.textContent = currentNumber;

  // Re-enable button if it was disabled
  btnAdd.classList.remove("btn-disabled");
  btnAdd.style.pointerEvents = "auto";

  // Update message
  messageEl.textContent = `↶ Undid last move (+${lastMove.step}). Current: ${currentNumber}`;

  // Update button states
  updateButtonStates();

  // Play undo sound
  if (settings.sound) {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 261.63; // Middle C
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (e) {
      // Silently fail
    }
  }
}

// Handle share functionality
function shareResult() {
  const resultMessage =
    score.wins > score.losses
      ? `I just won the Click Counter Game! 🎯 My score: ${score.wins}W/${score.losses}L`
      : `I played Click Counter Game! 📊 My score: ${score.wins}W/${score.losses}L`;

  shareTextEl.textContent = resultMessage;

  // Show share overlay
  settingsOverlay.classList.remove("active");
  shareOverlay.classList.add("active");
}

// Copy link to clipboard
function copyLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      const originalText = btnCopyLink.textContent;
      btnCopyLink.textContent = "Copied!";
      setTimeout(() => {
        btnCopyLink.textContent = originalText;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      btnCopyLink.textContent = "Failed!";
      setTimeout(() => {
        btnCopyLink.textContent = "Copy Link";
      }, 2000);
    });
}

// Initialize event listeners
function initEventListeners() {
  btnAdd.addEventListener("click", function () {
    if (!playing) return;

    const difficulty = difficulties[difficultySelect.value];
    const randomStep =
      Math.trunc(
        Math.random() * (difficulty.stepMax - difficulty.stepMin + 1),
      ) + difficulty.stepMin;

    // Save state for undo
    history.push({
      current: currentNumber,
      step: randomStep,
    });

    // Limit history to last 10 moves
    if (history.length > 10) {
      history.shift();
    }

    // Show the generated number
    showClickNumber(randomStep);

    currentNumber += randomStep;
    currentEl.textContent = currentNumber;
    lastStep = randomStep;

    if (currentNumber === targetNumber) {
      messageEl.textContent = `🎉 You Win! Perfect Hit! (+${randomStep})`;
      gameEl.classList.add("win");
      btnAdd.classList.add("btn-disabled");
      btnAdd.style.pointerEvents = "none";
      playing = false;

      // Update score
      score.wins++;
      score.streak++;
      if (score.streak > score.bestStreak) {
        score.bestStreak = score.streak;
      }

      updateScoreDisplay();

      // Play win sound and show confetti
      playWinSound();
      createConfetti();
    } else if (currentNumber > targetNumber) {
      messageEl.textContent = `💥 You Lost! Went over by ${currentNumber - targetNumber}! (+${randomStep})`;
      gameEl.classList.add("lose");
      btnAdd.classList.add("btn-disabled");
      btnAdd.style.pointerEvents = "none";
      playing = false;

      // Update score
      score.losses++;
      score.streak = 0;

      updateScoreDisplay();

      // Play lose sound
      playLoseSound();
    } else {
      const remaining = targetNumber - currentNumber;
      if (remaining <= 2) {
        messageEl.textContent = `⚠️ So close! ${remaining} away! (+${randomStep})`;
      } else {
        messageEl.textContent = `✅ Added ${randomStep}! Keep going... (${remaining} away)`;
      }
    }

    // Update button states
    updateButtonStates();
  });

  btnReset.addEventListener("click", init);

  btnInstructions.addEventListener("click", () => {
    settingsOverlay.classList.remove("active");
    shareOverlay.classList.remove("active");
    instructionsOverlay.classList.add("active");
  });

  btnUndo.addEventListener("click", undoLastMove);

  btnHint.addEventListener("click", showHint);

  btnShare.addEventListener("click", shareResult);

  btnSettings.addEventListener("click", () => {
    instructionsOverlay.classList.remove("active");
    shareOverlay.classList.remove("active");
    settingsOverlay.classList.add("active");

    // Set current settings in UI
    soundToggle.checked = settings.sound;
    animationToggle.checked = settings.animations;
    themeSelect.value = settings.theme;
  });

  btnCloseOverlay.forEach((btn) => {
    btn.addEventListener("click", () => {
      instructionsOverlay.classList.remove("active");
      settingsOverlay.classList.remove("active");
      shareOverlay.classList.remove("active");

      // Save settings when closing settings overlay
      if (settingsOverlay.classList.contains("active")) {
        settings.sound = soundToggle.checked;
        settings.animations = animationToggle.checked;
        settings.theme = themeSelect.value;

        // Apply settings immediately
        applyTheme();

        if (!settings.animations) {
          document.documentElement.style.setProperty(
            "--animation-duration",
            "0.001ms",
          );
        } else {
          document.documentElement.style.removeProperty("--animation-duration");
        }
      }
    });
  });

  btnShareTwitter.addEventListener("click", () => {
    const text = encodeURIComponent(shareTextEl.textContent);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  });

  btnShareFacebook.addEventListener("click", () => {
    const text = encodeURIComponent(shareTextEl.textContent);
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      "_blank",
    );
  });

  btnCopyLink.addEventListener("click", copyLink);

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && playing) {
      e.preventDefault();
      btnAdd.click();
    }
    if (e.code === "Enter") {
      btnReset.click();
    }
    if (e.code === "KeyU" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      btnUndo.click();
    }
    if (e.code === "KeyH" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      btnHint.click();
    }
    if (e.code === "KeyI" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      btnInstructions.click();
    }
    if (e.code === "KeyS" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      btnSettings.click();
    }
  });

  // Difficulty change resets game
  difficultySelect.addEventListener("change", init);

  // Theme toggle switch - toggles light/dark mode independently of theme select
  if (themeSwitch) {
    themeSwitch.addEventListener("change", function () {
      if (this.checked) {
        document.body.classList.add("theme-light");
      } else {
        document.body.classList.remove("theme-light");
      }
      // Save light theme preference
      settings.lightTheme = this.checked;
      localStorage.setItem("clickCounterSettings", JSON.stringify(settings));
    });

    // Initialize toggle state from saved settings
    if (settings.lightTheme) {
      themeSwitch.checked = true;
      document.body.classList.add("theme-light");
    } else {
      themeSwitch.checked = false;
      document.body.classList.remove("theme-light");
    }
  }
}

// Initialize everything
function initGame() {
  // Load settings from localStorage if available
  const savedSettings = localStorage.getItem("clickCounterSettings");
  if (savedSettings) {
    try {
      settings = JSON.parse(savedSettings);
    } catch (e) {
      console.error("Failed to parse settings:", e);
    }
  }

  // Load score from localStorage if available
  const savedScore = localStorage.getItem("clickCounterScore");
  if (savedScore) {
    try {
      score = JSON.parse(savedScore);
    } catch (e) {
      console.error("Failed to parse score:", e);
    }
  }

  updateScoreDisplay();
  init();
  initEventListeners();

  // Save settings and score periodically
  setInterval(() => {
    localStorage.setItem("clickCounterSettings", JSON.stringify(settings));
    localStorage.setItem("clickCounterScore", JSON.stringify(score));
  }, 5000);
}

// Start the game when DOM is loaded
document.addEventListener("DOMContentLoaded", initGame);

// Handle visibility change to pause/resume sounds if needed
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden, could pause any ongoing audio if needed
  }
});
