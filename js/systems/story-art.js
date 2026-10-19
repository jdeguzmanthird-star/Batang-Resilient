/* The story's panels and effects share the game sprite system. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};
 function paint(c,options={}){
  const task=options.task||{},d=options.decision,phase=task.weather||'recovery',time=options.reducedMotion?0:options.time||0,feedback=options.feedback||'',caution=['consequence','rescue','retry'].includes(feedback);
  const outdoor=phase==='clear'&&d&&d.scene==='grounds';c.imageSmoothingEnabled=false;c.clearRect(0,0,640,360);
  if(outdoor){for(let y=0;y<360;y+=32)for(let x=0;x<640;x+=32)LE.Art.drawTile(c,y<96?'grass':'path',x,y);LE.Art.drawProp(c,'tree',61,34,4);LE.Art.drawProp(c,'clogged_drain',417,172,2.5);LE.Art.drawProp(c,'signboard',509,73,2);}
  else{
   c.fillStyle='#718c91';c.fillRect(0,0,640,150);for(let i=0;i<5;i++){const x=i*149+(Math.sin(time*.6+i)*(phase==='storm'?5:2));c.fillStyle='#607e83';c.fillRect(x,37,114,26);c.fillRect(x+24,24,67,21);}
   for(let i=0;i<4;i++){const x=32+i*157,tilt=options.reducedMotion?0:Math.sin(time*2+i)*(phase==='storm'||phase==='outage'?8:1);LE.Art.drawProp(c,'tree',x+tilt,69,2);}
   c.fillStyle='#869582';c.fillRect(519,40,3,102);c.fillStyle='#ce995a';c.beginPath();c.moveTo(522,43);c.lineTo(554,47+Math.sin(time*3)*3);c.lineTo(552,64+Math.sin(time*3)*3);c.lineTo(522,59);c.fill();
   LE.Weather.paint(c,{...options,phase,outdoor:true});
   c.fillStyle='#d8d5b1';c.fillRect(0,0,640,29);c.fillRect(0,146,640,214);for(let x=0;x<640;x+=32){c.fillStyle='#d7c9a1';c.fillRect(x,146,1,214);}for(let y=170;y<360;y+=32){c.fillStyle='#d7c9a1';c.fillRect(0,y,640,1);}
   c.fillStyle='#d4ceb0';for(const x of [0,152,310,468,622])c.fillRect(x,29,18,119);c.fillStyle='#a3b394';for(const x of [18,170,328,486]){c.fillRect(x,36,134,5);c.fillRect(x+65,37,4,109);}c.fillRect(0,140,640,8);
   LE.Art.drawProp(c,'desk',87,235,2);LE.Art.drawProp(c,'bag',458,251,1.6);LE.Art.drawProp(c,'radio',390,201,1.5);LE.Art.drawProp(c,'outlet',552,212,1.3);
   if(d&&d.id==='TY_D11'){LE.Art.drawProp(c,'electric_post',67,44,2);c.strokeStyle='#3f5749';c.lineWidth=3;c.beginPath();c.moveTo(78,70);c.lineTo(120,104);c.lineTo(69,122);c.stroke();}
  }
  const shift=caution?Math.min(1,time)*13:0;
  LE.Art.drawCharacter(c,283+shift,289,{...options.playerArt,time,direction:'right',reducedMotion:options.reducedMotion},2);
  LE.Art.drawCharacter(c,350,280,{npc:'mara',time,direction:'left',reducedMotion:options.reducedMotion},2);
  LE.Art.drawCharacter(c,210,291,{npc:d&&d.id==='TY_D8'?'bea':task.npc&&task.npc!=='mara'?task.npc:'lino',time,direction:'right',reducedMotion:options.reducedMotion},1.7);
  LE.Art.drawCharacter(c,422,291,{npc:'jomar',time,direction:'left',reducedMotion:options.reducedMotion},1.7);LE.Art.drawCharacter(c,235,331,{npc:'bantay',time,direction:'right',reducedMotion:options.reducedMotion},1.6);
  if(caution||feedback==='learn')c.drawImage(LE.Art.emote(caution?'help':'happy'),296,185,28,28);
  if(phase==='outage')LE.Art.drawProp(c,'flashlight',315,279,1.3);
  LE.Weather.paint(c,{...options,phase,outdoor:false,leak:d&&d.id==='TY_D7'});
 }
 LE.StoryArt={paint};
})();
