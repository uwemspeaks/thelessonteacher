const TOPICS = [
 {name:"Grammar & sentence building",emoji:"🧩",color:"#f0ebff",desc:"Build clear sentences and understand parts of speech."},
 {name:"Vocabulary",emoji:"📚",color:"#e6f8f1",desc:"Learn word meanings, synonyms and antonyms."},
 {name:"Punctuation",emoji:"✍️",color:"#fff1e8",desc:"Use punctuation marks and capital letters correctly."},
 {name:"Reading comprehension",emoji:"📖",color:"#eaf3ff",desc:"Understand passages, clues and main ideas."},
 {name:"Phonetics",emoji:"🔊",color:"#fff5dc",desc:"Explore sounds, syllables and word stress."},
 {name:"Writing skills",emoji:"📝",color:"#fceafa",desc:"Write paragraphs, letters and clear compositions."},
 {name:"Tenses & verbs",emoji:"⏳",color:"#e8f5ff",desc:"Choose verbs and express time correctly."},
 {name:"Oral English",emoji:"💬",color:"#e5f8f0",desc:"Communicate politely and confidently."},
 {name:"Idioms & figures of speech",emoji:"🎭",color:"#fff0eb",desc:"Understand expressions and figurative language."},
 {name:"Concord",emoji:"🤝",color:"#f0edff",desc:"Make subjects and verbs agree."},
 {name:"Sentence transformation",emoji:"🔄",color:"#eaf7f7",desc:"Change sentence forms while keeping meaning."},
 {name:"General English",emoji:"🎯",color:"#fff6e5",desc:"Bring your English skills together."}
];
const $=s=>document.querySelector(s);
const bank=window.QUESTION_BANK||[];
let state=JSON.parse(localStorage.getItem("lt-progress")||'{"answered":0,"correct":0,"points":0,"byTopic":{},"history":[]}');
let currentSet=[],currentIndex=0,selected=null,answeredCurrent=false,assessmentMode=false,sessionResults=[];
function save(){localStorage.setItem("lt-progress",JSON.stringify(state));}
function updateStats(){
 const acc=state.answered?Math.round(state.correct/state.answered*100):0;
 ["#answeredStat","#progressAnswered"].forEach(s=>$(s)&&($(s).textContent=state.answered));
 ["#pointsStat","#progressPoints"].forEach(s=>$(s)&&($(s).textContent=state.points));
 ["#accuracyStat","#progressAccuracy"].forEach(s=>$(s)&&($(s).textContent=acc+"%"));
 $("#streak").textContent=state.answered?Math.max(1,Math.ceil(state.answered/5)):1;
 renderPerformance();
}
function renderTopics(){
 $("#homeTopics").innerHTML=TOPICS.slice(0,8).map(t=>`<button class="topic-card" data-topic="${t.name}"><span class="topic-emoji" style="background:${t.color}">${t.emoji}</span><b>${t.name}</b><small>${bank.filter(q=>q.topic===t.name).length} practice questions</small></button>`).join("");
 $("#lessonGrid").innerHTML=TOPICS.map(t=>`<article class="lesson-card" data-topic-card="${t.name}"><span class="topic-emoji" style="background:${t.color}">${t.emoji}</span><span class="level-tag">${t.name==="Reading comprehension"||t.name==="Phonetics"||t.name==="Sentence transformation"?"Beginner to intermediate":"Beginner to intermediate"}</span><h3>${t.name}</h3><p>${t.desc}</p><button class="text-button" data-topic="${t.name}">Explore practice →</button></article>`).join("");
}
function showView(name){
 document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));
 document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
 const names={home:"Overview",lessons:"Learning academy",practice:"Practice questions",assessment:"Mock assessment",progress:"My progress"};
 $("#crumb").textContent=names[name]||"Overview";
 $("#sidebar").classList.remove("open");
 window.scrollTo({top:0,behavior:"smooth"});
}
function shuffle(arr){let a=[...arr];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startQuiz(topic=null,assessment=false){
 assessmentMode=assessment;sessionResults=[];
 let pool=topic?bank.filter(q=>q.topic===topic):bank;
 currentSet=shuffle(pool).slice(0,10);currentIndex=0;showView("practice");renderQuestion();
}
function renderQuestion(){
 const q=currentSet[currentIndex];if(!q)return;
 selected=null;answeredCurrent=false;
 $("#quizCategory").textContent=q.topic;$("#questionCount").textContent=`Question ${currentIndex+1} of ${currentSet.length}`;
 $("#quizProgress").style.width=((currentIndex)/currentSet.length*100)+"%";
 $("#scenarioText").textContent=q.scenario;$("#questionText").textContent=q.question;
 $("#answerList").innerHTML=q.options.map((o,i)=>`<button class="answer-option" data-answer="${i}"><span class="letter">${"ABCD"[i]}</span><span>${o}</span></button>`).join("");
 $("#feedback").className="feedback hidden";$("#feedback").innerHTML="";
 $("#checkBtn").classList.remove("hidden");$("#checkBtn").disabled=true;$("#nextBtn").classList.add("hidden");
 $("#skipBtn").classList.remove("hidden");
}
function chooseAnswer(i){
 if(answeredCurrent)return;selected=i;
 document.querySelectorAll(".answer-option").forEach((b,j)=>b.classList.toggle("selected",j===i));
 $("#checkBtn").disabled=false;
}
function checkAnswer(){
 if(selected===null||answeredCurrent)return;
 const q=currentSet[currentIndex],correct=selected===q.answer;answeredCurrent=true;
 state.answered++;if(correct){state.correct++;state.points+=10;}else{state.points+=2;}
 state.byTopic[q.topic]=state.byTopic[q.topic]||{answered:0,correct:0};state.byTopic[q.topic].answered++;if(correct)state.byTopic[q.topic].correct++;
 sessionResults.push({q,selected,correct});save();updateStats();
 document.querySelectorAll(".answer-option").forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add("correct");if(j===selected&&!correct)b.classList.add("wrong");});
 const fb=$("#feedback");fb.className="feedback"+(correct?"":" incorrect");
 fb.innerHTML=`<b>${correct?"🎉 Brilliant! That's correct.":"🌱 Good try. Let's learn from it."}</b><strong>Explanation:</strong> ${q.explanation}<br><strong>Learning tip:</strong> ${q.tip}`;
 $("#checkBtn").classList.add("hidden");$("#nextBtn").classList.remove("hidden");$("#skipBtn").classList.add("hidden");
 $("#nextBtn").textContent=currentIndex===currentSet.length-1?"See my result →":"Next question →";
 $("#quizProgress").style.width=((currentIndex+1)/currentSet.length*100)+"%";
}
function nextQuestion(){
 if(currentIndex<currentSet.length-1){currentIndex++;renderQuestion();return;}
 showResults();
}
function showResults(){
 const total=sessionResults.length,score=sessionResults.filter(x=>x.correct).length;
 const box=document.createElement("div");box.className="quiz-main";box.innerHTML=`<div style="text-align:center;padding:24px 10px"><div style="font-size:65px">${score>=8?"🏆":score>=5?"🌟":"🌱"}</div><span class="eyebrow">PRACTICE COMPLETE</span><h2 style="font:900 29px Nunito;margin:8px 0">You showed up. That's progress!</h2><div style="font:900 48px Nunito;color:var(--purple)">${score}/${total}</div><p style="color:#777;font-size:12px">You answered ${score} correctly and earned ${score*10+(total-score)*2} points in this round.</p><div style="background:#f1edff;border-radius:12px;padding:15px;text-align:left;margin:20px 0"><b>Keep growing</b><p style="font-size:12px;line-height:1.6;color:#777">Review the explanations for any questions you missed. Understanding why an answer is correct is more important than memorising it.</p></div><button class="btn btn-primary" id="againBtn">Practise again →</button> <button class="btn btn-outline" id="homeBtn">Back to overview</button></div>`;
 const view=$("#view-practice");view.innerHTML="";view.appendChild(box);
 $("#againBtn").onclick=()=>{view.innerHTML=originalPractice;startQuiz(null,assessmentMode)};
 $("#homeBtn").onclick=()=>{view.innerHTML=originalPractice;showView("home")};
}
const originalPractice=`<div class="page-intro"><span class="eyebrow">PRACTICE MAKES PROGRESS</span><h1>Let\\'s practise!</h1><p>Answer a question, then read the explanation to understand the rule.</p></div><div class="quiz-layout"><div class="quiz-main"><div class="quiz-top"><span class="pill purple-pill" id="quizCategory">Grammar</span><span class="question-count" id="questionCount">Question 1 of 10</span></div><div class="quiz-progress"><i id="quizProgress"></i></div><div class="scenario-box"><div class="scenario-icon">🎒</div><div><span class="eyebrow">THE SCENARIO</span><p id="scenarioText"></p></div></div><h2 class="question-text" id="questionText"></h2><div class="answer-list" id="answerList"></div><div class="feedback hidden" id="feedback" aria-live="polite"></div><div class="quiz-controls"><button class="btn btn-outline" id="skipBtn">Skip for now</button><button class="btn btn-primary" id="checkBtn" disabled>Check answer</button><button class="btn btn-primary hidden" id="nextBtn">Next question →</button></div></div><aside class="teacher-note"><div class="teacher-avatar">👩🏾‍🏫</div><span class="eyebrow">A NOTE FROM YOUR TEACHER</span><h3>Learning is a journey!</h3><p>Take your time. Read each option carefully. Even a wrong answer is a chance to learn something new.</p><div class="teacher-sign">Your learning buddy ✨</div></aside></div>`;
function renderPerformance(){
 const el=$("#topicPerformance");if(!el)return;
 el.innerHTML=TOPICS.map(t=>{let d=state.byTopic[t.name]||{answered:0,correct:0},pct=d.answered?Math.round(d.correct/d.answered*100):0;return `<div class="performance-row"><span>${t.emoji} ${t.name}</span><div class="performance-track"><i style="width:${pct}%"></i></div><b>${d.answered?pct+"%":"—"}</b></div>`}).join("");
}
document.addEventListener("click",e=>{
 const viewBtn=e.target.closest("[data-view]");if(viewBtn){showView(viewBtn.dataset.view);return;}
 const topicBtn=e.target.closest("[data-topic]");if(topicBtn){startQuiz(topicBtn.dataset.topic);return;}
 const ans=e.target.closest("[data-answer]");if(ans){chooseAnswer(Number(ans.dataset.answer));return;}
});
$("#checkBtn").addEventListener("click",checkAnswer);
$("#nextBtn").addEventListener("click",nextQuestion);
$("#skipBtn").addEventListener("click",()=>{if(currentIndex<currentSet.length-1){currentIndex++;renderQuestion()}else showResults()});
$("#startAssessment").addEventListener("click",()=>startQuiz(null,true));
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#topicSearch").addEventListener("input",e=>{const v=e.target.value.toLowerCase();document.querySelectorAll(".lesson-card").forEach(c=>c.style.display=c.dataset.topicCard.toLowerCase().includes(v)?"":"none")});
$("#levelFilter").addEventListener("change",()=>{ /* Topic lessons are suitable for mixed JSS levels in this first release. */ });
$("#resetProgress").addEventListener("click",()=>{if(confirm("Reset all learning progress saved on this device?")){state={answered:0,correct:0,points:0,byTopic:{},history:[]};save();updateStats();toast("Your progress has been reset.")}});
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
renderTopics();updateStats();renderPerformance();
