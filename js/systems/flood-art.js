/* Native pixel panels: water is outside; students remain on a dry checked upper floor. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};
 const levels={'flood-low':172,'flood-high':112,receding:190};
 function water(c,y,time=0,reducedMotion=false){const t=reducedMotion?0:time;c.fillStyle='#4b8998';c.fillRect(0,y,640,220-y);for(let row=0;row<5;row++)for(let i=0;i<12;i++){const x=(i*61+row*29+Math.floor(t*8))%660-12;c.fillStyle=row%2?'#78aab0':'#a4c8c2';if(y+8+row*19<220)c.fillRect(x,y+8+row*19,22,2);}}
 function route(c,o){
  const data=LE.Data.flood,fil=o.language==='fil',selected=o.route||[],points=[[92,87],[272,87],[272,249],[514,249]],wet=[514,87];c.fillStyle='#cdd9ad';c.fillRect(0,0,640,360);for(let x=0;x<640;x+=32)for(let y=0;y<360;y+=32)if((x+y)%96===0)LE.Art.drawTile(c,'grass',x,y);
  c.lineWidth=25;c.strokeStyle='#e8dbb1';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.strokeStyle='#426957';c.lineWidth=5;c.beginPath();points.slice(0,Math.max(1,selected.length)).forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();
  c.fillStyle='#5796a6';c.fillRect(410,25,215,125);for(let i=0;i<7;i++){c.fillStyle='#a8d2d0';c.fillRect(425+i*26,58+(i%2)*28,17,3);}c.strokeStyle='#a34f42';c.lineWidth=5;c.beginPath();c.moveTo(486,63);c.lineTo(540,112);c.moveTo(540,63);c.lineTo(486,112);c.stroke();
  c.font='bold 13px sans-serif';c.textAlign='center';data.route.forEach((node,i)=>{const [x,y]=points[i];c.fillStyle=selected.includes(node.id)?'#356752':'#746544';c.fillRect(x-64,y-27,128,54);c.fillStyle='#fff7dd';c.fillRect(x-61,y-24,122,48);c.fillStyle='#233d35';c.fillText(String(i+1)+(selected.includes(node.id)?' ✓':''),x,y-3);c.font='12px sans-serif';const labels=fil?[['Silid'],['Tuyong pasilyo'],['Nasuring hagdan'],['Pagtitipunan','sa itaas']]:[['Classroom'],['Dry corridor'],['Checked stairs'],['Upper','assembly']];labels[i].forEach((label,n)=>c.fillText(label,x,y+12+n*13));c.font='bold 13px sans-serif';});
  c.fillStyle='#442e27';c.fillText(fil?'BAHA · SARADO':'FLOODED · CLOSED',wet[0],137);c.fillText(fil?'MAPA NG PAGSASANAY · SURIIN ANG TUNAY NA PLANO':'PRACTICE MAP · CHECK YOUR REAL SCHOOL PLAN',320,337);c.textAlign='start';
 }
 function paint(c,o={}){
  const task=o.task||{},phase=task.weather||'recovery',time=o.reducedMotion?0:o.time||0,fil=o.language==='fil';c.save();c.imageSmoothingEnabled=false;c.clearRect(0,0,640,360);
  if(task.type==='route'){route(c,o);c.restore();return;}
  if(phase==='clear'||phase==='rain'&&task.type==='board'){
   if(task.type!=='board'){LE.StoryArt.paint(c,o);c.restore();return;}
   c.fillStyle='#e7e1bc';c.fillRect(0,0,640,360);c.fillStyle='#374f42';c.font='bold 20px sans-serif';c.fillText(fil?'BABALA SA ULAN':'RAINFALL WARNINGS',45,50);
   const colors=['#e8c84f','#d78b45','#b65748'],labels=fil?['KAMALAYAN','PAGHAHANDA','PAGTUGON']:['AWARENESS','PREPAREDNESS','RESPONSE'];for(let i=0;i<3;i++){c.fillStyle=colors[i];c.fillRect(35+i*204,80,180,170);c.fillStyle='#253b34';c.fillRect(42+i*204,143,166,53);c.fillStyle='#fff9df';c.font='bold 14px sans-serif';c.fillText(['YELLOW','ORANGE','RED'][i],64+i*204,167);c.font='11px sans-serif';c.fillText(labels[i],53+i*204,186);c.fillStyle='#f4ecd1';c.fillRect(85+i*204,96,62,17);c.fillRect(98+i*204,87,35,12);c.fillStyle='#397e92';for(let drop=0;drop<3;drop++)c.fillRect(95+i*204+drop*18,117+(drop%2)*4,4,11);}c.fillStyle='#374f42';c.font='14px sans-serif';c.fillText(fil?'Sundin nang maaga ang opisyal na tagubilin.':'Follow official instructions early.',45,304);c.restore();return;
  }
  // View out of upper-floor windows onto a separate lower building and grounds.
  c.fillStyle='#a4b8b0';c.fillRect(0,0,640,224);c.fillStyle='#6d8a75';c.fillRect(0,164,640,60);LE.Art.drawProp(c,'tree',31,67,2.5);LE.Art.drawProp(c,'tree',541,55,2.7);
  c.fillStyle='#e2d2a6';c.fillRect(111,64,373,148);c.fillStyle='#9e6d4b';c.fillRect(99,51,397,15);c.fillStyle='#586c5b';for(let i=0;i<4;i++)c.fillRect(130+i*88,91,50,44);c.fillRect(266,151,47,62);c.fillStyle='#9e6d4b';c.fillRect(111,139,373,7);
  if(levels[phase])water(c,levels[phase],time,o.reducedMotion);
  if(['rain','flood-low','flood-high'].includes(phase))LE.Weather.paint(c,{...o,phase:'rain',outdoor:true});
  // Solid room floor and window rail mask all water. No water is painted over students.
  c.fillStyle=o.highContrast?'#fff4d5':'#e3d6b0';c.fillRect(0,224,640,136);for(let y=240;y<360;y+=24){c.fillStyle='#c3b892';c.fillRect(0,y,640,1);}c.fillStyle='#36564b';c.fillRect(0,214,640,13);for(let x=0;x<640;x+=157){c.fillStyle='#698674';c.fillRect(x,0,13,224);}c.fillStyle='#d5d0aa';c.fillRect(0,0,640,21);
  c.fillStyle='#2d4b40';c.fillRect(13,24,291,28);c.fillStyle='#fff7df';c.font='bold 12px sans-serif';c.fillText(fil?'TUYO · APRUBADONG LUGAR SA ITAAS':'DRY · APPROVED UPPER ASSEMBLY',22,42);
  LE.Art.drawProp(c,'radio',505,253,1.6);LE.Art.drawProp(c,'bag',107,285,1.8);LE.Art.drawProp(c,'water_bottle',480,297,1.3);LE.Art.drawProp(c,'route_marker',24,264,1.5);
  const feedback=o.feedback||'',caution=['consequence','rescue','retry'].includes(feedback);LE.Art.drawCharacter(c,270,320,{...o.playerArt,direction:'right',time,reducedMotion:o.reducedMotion},2);LE.Art.drawCharacter(c,354,314,{npc:'mara',direction:'left',time,reducedMotion:o.reducedMotion},2);LE.Art.drawCharacter(c,194,313,{npc:task.npc&&task.npc!=='mara'?task.npc:'bea',direction:'right',time,reducedMotion:o.reducedMotion},1.8);LE.Art.drawCharacter(c,426,315,{npc:'jomar',direction:'left',time,reducedMotion:o.reducedMotion},1.8);LE.Art.drawCharacter(c,319,351,{npc:'bantay',direction:'right',time,reducedMotion:o.reducedMotion},1.5);
  if(caution||feedback==='learn')c.drawImage(LE.Art.emote(caution?'help':'happy'),272,235,27,27);c.restore();
 }
 LE.FloodArt={paint,water,levels};
})();
