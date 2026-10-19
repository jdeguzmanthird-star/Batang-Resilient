/* A story owns its choices, activities, objectives, and clocks, independently of practice. */
(function(){
 'use strict';const LE=window.LE=window.LE||{},copy=x=>JSON.parse(JSON.stringify(x)),bounded=n=>Number.isFinite(n)?Math.max(0,Math.min(360000000,n)):0;
 function create(saved,runId,storyId='typhoon'){
  const data=LE.Data[storyId];if(!data||!data.tasks)throw new Error('Story not available');const tasks=data.tasks,pillars=LE.Data.pillars.map(p=>p.id);
  let state,decisions,recovered=false;
  function fresh(){state={version:1,contentVersion:data.version,story:storyId,runId:runId||storyId+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),index:0,done:[],board:[],route:[],contactsRead:false,dengue:[],checks:{},reviews:[],activities:{},world:null,activityOpen:null,activeMs:0,chapterMs:{},bonusPending:false,bonusDone:false};decisions=LE.Decisions.create(data);}
  fresh();
  function activityTask(id){return id==='hero-bonus'?{id,game:'chain',chapter:3}:tasks.find(t=>t.id===id&&t.type==='activity');}
  function restoredActivity(id){const task=activityTask(id);return task?LE.MiniGames.create(task.game,storyId,state.activities[id]):null;}
  function evidence(task){
   if(task.type==='decision'){const r=decisions.state.records[task.decisionId];return Boolean(r&&r.learned);}
   if(task.type==='activity'){const m=restoredActivity(task.id);return Boolean(m&&m.result());}
   if(task.type==='board')return state.board.length===data.signals.length;
   if(task.type==='route')return state.route.length===data.route.length;
   if(task.type==='contacts')return state.contactsRead;
   if(task.type==='dengue')return state.dengue.length===data.dengue.length;
   if(task.type==='check')return (state.checks[task.id]||[]).length===task.cards.length;
   if(task.type==='reflect')return data.decisions.filter(d=>d.pillar===pillars[task.chapter]).every(d=>decisions.state.records[d.id]&&decisions.state.records[d.id].learned);
   return true;
  }
  if(saved){
   if(saved.version===1&&saved.contentVersion===data.version&&saved.story===storyId&&typeof saved.runId==='string'&&Number.isInteger(saved.index)&&saved.index>=0&&saved.index<=tasks.length){
    state.runId=saved.runId;state.index=saved.index;state.done=Array.isArray(saved.done)?saved.done.filter(id=>tasks.some(t=>t.id===id)):[];
    state.board=Array.isArray(saved.board)?[...new Set(saved.board.filter(n=>Number.isInteger(n)&&n>=1&&n<=data.signals.length))]:[];
    if(data.route&&Array.isArray(saved.route))for(const node of saved.route){if(data.route[state.route.length]&&node===data.route[state.route.length].id)state.route.push(node);else break;}
    state.contactsRead=saved.contactsRead===true;
    if(data.dengue&&Array.isArray(saved.dengue))for(const answer of saved.dengue){if(data.dengue[state.dengue.length]&&answer===data.dengue[state.dengue.length].best)state.dengue.push(answer);else break;}
    for(const task of tasks.filter(t=>t.type==='check')){const answers=saved.checks&&saved.checks[task.id],valid=[];if(Array.isArray(answers))for(const answer of answers){if(task.cards[valid.length]&&answer===task.cards[valid.length].best)valid.push(answer);else break;}state.checks[task.id]=valid;}
    state.reviews=Array.isArray(saved.reviews)?[...new Set(saved.reviews.filter(id=>tasks.some(t=>t.id===id&&t.type==='reflect')))]:[];
    for(const task of tasks.filter(t=>t.type==='activity').concat({id:'hero-bonus',game:'chain'}))if(saved.activities&&saved.activities[task.id])state.activities[task.id]=LE.MiniGames.create(task.game,storyId,saved.activities[task.id]).serialize();
    state.activeMs=bounded(saved.activeMs);for(const p of pillars)state.chapterMs[p]=Math.min(state.activeMs,bounded(saved.chapterMs&&saved.chapterMs[p]));
    state.world=saved.world&&typeof saved.world==='object'?copy(saved.world):null;state.activityOpen=typeof saved.activityOpen==='string'&&activityTask(saved.activityOpen)?saved.activityOpen:null;state.bonusPending=saved.bonusPending===true;state.bonusDone=saved.bonusDone===true;
    decisions=LE.Decisions.create(data,saved.decisions);
    let valid=state.done.length===state.index&&tasks.slice(0,state.index).every((task,i)=>state.done[i]===task.id&&evidence(task));
    const task=tasks[state.index];if(task&&task.type==='decision'&&(!decisions.current()||decisions.current().id!==task.decisionId))valid=false;
    if(state.bonusPending&&state.index!==tasks.length)valid=false;
    if(state.activityOpen&&!(task&&task.type==='activity'&&task.id===state.activityOpen)&&!(state.activityOpen==='hero-bonus'&&state.bonusPending&&state.index===tasks.length))valid=false;
    if(!valid){fresh();recovered=true;}
   }else recovered=true;
  }
  const current=()=>tasks[state.index]||null,isComplete=()=>state.index===tasks.length;
  function push(){const t=current();if(!t)return false;state.done.push(t.id);state.index++;return true;}
  function path(chapter){const t=decisions.tally(pillars[chapter]);return LE.Decisions.pathFor(t.maximum?t.raw/t.maximum*100:0);}
  function advance(){
   const t=current();if(!t)return false;
   if(t.type==='decision'){
    if(!decisions.current()||decisions.current().id!==t.decisionId)return false;
    const phase=decisions.state.phase;if(['question','retry'].includes(phase))return false;
    if(!decisions.advance())return false;if(phase==='learn')return push();return true;
   }
   if(t.type==='activity')return evidence(t)?finishActivity(t.id):false;
   if(t.type==='board')return state.board.length===data.signals.length?push():false;
   if(['route','contacts','dengue','check'].includes(t.type))return evidence(t)?push():false;
   if(t.type==='walk')return false;
   if(t.type==='reflect'){
    if(!evidence(t)||path(t.chapter)!=='hero'&&!state.reviews.includes(t.id))return false;
    if(decisions.state.phase==='chapter')decisions.advance();return push();
   }
   return push();
  }
  function answer(id){const t=current();return Boolean(t&&t.type==='decision'&&decisions.current()&&decisions.current().id===t.decisionId&&decisions.answer(id));}
  function visit(mapId,key){const t=current();return Boolean(t&&t.type==='walk'&&t.map===mapId&&t.key===key&&push());}
  function readSignal(n){if(!current()||current().type!=='board'||!Number.isInteger(n)||n<1||n>data.signals.length)return false;if(!state.board.includes(n))state.board.push(n);return true;}
  function plotRoute(id){const t=current(),node=data.route&&data.route[state.route.length];if(!t||t.type!=='route'||!node||node.id!==id)return false;state.route.push(id);return true;}
  function resetRoute(){if(!current()||current().type!=='route')return false;state.route=[];return true;}
  function readContacts(){if(!current()||current().type!=='contacts')return false;state.contactsRead=true;return true;}
  function answerDengue(answer){const q=data.dengue&&data.dengue[state.dengue.length];if(!current()||current().type!=='dengue'||!q||answer!==q.best)return false;state.dengue.push(answer);return true;}
  function answerCheck(answer){const t=current();if(!t||t.type!=='check')return false;const answers=state.checks[t.id]||[],q=t.cards[answers.length];if(!q||answer!==q.best)return false;answers.push(answer);state.checks[t.id]=answers;return true;}
  function review(id){const t=current();if(!t||t.type!=='reflect')return false;const missed=data.decisions.filter(d=>d.pillar===pillars[t.chapter]).find(d=>{const r=decisions.state.records[d.id];return r&&d.choices.find(c=>c.id===r.choiceId).type!=='best';});
   if(path(t.chapter)==='try-again'&&missed&&id!==missed.choices.find(c=>c.type==='best').id)return false;if(!state.reviews.includes(t.id))state.reviews.push(t.id);return true;
  }
  function saveActivity(id,snapshot){const t=current(),bonus=id==='hero-bonus'&&state.bonusPending&&isComplete(),task=activityTask(id);if(!task||!bonus&&(!t||t.type!=='activity'||t.id!==id))return false;state.activities[id]=LE.MiniGames.create(task.game,storyId,snapshot).serialize();return true;}
  function finishActivity(id){const t=current(),m=restoredActivity(id);if(!m||!m.result())return false;
   if(id==='hero-bonus'&&state.bonusPending&&isComplete()){state.bonusPending=false;state.bonusDone=true;return true;}
   if(!t||t.type!=='activity'||t.id!==id)return false;
   if(t.game==='breathe')decisions.adjustCalm(20);return push();
  }
  function beginBonus(){const score=decisions.tally();if(data.allowBonus===false||!isComplete()||LE.Decisions.pathFor(score.raw/score.maximum*100)!=='hero'||state.bonusDone)return false;state.bonusPending=true;return true;}
  function score(){const results=data.requiredGames.map(id=>restoredActivity(id)),mini=results.every(m=>m&&m.result())?Math.round(results.reduce((sum,m)=>sum+m.result().score,0)/(results.length*100)*20):null;const t=decisions.tally();return LE.Decisions.scoreParts(t.raw,t.maximum,mini,null);}
  function tick(milliseconds,timers=true){if(isComplete()||!Number.isFinite(milliseconds)||milliseconds<=0)return false;const dt=Math.min(1000,milliseconds),t=current();state.activeMs+=dt;const pillar=pillars[t.chapter];state.chapterMs[pillar]=(state.chapterMs[pillar]||0)+dt;return t.type==='decision'?decisions.tick(dt,timers):false;}
  function activityTime(id,milliseconds){if(!Number.isFinite(milliseconds)||milliseconds<=0)return;const t=activityTask(id);if(!t||id==='hero-bonus')return;const dt=bounded(milliseconds);state.activeMs+=dt;state.chapterMs[pillars[t.chapter]]=(state.chapterMs[pillars[t.chapter]]||0)+dt;}
  return {data,state,current,isComplete,answer,advance,visit,readSignal,plotRoute,resetRoute,readContacts,answerDengue,answerCheck,review,saveActivity,finishActivity,beginBonus,score,tick,activityTime,path,activityTask,restoredActivity,decisions:()=>decisions,completedPillars:()=>tasks.filter(t=>t.type==='reflect'&&state.done.includes(t.id)).map(t=>pillars[t.chapter]),serialize:()=>({...copy(state),decisions:decisions.serialize()}),recovered:()=>recovered};
 }
 LE.Story={create};
})();
