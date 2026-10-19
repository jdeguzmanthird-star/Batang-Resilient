/* Story-only earthquake activities. The seven-game studio API stays compatible. */
(function(){
 'use strict';const LE=window.LE=window.LE||{},copy=x=>JSON.parse(JSON.stringify(x)),baseCreate=LE.MiniGames.create;
 const ids=()=>['signal','retrofit'],bounded=n=>Number.isFinite(n)?Math.max(0,Math.min(360000000,n)):0;
 function create(id,story,saved){
  if(!ids().includes(id))return baseCreate(id,story,saved);if(story!=='earthquake')throw Error('Earthquake-only activity');
  const d={channel:null,taps:0,rested:false,assignments:[],cleared:false,paint:[null,null,null,null,null,null],thanks:false},state={version:1,id,story,phase:'playing',errors:0,activeMs:0,data:d,feedback:null};
  const solved=()=>id==='signal'?Boolean(d.channel&&d.taps===3&&d.rested):d.assignments.length===2&&d.cleared&&d.paint.every(x=>x!==null)&&d.thanks;
  if(saved&&saved.version===1&&saved.id===id&&saved.story===story){const p=saved.data||{};state.errors=Math.min(1000,Math.floor(bounded(saved.errors)));state.activeMs=bounded(saved.activeMs);d.channel=['tap','whistle'].includes(p.channel)?p.channel:null;d.taps=d.channel&&Number.isInteger(p.taps)?Math.max(0,Math.min(3,p.taps)):0;d.rested=d.taps===3&&p.rested===true;d.assignments=Array.isArray(p.assignments)?[...new Set(p.assignments.filter(x=>['anchor','ceiling'].includes(x)))]:[];d.cleared=d.assignments.length===2&&p.cleared===true;if(d.cleared)d.paint=Array.from({length:6},(_,i)=>[0,1,2].includes(p.paint&&p.paint[i])?p.paint[i]:null);d.thanks=d.cleared&&d.paint.every(x=>x!==null)&&p.thanks===true;if(solved()&&['learn','complete'].includes(saved.phase))state.phase=saved.phase;}
  function fail(){state.errors++;state.feedback=id==='signal'?'signalHint':'adultRepair';return false;}
  function act(action,value,extra){if(action==='ack'&&state.phase==='learn'){state.phase='complete';return true;}if(state.phase!=='playing')return false;state.feedback=null;
   if(id==='signal'){
    if(action==='channel'){if(!['tap','whistle'].includes(value))return fail();if(d.taps>0)return false;d.channel=value;return true;}
    if(action==='pulse'){if(!d.channel||d.taps>=3)return false;d.taps++;}
    else if(action==='rest'){if(d.taps!==3)return fail();d.rested=true;}
    else return false;
   }else{
    if(action==='assign'){if(!['anchor','ceiling'].includes(value)||d.assignments.includes(value))return false;if(extra!=='adult')return fail();d.assignments.push(value);}
    else if(action==='clearance'){if(d.assignments.length!==2||value!=='official')return false;d.cleared=true;}
    else if(action==='paint'){if(!d.cleared||!Number.isInteger(value)||value<0||value>=6||![0,1,2].includes(extra))return false;d.paint[value]=extra;}
    else if(action==='thanks'){if(!d.cleared||d.paint.some(x=>x===null))return false;d.thanks=true;}
    else return false;
   }state.feedback='correct';if(solved())state.phase='learn';return true;
  }
  return {state,act,solved,result:()=>state.phase==='complete'?{score:Math.max(40,100-state.errors*10),raw:null,errors:state.errors,activeMs:state.activeMs}:null,serialize:()=>copy(state),pause:()=>{},tick:ms=>{if(state.phase==='playing'&&Number.isFinite(ms)&&ms>0)state.activeMs+=Math.min(1000,ms);return false;}};
 }
 LE.QuakeGames={ids,create};LE.MiniGames.create=create;LE.MiniGames.storyIds=story=>LE.MiniGames.ids().concat(story==='earthquake'?ids():[]);
})();
