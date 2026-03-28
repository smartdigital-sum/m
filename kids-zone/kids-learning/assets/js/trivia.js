(function(){'use strict';
const PER_GAME=10;
const questions=[
{cat:'Science',q:'How many legs does a spider have?',a:'8',w:['6','10','4']},
{cat:'Nature',q:'What is the largest planet?',a:'Jupiter',w:['Saturn','Earth','Mars']},
{cat:'History',q:'Who painted the Mona Lisa?',a:'Leonardo da Vinci',w:['Picasso','Van Gogh','Michelangelo']},
{cat:'Music',q:'How many strings does a guitar usually have?',a:'6',w:['4','5','8']},
{cat:'Sports',q:'How many players on a soccer team?',a:'11',w:['9','10','12']},
{cat:'Science',q:'What gas do we breathe in?',a:'Oxygen',w:['Carbon dioxide','Nitrogen','Helium']},
{cat:'Geography',q:'What is the largest ocean?',a:'Pacific',w:['Atlantic','Indian','Arctic']},
{cat:'Food',q:'What fruit is known to keep doctors away?',a:'Apple',w:['Banana','Orange','Grape']},
{cat:'Animals',q:'What is a group of lions called?',a:'A pride',w:['A pack','A herd','A flock']},
{cat:'Space',q:'What planet is known as the Red Planet?',a:'Mars',w:['Venus','Jupiter','Mercury']},
{cat:'Science',q:'What is H2O?',a:'Water',w:['Oxygen','Hydrogen','Salt']},
{cat:'History',q:'What year did humans first land on the Moon?',a:'1969',w:['1959','1979','1989']},
{cat:'Nature',q:'How many continents are there?',a:'7',w:['5','6','8']},
{cat:'Music',q:'What instrument has black and white keys?',a:'Piano',w:['Guitar','Drum','Flute']},
{cat:'Animals',q:'What is the fastest land animal?',a:'Cheetah',w:['Lion','Horse','Tiger']},
{cat:'Science',q:'What is the boiling point of water?',a:'100°C',w:['50°C','150°C','200°C']},
{cat:'Geography',q:'What is the tallest mountain?',a:'Mount Everest',w:['K2','Kilimanjaro','Alps']},
{cat:'Sports',q:'How many rings are on the Olympic flag?',a:'5',w:['4','6','7']},
{cat:'Food',q:'What country gave us pizza?',a:'Italy',w:['France','Spain','Greece']},
{cat:'Space',q:'What is the closest star to Earth?',a:'The Sun',w:['Polaris','Sirius','Alpha Centauri']}
];

let qs=[],idx=0,score=0,answered=false;

function init(){
document.getElementById('next-btn').addEventListener('click',nextQ);
document.getElementById('restart-btn').addEventListener('click',()=>{if(window.KidsSound)KidsSound.click();startGame();});
startGame();
}

function startGame(){
qs=KidUtils.shuffleArray(questions.slice()).slice(0,PER_GAME);idx=0;score=0;answered=false;
document.getElementById('score').textContent='0';document.getElementById('total-q').textContent=qs.length;
document.getElementById('quiz-panel').style.display='block';document.getElementById('result-area').classList.remove('is-show');
document.getElementById('message').className='kid-msg';document.getElementById('message').textContent='';
const dc=document.getElementById('progress-dots');dc.innerHTML='';
for(let i=0;i<qs.length;i++){const d=document.createElement('div');d.className='kid-dot';dc.appendChild(d);}
showQ();
}

function showQ(){
const q=qs[idx];answered=false;document.getElementById('q-num').textContent=idx+1;
document.getElementById('trivia-cat').textContent=q.cat;document.getElementById('question').textContent=q.q;
document.getElementById('next-btn').style.display='none';document.getElementById('message').className='kid-msg';document.getElementById('message').textContent='';
const oc=document.getElementById('options');oc.innerHTML='';const letters=['A','B','C','D'];
const opts=KidUtils.shuffleArray([q.a,...q.w]);
opts.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='kid-opt';
b.innerHTML='<span class="kid-opt-letter">'+letters[i]+'</span> <span>'+o+'</span>';
b.addEventListener('click',()=>selectAnswer(o,b));oc.appendChild(b);});
}

function selectAnswer(sel,btn){
if(answered)return;answered=true;if(window.KidsSound)KidsSound.click();
const q=qs[idx],isCorrect=sel===q.a;
if(isCorrect){btn.classList.add('is-correct');score++;document.getElementById('score').textContent=score;
if(window.KidsSound)KidsSound.correct();if(window.KidEffects)KidEffects.confetti();}
else{btn.classList.add('is-wrong');document.querySelectorAll('.kid-opt').forEach(o=>{if(o.textContent.includes(q.a))o.classList.add('is-correct');});
if(window.KidsSound)KidsSound.wrong();}
document.querySelectorAll('.kid-opt').forEach(o=>o.disabled=true);
document.querySelectorAll('.kid-dot')[idx].classList.add(isCorrect?'ok':'bad');
const nb=document.getElementById('next-btn');nb.style.display='block';nb.textContent=idx===qs.length-1?'See results 🏆':'Next ➡';nb.focus();
}

function nextQ(){if(window.KidsSound)KidsSound.pop();idx++;if(idx>=qs.length)showResults();else showQ();}

function showResults(){
document.getElementById('quiz-panel').style.display='none';const ra=document.getElementById('result-area');ra.classList.add('is-show');
const pct=(score/qs.length)*100;
if(pct===100){document.getElementById('result-icon').textContent='🏆';document.getElementById('result-title').textContent='Trivia Champion!';
if(window.KidsSound)KidsSound.win();if(window.KidEffects)KidEffects.confetti();}
else if(pct>=60){document.getElementById('result-icon').textContent='🎉';document.getElementById('result-title').textContent='Great knowledge!';
if(window.KidsSound)KidsSound.win();}
else{document.getElementById('result-icon').textContent='💪';document.getElementById('result-title').textContent='Keep learning!';if(window.KidsSound)KidsSound.pop();}
document.getElementById('result-message').textContent='You got '+score+' out of '+qs.length+' right!';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
