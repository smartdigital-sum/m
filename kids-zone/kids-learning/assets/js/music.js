(function () {
  'use strict';

  // Note frequencies (C4 to C5 + sharps)
  const notes = [
    { note: 'C4', freq: 261.63, key: 'a', label: 'C', type: 'white' },
    { note: 'C#4', freq: 277.18, key: 'w', label: 'C#', type: 'black' },
    { note: 'D4', freq: 293.66, key: 's', label: 'D', type: 'white' },
    { note: 'D#4', freq: 311.13, key: 'e', label: 'D#', type: 'black' },
    { note: 'E4', freq: 329.63, key: 'd', label: 'E', type: 'white' },
    { note: 'F4', freq: 349.23, key: 'f', label: 'F', type: 'white' },
    { note: 'F#4', freq: 369.99, key: 't', label: 'F#', type: 'black' },
    { note: 'G4', freq: 392.00, key: 'g', label: 'G', type: 'white' },
    { note: 'G#4', freq: 415.30, key: 'y', label: 'G#', type: 'black' },
    { note: 'A4', freq: 440.00, key: 'h', label: 'A', type: 'white' },
    { note: 'A#4', freq: 466.16, key: 'u', label: 'A#', type: 'black' },
    { note: 'B4', freq: 493.88, key: 'j', label: 'B', type: 'white' },
    { note: 'C5', freq: 523.25, key: 'k', label: 'C', type: 'white' }
  ];

  const whiteNotes = notes.filter(n => n.type === 'white');
  const blackNotes = notes.filter(n => n.type === 'black');

  const songs = [
    { name: 'Twinkle Twinkle', notes: ['C4','C4','G4','G4','A4','A4','G4','F4','F4','E4','E4','D4','D4','C4'] },
    { name: 'Mary Had a Little Lamb', notes: ['E4','D4','C4','D4','E4','E4','E4','D4','D4','D4','E4','G4','G4'] },
    { name: 'Happy Birthday', notes: ['C4','C4','D4','C4','F4','E4','C4','C4','D4','C4','G4','F4'] },
    { name: 'Hot Cross Buns', notes: ['E4','D4','C4','E4','D4','C4','C4','C4','C4','D4','D4','D4','E4','D4','C4'] },
    { name: 'Jingle Bells', notes: ['E4','E4','E4','E4','E4','E4','E4','G4','C4','D4','E4'] }
  ];

  let audioCtx = null;
  let currentMode = 'free';
  let currentSongIndex = 0;
  let songProgress = 0;
  let challengeRound = 1;
  let challengeScore = 0;
  let challengeSequence = [];
  let challengeInput = [];
  let challengeListening = false;
  let challengePlayback = false;

  function getAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playNote(noteObj, duration) {
    const ctx = getAudioCtx();
    const t0 = ctx.currentTime;
    const dur = duration || 0.4;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteObj.freq, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.15, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.08, t0 + dur * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);

    // Visual feedback
    animateKey(noteObj.note);
    showNote(noteObj.label);
  }

  function animateKey(noteName) {
    const key = document.querySelector('[data-note="' + noteName + '"]');
    if (!key) return;
    key.classList.add('piano-key-active');
    setTimeout(() => key.classList.remove('piano-key-active'), 300);
  }

  function showNote(label) {
    const display = document.getElementById('note-display');
    if (display) {
      display.textContent = label;
      display.classList.remove('note-pop');
      void display.offsetWidth;
      display.classList.add('note-pop');
    }
  }

  // --- Piano Building ---
  function buildPiano(whiteContainerId, blackContainerId) {
    const whiteContainer = document.getElementById(whiteContainerId);
    const blackContainer = document.getElementById(blackContainerId);
    if (!whiteContainer || !blackContainer) return;

    whiteContainer.innerHTML = '';
    blackContainer.innerHTML = '';

    const blackPositions = [1, 2, 4, 5, 6]; // which white keys have black keys after them
    let whiteIdx = 0;
    let blackIdx = 0;

    whiteNotes.forEach((n, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'piano-key piano-white';
      btn.dataset.note = n.note;
      btn.innerHTML = '<span class="piano-key-label">' + n.key.toUpperCase() + '</span>';
      btn.addEventListener('mousedown', () => playNote(n));
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(n); }, { passive: false });
      whiteContainer.appendChild(btn);

      // Add black key after this white key if applicable
      if (blackPositions.includes(i) && blackIdx < blackNotes.length) {
        const bn = blackNotes[blackIdx];
        const bbtn = document.createElement('button');
        bbtn.type = 'button';
        bbtn.className = 'piano-key piano-black';
        bbtn.dataset.note = bn.note;
        bbtn.innerHTML = '<span class="piano-key-label">' + bn.key.toUpperCase() + '</span>';
        bbtn.addEventListener('mousedown', () => playNote(bn));
        bbtn.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(bn); }, { passive: false });
        blackContainer.appendChild(bbtn);
        blackIdx++;
      }
    });
  }

  // --- Keyboard Input ---
  function handleKeyDown(e) {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    const noteObj = notes.find(n => n.key === key);
    if (noteObj) {
      playNote(noteObj);
      if (currentMode === 'learn') handleLearnInput(noteObj);
      if (currentMode === 'challenge' && challengeListening) handleChallengeInput(noteObj);
    }
  }

  function handlePianoClick(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.addEventListener('click', (e) => {
      const key = e.target.closest('.piano-key');
      if (!key) return;
      const noteName = key.dataset.note;
      const noteObj = notes.find(n => n.note === noteName);
      if (noteObj) {
        playNote(noteObj);
        if (currentMode === 'learn') handleLearnInput(noteObj);
        if (currentMode === 'challenge' && challengeListening) handleChallengeInput(noteObj);
      }
    });
  }

  // --- Mode Switching ---
  function selectMode(mode) {
    if (window.KidsSound) KidsSound.tab();
    currentMode = mode;
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-mode="' + mode + '"]').classList.add('active');

    document.getElementById('free-mode').style.display = mode === 'free' ? 'block' : 'none';
    document.getElementById('learn-mode').style.display = mode === 'learn' ? 'block' : 'none';
    document.getElementById('challenge-mode').style.display = mode === 'challenge' ? 'block' : 'none';

    if (mode === 'learn') loadSong(currentSongIndex);
    if (mode === 'challenge') startChallenge();
  }

  // --- Learn Mode ---
  function loadSong(index) {
    currentSongIndex = index % songs.length;
    const song = songs[currentSongIndex];
    songProgress = 0;

    document.getElementById('song-name').textContent = song.name;
    document.getElementById('song-progress').textContent = '0';
    document.getElementById('song-total').textContent = song.notes.length;
    document.getElementById('learn-message').className = 'kid-msg';
    document.getElementById('learn-message').textContent = '';

    renderGuidedNotes(song.notes, 'guided-notes');
  }

  function renderGuidedNotes(noteNames, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    noteNames.forEach((n, i) => {
      const el = document.createElement('span');
      el.className = 'music-note' + (i === 0 ? ' music-note-next' : '');
      el.textContent = n.replace('#', '♯');
      el.dataset.index = i;
      container.appendChild(el);
    });
  }

  function handleLearnInput(noteObj) {
    const song = songs[currentSongIndex];
    if (songProgress >= song.notes.length) return;

    const expected = song.notes[songProgress];
    if (noteObj.note === expected) {
      songProgress++;
      document.getElementById('song-progress').textContent = songProgress;

      const noteEls = document.querySelectorAll('#guided-notes .music-note');
      noteEls.forEach((el, i) => {
        el.classList.remove('music-note-next', 'music-note-correct');
        if (i < songProgress) el.classList.add('music-note-correct');
        if (i === songProgress) el.classList.add('music-note-next');
      });

      if (songProgress === song.notes.length) {
        const msg = document.getElementById('learn-message');
        msg.textContent = '🎉 Perfect! You played "' + song.name + '"! 🎉';
        msg.className = 'kid-msg is-correct';
        if (window.KidsSound) KidsSound.win();
        if (window.KidEffects) KidEffects.confetti();
      }
    }
  }

  function playSongDemo() {
    const song = songs[currentSongIndex];
    let delay = 0;
    song.notes.forEach(n => {
      const noteObj = notes.find(nobj => nobj.note === n);
      if (noteObj) {
        setTimeout(() => playNote(noteObj, 0.35), delay);
        delay += 400;
      }
    });
  }

  function nextSong() {
    if (window.KidsSound) KidsSound.click();
    loadSong(currentSongIndex + 1);
  }

  // --- Challenge Mode (Simon Says) ---
  function startChallenge() {
    challengeRound = 1;
    challengeScore = 0;
    document.getElementById('round-num').textContent = '1';
    document.getElementById('ch-score').textContent = '0';
    document.getElementById('challenge-message').className = 'kid-msg';
    document.getElementById('challenge-message').textContent = '';
    generateChallengeSequence();
  }

  function generateChallengeSequence() {
    challengeSequence = [];
    challengeInput = [];
    challengeListening = false;
    const length = Math.min(challengeRound + 2, 8);

    const available = whiteNotes.slice(0, 7); // C4 to B4
    for (let i = 0; i < length; i++) {
      challengeSequence.push(available[Math.floor(Math.random() * available.length)]);
    }

    renderGuidedNotes(challengeSequence.map(n => n.note), 'challenge-sequence');

    const msg = document.getElementById('challenge-message');
    msg.textContent = 'Press 👂 Listen to hear the melody!';
    msg.className = 'kid-msg';

    document.getElementById('challenge-prompt').textContent = 'Round ' + challengeRound + ' — Listen and repeat!';
  }

  function playChallengeSequence() {
    if (challengePlayback) return;
    challengePlayback = true;
    challengeListening = false;
    document.getElementById('listen-btn').disabled = true;

    const noteEls = document.querySelectorAll('#challenge-sequence .music-note');
    let delay = 0;

    challengeSequence.forEach((n, i) => {
      setTimeout(() => {
        playNote(n, 0.35);
        noteEls.forEach(el => el.classList.remove('music-note-active'));
        if (noteEls[i]) noteEls[i].classList.add('music-note-active');
      }, delay);
      delay += 450;
    });

    setTimeout(() => {
      noteEls.forEach(el => el.classList.remove('music-note-active'));
      challengePlayback = false;
      challengeListening = true;
      document.getElementById('listen-btn').disabled = false;
      const msg = document.getElementById('challenge-message');
      msg.textContent = 'Now you play! Tap the keys in order.';
      msg.className = 'kid-msg';
    }, delay + 200);
  }

  function handleChallengeInput(noteObj) {
    if (!challengeListening || challengePlayback) return;

    challengeInput.push(noteObj);
    const idx = challengeInput.length - 1;

    const noteEls = document.querySelectorAll('#challenge-sequence .music-note');
    if (idx < noteEls.length) {
      if (noteObj.note === challengeSequence[idx].note) {
        noteEls[idx].classList.add('music-note-correct');
      } else {
        noteEls[idx].classList.add('music-note-wrong');
      }
    }

    // Check if done
    if (challengeInput.length === challengeSequence.length) {
      challengeListening = false;
      const correct = challengeInput.every((n, i) => n.note === challengeSequence[i].note);

      if (correct) {
        challengeScore += challengeRound * 10;
        document.getElementById('ch-score').textContent = challengeScore;
        const msg = document.getElementById('challenge-message');
        msg.textContent = '🎉 Perfect! Get ready for round ' + (challengeRound + 1) + '! 🎉';
        msg.className = 'kid-msg is-correct';
        if (window.KidsSound) KidsSound.correct();
        if (window.KidEffects) {
          KidEffects.confetti();
          KidEffects.bumpScore(document.getElementById('ch-score'));
        }

        setTimeout(() => {
          challengeRound++;
          document.getElementById('round-num').textContent = challengeRound;
          generateChallengeSequence();
        }, 1500);
      } else {
        const msg = document.getElementById('challenge-message');
        msg.textContent = 'Not quite! Let\'s try that round again. 💪';
        msg.className = 'kid-msg is-wrong';
        if (window.KidsSound) KidsSound.wrong();
        setTimeout(() => generateChallengeSequence(), 1500);
      }
    }
  }

  // --- Init ---
  function init() {
    document.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => selectMode(btn.dataset.mode));
    });

    document.getElementById('play-song-btn').addEventListener('click', playSongDemo);
    document.getElementById('next-song-btn').addEventListener('click', nextSong);
    document.getElementById('listen-btn').addEventListener('click', playChallengeSequence);

    buildPiano('white-keys', 'black-keys');
    buildPiano('white-keys-learn', 'black-keys-learn');
    buildPiano('white-keys-challenge', 'black-keys-challenge');

    handlePianoClick('piano');
    handlePianoClick('piano-learn');
    handlePianoClick('piano-challenge');

    document.addEventListener('keydown', handleKeyDown);

    loadSong(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
