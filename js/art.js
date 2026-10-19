/* 32 px procedural art. Frames are cached lazily; no bitmap files are needed. */
(function(){
  'use strict';
  const LE=window.LE=window.LE||{};
  const SIZE=32;
  const directions=['down','left','right','up'];
  const skinTones=['#f0c99b','#d7a16b','#b77c50','#895639'];
  const hairColors=['#302e2e','#5b3c2d','#925d38','#353a52'];
  const palette={ink:'#36443e',grass:'#9fbc7d',grassDark:'#7b9e63',paper:'#fff2d2',wood:'#ac7a4c',woodDark:'#765637',water:'#6da6b2',wall:'#e9dbb6'};
  const outfits=LE.Data.outfits;
  const outfitById=new Map(outfits.map(item=>[item.id,item]));
  const cache=new Map();
  const sheetCache=new Map();
  const CACHE_LIMIT=384;
  function canvas(width=SIZE,height=SIZE){const result=document.createElement('canvas');result.width=width;result.height=height;return result;}
  function context(surface){const c=surface.getContext('2d');if(!c)throw new Error('Canvas 2D is unavailable.');c.imageSmoothingEnabled=false;return c;}
  function r(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
  function poly(c,points,color){c.fillStyle=color;c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(point=>c.lineTo(...point));c.closePath();c.fill();}
  function memo(key,make){
    if(cache.has(key)){const value=cache.get(key);cache.delete(key);cache.set(key,value);return value;}
    const value=make();cache.set(key,value);
    if(cache.size>CACHE_LIMIT)cache.delete(cache.keys().next().value);
    return value;
  }
  function pick(value,max,fallback=0){return Number.isInteger(value)?Math.max(0,Math.min(max,value)):fallback;}
  function stripe(c,x,y,width=10){r(c,x,y,width,2,'#f9dc78');r(c,x,y+2,width,1,'#dfe9ca');}
  function cross(c,x,y,color='#c3584e'){r(c,x+1,y,2,4,color);r(c,x,y+1,4,2,color);}
  const npcs=[
    {id:'mara',name:'Ma’am Mara',role:{en:'Teacher · DRRM coordinator',fil:'Guro · DRRM coordinator'},gender:'girl',skin:1,hairStyle:1,hairColor:0,outfit:'uniform',adult:true,top:'#bd8066',pants:'#4e6865'},
    {id:'kuya',name:'Kuya Rescue',role:{en:'Firefighter · Volunteer',fil:'Bumbero · Volunteer'},gender:'boy',skin:2,hairStyle:0,hairColor:0,outfit:'firefighter',adult:true},
    {id:'lino',name:'Lino',role:{en:'Your cheerful classmate',fil:'Masayahing kaklase'},gender:'boy',skin:1,hairStyle:2,hairColor:1,outfit:'uniform'},
    {id:'bea',name:'Bea',role:{en:'Your gentle classmate',fil:'Mahinhin na kaklase'},gender:'girl',skin:0,hairStyle:2,hairColor:0,outfit:'uniform'},
    {id:'jomar',name:'Jomar',role:{en:'Your energetic classmate',fil:'Masiglang kaklase'},gender:'boy',skin:2,hairStyle:1,hairColor:0,outfit:'uniform'},
    {id:'nena',name:'Aling Nena',role:{en:'Canteen vendor',fil:'Tindera sa kantina'},gender:'girl',skin:2,hairStyle:0,hairColor:1,outfit:'uniform',adult:true,top:'#d29a65',pants:'#7c8b67',apron:true},
    {id:'ben',name:'Tatay Ben',role:{en:'School guard',fil:'Guwardiya ng paaralan'},gender:'boy',skin:3,hairStyle:0,hairColor:0,outfit:'police',adult:true,top:'#83a8b4',pants:'#40576a',hat:'navy'},
    {id:'bantay',name:'Bantay',role:{en:'School dog · Your companion',fil:'Aso ng paaralan · Kasama mo'},species:'dog'}
  ];
  const npcById=new Map(npcs.map(item=>[item.id,item]));
  function normalize(input={}){
    const npc=npcById.get(input.npc)||{};
    const appearance=input.appearance||{};
    const options={gender:'boy',skin:1,hairStyle:0,hairColor:0,outfit:'uniform',direction:'down',frame:0,expression:'happy',...npc,...appearance,...input};
    options.skin=pick(options.skin,3,1);options.hairStyle=pick(options.hairStyle,2);options.hairColor=pick(options.hairColor,3);
    options.gender=['girl','boy'].includes(options.gender)?options.gender:'boy';
    options.outfit=outfitById.has(options.outfit)?options.outfit:'uniform';
    options.direction=directions.includes(options.direction)?options.direction:'down';
    options.frame=pick(options.frame,2);
    options.expression=['happy','worried','thinking'].includes(options.expression)?options.expression:'happy';
    return options;
  }
  function drawHair(c,o,back=false){
    const color=hairColors[o.hairColor],girl=o.gender==='girl',side=o.direction==='left'||o.direction==='right',up=o.direction==='up';
    if(back){
      if(girl&&o.hairStyle===0){r(c,9,8,14,12,color);r(c,8,13,3,5,color);r(c,21,13,3,5,color);}
      if(girl&&o.hairStyle===1){r(c,21,7,5,10,color);r(c,23,10,3,5,color);r(c,22,9,3,2,'#c97b57');}
      if(girl&&o.hairStyle===2){r(c,7,7,4,12,color);r(c,21,7,4,12,color);r(c,7,8,4,2,'#dfa65b');r(c,21,8,4,2,'#dfa65b');}
      return;
    }
    r(c,10,3,12,4,color);r(c,9,5,3,6,color);r(c,20,5,3,6,color);
    if(up){r(c,10,5,12,8,color);r(c,12,12,8,2,color);}
    else if(o.hairStyle===0){r(c,10,6,9,2,color);r(c,10,8,3,1,color);}
    else if(o.hairStyle===1){r(c,10,6,5,3,color);r(c,15,6,4,2,color);r(c,19,6,3,1,color);}
    else{r(c,8,4,3,4,color);r(c,11,2,4,3,color);r(c,17,2,4,3,color);r(c,21,4,3,4,color);r(c,12,6,2,3,color);r(c,16,6,2,2,color);}
    if(side&&!up)r(c,o.direction==='left'?19:10,8,3,5,color);
  }
  function face(c,o){
    if(o.direction==='up')return;
    const skin=skinTones[o.skin];r(c,10,6,12,8,skin);r(c,12,13,8,2,skin);
    if(o.direction==='left'||o.direction==='right'){
      const left=o.direction==='left';r(c,left?9:21,9,2,3,skin);r(c,left?11:19,9,1,2,palette.ink);r(c,left?10:20,12,2,1,'#8f5840');
    }else{
      r(c,12,9,2,2,palette.ink);r(c,18,9,2,2,palette.ink);
      if(o.expression==='worried'){r(c,12,8,2,1,palette.ink);r(c,18,8,2,1,palette.ink);r(c,15,12,3,1,'#8f5840');r(c,14,13,1,1,'#8f5840');}
      else if(o.expression==='thinking'){r(c,12,8,3,1,palette.ink);r(c,17,7,3,1,palette.ink);r(c,15,13,3,1,'#8f5840');}
      else{r(c,14,12,1,1,'#8f5840');r(c,17,12,1,1,'#8f5840');r(c,15,13,2,1,'#8f5840');}
    }
  }
  function hat(c,kind,direction){
    if(!kind)return;
    const up=direction==='up';
    if(kind==='fire'||kind==='hard'){
      const color=kind==='fire'?'#bd5544':'#edc15d';r(c,10,2,12,5,color);r(c,12,0,8,3,color);r(c,8,6,16,2,color);r(c,15,1,2,5,kind==='fire'?'#f4c770':'#ffe297');
      if(!up)r(c,14,4,4,3,kind==='fire'?'#ecd695':'#f5dfa1');
    }else if(kind==='nurse'){r(c,10,2,12,5,'#fff8e7');r(c,11,1,10,2,'#e3e6d4');if(!up)cross(c,14,2,'#6a9c83');}
    else{
      const color={police:'#3b5b7d',navy:'#eae4cb',tanod:'#8d764f',field:'#6f815c'}[kind]||'#6f815c';
      r(c,10,2,12,4,color);r(c,9,5,14,2,color);r(c,direction==='left'?7:direction==='right'?20:11,6,direction==='left'||direction==='right'?5:11,2,color);
      if(!up)r(c,15,4,3,2,'#ebc66a');
    }
  }
  function accessory(c,o,style){
    const kind=style.accessory,up=o.direction==='up',side=o.direction==='left'||o.direction==='right';
    if(kind==='tie'&&!up){r(c,15,16,2,6,'#44736b');r(c,13,15,2,2,'#d9dfc8');r(c,17,15,2,2,'#d9dfc8');}
    if(kind==='reflective'){stripe(c,10,20,12);stripe(c,10,16,12);r(c,12,26,2,1,'#ead879');r(c,18,26,2,1,'#ead879');}
    if(kind==='whistle'){r(c,12,16,1,6,'#e6d5a8');r(c,19,16,1,6,'#e6d5a8');if(!up)r(c,15,21,3,2,'#f6e2a5');stripe(c,10,18,12);}
    if(kind==='medicalbag'){r(c,21,20,7,7,'#3e8067');r(c,22,18,4,2,'#376452');cross(c,22,21,'#f3ead2');if(!up)r(c,14,17,4,5,'#548a72');}
    if(kind==='stethoscope'&&!up){r(c,12,16,1,5,'#5c8c80');r(c,19,16,1,5,'#5c8c80');r(c,13,20,7,1,'#5c8c80');r(c,15,20,2,3,'#5c8c80');}
    if(kind==='badge'&&!up)r(c,18,17,3,4,'#f4d17b');
    if(kind==='lifevest'){r(c,10,15,5,10,'#e98f48');r(c,17,15,5,10,'#e98f48');r(c,10,19,12,1,'#f3d995');r(c,14,18,4,2,'#4a6657');r(c,14,22,4,2,'#4a6657');}
    if(kind==='volunteer'){r(c,10,15,4,10,'#fcf4e0');r(c,18,15,4,10,'#fcf4e0');if(up)cross(c,14,18);else if(!side)cross(c,17,17);r(c,22,21,5,5,'#c55b4f');}
    if(kind==='flashlight'){r(c,23,20,3,7,'#485852');r(c,22,19,5,2,'#f5d481');r(c,11,17,3,4,'#8d784f');}
    if(kind==='weather'){r(c,22,18,6,10,'#a37e4d');r(c,23,19,4,7,'#ecedd8');r(c,24,20,2,2,'#e9bd65');r(c,23,23,4,1,'#6aa8b4');if(!up)r(c,12,16,3,3,'#a8d4d3');}
    if(kind==='seismograph'&&up){r(c,10,16,12,11,'#5b7468');r(c,12,18,8,5,'#b2c6a7');r(c,13,20,2,1,'#445b4e');r(c,15,19,1,3,'#445b4e');r(c,16,21,3,1,'#445b4e');}
    if(kind==='headset'){r(c,9,7,2,6,'#2b4141');r(c,21,7,2,6,'#2b4141');if(!up){r(c,21,12,1,3,'#2b4141');r(c,18,14,4,1,'#2b4141');}r(c,20,17,4,6,'#273e40');r(c,21,14,1,4,'#273e40');}
    if(kind==='k9'){r(c,10,15,4,10,'#5c7653');r(c,18,15,4,10,'#5c7653');r(c,11,18,2,3,'#a7a376');r(c,19,18,2,3,'#a7a376');r(c,14,21,4,2,'#c4b77b');}
    if(kind==='blueprint'){stripe(c,10,17,12);stripe(c,10,22,12);r(c,23,18,4,11,'#a3c6cd');r(c,22,18,6,2,'#d8e8da');r(c,24,21,1,5,'#669ba9');}
    if(kind==='cape'&&!up){poly(c,[[13,17],[20,17],[21,21],[16,25],[12,21]],'#e9cf79');r(c,15,19,3,3,'#56928a');}
    if(o.apron){r(c,12,16,8,10,'#f4e4b9');r(c,10,19,12,2,'#f4e4b9');}
    if(o.npc==='mara'&&!up){r(c,11,9,4,3,'#4b5c53');r(c,17,9,4,3,'#4b5c53');r(c,15,10,2,1,'#4b5c53');r(c,12,10,2,1,skinTones[o.skin]);r(c,18,10,2,1,skinTones[o.skin]);r(c,20,20,5,6,'#628d80');}
  }
  function human(input){
    const o=normalize(input);
    return memo('human:'+JSON.stringify(o),()=>{
      const surface=canvas(),c=context(surface),style={...outfitById.get(o.outfit).style};
      if(o.top)style.top=o.top;if(o.pants)style.pants=o.pants;if(o.hat)style.hat=o.hat;
      const skin=skinTones[o.skin],step=[0,-1,1][o.frame],side=o.direction==='left'||o.direction==='right',up=o.direction==='up';
      r(c,9,29,14,2,'#354e4633');
      drawHair(c,o,true);
      if(style.accessory==='cape'){poly(c,[[10,14],[22,14],[25,29],[19,28],[16,31],[8,28]],'#c66c55');r(c,10,16,3,10,'#ad5b48');}
      const legWidth=side?4:4,left=side?13:11,right=side?17:17;
      r(c,left,23+step,legWidth,6,style.pants);r(c,right,23-step,legWidth,6,style.pants);
      if(o.gender==='girl'&&o.outfit==='uniform')poly(c,[[11,22],[21,22],[23,26],[9,26]],style.pants);
      r(c,left-1,28+step,5,2,'#394744');r(c,right,28-step,5,2,'#394744');
      r(c,11,14,10,11,style.top);r(c,10,16,12,8,style.top);r(c,11,24,10,1,style.trim);
      r(c,8,16-step,3,6,style.top);r(c,8,21-step,3,3,skin);r(c,21,16+step,3,6,style.top);r(c,21,21+step,3,3,skin);
      r(c,14,13,4,3,skin);
      if(o.direction==='up')r(c,10,6,12,8,skin);else face(c,o);
      drawHair(c,o);accessory(c,o,style);hat(c,style.hat,o.direction);
      return surface;
    });
  }
  function dog(input={}){
    const o={direction:'down',frame:0,vest:false,...input};
    o.direction=directions.includes(o.direction)?o.direction:'down';o.frame=pick(o.frame,2);
    return memo('dog:'+JSON.stringify({direction:o.direction,frame:o.frame,vest:Boolean(o.vest)}),()=>{
      const surface=canvas(),c=context(surface),side=o.direction==='left'||o.direction==='right',up=o.direction==='up',step=[0,-1,1][o.frame];
      r(c,7,27,19,3,'#354e4633');
      if(side){
        c.save();if(o.direction==='left'){c.translate(32,0);c.scale(-1,1);}
        r(c,7,16,17,9,'#d8ad6b');r(c,8,24+step,3,4,'#bb8e54');r(c,20,24-step,3,4,'#bb8e54');
        r(c,19,9,10,12,'#e5c48e');r(c,18,9,4,9,'#8d6544');r(c,27,16,4,4,'#e5c48e');r(c,29,16,3,2,palette.ink);r(c,26,12,1,2,palette.ink);
        r(c,4,13+step,4,4,'#b6874e');r(c,3,10+step,3,4,'#b6874e');r(c,19,21,8,2,'#537f73');
        if(o.vest){r(c,9,16,11,8,'#6b835d');r(c,12,16,2,8,'#dcc57a');r(c,9,20,11,1,'#dcc57a');}
        c.restore();
      }else{
        r(c,10,17,12,10,'#d6ac69');r(c,10,26+step,4,3,'#b68a52');r(c,18,26-step,4,3,'#b68a52');
        r(c,10,7,12,13,'#e5c48e');r(c,7,7,5,11,'#8d6544');r(c,20,7,5,11,'#8d6544');
        if(!up){r(c,12,12,2,2,palette.ink);r(c,18,12,2,2,palette.ink);r(c,13,16,6,4,'#f2d7a7');r(c,15,16,3,2,palette.ink);r(c,16,19,2,2,'#c77f69');}
        r(c,11,20,10,2,'#537f73');r(c,21,21+step,5,3,'#b6874e');
        if(o.vest){r(c,10,22,12,4,'#6b835d');r(c,15,22,2,4,'#dcc57a');}
      }
      return surface;
    });
  }
  function frame(input={}){return input.npc==='bantay'||input.species==='dog'?dog(input):human(input);}
  function drawCharacter(c,x,y,input={},scale=1){
    const o={...input},moving=o.walking&&!o.reducedMotion;
    o.frame=o.reducedMotion?0:moving?Math.floor((o.time||0)*7)%3:pick(o.frame,2);
    const bounce=o.reducedMotion||moving?0:Math.round(Math.sin((o.time||0)*2)*0.6);
    delete o.time;delete o.walking;delete o.reducedMotion;
    const image=frame(o);c.imageSmoothingEnabled=false;
    c.drawImage(image,Math.round(x-SIZE*scale/2),Math.round(y-SIZE*scale+bounce),SIZE*scale,SIZE*scale);
  }
  function sheet(input={}){
    const key=JSON.stringify(normalize(input));
    if(sheetCache.has(key)){const existing=sheetCache.get(key);sheetCache.delete(key);sheetCache.set(key,existing);return existing;}
    const result=canvas(96,128),c=context(result);
    directions.forEach((direction,row)=>{for(let f=0;f<3;f++)c.drawImage(frame({...input,direction,frame:f}),f*32,row*32);});
    sheetCache.set(key,result);if(sheetCache.size>8)sheetCache.delete(sheetCache.keys().next().value);return result;
  }
  function portrait(input={}){
    const o=normalize({...input,direction:'down',frame:0});
    return memo('portrait:'+JSON.stringify(o),()=>{
      const result=canvas(64,64),c=context(result);
      r(c,0,0,64,64,'#e4e6ca');r(c,4,4,56,56,'#f8efd7');
      const actor=frame(o);c.drawImage(actor,8,0,16,22,8,0,48,66);
      return result;
    });
  }
  const tileNames=['grass','flowers','soil','garden','path','floor','floor_blue','wall','window','cracked_wall','door','open_door','steps','road','water','floodwater','drain','sand','shore','roof','roof_blue','exit','assembly','warning'];
  function tile(name,variant=0){
    if(!tileNames.includes(name))throw new Error('Unknown tile: '+name);
    variant=pick(variant,3);
    return memo('tile:'+name+':'+variant,()=>{
      const result=canvas(),c=context(result),shift=variant*3;
      const flecks=(color)=>{for(let i=0;i<12;i++)r(c,(i*13+shift)%30,(i*7+shift)%30,2,1,color);};
      if(['grass','flowers','garden'].includes(name)){r(c,0,0,32,32,palette.grass);flecks('#86a46c');if(name==='flowers')for(let i=0;i<4;i++){const x=4+i*7,y=7+(i*9)%19;r(c,x,y,1,4,'#668d56');r(c,x-1,y-1,3,2,i%2?'#efb776':'#f5df9f');}if(name==='garden'){r(c,2,2,28,28,'#ad895c');r(c,4,4,24,24,'#7f6445');for(let y=7;y<27;y+=8)for(let x=6;x<27;x+=6){r(c,x,y,2,5,'#567d4c');r(c,x-1,y,4,2,'#8ead65');}}}
      if(name==='soil'){r(c,0,0,32,32,'#b99c70');flecks('#9e805a');}
      if(['path','floor','floor_blue','assembly','exit','warning'].includes(name)){
        const blue=name==='floor_blue',base=blue?'#c7d7cf':'#dfd5b0';r(c,0,0,32,32,base);r(c,0,0,32,1,blue?'#a8c2bd':'#c5b993');r(c,0,0,1,32,blue?'#a8c2bd':'#c5b993');r(c,16,0,1,32,'#ffffff28');r(c,0,16,32,1,'#ffffff28');
        if(name==='path'){r(c,4,6,5,1,'#c2b996');r(c,22,11,4,1,'#c2b996');r(c,8,24,3,1,'#c2b996');r(c,19,27,6,1,'#e9e0bf');}
        if(name==='assembly'){r(c,4,4,24,1,'#eaecca');r(c,4,27,24,1,'#eaecca');r(c,4,4,1,24,'#eaecca');r(c,27,4,1,24,'#eaecca');r(c,13,10,6,6,'#69936c');r(c,11,17,10,6,'#69936c');}
        if(name==='exit'){r(c,5,8,22,15,'#56856d');poly(c,[[8,15],[15,10],[15,13],[23,13],[23,17],[15,17],[15,20]],'#f3efcb');}
        if(name==='warning'){poly(c,[[16,5],[28,26],[4,26]],'#dcb25e');r(c,15,12,2,7,'#6b6547');r(c,15,22,2,2,'#6b6547');}
      }
      if(['wall','window','cracked_wall'].includes(name)){r(c,0,0,32,32,palette.wall);r(c,0,0,32,4,'#cdb98e');r(c,0,27,32,5,'#baa47b');r(c,0,24,32,3,'#d9caa4');if(name==='window'){r(c,4,7,24,17,'#8c7957');r(c,6,8,20,14,'#84b3b9');r(c,15,8,2,14,'#f3e7c9');r(c,6,14,20,2,'#f3e7c9');r(c,4,23,24,2,'#a68b5f');}if(name==='cracked_wall'){for(const [x,y]of[[17,5],[16,8],[13,11],[15,14],[12,17],[13,20]])r(c,x,y,2,4,'#93856d');}}
      if(name==='door'||name==='open_door'){r(c,0,0,32,32,palette.wall);r(c,5,2,22,30,'#94734e');r(c,7,4,18,28,name==='door'?'#b18c5c':'#47655c');if(name==='door'){r(c,9,6,14,9,'#bdb187');r(c,21,19,2,2,'#f8d278');}else poly(c,[[7,4],[15,8],[15,31],[7,32]],'#a88b60');}
      if(name==='steps'){r(c,0,0,32,32,'#dad6b8');for(let y=2;y<32;y+=6){r(c,0,y,32,2,'#b9b79d');r(c,0,y+2,32,1,'#ede6c8');}}
      if(name==='road'){r(c,0,0,32,32,'#788c84');r(c,0,0,3,32,'#c5c4a5');r(c,29,0,3,32,'#c5c4a5');r(c,15,4,2,8,'#f1df9f');r(c,15,21,2,8,'#f1df9f');}
      if(['water','floodwater','shore'].includes(name)){const brown=name==='floodwater';r(c,0,0,32,32,brown?'#a99873':'#78b1b8');for(let i=0;i<4;i++){r(c,(i*11+shift)%25,4+i*7,7,1,brown?'#c4b38b':'#b1d3cb');r(c,(i*11+shift+3)%27,6+i*7,4,1,brown?'#988568':'#69a2ad');}if(name==='shore')poly(c,[[0,0],[10,0],[8,8],[14,16],[10,24],[14,32],[0,32]],'#e0cf9d');}
      if(name==='drain'){r(c,0,0,32,32,'#b9bd9b');r(c,5,0,22,32,'#5d8073');for(let y=3;y<32;y+=6)r(c,7,y,18,2,'#8d9e86');r(c,5,0,2,32,'#819680');}
      if(name==='sand'){r(c,0,0,32,32,'#e0cf9d');flecks('#c5b88c');}
      if(name==='roof'||name==='roof_blue'){const blue=name==='roof_blue';r(c,0,0,32,32,blue?'#6596a4':'#ce7950');for(let y=1;y<32;y+=6){r(c,0,y,32,1,blue?'#8ab4b6':'#e49d6b');r(c,0,y+4,32,2,blue?'#527f91':'#a95e42');}for(let x=4;x<32;x+=12)r(c,x,0,1,32,'#ffffff14');}
      return result;
    });
  }
  const propNames=['desk','chair','teacher_desk','blackboard','bookshelf','books','ceiling_fan','wall_clock','first_aid','water_jug','whistle_box','noticeboard','evacuation_map','outlet','bag','window_latch','tree','branch','signboard','trash_bin','clogged_drain','stove','food_crate','computer','medicine','contact_list','locker','speaker','gate','electric_post','flagpole','bench','flowerpot','jeepney','tricycle','bangka','mangrove','roof_sheet','cracked_panel','debris','flashlight','radio','water_bottle','id_card','boots','seedling','cot','curtain','emergency_light','route_marker'];
  function prop(name,variant=0){
    if(!propNames.includes(name))throw new Error('Unknown prop: '+name);
    variant=pick(variant,3);
    return memo('prop:'+name+':'+variant,()=>{
      const result=canvas(),c=context(result),wood=palette.wood,dark=palette.woodDark;
      const book=(x,y,color)=>{r(c,x,y,3,8,color);r(c,x+1,y+1,1,6,'#f4e4be');};
      const paper=(x=8,y=5,w=16,h=23)=>{r(c,x,y,w,h,'#9a8059');r(c,x+1,y+1,w-2,h-2,'#f2e8c7');};
      if(['desk','teacher_desk','bench'].includes(name)){r(c,4,11,24,12,wood);r(c,4,11,24,2,'#d3aa73');r(c,6,23,3,7,dark);r(c,23,23,3,7,dark);if(name==='teacher_desk'){r(c,8,14,9,5,'#bd915e');r(c,9,15,7,3,'#f3e9c7');r(c,21,14,3,5,'#538c75');}if(name==='bench'){r(c,4,8,24,4,wood);r(c,4,18,24,4,'#c29460');}}
      else if(name==='chair'){r(c,8,6,16,11,wood);r(c,7,17,18,6,'#c69763');r(c,8,23,3,7,dark);r(c,21,23,3,7,dark);r(c,10,8,12,2,'#d3aa73');}
      else if(name==='blackboard'){r(c,2,4,28,21,dark);r(c,4,6,24,16,'#416754');for(let i=0;i<3;i++)r(c,7,9+i*4,16-i*3,1,'#d8e2b8');r(c,5,25,22,2,wood);r(c,21,23,4,1,'#f2e8cd');}
      else if(name==='bookshelf'){r(c,4,2,24,28,dark);r(c,6,4,20,25,'#b38c58');for(let y=4;y<25;y+=10){for(let x=7;x<25;x+=4)book(x,y,['#759d8c','#c57858','#d2b86f','#7797b0'][(x+y)%4]);r(c,5,y+8,22,2,dark);}}
      else if(name==='books'){r(c,7,23,20,4,'#b96e51');r(c,5,18,20,4,'#f2e2b4');r(c,7,13,20,4,'#5b917f');r(c,8,15,18,1,'#c6d5b6');}
      else if(name==='ceiling_fan'){r(c,14,3,4,17,'#8b9b8b');const phase=variant%2;poly(c,phase?[[15,13],[3,8],[1,12],[13,17]]:[[15,13],[4,3],[1,7],[13,17]],'#667c71');poly(c,[[16,14],[29,8+phase*3],[31,12+phase*3],[18,18]],'#667c71');poly(c,[[15,17],[12,30],[17,31],[19,18]],'#667c71');r(c,13,13,7,7,'#bcc4a6');}
      else if(name==='wall_clock'){r(c,7,4,18,22,'#8f9c7d');r(c,5,7,22,16,'#8f9c7d');r(c,8,7,16,16,'#f3e6bf');r(c,15,10,2,8,'#536e61');r(c,16,16,6,2,'#536e61');}
      else if(name==='first_aid'){r(c,5,8,22,20,'#e9ead0');r(c,10,4,12,5,'#718b76');r(c,12,6,8,2,'#e9ead0');r(c,6,26,20,2,'#afc0a2');cross(c,12,14,'#5b9477');r(c,20,17,3,3,'#b3c2a0');}
      else if(name==='water_jug'){r(c,10,3,12,4,'#7dadae');r(c,8,7,16,16,'#9ec7c3');r(c,10,9,12,8,'#85b3b4');r(c,9,22,14,8,'#f3ead0');r(c,18,23,6,3,'#5b8b87');r(c,20,26,2,3,'#c9cfae');}
      else if(name==='whistle_box'){r(c,5,11,22,16,'#bc8150');r(c,7,13,18,5,'#f1d183');for(let x=9;x<25;x+=5){r(c,x,14,3,6,'#78948a');r(c,x,14,1,3,'#d0d7ae');}r(c,5,26,22,2,'#8b6646');}
      else if(name==='noticeboard'||name==='evacuation_map'){r(c,3,4,26,24,dark);r(c,5,6,22,20,name==='noticeboard'?'#bf9b65':'#d3d7ac');if(name==='noticeboard'){paper(7,8,8,10);paper(17,10,7,12);}else{r(c,7,10,17,2,'#6b8e71');r(c,18,10,2,12,'#6b8e71');r(c,10,20,10,2,'#6b8e71');r(c,8,18,4,4,'#d1875c');r(c,22,8,3,3,'#e4bf6a');}}
      else if(name==='outlet'){r(c,10,9,12,16,'#f4e7c7');r(c,11,10,10,14,'#d5d2b7');r(c,13,13,2,4,'#7f8f7e');r(c,18,13,2,4,'#7f8f7e');r(c,15,20,2,2,'#7f8f7e');}
      else if(name==='bag'){r(c,10,6,12,5,'#a46f46');r(c,7,10,18,19,'#d48a4f');r(c,9,18,14,8,'#e6a65d');r(c,11,8,10,3,'#d48a4f');r(c,10,23,12,1,'#f2cf86');}
      else if(name==='window_latch'){r(c,6,6,20,21,'#90b8b8');r(c,6,6,20,2,'#d6d7b5');r(c,14,8,3,19,'#d6d7b5');r(c,16,17,6,2,'#8c8e71');r(c,20,17,2,5,'#8c8e71');}
      else if(name==='tree'||name==='mangrove'){r(c,14,15,5,16,'#8e6746');r(c,6,7,22,13,'#51835b');r(c,3,10,27,10,'#51835b');r(c,8,3,16,8,'#709961');r(c,8,7,6,3,'#8caf70');if(name==='mangrove'){poly(c,[[15,23],[8,31],[11,31],[16,27],[23,31],[25,31],[19,23]],'#8e6746');}}
      else if(name==='branch'){poly(c,[[3,26],[5,29],[25,10],[23,8]],'#8e6746');r(c,14,7,3,14,'#8e6746');r(c,21,15,9,3,'#8e6746');}
      else if(name==='signboard'){r(c,14,10,4,22,'#8c734e');poly(c,[[3,4],[25,4],[30,11],[25,17],[3,17]],'#d5b26d');r(c,7,9,15,2,'#5e7960');}
      else if(name==='trash_bin'){r(c,7,8,18,21,'#5a8b73');r(c,6,6,20,4,'#729c7f');r(c,12,4,8,3,'#426f5c');r(c,11,12,2,13,'#82ae8c');r(c,19,12,2,13,'#426f5c');}
      else if(name==='clogged_drain'){c.drawImage(tile('drain'),0,0);r(c,5,9,12,6,'#d5b67a');r(c,14,16,11,5,'#8a7760');r(c,8,23,9,4,'#9bb9af');r(c,18,6,5,7,'#c18966');}
      else if(name==='stove'){r(c,5,8,22,21,'#a4b3a6');r(c,5,8,22,4,'#d9ddc0');r(c,8,10,6,3,'#596b61');r(c,19,10,5,3,'#596b61');r(c,8,18,16,9,'#7d9589');r(c,10,19,12,6,'#435e54');}
      else if(name==='food_crate'){r(c,4,12,24,17,'#bc915b');r(c,5,15,22,2,'#e0ba7c');r(c,5,23,22,2,'#876c48');for(let x=7;x<27;x+=6){r(c,x,7,4,7,x%3?'#79a067':'#e0ba6f');}}
      else if(name==='computer'){r(c,5,4,22,16,'#62756a');r(c,7,6,18,12,'#81b7b7');r(c,9,8,14,2,'#c0d9c4');r(c,14,20,4,5,'#62756a');r(c,10,24,12,2,'#7e9183');r(c,4,27,24,3,'#c3cbb1');}
      else if(name==='medicine'){r(c,11,5,10,5,'#6e9b86');r(c,9,10,14,19,'#e4ebd2');r(c,10,15,12,8,'#a1c0a0');cross(c,14,17,'#5e8d72');}
      else if(name==='contact_list'||name==='id_card'){paper(name==='id_card'?6:8,6,name==='id_card'?20:16,22);if(name==='id_card'){r(c,9,10,6,7,'#7ea78b');r(c,17,11,6,1,'#789178');r(c,17,15,5,1,'#789178');}else for(let y=11;y<25;y+=4)r(c,11,y,10,1,'#789178');}
      else if(name==='locker'){r(c,6,3,20,27,'#84a89b');r(c,8,5,16,23,'#aec2ac');r(c,15,5,1,23,'#739486');r(c,11,14,2,4,'#5c7a6d');r(c,18,14,2,4,'#5c7a6d');for(let y=8;y<12;y+=2){r(c,9,y,4,1,'#7b9b8c');r(c,18,y,4,1,'#7b9b8c');}}
      else if(name==='speaker'){r(c,9,6,14,20,'#536f64');r(c,11,8,10,8,'#8ba697');r(c,12,18,8,6,'#91b0a0');r(c,13,10,6,4,'#536f64');}
      else if(name==='gate'){r(c,2,7,4,25,'#b5ae8b');r(c,26,7,4,25,'#b5ae8b');r(c,6,13,20,2,'#6e8e79');r(c,6,26,20,2,'#6e8e79');for(let x=8;x<26;x+=5)r(c,x,11,2,20,'#6e8e79');}
      else if(name==='electric_post'){r(c,14,3,4,29,'#9c8f73');r(c,4,8,24,3,'#8b826a');r(c,6,5,3,6,'#718477');r(c,23,5,3,6,'#718477');r(c,0,4,32,1,'#778576');}
      else if(name==='flagpole'){r(c,14,2,2,27,'#eae3c7');r(c,10,29,10,2,'#acaa89');r(c,16,3,14,5,'#507b9a');r(c,16,8,14,5,'#c36a55');poly(c,[[16,3],[22,8],[16,13]],'#f3eacd');r(c,17,7,2,2,'#e6c170');}
      else if(name==='flowerpot'||name==='seedling'){r(c,9,21,14,9,'#bd8055');r(c,8,20,16,3,'#d19b65');r(c,15,10,2,12,'#67925d');r(c,10,12,6,4,'#85a867');r(c,17,7,6,5,'#85a867');if(name==='flowerpot'){r(c,12,5,8,7,'#e0aa68');r(c,15,6,3,3,'#f0d18c');}}
      else if(name==='jeepney'){r(c,2,13,28,13,'#d0b36d');r(c,6,7,20,7,'#acbe9b');r(c,7,9,7,7,'#7faeaf');r(c,17,9,7,7,'#7faeaf');r(c,3,20,26,2,'#6a9a91');r(c,5,25,5,5,'#455a50');r(c,23,25,5,5,'#455a50');r(c,2,16,4,3,'#f4d68f');r(c,26,16,4,3,'#f4d68f');}
      else if(name==='tricycle'){r(c,3,13,12,12,'#779d97');r(c,16,11,14,14,'#c3915e');r(c,16,8,14,3,'#668b79');r(c,19,12,8,8,'#add0bc');r(c,5,24,5,5,'#455a50');r(c,22,24,5,5,'#455a50');r(c,7,8,3,8,'#5b7668');}
      else if(name==='bangka'){poly(c,[[3,16],[29,16],[24,24],[9,24]],'#b98a59');r(c,6,14,20,2,'#e0bf83');r(c,3,26,26,2,'#b4a176');r(c,0,10,2,19,'#9d8256');r(c,30,10,2,19,'#9d8256');r(c,1,18,30,2,'#dcc58e');}
      else if(name==='roof_sheet'){poly(c,[[7,6],[28,10],[24,27],[3,23]],'#92a8a0');for(let x=8;x<26;x+=5)poly(c,[[x,8],[x+1,8],[x-3,24],[x-4,24]],'#bed0bb');}
      else if(name==='cracked_panel'){r(c,4,5,24,22,'#dcd4af');poly(c,[[16,5],[15,12],[20,16],[14,22],[17,27]],'#94876b');}
      else if(name==='debris'){r(c,4,24,24,5,'#9e9371');poly(c,[[6,23],[10,15],[19,20],[16,27]],'#c4b696');poly(c,[[19,12],[28,17],[25,25],[17,22]],'#b8a27e');r(c,6,12,3,15,'#976e4c');}
      else if(name==='flashlight'){r(c,13,11,7,19,'#596f63');poly(c,[[9,5],[24,5],[21,13],[12,13]],'#7e9684');r(c,10,5,13,3,'#e9d197');r(c,15,17,3,4,'#a5b5a0');}
      else if(name==='radio'){r(c,5,12,23,17,'#627c6f');r(c,7,16,12,9,'#8ca899');r(c,9,18,8,5,'#4f695d');r(c,21,16,4,3,'#d8cf9d');r(c,22,5,2,8,'#9cae98');r(c,8,9,11,3,'#526b5d');}
      else if(name==='water_bottle'){r(c,13,3,7,5,'#709e98');r(c,11,8,11,21,'#9dc8c2');r(c,12,15,9,7,'#e6e7c6');r(c,13,10,2,4,'#d4e4cf');}
      else if(name==='boots'){r(c,6,9,7,18,'#71866a');r(c,18,9,7,18,'#71866a');r(c,5,25,10,5,'#587354');r(c,18,25,10,5,'#587354');r(c,6,10,7,2,'#b1b77c');r(c,18,10,7,2,'#b1b77c');}
      else if(name==='cot'){r(c,5,5,22,24,'#79998c');r(c,7,6,18,21,'#d1dfcd');r(c,8,8,16,6,'#f1edd7');r(c,7,16,18,9,'#93b8ad');r(c,5,27,3,4,'#637f72');r(c,24,27,3,4,'#637f72');}
      else if(name==='curtain'){r(c,3,5,26,2,'#887d61');r(c,5,7,9,22,'#a3b9a4');r(c,18,7,9,22,'#a3b9a4');r(c,8,8,2,20,'#bfccb0');r(c,22,8,2,20,'#bfccb0');r(c,6,19,7,2,'#cfac76');r(c,19,19,7,2,'#cfac76');}
      else if(name==='emergency_light'){r(c,4,10,24,15,'#b2c4a6');r(c,6,12,8,10,'#fff0b6');r(c,18,12,8,10,'#fff0b6');r(c,14,14,4,7,'#799880');r(c,7,8,18,3,'#8fa58b');}
      else if(name==='route_marker'){r(c,14,14,4,18,'#8b7a55');r(c,4,3,24,16,'#5d8c72');poly(c,[[10,11],[15,6],[20,11],[17,11],[17,16],[13,16],[13,11]],'#f4ebc9');}
      return result;
    });
  }
  function emote(kind='help',phase=0){
    return memo('emote:'+kind+':'+pick(phase,2),()=>{const result=canvas(16,16),c=context(result);r(c,2,1,12,11,'#fff3d2');r(c,1,3,14,7,'#fff3d2');r(c,6,12,3,2,'#fff3d2');if(kind==='help'){r(c,7,3,2,5,'#ba7e4d');r(c,7,9,2,2,'#ba7e4d');}else if(kind==='happy'){r(c,4,5,2,2,'#5b8270');r(c,10,5,2,2,'#5b8270');r(c,5,9,6,1,'#5b8270');}else{const d=pick(phase,2);r(c,7,3-d,2,7+d,'#d7ad57');r(c,4-d,6,8+d*2,2,'#d7ad57');}return result;});
  }
  LE.Art={size:SIZE,directions,skinTones,hairColors,palette,npcs,outfits,tileNames,propNames,normalize,frame,dog,portrait,sheet,tile,prop,emote,drawCharacter,
    drawTile(c,name,x,y,scale=1,variant=0){c.imageSmoothingEnabled=false;c.drawImage(tile(name,variant),Math.round(x),Math.round(y),32*scale,32*scale);},
    drawProp(c,name,x,y,scale=1,variant=0){c.imageSmoothingEnabled=false;c.drawImage(prop(name,variant),Math.round(x),Math.round(y),32*scale,32*scale);},
    clearCache(){cache.clear();sheetCache.clear();},cacheInfo:()=>({count:cache.size,limit:CACHE_LIMIT,sheetCount:sheetCache.size,sheetLimit:8,maximumPixelBytes:CACHE_LIMIT*64*64*4+8*96*128*4})};
})();
