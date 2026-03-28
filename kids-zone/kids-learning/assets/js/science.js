(function () {
  'use strict';

  const questions = {
    animals: [
      { question: 'What is the largest animal in the world?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Shark'], correct: 1, icon: '🐋' },
      { question: 'How many legs does a spider have?', options: ['6', '8', '10', '4'], correct: 1, icon: '🕷️' },
      { question: 'What do you call a baby dog?', options: ['Puppy', 'Kitten', 'Cub', 'Foal'], correct: 0, icon: '🐕' },
      { question: "Which animal is known as the 'King of the Jungle'?", options: ['Tiger', 'Elephant', 'Lion', 'Bear'], correct: 2, icon: '🦁' },
      { question: 'What do you call a baby cat?', options: ['Pup', 'Kitten', 'Calf', 'Joey'], correct: 1, icon: '🐱' },
      { question: 'Which bird cannot fly but can swim?', options: ['Eagle', 'Parrot', 'Penguin', 'Owl'], correct: 2, icon: '🐧' },
      { question: 'What is the fastest land animal?', options: ['Lion', 'Cheetah', 'Leopard', 'Horse'], correct: 1, icon: '🐆' },
      { question: 'How many hearts does an octopus have?', options: ['1', '2', '3', '4'], correct: 2, icon: '🐙' }
    ],
    nature: [
      { question: 'What do plants need to make their own food?', options: ['Sunlight', 'Moonlight', 'Stars', 'Lamp'], correct: 0, icon: '☀️' },
      { question: 'What causes rain?', options: ['Magic', 'Water evaporating and condensing', 'Clouds being sad', 'Wind'], correct: 1, icon: '🌧️' },
      { question: 'What is the tallest thing on Earth?', options: ['Mountain', 'Building', 'Tree', 'Statue'], correct: 2, icon: '🌲' },
      { question: 'Which season comes after Spring?', options: ['Winter', 'Fall', 'Summer', 'Autumn'], correct: 2, icon: '🌻' },
      { question: 'What gas do plants breathe in?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'], correct: 1, icon: '🌱' },
      { question: 'What is a rainbow?', options: ['A bridge', 'Light bending through water', 'A snake in the sky', 'Clouds painted'], correct: 1, icon: '🌈' },
      { question: 'What type of rock is formed from lava?', options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Crystal'], correct: 2, icon: '🌋' },
      { question: 'What happens to water when it gets very cold?', options: ['It disappears', 'It turns to ice', 'It becomes gas', 'It gets bigger'], correct: 1, icon: '❄️' }
    ],
    space: [
      { question: 'What planet do we live on?', options: ['Mars', 'Earth', 'Venus', 'Jupiter'], correct: 1, icon: '🌍' },
      { question: 'What is the closest star to Earth?', options: ['Polaris', 'Sirius', 'The Sun', 'Alpha Centauri'], correct: 2, icon: '☀️' },
      { question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correct: 1, icon: '🪐' },
      { question: 'What shape is the Earth?', options: ['Flat', 'Square', 'Circle', 'Sphere'], correct: 3, icon: '🌐' },
      { question: 'What travels around the Earth?', options: ['The Sun', 'The Moon', 'Stars', 'Comets'], correct: 1, icon: '🌙' },
      { question: 'Which planet has rings around it?', options: ['Mars', 'Venus', 'Saturn', 'Mercury'], correct: 2, icon: '💫' },
      { question: 'What is the largest planet in our solar system?', options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], correct: 2, icon: '🪐' },
      { question: 'What do you call a person who goes to space?', options: ['Pilot', 'Astronaut', 'Captain', 'Explorer'], correct: 1, icon: '👨‍🚀' }
    ]
  };

  let currentCategory = 'animals';
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let answered = false;
  let answers = [];
  const QUESTIONS_PER_QUIZ = 5;

  function selectCategory(category) {
    if (window.KidsSound) KidsSound.tab();
    currentCategory = category;
    document.querySelectorAll('.kid-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.kid-tab.' + category).classList.add('active');
    startQuiz();
  }

  function startQuiz() {
    currentQuestions = KidUtils.shuffleArray(questions[currentCategory].slice()).slice(0, QUESTIONS_PER_QUIZ);
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    answers = [];
    document.getElementById('score').textContent = score;
    document.getElementById('total-q').textContent = currentQuestions.length;
    document.getElementById('quiz-panel').style.display = 'block';
    document.getElementById('result-area').classList.remove('is-show');
    createProgressDots();
    showQuestion();
  }

  function createProgressDots() {
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
    document.getElementById('q-icon').textContent = q.icon;
    document.getElementById('question').textContent = q.question;
    document.getElementById('next-btn').style.display = 'none';
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kid-opt';
      btn.innerHTML = '<span class="kid-opt-letter">' + letters[index] + '</span> <span>' + option + '</span>';
      btn.addEventListener('click', () => selectAnswer(index));
      optionsContainer.appendChild(btn);
    });
    answered = false;

    const questionEl = document.getElementById('question');
    questionEl.setAttribute('aria-live', 'polite');
    if (window.KidEffects) KidEffects.pop(document.querySelector('.kid-qbox'));
  }

  function selectAnswer(index) {
    if (answered) return;
    answered = true;
    if (window.KidsSound) KidsSound.click();
    const q = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.kid-opt');

    if (index === q.correct) {
      options[index].classList.add('is-correct');
      score++;
      document.getElementById('score').textContent = score;
      answers.push(true);
      if (window.KidsSound) KidsSound.correct();
      if (window.KidEffects) {
        KidEffects.confetti();
        KidEffects.bumpScore(document.getElementById('score'));
      }
    } else {
      options[index].classList.add('is-wrong');
      options[q.correct].classList.add('is-correct');
      answers.push(false);
      if (window.KidsSound) KidsSound.wrong();
    }

    options.forEach(btn => btn.disabled = true);
    const dots = document.querySelectorAll('.kid-dot');
    const dot = dots[currentQuestionIndex];
    dot.classList.add(answers[currentQuestionIndex] ? 'ok' : 'bad');

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
      title = 'Perfect score!';
      message = 'Amazing! You got all ' + score + ' questions correct! You are a science superstar! 🌟';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 80) {
      icon = '🎉';
      title = 'Great job!';
      message = 'Fantastic! You got ' + score + ' out of ' + currentQuestions.length + ' correct! Keep learning! 🚀';
      if (window.KidsSound) KidsSound.win();
      if (window.KidEffects) KidEffects.confetti();
    } else if (pct >= 60) {
      icon = '👍';
      title = 'Good try!';
      message = 'Nice work! You got ' + score + ' out of ' + currentQuestions.length + ' correct. Keep exploring! 🔬';
      if (window.KidsSound) KidsSound.correct();
    } else {
      icon = '💪';
      title = 'Keep learning!';
      message = 'You got ' + score + ' out of ' + currentQuestions.length + ' correct. Practice makes perfect! 📚';
      if (window.KidsSound) KidsSound.pop();
    }

    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-message').textContent = message;

    const saved = KidUtils.loadScore('science');
    const totalPlayed = (saved.totalPlayed || 0) + 1;
    const bestScore = Math.max(saved.bestScore || 0, score);
    KidUtils.saveScore('science', { totalPlayed, bestScore, lastCategory: currentCategory, lastScore: score });

    resultArea.setAttribute('aria-live', 'polite');
  }

  function restartQuiz() {
    if (window.KidsSound) KidsSound.click();
    startQuiz();
  }

  function init() {
    document.querySelectorAll('.kid-tab').forEach(btn => {
      btn.addEventListener('click', () => selectCategory(btn.dataset.category));
    });
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('restart-btn').addEventListener('click', restartQuiz);

    const saved = KidUtils.loadScore('science');
    if (saved.lastCategory && questions[saved.lastCategory]) {
      currentCategory = saved.lastCategory;
      document.querySelectorAll('.kid-tab').forEach(btn => btn.classList.remove('active'));
      document.querySelector('.kid-tab.' + currentCategory).classList.add('active');
    }

    startQuiz();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
