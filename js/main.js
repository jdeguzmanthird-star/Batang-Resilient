/* Stage 4 boot/title scene, with saved campus exploration resume. */
(function () {
  'use strict';
  const LE = window.LE = window.LE || {};
  const canvas = document.getElementById('backdrop');
  const ctx = canvas.getContext('2d', {alpha:false});
  let lastPaint = 0, animationTime = 0;
  let reducedMotion = false;
  const pixel = (x,y,w,h,color) => { ctx.fillStyle=color; ctx.fillRect(Math.round(x),Math.round(y),w,h); };
  function polygon(points,color) {
    ctx.fillStyle=color; ctx.beginPath(); ctx.moveTo(points[0][0],points[0][1]);
    points.slice(1).forEach(point => ctx.lineTo(point[0],point[1])); ctx.closePath(); ctx.fill();
  }
  function cloud(x,y) {
    pixel(x,y,48,9,'#ffffffb8'); pixel(x+8,y-7,30,8,'#ffffffb8'); pixel(x+16,y-11,16,5,'#ffffffb8');
  }
  function tree(x,y,size=1) {
    ctx.save(); ctx.translate(x,y); ctx.scale(size,size);
    pixel(-7,4,30,8,'#467b5530'); pixel(4,-23,7,31,'#81523d'); pixel(8,-20,4,26,'#644633');
    polygon([[7,-13],[-5,-27],[-2,-31],[10,-23],[21,-34],[24,-30],[13,-13]],'#81523d');
    pixel(-19,-53,52,27,'#397655'); pixel(-25,-46,60,24,'#397655'); pixel(-14,-61,37,12,'#4b8960');
    pixel(-23,-40,20,15,'#28644a'); pixel(13,-39,23,15,'#28644a'); pixel(-13,-52,18,9,'#62a069');
    pixel(6,-58,12,7,'#72ac70'); pixel(19,-46,7,5,'#69a269'); pixel(-5,-31,7,4,'#4b8960');
    pixel(16,-49,3,3,'#eab86a'); pixel(-10,-39,3,3,'#eab86a');
    ctx.restore();
  }
  function school() {
    // Building shapes are title decoration, not a playable map.
    pixel(346,180,270,12,'#4b785f33');
    pixel(352,112,255,67,'#f0deb2'); pixel(352,159,255,21,'#d7bf91');
    pixel(352,116,255,5,'#ddaa77'); pixel(351,177,261,5,'#b4ac86');
    polygon([[339,112],[371,81],[589,81],[623,112]],'#bb6041');
    polygon([[351,104],[374,84],[588,84],[611,104]],'#dc7d4f');
    pixel(340,110,283,7,'#8e4c36'); pixel(357,103,252,4,'#e59b61');
    for (let x=366; x<606; x+=54) {
      pixel(x,129,32,26,'#8c8261'); pixel(x+2,131,28,22,'#70a8a8');
      pixel(x+15,131,2,22,'#ecdec0'); pixel(x+2,141,28,2,'#ecdec0'); pixel(x,154,34,3,'#c49e6a');
    }
    pixel(452,126,40,54,'#51695c'); pixel(457,132,29,48,'#2d514d'); pixel(458,133,4,46,'#3d6a60');
    pixel(478,151,3,3,'#edc778');
    for (let x=355;x<613;x+=50) { pixel(x,116,6,65,'#fff1ce'); pixel(x+5,117,3,64,'#c2aa7c'); }
    pixel(437,180,66,4,'#d4c5a6'); pixel(431,184,78,4,'#c0b392'); pixel(423,188,94,4,'#e0d4b8');
    pixel(442,98,63,13,'#fcf1cf'); pixel(446,102,55,2,'#5c7c65'); pixel(457,106,34,1,'#5c7c65');
    // Covered walkway and a separate garden shed.
    pixel(589,160,29,55,'#e1d7ad'); pixel(587,159,34,6,'#699592'); pixel(594,168,5,47,'#fdf0c9');
  }
  function paint(time) {
    if (!ctx) return;
    ctx.imageSmoothingEnabled=false;
    pixel(0,0,640,360,'#bddedc');
    polygon([[180,92],[260,52],[333,88],[402,46],[491,94],[540,66],[640,97],[640,142],[180,142]],'#90bcab');
    polygon([[280,105],[356,78],[431,108],[503,83],[640,115],[640,148],[280,148]],'#77ab91');
    const drift = reducedMotion ? 0 : (time*1.5)%40;
    cloud(320+drift,32); cloud(520+drift/2,45); cloud(220+drift/2,58);
    pixel(589,18,19,19,'#f6cf77'); pixel(584,23,29,9,'#f6cf77');
    pixel(0,137,640,223,'#9cbb77'); pixel(300,149,340,8,'#94b56e');
    polygon([[346,181],[610,181],[664,340],[286,340]],'#ded7b4');
    polygon([[434,191],[508,191],[535,291],[406,291]],'#eae3c3');
    for (let y=211;y<320;y+=24) pixel(333-(y-211)/3,y,280+(y-211)/2,1,'#b9b999');
    for (let x=350;x<620;x+=42) polygon([[x,191],[x+1,191],[x+12,325],[x+11,325]],'#b9b999');
    // Lawn flecks stay deterministic so they do not flicker.
    for(let i=0;i<80;i++) {
      const x=(i*97+233)%640,y=157+(i*41)%180;
      if(x<300 || (x>590 && y>225)) pixel(x,y,3,1,i%3===0?'#739e62':'#b5cc8c');
    }
    school();
    tree(333,193,0.95); tree(616,213,0.87); tree(580,287,0.8);
    // School garden, with accessible paved paths nearby.
    pixel(552,240,58,20,'#9f8053'); pixel(554,242,54,16,'#735b3f');
    for(let x=560;x<608;x+=10) { pixel(x,245,4,10,'#547e47'); pixel(x-2,246,8,4,'#78a459'); }
    // Philippine flag: decorative, without any official agency seal.
    pixel(512,260,25,5,'#b0ab88'); pixel(518,255,13,5,'#eae1bd'); pixel(524,179,2,77,'#f6eed0');
    const wave=reducedMotion?0:Math.round(Math.sin(time*2)*2);
    polygon([[526,181],[553,184+wave],[553,191+wave],[526,190]],'#356c9b');
    polygon([[526,190],[553,191+wave],[553,199+wave],[526,199]],'#bf5b4a');
    polygon([[526,181],[540,190],[526,199]],'#fff4da'); pixel(528,188,3,3,'#f0bd58');
    // Foreground school friends, a bench, flowers, and low school fence.
    pixel(364,262,42,5,'#9d7451'); pixel(368,267,4,11,'#795d45'); pixel(397,267,4,11,'#795d45');
    const playerArt=LE.Save.artOptions();
    LE.Art.drawCharacter(ctx,457,287,{...playerArt,direction:'down',time,reducedMotion},1.6);
    LE.Art.drawCharacter(ctx,494,289,{npc:'bantay',direction:'right',time,walking:!reducedMotion,reducedMotion,vest:playerArt.outfit==='k9'},1.1);
    for(let i=0;i<6;i++){ pixel(304+i*11,298+(i%2)*5,2,6,'#658d53'); pixel(302+i*11,297+(i%2)*5,6,3,i%2?'#f6d390':'#ed9966'); }
    pixel(286,324,354,4,'#f2e7bd'); pixel(286,336,354,3,'#d2c6a0');
    for(let x=287;x<640;x+=22) { pixel(x,317,5,28,'#f5ebc8'); pixel(x+4,319,2,26,'#c9bd95'); }
    tree(634,347,1.13);
  }
  function animate(timestamp) {
    window.requestAnimationFrame(animate);
    if (document.hidden) return;
    if(LE.MapScene&&LE.MapScene.isActive()||LE.DecisionScene&&LE.DecisionScene.isActive()||LE.MiniGameScene&&LE.MiniGameScene.isActive())return;
    // Title art needs only 30 FPS. Reduced-motion mode redraws on setting changes.
    if (timestamp-lastPaint<33 || reducedMotion && lastPaint>0) return;
    lastPaint=timestamp; animationTime=timestamp/1000;
    paint(animationTime);
  }
  function refresh() {
    const settings=LE.Save.get().settings;
    reducedMotion=settings.reducedMotion;
    lastPaint=0;
    LE.UI.titleState();
    paint(reducedMotion?0:animationTime);
  }
  function beginTitle() {
    document.getElementById('boot-screen').hidden=true;
    document.getElementById('title-screen').hidden=false;
    document.getElementById('start-game').focus();
    LE.Audio.play('start');
  }
  try {
    LE.Save.load();
    LE.Save.subscribe(refresh);
    refresh();
    document.getElementById('enter-school').addEventListener('click',async () => {
      const sound=await LE.Audio.unlock();
      beginTitle();
      if(!sound && !LE.Save.get().settings.muted) LE.UI.toast(LE.UI.t('audioMissing'));
    });
    // A click or tap is the browser permission needed to start local audio.
    document.getElementById('game-frame').addEventListener('pointerdown',() => { LE.Audio.unlock(); },{passive:true});
    document.getElementById('start-game').addEventListener('click',() => { LE.Audio.play('select'); LE.UI.slots(); });
    document.getElementById('continue-game').addEventListener('click',() => {
      if(!LE.Save.active()) {
        const index=LE.Save.get().slots.findIndex(Boolean);
        if(index>=0) LE.Save.selectSlot(index);
      }
      LE.UI.welcome();
    });
    document.addEventListener('keydown',event=>{if(event.key==='F2'&&!event.repeat){event.preventDefault();LE.ScenarioDirector.debugMenu();}});
    document.getElementById('open-settings').addEventListener('click',() => { LE.Audio.play('select'); LE.UI.settings(); });
    document.getElementById('open-help').addEventListener('click',() => { LE.Audio.play('select'); LE.UI.help(); });
    document.getElementById('open-art').addEventListener('click',() => { LE.Audio.play('select'); LE.ArtPreview.open(); });
    document.getElementById('open-shop').addEventListener('click',()=>LE.ShopScene.open());
    document.getElementById('open-glossary').addEventListener('click',()=>LE.LearningScene.glossary());
    document.getElementById('open-quick-quiz').addEventListener('click',()=>LE.QuizScene.quick());
    document.getElementById('open-teacher').addEventListener('click',() => { if(LE.Save.get().settings.teacherMode) LE.UI.teacher(); });
    document.getElementById('quick-mute').addEventListener('click',async () => {
      await LE.Audio.unlock();
      LE.Save.updateSettings({muted:!LE.Save.get().settings.muted});
      LE.UI.toast(LE.UI.t('soundSaved'));
    });
    document.querySelector('.boot-track>span').style.width='100%';
    // Boot is deterministic: no network requests or pretend asset downloads.
    window.setTimeout(() => { document.getElementById('enter-school').disabled=false; },300);
    if(ctx) window.requestAnimationFrame(animate);
    LE.App={version:'0.11.2-director',stage:11,refresh,paint,beginTitle};
  } catch(error) {
    document.getElementById('boot-screen').replaceChildren(LE.UI.h('h1',{},'Ligtas Eskwela'),LE.UI.h('p',{},LE.UI.t('bootError')));
    console.error('Ligtas Eskwela boot error:',error);
  }
})();
