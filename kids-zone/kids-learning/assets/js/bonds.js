(function(){'use strict';
let total=10,known=0,answer=0,correct=0,streak=0;

function init(){
document.querySelectorAll('[data-diff]').forEach(b=>{b.addEventListener('click',()=>{setDiff(b.dataset.diff);});});
document.getElementById('check-btn').addEventListener('click',check);
document.getElementById('next-btn').addEventListener('click',newProblem);
document.getElementById('bonds-answer').addEventListener('keypress',e=>{if(e.key==='Enter')check();});
newProblem();
}

function setDiff(d){
document.querySelectorAll('[data-diff]').forEach(b=>b.classList.remove('is-on'));
document.querySelector('[data-diff="'+d+'"]').classList.add('is-on');
total=d==='easy'?10:(d==='medium'?20:100);
newProblem();
}

function newProblem(){
if(window.KidsSound)KidsSound.pop();
known=Math.floor(Math.random()*total);
answer=total-known;
document.getElementById('bonds-total').textContent=total;
document.getElementById('bonds-known').textContent=known;
document.getElementById('bonds-answer').value='';document.getElementById('bonds-answer').focus();
document.getElementById('message').className='kid-msg';document.getElementById('message').textContent='';
}

function check(){
const ans=parseInt(document.getElementById('bonds-answer').value,10);
const msg=document.getElementById('message');
if(isNaN(ans)){msg.textContent='Enter a number!';msg.className='kid-msg is-wrong';if(window.KidsSound)KidsSound.wrong();return;}
if(ans===answer){correct++;streak++;msg.textContent='🎉 '+known+' + '+answer+' = '+total+'! 🎉';msg.className='kid-msg is-correct';
if(window.KidsSound)KidsSound.correct();if(window.KidEffects&&streak%3===0)KidEffects.confetti();
}else{streak=0;msg.textContent='Oops! '+known+' + '+answer+' = '+total;msg.className='kid-msg is-wrong';if(window.KidsSound)KidsSound.wrong();}
document.getElementById('bonds-correct').textContent=correct;document.getElementById('bonds-streak').textContent=streak;
setTimeout(newProblem,1200);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
