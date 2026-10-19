/* DOM-free movement, collision, pathfinding, doors, and exploration state. */
(function(){
  'use strict';const LE=window.LE=window.LE||{},TILE=32;
  const point=(x,y)=>({x:x*TILE+16,y:y*TILE+26});
  function create(profile,storyId,options={}){
    const maps=options.extraObjects?Object.fromEntries(Object.entries(LE.Data.maps).map(([id,map])=>[id,{...map,objects:map.objects.concat(options.extraObjects.filter(o=>o.map===id))}])):LE.Data.maps,knownIds=new Set(Object.values(maps).flatMap(map=>map.objects.map(item=>item.id)));
    const saved=profile.exploration&&profile.exploration[storyId]||{};
    const state={profileId:profile.id,storyId,mapId:maps[saved.mapId]?saved.mapId:'classroom',x:0,y:0,direction:['up','down','left','right'].includes(saved.direction)?saved.direction:'down',walking:false,path:[],pending:null,cooldown:0,dog:{x:0,y:0,direction:'left'},trail:[],visited:new Set((Array.isArray(saved.visited)?saved.visited:[]).filter(id=>maps[id])),seen:new Set((Array.isArray(saved.seen)?saved.seen:[]).filter(id=>knownIds.has(id))),objects:{},revision:0};
    if(saved.objects&&typeof saved.objects==='object')for(const [id,value]of Object.entries(saved.objects))if(knownIds.has(id)&&value&&typeof value==='object')state.objects[id]={reported:value.reported===true,collected:value.collected===true,on:value.on===true};
    const api={state,map:()=>maps[state.mapId]};
    function solid(map,x,y){
      if(x<0||y<0||x>=map.width||y>=map.height||map.blocked[y][x])return true;
      if(options.blocked&&options.blocked(map.id,x,y))return true;
      return map.objects.some(o=>o.solid&&!(state.objects[o.id]||{}).collected&&x>=o.x&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h);
    }
    function stand(x,y,map=api.map()){
      return [[x-6,y-9],[x+6,y-9],[x-6,y-2],[x+6,y-2]].every(([px,py])=>!solid(map,Math.floor(px/TILE),Math.floor(py/TILE)));
    }
    function safeSpawn(map,requested){
      const queue=[requested||map.spawn],seen=new Set();
      for(let i=0;i<queue.length;i++){
        const p=queue[i],key=p.x+','+p.y;if(seen.has(key)||p.x<0||p.y<0||p.x>=map.width||p.y>=map.height)continue;seen.add(key);
        const feet=point(p.x,p.y);if(stand(feet.x,feet.y,map))return feet;
        for(const [dx,dy]of [[0,1],[1,0],[-1,0],[0,-1]])queue.push({x:p.x+dx,y:p.y+dy});
      }throw new Error('No walkable spawn in '+map.id);
    }
    function resetTrail(){const x=state.x-32;state.dog={x:stand(x,state.y)?x:state.x,y:state.y,direction:'left'};state.trail=[{x:state.dog.x,y:state.dog.y},{x:state.x,y:state.y}];}
    const initial=Number.isFinite(saved.x)&&Number.isFinite(saved.y)&&stand(saved.x,saved.y)?saved:safeSpawn(api.map(),api.map().spawn);
    state.x=initial.x;state.y=initial.y;state.visited.add(state.mapId);resetTrail();
    function center(o){return{x:(o.x+o.w/2)*TILE,y:(o.y+o.h/2)*TILE+5};}
    function distance(o){const p=center(o);return Math.hypot(state.x-p.x,state.y-5-p.y);}
    function visibleLine(o){const target=center(o),steps=Math.ceil(distance(o)/8);for(let i=1;i<steps;i++){const t=i/steps,x=Math.floor((state.x+(target.x-state.x)*t)/32),y=Math.floor((state.y-5+(target.y-state.y+5)*t)/32);if(x>=o.x&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h)continue;if(solid(api.map(),x,y))return false;}return true;}
    function near(id){
      const candidates=api.map().objects.filter(o=>!((state.objects[o.id]||{}).collected)&&(!id||o.id===id)&&distance(o)<=58&&visibleLine(o));
      const facing={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[state.direction];
      return candidates.sort((a,b)=>{const score=o=>{const p=center(o),dx=p.x-state.x,dy=p.y-state.y;return distance(o)-Math.max(-1,Math.min(1,(dx*facing[0]+dy*facing[1])/Math.max(1,distance(o))))*14;};return score(a)-score(b);})[0]||null;
    }
    function findPath(tx,ty,objectId){
      const map=api.map(),start={x:Math.floor(state.x/32),y:Math.floor((state.y-4)/32)},goals=[];
      const target=objectId&&map.objects.find(o=>o.id===objectId);
      if(target){if(target.kind==='door')goals.push({x:target.x,y:target.y});else for(let y=target.y-1;y<=target.y+target.h;y++)for(let x=target.x-1;x<=target.x+target.w;x++){if(x>=target.x&&x<target.x+target.w&&y>=target.y&&y<target.y+target.h){if(!target.solid)goals.push({x,y});}else if(x>=target.x&&x<target.x+target.w||y>=target.y&&y<target.y+target.h)if(!solid(map,x,y))goals.push({x,y});}}
      else if(!solid(map,tx,ty))goals.push({x:tx,y:ty});
      const goalKeys=new Set(goals.map(p=>p.x+','+p.y)),queue=[start],parents=new Map([[start.x+','+start.y,null]]);
      for(let i=0;i<queue.length;i++){
        const p=queue[i],key=p.x+','+p.y;
        if(goalKeys.has(key)){const path=[];let current=p;while(current){path.unshift(point(current.x,current.y));current=parents.get(current.x+','+current.y);}path.shift();return path;}
        for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]]){const n={x:p.x+dx,y:p.y+dy},key=n.x+','+n.y;
          const otherDoor=map.objects.some(o=>o.kind==='door'&&o.id!==objectId&&o.x===n.x&&o.y===n.y);
          if(!parents.has(key)&&!otherDoor&&!solid(map,n.x,n.y)){parents.set(key,p);queue.push(n);}}
      }return null;
    }
    function enter(door){
      if(!door||door.kind!=='door'||!maps[door.target])return false;
      if(options.canEnter&&!options.canEnter(door,state.mapId)){state.path=[];state.pending=null;state.cooldown=.5;return false;}
      state.mapId=door.target;const spawn=safeSpawn(api.map(),door.arrival);state.x=spawn.x;state.y=spawn.y;state.path=[];state.pending=null;state.walking=false;state.cooldown=0.7;state.visited.add(state.mapId);state.revision++;resetTrail();return true;
    }
    function walk(dx,dy,dt){
      if(dx&&dy)dy=0;dx=Math.sign(dx);dy=Math.sign(dy);const distance=112*Math.min(0.05,Math.max(0,dt)),steps=Math.max(1,Math.ceil(distance/3));
      if(dx||dy)state.direction=dx<0?'left':dx>0?'right':dy<0?'up':'down';
      let moved=false;for(let i=0;i<steps;i++){const x=state.x+dx*distance/steps,y=state.y+dy*distance/steps;if(stand(x,y)){moved=moved||x!==state.x||y!==state.y;state.x=x;state.y=y;}}
      return moved;
    }
    function tick(dt,command={x:0,y:0}){
      dt=Math.min(0.05,Math.max(0,dt));state.cooldown=Math.max(0,state.cooldown-dt);let moved=false,interaction=null,transition=false;
      if(command.x||command.y){state.path=[];state.pending=null;moved=walk(command.x,command.y,dt);}
      else if(state.path.length){
        const target=state.path[0],dx=target.x-state.x,dy=target.y-state.y,step=112*dt;
        if(Math.abs(dx)<1&&Math.abs(dy)<1){state.x=target.x;state.y=target.y;state.path.shift();}
        else if(Math.abs(dx)>0.5){const amount=Math.min(Math.abs(dx),step);moved=walk(Math.sign(dx),0,amount/112);}
        else{const amount=Math.min(Math.abs(dy),step);moved=walk(0,Math.sign(dy),amount/112);}
      }
      state.walking=moved;
      if(moved){state.trail.push({x:state.x,y:state.y});if(state.trail.length>90)state.trail.shift();let length=0,chosen=state.trail[0];for(let i=state.trail.length-1;i>0;i--){const a=state.trail[i],b=state.trail[i-1],segment=Math.hypot(a.x-b.x,a.y-b.y);if(length+segment>=36){const t=(36-length)/Math.max(0.001,segment);chosen={x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};break;}length+=segment;chosen=b;}const dx=chosen.x-state.dog.x,dy=chosen.y-state.dog.y;if(Math.abs(dx)+Math.abs(dy)>0.1)state.dog.direction=Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down';state.dog.x=chosen.x;state.dog.y=chosen.y;}
      if(state.cooldown===0){const door=api.map().objects.find(o=>o.kind==='door'&&Math.floor(state.x/32)===o.x&&Math.floor((state.y-4)/32)===o.y);if(door)transition=enter(door);}
      if(!transition&&!state.path.length&&state.pending){interaction=near(state.pending);state.pending=null;}
      return {moved,transition,interaction};
    }
    function inspect(o){if(!o||!api.map().objects.includes(o))return false;state.seen.add(o.id);state.revision++;return true;}
    function act(o){
      if(!o||!near(o.id))return false;
      inspect(o);const record=state.objects[o.id]||(state.objects[o.id]={});
      if(o.action==='report')record.reported=true;
      else if(o.action==='collect')record.collected=true;
      else if(o.action==='toggle')record.on=!record.on;
      else return false;
      state.revision++;return true;
    }
    Object.assign(api,{point,solid,canStand:stand,safeSpawn,near,center,distance,findPath,enter,walk,tick,inspect,act,
      routeTo(x,y,id){const path=findPath(x,y,id);if(path===null)return false;state.path=path;state.pending=id||null;return true;},
      objectAt(x,y){return api.map().objects.slice().reverse().find(o=>!(state.objects[o.id]||{}).collected&&x>=o.x*32&&x<(o.x+o.w)*32&&y>=o.y*32&&y<(o.y+o.h)*32)||null;},
      serialize(){return{mapId:state.mapId,x:Math.round(state.x*10)/10,y:Math.round(state.y*10)/10,direction:state.direction,visited:[...state.visited],seen:[...state.seen],objects:JSON.parse(JSON.stringify(state.objects))};}
    });return api;
  }
  LE.World={create,point,tileSize:TILE};
})();
