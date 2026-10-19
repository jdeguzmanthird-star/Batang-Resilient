/* The only scheduler for a playable disaster. Pure state + explicit, saved world gates.
   MapScene calls tick/observe/interact. DecisionScene calls decisionChanged/finishDecision.
   MiniGameScene returns through persistActivity/returnFromActivity below. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {},
    copy = x => JSON.parse(JSON.stringify(x)),
    pillars = ['prevention', 'preparedness', 'response', 'recovery'];

  function compile(data) {
    const plan = data.director;
    if (!plan) throw Error('Missing director plan: ' + data.storyId);
    const nodes = [];
    for (const task of data.tasks) {
      for (const n of plan.before[task.id] || []) nodes.push({
        ...n,
        chapter: task.chapter
      });
      nodes.push({
        ...task,
        ...(plan.overrides[task.id] || {}),
        sourceId: task.id,
        id: 'task:' + task.id
      });
      for (const n of plan.after[task.id] || []) nodes.push({
        ...n,
        chapter: task.chapter
      });
    }
    return nodes;
  }

  function create(storyId, savedStory, savedDirector, options = {}) {
    const data = LE.Data[storyId],
      nodes = compile(data),
      story = LE.Story.create(savedStory, undefined, storyId),
      runId = story.state.runId;
    const start = story.current() ? nodes.findIndex(n => n.sourceId === story.current().id) : nodes.length;
    let state = {
      version: 1,
      planVersion: data.director.version,
      storyId,
      runId,
      cursor: start,
      done: nodes.slice(0, start).map(n => n.id),
      elapsed: 0,
      hazards: [],
      activities: {},
      world: story.state.world || null,
      phase: story.isComplete() ? 'quiz' : 'chapter-' + (story.current().chapter + 1),
      debug: options.debug === true
    };
    if (savedDirector && savedDirector.version === 1 && savedDirector.planVersion === data.director.version &&
      savedDirector.runId === runId && savedDirector.storyId === storyId) {
      const s = savedDirector,
        index = s.cursor,
        valid = Number.isInteger(index) && index >= 0 && index <= nodes.length && Array.isArray(s.done) && s
        .done.length === index && s.done.every((id, i) => nodes[i].id === id) && nodes.slice(0, index).filter(
          n => n.sourceId).length === story.state.index;
      if (valid) {
        state = {
          ...state,
          cursor: index,
          done: [...s.done],
          elapsed: Number.isFinite(s.elapsed) ? Math.max(0, Math.min(360000000, s.elapsed)) : 0,
          hazards: [...new Set((s.hazards || []).filter(id => data.director.hazards.some(h => h.id ===
            id)))],
          activities: {},
          world: s.world || state.world,
          debug: options.debug === true
        };
        for (const n of nodes.filter(n => n.type === 'activity' && !n.sourceId))
          if (s.activities && s.activities[n.id]) state.activities[n.id] = LE.MiniGames.create(n.game,
            storyId, s.activities[n.id]).serialize();
      }
    }
    const waterPresentation = LE.WorldWater.timeline(nodes, state);
    const waterLevel = () => waterPresentation.value();
    const waterWetness = () => waterPresentation.wetness();
    const visualTick = ms => waterPresentation.tick(ms);
    const current = () => nodes[state.cursor] || null,
      chapter = () => current() ? current().chapter : 3;
    const log = (kind, details = {}) => {
      if (typeof console !== 'undefined' && console.log) console.log('[ScenarioDirector]', storyId, runId,
        kind, {
          phase: state.phase,
          node: current() && current().id,
          ...details
        });
    };

    function changePhase(phase) {
      if (state.phase !== phase) {
        const from = state.phase;
        state.phase = phase;
        log('state-change', {
          from,
          to: phase
        });
      }
    }

    function advance() {
      const n = current();
      if (!n) return false;
      if (n.type === 'event' && state.elapsed < (n.duration || 0)) return false;
      if (n.sourceId) {
        if (n.type === 'activity') story.state.activityOpen = null;
        if (n.type === 'walk') {
          if (!story.visit(n.map, n.key)) return false;
        } else if (!story.advance()) return false;
      }
      const from = n.id;
      state.done.push(n.id);
      state.cursor++;
      state.elapsed = 0;
      changePhase(current() ? 'chapter-' + (chapter() + 1) : 'quiz');
      log('objective-complete', {
        from,
        to: current() && current().id
      });
      return true;
    }

    function accountTime(ms) {
      if (!Number.isFinite(ms) || ms <= 0 || !current()) return;
      const dt = Math.min(ms, 3600000);
      story.state.activeMs += dt;
      const p = pillars[chapter()];
      story.state.chapterMs[p] = (story.state.chapterMs[p] || 0) + dt;
    }

    function tick(ms, timers = true) {
      if (!Number.isFinite(ms) || ms <= 0 || !current()) return false;
      const dt = Math.min(1000, ms),
        n = current();
      visualTick(dt);
      state.elapsed += dt;
      let changed = false;
      if (n.type === 'decision' && n.sourceId) changed = story.tick(dt, timers);
      else accountTime(dt);
      if (changed) log('decision-phase', {
        to: story.decisions().state.phase
      });
      if (n.type === 'event' && state.elapsed >= n.duration) {
        advance();
        return true;
      }
      return changed;
    }

    function decisionChanged() {
      log('decision-phase', {
        to: story.decisions().state.phase
      });
    }

    function finishDecision() {
      const n = current();
      if (!n || n.type !== 'decision' || story.decisions().state.phase !== 'learn') return false;
      return advance();
    }

    function activitySnapshot(n = current()) {
      return n && (n.sourceId ? story.state.activities[n.sourceId] : state.activities[n.id]);
    }

    function saveActivity(nodeId, snapshot, elapsed = 0) {
      const n = current();
      if (!n || n.id !== nodeId || n.type !== 'activity') return false;
      const m = LE.MiniGames.create(n.game, storyId, snapshot);
      if (n.sourceId) {
        if (!story.saveActivity(n.sourceId, m.serialize())) return false;
      } else state.activities[n.id] = m.serialize();
      accountTime(elapsed);
      return true;
    }

    function finishActivity(nodeId) {
      const n = current();
      if (!n || n.id !== nodeId || n.type !== 'activity') return false;
      const m = LE.MiniGames.create(n.game, storyId, activitySnapshot(n));
      if (!m.result()) return false;
      return advance();
    }

    function report(id) {
      const n = current(),
        item = data.director.hazards.find(h => h.id === id);
      if (!n || n.type !== 'activity' || n.game !== 'hunt' || !item || state.hazards.includes(id))
        return false;
      state.hazards.push(id);
      log('hazard-reported', {
        count: state.hazards.length,
        total: 6
      });
      if (state.hazards.length === 6) {
        const m = LE.MiniGames.create('hunt', storyId);
        for (const h of LE.Data.minigames.hazards[storyId].filter(h => h.hazard)) {
          m.act('inspect', h.id);
          m.act('report', h.id);
        }
        m.act('ack');
        saveActivity(n.id, m.serialize());
        return finishActivity(n.id);
      }
      return true;
    }

    function target(world) {
      const n = current();
      if (!n) return null;
      if (n.type === 'activity' && n.game === 'hunt') {
        const h = data.director.hazards.find(h => !state.hazards.includes(h.id));
        return h ? {
          ...h,
          type: 'report'
        } : null;
      }
      if (['walk', 'goal', 'talk'].includes(n.type)) return n;
      return null;
    }

    function targetObject(world, t = target(world)) {
      if (!t || world.state.mapId !== t.map) return null;
      return world.map().objects.find(o => t.objectId ? o.id === t.objectId : t.npc ? o.npc === t.npc : o
        .key === t.key) || null;
    }

    function observe(world) {
      state.world = world.serialize();
      const n = current();
      if (!n || n.type !== 'goal' || n.map !== world.state.mapId) return false;
      const o = targetObject(world, n),
        point = o ? world.center(o) : LE.World.point(n.x, n.y);
      if (o ? !world.near(o.id) : Math.hypot(point.x - world.state.x, point.y - world.state.y) > 24)
        return false;
      return advance();
    }

    function interact(world, o, action) {
      const n = current();
      if (!n || !o || !world.near(o.id)) return false;
      state.world = world.serialize();
      if (n.type === 'activity' && n.game === 'hunt' && action === 'report') {
        const item = data.director.hazards.find(h => h.map === world.state.mapId && (h.objectId ? o.id === h
          .objectId : o.key === h.key));
        return item ? report(item.id) : false;
      }
      const target = targetObject(world);
      if (target && target.id === o.id && ((n.type === 'walk' && action === 'inspect') || (n.type ===
          'talk' && action === 'talk'))) return advance();
      return false;
    }

    function locked() {
      const n = current();
      return !n || !['walk', 'goal', 'talk'].includes(n.type) && !(n.type === 'activity' && n.game ===
        'hunt');
    }

    function weather() {
      return current() ? current().weather || 'clear' : 'recovery';
    }

    function blocked(mapId, x, y) {
      return LE.WorldWater.forbidden(mapId, x, y, storyId) || chapter() === 2 && (data.director.blockers ||
      []).some(b => b.map === mapId && x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h);
    }

    function canEnter(door, from) {
      const n = current(),
        ch = chapter();
      if (!n) return false;
      if (ch < 2) return true;
      if (storyId === 'earthquake' && ch === 2) {
        if (door.target === 'canteen') return false;
        if (from === 'grounds' && ['hallway', 'gate'].includes(door.target)) return false;
        return ['classroom', 'hallway', 'grounds'].includes(door.target);
      }
      if (storyId === 'typhoon' && weather() !== 'recovery') return ['classroom', 'hallway'].includes(door
        .target);
      if (['flood', 'tsunami'].includes(storyId) && !['recovery', 'coast-recovery'].includes(weather()))
        return from === 'upper' ? false : ['classroom', 'hallway', 'upper'].includes(door.target);
      if (storyId === 'earthquake' && ch === 3 && door.target !== 'gate' && door.target !== 'center')
        return false;
      return true;
    }

    function objectives() {
      const ch = chapter(),
        tasks = data.tasks.filter(t => t.chapter === ch),
        done = tasks.filter(t => story.state.done.includes(t.id)).length,
        n = current();
      return {
        chapter: ch + 1,
        done,
        total: tasks.length,
        hazards: state.hazards.length,
        hazardTotal: 6,
        current: n,
        locked: locked(),
        phase: state.phase
      };
    }

    function markResults() {
      changePhase('results');
    }

    function serialize() {
      state.world = state.world || story.state.world;
      return copy(state);
    }
    log('enter', {
      restored: Boolean(savedDirector),
      debug: state.debug
    });
    return {
      state,
      story,
      data,
      nodes,
      current,
      chapter,
      advance,
      tick,
      accountTime,
      decisionChanged,
      finishDecision,
      activitySnapshot,
      saveActivity,
      finishActivity,
      report,
      target,
      targetObject,
      observe,
      interact,
      locked,
      weather,
      blocked,
      canEnter,
      objectives,
      markResults,
      serialize,
      log,
      waterLevel,
      waterWetness,
      visualTick
    };
  }

  function persist(d, profileId, world, replace = false) {
    const p = LE.Save.active();
    if (!p || p.id !== profileId) return false;
    const id = d.state.storyId;
    if (!d.state.debug && !replace && p.storyRuns && p.storyRuns[id] && p.storyRuns[id].runId !== d.state
      .runId) return false;
    if (world) d.state.world = world.serialize();
    d.story.state.world = d.state.world;
    if (d.state.debug) {
      LE.Save.updateActive({
        debugScenarioRuns: {
          ...(p.debugScenarioRuns || {}),
          [id]: {
            story: d.story.serialize(),
            director: d.serialize()
          }
        },
        checkpoint: {
          stage: 'director-debug',
          storyId: id,
          runId: d.state.runId
        }
      });
      return true;
    }
    const old = p.scenarioProgress[id] || {};
    LE.Save.updateActive({
      storyRuns: {
        ...(p.storyRuns || {}),
        [id]: d.story.serialize()
      },
      scenarioDirectors: {
        ...(p.scenarioDirectors || {}),
        [id]: d.serialize()
      },
      scenarioProgress: {
        ...p.scenarioProgress,
        [id]: {
          ...old,
          completed: old.completed === true,
          completedPillars: old.completed ? pillars : d.story.completedPillars(),
          chaptersComplete: d.story.isComplete(),
          quizPending: d.story.isComplete() && !Boolean(p.completedRuns && p.completedRuns[d.state.runId])
        }
      },
      checkpoint: {
        stage: 'director',
        storyId: id,
        runId: d.state.runId
      }
    });
    return true;
  }

  function restoreContext(context) {
    const p = LE.Save.active();
    if (!p || p.id !== context.profileId) return null;
    const entry = context.debug ? p.debugScenarioRuns && p.debugScenarioRuns[context.storyId] : null,
      saved = entry ? entry.story : p.storyRuns && p.storyRuns[context.storyId],
      aux = entry ? entry.director : p.scenarioDirectors && p.scenarioDirectors[context.storyId];
    if (!saved || saved.runId !== context.runId) return null;
    const d = create(context.storyId, saved, aux, {
      debug: context.debug === true
    });
    return d.current() && d.current().id === context.nodeId ? d : null;
  }

  function persistActivity(context, snapshot, elapsed = 0) {
    const d = restoreContext(context);
    return Boolean(d && d.saveActivity(context.nodeId, snapshot, elapsed) && persist(d, context.profileId));
  }

  function returnFromActivity(context, completed) {
    const d = restoreContext(context);
    if (!d || completed && !d.finishActivity(context.nodeId)) return false;
    persist(d, context.profileId);
    if (completed) LE.MapScene.open(context.storyId, {
      debugResume: context.debug === true
    });
    else {
      LE.UI.close(false);
      LE.App.beginTitle();
    }
    return true;
  }
  /* F2 uses isolated debug runs. It cannot overwrite a real run or pay currency. */
  function solveMini(id, storyId) {
    const m = LE.MiniGames.create(id, storyId),
      d = m.state.data,
      data = LE.Data[storyId];
    if (id === 'hunt')
      for (const h of LE.Data.minigames.hazards[storyId].filter(x => x.hazard)) {
        m.act('inspect', h.id);
        m.act('report', h.id);
      }
    if (id === 'bag') {
      for (const x of ['water', 'light', 'whistle', 'contact', 'food', 'aidkit', 'radio', 'clothes']) m.act(
        'toggle', x);
      m.act('check');
    }
    if (id === 'drill') {
      for (let i = 0; i < 3; i++) m.act('step', i);
      for (let i = 0; i < 4; i++) m.tick(1000);
    }
    if (id === 'chain') {
      m.act('route', 'dry');
      for (let i = 0; i < 4; i++) m.act('place', i, i);
      m.act('check');
    }
    if (id === 'signal') {
      m.act('channel', 'tap');
      for (let i = 0; i < 3; i++) m.act('pulse');
      m.act('rest');
    }
    if (id === 'aid')
      for (const step of LE.Data.minigames.aidSteps) m.act('step', step.id);
    if (id === 'breathe') {
      m.act('mode', 'ground');
      for (let i = 0; i < 5; i++) m.act('notice', i);
    }
    if (id === 'retrofit') {
      m.act('assign', 'anchor', 'adult');
      m.act('assign', 'ceiling', 'adult');
      m.act('clearance', 'official');
      for (let i = 0; i < 6; i++) m.act('paint', i, 0);
      m.act('thanks');
    }
    if (id === 'cleanup') {
      for (const x of LE.Data.minigames.cleanup) m.act('sort', x.id, x.bin);
      m.act('repair', 'adult');
      for (let i = 0; i < 6; i++) m.act('paint', i, 0);
      for (let i = 0; i < 3; i++) m.act('plant', i);
      m.act('message', 0);
      m.act('stamp', 4);
      m.act('finish');
    }
    if (id === 'coastal') {
      m.act('safety', 'approved');
      for (const x of LE.Data.coastDonations) m.act('sort', x.id, x.bin);
      for (let i = 0; i < 3; i++) m.act('plant', i);
      m.act('label', 'highground');
      m.act('arrow', 'uphill');
      for (const x of data.route) m.act('route', x.id);
      m.act('thanks');
    }
    m.act('ack');
    if (!m.result()) throw Error('Debug activity could not complete: ' + id);
    return m.serialize();
  }

  function debugRun(storyId, chapterNumber) {
    if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > 4) throw Error(
      'Choose chapter 1–4');
    const m = LE.Story.create(undefined, 'debug-' + storyId + '-' + Date.now() + '-' + Math.random().toString(
        36).slice(2, 6), storyId),
      data = LE.Data[storyId];
    let guard = 0;
    while (m.current() && m.current().chapter < chapterNumber - 1 && guard++ < 400) {
      const t = m.current();
      if (t.type === 'walk') m.visit(t.map, t.key);
      else if (t.type === 'activity') {
        m.saveActivity(t.id, solveMini(t.game, storyId));
        m.finishActivity(t.id);
      } else if (t.type === 'decision') {
        const e = m.decisions();
        if (['question', 'retry'].includes(e.state.phase)) m.answer(e.current().choices.find(c => c.type ===
          'best').id);
        else m.advance();
      } else if (t.type === 'board') {
        data.signals.forEach((x, i) => m.readSignal(i + 1));
        m.advance();
      } else if (t.type === 'route') {
        for (const x of data.route) m.plotRoute(x.id);
        m.advance();
      } else if (t.type === 'contacts') {
        m.readContacts();
        m.advance();
      } else if (t.type === 'check') {
        while ((m.state.checks[t.id] || []).length < t.cards.length) m.answerCheck(t.cards[(m.state.checks[t
          .id] || []).length].best);
        m.advance();
      } else if (t.type === 'dengue') {
        for (const q of data.dengue) m.answerDengue(q.best);
        m.advance();
      } else m.advance();
    }
    const d = create(storyId, m.serialize(), null, {
      debug: true
    });
    const anchor = data.director.chapterSpawns[chapterNumber - 1];
    d.state.world = {
      mapId: anchor.map,
      x: anchor.x * 32 + 16,
      y: anchor.y * 32 + 26,
      direction: 'down'
    };
    d.log('debug-skip', {
      chapter: chapterNumber
    });
    return d;
  }

  function debugMenu() {
    const p = LE.Save.active();
    if (!p || !p.characterCreated) return LE.UI.slots();
    const id = p.selectedDisaster || 'earthquake';
    if (LE.MiniGameScene.isActive()) LE.MiniGameScene.stop();
    if (LE.DecisionScene.isActive()) LE.DecisionScene.stop();
    if (!LE.MapScene.isActive()) LE.MapScene.open(id, {
      defer: true,
      debugResume: p.checkpoint && p.checkpoint.stage === 'director-debug'
    });
    const h = LE.UI.h,
      fil = LE.Save.get().settings.language === 'fil';
    LE.UI.modal('F2 · Scenario Director', h('div', {}, h('p', {}, fil ?
      'Hiwalay na debug run. Hindi nito binabago ang tunay na progreso o gantimpala.' :
      'Isolated debug run. Real progress, currency, and certificates are preserved.'), [1, 2, 3, 4].map(
      ch => h('button', {
        id: 'debug-chapter-' + ch,
        type: 'button',
        className: 'secondary',
        onclick: () => {
          LE.MapScene.stop();
          const d = debugRun(id, ch);
          persist(d, p.id);
          LE.UI.close(false);
          LE.MapScene.open(id, {
            debugResume: true
          });
        }
      }, 'Chapter ' + ch + ' · ' + LE.UI.t(LE.Data.pillars[ch - 1].labelKey)))), [h('button', {
      id: 'debug-normal',
      type: 'button',
      className: 'primary',
      onclick: () => LE.MapScene.open(id)
    }, fil ? 'Ituloy ang tunay na laro' : 'Resume real run')]);
  }
  LE.ScenarioDirector = {
    create,
    compile,
    persist,
    persistActivity,
    returnFromActivity,
    debugRun,
    debugMenu
  };
})();
