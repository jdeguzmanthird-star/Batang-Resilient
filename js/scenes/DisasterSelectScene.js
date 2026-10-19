/* Story selection records a preference only. No mission or score is simulated. */
(function(){
  'use strict';
  const LE=window.LE=window.LE||{};
  const dictionary=()=>LE.Data.profileText[LE.Save.get().settings.language];
  const local=(value)=>value[LE.Save.get().settings.language]||value.en;
  const format=(text,values)=>Object.entries(values).reduce((result,[key,value])=>result.replaceAll('{'+key+'}',String(value)),text);
  function progress(profile,id){
    const record=profile&&profile.scenarioProgress&&profile.scenarioProgress[id];
    const completed=Boolean(record&&record.completed===true);
    const raw=record&&Number.isFinite(record.bestScore)?record.bestScore:profile&&profile.highScores&&profile.highScores[id];
    const score=Number.isFinite(raw)?Math.min(100,Math.max(0,raw)):null;
    const stars=completed?(score!==null?score>=85?3:score>=60?2:1:Number.isInteger(record.stars)?Math.max(0,Math.min(3,record.stars)):0):0;
    const saved=record&&Array.isArray(record.completedPillars)?record.completedPillars:[];
    const pillars=completed?LE.Data.pillars.map(p=>p.id):LE.Data.pillars.map(p=>p.id).filter(id=>saved.includes(id));
    return {completed,score:completed?score:null,stars,pillars};
  }
  function paintCard(c,id,width=224,height=96){
    c.imageSmoothingEnabled=false;c.clearRect(0,0,width,height);
    const small=document.createElement('canvas');small.width=224;small.height=96;const b=small.getContext('2d');if(!b)return;
    const rect=(x,y,w,h,color)=>{b.fillStyle=color;b.fillRect(x,y,w,h);};
    rect(0,0,224,96,id==='typhoon'?'#aac8c4':'#cee0ca');rect(0,53,224,43,'#a4b881');
    if(id==='earthquake'){
      for(let y=0;y<96;y+=32)for(let x=0;x<224;x+=32)LE.Art.drawTile(b,y<32?'wall':'floor',x,y);
      LE.Art.drawProp(b,'blackboard',64,3,2);LE.Art.drawProp(b,'bookshelf',10,14,2);LE.Art.drawProp(b,'desk',126,46,1.5);LE.Art.drawProp(b,'books',171,48,1.2);LE.Art.drawProp(b,'cracked_panel',184,4,1);
    }else{
      for(let x=128;x<224;x+=32)LE.Art.drawTile(b,'roof',x,29);rect(128,53,96,28,'#eddfb8');LE.Art.drawProp(b,'window_latch',139,48,0.8);LE.Art.drawTile(b,'open_door',185,48,0.8);
      LE.Art.drawProp(b,'tree',91,30,1.7);
      if(id==='typhoon'){
        for(let x=8;x<224;x+=47){rect(x,14,36,9,'#85a5a5');rect(x+8,8,19,9,'#85a5a5');}
        for(let i=0;i<21;i++){const x=(i*31)%224,y=28+(i*11)%61;rect(x,y,1,5,'#c0d8cf');}
      }
      if(id==='flood'){
        for(let y=72;y<96;y+=32)for(let x=0;x<224;x+=32)LE.Art.drawTile(b,'floodwater',x,y);
        LE.Art.drawProp(b,'water_bottle',35,70,0.6);
      }
      if(id==='tsunami'){
        for(let y=64;y<96;y+=32)for(let x=0;x<224;x+=32)LE.Art.drawTile(b,x<96?'water':'sand',x,y);
        LE.Art.drawProp(b,'bangka',10,59,1);LE.Art.drawProp(b,'mangrove',68,28,1.6);rect(15,15,16,16,'#f2d18b');
      }
    }
    c.drawImage(small,0,0,width,height);
  }
  function banner(id){const node=LE.UI.h('canvas',{width:224,height:96,className:'story-art',role:'img','aria-label':local(LE.Data.scenarios.find(item=>item.id===id).title)});const c=node.getContext('2d');if(c)paintCard(c,id);return node;}
  function pillarList(profile,id){
    const h=LE.UI.h,T=dictionary(),state=progress(profile,id);
    const list=h('ol',{className:'story-pillar-list'});
    LE.Data.pillars.forEach((pillar,index)=>list.append(h('li',{className:state.pillars.includes(pillar.id)?'pillar-complete':''},h('span',{className:'chapter-number'},String(index+1)),h('span',{},h('strong',{},LE.UI.t(pillar.labelKey)),h('small',{},LE.UI.t(pillar.textKey))))));
    return list;
  }
  function open(){
    const profile=LE.Save.active();if(!profile)return LE.UI.slots();if(!profile.characterCreated)return LE.CharacterScene.open();
    const h=LE.UI.h,T=dictionary(),state=LE.Save.get();
    const portrait=h('canvas',{width:64,height:64,className:'profile-portrait',role:'img','aria-label':profile.name});
    const pc=portrait.getContext('2d');if(pc)pc.drawImage(LE.Art.portrait(LE.Save.artOptions(profile)),0,0);
    const ribbon=h('div',{className:'student-ribbon'},portrait,h('div',{className:'student-ribbon-copy'},h('strong',{},profile.name),h('small',{},T.slot+' '+(state.activeSlot+1)+' · '+profile.stars+' Safety Stars')),
      h('div',{className:'ribbon-actions'},h('button',{type:'button',id:'edit-character',className:'secondary',onclick:()=>LE.CharacterScene.open({from:'selection'})},T.editProfile),h('button',{type:'button',id:'switch-slot',className:'secondary',onclick:()=>LE.UI.slots()},T.switchSlot)));
    const grid=h('div',{className:'story-grid'});
    LE.Data.scenarios.forEach(story=>{
      const record=progress(profile,story.id),selected=profile.selectedDisaster===story.id;
      const rating=record.completed?h('span',{className:'story-rating','aria-label':record.stars+' '+T.starLabel},'★'.repeat(record.stars)+'☆'.repeat(3-record.stars)):h('span',{className:'story-unplayed'},T.noStars);
      const select=h('button',{type:'button',id:'choose-'+story.id,className:'story-card'+(selected?' is-selected':''),'aria-pressed':String(selected),onclick:()=>choose(story.id,profile.id)},
        banner(story.id),h('span',{className:'story-card-content'},h('span',{className:'story-card-heading'},h('strong',{},local(story.title)),h('small',{},story.localName)),
          h('span',{className:'story-description'},local(story.description)),rating,
          h('span',{className:'story-status'},record.completed?T.completed+(record.score===null?'':' · '+T.best+' '+record.score+'/100'):story.available&&profile.storyRuns&&profile.storyRuns[story.id]?LE.Data.storyText[LE.Save.get().settings.language].progress+': '+record.pillars.length+'/4':T.notPlayed),
          h('span',{className:'story-build-note'},story.available?LE.Data.storyText[LE.Save.get().settings.language].ready:format(T.planned,{stage:story.stage})),h('span',{className:'story-select-label'},selected?T.selected+' · '+T.details:T.select)));
      grid.append(select);
    });
    const body=h('div',{},h('p',{},T.chooseIntro),ribbon,grid,h('p',{className:'modal-note'},T.stageNotice));
    const dialog=LE.UI.modal(T.choose,body,[h('button',{type:'button',className:'secondary',onclick:()=>LE.UI.close()},T.backTitle)]);
    dialog.classList.add('disaster-dialog');
  }
  function choose(id,expectedId){
    const T=dictionary(),result=LE.Save.selectDisaster(id,expectedId);
    if(!result.ok){LE.UI.toast(T[result.reason]||T.profileChanged);return;}
    LE.Audio.play('select');showStory(id);
  }
  function showStory(id){
    const profile=LE.Save.active(),story=LE.Data.scenarios.find(item=>item.id===id);
    if(!story)return open();if(!profile||!profile.characterCreated)return LE.UI.welcome();
    const h=LE.UI.h,T=dictionary();
    const intro=()=>LE.UI.showDialogue(T.teacherTitle,format(T.teacherWelcome,{name:profile.name})+' '+format(T.storyIntro,{name:profile.name,story:local(story.title)}),()=>showStory(id));
    const body=h('div',{},h('span',{className:'stage-label'},T.ready),h('div',{className:'story-brief'},banner(id),h('div',{},h('h3',{},local(story.title)+' · '+story.localName),h('p',{},local(story.description)))),
      h('p',{className:'hint'},T.storySaved),h('h3',{},T.pillarsIntro),pillarList(profile,id),h('p',{className:'modal-note'},story.available?LE.Data.storyText[LE.Save.get().settings.language].ready:format(T.planned,{stage:story.stage})+'. '+T.notStarted));
    if(story.available){const copy=(LE.Data[id].storyText||LE.Data.storyText)[LE.Save.get().settings.language];body.append(h('button',{type:'button',id:'play-'+id,className:'primary',onclick:()=>LE.MapScene.open(id)},profile.storyRuns&&profile.storyRuns[id]?copy.resume:copy.play));}
    if(profile.storyRuns&&profile.storyRuns[id])body.append(h('button',{id:'new-run-'+id,type:'button',className:'secondary',onclick:()=>LE.UI.modal(LE.Save.get().settings.language==='fil'?'Magsimula ng bagong laro':'Start a new run',h('p',{},LE.Save.get().settings.language==='fil'?'Papalitan ang kasalukuyang takbo. Mananatili ang mga nakamit na resulta, kasuotan, at gantimpala.':'Replace this current run? Earned results, outfits, and currency stay saved.'),[h('button',{id:'confirm-new-run',type:'button',className:'primary',onclick:()=>{if(LE.Save.active()?.id===profile.id)LE.MapScene.open(id,{fresh:true});}},LE.Save.get().settings.language==='fil'?'Simulan':'Start new run')])},LE.Save.get().settings.language==='fil'?'Ulitin ang apat na kabanata':'Replay all four chapters'));
    const saved=profile.storyRuns&&profile.storyRuns[id],completed=saved&&LE.Rewards.story(profile.id,id,saved.runId),result=completed&&LE.Rewards.result(profile.id,saved.runId);
    if(completed)body.append(h('button',{type:'button',id:'assess-'+id,className:'primary',onclick:()=>result?LE.ResultsScene.open(profile.id,saved.runId):LE.QuizScene.open(id,saved.runId)},LE.Save.get().settings.language==='fil'?(result?'Tingnan ang resulta':'Huling pagsusulit'):(result?'View results':'Take final quiz')));
    const exploreText=LE.Data.worldText[LE.Save.get().settings.language];
    const hasLocation=profile.exploration&&profile.exploration[id];
    body.append(h('p',{className:'hint'},exploreText.normalDay+'. '+exploreText.note));
    const practice=LE.Data.decisionText[LE.Save.get().settings.language];
    body.append(h('p',{className:'guide-card'},practice.intro+'. '+practice.note),h('button',{type:'button',id:'open-practice',className:'primary',onclick:()=>LE.DecisionScene.open(id)},profile.practice&&profile.practice[id]?practice.resume:practice.practice));
    body.append(h('button',{type:'button',id:'open-mini-games',className:'secondary',onclick:()=>LE.MiniGameScene.open(id,null,{returnTo:'story'})},LE.Data.miniText[LE.Save.get().settings.language].studio));
    const dialog=LE.UI.modal(local(story.title),body,[h('button',{type:'button',className:'secondary',onclick:open},T.backStories),h('button',{type:'button',id:'meet-teacher',className:'secondary',onclick:intro},T.meet),h('button',{type:'button',id:'explore-school',className:'primary',onclick:()=>LE.MapScene.open(id)},hasLocation?exploreText.resume:exploreText.explore)]);
    dialog.classList.add('disaster-dialog');
  }
  LE.DisasterSelectScene={open,choose,showStory,progress,paintCard};
})();
