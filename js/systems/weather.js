/* Bounded procedural wind/rain layers. No lightning flashes or rapid flicker. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};let mask=null;
 function paint(c,options={}){
  const width=options.width||640,height=options.height||360,phase=options.phase||'clear',time=options.reducedMotion?0:options.time||0,outdoor=options.outdoor===true;
  if(phase==='clear'||phase==='recovery')return;
  const storm=['storm','outage'].includes(phase),lull=phase==='lull';
  c.save();c.fillStyle=lull?'rgba(107,130,134,0.08)':storm?'rgba(24,52,68,0.18)':'rgba(89,116,127,0.10)';c.fillRect(0,0,width,height);
  c.save();if(!outdoor){c.beginPath();c.rect(18,34,width-36,112);c.clip();}
  const count=options.reducedMotion?12:storm?64:lull?10:28;
  c.strokeStyle=lull?'#b7ccc5':'#b4cdcf';c.lineWidth=1;
  for(let i=0;i<count;i++){const x=((i*83+time*(storm?138:60))%(width+80))-40,y=(i*47+time*(storm?153:90))%height;c.beginPath();c.moveTo(x,y);c.lineTo(x-(storm?7:3),y+7);c.stroke();}
  if(storm){for(let i=0;i<7;i++){const x=((i*121+time*97)%(width+80))-40,y=64+(i*29)%85+Math.sin(time+i)*4;c.fillStyle=i%2?'#9aaa79':'#a9aa8a';c.fillRect(x,y,8,3);}const x=((time*85+90)%(width+190))-95;LE.Art.drawProp(c,'roof_sheet',x,52,1.1);}
  c.restore();
  if(options.leak){for(let i=0;i<5;i++){const y=157+(i*19+time*29)%110;c.fillStyle='#8eb8b3';c.fillRect(562,y,2,5);}c.strokeStyle='#c49b5e';c.lineWidth=2;c.strokeRect(538,160,58,117);}
  if(phase==='outage'){
   if(!mask){mask=document.createElement('canvas');mask.width=640;mask.height=360;}const m=mask.getContext('2d');if(m){m.clearRect(0,0,640,360);m.globalCompositeOperation='source-over';m.fillStyle='rgba(12,28,34,0.68)';m.fillRect(0,0,640,360);m.globalCompositeOperation='destination-out';m.beginPath();m.arc(320,239,94,0,Math.PI*2);m.fill();m.globalCompositeOperation='source-over';c.drawImage(mask,0,0,width,height);}
  }
  c.restore();
 }
 LE.Weather={paint};
})();
