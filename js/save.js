/* Version 1 saves, extended compatibly for Stage 3 character profiles. */
(function () {
  'use strict';
  const LE = window.LE = window.LE || {};
  const KEY = 'ligtas-eskwela:v1';
  const listeners = new Set();
  const clone = value => JSON.parse(JSON.stringify(value));
  const disasterIds = ['typhoon','flood','earthquake','tsunami'];
  const appearanceIndex = (value,max,fallback=0) => Number.isInteger(value) ? Math.max(0,Math.min(max,value)) : fallback;
  const bounded = (value, fallback, low, high) => Number.isFinite(value) ? Math.min(high, Math.max(low, value)) : fallback;
  const defaults = () => ({
    language: 'en', textSize: 18, textSpeed: 'normal', highContrast: false,
    readAloud: false, decisionTimers: true, teacherMode: false,
    reducedMotion: Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    muted: false, musicVolume: 0.2, sfxVolume: 0.45, localContactName: '', localContactPhone: ''
  });
  const fresh = () => ({version: 1, settings: defaults(), activeSlot: null, slots: [null, null, null]});
  let state = fresh();
  let storageAvailable = true;
  let loadWarning = false;
  function cleanSettings(input) {
    const output = defaults();
    if (!input || typeof input !== 'object') return output;
    for (const key of Object.keys(output)) {
      if (typeof output[key] === 'boolean' && typeof input[key] === 'boolean') output[key] = input[key];
    }
    if (['en', 'fil'].includes(input.language)) output.language = input.language;
    if (['slow', 'normal', 'instant'].includes(input.textSpeed)) output.textSpeed = input.textSpeed;
    output.textSize = bounded(input.textSize, 18, 18, 24);
    output.musicVolume = bounded(input.musicVolume, 0.2, 0, 1);
    output.sfxVolume = bounded(input.sfxVolume, 0.45, 0, 1);
    output.localContactName = typeof input.localContactName === 'string' ? input.localContactName.normalize('NFC').replace(/[<>\x00-\x1f]/g,'').trim().slice(0,80) : '';
    output.localContactPhone = typeof input.localContactPhone === 'string' ? input.localContactPhone.replace(/[^0-9+() .-]/g,'').trim().slice(0,32) : '';
    return output;
  }
  function cleanSlot(slot) {
    if (!slot || typeof slot !== 'object' || typeof slot.id !== 'string') return null;
    const clean = clone(slot);
    clean.name = typeof slot.name === 'string' ? Array.from(slot.name.normalize('NFC').replace(/[^\p{L} ]/gu, '').trim()).slice(0,12).join('') || 'Bata' : 'Bata';
    clean.gender = ['boy','girl','unspecified'].includes(slot.gender) ? slot.gender : 'unspecified';
    const appearance = slot.appearance && typeof slot.appearance === 'object' ? slot.appearance : {};
    clean.appearance = {
      skin: appearanceIndex(appearance.skin,3,1), hairStyle: appearanceIndex(appearance.hairStyle,2), hairColor: appearanceIndex(appearance.hairColor,3),
      spriteSet: ['boy','girl'].includes(appearance.spriteSet) ? appearance.spriteSet : clean.gender === 'girl' ? 'girl' : 'boy'
    };
    clean.characterCreated = slot.characterCreated === true;
    clean.selectedDisaster = disasterIds.includes(slot.selectedDisaster) ? slot.selectedDisaster : null;
    clean.stars = bounded(slot.stars, 0, 0, 999999);
    clean.ownedOutfits = Array.isArray(slot.ownedOutfits) ? slot.ownedOutfits.filter(x => typeof x === 'string').slice(0, 40) : ['uniform'];
    if (!clean.ownedOutfits.includes('uniform')) clean.ownedOutfits.unshift('uniform');
    clean.equippedOutfit = clean.ownedOutfits.includes(slot.equippedOutfit) ? slot.equippedOutfit : 'uniform';
    clean.scenarioProgress = slot.scenarioProgress && typeof slot.scenarioProgress === 'object' && !Array.isArray(slot.scenarioProgress) ? slot.scenarioProgress : {};
    clean.highScores = slot.highScores && typeof slot.highScores === 'object' && !Array.isArray(slot.highScores) ? slot.highScores : {};
    return clean;
  }
  function validateCharacter(input={}) {
    const name = typeof input.name === 'string' ? input.name.trim().normalize('NFC') || 'Bata' : 'Bata';
    if (Array.from(name).length > 12) return {ok:false,reason:'nameLength'};
    if (!/^[\p{L}]+$/u.test(name)) return {ok:false,reason:'nameLetters'};
    const gender = ['boy','girl','unspecified'].includes(input.gender) ? input.gender : 'unspecified';
    const source = input.appearance || {};
    return {ok:true,value:{name,gender,appearance:{
      skin:appearanceIndex(source.skin,3,1),hairStyle:appearanceIndex(source.hairStyle,2),hairColor:appearanceIndex(source.hairColor,3),
      spriteSet:['boy','girl'].includes(source.spriteSet)?source.spriteSet:gender==='girl'?'girl':'boy'
    }}};
  }
  function load() {
    let text = null;
    try { text = window.localStorage.getItem(KEY); }
    catch (error) { storageAvailable = false; }
    try {
      if (text) {
        const parsed = JSON.parse(text);
        if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.slots)) throw new Error('Unsupported save format');
        state = fresh();
        state.settings = cleanSettings(parsed.settings);
        state.slots = [0, 1, 2].map(index => cleanSlot(parsed.slots[index]));
        state.activeSlot = Number.isInteger(parsed.activeSlot) && state.slots[parsed.activeSlot] ? parsed.activeSlot : null;
      }
    } catch (error) {
      // Malformed data is left untouched until the user chooses to save.
      loadWarning = true;
    }
    try {
      // Reading storage alone does not prove that writing is allowed.
      const probe = KEY + ':probe';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
    } catch (error) {
      // Retain any valid state in memory if storage is blocked or full.
      storageAvailable = false;
    }
    return clone(state);
  }
  function persist() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); storageAvailable = true; loadWarning = false; }
    catch (error) { storageAvailable = false; }
    for (const listener of listeners) listener(clone(state));
    return storageAvailable;
  }
  function requireIndex(index) {
    if (!Number.isInteger(index) || index < 0 || index > 2) throw new Error('Choose save slot 1, 2, or 3.');
  }
  LE.Save = {
    key: KEY,
    load,
    get: () => clone(state),
    status: () => ({persistent: storageAvailable, loadWarning}),
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    updateSettings(patch) { state.settings = cleanSettings({...state.settings, ...patch}); persist(); return clone(state.settings); },
    createSlot(index) {
      requireIndex(index);
      if (state.slots[index]) throw new Error('This slot is already in use. Choose it to continue.');
      const now = new Date().toISOString();
      state.slots[index] = {
        id: 'student-' + Date.now().toString(36) + '-' + index, name: 'Bata', gender: 'unspecified',
        appearance: {skin: 1, hairStyle: 0, hairColor: 0, spriteSet:'boy'}, characterCreated:false, selectedDisaster:null,
        ownedOutfits: ['uniform'], equippedOutfit: 'uniform', stars: 0,
        scenarioProgress: {}, highScores: {}, checkpoint: {stage: 'foundation'},
        createdAt: now, updatedAt: now
      };
      state.activeSlot = index;
      persist();
      return clone(state.slots[index]);
    },
    selectSlot(index) {
      requireIndex(index);
      if (!state.slots[index]) throw new Error('This save slot is empty.');
      state.activeSlot = index;
      persist();
      return clone(state.slots[index]);
    },
    active() { return state.activeSlot === null ? null : clone(state.slots[state.activeSlot]); },
    validateCharacter,
    saveCharacter(input,expectedId) {
      const slot = this.active();
      if (!slot || expectedId && slot.id !== expectedId) return {ok:false,reason:'profileChanged'};
      const checked = validateCharacter(input);
      if (!checked.ok) return checked;
      const checkpoint = !slot.characterCreated || !slot.checkpoint || slot.checkpoint.stage === 'foundation' ? {stage:'disaster-select'} : slot.checkpoint;
      const profile = this.updateActive({...checked.value,characterCreated:true,checkpoint});
      return {ok:true,profile,persistent:storageAvailable};
    },
    selectDisaster(id,expectedId) {
      const slot=this.active();
      if(!disasterIds.includes(id)) return {ok:false,reason:'unknownDisaster'};
      if(!slot || expectedId && slot.id!==expectedId) return {ok:false,reason:'profileChanged'};
      if(!slot.characterCreated) return {ok:false,reason:'createFirst'};
      return {ok:true,profile:this.updateActive({selectedDisaster:id}),persistent:storageAvailable};
    },
    artOptions(slot) {
      const profile=slot||this.active();
      if(!profile) return {gender:'boy',skin:1,hairStyle:0,hairColor:0,outfit:'uniform'};
      const appearance=profile.appearance||{};
      return {...appearance,gender:appearance.spriteSet||(profile.gender==='girl'?'girl':'boy'),outfit:profile.equippedOutfit||'uniform'};
    },
    // Later scenes can save a profile without changing the storage format.
    updateActive(patch) {
      if (state.activeSlot === null) return null;
      const existing = state.slots[state.activeSlot];
      state.slots[state.activeSlot] = cleanSlot({...existing, ...patch, id: existing.id, updatedAt: new Date().toISOString()});
      persist();
      return this.active();
    }
  };
})();
