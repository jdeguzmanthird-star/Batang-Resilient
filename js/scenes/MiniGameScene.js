/* Offline activity studio. Native controls mirror every canvas/drag action. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};let session=null;
 const T=()=>LE.Data.miniText[LE.Save.get().settings.language],local=x=>typeof x==='string'?x:x[LE.Save.get().settings.language]||x.en;
 const h=(...args)=>LE.UI.h(...args),btn=(id,label,action,kind='secondary')=>h('button',{type:'button',id,className:kind,onclick:action},label);
 const clock=ms=>Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0');
 const same=()=>session&&LE.Save.active()&&LE.Save.active().id===session.profileId;
 const records=()=>{const p=LE.Save.active();return p&&p.minigames&&p.minigames[session.storyId]&&p.minigames[session.storyId].games||{};};
 const info=()=>LE.Data.minigames.games.concat(LE.Data.quakeGames||[],LE.Data.coastGames||[]).find(g=>g.id===session.gameId);
 function save(){
  if(session&&session.storyContext){if(!same()||!session.model)return false;const context=session.storyContext,ok=LE.StoryScene.persistActivity(context,session.model.serialize(),context.elapsedMs||0);if(ok)context.elapsedMs=0;if(!LE.Save.status().persistent&&!session.warned){session.warned=true;LE.UI.toast(T().temporary);}return ok&&LE.Save.status().persistent;}
  if(!same())return false;const p=LE.Save.active(),all={...(p.minigames||{})},entry={version:1,games:{...records()}},patch={};
  if(session.model){
   const id=session.gameId,previous=entry.games[id]||{},result=session.model.result(),next={...previous,run:session.model.serialize()};
   if(result){next.best=Math.max(Number.isFinite(previous.best)?previous.best:0,result.score);next.completedCount=(Number.isInteger(previous.completedCount)?previous.completedCount:0)+(previous.run&&previous.run.phase==='complete'?0:1);
    if(id==='breathe'&&!previous.calmAwarded){const model=LE.Decisions.create(LE.Data.practice,p.practice&&p.practice[session.storyId]);model.adjustCalm(20);patch.practice={...(p.practice||{}),[session.storyId]:model.serialize()};next.calmAwarded=true;}
   }entry.games[id]=next;
  }
  all[session.storyId]=entry;LE.Save.updateActive({...patch,minigames:all,checkpoint:{stage:'minigames',storyId:session.storyId,gameId:session.gameId,returnTo:session.returnTo}});
  if(!LE.Save.status().persistent&&!session.warned){session.warned=true;LE.UI.toast(T().temporary);}return LE.Save.status().persistent;
 }
 function stop(commit=true){
  if(!session)return;if(commit)save();const old=session;session=null;window.cancelAnimationFrame(old.raf);old.listeners.forEach(remove=>remove());if(old.unsubscribe)old.unsubscribe();old.screen.hidden=true;old.screen.replaceChildren();document.querySelector('.topbar').hidden=false;document.getElementById('game-frame').classList.toggle('mini-mode',false);if(window.speechSynthesis)window.speechSynthesis.cancel();
 }
 function leave(){if(!session)return;if(session.storyContext){const context=session.storyContext;save();stop(false);LE.UI.close(false);LE.StoryScene.returnFromActivity(context,false);return;}const id=session.storyId,target=session.returnTo,valid=same();stop();LE.UI.close(false);if(!valid){LE.App.beginTitle();LE.UI.toast(T().stale);return;}
  if(target==='practice')LE.DecisionScene.open(id);else if(target==='story'){LE.Save.updateActive({checkpoint:{stage:'disaster-select'}});document.getElementById('title-screen').hidden=false;LE.DisasterSelectScene.showStory(id);}else LE.MapScene.open(id);
 }
 function modalChanged(open){if(!session)return;session.paused=open;session.lastTime=null;if(open&&session.model)session.model.pause();if(!open)render();}
 function pause(){if(!session)return;if(session.model)session.model.pause();save();LE.UI.modal(T().pause,h('p',{},T().saved),[btn('mini-resume',T().resume,()=>LE.UI.close(),'primary'),btn('mini-settings',T().settings,()=>LE.UI.settings()),btn('mini-glossary',LE.UI.t('glossary'),()=>LE.LearningScene.glossary()),btn('mini-leave',T().back,leave)]);}
 function showGame(id,fresh=false){
  if(session&&session.storyContext)return;
  if(!session||!LE.MiniGames.ids().includes(id))return;save();session.gameId=id;const record=records()[id];session.model=LE.MiniGames.create(id,session.storyId,!fresh&&record&&record.run);session.color=0;session.spokenKey=null;save();render();
 }
 function hub(){if(!session)return;if(session.storyContext)return leave();if(session.model)session.model.pause();save();session.model=null;session.gameId=null;session.canvas=null;save();render();}
 function replay(){if(!session||!session.gameId)return;const id=session.gameId;LE.UI.modal(T().replay,h('p',{},T().resetNote),[btn('mini-reset-confirm',T().reset,()=>{LE.UI.close(false);showGame(id,true);},'primary'),btn('mini-reset-cancel',T().cancel,()=>LE.UI.close())]);}
 function action(name,value,extra){if(!same()||session.paused||!session.model)return;const ok=session.model.act(name,value,extra);LE.Audio.play(ok?(session.gameId==='signal'&&name==='pulse'?session.model.state.data.channel:'select'):'oops');save();if(ok&&session.storyContext&&session.storyContext.director&&session.model.state.phase==='complete'){const context=session.storyContext;stop(false);LE.UI.close(false);LE.ScenarioDirector.returnFromActivity(context,true);return;}render();}
 function open(storyId,gameId=null,options={}){
  let p=LE.Save.active();storyId=storyId||p&&p.selectedDisaster;if(!p||!p.characterCreated||!LE.Data.scenarios.some(s=>s.id===storyId))return LE.UI.welcome();
  if(session)stop();if(LE.MapScene.isActive())LE.MapScene.stop();if(LE.DecisionScene.isActive())LE.DecisionScene.stop();LE.UI.close(false);if(p.selectedDisaster!==storyId)LE.Save.selectDisaster(storyId,p.id);p=LE.Save.active();
  
  let screen=document.getElementById('mini-screen');if(!screen){screen=h('section',{id:'mini-screen','aria-label':T().studio});document.getElementById('game-frame').append(screen);}screen.hidden=false;document.getElementById('title-screen').hidden=true;document.getElementById('boot-screen').hidden=true;document.querySelector('.topbar').hidden=true;document.getElementById('game-frame').classList.toggle('mini-mode',true);
  session={profileId:p.id,storyId,screen,gameId:null,model:null,canvas:null,storyContext:options.storyContext||null,returnTo:['map','story','practice'].includes(options.returnTo)?options.returnTo:'map',paused:false,lastTime:null,lastSave:0,animation:0,raf:null,listeners:[],language:LE.Save.get().settings.language,color:0,spokenKey:null};const current=session;
  function listen(target,type,fn){target.addEventListener(type,fn);current.listeners.push(()=>target.removeEventListener(type,fn));}
  listen(document,'keydown',event=>{if(session!==current||event.defaultPrevented||!document.getElementById('modal-layer').hidden||['INPUT','SELECT','TEXTAREA'].includes(event.target.tagName))return;if(event.key==='Escape'&&!event.repeat){event.preventDefault();pause();}else if(current.gameId==='signal'&&event.key.toLowerCase()==='t'&&!event.repeat){event.preventDefault();action('pulse');}else if(current.gameId==='drill'&&['1','2','3'].includes(event.key)&&!event.repeat){event.preventDefault();action('step',Number(event.key)-1);}});
  listen(window,'blur',()=>{if(session===current&&!current.paused)pause();});listen(document,'visibilitychange',()=>{if(session===current&&document.hidden&&!current.paused)pause();});listen(window,'pagehide',save);
  current.unsubscribe=LE.Save.subscribe(()=>{if(session===current&&!current.paused&&current.language!==LE.Save.get().settings.language)render();});
  if(gameId&&(options.storyContext&&LE.MiniGames.storyIds?LE.MiniGames.storyIds(storyId):LE.MiniGames.ids()).includes(gameId)){current.gameId=gameId;current.model=LE.MiniGames.create(gameId,storyId,current.storyContext?current.storyContext.snapshot:records()[gameId]&&records()[gameId].run);}
  function frame(timestamp){
   if(session!==current)return;if(!same()){stop(false);LE.UI.close(false);LE.App.beginTitle();LE.UI.toast(T().stale);return;}
   const dt=current.lastTime===null?0:Math.min(1000,Math.max(0,timestamp-current.lastTime));current.lastTime=timestamp;
   if(!current.paused&&!document.hidden){current.animation+=dt/1000;if(current.storyContext)current.storyContext.elapsedMs=(current.storyContext.elapsedMs||0)+dt;if(current.model&&current.model.tick(dt,LE.Save.get().settings.decisionTimers)){save();render();}updateHUD();if(timestamp-current.lastSave>5000){save();current.lastSave=timestamp;}}
   if(current.model&&current.canvas){const c=current.canvas.getContext('2d');if(c)(current.gameId==='coastal'?LE.TsunamiArt.mini:LE.QuakeGames&&LE.QuakeGames.ids().includes(current.gameId)?LE.QuakeArt.mini:LE.MiniArt.paint)(c,current.model,{time:current.animation,language:LE.Save.get().settings.language,reducedMotion:LE.Save.get().settings.reducedMotion,playerArt:LE.Save.artOptions()});}
   current.raf=window.requestAnimationFrame(frame);
  }
  save();render();current.raf=window.requestAnimationFrame(frame);
 }
 function updateHUD(){if(!session||!session.model)return;const model=session.model,d=model.state.data,t=T();const node=document.getElementById('mini-clock');if(node)node.textContent=clock(model.state.activeMs);
  const live=document.getElementById('mini-live');if(!live)return;
  if(session.gameId==='drill')live.textContent=d.coach?t.drillHint:d.step===2?t.holding+' · '+Math.ceil((3000-d.holdMs)/1000)+'s':LE.Save.get().settings.decisionTimers?t.drillTimer+' · '+Math.ceil((25000-d.promptMs)/1000)+'s':t.noPenalty;
  if(session.gameId==='breathe'){
   if(d.mode==='ground')live.textContent=d.grounded.length+'/5';else{const duration=d.mode==='444'?12000:8000,part=Math.floor((d.breathMs%duration)/4000),cue=part===0?t.inhale:d.mode==='444'&&part===1?t.rest:t.exhale;live.textContent=cue+' · '+t.cycle+' '+Math.min(2,Math.floor(d.breathMs/duration)+1)+'/2';}
  }
 }
 function addIcon(button,prop){const canvas=h('canvas',{width:32,height:32,className:'mini-icon','aria-hidden':'true'}),c=canvas.getContext('2d');if(c)LE.MiniArt.icon(c,prop,0,0,1);button.append(canvas);}
 function drawBoard(){const canvas=h('canvas',{width:640,height:224,id:'mini-board',className:'mini-board',role:'img','aria-label':local(info().title)});session.canvas=canvas;
  canvas.addEventListener('pointerdown',event=>{
   if(!session||session.paused||!session.model||session.model.state.phase!=='playing'||event.button>0)return;
   const rect=canvas.getBoundingClientRect(),scale=Math.min(rect.width/640,rect.height/224),x=(event.clientX-rect.left-(rect.width-640*scale)/2)/scale,y=(event.clientY-rect.top-(rect.height-224*scale)/2)/scale;if(x<0||y<0||x>=640||y>=224)return;
   if(session.gameId==='hunt'){const col=Math.floor((x-20)/158),row=Math.floor((y-10)/69);if(col>=0&&col<3&&row>=0&&row<3&&x-20-col*158<145&&y-10-row*69<61)action('inspect',LE.Data.minigames.hazards[session.storyId][row*3+col].id);}
   if(session.gameId==='cleanup'){const d=session.model.state.data;if(d.stage==='paint'){const col=Math.floor((x-148)/87),row=Math.floor((y-38)/72);if(col>=0&&col<3&&row>=0&&row<2)action('paint',row*3+col,session.color);}else if(d.stage==='plant'){const slot=Math.floor((x-100)/138);if(slot>=0&&slot<3&&y>=95&&y<200)action('plant',slot);}else if(d.stage==='card'){const col=Math.floor((x-93)/55),row=Math.floor((y-62)/39);if(col>=0&&col<3&&row>=0&&row<3)action('stamp',row*3+col);}}
  });
  canvas.addEventListener('dragover',event=>{if(session&&session.gameId==='bag')event.preventDefault();});canvas.addEventListener('drop',event=>{event.preventDefault();if(!session||session.gameId!=='bag'||!event.dataTransfer)return;const raw=event.dataTransfer.getData('text/plain');if(raw.startsWith('bag:')&&!session.model.state.data.bag.includes(raw.slice(4)))action('toggle',raw.slice(4));});
  return canvas;
 }
 function playControls(body){
  const s=session,model=s.model,d=model.state.data,t=T(),data=LE.Data.minigames,id=s.gameId;
  if(id==='hunt'){
   body.append(h('p',{},t.found+': '+d.reported.length+'/6'));const grid=h('div',{className:'mini-grid three'});
   data.hazards[s.storyId].forEach((item,i)=>{const b=btn('hunt-inspect-'+item.id,(i+1)+'. '+t.inspect+(d.reported.includes(item.id)?' ✓':''),()=>action('inspect',item.id));addIcon(b,item.prop);grid.append(b);});body.append(grid);
   if(d.inspected){const item=data.hazards[s.storyId].find(x=>x.id===d.inspected);body.append(h('p',{className:'guide-card'},local(item.name)));if(d.reported.includes(item.id))body.append(h('p',{},t.reported));else body.append(h('div',{className:'mini-actions'},btn('hunt-report',t.report,()=>action('report',item.id),'primary'),btn('hunt-safe',t.safe,()=>action('safe',item.id))));}
  }else if(id==='bag'){
   body.append(h('p',{className:'guide-card'},t.bagHint),h('p',{className:'hint'},t.bagAdult));const grid=h('div',{className:'mini-grid three'});
   LE.MiniGames.supplies(s.storyId).forEach(item=>{const selected=d.bag.includes(item.id),b=btn('bag-'+item.id,(selected?'✓ ':'')+local(item.name),()=>action('toggle',item.id));b.setAttribute('aria-pressed',String(selected));b.draggable=true;b.addEventListener('dragstart',event=>{if(event.dataTransfer)event.dataTransfer.setData('text/plain','bag:'+item.id);});b.classList.toggle('is-selected',selected);if(d.checked&&selected&&!item.useful)b.classList.add('needs-review');addIcon(b,item.prop);grid.append(b);});body.append(grid,btn('bag-check',t.bagCheck,()=>action('check'), 'primary'));
  }else if(id==='drill'){
   body.append(h('p',{id:'mini-live',className:'guide-card'}),h('ol',{},data.drill.map((step,i)=>h('li',{className:d.step===i?'current-step':''},local(step)))));
   const controls=h('div',{className:'mini-grid three'});data.drill.forEach((step,i)=>{const b=btn('drill-step-'+i,(i+1)+'. '+(i===2?t.hold:local(step)),()=>action('step',i));b.disabled=d.running;controls.append(b);});body.append(controls);if(d.running)body.append(btn('drill-stop',t.stop,()=>action('stop')));
  }else if(id==='breathe'){
   body.append(h('p',{className:'guide-card'},t.breathNote),h('p',{className:'hint'},s.storyContext?local(LE.Data[s.storyId].calmHelp):t.calmNote),h('p',{id:'mini-live',className:'memory-phrase'}));const modes=h('div',{className:'mini-grid three'});for(const [mode,key]of [['gentle','gentle'],['444','box'],['ground','ground']]){const b=btn('breath-mode-'+mode,t[key],()=>action('mode',mode));b.setAttribute('aria-pressed',String(d.mode===mode));modes.append(b);}body.append(modes);
   if(d.mode==='ground'){body.append(h('p',{},t.groundNote),h('div',{className:'mini-grid'},data.grounds.map((thing,i)=>{const b=btn('ground-'+i,(d.grounded.includes(i)?'✓ ':'')+local(thing),()=>action('notice',i));b.disabled=d.grounded.includes(i);return b;})));}
   else body.append(btn('breath-start',d.running?t.stop:t.breatheStart,()=>action(d.running?'stop':'start'),'primary'));
  }else if(id==='aid'){
   body.append(h('p',{className:'guide-card'},t.aidNote),h('p',{},d.step+'/5'));const cards=h('div',{className:'mini-grid'});
   [3,0,4,2,1].forEach(i=>{const step=data.aidSteps[i],completed=i<d.step,b=btn('aid-'+step.id,(completed?'✓ ':'')+local(step.text),()=>action('step',step.id));b.disabled=completed;cards.append(b);});body.append(cards);
  }else if(id==='chain'){
   body.append(h('h3',{},t.route),h('div',{className:'mini-actions'},btn('chain-dry',(d.route==='dry'?'✓ ':'')+t.dry,()=>action('route','dry'),'primary'),btn('chain-wet',t.wet,()=>action('route','wet'))),h('p',{className:'guide-card'},t.routeNote),h('p',{},t.place));
   const cards=h('div',{className:'mini-grid'});data.roles.forEach((role,i)=>{const b=btn('chain-role-'+i,local(role),()=>action('role',i));b.setAttribute('aria-pressed',String(d.selectedRole===i));b.draggable=true;b.addEventListener('dragstart',event=>{if(event.dataTransfer)event.dataTransfer.setData('text/plain','team:'+i);});cards.append(b);});body.append(cards,h('h3',{},t.front));const slots=h('div',{className:'mini-grid'});
   d.team.forEach((role,i)=>{const b=btn('chain-place-'+i,t.slot+' '+(i+1)+' · '+(role===null?t.empty:local(data.roles[role])),()=>action('place',i));b.disabled=d.route!=='dry';b.addEventListener('dragover',event=>event.preventDefault());b.addEventListener('drop',event=>{event.preventDefault();const raw=event.dataTransfer&&event.dataTransfer.getData('text/plain');if(raw&&/^team:[0-3]$/.test(raw))action('place',i,Number(raw.slice(5)));});slots.append(b);});body.append(slots,btn('chain-check',t.checkTeam,()=>action('check'),'primary'));
  }else if(id==='coastal'){
   const q=LE.Data.coastText[s.language],sorted=LE.Data.coastDonations.every(i=>d.sorted[i.id]===i.bin);body.append(h('p',{className:'guide-card'},q.safetyNote));
   if(!d.safe)body.append(btn('coast-safe',q.safe,()=>action('safety','approved'),'primary'),btn('coast-unsafe',q.unsafe,()=>action('safety','shore')));
   else if(!sorted){body.append(h('h3',{},q.sort));LE.Data.coastDonations.filter(item=>!d.sorted[item.id]).forEach(item=>{const box=h('div',{className:'sort-card'},h('strong',{},local(item.name)));for(const bin of ['food','play','adult'])box.append(btn('coast-sort-'+item.id+'-'+bin,q[bin],()=>action('sort',item.id,bin)));body.append(box);});}
   else if(d.plants.length<3){body.append(h('h3',{},q.nursery),h('p',{},q.nurseryNote),h('div',{className:'mini-grid three'},[0,1,2].map(i=>{const b=btn('coast-plant-'+i,q.plant+' '+(i+1)+(d.plants.includes(i)?' ✓':''),()=>action('plant',i));b.disabled=d.plants.includes(i);return b;})));}
   else if(!d.label){body.append(h('h3',{},q.sign),h('p',{},q.label));for(const key of ['highground','beach'])body.append(btn('coast-label-'+key,q[key],()=>action('label',key)));}
   else if(!d.arrow){body.append(h('h3',{},q.sign),h('p',{},q.arrow));for(const key of ['uphill','river'])body.append(btn('coast-arrow-'+key,q[key],()=>action('arrow',key)));}
   else if(d.map.length<LE.Data.tsunami.route.length){body.append(h('h3',{},q.map),h('p',{},q.mapNote),h('div',{className:'mini-grid'},LE.Data.tsunami.route.map((node,i)=>{const b=btn('coast-route-'+node.id,(d.map.includes(node.id)?'✓ ':String(i+1)+'. ')+local(node.name),()=>action('route',node.id));b.disabled=d.map.includes(node.id);return b;})),btn('coast-route-water',q.river,()=>action('route','water')));}
   else body.append(h('p',{},q.complete),btn('coast-thanks',q.thanks,()=>action('thanks'),'primary'));
  }else if(id==='signal'){
   const q=LE.Data.quakeText[LE.Save.get().settings.language];body.append(h('p',{className:'guide-card'},q.signalSafe),h('p',{},q.count+': '+d.taps+'/3'));const channels=h('div',{className:'mini-actions'});for(const channel of ['tap','whistle']){const b=btn('signal-'+channel,(d.channel===channel?'✓ ':'')+q[channel],()=>action('channel',channel));b.disabled=d.taps>0;b.setAttribute('aria-pressed',String(d.channel===channel));channels.append(b);}body.append(channels);const pulse=btn('signal-pulse',q.pulse,()=>action('pulse'),'primary');pulse.disabled=!d.channel||d.taps>=3;const rest=btn('signal-rest',q.rest,()=>action('rest'));rest.disabled=d.taps!==3;body.append(pulse,rest);
  }else if(id==='retrofit'){
   const q=LE.Data.quakeText[LE.Save.get().settings.language];body.append(h('p',{className:'guide-card'},q.adultRepair));if(d.assignments.length<2){body.append(h('h3',{},q.jobs));for(const job of ['anchor','ceiling']){const done=d.assignments.includes(job),box=h('div',{className:'sort-card'},h('strong',{},(done?'✓ ':'')+q[job]));for(const role of ['adult','child']){const b=btn('retrofit-'+job+'-'+role,q[role],()=>action('assign',job,role));b.disabled=done;box.append(b);}body.append(box);}}else if(!d.cleared)body.append(btn('retrofit-clearance',q.clearance,()=>action('clearance','official'),'primary'));else{body.append(h('h3',{},q.paint),h('p',{},q.paintNote));const palette=h('div',{className:'mini-actions'});LE.MiniArt.colors.forEach((color,i)=>{const b=btn('retrofit-color-'+i,String(i+1),()=>{s.color=i;render();});b.style.background=color;b.setAttribute('aria-label',(s.language==='fil'?'Kulay ':'Color ')+(i+1));b.setAttribute('aria-pressed',String(s.color===i));palette.append(b);});body.append(palette,h('div',{className:'craft-grid'},d.paint.map((color,i)=>{const b=btn('retrofit-paint-'+i,String(i+1)+(color===null?'':' ✓'),()=>action('paint',i,s.color));if(color!==null)b.style.background=LE.MiniArt.colors[color];return b;})));const thanks=btn('retrofit-thanks',q.thanks,()=>action('thanks'),'primary');thanks.disabled=d.paint.some(x=>x===null);body.append(thanks);}
  }else{
   body.append(h('h3',{},t[d.stage]));
   if(d.stage==='sort'){body.append(h('p',{className:'guide-card'},t.bins));data.cleanup.filter(item=>!d.sorted[item.id]).forEach(item=>{const box=h('div',{className:'sort-card'},h('strong',{},local(item.name)));for(const bin of ['recycle','compost','adult'])box.append(btn('sort-'+item.id+'-'+bin,t[bin],()=>action('sort',item.id,bin)));body.append(box);});}
   if(d.stage==='repair')body.append(btn('repair-adult',t.adultRepair,()=>action('repair','adult'),'primary'),btn('repair-child',t.childRepair,()=>action('repair','child')));
   if(d.stage==='paint'){body.append(h('p',{},t.paintNote));const palette=h('div',{className:'mini-actions'});LE.MiniArt.colors.forEach((color,i)=>{const b=btn('paint-color-'+i,String(i+1),()=>{session.color=i;render();});b.style.background=color;b.setAttribute('aria-label',(LE.Save.get().settings.language==='fil'?'Kulay ':'Color ')+(i+1));b.setAttribute('aria-pressed',String(s.color===i));palette.append(b);});body.append(palette,h('div',{className:'craft-grid'},d.paint.map((color,i)=>{const b=btn('paint-'+i,String(i+1)+(color===null?'':' ✓'),()=>action('paint',i,s.color));if(color!==null)b.style.background=LE.MiniArt.colors[color];return b;})));}
   if(d.stage==='plant'){body.append(h('p',{},t.plantNote),h('div',{className:'mini-grid three'},[0,1,2].map(i=>{const b=btn('plant-'+i,t.plant+' '+(i+1)+(d.plants.includes(i)?' ✓':''),()=>action('plant',i));b.disabled=d.plants.includes(i);return b;})));}
   if(d.stage==='card'){body.append(h('p',{},t.cardNote),h('div',{className:'mini-grid'},data.messages.map((message,i)=>{const b=btn('card-message-'+i,local(message),()=>action('message',i));b.setAttribute('aria-pressed',String(d.message===i));return b;})),h('div',{className:'craft-grid'},Array.from({length:9},(_,i)=>btn('card-stamp-'+i,d.stamps.includes(i)?'✿':String(i+1),()=>action('stamp',i)))),btn('card-finish',t.finishCard,()=>action('finish'),'primary'));}
  }
 }
 function render(){
  if(!session||!same())return;const focusId=document.activeElement&&document.activeElement.id;if(window.speechSynthesis)window.speechSynthesis.cancel();const s=session,t=T();s.language=LE.Save.get().settings.language;
  const top=h('header',{className:'practice-header'},h('div',{},h('span',{className:'eyebrow'},'JUNIOR DRRM CLUB'),h('h2',{},s.storyContext?(LE.Data[s.storyId].storyText||LE.Data.storyText)[s.language].activity:t.studio),h('small',{},LE.Save.active().name+' · '+local(LE.Data.scenarios.find(st=>st.id===s.storyId).title))),btn('mini-pause',t.pause,pause));
  const content=h('div',{className:'mini-content'}),actions=h('div',{className:'mini-actions'});let speech='';
  if(!s.model){
   const summary=LE.MiniGames.summary(records());content.append(h('h2',{id:'mini-hub-heading',tabIndex:-1},t.hub),h('p',{},t.note),h('p',{className:'guide-card'},t.count+': '+summary.completed+'/7 · '+(summary.finalized?t.contribution+': '+summary.component+'/20':t.unfinished)));
   const grid=h('div',{className:'mini-grid'});LE.Data.minigames.games.forEach(game=>{const record=records()[game.id],card=h('article',{className:'mini-hub-card'},h('h3',{},local(game.title)),h('p',{},local(game.intro)));const icon=h('canvas',{width:64,height:64,className:'mini-hub-icon','aria-hidden':'true'}),c=icon.getContext('2d');if(c)LE.MiniArt.icon(c,game.prop,0,0,2);card.append(icon);if(record&&Number.isFinite(record.best))card.append(h('p',{},t.best+': '+record.best+'%'));card.append(btn('mini-open-'+game.id,record&&record.run?t.continue:t.start,()=>showGame(game.id),'primary'));grid.append(card);});content.append(grid);actions.append(btn('mini-back',t.back,leave));
  }else{
   const game=info(),m=s.model,state=m.state;content.append(h('h2',{id:'mini-heading',tabIndex:-1},local(game.title)),h('p',{},s.storyContext?local(s.storyContext.intro):local(game.intro)),h('p',{className:'hint'},t.time+' · ',h('span',{id:'mini-clock'},clock(state.activeMs))),drawBoard());
   if(s.gameId==='breathe'&&!s.storyContext){const p=LE.Save.active(),saved=p.practice&&p.practice[s.storyId];content.append(h('p',{id:'mini-calm'},t.calm+': '+(saved&&Number.isFinite(saved.calm)?saved.calm:100)+'/100'));}
   if(state.phase==='playing'){playControls(content);content.append(h('p',{id:'mini-feedback',className:'guide-card',role:'status'},state.feedback?((s.gameId==='coastal'&&LE.Data.coastText[s.language][state.feedback])||(LE.Data.quakeText&&LE.Data.quakeText[s.language][state.feedback])||t[state.feedback]||t.try):t.noPenalty));}
   else if(state.phase==='learn'){content.append(h('h3',{},t.learn),h('p',{className:'guide-card'},local(game.learn)));actions.append(btn('mini-ack',t.done,()=>action('ack'),'primary'));}
   else{
    const r=m.result();content.append(h('h3',{},t.complete),h('p',{className:'memory-phrase'},t.score+': '+r.score+'%'),h('p',{},local(game.learn)));if(s.gameId==='drill')content.append(h('p',{},t.signal));if(s.gameId==='breathe'&&!s.storyContext)content.append(h('p',{},t.calmNote));if(s.storyContext)actions.append(btn('mini-story-return',(LE.Data[s.storyId].storyText||LE.Data.storyText)[s.language].returnStory,()=>{const context=s.storyContext;save();stop(false);LE.StoryScene.returnFromActivity(context,true);},'primary'));else actions.append(btn('mini-replay',t.replay,replay));
   }
   if(!s.storyContext)actions.append(btn('mini-hub',t.hub,hub));else if(state.phase!=='complete')actions.append(btn('mini-story-exit',(LE.Data[s.storyId].storyText||LE.Data.storyText)[s.language].unfinishedActivity,leave));speech=local(game.title)+'. '+(state.phase==='playing'?(s.storyContext?local(s.storyContext.intro):local(game.intro)):local(game.learn));
   content.append(btn('mini-read',t.read,()=>LE.UI.speak(speech)));
  }
  content.append(actions,h('p',{className:'modal-note'},s.storyContext?(LE.Data[s.storyId].storyText||LE.Data.storyText)[s.language].miniNote:t.note));s.screen.replaceChildren(top,content);updateHUD();const retained=focusId&&document.getElementById(focusId),heading=document.getElementById('mini-heading')||document.getElementById('mini-hub-heading');if(retained&&!retained.disabled)retained.focus();else if(heading)heading.focus();
  if(s.model&&LE.Save.get().settings.readAloud){const key=s.gameId+':'+s.model.state.phase;if(key!==s.spokenKey){s.spokenKey=key;LE.UI.speak(speech);}}
 }
 LE.MiniGameScene={open,stop,save,pause,leave,hub,showGame,modalChanged,isActive:()=>Boolean(session),model:()=>session&&session.model};
})();
