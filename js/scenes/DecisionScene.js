/* Practice UI. All scoring lives in the reusable DOM-free decision engine. */
(function(){
 'use strict';const LE=window.LE=window.LE||{};let session=null,directed=null;
 const T=()=>LE.Data.decisionText[LE.Save.get().settings.language];
 const local=x=>typeof x==='string'?x:x[LE.Save.get().settings.language]||x.en;
 const clock=ms=>{const seconds=Math.floor(ms/1000);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');};
 const button=(id,text,action,kind='primary')=>LE.UI.h('button',{type:'button',id,className:kind,onclick:action},text);
 function sameStudent(){return session&&LE.Save.active()&&LE.Save.active().id===session.profileId;}
 function save(){
  if(!sameStudent())return false;const p=LE.Save.active(),data=session.engine.serialize();
  LE.Save.updateActive({practice:{...(p.practice||{}),[session.storyId]:data},checkpoint:{stage:'practice',storyId:session.storyId}});
  if(!LE.Save.status().persistent&&!session.warned){session.warned=true;LE.UI.toast(T().storage);}return LE.Save.status().persistent;
 }
 function stop(commit=true){
  if(directed){if(commit)directed.context.save();window.cancelAnimationFrame(directed.raf);window.removeEventListener('blur',directed.blur);directed=null;}
  if(!session)return;if(commit)save();const old=session;session=null;window.cancelAnimationFrame(old.raf);old.listeners.forEach(remove=>remove());
  if(old.unsubscribe)old.unsubscribe();old.screen.replaceChildren();old.screen.hidden=true;document.querySelector('.topbar').hidden=false;
  document.getElementById('game-frame').classList.toggle('practice-mode',false);if(window.speechSynthesis)window.speechSynthesis.cancel();
 }
 function leave(){if(!session)return;const id=session.storyId,valid=sameStudent();stop();LE.UI.close(false);if(valid)LE.MapScene.open(id);else{LE.App.beginTitle();LE.UI.toast(T().stale);}}
 function modalChanged(open){if(!session)return;session.paused=open;session.lastTime=null;if(!open){render();}}
 function pause(){if(!session)return;save();const h=LE.UI.h,t=T();LE.UI.modal(t.pause,h('p',{},t.paused),[
  button('practice-resume',t.resumeButton,()=>LE.UI.close()),button('practice-settings',t.settings,()=>LE.UI.settings(),'secondary'),button('practice-glossary',LE.UI.t('glossary'),()=>LE.LearningScene.glossary(),'secondary'),button('practice-leave',t.leave,leave,'secondary'),button('practice-minigames',LE.Data.miniText[LE.Save.get().settings.language].studio,()=>LE.MiniGameScene.open(session.storyId,'breathe',{returnTo:'practice'}),'secondary')]);}
 function open(storyId,options={}){
  if(options.directorContext)return openDirected(options.directorContext);
  let p=LE.Save.active();storyId=storyId||p&&p.selectedDisaster;
  if(!p||!p.characterCreated||!LE.Data.scenarios.some(s=>s.id===storyId))return LE.UI.welcome();
  if(session)stop();if(LE.MapScene.isActive())LE.MapScene.stop();LE.UI.close(false);
  if(LE.MiniGameScene&&LE.MiniGameScene.isActive())LE.MiniGameScene.stop();
  
  if(p.selectedDisaster!==storyId)LE.Save.selectDisaster(storyId,p.id);p=LE.Save.active();
  const h=LE.UI.h;let screen=document.getElementById('practice-screen');if(!screen){screen=h('section',{id:'practice-screen','aria-label':T().practice});document.getElementById('game-frame').append(screen);}
  document.getElementById('title-screen').hidden=true;document.getElementById('boot-screen').hidden=true;document.querySelector('.topbar').hidden=true;screen.hidden=false;document.getElementById('game-frame').classList.toggle('practice-mode',true);
  const saved=!options.fresh&&p.practice&&p.practice[storyId];
  session={profileId:p.id,storyId,screen,engine:LE.Decisions.create(LE.Data.practice,saved),listeners:[],raf:null,paused:false,lastTime:null,lastSave:0,animation:0,reviewed:false,language:LE.Save.get().settings.language};
  const s=session;
  function listen(target,type,fn){target.addEventListener(type,fn);s.listeners.push(()=>target.removeEventListener(type,fn));}
  listen(document,'keydown',event=>{if(session!==s||event.defaultPrevented||!document.getElementById('modal-layer').hidden)return;if(event.key==='Escape'&&!event.repeat){event.preventDefault();pause();}});
  listen(window,'blur',()=>{if(session===s&&!s.paused)pause();});
  listen(document,'visibilitychange',()=>{if(session===s&&document.hidden&&!s.paused)pause();});listen(window,'pagehide',save);
  // Settings writes can occur while another modal is open; defer rebuilding to close.
  s.unsubscribe=LE.Save.subscribe(()=>{if(session===s&&!s.paused&&s.language!==LE.Save.get().settings.language){s.language=LE.Save.get().settings.language;render();}});
  function frame(timestamp){
   if(session!==s)return;
   if(!sameStudent()){stop(false);LE.App.beginTitle();LE.UI.close(false);LE.UI.toast(T().stale);return;}
   const dt=s.lastTime===null?0:Math.min(1000,Math.max(0,timestamp-s.lastTime));s.lastTime=timestamp;
   if(!s.paused&&!document.hidden){
    s.animation+=dt/1000;const changed=s.engine.tick(dt,LE.Save.get().settings.decisionTimers);if(changed){save();render();}
    if(timestamp-s.lastSave>5000){save();s.lastSave=timestamp;}
    updateHUD();
   }
   if(s.canvas){const c=s.canvas.getContext('2d');if(c)LE.DecisionArt.paint(c,{decision:s.engine.current(),phase:s.engine.state.phase,time:s.animation,reducedMotion:LE.Save.get().settings.reducedMotion,playerArt:LE.Save.artOptions()});}
   s.raf=window.requestAnimationFrame(frame);
  }
  save();render();s.raf=window.requestAnimationFrame(frame);
 }
 function answer(id){if(!session||session.paused||!sameStudent()||!session.engine.answer(id))return;LE.Audio.play(session.engine.choice().type==='best'?'success':'oops');session.animation=0;save();render();}
 function next(){if(!session||session.paused||!sameStudent()||!session.engine.advance())return;session.reviewed=false;session.animation=0;save();render();}
 function updateHUD(){
  if(!session)return;const e=session.engine,t=T();
  for(const [id,value]of [['practice-active-time',clock(e.state.activeMs)],['practice-chapter-time',clock(e.state.chapterMs[e.current()&&e.current().pillar]||0)],['practice-timer',!e.current()?'':e.state.timerWaived||!e.current().timer?t.untimed:!LE.Save.get().settings.decisionTimers?t.timerOff:t.timer+' · '+Math.ceil(e.state.remainingMs/1000)+'s']]){const node=document.getElementById(id);if(node)node.textContent=value;}
 }
 function reset(){const h=LE.UI.h,t=T();LE.UI.modal(t.replay,h('p',{},t.replayNote),[button('practice-reset-confirm',t.reset,()=>{const id=session.storyId;open(id,{fresh:true});}),button('practice-reset-cancel',t.resumeButton,()=>LE.UI.close(),'secondary')]);}
 function render(){
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  if(!session)return;const s=session,e=s.engine,state=e.state,d=e.current(),h=LE.UI.h,t=T(),r=e.record(),c=e.choice(),best=d&&d.choices.find(ch=>ch.type==='best');s.language=LE.Save.get().settings.language;
  const head=h('header',{className:'practice-header'},h('div',{},h('span',{className:'eyebrow'},'JUNIOR DRRM CLUB'),h('h2',{},t.practice),h('small',{},LE.Save.active().name+' · '+local(LE.Data.scenarios.find(st=>st.id===s.storyId).title))),button('practice-pause',t.help,pause,'secondary'));
  const meters=h('div',{className:'practice-meters'});
  for(const [label,value]of [[t.safety,state.safety],[t.calm,state.calm]])meters.append(h('div',{},h('label',{},label+' '+value+'/100'),h('progress',{max:100,value,'aria-label':label+' '+value+'/100'})));
  meters.append(h('div',{},h('span',{},t.score),h('strong',{},e.tally().raw+'/'+e.tally().maximum)),h('div',{},h('span',{},t.time),h('strong',{id:'practice-active-time'},clock(state.activeMs))));
  const badges=h('div',{className:'practice-badges','aria-label':t.badge},LE.Data.pillars.map(p=>h('span',{className:state.chapters[p.id]?'is-complete':''},(state.chapters[p.id]?'✓ ':'')+LE.UI.t(p.labelKey))));
  const main=h('div',{className:'practice-content'}),actions=h('div',{className:'practice-actions'}),article=h('article',{className:'decision-card'});
  s.canvas=h('canvas',{width:384,height:128,className:'decision-art',role:'img','aria-label':'Ma’am Mara, '+LE.Save.active().name+', Bantay'});article.append(s.canvas);
  let title='',readText='';const copy=h('div',{className:'decision-copy'});
  if(state.phase==='complete'){
   title=t.complete;copy.append(h('p',{},t.mastery+': '+e.tally().percent+'%'),h('p',{},t.decisionShare+': '+e.score().decisions+'/60'),h('p',{className:'hint'},t.pending),h('p',{className:'guide-card'},t.noBonus));
   copy.append(h('h3',{},t.reflection),h('ul',{},e.review().map(item=>h('li',{},local(item.memory)))));
   actions.append(button('practice-replay',t.replay,reset,'secondary'),button('practice-back',t.back,leave));
  }else if(state.phase==='chapter'){
   const path=state.chapters[d.pillar],notes=e.review().filter(item=>item.pillar===d.pillar);title=t.reflection+' · '+LE.UI.t(LE.Data.pillars.find(p=>p.id===d.pillar).labelKey);
   copy.append(h('p',{className:'guide-card'},path==='hero'?t.hero:path==='learner'?t.learner:t.tryAgain),h('ul',{},notes.map(item=>h('li',{},local(item.memory)))));
   const continuation=button('practice-next',state.index===LE.Data.practice.decisions.length-1?t.finish:t.next,next);
   if(path==='learner'){copy.append(h('h3',{},t.hint),h('p',{},local(best.learn)));}
   if(path==='try-again'){
    continuation.disabled=!s.reviewed;copy.append(h('h3',{},t.reviewPrompt),h('p',{},local(d.text)),button('practice-review',local(best.text),()=>{s.reviewed=true;continuation.disabled=false;const n=document.getElementById('practice-review-feedback');n.textContent=t.reviewDone;},'secondary'),h('p',{id:'practice-review-feedback',role:'status'},s.reviewed?t.reviewDone:''));
   }actions.append(continuation);
  }else if(state.phase==='question'||state.phase==='retry'){
   title=t.question+' '+(state.index+1)+'/8';copy.append(h('p',{id:'practice-timer',className:'timer-label'}),h('p',{className:'decision-question'},local(d.text)));
   if(state.phase==='retry')copy.append(h('p',{className:'guide-card'},t.retryNote),h('p',{},t.hint+': '+local(best.learn)));
   const choices=h('div',{className:'decision-choices'});for(const ch of d.choices){const b=button('decision-'+ch.id,ch.id+'. '+local(ch.text)+(state.phase==='retry'&&ch.type==='best'?' · '+t.best:''),()=>answer(ch.id),'secondary');if(state.phase==='retry')b.disabled=ch.type!=='best';choices.append(b);}copy.append(choices);readText=local(d.text)+' '+d.choices.map(ch=>ch.id+'. '+local(ch.text)).join(' ');
  }else if(state.phase==='learn'){
   title=t.learn;const points=r.rescue?(r.retried?3:0):c.type==='best'?10:c.type==='okay'?5:r.retried?3:0;
   copy.append(h('p',{className:'points-note'},t.earned+': +'+points),h('p',{},local(c.learn)),h('h3',{},t.fact),h('p',{},local(d.funFact)),h('p',{className:'memory-phrase'},t.memory+': '+local(d.memory)));actions.append(button('practice-next',t.continue,next));
  }else if(state.phase==='timeout'){
   title=t.timeout;copy.append(h('p',{},t.timeoutText),h('h3',{},t.hint),h('p',{},local(best.learn)));actions.append(button('practice-next',t.retry,next));
  }else{
   const rescue=state.phase==='rescue';title=rescue?t.rescue:c.type==='okay'?t.okay:t.wrong;
   copy.append(h('p',{},rescue?t.rescueText:c.type==='wrong'?local(LE.Data.practiceConsequences[d.id]):t.consequence),h('h3',{},t.hint),h('p',{},local(c.learn)));actions.append(button('practice-next',rescue||c.type==='wrong'?t.retry:t.learn,next));
  }
  const heading=h('h2',{id:'practice-heading',tabIndex:-1},title);copy.children.length?article.append(heading,copy):article.append(heading);
  if(!readText)readText=title+'. '+copy.textContent;
  const read=button('practice-read',t.read,()=>{s.speechPaused=true;LE.UI.speak(readText);if(LE.Save.get().settings.decisionTimers&&state.phase==='question'&&d.timer){e.state.timerWaived=true;save();updateHUD();}},'secondary');
  // Read-aloud always removes this question's countdown, including local voice delays.
  main.append(article,actions,h('div',{className:'practice-bottom'},h('small',{},t.chapterTime+' · ',h('span',{id:'practice-chapter-time'}), ' · '+t.bag),read),h('p',{className:'modal-note'},t.note));
  s.screen.replaceChildren(head,meters,badges,main);updateHUD();heading.focus();
  if(LE.Save.get().settings.readAloud&&['question','retry','learn'].includes(state.phase)){LE.UI.speak(readText);if(state.phase==='question'&&d.timer){state.timerWaived=true;save();updateHUD();}}
 }

 /* Directed decisions share the story engine; they never create practice records. */
 function openDirected(context){
  const d=context.director,n=d.current(),p=LE.Save.active();if(!p||p.id!==context.profileId||!n||n.type!=='decision')return false;if(session||directed)stop();
  const s={context,nodeId:n.id,raf:null,lastTime:null,animation:0,suspended:false};directed=s;s.blur=()=>{if(directed===s){s.suspended=true;renderDirected();}};window.addEventListener('blur',s.blur);
  function frame(time){if(directed!==s)return;const same=LE.Save.active()?.id===context.profileId&&d.current()?.id===s.nodeId;if(!same){stop(false);return;}const dt=s.lastTime===null?0:Math.min(1000,Math.max(0,time-s.lastTime));s.lastTime=time;
   if(document.getElementById('director-decision')&&!document.hidden&&!s.suspended){s.animation+=dt/1000;if(d.tick(dt,LE.Save.get().settings.decisionTimers)){context.save();renderDirected();}const timer=document.getElementById('director-decision-timer'),e=d.story.decisions();if(timer)timer.textContent=!e.current().timer||e.state.timerWaived||!LE.Save.get().settings.decisionTimers?T().untimed:T().timer+' · '+Math.ceil(e.state.remainingMs/1000)+'s';const canvas=document.getElementById('director-decision-art');if(canvas)LE.DecisionArt.paint(canvas.getContext('2d'),{decision:e.current(),phase:e.state.phase,time:s.animation,reducedMotion:LE.Save.get().settings.reducedMotion,playerArt:LE.Save.artOptions()});}
   else if(document.getElementById('modal-layer').hidden){stop(false);return;}s.raf=window.requestAnimationFrame(frame);
  }
  renderDirected();s.raf=window.requestAnimationFrame(frame);return true;
 }
 function renderDirected(){if(!directed)return;const s=directed,ctx=s.context,director=ctx.director,e=director.story.decisions(),d=e.current(),c=e.choice(),t=T(),h=LE.UI.h,phase=e.state.phase,L=(en,fil)=>LE.Save.get().settings.language==='fil'?fil:en;
  const meters=h('div',{className:'practice-meters'},[[t.safety,e.state.safety],[t.calm,e.state.calm]].map(([label,value])=>h('div',{},h('label',{},label+' '+value+'/100'),h('progress',{value,max:100,'aria-label':label+' '+value+'/100'}))),h('div',{},h('strong',{},director.story.score().decisions+'/60')));
  const body=h('div',{id:'director-decision'},meters,h('canvas',{id:'director-decision-art',width:384,height:128,className:'decision-art','aria-hidden':'true'})),footer=[];
  const valid=()=>directed===s&&LE.Save.active()?.id===ctx.profileId&&director.current()?.id===s.nodeId;
  function changed(){director.decisionChanged();ctx.save();renderDirected();}
  function next(){if(!valid())return;if(phase==='learn'){if(!ctx.complete())return;stop(false);LE.UI.close();return;}if(e.advance())changed();}
  if(s.suspended)body.append(h('p',{className:'guide-card'},L('Question paused while the window was away.','Nakahinto ang tanong habang nasa ibang window.')),h('button',{id:'director-decision-resume',type:'button',className:'primary',onclick:()=>{s.suspended=false;s.lastTime=null;renderDirected();}},L('Resume question','Ituloy ang tanong')));
  if(['question','retry'].includes(phase)){body.append(h('p',{id:'director-decision-timer'}),h('h3',{},local(d.text)));if(phase==='retry')body.append(h('p',{className:'guide-card'},t.retryNote+' '+local(d.choices.find(c=>c.type==='best').learn)));const choices=h('div',{className:'decision-choices'});for(const choice of d.choices)choices.append(h('button',{id:'decision-'+choice.id,type:'button',className:'secondary',disabled:s.suspended||phase==='retry'&&choice.type!=='best',onclick:()=>{if(valid()&&!s.suspended&&e.answer(choice.id)){LE.Audio.play(choice.type==='best'?'success':'oops');changed();}}},choice.id+'. '+local(choice.text)));body.append(choices);
  }else if(phase==='learn'){body.append(h('h3',{},t.learn),h('p',{},local(c.learn)),h('p',{},local(d.funFact)),h('p',{className:'memory-phrase'},local(d.memory)));footer.push(button('director-decision-next',t.continue,next));
  }else if(phase==='timeout'){body.append(h('h3',{},t.timeout),h('p',{},t.timeoutText));footer.push(button('director-decision-next',t.retry,next));
  }else{const rescue=phase==='rescue';body.append(h('h3',{},rescue?t.rescue:c.type==='okay'?t.okay:t.wrong),h('p',{},rescue?t.rescueText:local(d.consequenceText||c.learn)),h('p',{className:'guide-card'},local(c.learn)));footer.push(button('director-decision-next',rescue||c.type==='wrong'?t.retry:t.learn,next));}
  footer.push(button('director-decision-settings',LE.UI.t('settings'),()=>LE.UI.settings(),'secondary'),button('director-decision-exit',L('Save & title','Itala at pamagat'),()=>{if(!valid())return;ctx.save();stop(false);LE.MapScene.toTitle();},'secondary'));
  footer.push(button('director-decision-read',t.read,()=>{if(!valid())return;e.state.timerWaived=true;ctx.save();LE.UI.speak(body.textContent);},'secondary'));LE.UI.modal(d.id+' · '+L('Story decision','Pasya sa kuwento'),body,footer).classList.add('wide-dialog');
  if(LE.Save.get().settings.readAloud){e.state.timerWaived=true;ctx.save();LE.UI.speak(body.textContent);}
 }
 LE.DecisionScene={open,stop,save,pause,leave,modalChanged,isActive:()=>Boolean(session||directed),engine:()=>directed?directed.context.director.story.decisions():session&&session.engine};
})();
