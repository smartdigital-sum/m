# Requirements Document

## Introduction

Khelona is a pure HTML/CSS/JS kids learning game website with six games: A-Z Speller, Color Match, Memory Match, Number Speller, Word Builder 1, and Word Builder 2. The target audience is being updated from ages 3–6 to ages 0–3 (toddlers). This document captures all improvements needed to make the site safer, more accessible, more age-appropriate, and more polished for that younger audience.

## Glossary

- **Homepage**: `index.html` — the landing page showing all game cards and the category filter.
- **Game Page**: Any of the six individual game HTML files under `games/`.
- **A-Z Speller**: `games/a-z-speller/index.html` — spell two words per letter, A through Z.
- **Color Match**: `games/color-match/index.html` — tap the correct color name for a displayed blob.
- **Memory Match**: `games/memory-match/index.html` — flip cards to find matching pairs.
- **Number Speller**: `games/number-speller/index.html` — spell the number word for a displayed digit.
- **Word Builder 1**: `games/word-builder-1/index.html` — spell 3-letter words from picture prompts (set 1).
- **Word Builder 2**: `games/word-builder-2/index.html` — spell 3-letter words from picture prompts (set 2).
- **Web Audio API**: The browser-native API used to synthesise sounds without external audio files.
- **Tap Target**: Any interactive element (button, tile, card) that a user taps or clicks.
- **Easy Mode**: A reduced-difficulty variant of a game intended for children under 3.
- **How-to-Play Tooltip**: A brief overlay shown on first launch of a game explaining the rules.
- **Difficulty Indicator**: A visual badge on a homepage game card showing Easy or Medium difficulty.

---

## Requirements

### Requirement 1: Homepage Age Badge Correction

**User Story:** As a parent, I want the homepage to accurately state the target age range, so that I can confirm the games are appropriate for my toddler.

#### Acceptance Criteria

1. THE Homepage SHALL display the age badge text as "Ages 0-3 Years" instead of "Ages 3-6 Years".

---

### Requirement 2: Back-to-Home Navigation on Every Game Page

**User Story:** As a toddler's caregiver, I want a clearly visible "Home" button on every game page, so that I can quickly return to the homepage without using browser controls.

#### Acceptance Criteria

1. THE A-Z Speller SHALL display a "🏠 Home" button that navigates to `../../index.html`.
2. THE Color Match SHALL display a "🏠 Home" button that navigates to `../../index.html`.
3. THE Memory Match SHALL display a "🏠 Home" button that navigates to `../../index.html`.
4. THE Number Speller SHALL display a "🏠 Home" button that navigates to `../../index.html`.
5. THE Word Builder 1 SHALL display a "🏠 Home" button that navigates to `../../index.html`.
6. THE Word Builder 2 SHALL display a "🏠 Home" button that navigates to `../../index.html`.
7. THE Home button on each Game Page SHALL be persistently visible (not hidden behind overlays or game state).

---

### Requirement 3: Tap Target Size for Toddler Fingers

**User Story:** As a toddler, I want interactive elements to be large enough for my fingers, so that I can tap them accurately without frustration.

#### Acceptance Criteria

1. THE A-Z Speller SHALL render each letter tile with a minimum width and height of 80px.
2. THE Color Match SHALL render each answer button with a minimum height of 80px.
3. THE Memory Match SHALL render each card with a minimum width and height of 80px.
4. THE Number Speller SHALL render each letter tile with a minimum width and height of 80px.
5. THE Word Builder 1 SHALL render each letter tile with a minimum width and height of 80px.
6. THE Word Builder 2 SHALL render each letter tile with a minimum width and height of 80px.

---

### Requirement 4: Audio Feedback via Web Audio API

**User Story:** As a toddler, I want to hear sounds when I interact with games, so that I receive immediate, engaging feedback that reinforces learning.

#### Acceptance Criteria

1. WHEN a letter tile is tapped in A-Z Speller, THE A-Z Speller SHALL play a short ascending tone using the Web Audio API.
2. WHEN a correct answer is given in any Game Page, THE Game Page SHALL play a praise sound (rising pitch sequence) using the Web Audio API.
3. WHEN an incorrect answer is given in any Game Page, THE Game Page SHALL play an error sound (descending tone) using the Web Audio API.
4. IF the browser AudioContext is in a suspended state, THEN THE Game Page SHALL resume the AudioContext before playing any sound.
5. THE audio feedback in all Game Pages SHALL be implemented using only the Web Audio API without requiring external audio files.

---

### Requirement 5: Age-Appropriate Word Replacement in A-Z Speller

**User Story:** As a toddler, I want to spell words I recognise from everyday life, so that the game feels familiar and achievable.

#### Acceptance Criteria

1. THE A-Z Speller SHALL replace the word "QUIZ" (letter Q) with a toddler-friendly word such as "QUACK" paired with emoji 🦆.
2. THE A-Z Speller SHALL replace the word "QUAIL" (letter Q) with a toddler-friendly word such as "QUEEN" paired with emoji 👑.
3. THE A-Z Speller SHALL replace the word "XRAY" (letter X) with a toddler-friendly word such as "XMAS" paired with emoji 🎄, and replace "XMAS" with "BOX" paired with emoji 📦, OR use two clearly recognisable X-words appropriate for toddlers.
4. THE A-Z Speller SHALL replace the word "URN" (letter U) with a toddler-friendly word such as "UP" paired with emoji ⬆️.
5. THE A-Z Speller SHALL replace the word "IVY" (letter I) with a toddler-friendly word such as "INK" paired with emoji 🖊️.
6. THE A-Z Speller SHALL replace the word "ELM" (letter E) with a toddler-friendly word such as "EEL" paired with emoji 🐍 or "EAR" paired with emoji 👂.
7. THE A-Z Speller SHALL replace the word "OAK" (letter O) with a toddler-friendly word such as "OAT" paired with emoji 🌾 or "ORB" paired with emoji 🔮.

