(function () {
  'use strict';

  const QUESTIONS_PER_QUIZ = 8;

  const questions = {
    flags: [
      { flag: '🇺🇸', question: 'Which country has this flag?', correct: 'United States', options: ['United States', 'United Kingdom', 'Australia', 'France'] },
      { flag: '🇬🇧', question: 'Which country has this flag?', correct: 'United Kingdom', options: ['France', 'United Kingdom', 'Netherlands', 'Ireland'] },
      { flag: '🇯🇵', question: 'Which country has this flag?', correct: 'Japan', options: ['China', 'South Korea', 'Japan', 'Thailand'] },
      { flag: '🇧🇷', question: 'Which country has this flag?', correct: 'Brazil', options: ['Argentina', 'Mexico', 'Brazil', 'Colombia'] },
      { flag: '🇫🇷', question: 'Which country has this flag?', correct: 'France', options: ['Italy', 'France', 'Netherlands', 'Belgium'] },
      { flag: '🇦🇺', question: 'Which country has this flag?', correct: 'Australia', options: ['New Zealand', 'United Kingdom', 'Australia', 'Fiji'] },
      { flag: '🇩🇪', question: 'Which country has this flag?', correct: 'Germany', options: ['Belgium', 'Germany', 'Austria', 'Hungary'] },
      { flag: '🇮🇹', question: 'Which country has this flag?', correct: 'Italy', options: ['Italy', 'Ireland', 'Mexico', 'France'] },
      { flag: '🇨🇦', question: 'Which country has this flag?', correct: 'Canada', options: ['Canada', 'United States', 'United Kingdom', 'Australia'] },
      { flag: '🇮🇳', question: 'Which country has this flag?', correct: 'India', options: ['Pakistan', 'Thailand', 'India', 'Bangladesh'] },
      { flag: '🇨🇳', question: 'Which country has this flag?', correct: 'China', options: ['Japan', 'Vietnam', 'China', 'South Korea'] },
      { flag: '🇲🇽', question: 'Which country has this flag?', correct: 'Mexico', options: ['Italy', 'Mexico', 'Brazil', 'Ireland'] },
      { flag: '🇰🇷', question: 'Which country has this flag?', correct: 'South Korea', options: ['Japan', 'North Korea', 'South Korea', 'China'] },
      { flag: '🇪🇸', question: 'Which country has this flag?', correct: 'Spain', options: ['Portugal', 'Spain', 'Italy', 'Mexico'] },
      { flag: '🇿🇦', question: 'Which country has this flag?', correct: 'South Africa', options: ['Kenya', 'Nigeria', 'South Africa', 'Ghana'] },
      { flag: '🇷🇺', question: 'Which country has this flag?', correct: 'Russia', options: ['Serbia', 'Russia', 'Netherlands', 'France'] },
      { flag: '🇪🇬', question: 'Which country has this flag?', correct: 'Egypt', options: ['Iraq', 'Syria', 'Egypt', 'Yemen'] },
      { flag: '🇦🇷', question: 'Which country has this flag?', correct: 'Argentina', options: ['Uruguay', 'Argentina', 'Paraguay', 'Cuba'] },
      { flag: '🇸🇪', question: 'Which country has this flag?', correct: 'Sweden', options: ['Finland', 'Norway', 'Denmark', 'Sweden'] },
      { flag: '🇹🇭', question: 'Which country has this flag?', correct: 'Thailand', options: ['Costa Rica', 'Cuba', 'Thailand', 'North Korea'] }
    ],
    capitals: [
      { flag: '🇺🇸', question: 'What is the capital of the United States?', correct: 'Washington D.C.', options: ['New York', 'Washington D.C.', 'Los Angeles', 'Chicago'] },
      { flag: '🇬🇧', question: 'What is the capital of the United Kingdom?', correct: 'London', options: ['Manchester', 'London', 'Edinburgh', 'Birmingham'] },
      { flag: '🇫🇷', question: 'What is the capital of France?', correct: 'Paris', options: ['Lyon', 'Marseille', 'Paris', 'Nice'] },
      { flag: '🇯🇵', question: 'What is the capital of Japan?', correct: 'Tokyo', options: ['Osaka', 'Kyoto', 'Tokyo', 'Hiroshima'] },
      { flag: '🇦🇺', question: 'What is the capital of Australia?', correct: 'Canberra', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'] },
      { flag: '🇧🇷', question: 'What is the capital of Brazil?', correct: 'Brasília', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'] },
      { flag: '🇨🇦', question: 'What is the capital of Canada?', correct: 'Ottawa', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'] },
      { flag: '🇩🇪', question: 'What is the capital of Germany?', correct: 'Berlin', options: ['Munich', 'Hamburg', 'Berlin', 'Frankfurt'] },
      { flag: '🇮🇹', question: 'What is the capital of Italy?', correct: 'Rome', options: ['Milan', 'Venice', 'Rome', 'Florence'] },
      { flag: '🇪🇸', question: 'What is the capital of Spain?', correct: 'Madrid', options: ['Barcelona', 'Seville', 'Madrid', 'Valencia'] },
      { flag: '🇮🇳', question: 'What is the capital of India?', correct: 'New Delhi', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'] },
      { flag: '🇨🇳', question: 'What is the capital of China?', correct: 'Beijing', options: ['Shanghai', 'Beijing', 'Hong Kong', 'Guangzhou'] },
      { flag: '🇲🇽', question: 'What is the capital of Mexico?', correct: 'Mexico City', options: ['Guadalajara', 'Cancun', 'Mexico City', 'Monterrey'] },
      { flag: '🇪🇬', question: 'What is the capital of Egypt?', correct: 'Cairo', options: ['Alexandria', 'Cairo', 'Luxor', 'Giza'] },
      { flag: '🇷🇺', question: 'What is the capital of Russia?', correct: 'Moscow', options: ['Saint Petersburg', 'Moscow', 'Kiev', 'Novosibirsk'] },
      { flag: '🇰🇷', question: 'What is the capital of South Korea?', correct: 'Seoul', options: ['Busan', 'Seoul', 'Incheon', 'Daegu'] },
      { flag: '🇿🇦', question: 'What is the capital of South Africa?', correct: 'Pretoria', options: ['Cape Town', 'Johannesburg', 'Pretoria', 'Durban'] },
      { flag: '🇸🇪', question: 'What is the capital of Sweden?', correct: 'Stockholm', options: ['Gothenburg', 'Stockholm', 'Malmo', 'Uppsala'] },
      { flag: '🇹🇭', question: 'What is the capital of Thailand?', correct: 'Bangkok', options: ['Chiang Mai', 'Bangkok', 'Phuket', 'Pattaya'] },
      { flag: '🇦🇷', question: 'What is the capital of Argentina?', correct: 'Buenos Aires', options: ['Cordoba', 'Buenos Aires', 'Rosario', 'Mendoza'] }
    ],
    continents: [
      { flag: '🇺🇸', question: 'Which continent is the United States on?', correct: 'North America', options: ['North America', 'South America', 'Europe', 'Asia'] },
      { flag: '🇧🇷', question: 'Which continent is Brazil on?', correct: 'South America', options: ['North America', 'Africa', 'South America', 'Europe'] },
      { flag: '🇫🇷', question: 'Which continent is France on?', correct: 'Europe', options: ['Europe', 'Asia', 'North America', 'Africa'] },
      { flag: '🇯🇵', question: 'Which continent is Japan on?', correct: 'Asia', options: ['Europe', 'Asia', 'Oceania', 'North America'] },
      { flag: '🇦🇺', question: 'Which continent is Australia on?', correct: 'Oceania', options: ['Asia', 'Africa', 'Oceania', 'South America'] },
      { flag: '🇪🇬', question: 'Which continent is Egypt on?', correct: 'Africa', options: ['Asia', 'Europe', 'Africa', 'South America'] },
      { flag: '🇿🇦', question: 'Which continent is South Africa on?', correct: 'Africa', options: ['South America', 'Africa', 'Asia', 'Oceania'] },
      { flag: '🇨🇳', question: 'Which continent is China on?', correct: 'Asia', options: ['Europe', 'Asia', 'Africa', 'Oceania'] },
      { flag: '🇦🇷', question: 'Which continent is Argentina on?', correct: 'South America', options: ['North America', 'Europe', 'South America', 'Africa'] },
      { flag: '🇩🇪', question: 'Which continent is Germany on?', correct: 'Europe', options: ['Europe', 'Asia', 'North America', 'Africa'] },
      { flag: '🇮🇳', question: 'Which continent is India on?', correct: 'Asia', options: ['Africa', 'Europe', 'Asia', 'Oceania'] },
      { flag: '🇨🇦', question: 'Which continent is Canada on?', correct: 'North America', options: ['Europe', 'North America', 'Asia', 'South America'] },
      { flag: '🇲🇽', question: 'Which continent is Mexico on?', correct: 'North America', options: ['South America', 'North America', 'Central America', 'Europe'] },
      { flag: '🇰🇷', question: 'Which continent is South Korea on?', correct: 'Asia', options: ['Europe', 'Oceania', 'Asia', 'Africa'] },
      { flag: '🇪🇸', question: 'Which continent is Spain on?', correct: 'Europe', options: ['Europe', 'Africa', 'South America', 'Asia'] },
      { flag: '🇷🇺', question: 'Which continent is Russia on?', correct: 'Europe', options: ['Asia', 'Europe', 'North America', 'Europe/Asia'] },
      { flag: '🇹🇭', question: 'Which continent is Thailand on?', correct: 'Asia', options: ['Oceania', 'Africa', 'Asia', 'Europe'] },
      { flag: '🇸🇪', question: 'Which continent is Sweden on?', correct: 'Europe', options: ['North America', 'Europe', 'Asia', 'Africa'] },
      { flag: '🇳🇬', question: 'Which continent is Nigeria on?', correct: 'Africa', options: ['South America', 'Asia', 'Africa', 'Europe'] },
      { flag: '🇵🇪', question: 'Which continent is Peru on?', correct: 'South America', options: ['North America', 'Africa', 'South America', 'Asia'] }
    ]
  };

  let currentCategory = 'flags';
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;
  let answers = [];

  function selectCategory(category) {
    if (window.KidsSound) KidsSound.tab();
    currentCategory = category;
    document.querySelectorAll('.kid-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.kid-tab[data-cat="' + category + '"]').classList.add('active');
    startQuiz();
  }

  function startQuiz() {
    currentQuestions = KidUtils.shuffleArray(questions[currentCategory].slice()).slice(0, QUESTIONS_PER_QUIZ);
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    answers = [];

    document.getElementById('score').textContent = '0';
    document.getElementById('total-q').textContent = currentQuestions.length;
    document.getElementById('quiz-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');

    createDots();
    showQuestion();
  }

  function createDots() {
    const container = document.getElementById('progress-dots');
    container.innerHTML = '';
    for (let i = 0; i < currentQuestions.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'kid-dot';
      container.appendChild(dot);
    }
  }

  function showQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('q-num').textContent = currentQuestionIndex + 1;
    document.getElementById('question-flag').textContent = q.flag;
    document.getElementById('question').textContent = q.question;
    document.getElementById('next-btn').style.display = 'none';

    const optContainer = document.getElementById('options');
    optContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    const shuffledOpts = KidUtils.shuffleArray(q.options.slice());

    shuffledOpts.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kid-opt';
      btn.innerHTML = '<span class="kid-opt-letter">' + letters[index] + '</span> <span>' + option + '</span>';
      btn.addEventListener('click', () => selectAnswer(option, btn));
      optContainer.appendChild(btn);
    });

    answered = false;
    if (window.KidEffects) KidEffects.pop(document.querySelector('.geo-qbox'));
  }

  function selectAnswer(selected, btn) {
    if (answered) return;
    answered = true;
    if (window.KidsSound) KidsSound.click();

    const q = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.kid-opt');

    if (selected === q.correct) {
      btn.classList.add('is-correct');
      score++;
      document.getElementById('score').textContent = score;
      answers.push(true);
      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects) {
        KidEffects.confetti();
        KidEffects.bumpScore(document.getElementById('score'));
      }
    } else {
      btn.classList.add('is-wrong');
      options.forEach(opt => {
        if (opt.textContent.includes(q.correct)) opt.classList.add('is-correct');
      });
      answers.push(false);
      if (window.KidsSound) KidsSound.wrong();
    }

    options.forEach(opt => opt.disabled = true);

    const dots = document.querySelectorAll('.kid-dot');
    dots[currentQuestionIndex].classList.add(answers[currentQuestionIndex] ? 'ok' : 'bad');

    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'See results 🏆' : 'Next question ➡';
    nextBtn.focus();
  }

  function nextQuestion() {
    if (window.KidsSound) KidsSound.pop();
    currentQuestionIndex++;
    if (currentQuestionIndex >= currentQuestions.length) {
      showResults();
    } else {
      showQuestion();
    }
  }

  function showResults() {
    document.getElementById('quiz-panel').style.display = 'none';
    const resultArea = document.getElementById('result-area');
    resultArea.classList.add('is-show');

    const pct = (score / currentQuestions.length) * 100;
    let icon, title, message;

    if (pct === 100) {
      icon = '🏆';
      title = 'World Explorer!';
      message = 'Perfect! You got all ' + score + ' correct! You know the world well! 🌟';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 75) {
      icon = '🎉';
      title = 'Great traveler!';
      message = 'You got ' + score + ' out of ' + currentQuestions.length + '! Keep exploring! 🚀';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 50) {
      icon = '👍';
      title = 'Good start!';
      message = 'You got ' + score + ' out of ' + currentQuestions.length + '. Keep learning about the world! 🗺️';
      if (window.KidsSound) KidsSound.correct();
    } else {
      icon = '💪';
      title = 'Keep exploring!';
      message = 'You got ' + score + ' out of ' + currentQuestions.length + '. The world is big — keep studying! 📚';
      if (window.KidsSound) KidsSound.pop();
    }

    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;

    const saved = KidUtils.loadScore('geography');
    const bestScore = Math.max(saved.bestScore || 0, score);
    KidUtils.saveScore('geography', { bestScore, category: currentCategory, lastScore: score });

    resultArea.setAttribute('aria-live', 'polite');
  }

  function restartQuiz() {
    if (window.KidsSound) KidsSound.click();
    startQuiz();
  }

  function init() {
    document.querySelectorAll('.kid-tab').forEach(btn => {
      btn.addEventListener('click', () => selectCategory(btn.dataset.cat));
    });

    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);

    const saved = KidUtils.loadScore('geography');
    if (saved.category && questions[saved.category]) {
      currentCategory = saved.category;
      document.querySelectorAll('.kid-tab').forEach(btn => btn.classList.remove('active'));
      document.querySelector('.kid-tab[data-cat="' + currentCategory + '"]').classList.add('active');
    }

    startQuiz();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
