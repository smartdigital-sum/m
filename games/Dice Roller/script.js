document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const die1 = document.getElementById("die1");
  const die2 = document.getElementById("die2");
  const resultDiv = document.getElementById("result");
  const rollBtn = document.getElementById("rollBtn");
  const totalRollsSpan = document.getElementById("totalRolls");
  const lastSumSpan = document.getElementById("lastSum");
  const currentSumSpan = document.getElementById("currentSum");
  const historyList = document.getElementById("historyList");

  // Game state
  let totalRolls = 0;
  let lastSum = 0;
  let currentSum = 0;
  let rollHistory = [];
  const maxHistory = 10;

  // Dice dot patterns (grid positions 1-9)
  const patterns = {
    1: [5],
    2: [3, 7],
    3: [3, 5, 7],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };

  // Render dots on a die
  function renderDice(diceEl, value) {
    const dots = diceEl.querySelectorAll('.dot');
    dots.forEach((d, i) => {
      d.style.display = patterns[value].includes(i + 1) ? 'block' : 'none';
    });
  }

  // Color themes for different results
  const colors = {
    primary: "#6c5ce7",
    success: "#00b894",
    warning: "#fdcb6e",
    danger: "#e17055",
    info: "#0984e3",
  };

  // Initialize
  renderDice(die1, 1);
  renderDice(die2, 1);
  updateStats();

  // Roll dice function
  function rollDice() {
    // Add rolling animation
    die1.classList.add("rolling");
    die2.classList.add("rolling");

    // Disable button during animation
    rollBtn.disabled = true;
    rollBtn.style.opacity = "0.7";

    // Roll two dice after a short delay
    setTimeout(() => {
      const roll1 = Math.floor(Math.random() * 6) + 1;
      const roll2 = Math.floor(Math.random() * 6) + 1;

      // Update dice display with dots
      renderDice(die1, roll1);
      renderDice(die2, roll2);

      // Calculate sum
      const sum = roll1 + roll2;
      lastSum = sum;
      currentSum = sum;

      // Update stats
      totalRolls++;
      updateStats();

      // Add to history
      addToHistory(roll1, roll2, sum);

      // Show result message
      showResultMessage(roll1, roll2, sum);

      // Remove animation classes
      setTimeout(() => {
        die1.classList.remove("rolling");
        die2.classList.remove("rolling");
        rollBtn.disabled = false;
        rollBtn.style.opacity = "1";
      }, 300);
    }, 500);
  }

  // Update all statistics displays
  function updateStats() {
    totalRollsSpan.textContent = totalRolls;
    lastSumSpan.textContent = lastSum > 0 ? lastSum : "-";
    currentSumSpan.textContent = currentSum > 0 ? currentSum : "-";
  }

  // Add roll to history
  function addToHistory(roll1, roll2, sum) {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const historyItem = {
      roll1,
      roll2,
      sum,
      time: timeString,
      isDouble: roll1 === roll2,
      isLuckySeven: sum === 7,
      isSnakeEyes: sum === 2,
      isBoxcars: sum === 12,
    };

    rollHistory.unshift(historyItem);

    // Keep only last maxHistory items
    if (rollHistory.length > maxHistory) {
      rollHistory.pop();
    }

    updateHistoryDisplay();
  }

  // Update history list UI
  function updateHistoryDisplay() {
    historyList.innerHTML = "";

    rollHistory.forEach((item, index) => {
      const li = document.createElement("li");

      // Determine icon based on roll type
      let icon = "🎲";
      if (item.isDouble) icon = "🎯";
      if (item.isLuckySeven) icon = "🍀";
      if (item.isSnakeEyes || item.isBoxcars) icon = "🐍";

      li.innerHTML = `
                <span>${icon} ${item.roll1} + ${item.roll2} = <strong>${item.sum}</strong></span>
                <span class="history-time">${item.time}</span>
            `;

      // Add color coding
      if (item.isDouble) {
        li.style.borderLeftColor = colors.success;
      } else if (item.isLuckySeven) {
        li.style.borderLeftColor = colors.warning;
      } else if (item.isSnakeEyes || item.isBoxcars) {
        li.style.borderLeftColor = colors.danger;
      } else {
        li.style.borderLeftColor = colors.primary;
      }

      historyList.appendChild(li);
    });

    // If history is empty, show placeholder
    if (rollHistory.length === 0) {
      const li = document.createElement("li");
      li.textContent = 'No rolls yet. Click "Roll Dice" to start!';
      li.style.fontStyle = "italic";
      li.style.color = "#888";
      historyList.appendChild(li);
    }
  }

  // Show appropriate result message with styling
  function showResultMessage(roll1, roll2, sum) {
    let message = "";
    let color = colors.primary;

    if (roll1 === roll2) {
      message = `🎯 Doubles! You rolled two ${roll1}'s!`;
      color = colors.success;
    } else if (sum === 7) {
      message = `🍀 Lucky 7! You rolled ${roll1} and ${roll2}`;
      color = colors.warning;
    } else if (sum === 2) {
      message = `🐍 Snake Eyes! You rolled ${roll1} and ${roll2}`;
      color = colors.danger;
    } else if (sum === 12) {
      message = `🐍 Boxcars! You rolled ${roll1} and ${roll2}`;
      color = colors.danger;
    } else if (sum >= 10) {
      message = `👍 High roll! ${roll1} + ${roll2} = ${sum}`;
      color = colors.info;
    } else if (sum <= 4) {
      message = `👎 Low roll! ${roll1} + ${roll2} = ${sum}`;
      color = "#a29bfe";
    } else {
      message = `🎲 You rolled ${roll1} and ${roll2} (Total: ${sum})`;
      color = colors.primary;
    }

    resultDiv.textContent = message;
    resultDiv.style.color = color;
    resultDiv.style.backgroundColor = `${color}15`; // Very light tint
    resultDiv.style.padding = "15px";
    resultDiv.style.borderRadius = "10px";
    resultDiv.style.border = `1px solid ${color}30`;
  }

  // Event listeners
  rollBtn.addEventListener("click", rollDice);

  // Allow Enter and Space keys to roll
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!rollBtn.disabled) {
        rollBtn.click();

        // Add a quick visual feedback
        rollBtn.style.transform = "scale(0.95)";
        setTimeout(() => {
          rollBtn.style.transform = "";
        }, 150);
      }
    }
  });

  // Add hover effect to dice
  [die1, die2].forEach((die) => {
    die.addEventListener("mouseenter", function () {
      if (!this.classList.contains("rolling")) {
        this.style.transform = "scale(1.05)";
        this.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.4)";
      }
    });

    die.addEventListener("mouseleave", function () {
      if (!this.classList.contains("rolling")) {
        this.style.transform = "";
        this.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)";
      }
    });
  });

  // Initialize with a welcome message
  resultDiv.textContent = 'Click "Roll Dice" or press Enter/Space to start!';
  resultDiv.style.color = colors.primary;
  resultDiv.style.backgroundColor = "#f8f9fa";
  resultDiv.style.padding = "15px";
  resultDiv.style.borderRadius = "10px";
});
