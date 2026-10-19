/* Coastal Recovery is story-only. Existing studio and earthquake factories delegate unchanged. */
(function(){
 'use strict';const LE=window.LE=window.LE||{},copy=x=>JSON.parse(JSON.stringify(x)),baseCreate=LE.MiniGames.create,baseIds=LE.MiniGames.storyIds||LE.MiniGames.ids,limit=n=>Number.isFinite(n)?Math.max(0,Math.min(360000000,n)):0;
 function create(id,story,saved){
  if(id!=='coastal')return baseCreate(id,story,saved);if(story!=='tsunami')throw Error('Tsunami-only activity');
  const d={safe:false,sorted:{},plants:[],label:null,arrow:null,map:[],thanks:false},state={version:1,id,story,phase:'playing',errors:0,activeMs:0,data:d,feedback:null},route=LE.Data.tsunami.route.map(n=>n.id),items=LE.Data.coastDonations;
  const sorted=()=>items.every(i=>d.sorted[i.id]===i.bin),solved=()=>d.safe&&sorted()&&d.plants.length===3&&d.label==='highground'&&d.arrow==='uphill'&&d.map.length===route.length&&d.thanks;
  if(saved&&saved.version===1&&saved.id===id&&saved.story===story){const p=saved.data||{};state.errors=Math.min(1000,Math.floor(limit(saved.errors)));state.activeMs=limit(saved.activeMs);d.safe=p.safe===true;if(d.safe)for(const i of items)if(p.sorted&&p.sorted[i.id]===i.bin)d.sorted[i.id]=i.bin;if(sorted()&&Array.isArray(p.plants))d.plants=[...new Set(p.plants.filter(n=>[0,1,2].includes(n)))];if(d.plants.length===3&&p.label==='highground')d.label=p.label;if(d.label&&p.arrow==='uphill')d.arrow=p.arrow;if(d.arrow&&Array.isArray(p.map))for(const node of p.map){if(node===route[d.map.length])d.map.push(node);else break;}d.thanks=d.map.length===route.length&&p.thanks===true;if(solved()&&['learn','complete'].includes(saved.phase))state.phase=saved.phase;}
  function act(action,value,extra){if(action==='ack'&&state.phase==='learn'){state.phase='complete';return true;}if(state.phase!=='playing')return false;state.feedback=null;const fail=()=>{state.errors++;state.feedback='try';return false;};
   if(action==='safety'){if(d.safe)return false;if(value!=='approved')return fail();d.safe=true;}
   else if(action==='sort'){const item=items.find(i=>i.id===value);if(!d.safe||!item||d.sorted[value])return false;if(extra!==item.bin)return fail();d.sorted[value]=extra;}
   else if(action==='plant'){if(!sorted()||![0,1,2].includes(value)||d.plants.includes(value))return false;d.plants.push(value);}
   else if(action==='label'){if(d.plants.length!==3||d.label)return false;if(value!=='highground')return fail();d.label=value;}
   else if(action==='arrow'){if(!d.label||d.arrow)return false;if(value!=='uphill')return fail();d.arrow=value;}
   else if(action==='route'){if(!d.arrow||d.map.length===route.length)return false;if(value!==route[d.map.length])return fail();d.map.push(value);}
   else if(action==='thanks'){if(d.map.length!==route.length)return false;d.thanks=true;}
   else return false;state.feedback='correct';if(solved())state.phase='learn';return true;
  }
  return{state,act,solved,result:()=>state.phase==='complete'?{score:Math.max(40,100-state.errors*10),raw:null,errors:state.errors,activeMs:state.activeMs}:null,serialize:()=>copy(state),pause:()=>{},tick:ms=>{if(state.phase==='playing'&&Number.isFinite(ms)&&ms>0)state.activeMs+=Math.min(1000,ms);return false;}};
 }
 LE.CoastGames={create,ids:()=>['coastal']};LE.MiniGames.create=create;LE.MiniGames.storyIds=story=>baseIds(story).concat(story==='tsunami'?['coastal']:[]);
})();
