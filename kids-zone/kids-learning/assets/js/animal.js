(function(){'use strict';
const PER_GAME=10;
const animals=[
{baby:'🐶',babyName:'Puppy',parent:'🐕',parentName:'Dog'},
{baby:'🐱',babyName:'Kitten',parent:'🐈',parentName:'Cat'},
{baby:'🐰',babyName:'Bunny',parent:'🐇',parentName:'Rabbit'},
{baby:'🐻',babyName:'Cub',parent:'🐻‍❄️',parentName:'Bear'},
{baby:'🐴',babyName:'Foal',parent:'🐎',parentName:'Horse'},
{baby:'🦁',babyName:'Cub',parent:'🦁',parentName:'Lion'},
{baby:'🐸',babyName:'Tadpole',parent:'🐸',parentName:'Frog'},
{baby:'🐘',babyName:'Calf',parent:'🐘',parentName:'Elephant'},
{baby:'🐧',babyName:'Chick',parent:'🐧',parentName:'Penguin'},
{baby:'🦋',babyName:'Caterpillar',parent:'🦋',parentName:'Butterfly'},
{baby:'🐢',babyName:'Hatchling',parent:'🐢',parentName:'Turtle'},
{baby:'🐑',babyName:'Lamb',parent:'🐑',parentName:'Sheep'},
{baby:'🐷',babyName:'Piglet',parent:'🐷',parentName:'Pig'},
{baby:'🐮',babyName:'Calf',parent:'🐮',parentName:'Cow'},
{baby:'🐥',babyName:'Chick',parent:'🐔',parentName:'Chicken'},
{baby:'🐋',babyName:'Calf',parent:'🐋',parentName:'Whale'},
{baby:'🦆',babyName:'Duckling',parent:'🦆',parentName:'Duck'},
{baby:'🦢',babyName:'Cygnets',parent:'🦢',parentName:'Swan'},
{baby:'🐺',babyName:'Pup',parent:'🐺',parentName:'Wolf'},
{baby:'🦅',babyName:'Eaglet',parent:'🦅',parentName:'Eagle'}
];

let qs=[],idx=0,score=0,answered=false;

function init(){
document.getElementById('next-btn').addEventListener('click',nextQ);
document.getElementById('restart-btn').addEventListener('click',()=>{if(window.KidsSound)KidsSound.click();startGame();});
startGame();
}

function startGame(){
qs=KidUtils.shuffleArray(animals.slice()).slice(0,PER_GAME);idx=0;score=0;answered=false;
document.getElementById('score').textContent='0';document.getElementById('total-q').textContent=qs.length;
document.getElementById('quiz-panel').style.display='block';document.getElementById('result-area').classList.remove('is-show');
document.getElementById('message').className='kid-msg';document.getElementById('message').textContent='';
const dc=document.getElementById('progress-dots');dc.innerHTML='';
for(let i=0;i<qs.length;i++){const d=document.createElement('div');d.className='kid-dot';dc.appendChild(d);}
showQ();
}

function showQ(){
const q=qs[idx];answered=false;document.getElementById('q-num').textContent=idx+1;
document.getElementById('animal-baby').textContent=q.baby;
document.getElementById('question').textContent='What is the parent of a '+q.babyName+'?';
document.getElementById('next-btn').style.display='none';document.getElementById('message').className='kid-msg';document.getElementById('message').textContent='';
// Pick 3 wrong parents
const wrongs=KidUtils.shuffleArray(animals.filter(a=>a.parentName!==q.parentName)).slice(0,3).map(a=>({emoji:a.parent,name:a.parentName}));
const opts=KidUtils.shuffleArray([{emoji:q.parent,name:q.parentName},...wrongs]);
const oc=document.getElementById('options');oc.innerHTML='';const letters=['A','B','C','D'];
opts.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='kid-opt';
b.innerHTML='<span class="kid-opt-letter">'+letters[i]+'</span> <span>'+o.emoji+' '+o.name+'</span>';
b.addEventListener('click',()=>selectAnswer(o.name,b));oc.appendChild(b);});
}

function selectAnswer(sel,btn){
if(answered)return;answered=true;if(window.KidsSound)KidsSound.click();
const q=qs[idx],isCorrect=sel===q.parentName;
if(isCorrect){btn.classList.add('is-correct');score++;document.getElementById('score').textContent=score;
if(window.KidsSound)KidsSound.correct();if(window.KidEffects)KidEffects.confetti();}
else{btn.classList.add('is-wrong');document.querySelectorAll('.kid-opt').forEach(o=>{if(o.textContent.includes(q.parentName))o.classList.add('is-correct');});
if(window.KidsSound)KidsSound.wrong();}
document.querySelectorAll('.kid-opt').forEach(o=>o.disabled=true);
document.querySelectorAll('.kid-dot')[idx].classList.add(isCorrect?'ok':'bad');
const nb=document.getElementById('next-btn');nb.style.display='block';nb.textContent=idx===qs.length-1?'See results 🏆':'Next ➡';nb.focus();
}

function nextQ(){if(window.KidsSound)KidsSound.pop();idx++;if(idx>=qs.length)showResults();else showQ();}

function showResults(){
document.getElementById('quiz-panel').style.display='none';const ra=document.getElementById('result-area');ra.classList.add('is-show');
const pct=(score/qs.length)*100;
if(pct===100){document.getElementById('result-icon').textContent='🏆';document.getElementById('result-title').textContent='Animal Expert!';
if(window.KidsSound)KidsSound.win();if(window.KidEffects)KidEffects.confetti();}
else if(pct>=60){document.getElementById('result-icon').textContent='🎉';document.getElementById('result-title').textContent='Great animal knowledge!';
if(window.KidsSound)KidsSound.win();}
else{document.getElementById('result-icon').textContent='💪';document.getElementById('result-title').textContent='Keep learning!';if(window.KidsSound)KidsSound.pop();}
document.getElementById('result-message').textContent='You matched '+score+' out of '+qs.length+' animals!';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