---

### Requirement 6: Color Match — Remove 30-Second Timer (Relaxed Mode)

**User Story:** As a toddler, I want to play Color Match without a countdown timer, so that I can learn at my own pace without stress.

#### Acceptance Criteria

1. THE Color Match SHALL operate in an endless relaxed mode where the game does not end due to a timer expiring.
2. THE Color Match SHALL remove the visible timer ring and countdown display from the game UI.
3. WHEN a player runs out of lives in Color Match, THE Color Match SHALL end the game and display the final score.
4. THE Color Match SHALL retain the lives mechanic (3 lives) as the only loss condition.
5. THE Color Match end screen SHALL display the total number of correct answers achieved instead of a time-based score message.

---

### Requirement 7: A-Z Speller — Pick-a-Letter Mode

**User Story:** As a toddler (or caregiver), I want to choose a specific letter to practise, so that a short session can focus on one letter without completing the full A–Z sequence.

#### Acceptance Criteria

1. THE A-Z Speller start screen SHALL display a letter-picker grid showing all 26 letters.
2. WHEN a letter is selected from the picker, THE A-Z Speller SHALL begin gameplay at that letter.
3. THE A-Z Speller SHALL retain the existing sequential A→Z mode as an alternative start option labelled "Play All A→Z".
4. WHEN playing in pick-a-letter mode and both words for the chosen letter are completed, THE A-Z Speller SHALL show a completion screen for that letter and offer to pick another letter or play again.

---

### Requirement 8: Word Builder 1 & 2 — Replace Non-Toddler Words

**User Story:** As a toddler, I want to spell words I know from daily life, so that the picture-to-word connection is intuitive.

#### Acceptance Criteria

1. THE Word Builder 1 SHALL replace the word "JAR" with a toddler-friendly word such as "BAG" paired with emoji 👜.
2. THE Word Builder 1 SHALL replace the word "MAP" with a toddler-friendly word such as "MOP" paired with emoji 🧹.
3. THE Word Builder 2 SHALL replace the word "JAR" with a toddler-friendly word such as "BAG" paired with emoji 👜.
4. THE Word Builder 2 SHALL replace the word "MAP" with a toddler-friendly word such as "MOP" paired with emoji 🧹.

---

### Requirement 9: Memory Match — Easy Mode with Fewer Pairs

**User Story:** As a toddler under 3, I want a simpler version of Memory Match with fewer cards, so that the game is not overwhelming.

#### Acceptance Criteria

1. THE Memory Match SHALL offer an Easy Mode that uses 4 pairs (8 cards) instead of the default 8 pairs (16 cards).
2. THE Memory Match start or control area SHALL display a mode selector allowing the player to choose between "Easy (4 pairs)" and "Normal (8 pairs)".
3. WHEN Easy Mode is selected, THE Memory Match SHALL lay out the 8 cards in a 2×4 grid.
4. WHEN Normal Mode is selected, THE Memory Match SHALL lay out the 16 cards in a 4×4 grid.
5. THE Memory Match SHALL default to Easy Mode on first load.

---

### Requirement 10: How-to-Play Tooltip on First Launch

**User Story:** As a caregiver launching a game for the first time, I want a brief "How to Play" hint, so that I can quickly explain the game to my toddler.

#### Acceptance Criteria

1. WHEN a Game Page is opened for the first time in a browser session, THE Game Page SHALL display a "How to Play" overlay before the start screen or as part of the start screen.
2. THE How-to-Play overlay SHALL contain a short (≤3 sentences) plain-language description of the game rules.
3. WHEN the player taps the "Got it!" or equivalent dismiss button, THE Game Page SHALL hide the How-to-Play overlay and proceed to the normal start screen or game.
4. THE How-to-Play overlay SHALL not be shown again during the same browser session after it has been dismissed.

---

### Requirement 11: Difficulty Indicator on Homepage Game Cards

**User Story:** As a caregiver, I want to see a difficulty label on each game card, so that I can choose the most appropriate game for my child's current ability.

#### Acceptance Criteria

1. THE Homepage SHALL display a difficulty badge on each game card showing either "Easy" or "Medium".
2. THE difficulty badge for A-Z Speller SHALL read "Medium".
3. THE difficulty badge for Color Match SHALL read "Easy".
4. THE difficulty badge for Memory Match SHALL read "Easy".
5. THE difficulty badge for Number Speller SHALL read "Medium".
6. THE difficulty badge for Word Builder 1 SHALL read "Easy".
7. THE difficulty badge for Word Builder 2 SHALL read "Easy".
8. THE difficulty badge SHALL be visually distinct from the category badge already present on each card.

---

### Requirement 12: Memory Match — Full Game Implementation

**User Story:** As a toddler, I want to play Memory Match, so that I can practise matching pairs of pictures.

#### Acceptance Criteria

1. THE Memory Match SHALL render a functional game board with flippable cards.
2. WHEN two cards are flipped and they match, THE Memory Match SHALL mark them as matched and keep them face-up.
3. WHEN two cards are flipped and they do not match, THE Memory Match SHALL flip them face-down after a short delay.
4. WHEN all pairs are matched, THE Memory Match SHALL display a win screen.
5. THE Memory Match SHALL display a move counter that increments with each pair of cards flipped.
6. THE Memory Match SHALL support the Animals, Fruits, and Vehicles categories as defined in the existing game data.
7. THE Memory Match SHALL support English, Hindi, and Assamese language labels on cards.
