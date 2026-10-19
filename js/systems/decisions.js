/* DOM-free decision state machine. Practice and later stories use the same rules. */
(function(){
  'use strict';const LE=window.LE=window.LE||{};
  const clone=x=>JSON.parse(JSON.stringify(x)),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const pathFor=percent=>percent>=85?'hero':percent>=60?'learner':'try-again';
  function scoreParts(raw,maximum,mini=null,quiz=null){
    const decisions=Number.isFinite(raw)&&Number.isFinite(maximum)&&maximum>0?Math.round(clamp(raw/maximum,0,1)*60):0;
    const part=x=>Number.isFinite(x)?clamp(Math.round(x),0,20):null,m=part(mini),q=part(quiz);
    return {decisions,mini:m,quiz:q,total:m===null||q===null?null:decisions+m+q};
  }
  function validate(sequence){
    if(!sequence||!sequence.id||!Array.isArray(sequence.decisions)||!sequence.decisions.length)throw Error('Missing decision sequence');
    const ids=new Set(),pillars=['prevention','preparedness','response','recovery'];let previous=-1;
    for(const d of sequence.decisions){
      if(ids.has(d.id)||!d.id||!pillars.includes(d.pillar)||!d.text||!d.funFact||!d.memory||!Array.isArray(d.choices)||d.choices.length!==3)throw Error('Invalid decision '+d.id);
      ids.add(d.id);const p=pillars.indexOf(d.pillar);if(p<previous)throw Error('Decisions must follow pillar order');previous=p;
      if(d.timer!==null&&d.timer!==undefined&&(!Number.isFinite(d.timer)||d.timer<20||d.timer>30||d.pillar!=='response'))throw Error('Invalid response timer');
      const choices=new Set();for(const c of d.choices){if(choices.has(c.id)||!c.id||!['best','okay','wrong'].includes(c.type)||!c.text||!c.learn)throw Error('Invalid choice');choices.add(c.id);}
      if(d.choices.filter(c=>c.type==='best').length!==1)throw Error('One best choice is required');
    }return true;
  }
  function create(sequence,saved){
    validate(sequence);const list=sequence.decisions;
    const state={version:1,sequence:sequence.id,contentVersion:sequence.version,index:0,phase:'question',safety:100,calm:100,records:{},chapters:{},activeMs:0,chapterMs:{},remainingMs:(list[0].timer||0)*1000,timerWaived:false};
    const current=()=>list[state.index]||null,record=()=>current()&&state.records[current().id],choice=()=>{const d=current(),r=record();return d&&r?d.choices.find(c=>c.id===r.choiceId):null;};
    function tally(pillar){let raw=0,maximum=0;for(const d of list){if(pillar&&d.pillar!==pillar)continue;maximum+=10;const r=state.records[d.id];if(!r)continue;const c=d.choices.find(c=>c.id===r.choiceId);if(r.rescue)raw=Math.max(0,raw-10);raw+=r.rescue?(r.retried?3:0):c.type==='best'?10:c.type==='okay'?5:r.retried?3:0;}return {raw,maximum,percent:maximum?Math.round(raw/maximum*100):0};}
    function chapterPath(p){const t=tally(p);return pathFor(t.maximum?t.raw/t.maximum*100:0);}
    function initialPhase(){const r=record(),c=choice();return r?(r.rescue&&!r.retried?'rescue':c.type==='best'||r.retried?'learn':'consequence'):'question';}
    if(saved&&saved.version===1&&saved.sequence===sequence.id&&saved.contentVersion===sequence.version){
      let valid=true;
      for(let i=0;i<list.length;i++){
        const d=list[i],r=saved.records&&saved.records[d.id];if(!r)break;
        if(!d.choices.some(c=>c.id===r.choiceId)){valid=false;break;}
        const c=d.choices.find(c=>c.id===r.choiceId);
        state.records[d.id]={choiceId:r.choiceId,retried:(c.type==='wrong'||r.rescue===true)&&r.retried===true,learned:r.learned===true&&(!(c.type==='wrong'||r.rescue===true)||r.retried===true),rescue:r.rescue===true};
        state.index=i;if(!state.records[d.id].learned)break;
        if(i<list.length-1)state.index=i+1;else state.index=list.length;
      }
      if(valid){
        state.safety=Number.isFinite(saved.safety)?clamp(saved.safety,1,100):100;state.calm=Number.isFinite(saved.calm)?clamp(saved.calm,0,100):100;
        state.activeMs=Number.isFinite(saved.activeMs)?clamp(saved.activeMs,0,360000000):0;
        for(const p of ['prevention','preparedness','response','recovery'])state.chapterMs[p]=Number.isFinite(saved.chapterMs&&saved.chapterMs[p])?clamp(saved.chapterMs[p],0,state.activeMs):0;
        state.timerWaived=saved.timerWaived===true;
        // A chapter reflection remains pending until explicitly continued.
        const si=saved.index,sd=list[si],sr=sd&&state.records[sd.id];
        if(saved.phase==='chapter'&&sd&&sr&&sr.learned&&(!list[si+1]||list[si+1].pillar!==sd.pillar))state.index=si;
        state.phase=state.index===list.length?'complete':initialPhase();
        if(state.phase!=='complete'){
          const c=choice(),r=record();
          if(!r&&saved.phase==='timeout')state.phase='timeout';
          if(r&&(c.type==='wrong'||r.rescue)&&!r.retried&&saved.phase==='retry')state.phase='retry';
          if(r&&(!(c.type==='wrong'||r.rescue)||r.retried)&&saved.phase==='learn')state.phase='learn';
          if(r&&r.learned&&saved.phase==='chapter')state.phase='chapter';
          state.remainingMs=Number.isFinite(saved.remainingMs)?clamp(saved.remainingMs,0,(current().timer||0)*1000):(current().timer||0)*1000;
        }
        for(const p of ['prevention','preparedness','response','recovery']){
          const ds=list.filter(d=>d.pillar===p);if(ds.length&&ds.every(d=>state.records[d.id]&&state.records[d.id].learned))state.chapters[p]=chapterPath(p);
        }
      }else {state.index=0;state.records={};}
    }
    function answer(id){
      const d=current();if(!d||!['question','retry'].includes(state.phase))return false;
      const c=d.choices.find(c=>c.id===id);if(!c)return false;
      if(state.phase==='retry'){
        if(c.type!=='best'||!record()||record().retried)return false;
        record().retried=true;state.calm=clamp(state.calm+5,0,100);state.phase='learn';return true;
      }
      if(record())return false;
      state.safety=clamp(state.safety+(c.type==='wrong'?-20:c.type==='okay'?-5:0),0,100);
      state.calm=clamp(state.calm+(c.type==='wrong'?-15:c.type==='okay'?-5:5),0,100);
      const rescue=state.safety===0;state.records[d.id]={choiceId:id,retried:false,learned:false,rescue};
      if(rescue){state.safety=60;state.calm=Math.max(60,state.calm);state.phase='rescue';}
      else state.phase=c.type==='best'?'learn':'consequence';
      return true;
    }
    function advance(){
      const d=current();if(!d)return false;
      if(state.phase==='timeout'){state.timerWaived=true;state.phase='question';return true;}
      if(state.phase==='consequence'||state.phase==='rescue'){state.phase=state.phase==='rescue'||choice().type==='wrong'?'retry':'learn';return true;}
      if(state.phase==='learn'){
        record().learned=true;
        if(!list[state.index+1]||list[state.index+1].pillar!==d.pillar){state.phase='chapter';state.chapters[d.pillar]=chapterPath(d.pillar);return true;}
      }else if(state.phase!=='chapter')return false;
      state.index++;state.phase=state.index>=list.length?'complete':'question';state.remainingMs=current()?(current().timer||0)*1000:0;state.timerWaived=false;return true;
    }
    function tick(milliseconds,timers=true){
      if(state.phase==='complete'||!Number.isFinite(milliseconds)||milliseconds<=0)return false;
      const dt=Math.min(1000,milliseconds);state.activeMs+=dt;const d=current();state.chapterMs[d.pillar]=(state.chapterMs[d.pillar]||0)+dt;
      if(timers&&state.phase==='question'&&d.timer&&!state.timerWaived){state.remainingMs=Math.max(0,state.remainingMs-dt);if(state.remainingMs===0){state.phase='timeout';return true;}}return false;
    }
    function review(){return list.filter(d=>state.records[d.id]&&state.records[d.id].learned).map(d=>({id:d.id,pillar:d.pillar,memory:d.memory,learn:d.choices.find(c=>c.type==='best').learn}));}
    return {state,current,record,choice,answer,advance,tick,tally,review,serialize:()=>clone(state),score:()=>scoreParts(tally().raw,tally().maximum),adjustCalm:delta=>{if(Number.isFinite(delta))state.calm=clamp(state.calm+delta,0,100);}};
  }
  LE.Decisions={create,validate,pathFor,scoreParts};
})();
