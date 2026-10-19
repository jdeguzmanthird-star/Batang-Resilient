/* Untimed assessment state. Scores are derived from answers, never from saved totals. */
(function(){
 'use strict';const LE=window.LE=window.LE||{},copy=x=>JSON.parse(JSON.stringify(x)),pillars=['prevention','preparedness','response','recovery'];
 function shuffle(items,rng=Math.random){const out=[...items];for(let i=out.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(rng()*(i+1))));[out[i],out[j]]=[out[j],out[i]];}return out;}
 function select(story,rng=Math.random){const bank=LE.Data.quiz[story],chosen=pillars.map(p=>shuffle(bank.filter(q=>q.pillar===p),rng)[0]);chosen.push(shuffle(bank.filter(q=>!chosen.includes(q)),rng)[0]);return shuffle(chosen,rng).map(q=>q.id);}
 function create(story,runId,saved,options={}){
  const bank=LE.Data.quiz[story];if(!bank||typeof runId!=='string')throw Error('Unknown assessment');const daily=options.daily===true,count=daily?3:5;
  let recovered=false,state={version:1,story,runId,daily,ids:(daily?shuffle(bank,options.rng).slice(0,3).map(q=>q.id):select(story,options.rng)),answers:[],acknowledged:0,matchIds:shuffle(LE.Data.pillarMatches[story].map(q=>q.id),options.rng),matches:{},submitted:false,reviewed:false};
  if(saved){
   const ids=saved.ids,answers=saved.answers,ack=saved.acknowledged,valid=saved.version===1&&saved.story===story&&saved.runId===runId&&saved.daily===daily&&Array.isArray(ids)&&ids.length===count&&new Set(ids).size===count&&ids.every(id=>bank.some(q=>q.id===id))&&(daily||pillars.every(p=>ids.some(id=>bank.find(q=>q.id===id).pillar===p)))&&Array.isArray(answers)&&answers.length<=count&&answers.every(n=>Number.isInteger(n)&&n>=0&&n<=2)&&Number.isInteger(ack)&&ack>=0&&ack<=answers.length&&answers.length-ack<=1;
   if(valid){state.ids=[...ids];if(Array.isArray(saved.matchIds)&&saved.matchIds.length===8&&new Set(saved.matchIds).size===8&&saved.matchIds.every(id=>LE.Data.pillarMatches[story].some(q=>q.id===id)))state.matchIds=[...saved.matchIds];state.answers=[...answers];state.acknowledged=ack;
    if(!daily&&ack===count){for(const item of LE.Data.pillarMatches[story])if(saved.matches&&pillars.includes(saved.matches[item.id]))state.matches[item.id]=saved.matches[item.id];state.submitted=saved.submitted===true&&Object.keys(state.matches).length===8;state.reviewed=state.submitted&&saved.reviewed===true;}
   }else recovered=true;
  }
  const questions=()=>state.ids.map(id=>bank.find(q=>q.id===id));
  function phase(){if(state.acknowledged<count)return state.answers.length>state.acknowledged?'learn':'question';if(daily)return 'complete';return state.reviewed?'complete':state.submitted?'matchLearn':'match';}
  function answer(n){if(phase()!=='question'||!Number.isInteger(n)||n<0||n>2)return false;state.answers.push(n);return true;}
  function acknowledge(){if(phase()==='learn'){state.acknowledged++;return true;}if(phase()==='matchLearn'){state.reviewed=true;return true;}return false;}
  function match(id,pillar){if(phase()!=='match'||!LE.Data.pillarMatches[story].some(q=>q.id===id)||!pillars.includes(pillar))return false;state.matches[id]=pillar;return true;}
  function submit(){if(phase()!=='match'||Object.keys(state.matches).length!==8)return false;state.submitted=true;return true;}
  function score(){if(phase()!=='complete')return null;const correct=questions().filter((q,i)=>q.best===state.answers[i]).length,matching=daily?0:LE.Data.pillarMatches[story].filter(q=>q.pillar===state.matches[q.id]).length;return {correct,matching,multipleChoice:correct*2,pillars:daily?0:Math.round(matching/8*10),total:daily?correct*2:correct*2+Math.round(matching/8*10)};}
  return {state,phase,questions,current:()=>questions()[state.acknowledged]||null,answer,acknowledge,match,submit,score,recovered:()=>recovered,serialize:()=>copy(state)};
 }
 LE.Assessment={create,select,shuffle};
})();
