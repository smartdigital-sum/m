(function(){'use strict';
const PER_GAME=10;
const questions=[
{e:'🏠🚗👨‍👩‍👧‍👦',a:'Family road trip',w:['Moving day','Car shopping','House tour']},
{e:'🎂🕯️🎉',a:'Birthday party',w:['Camping','Wedding','Halloween']},
{e:'🌧️🌈☀️',a:'Rain then sun',w:['Storm','Winter','Flood']},
{e:'📚✏️🏫',a:'Going to school',w:['Office work','Library','Shopping']},
{e:'⚽🥅🏆',a:'Winning a soccer match',w:['Playing tennis','Watching TV','Cooking']},
{e:'🌊🐚🦀',a:'Day at the beach',w:['Mountain hiking','Gardening','Skiing']},
{e:'🚀🌙⭐',a:'Space travel',w:['Night drive','Bird watching','Fishing']},
{e:'🎸🎤🎶',a:'Rock concert',w:['Cooking class','Art gallery','Reading']},
{e:'🍕🍔🍟',a:'Fast food meal',w:['Salad bowl','Fruit basket','Soup kitchen']},
{e:'✈️🌴🏖️',a:'Tropical vacation',w:['Business trip','Road trip','Train ride']},
{e:'🦁👑🏰',a:'The Lion King',w:['Tarzan','Finding Nemo','Frozen']},
{e:'🎅🎄🎁',a:'Christmas',w:['Easter','Thanksgiving','New Year']},
{e:'🧙‍♂️🧹🦉',a:'Harry Potter',w:['Lord of the Rings','Star Wars','Batman']},
{e:'🍦🍧🍨',a:'Ice cream party',w:['Hot chocolate','Coffee break','Tea time']},
{e:'🐟🐠🐡',a:'Fish tank',w:['Bird cage','Dog park','Cat cafe']},
{e:'🎪🤡🐘',a:'Circus',w:['Zoo','Museum','Theater']},
{e:'🧪⚗️🔬',a:'Science lab',w:['Kitchen','Garden','Gym']},
{e:'🎸🥁🎹',a:'Playing in a band',w:['Swimming','Running','Cycling']},
{e:'🌙👻🎃',a:'Halloween',w:['Christmas','Valentine','Diwali']},
{e:'🦋🌸🌺',a:'Spring garden',w:['Winter snow','Autumn leaves','Summer heat']}
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
document.getElementById('emoji-display').textContent=q.e;document.getElementById('next-btn').style.display='none';
document.getElementById('message').className='kid-msg';document.getElementById('message').textContent='';
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
if(pct===100){document.getElementById('result-icon').textContent='🏆';document.getElementById('result-title').textContent='Emoji Master!';
if(window.KidsSound)KidsSound.win();if(window.KidEffects)KidEffects.confetti();}
else if(pct>=60){document.getElementById('result-icon').textContent='🎉';document.getElementById('result-title').textContent='Great guessing!';
if(window.KidsSound)KidsSound.win();}
else{document.getElementById('result-icon').textContent='💪';document.getElementById('result-title').textContent='Keep trying!';if(window.KidsSound)KidsSound.pop();}
document.getElementById('result-message').textContent='You got '+score+' out of '+qs.length+' right!';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
