/* DOM menus stay readable, keyboard-accessible, and separate from the canvas. */
(function () {
  'use strict';
  const LE = window.LE = window.LE || {};
  const strings = {
    en: {
      club:'JUNIOR DRRM CLUB', offline:'OFFLINE READY', boot:'Opening the school gates…', enter:'Enter school',
      story:'A SCHOOL STORY. A SAFER TOMORROW.', intro:'Small steps. Brave choices. A school ready together.',
      start:'Start a story', continue:'Continue', settings:'Settings', help:'How to play', shop:'DRRM Shop', glossary:'Glossary', quickQuiz:'Quick Quiz', teacher:'Teacher Mode',
      school:'Maliwanag Elementary', location:'Iloilo, Western Visayas · A fictional school', welcome:'Mag-andam kita. Let’s get ready together.',
      prevent:'Prevent', prepare:'Prepare', respond:'Respond', recover:'Recover', foundation:'SCENARIO DIRECTOR REPAIR', artStudio:'Art studio',
      privacy:'Made for learning, together. No ads. No tracking. Saves stay on this device.',
      soundOn:'Sound on', soundOff:'Sound off', mute:'Mute sound', close:'Close', done:'Done', back:'Back to title',
      saved:'Your settings and save slots stay on this browser.', temporary:'Temporary saves only. This browser cannot store progress. Keep this tab open.',
      loadWarning:'A save could not be loaded. Original data has not been deleted. Saving may be unavailable.',
      languageDisplay:'Language & reading', language:'Menu language', english:'English', filipino:'Filipino', textSize:'Dialogue text size',
      textSpeed:'Dialogue speed', slow:'Slow', normal:'Normal', instant:'Instant', contrast:'High contrast',
      motion:'Reduce motion', narration:'Read aloud', narrationHint:'Uses an installed offline voice, when available.',
      sound:'Sound', music:'Music volume', effects:'Effects volume', testSound:'Test',
      classroom:'Classroom options', timers:'Decision timers', timersHint:'Optional 25-second practice timers. You can turn them off.',
      teacherToggle:'Show Teacher Mode', teacherHint:'Show local progress, learning objectives, lesson guides, and earned certificates.',
      preview:'Preview dialogue', sample:'Mag-andam kita! We can learn to keep our school safe together.',
      sampleTitle:'Ma’am Mara · Dialogue preview', skip:'Show all', read:'Read aloud',
      speechMissing:'No installed offline voice is available for this language.', audioMissing:'Audio is unavailable in this browser. The menus still work.',
      sampleHint:'Dialogue text size, reading speed, and read-aloud settings apply to this preview.',
      slots:'Choose a save slot', slotsHint:'Three students can keep separate profiles on this browser. Choose an empty slot to create your character.',
      empty:'Empty slot', reserve:'Create a character', slot:'Slot', active:'Selected profile', waiting:'Finish your character', chooseStory:'Choose or review your story',
      slotReady:'Your save slot is ready', profile:'Student profile', savedHere:'Saved on this browser', sessionOnly:'Only saved for this open session',
      introTitle:'Welcome to Maliwanag!', introLine:'Hello, Bata! I’m Ma’am Mara. Our Junior DRRM Club learns how to make safer choices, one small step at a time. Your save slot is ready for our next chapter.',
      stageNotice:'All four stories include final quizzes, results, Safety Stars, and certificates.',
      nextBuild:'Next build: polish and export', previewDialogue:'Meet Ma’am Mara',
      helpIntro:'You will play a Grade 5 student in the Junior DRRM Club at a fictional school in Iloilo.',
      helpNow:'Available in this build', helpNowText:'Play four disaster stories with final quizzes and certificates. Visit the outfit shop, picture glossary, and daily Quick Quiz. Explore nine maps and practise seven mini-games.',
      controls:'Controls', controlsText:'Walk with arrow keys or WASD. Interact with E or Space. Use the on-screen D-pad on touch devices. Press Esc to close a menu.',
      helpScope:'Explore nine connected school maps now. Try Decision practice and the Mini-game studio from a story card or the map pause menu. Typhoon, flood, earthquake, and tsunami each have four ready chapters.',
      fourPillars:'Four ways we learn to stay safe',
      p1:'Prevention & Mitigation', p1Text:'Spot hazards and tell a trusted adult.', p2:'Preparedness', p2Text:'Plan, pack, and practise together.',
      p3:'Response', p3Text:'Make safer choices when a hazard happens.', p4:'Rehabilitation & Recovery', p4Text:'Return safely and support one another.',
      teacherIntro:'This overview reads only the three save slots in this browser. No information is uploaded.',
      student:'Student', completed:'Stories completed', stars:'Safety Stars', noStudent:'No profile yet',
      teacherStage:'Practice points are separate. Complete a story and its final assessment to earn results, currency, and a certificate.',
      soundSaved:'Sound preference saved.', saveCreated:'Save slot reserved.',
      error:'Something could not be opened. Close this menu and try again.',
      bootError:'The game could not start. Make sure all files were extracted from the ZIP into the same folder.'
    },
    fil: {
      club:'JUNIOR DRRM CLUB', offline:'GUMAGANA OFFLINE', boot:'Binubuksan ang paaralan…', enter:'Pumasok sa paaralan',
      story:'KUWENTO SA PAARALAN. MAS LIGTAS NA BUKAS.', intro:'Maliliit na hakbang. Ligtas na pasya. Sama-samang paghahanda.',
      start:'Magsimula', continue:'Magpatuloy', settings:'Mga setting', help:'Paano maglaro', shop:'DRRM Shop', glossary:'Talasalitaan', quickQuiz:'Mabilis na Pagsusulit', teacher:'Para sa guro',
      school:'Maliwanag Elementary', location:'Iloilo, Western Visayas · Kathang-isip na paaralan', welcome:'Mag-andam kita. Sama-sama tayong maghanda.',
      prevent:'Iwasan', prepare:'Maghanda', respond:'Tumugon', recover:'Bumangon', foundation:'SCENARIO DIRECTOR · INAYOS', artStudio:'Art studio',
      privacy:'Sama-samang matuto. Walang patalastas o pagsubaybay. Sa device lang ang mga save.',
      soundOn:'May tunog', soundOff:'Walang tunog', mute:'Patayin ang tunog', close:'Isara', done:'Tapos', back:'Bumalik sa pamagat',
      saved:'Nananatili sa browser na ito ang mga setting at save slot.', temporary:'Pansamantala lang ang mga save. Hindi makapag-imbak ang browser. Panatilihing bukas ang tab.',
      loadWarning:'Hindi mabasa ang isang save. Hindi binura ang orihinal na datos. Maaaring hindi gumana ang pag-save.',
      languageDisplay:'Wika at pagbasa', language:'Wika ng menu', english:'English', filipino:'Filipino', textSize:'Laki ng teksto sa usapan',
      textSpeed:'Bilis ng teksto', slow:'Mabagal', normal:'Karaniwan', instant:'Agad', contrast:'Mataas na contrast',
      motion:'Bawasan ang galaw', narration:'Basahin nang malakas', narrationHint:'Gagamit ng naka-install na offline na boses, kung mayroon.',
      sound:'Tunog', music:'Lakas ng musika', effects:'Lakas ng sound effects', testSound:'Subukan',
      classroom:'Mga opsyon sa klase', timers:'Oras sa pagpapasya', timersHint:'Opsyonal na 25 segundo sa pagsasanay. Maaaring patayin.',
      teacherToggle:'Ipakita ang Teacher Mode', teacherHint:'Ipakita ang lokal na progreso, mga layunin, gabay, at nakamit na sertipiko.',
      preview:'Subukan ang usapan', sample:'Mag-andam kita! Sama-sama nating matutuhang panatilihing ligtas ang paaralan.',
      sampleTitle:'Ma’am Mara · Halimbawang usapan', skip:'Ipakita lahat', read:'Basahin nang malakas',
      speechMissing:'Walang naka-install na offline na boses para sa wikang ito.', audioMissing:'Walang audio sa browser na ito. Gumagana pa rin ang mga menu.',
      sampleHint:'Masusubukan dito ang laki at bilis ng teksto at ang pagbasa nang malakas.',
      slots:'Pumili ng save slot', slotsHint:'May hiwalay na profile para sa tatlong mag-aaral. Pumili ng bakanteng slot upang lumikha ng karakter.',
      empty:'Bakanteng slot', reserve:'Lumikha ng karakter', slot:'Slot', active:'Napiling profile', waiting:'Tapusin ang iyong karakter', chooseStory:'Piliin o tingnan ang iyong kuwento',
      slotReady:'Handa na ang iyong save slot', profile:'Profile ng mag-aaral', savedHere:'Naka-save sa browser na ito', sessionOnly:'Para lang sa bukas na session na ito',
      introTitle:'Maligayang pagdating sa Maliwanag!', introLine:'Kumusta, Bata! Ako si Ma’am Mara. Sa Junior DRRM Club, matututo tayong gumawa ng ligtas na pasya, isang hakbang bawat pagkakataon. Handa na ang save slot mo para sa susunod na kabanata.',
      stageNotice:'May apat na kabanata, pagsusulit, resulta, at gantimpala ang bawat kuwento.',
      nextBuild:'Susunod: pagsusulit, resulta, at gantimpala', previewDialogue:'Kilalanin si Ma’am Mara',
      helpIntro:'Ikaw ay mag-aaral sa Grade 5 at kasapi ng Junior DRRM Club sa isang kathang-isip na paaralan sa Iloilo.',
      helpNow:'Magagamit sa bersiyong ito', helpNowText:'Lumikha ng karakter, galugarin ang siyam na mapa, subukan ang walong pasya, at laruin ang pitong mini-game na may paliwanag at naka-save na progreso.',
      controls:'Mga kontrol', controlsText:'Arrow keys o WASD sa paglakad. E o Space sa pakikipag-ugnayan. Gamitin ang D-pad sa touch device. Esc upang isara ang menu.',
      helpScope:'Galugarin na ang siyam na mapa ng paaralan. Buksan ang Pagsasanay sa pagpapasya at Studio ng mini-game mula sa kuwento o menu ng mapa. May tig-apat na kabanata ang bagyo, baha, lindol, at tsunami.',
      fourPillars:'Apat na paraan upang matutong maging ligtas',
      p1:'Pag-iwas at Pagbawas ng Panganib', p1Text:'Kilalanin ang panganib at magsabi sa pinagkakatiwalaang nakatatanda.', p2:'Paghahanda', p2Text:'Magplano, mag-impake, at magsanay nang sama-sama.',
      p3:'Pagtugon', p3Text:'Gumawa ng ligtas na pasya kapag may panganib.', p4:'Rehabilitasyon at Pagbangon', p4Text:'Ligtas na bumalik at alalayan ang isa’t isa.',
      teacherIntro:'Tatlong save slot sa browser na ito lang ang nasa buod. Walang impormasyong ina-upload.',
      student:'Mag-aaral', completed:'Natapos na kuwento', stars:'Safety Stars', noStudent:'Wala pang profile',
      teacherStage:'Hiwalay ang puntos sa pagsasanay. Tapusin ang kuwento at huling pagsusulit para sa resulta, gantimpala, at sertipiko.',
      soundSaved:'Naka-save ang setting ng tunog.', saveCreated:'Naireserba ang save slot.',
      error:'Hindi mabuksan. Isara ang menu at subukan muli.',
      bootError:'Hindi mabuksan ang laro. I-extract muna ang lahat ng file mula sa ZIP sa iisang folder.'
    }
  };
  let closeCleanup = null, returnFocus = null, toastTimer = null;
  const h = (tag, attributes = {}, ...children) => {
    const element = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) {
      if (name.startsWith('on')) element.addEventListener(name.slice(2), value);
      else if (name === 'className') element.className = value;
      else if (name in element && !name.startsWith('aria')) element[name] = value;
      else element.setAttribute(name, value);
    }
    for (const child of children.flat()) if (child !== null && child !== undefined) element.append(typeof child === 'string' ? document.createTextNode(child) : child);
    return element;
  };
  function t(key) {
    const language = LE.Save.get().settings.language;
    return (strings[language] || strings.en)[key] || strings.en[key] || key;
  }
  const button = (label, action, kind = 'secondary') => h('button', {type:'button', className:kind, onclick:action}, label);
  function cancelSpeech() { if (window.speechSynthesis) window.speechSynthesis.cancel(); }
  function close(restore = true) {
    if (closeCleanup) { closeCleanup(); closeCleanup = null; }
    cancelSpeech();
    const layer = document.getElementById('modal-layer');
    layer.hidden = true;
    layer.replaceChildren();
    for (const id of ['title-screen','boot-screen']) document.getElementById(id).inert = false;
    document.querySelector('.topbar').inert = false;
    const world=document.getElementById('world-screen');if(world)world.inert=false;
    if(LE.MapScene)LE.MapScene.modalChanged(false);
    const practice=document.getElementById('practice-screen');if(practice)practice.inert=false;
    if(LE.DecisionScene)LE.DecisionScene.modalChanged(false);
    const mini=document.getElementById('mini-screen');if(mini)mini.inert=false;
    if(LE.MiniGameScene)LE.MiniGameScene.modalChanged(false);

    if (restore && returnFocus && returnFocus.isConnected && !returnFocus.disabled) returnFocus.focus();
    if (restore) LE.Audio.play('back');
  }
  function modal(title, body, footer = [], afterClose) {
    const wasOpen = !document.getElementById('modal-layer').hidden;
    const previousFocus = wasOpen ? returnFocus : document.activeElement;
    close(false);
    returnFocus = previousFocus;
    closeCleanup = afterClose || null;
    const layer = document.getElementById('modal-layer');
    const dialog = h('section', {className:'dialog', role:'dialog', 'aria-modal':'true', 'aria-labelledby':'dialog-title', tabIndex:-1},
      h('div', {className:'dialog-header'}, h('h2', {id:'dialog-title'}, title), h('button', {type:'button', className:'close-button', 'aria-label':t('close'), onclick:() => close()}, '×')),
      h('div', {className:'dialog-body'}, body),
      h('div', {className:'dialog-footer'}, footer.length ? footer : button(t('done'), () => close(), 'primary')));
    layer.replaceChildren(dialog);
    layer.hidden = false;
    for (const id of ['title-screen','boot-screen']) document.getElementById(id).inert = true;
    document.querySelector('.topbar').inert = true;
    const world=document.getElementById('world-screen');if(world&&!world.hidden)world.inert=true;
    if(LE.MapScene)LE.MapScene.modalChanged(true);
    const practice=document.getElementById('practice-screen');if(practice&&!practice.hidden)practice.inert=true;
    if(LE.DecisionScene)LE.DecisionScene.modalChanged(true);
    const mini=document.getElementById('mini-screen');if(mini&&!mini.hidden)mini.inert=true;
    if(LE.MiniGameScene)LE.MiniGameScene.modalChanged(true);

    dialog.focus();
    return dialog;
  }
  function toast(message) {
    const target = document.getElementById('toast');
    window.clearTimeout(toastTimer);
    target.textContent = message;
    target.hidden = false;
    toastTimer = window.setTimeout(() => { target.hidden = true; }, 3500);
  }
  function applySettings() {
    const settings = LE.Save.get().settings;
    document.documentElement.lang = settings.language === 'fil' ? 'fil' : 'en';
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    document.documentElement.style.setProperty('--dialog-size', settings.textSize + 'px');
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
    const mute = document.getElementById('quick-mute');
    mute.textContent = t(settings.muted ? 'soundOff' : 'soundOn');
    mute.setAttribute('aria-pressed', String(settings.muted));
    mute.setAttribute('aria-label', t(settings.muted ? 'soundOff' : 'mute'));
    document.getElementById('open-teacher').hidden = !settings.teacherMode;
    const status = LE.Save.status();
    document.getElementById('save-status').textContent = t(status.loadWarning ? 'loadWarning' : status.persistent ? 'saved' : 'temporary');
    LE.Audio.setPreferences(settings);
  }
  function titleState() {
    const state = LE.Save.get();
    const profile = LE.Save.active() || state.slots.find(Boolean);
    document.getElementById('continue-game').disabled = !profile;
    document.getElementById('continue-name').textContent = profile ? profile.name : '';
    applySettings();
  }
  function speak(text) {
    cancelSpeech();
    const language = LE.Save.get().settings.language === 'fil' ? ['fil','tl'] : ['en'];
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    const voice = voices.find(item => item.localService && language.some(prefix => item.lang.toLowerCase().startsWith(prefix)));
    if (!voice || !window.SpeechSynthesisUtterance) { toast(t('speechMissing')); return false; }
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
    return true;
  }
  function showDialogue(title, text, backAction, options={}) {
    const output = h('p', {id:'dialogue-output'});
    const screenReader = h('p', {className:'hint'}, t('sampleHint'));
    let timer = null;
    const finish = () => { window.clearInterval(timer); timer = null; output.textContent = text; };
    const portrait=h('canvas',{width:64,height:64,className:'dialogue-portrait',role:'img','aria-label':options.player?(LE.Save.active()||{name:'Bata'}).name:'Ma’am Mara'});
    const portraitContext=portrait.getContext('2d');
    if(portraitContext)portraitContext.drawImage(LE.Art.portrait(options.player?LE.Save.artOptions():{npc:options.npc||'mara',expression:options.expression||'happy'}),0,0);
    const body = h('div', {}, h('span', {className:'stage-label'}, 'JUNIOR DRRM CLUB'), h('div', {className:'dialogue-with-portrait'},portrait,h('div', {className:'guide-card'}, output)), screenReader);
    modal(title, body, [button(t('skip'), finish), button(t('read'), () => speak(text)), button(t('done'), () => backAction ? backAction() : close(), 'primary')], () => window.clearInterval(timer));
    const speed = LE.Save.get().settings.textSpeed;
    if (speed === 'instant' || LE.Save.get().settings.reducedMotion) finish();
    else {
      let cursor = 0;
      timer = window.setInterval(() => { output.textContent = text.slice(0, ++cursor); if (cursor >= text.length) finish(); }, speed === 'slow' ? 55 : 28);
    }
    if (LE.Save.get().settings.readAloud) speak(text);
  }
  function settings() {
    const current = LE.Save.get().settings;
    const body = h('div');
    const save = (key, value) => LE.Save.updateSettings({[key]:value});
    const section = key => body.append(h('h3', {className:'section-label'}, t(key)));
    function row(key, control, note) {
      body.append(h('div', {className:'settings-row'}, h('label', {htmlFor:control.id}, t(key), note ? h('small', {}, t(note)) : null), control));
    }
    function select(key, choices, label) {
      const input = h('select', {id:'setting-' + key, value:current[key]});
      choices.forEach(([value, text]) => input.append(h('option', {value:String(value), selected:String(value) === String(current[key])}, text)));
      input.addEventListener('change', () => {
        save(key, key === 'textSize' ? Number(input.value) : input.value);
        if (key === 'language') { settings(); document.getElementById('setting-language').focus(); }
      });
      row(label, input);
    }
    function toggle(key, label, note) {
      const input = h('input', {id:'setting-' + key, type:'checkbox', checked:current[key], onchange:event => save(key, event.target.checked)});
      row(label, input, note);
    }
    function volume(key, label) {
      const output = h('output', {htmlFor:'setting-' + key}, Math.round(current[key] * 100) + '%');
      const input = h('input', {id:'setting-' + key, type:'range', min:0, max:100, value:Math.round(current[key] * 100), 'aria-label':t(label), oninput:event => {
        const value = Number(event.target.value); output.textContent = value + '%'; save(key, value / 100);
      }});
      const test = button(t('testSound'), async () => { await LE.Audio.unlock(); LE.Audio.play('success'); });
      const wrap = h('div', {className:'volume-wrap'}, input, output, key === 'sfxVolume' ? test : null);
      body.append(h('div', {className:'settings-row'}, h('label', {htmlFor:input.id}, t(label)), wrap));
    }
    section('languageDisplay');
    select('language', [['en',t('english')],['fil',t('filipino')]], 'language');
    select('textSize', [[18,'18 px'],[20,'20 px'],[22,'22 px'],[24,'24 px']], 'textSize');
    select('textSpeed', [['slow',t('slow')],['normal',t('normal')],['instant',t('instant')]], 'textSpeed');
    toggle('highContrast','contrast'); toggle('reducedMotion','motion'); toggle('readAloud','narration','narrationHint');
    section('sound');
    toggle('muted','mute'); volume('musicVolume','music'); volume('sfxVolume','effects');
    section('classroom');
    toggle('decisionTimers','timers','timersHint'); toggle('teacherMode','teacherToggle','teacherHint');
    body.append(h('p', {className:'hint'}, t(LE.Save.status().persistent ? 'saved' : 'temporary')));
    modal(t('settings'), body, [button(t('preview'), () => showDialogue(t('sampleTitle'),t('sample'),settings)), button(t('done'), () => close(), 'primary')]);
  }
  function slots() {
    const state = LE.Save.get();
    const list = h('div', {className:'slot-list'});
    state.slots.forEach((slot,index) => {
      const action = () => {
        try {
          if (slot) LE.Save.selectSlot(index); else LE.Save.createSlot(index);
          LE.Audio.play('success');
          welcome();
        } catch (error) { toast(t('error')); }
      };
      list.append(h('button', {type:'button', className:'slot-card', onclick:action},
        h('span',{className:'slot-number'},String(index + 1)),
        h('span',{className:'slot-copy'},h('strong',{},slot ? slot.name : t('empty')),h('small',{},slot ? t(slot.characterCreated?'chooseStory':'waiting') : t('reserve'))),
        h('span',{className:'slot-arrow','aria-hidden':'true'},'→')));
    });
    modal(t('slots'),h('div',{},h('p',{},t('slotsHint')),list),[button(t('back'),() => close())]);
  }
  function welcome() {
    const slot = LE.Save.active();
    if (!slot) return slots();
    if(slot.characterCreated&&slot.checkpoint&&['director','director-debug'].includes(slot.checkpoint.stage))return LE.MapScene.open(slot.checkpoint.storyId,{debugResume:slot.checkpoint.stage==='director-debug'});
    if(slot.characterCreated&&slot.checkpoint&&slot.checkpoint.stage==='quick-quiz')return LE.QuizScene.quick();
    if(slot.characterCreated&&slot.checkpoint&&slot.checkpoint.stage==='quiz')return LE.QuizScene.open(slot.checkpoint.storyId,slot.checkpoint.runId);
    if(slot.characterCreated&&slot.checkpoint&&slot.checkpoint.stage==='results'&&LE.Rewards.result(slot.id,slot.checkpoint.runId))return LE.ResultsScene.open(slot.id,slot.checkpoint.runId);
    if(slot.characterCreated&&['typhoon','flood','earthquake','tsunami'].includes(slot.selectedDisaster)&&slot.checkpoint&&slot.checkpoint.stage==='story'&&slot.checkpoint.storyId===slot.selectedDisaster)return LE.StoryScene.open({storyId:slot.selectedDisaster});
    if(slot.characterCreated&&slot.selectedDisaster&&slot.checkpoint&&slot.checkpoint.stage==='minigames'&&slot.checkpoint.storyId===slot.selectedDisaster)return LE.MiniGameScene.open(slot.selectedDisaster,slot.checkpoint.gameId,{returnTo:slot.checkpoint.returnTo});
    if(slot.characterCreated&&slot.selectedDisaster&&slot.checkpoint&&slot.checkpoint.stage==='practice'&&slot.checkpoint.storyId===slot.selectedDisaster)return LE.DecisionScene.open(slot.selectedDisaster);
    if(slot.characterCreated&&slot.selectedDisaster&&slot.checkpoint&&slot.checkpoint.stage==='exploration'&&slot.checkpoint.storyId===slot.selectedDisaster)return slot.checkpoint.mode==='sandbox'?LE.MapScene.openSandbox(slot.selectedDisaster):LE.MapScene.open(slot.selectedDisaster);
    return slot.characterCreated ? LE.DisasterSelectScene.open() : LE.CharacterScene.open();
  }
  function pillars() {
    const list = h('ol',{className:'chapter-list'});
    for (let i=1;i<=4;i++) list.append(h('li',{},h('strong',{},t('p'+i)),t('p'+i+'Text')));
    return list;
  }
  function help() {
    modal(t('help'),h('div',{},h('p',{},t('helpIntro')),h('div',{className:'guide-card'},h('strong',{},t('helpNow')),h('p',{},t('helpNowText'))),h('h3',{},t('fourPillars')),pillars(),h('h3',{},t('controls')),h('p',{},t('controlsText')),h('p',{className:'modal-note'},t('helpScope'))));
  }
  function teacher() {return LE.TeacherScene.open();}

  document.addEventListener('keydown',event => {
    const layer = document.getElementById('modal-layer');
    if (layer.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const elements = [...layer.querySelectorAll('button:not(:disabled),input,select,[tabindex="0"]')];
    const first = elements[0], last = elements[elements.length-1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement.classList.contains('dialog'))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement.classList.contains('dialog'))) { event.preventDefault(); first.focus(); }
  });
  LE.UI = {t,h,toast,modal,close,applySettings,titleState,settings,slots,welcome,help,teacher,showDialogue,speak};
})();
