/* Small procedural feedback scenes; no raster downloads or scary injury imagery. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};
 function paint(c,options={}){
  const {decision,phase='question',time=0,reducedMotion=false,playerArt={}}=options;
  const t=reducedMotion?0:time,caution=['consequence','rescue','retry','timeout'].includes(phase),happy=['learn','complete','chapter'].includes(phase);
  c.imageSmoothingEnabled=false;c.clearRect(0,0,384,128);c.fillStyle='#d8dfc1';c.fillRect(0,0,384,128);
  for(let y=0;y<128;y+=32)for(let x=0;x<384;x+=32)LE.Art.drawTile(c,y<32?'wall':'floor',x,y);
  LE.Art.drawProp(c,'blackboard',155,0,2);LE.Art.drawProp(c,'desk',275,53,1.5);
  const id=decision&&decision.id;
  if(id==='PR_D1')LE.Art.drawProp(c,'bookshelf',20,20,1.6);
  if(id==='PR_D2'){LE.Art.drawTile(c,'open_door',20,10,1.5);LE.Art.drawProp(c,'books',27,51,1.4);}
  if(id==='PR_D4')LE.Art.drawProp(c,'bag',28,55,1.2);
  if(id==='PR_D8')LE.Art.drawProp(c,'cracked_panel',27,9,1.5);
  const shift=caution?(1-Math.cos(Math.min(t,1.5)/1.5*Math.PI))*12:0;
  LE.Art.drawCharacter(c,126+shift,108,{...playerArt,direction:'right',time:t,walking:false,reducedMotion},2);
  LE.Art.drawCharacter(c,220,104,{npc:'mara',direction:'left',time:t,reducedMotion},2);
  if(id==='PR_D5'||id==='PR_D7')LE.Art.drawCharacter(c,310,107,{npc:id==='PR_D5'?'bea':'lino',direction:'left',time:t,reducedMotion},1.5);
  LE.Art.drawCharacter(c,57,117,{npc:'bantay',direction:'right',time:t,reducedMotion},1.5);
  if(caution||happy){const emote=LE.Art.emote(happy?'happy':'help',reducedMotion?0:Math.floor(t*2)%2);c.drawImage(emote,134,16+(reducedMotion?0:Math.round(Math.sin(t*2)*2)),24,24);}
  c.fillStyle=caution?'#bc873d':'#426c4e';c.fillRect(0,124,384,4);
 }
 LE.DecisionArt={paint};
})();
