/* Pure mini-game models: all input paths share validation and scoring. */
(function(){
 'use strict';const LE=window.LE=window.LE||{},clone=x=>JSON.parse(JSON.stringify(x)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const unique=(a,allowed)=>Array.isArray(a)?[...new Set(a.filter(x=>allowed.includes(x)))]:[];
 const config=()=>LE.Data.minigames,ids=()=>config().games.map(g=>g.id);
 const supplies=story=>config().bag.filter(x=>!x.floodOnly||story==='flood');
 const finite=(n,max)=>Number.isFinite(n)?clamp(n,0,max):0;
 function create(id,story,saved){
  if(!ids().includes(id)||!['typhoon','flood','earthquake','tsunami'].includes(story))throw Error('Unknown mini-game');
  const d={reported:[],inspected:null,bag:[],checked:false,step:0,holdMs:0,running:false,promptMs:0,coach:false,mode:'gentle',breathMs:0,grounded:[],route:null,team:[null,null,null,null],selectedRole:null,sorted:{},repaired:false,stage:'sort',paint:[null,null,null,null,null,null],plants:[],stamps:[],message:null};
  const state={version:1,id,story,phase:'playing',errors:0,activeMs:0,data:d,feedback:null};
  function solved(){
   if(id==='hunt')return d.reported.length===6;
   if(id==='bag')return d.bag.length===8&&d.bag.every(key=>supplies(story).find(i=>i.id===key).useful)&&['water','light','whistle','contact'].every(key=>d.bag.includes(key));
   if(id==='drill')return d.step===3&&d.holdMs>=3000;
   if(id==='breathe')return d.mode==='ground'?d.grounded.length===5:d.breathMs>=(d.mode==='444'?24000:16000);
   if(id==='aid')return d.step===5;
   if(id==='chain')return d.route==='dry'&&d.team.every((role,i)=>role===i);
   return d.stage==='card'&&Object.keys(d.sorted).length===4&&d.repaired&&d.paint.every(x=>x!==null)&&d.plants.length===3&&d.message!==null&&d.stamps.length>0;
  }
  if(saved&&saved.version===1&&saved.id===id&&saved.story===story){
   const p=saved.data||{};state.errors=finite(saved.errors,1000);state.activeMs=finite(saved.activeMs,360000000);
   d.reported=unique(p.reported,config().hazards[story].filter(x=>x.hazard).map(x=>x.id));d.inspected=config().hazards[story].some(x=>x.id===p.inspected)?p.inspected:null;
   d.bag=unique(p.bag,supplies(story).map(x=>x.id)).slice(0,8);d.checked=p.checked===true;
   d.step=Number.isInteger(p.step)?clamp(p.step,0,id==='aid'?5:3):0;d.holdMs=finite(p.holdMs,3000);d.promptMs=finite(p.promptMs,25000);d.coach=p.coach===true;
   if(id==='drill'&&d.step===3&&d.holdMs<3000)d.step=2;
   d.mode=['gentle','444','ground'].includes(p.mode)?p.mode:'gentle';d.breathMs=finite(p.breathMs,d.mode==='444'?24000:16000);d.grounded=unique(p.grounded,[0,1,2,3,4]);
   d.route=p.route==='dry'?'dry':null;d.team=Array.from({length:4},(_,i)=>Number.isInteger(p.team&&p.team[i])&&p.team[i]>=0&&p.team[i]<4?p.team[i]:null);
   // Invalid duplicates in a malformed snapshot are cleared, not counted as a team.
   const used=new Set();d.team=d.team.map(x=>x===null||used.has(x)?null:(used.add(x),x));
   for(const item of config().cleanup)if(p.sorted&&p.sorted[item.id]===item.bin)d.sorted[item.id]=item.bin;
   d.paint=Array.from({length:6},(_,i)=>[0,1,2].includes(p.paint&&p.paint[i])?p.paint[i]:null);d.plants=unique(p.plants,[0,1,2]);d.stamps=unique(p.stamps,[0,1,2,3,4,5,6,7,8]);d.message=[0,1].includes(p.message)?p.message:null;
   d.repaired=p.repaired===true;const stages=['sort','repair','paint','plant','card'];d.stage=stages.includes(p.stage)?p.stage:'sort';
   if(Object.keys(d.sorted).length<4)d.stage='sort';
   else if(['paint','plant','card'].includes(d.stage)&&!d.repaired)d.stage='repair';
   else if(['plant','card'].includes(d.stage)&&d.paint.some(x=>x===null))d.stage='paint';
   else if(d.stage==='card'&&d.plants.length<3)d.stage='plant';
   if(solved()&&['learn','complete'].includes(saved.phase))state.phase=saved.phase;
   // A restored timed activity waits for an explicit start/resume gesture.
  }
  function fail(message='try'){state.errors++;state.feedback=message;return false;}
  function checkSolved(){if(solved()){state.phase='learn';d.running=false;state.feedback='correct';return true;}return false;}
  function act(action,value,extra){
   if(action==='ack'&&state.phase==='learn'){state.phase='complete';return true;}
   if(state.phase!=='playing')return false;state.feedback=null;
   if(id==='hunt'){
    const item=config().hazards[story].find(x=>x.id===value);if(!item)return false;
    if(action==='inspect'){d.inspected=item.id;return true;}
    if(action==='report'&&d.inspected===item.id){if(d.reported.includes(item.id))return false;if(!item.hazard)return fail();d.reported.push(item.id);state.feedback='reported';checkSolved();return true;}
    if(action==='safe'&&d.inspected===item.id){if(item.hazard)return fail();d.inspected=null;state.feedback='correct';return true;}
    return false;
   }
   if(id==='bag'){
    if(action==='toggle'&&supplies(story).some(x=>x.id===value)){if(d.bag.includes(value))d.bag=d.bag.filter(x=>x!==value);else if(d.bag.length===8){state.feedback='full';return false;}else d.bag.push(value);d.checked=false;return true;}
    if(action==='check'){d.checked=true;return checkSolved()||fail();}return false;
   }
   if(id==='drill'){
    if(action==='step'&&[0,1,2].includes(value)){
     if(value!==d.step)return fail();if(value===2){d.running=true;return true;}
     d.step++;d.promptMs=0;d.coach=false;state.feedback='correct';return true;
    }
    if(action==='stop'){d.running=false;return true;}return false;
   }
   if(id==='breathe'){
    if(action==='mode'&&['gentle','444','ground'].includes(value)){d.mode=value;d.running=false;d.breathMs=0;d.grounded=[];return true;}
    if(action==='start'&&d.mode!=='ground'){d.running=true;return true;}
    if(action==='stop'){d.running=false;return true;}
    if(action==='notice'&&d.mode==='ground'&&[0,1,2,3,4].includes(value)&&!d.grounded.includes(value)){d.grounded.push(value);checkSolved();return true;}return false;
   }
   if(id==='aid'){
    if(action!=='step')return false;const expected=config().aidSteps[d.step];if(!expected||value!==expected.id)return fail('aidWrong');d.step++;state.feedback='correct';checkSolved();return true;
   }
   if(id==='chain'){
    if(action==='route'){if(value!=='dry')return fail('routeNote');d.route='dry';return true;}
    if(action==='role'&&Number.isInteger(value)&&value>=0&&value<4){d.selectedRole=value;return true;}
    if(action==='place'&&d.route==='dry'&&Number.isInteger(value)&&value>=0&&value<4){const role=Number.isInteger(extra)?extra:d.selectedRole;if(role===null||role<0||role>3)return false;const old=d.team.indexOf(role);if(old>=0)d.team[old]=null;d.team[value]=role;d.selectedRole=null;return true;}
    if(action==='check')return checkSolved()||fail();return false;
   }
   if(id==='cleanup'){
    if(action==='sort'&&d.stage==='sort'){const item=config().cleanup.find(x=>x.id===value);if(!item||d.sorted[item.id])return false;if(extra!==item.bin)return fail();d.sorted[item.id]=extra;if(Object.keys(d.sorted).length===4)d.stage='repair';return true;}
    if(action==='repair'&&d.stage==='repair'){if(value!=='adult')return fail();d.repaired=true;d.stage='paint';return true;}
    if(action==='paint'&&d.stage==='paint'&&Number.isInteger(value)&&value>=0&&value<6&&[0,1,2].includes(extra)){d.paint[value]=extra;if(d.paint.every(x=>x!==null))d.stage='plant';return true;}
    if(action==='plant'&&d.stage==='plant'&&[0,1,2].includes(value)&&!d.plants.includes(value)){d.plants.push(value);if(d.plants.length===3)d.stage='card';return true;}
    if(action==='message'&&d.stage==='card'&&[0,1].includes(value)){d.message=value;return true;}
    if(action==='stamp'&&d.stage==='card'&&Number.isInteger(value)&&value>=0&&value<9){if(!d.stamps.includes(value))d.stamps.push(value);return true;}
    if(action==='finish'&&d.stage==='card')return checkSolved()||fail();return false;
   }return false;
  }
  function tick(milliseconds,timers=true){
   if(state.phase!=='playing'||!Number.isFinite(milliseconds)||milliseconds<=0)return false;const dt=Math.min(1000,milliseconds);state.activeMs+=dt;
   if(id==='drill'){
    if(d.step<2&&timers&&!d.coach){d.promptMs=Math.min(25000,d.promptMs+dt);if(d.promptMs===25000){d.coach=true;state.feedback='drillHint';return true;}}
    if(d.step===2&&d.running){d.holdMs=Math.min(3000,d.holdMs+dt);if(d.holdMs===3000){d.step=3;return checkSolved();}}
   }
   if(id==='breathe'&&d.running&&d.mode!=='ground'){d.breathMs=Math.min(d.mode==='444'?24000:16000,d.breathMs+dt);return checkSolved();}return false;
  }
  function result(){return state.phase==='complete'?{score:Math.max(40,100-state.errors*10),raw:id==='hunt'?18:null,errors:state.errors,activeMs:state.activeMs}:null;}
  return {state,act,tick,result,solved,serialize:()=>clone(state),pause:()=>{d.running=false;}};
 }
 function summary(records={}){
  let completed=0,total=0;for(const id of ids()){const r=records[id];if(r&&Number.isFinite(r.best)&&r.best>=0&&r.best<=100){completed++;total+=r.best;}}
  const contribution=Math.round(total/(ids().length*100)*20);return {completed,maximum:ids().length,contribution,finalized:completed===ids().length,component:completed===ids().length?contribution:null};
 }
 LE.MiniGames={create,supplies,summary,ids};
})();
