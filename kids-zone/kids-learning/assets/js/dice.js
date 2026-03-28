(function(){'use strict';
const diceEmoji=['⚀','⚁','⚂','⚃','⚄','⚅'];
let mode='add',d1=0,d2=0,correct=0,wrong=0;

function init(){
document.querySelectorAll('[data-mode]').forEach(b=>{b.addEventListener('click',()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.remove('active'));b.classList.add('active');});});
document.getElementById('roll-btn').addEventListener('click',roll);
document.getElementById('check-btn').addEventListener('click',check);
document.getElementById('dice-answer').addEventListener('keypress',e=>{if(e.key==='Enter')check();});
}

function roll(){
if(window.KidsSound)KidsSound.click();
d1=Math.floor(Math.random()*6)+1;d2=Math.floor(Math.random()*6)+1;
const el1=document.getElementById('dice-1'),el2=document.getElementById('dice-2');
el1.textContent=diceEmoji[d1-1];el2.textContent=diceEmoji[d2-1];
el1.classList.remove('dice-roll');el2.classList.remove('dice-roll');
void el1.offsetWidth;el1.classList.add('dice-roll');el2.classList.add('dice-roll');

const q=document.getElementById('dice-question'),op=document.getElementById('dice-op'),inputArea=document.getElementById('dice-input-area');
document.getElementById('message').className='kid-msg';document.getElementById('message').textContent='';

if(mode==='add'){
op.textContent='+';q.textContent='What is '+d1+' + '+d2+'?';inputArea.style.display='flex';
document.getElementById('dice-answer').value='';document.getElementById('dice-answer').focus();
}else if(mode==='multiply'){
op.textContent='×';q.textContent='What is '+d1+' × '+d2+'?';inputArea.style.display='flex';
document.getElementById('dice-answer').value='';document.getElementById('dice-answer').focus();
}else{
op.textContent='vs';q.textContent='Which is higher?';
const opts=document.getElementById('dice-input-area');opts.style.display='none';
const msg=document.getElementById('message');
setTimeout(()=>{
const higher=d1>d2?d1:(d2>d1?d2:'tie');
if(higher!=='tie'){q.textContent='Tap the higher number!';}
else{q.textContent='They\'re equal! Roll again!';}
},300);
// Show two buttons for higher/lower
const container=document.getElementById('game-panel');
let hlDiv=document.getElementById('hl-buttons');
if(!hlDiv){hlDiv=document.createElement('div');hlDiv.id='hl-buttons';hlDiv.className='dice-hl-row';
hlDiv.innerHTML='<button type="button" class="kid-btn-primary dice-hl-btn" id="hl-1">'+d1+'</button><button type="button" class="kid-btn-primary dice-hl-btn" id="hl-2">'+d2+'</button>';
container.querySelector('.dice-area').after(hlDiv);
}else{hlDiv.style.display='flex';document.getElementById('hl-1').textContent=d1;document.getElementById('hl-2').textContent=d2;}
document.getElementById('hl-1').onclick=()=>checkHL(d1);
document.getElementById('hl-2').onclick=()=>checkHL(d2);
}
}

function check(){
const ans=parseInt(document.getElementById('dice-answer').value,10);
const msg=document.getElementById('message');
if(isNaN(ans)){msg.textContent='Enter a number!';msg.className='kid-msg is-wrong';return;}
let expected=mode==='add'?d1+d2:d1*d2;
if(ans===expected){correct++;msg.textContent='🎉 Correct!';msg.className='kid-msg is-correct';if(window.KidsSound)KidsSound.correct();if(window.KidEffects)KidEffects.confetti();}
else{wrong++;msg.textContent='Oops! It was '+expected;msg.className='kid-msg is-wrong';if(window.KidsSound)KidsSound.wrong();}
document.getElementById('dice-correct').textContent=correct;document.getElementById('dice-wrong').textContent=wrong;
}

function checkHL(pick){
const higher=d1>d2?d1:(d2>d1?d2:0);
const msg=document.getElementById('message');
if(pick===higher&&higher!==0){correct++;msg.textContent='🎉 Correct!';msg.className='kid-msg is-correct';if(window.KidsSound)KidsSound.correct();if(window.KidEffects)KidEffects.confetti();}
else if(d1===d2){msg.textContent='🤝 It\'s a tie!';msg.className='kid-msg';}
else{wrong++;msg.textContent='Oops! '+higher+' was higher!';msg.className='kid-msg is-wrong';if(window.KidsSound)KidsSound.wrong();}
document.getElementById('dice-correct').textContent=correct;document.getElementById('dice-wrong').textContent=wrong;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
