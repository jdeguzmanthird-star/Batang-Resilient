/* Stage 2 inspection studio. Preview changes never alter a student's save. */
(function(){
  'use strict';
  const LE=window.LE=window.LE||{};
  const text={
    en:{title:'Pixel Art Studio',student:'Student',outfits:'15 outfits',club:'Meet the club',assets:'School assets',note:'Art preview only. Character creation is Stage 3; purchasing outfits is Stage 11.',gender:'Sprite set',boy:'Boy',girl:'Girl',skin:'Skin tone',hair:'Hair style',color:'Hair color',outfit:'Outfit',direction:'Facing',down:'Down',left:'Left',right:'Right',up:'Up',walking:'Play walk cycle',expression:'Expression',happy:'Happy',worried:'Worried',thinking:'Thinking',style:'Style',tone:'Tone',hairColor:'Color',frames:'Three walk frames in each of four directions.',motion:'Reduced motion is on. Walk previews are paused.',preview:'Student and Bantay art preview',cosmetic:'All outfits are cosmetic. Previewing does not buy or unlock them.',hero:'Cape unlock planned: three stars in all four stories.',price:'Safety Stars',tiles:'24 map tiles',props:'46 interactive props',npcHint:'Guide characters and classmates, with walking frames and expressions.',saveSafe:'Preview changes do not change your profile.',done:'Back to title',labels:'Tiles and props use 32 × 32 pixel cells.',sheet:'Animation frames',portrait:'Expressions',uniform:'Uniform'},
    fil:{title:'Pixel Art Studio',student:'Mag-aaral',outfits:'15 kasuotan',club:'Kilalanin ang club',assets:'Mga gamit',note:'Preview lang ito. Sa Yugto 3 ang paglikha ng karakter; sa Yugto 11 ang pagbili ng kasuotan.',gender:'Sprite set',boy:'Lalaki',girl:'Babae',skin:'Kulay ng balat',hair:'Estilo ng buhok',color:'Kulay ng buhok',outfit:'Kasuotan',direction:'Nakaharap',down:'Pababa',left:'Pakaliwa',right:'Pakanan',up:'Pataas',walking:'Ipakita ang paglakad',expression:'Ekspresyon',happy:'Masaya',worried:'Nag-aalala',thinking:'Nag-iisip',style:'Estilo',tone:'Kulay',hairColor:'Kulay',frames:'Tatlong frame sa bawat isa sa apat na direksyon.',motion:'Naka-on ang bawas-galaw. Nakahinto ang preview ng paglakad.',preview:'Preview ng mag-aaral at ni Bantay',cosmetic:'Pampaganda lamang ang mga kasuotan. Hindi bumibili o nag-a-unlock ang preview.',hero:'Nakaplanong unlock ng kapa: tatlong bituin sa lahat ng apat na kuwento.',price:'Safety Stars',tiles:'24 tile ng mapa',props:'46 gamit sa paaralan',npcHint:'Mga gabay at kaklase, kasama ang mga frame ng paglakad at ekspresyon.',saveSafe:'Hindi nagbabago ang iyong profile sa preview.',done:'Bumalik sa pamagat',labels:'32 × 32 pixel ang bawat tile at gamit.',sheet:'Mga frame ng paggalaw',portrait:'Mga ekspresyon',uniform:'Uniporme'}
  };
  const tileLabels={grass:'Grass',flowers:'Wildflowers',soil:'Soil',garden:'Garden bed',path:'Paved path',floor:'Classroom floor',floor_blue:'Clinic floor',wall:'Wall',window:'Window',cracked_wall:'Cracked wall',door:'Closed door',open_door:'Open door',steps:'Stairs',road:'Road',water:'River / sea',floodwater:'Floodwater',drain:'Drainage',sand:'Sand',shore:'Shoreline',roof:'Roof',roof_blue:'Blue roof',exit:'Exit marker',assembly:'Assembly marker',warning:'Hazard marker'};
  let config={gender:'boy',skin:1,hairStyle:0,hairColor:0,outfit:'uniform',direction:'down',expression:'happy',walking:true};
  function open(tab='student'){
    const h=LE.UI.h,language=LE.Save.get().settings.language,T=text[language]||text.en;
    const A=LE.Art,body=h('div',{className:'art-studio'}),canvases=[],cleanups=[];
    let raf=null,active=true,last=0;
    const tabs=h('div',{className:'art-tabs',role:'group','aria-label':T.title});
    ['student','outfits','club','assets'].forEach(id=>tabs.append(h('button',{type:'button',className:id===tab?'primary':'secondary','aria-pressed':String(id===tab),onclick:()=>open(id)},T[id])));
    body.append(tabs,h('p',{className:'hint'},T.note));
    function actorCanvas(label,draw,width=128,height=128){
      const canvas=h('canvas',{width,height,role:'img','aria-label':label,className:'art-canvas'});
      const c=canvas.getContext('2d');
      if(c)canvases.push(time=>{c.imageSmoothingEnabled=false;draw(c,time,canvas);});
      return canvas;
    }
    function backdrop(c,width,height){
      c.clearRect(0,0,width,height);c.fillStyle='#e8ead5';c.fillRect(0,0,width,height);
      for(let y=0;y<height;y+=32)for(let x=0;x<width;x+=32)A.drawTile(c,y>height-64?'grass':'floor',x,y);
    }
    function control(id,label,items){
      const select=h('select',{id:'art-'+id,value:String(config[id])});
      items.forEach(([value,label])=>select.append(h('option',{value:String(value),selected:String(value)===String(config[id])},label)));
      select.addEventListener('change',()=>{config[id]=['skin','hairStyle','hairColor'].includes(id)?Number(select.value):select.value;last=0;});
      return h('div',{className:'art-control'},h('label',{htmlFor:select.id},label),select);
    }
    if(tab==='student'){
      const stage=actorCanvas(T.preview,(c,time)=>{
        backdrop(c,384,208);A.drawProp(c,'tree',286,40,2);A.drawProp(c,'flowerpot',25,135,1.5);
        A.drawCharacter(c,132,194,{...config,time,reducedMotion:LE.Save.get().settings.reducedMotion},5);
        A.drawCharacter(c,267,192,{npc:'bantay',direction:config.direction,time,walking:config.walking,vest:config.outfit==='k9',reducedMotion:LE.Save.get().settings.reducedMotion},3);
      },384,208);
      const controls=h('div',{className:'art-controls'},
        control('gender',T.gender,[['boy',T.boy],['girl',T.girl]]),
        control('skin',T.skin,A.skinTones.map((_,i)=>[i,T.tone+' '+(i+1)])),
        control('hairStyle',T.hair,[0,1,2].map(i=>[i,T.style+' '+(i+1)])),
        control('hairColor',T.color,A.hairColors.map((_,i)=>[i,T.hairColor+' '+(i+1)])),
        control('outfit',T.outfit,A.outfits.map(item=>[item.id,item.name[language]||item.name.en])),
        control('direction',T.direction,A.directions.map(item=>[item,T[item]])),
        control('expression',T.expression,['happy','worried','thinking'].map(item=>[item,T[item]])));
      const walk=h('input',{id:'art-walking',type:'checkbox',checked:config.walking,onchange:event=>{config.walking=event.target.checked;last=0;}});
      controls.append(h('div',{className:'art-control'},h('label',{htmlFor:walk.id},T.walking),walk));
      body.append(h('div',{className:'art-student-layout'},h('div',{},stage,h('p',{className:'hint'},T.frames),h('p',{className:'hint'},T.saveSafe)),controls));
      const expressionRow=h('div',{className:'portrait-row'});
      ['happy','worried','thinking'].forEach(expression=>expressionRow.append(h('figure',{},actorCanvas(T[expression],c=>{c.clearRect(0,0,64,64);c.drawImage(A.portrait({...config,expression}),0,0);},64,64),h('figcaption',{},T[expression]))));
      body.append(h('h3',{},T.portrait),expressionRow);
      body.append(h('h3',{},T.sheet),actorCanvas(T.frames,(c)=>{c.clearRect(0,0,192,256);c.drawImage(A.sheet(config),0,0,192,256);},192,256));
    }
    if(tab==='outfits'){
      body.append(h('p',{className:'hint'},T.cosmetic));
      const grid=h('div',{className:'art-grid outfit-grid'});
      A.outfits.forEach(item=>{
        const image=actorCanvas(item.name[language],(c,time)=>{
          backdrop(c,128,136);
          const reduced=LE.Save.get().settings.reducedMotion;
          A.drawCharacter(c,64,125,{...config,outfit:item.id,direction:reduced?'down':A.directions[Math.floor(time/2.5)%4],time,walking:true,reducedMotion:reduced},3.5);
          if(item.id==='k9')A.drawCharacter(c,105,132,{npc:'bantay',direction:'left',vest:true,frame:0},1.5);
        },128,136);
        grid.append(h('article',{className:'art-card'},image,h('h3',{},item.name[language]),h('p',{className:'art-price'},String(item.price)+' '+T.price),h('p',{},item.description[language]),item.unlock?h('p',{className:'hint'},T.hero):null));
      });
      body.append(grid);
    }
    if(tab==='club'){
      body.append(h('p',{className:'hint'},T.npcHint));
      const grid=h('div',{className:'art-grid'});
      A.npcs.forEach(npc=>{
        const image=actorCanvas(npc.name,(c,time)=>{
          backdrop(c,128,128);const reduced=LE.Save.get().settings.reducedMotion;
          A.drawCharacter(c,64,123,{npc:npc.id,direction:reduced?'down':A.directions[Math.floor(time/2.5)%4],walking:true,time,reducedMotion:reduced},3.5);
        });
        const portraitRow=h('div',{className:'art-mini-portraits'});
        if(npc.species!=='dog')for(const expression of ['happy','worried','thinking'])portraitRow.append(actorCanvas(npc.name+' · '+T[expression],c=>{c.clearRect(0,0,64,64);c.drawImage(A.portrait({npc:npc.id,expression}),0,0);},64,64));
        grid.append(h('article',{className:'art-card'},image,h('h3',{},npc.name),h('p',{},npc.role[language]),portraitRow));
      });
      body.append(grid);
    }
    if(tab==='assets'){
      body.append(h('p',{className:'hint'},T.labels));
      for(const [kind,names,title]of [['tile',A.tileNames,T.tiles],['prop',A.propNames,T.props.replace('46','50')]]){
        body.append(h('h3',{},title));
        const grid=h('div',{className:'art-asset-grid'});
        names.forEach(name=>{
          const label=kind==='tile'?tileLabels[name]:name.replaceAll('_',' ');
          const image=actorCanvas(label,(c)=>{c.clearRect(0,0,64,64);c.drawImage(A[kind](name),0,0,64,64);},64,64);
          grid.append(h('figure',{className:'art-asset'},image,h('figcaption',{},label)));
        });body.append(grid);
      }
    }
    if(LE.Save.get().settings.reducedMotion)body.append(h('p',{className:'modal-note'},T.motion));
    const dialog=LE.UI.modal(T.title,body,[h('button',{type:'button',className:'primary',onclick:()=>LE.UI.close()},T.done)],()=>{
      active=false;if(raf!==null)window.cancelAnimationFrame(raf);cleanups.forEach(fn=>fn());
    });
    dialog.classList.add('art-dialog');
    // Render at 12 FPS. Tile galleries draw once; the animation sheet updates only on changes.
    let previousConfig='';
    function draw(timestamp){
      if(!active)return;
      const reduced=LE.Save.get().settings.reducedMotion;
      const signature=JSON.stringify(config)+reduced;
      const changed=signature!==previousConfig;
      if(!document.hidden&&(changed||!reduced&&tab!=='assets'&&timestamp-last>=80)){
        for(const paint of canvases)paint(reduced?0:timestamp/1000);
        previousConfig=signature;last=timestamp;
      }
      if(tab!=='assets')raf=window.requestAnimationFrame(draw);
    }
    draw(0);
    // Asset grids are static and do not need an animation loop.
    LE.ArtPreview.lastTab=tab;
  }
  LE.ArtPreview={open,lastTab:'student',configuration:()=>({...config})};
})();
