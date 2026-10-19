/* Shared renderer: the game and native-canvas QA use this same drawing code. */
(function(){
  'use strict';const LE=window.LE=window.LE||{};
  function cameraFor(model,width=640,height=360){const map=model.map();return{x:Math.max(0,Math.min(map.width*32-width,model.state.x-width/2)),y:Math.max(0,Math.min(map.height*32-height,model.state.y-height/2-12))};}
  function render(c,model,options={}){
    const width=options.width||640,height=options.height||360,camera=options.camera||cameraFor(model,width,height),time=options.time||0,reduced=Boolean(options.reducedMotion),map=model.map(),state=model.state;
    c.imageSmoothingEnabled=false;c.fillStyle='#d5dfc3';c.fillRect(0,0,width,height);c.save();c.translate(-Math.round(camera.x),-Math.round(camera.y));
    for(let y=Math.max(0,Math.floor(camera.y/32));y<Math.min(map.height,Math.ceil((camera.y+height)/32));y++)for(let x=Math.max(0,Math.floor(camera.x/32));x<Math.min(map.width,Math.ceil((camera.x+width)/32));x++){
      LE.Art.drawTile(c,map.tiles[y][x],x*32,y*32,1,(x+y)%4);
      if(map.outdoor&&(x===0||y===0||x===map.width-1||y===map.height-1)){c.fillStyle='#82936b';c.fillRect(x*32,y*32+19,32,3);c.fillRect(x*32+6,y*32+11,3,20);}
      if(!map.outdoor&&y===0&&x%5===2)LE.Art.drawTile(c,'window',x*32,y*32);
    }
    const nearest=model.near(),actors=[];
    for(const o of map.objects){if((state.objects[o.id]||{}).collected)continue;const x=o.x*32,y=o.y*32;if(x+o.w*32<camera.x-32||y+o.h*32<camera.y-32||x>camera.x+width+32||y>camera.y+height+32)continue;actors.push({depth:(o.y+o.h)*32,draw:()=>{
      if(o.kind==='door'){
        LE.Art.drawTile(c,'exit',x,y);c.fillStyle='#355a42';c.font='9px monospace';c.textAlign='center';const name=LE.Data.maps[o.target].name[options.language||'en'];c.fillText(name.slice(0,24),x+16,y-3);c.textAlign='left';
      }else if(o.npc){LE.Art.drawCharacter(c,x+16,y+31,{npc:o.npc,direction:'down',time,reducedMotion:reduced});if(!state.seen.has(o.id))c.drawImage(LE.Art.emote('help'),x+8,y-13);}
      else if(o.art){const image=LE.Art.prop(o.art);c.drawImage(image,x,y,o.w*32,o.h*32);}
      const record=state.objects[o.id]||{};
      if(record.reported){c.fillStyle='#467756';c.fillRect(x+24,y+2,6,6);c.fillStyle='#f9edbf';c.fillRect(x+26,y+3,2,3);}
      if(o.kind==='switch'&&record.on){c.fillStyle='#f3cf76';c.fillRect(x+24,y+2,5,5);}
      if(nearest&&nearest.id===o.id){c.strokeStyle=options.highContrast?'#102e20':'#fff0a6';c.lineWidth=2;c.strokeRect(x-2,y-2,o.w*32+4,o.h*32+4);c.drawImage(LE.Art.emote('sparkle',reduced?0:Math.floor(time)%3),x+o.w*32-7,y-10);}
    }});}
    const profileArt=options.playerArt||{};
    actors.push({depth:state.dog.y+1,draw:()=>LE.Art.drawCharacter(c,state.dog.x,state.dog.y,{npc:'bantay',direction:state.dog.direction,time,walking:state.walking,reducedMotion:reduced,vest:profileArt.outfit==='k9'})});
    actors.push({depth:state.y+2,draw:()=>LE.Art.drawCharacter(c,state.x,state.y,{...profileArt,direction:state.direction,time,walking:state.walking,reducedMotion:reduced})});
    actors.sort((a,b)=>a.depth-b.depth).forEach(actor=>actor.draw());c.restore();
  }
  LE.MapRenderer={render,cameraFor};
})();
