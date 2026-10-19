/* Procedural mini-game boards. DOM controls provide every canvas action too. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};
 const colors=['#e4ae5d','#77a986','#6c9da4'];
 const symbols=['mask','powerbank','clothes','toy','gamepad','candle','perfume','rope','umbrella','fishbowl','gloves'],cache=new Map();
 function symbol(name){
  if(cache.has(name))return cache.get(name);const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;const c=canvas.getContext('2d'),r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  if(name==='mask'){r(2,12,5,9,'#829d8e');r(25,12,5,9,'#829d8e');r(6,9,20,16,'#b8d7d3');r(9,13,14,2,'#779da1');r(9,18,14,2,'#779da1');}
  if(name==='powerbank'){r(7,4,18,25,'#4a7164');r(10,2,5,3,'#b3bda6');r(18,2,4,3,'#b3bda6');r(11,8,10,15,'#d9ddba');r(15,10,3,5,'#e6b75d');r(12,14,7,3,'#e6b75d');r(13,17,3,5,'#e6b75d');}
  if(name==='clothes'){r(4,3,24,27,'#a9c9c7');r(7,6,18,3,'#e4eee0');r(10,11,12,15,'#e1a85f');r(6,12,5,6,'#e1a85f');r(21,12,5,6,'#e1a85f');r(14,10,4,4,'#a9c9c7');}
  if(name==='toy'){r(7,5,6,6,'#ad8351');r(19,5,6,6,'#ad8351');r(8,9,16,12,'#c29b63');r(10,19,12,10,'#ad8351');r(6,22,5,6,'#c29b63');r(21,22,5,6,'#c29b63');r(11,13,3,3,'#2b4a38');r(19,13,3,3,'#2b4a38');r(14,17,5,3,'#e7ca8a');}
  if(name==='gamepad'){r(5,9,22,13,'#7799a1');r(2,16,8,11,'#7799a1');r(22,16,8,11,'#7799a1');r(8,12,3,9,'#284d3e');r(5,15,9,3,'#284d3e');r(22,12,3,3,'#e5b368');r(25,16,3,3,'#d08c61');}
  if(name==='candle'){r(9,13,10,17,'#e8d5a1');r(13,8,3,6,'#775d3a');r(12,3,6,7,'#e4a05e');r(23,16,5,14,'#8c6646');r(23,12,5,5,'#d18a53');}
  if(name==='perfume'){r(10,3,12,6,'#a59383');r(13,8,6,5,'#bca9a0');r(7,12,18,17,'#bda7bc');r(10,18,12,6,'#e9d3cc');}
  if(name==='rope'){c.strokeStyle='#ac8a50';c.lineWidth=3;for(let i=0;i<3;i++){c.beginPath();c.ellipse(16,15,11-i*3,8-i*2,0,0,Math.PI*2);c.stroke();}r(21,20,3,8,'#ac8a50');}
  if(name==='umbrella'){r(14,3,4,2,'#476e5c');r(7,6,18,4,'#ca9e5c');r(4,10,24,4,'#dbb56d');r(2,14,28,4,'#ca9e5c');r(15,18,3,10,'#526f5b');r(11,26,7,3,'#526f5b');}
  if(name==='fishbowl'){r(6,5,20,3,'#80a6a3');r(4,8,24,17,'#b7d6d0');r(8,24,16,4,'#80a6a3');r(7,14,18,10,'#84b6b7');r(11,16,10,5,'#e4ae5d');r(8,14,4,8,'#e4ae5d');r(19,17,2,2,'#335e4a');}
  if(name==='gloves'){r(3,13,10,14,'#aecbd0');r(4,6,3,10,'#aecbd0');r(8,4,3,12,'#aecbd0');r(11,7,3,11,'#aecbd0');r(18,13,10,14,'#aecbd0');r(18,7,3,11,'#aecbd0');r(22,4,3,12,'#aecbd0');r(26,6,3,10,'#aecbd0');}
  cache.set(name,canvas);return canvas;
 }
 function icon(c,prop,x,y,scale=1){if(symbols.includes(prop))c.drawImage(symbol(prop),x,y,32*scale,32*scale);else if(LE.Art.tileNames.includes(prop))LE.Art.drawTile(c,prop,x,y,scale);else LE.Art.drawProp(c,prop,x,y,scale);}
 function paint(c,model,options={}){
  const id=model.state.id,d=model.state.data,t=options.reducedMotion?0:options.time||0,player=options.playerArt||{},language=options.language||'en',text=x=>x[language]||x.en;
  c.imageSmoothingEnabled=false;c.clearRect(0,0,640,224);c.fillStyle='#dfdfc1';c.fillRect(0,0,640,224);
  for(let y=0;y<224;y+=32)for(let x=0;x<640;x+=32)LE.Art.drawTile(c,y<32?'wall':id==='cleanup'&&d.stage==='plant'?'grass':'floor',x,y);
  const label=(value,x,y,color='#264d39',size=16)=>{c.fillStyle=color;c.font='bold '+size+'px sans-serif';c.fillText(value,x,y);};
  const person=(npc,x,y,scale=2)=>LE.Art.drawCharacter(c,x,y,{npc,time:t,direction:'down',...(!npc?player:{}),reducedMotion:options.reducedMotion},scale);
  if(id==='hunt'){
   const items=LE.Data.minigames.hazards[model.state.story];items.forEach((item,i)=>{const x=20+(i%3)*158,y=10+Math.floor(i/3)*69;c.fillStyle=d.reported.includes(item.id)?'#c3dab0':'#efe8ca';c.fillRect(x,y,145,61);icon(c,item.prop,x+48,y+3,1.5);label(String(i+1)+(d.reported.includes(item.id)?' ✓':''),x+7,y+24);});person(null,553,151);person('bantay',571,205,1.5);
  }else if(id==='bag'){
   icon(c,'bag',27,64,3);label(d.bag.length+'/8',63,201);for(let i=0;i<8;i++){const x=172+(i%4)*101,y=40+Math.floor(i/4)*83;c.fillStyle='#fff5d7';c.fillRect(x,y,88,73);c.strokeStyle='#9caf8f';c.strokeRect(x,y,88,73);const item=LE.MiniGames.supplies(model.state.story).find(item=>item.id===d.bag[i]);if(item)icon(c,item.prop,x+20,y+8,1.6);label(String(i+1),x+4,y+18);}
  }else if(id==='drill'){
   const shift=d.running?Math.round(Math.sin(t*5)):0;icon(c,'window_latch',40,33,2);person('mara',509,184);
   const frame=LE.Art.frame({...player,direction:'down'}),py=d.step===0?124:d.step===1?155:181;c.drawImage(frame,255+shift,py,64,d.step===0?64:38);
   if(d.step>0){c.strokeStyle='#f5dca8';c.lineWidth=5;c.beginPath();c.moveTo(268+shift,py+13);c.lineTo(284+shift,py+4);c.lineTo(299+shift,py+13);c.stroke();}
   if(d.step>=2)icon(c,'desk',236+shift,111,3);else icon(c,'desk',330,111,3);
   label(['1 · DROP','2 · COVER','3 · HOLD','✓'][d.step],211,49);if(d.running)label(Math.ceil((3000-d.holdMs)/1000)+'…',335,84);
  }else if(id==='breathe'){
   person('bea',143,186);person(null,496,186);const cycle=d.mode==='444'?12000:8000,position=d.breathMs%cycle,progress=position/4000;
   const r=options.reducedMotion?40:d.mode==='ground'?35:progress<1?25+progress*28:d.mode==='444'&&progress<2?53:53-(progress-(d.mode==='444'?2:1))*28;
   c.fillStyle='#b6cfaa';c.beginPath();c.arc(320,121,Math.max(25,Math.min(53,r)),0,Math.PI*2);c.fill();c.strokeStyle='#426e50';c.lineWidth=3;c.beginPath();c.arc(320,121,65,0,Math.PI*2);c.stroke();
   if(d.mode==='ground')label(d.grounded.length+'/5',300,128);else label(String(Math.min(4,Math.floor(position%4000/1000)+1)),313,128);person('bantay',564,207,1.5);
  }else if(id==='aid'){
   icon(c,'cot',237,84,3);c.fillStyle='#d4ae80';c.fillRect(267,121,25,25);c.fillStyle='#a4bdc0';c.fillRect(292,125,60,19);c.fillStyle='#264d39';c.fillRect(272,129,4,4);
   person('mara',425,191);person(null,122,191);icon(c,'first_aid',50,54,1.5);icon(c,'water_bottle',509,71,1.5);label(d.step+'/5',299,43);
   if(d.step>=2){c.fillStyle='#f4f1dd';c.fillRect(314,130,19,15);c.strokeStyle='#789f95';c.strokeRect(314,130,19,15);}
  }else if(id==='chain'){
   c.fillStyle='#b5d0c4';c.fillRect(0,184,131,40);label('×',51,215,'#8b482f',26);
   for(let i=0;i<4;i++){const x=421-i*90,y=44+i*33;c.fillStyle='#c1c6a4';c.fillRect(x-28,y+21,88,154-y);c.fillStyle='#e9e4c8';c.fillRect(x-28,y+21,88,9);label(String(i+1),x-24,y+17);const role=d.team[i];if(role!==null){if(role===0)person('mara',x+20,y+39,1.5);else if(role===3)person('kuya',x+20,y+39,1.5);else{person(role===1?'bea':null,x+9,y+39,1.25);person(role===1?'lino':'jomar',x+36,y+39,1.25);}}}
   icon(c,'route_marker',548,22,1.5);label('DRY / TUYO',447,207);
  }else{
   person('mara',560,197);const stage=d.stage;
   if(stage==='sort')LE.Data.minigames.cleanup.forEach((item,i)=>{const x=44+i*126;icon(c,item.prop,x,80,2);if(d.sorted[item.id])label('✓',x+20,64);});
   if(stage==='repair'){icon(c,'chair',273,91,2.8);icon(c,'bookshelf',60,40,3);person('kuya',405,189);}
   if(stage==='paint')for(let i=0;i<6;i++){const x=148+(i%3)*87,y=38+Math.floor(i/3)*72;c.fillStyle=d.paint[i]===null?'#e6dbc0':colors[d.paint[i]];c.fillRect(x,y,80,65);c.strokeStyle='#6a8563';c.strokeRect(x,y,80,65);}
   if(stage==='plant')for(let i=0;i<3;i++){const x=100+i*138;icon(c,'soil',x,132,2);if(d.plants.includes(i))icon(c,'seedling',x,95,2);}
   if(stage==='card'){
    c.fillStyle='#fff9e6';c.fillRect(67,20,444,183);c.strokeStyle='#b9c7a2';c.strokeRect(67,20,444,183);
    for(const i of d.stamps){const x=103+(i%3)*55,y=67+Math.floor(i/3)*39;c.fillStyle='#7b9b60';c.fillRect(x+8,y+13,3,13);c.fillRect(x+11,y+20,8,3);c.fillStyle='#d79560';for(const [dx,dy]of [[7,0],[0,7],[14,7],[7,14]])c.fillRect(x+dx,y+dy,8,8);c.fillStyle='#f2d07e';c.fillRect(x+7,y+7,8,8);}
    if(d.message!==null){const words=text(LE.Data.minigames.messages[d.message]).split(' ');let line='',y=60;for(const word of words){const next=line?line+' '+word:word;c.font='16px sans-serif';if(c.measureText(next).width>223){label(line,278,y,'#264d39',16);y+=25;line=word;}else line=next;}label(line,278,y,'#264d39',16);}
   }
  }
  c.fillStyle='#3b6b4b';c.fillRect(0,220,640,4);
 }
  LE.MiniArt={paint,icon,colors,symbols};
})();
