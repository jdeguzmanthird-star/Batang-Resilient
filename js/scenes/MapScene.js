/* The playable campus. ScenarioDirector drives the default game; sandbox is explicit. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {};
  let session = null;
  const words = () => LE.Data.worldText[LE.Save.get().settings.language];
  const local = value => typeof value === 'string' ? value : value[LE.Save.get().settings.language] || value
    .en;
  const nameOf = o => o.kind === 'door' ? words().door + ' · ' + local(LE.Data.maps[o.target].name) : o.npc ?
    LE.Art.npcs.find(npc => npc.id === o.npc).name : local((session && session.director && session.director
      .data.director.hazards.find(h => h.objectId === o.id)?.name) || LE.Data.objectText[o.key]?.name || {
      en: o.key,
      fil: o.key
    }) + (o.number ? ' ' + o.number : '');

  function save() {
    if (!session) return false;
    const profile = LE.Save.active();
    if (!profile || profile.id !== session.profileId) return false;
    if (session.director) {
      const ok = LE.ScenarioDirector.persist(session.director, profile.id, session.model, session.options
        .fresh === true || session.director.story.recovered());
      if (ok) session.options.fresh = false;
      if (!LE.Save.status().persistent && !session.storageWarning) {
        session.storageWarning = true;
        LE.UI.toast(words().temporary);
      }
      return ok && LE.Save.status().persistent;
    }
    const data = session.model.serialize(),
      signature = JSON.stringify(data);
    if (signature === session.savedSignature) return LE.Save.status().persistent;
    session.savedSignature = signature;
    LE.Save.updateActive({
      exploration: {
        ...(profile.exploration || {}),
        [session.storyId]: data
      },
      checkpoint: {
        stage: 'exploration',
        storyId: session.storyId,
        mode: 'sandbox'
      }
    });
    const persistent = LE.Save.status().persistent;
    if (!persistent && !session.storageWarning) {
      session.storageWarning = true;
      LE.UI.toast(words().temporary);
    } else if (persistent) session.storageWarning = false;
    return persistent;
  }

  function clearInputs() {
    if (session) {
      session.keys.clear();
      session.pointers.clear();
      session.model.state.path = [];
      session.model.state.pending = null;
      session.model.state.walking = false;
    }
  }

  function modalChanged(open) {
    if (!session) return;
    session.paused = open;
    clearInputs();
    session.lastTime = 0;
    if (!open) {
      session.options.defer = false;
      refreshHUD();
      session.canvas.focus();
    }
  }

  function stop(commit = true) {
    if (!session) return;
    if (commit) save();
    const old = session;
    session = null;
    LE.Audio.stopWeather();
    window.cancelAnimationFrame(old.raf);
    old.listeners.forEach(remove => remove());
    old.screen.hidden = true;
    old.screen.replaceChildren();
    document.querySelector('.topbar').hidden = false;
    document.getElementById('game-frame').classList.toggle('world-mode', false);
  }

  function toTitle() {
    save();
    stop(false);
    LE.UI.close(false);
    LE.App.beginTitle();
  }

  function toStories() {
    save();
    if (session) {
      const profile = LE.Save.active();
      if (profile && profile.id === session.profileId) LE.Save.updateActive({
        checkpoint: {
          stage: 'disaster-select'
        }
      });
    }
    stop(false);
    LE.UI.close(false);
    LE.DisasterSelectScene.open();
  }

  function refreshHUD() {
    if (!session) return;
    const T = words(),
      map = session.model.map(),
      near = session.model.near(),
      profile = LE.Save.active();
    document.getElementById('world-location').textContent = local(map.name);
    document.getElementById('world-student').textContent = (profile ? profile.name : 'Bata') + ' · ' + T.mode;
    document.getElementById('world-day').textContent = T.normalDay;
    document.getElementById('world-count').textContent = T.visited + ' ' + session.model.state.visited.size +
      '/9';
    const nearLabel = near ? nameOf(near) : T.nothing,
      nearNode = document.getElementById('world-near');
    if (nearNode.textContent !== nearLabel) nearNode.textContent = nearLabel;
    document.getElementById('world-interact').textContent = near ? near.kind === 'door' ? T.door : near.npc ?
      T.talk : T.interact : T.interact;
    document.getElementById('world-pause').textContent = T.pause;
    document.getElementById('world-notebook').textContent = T.journal;
    document.getElementById('world-controls').textContent = T.controls;
    session.canvas.setAttribute('aria-label', local(map.name) + '. ' + T.controls);
    if (session.director) {
      refreshDirectorHUD();
      return;
    }
    const progress = LE.DisasterSelectScene.progress(profile, session.storyId);
    document.querySelectorAll('.world-pillar').forEach((node, index) => {
      const pillar = LE.Data.pillars[index];
      node.textContent = LE.UI.t(pillar.labelKey);
      node.classList.toggle('is-complete', progress.pillars.includes(pillar.id));
    });
  }

  function pause() {
    if (!session) return;
    save();
    const h = LE.UI.h,
      T = words();
    const body = h('div', {}, h('p', {}, T.pauseNote), h('p', {
      className: 'hint'
    }, T.controls), h('p', {
      className: 'hint'
    }, T.touch), h('p', {
      className: 'modal-note'
    }, T.note));
    const grid = h('div', {
      className: 'pause-grid'
    });
    const actions = [
      [T.resumeButton, () => LE.UI.close()],
      [T.journal, () => journal()],
      [T.help, () => journal(true)],
      [T.settings, () => LE.UI.settings()],
      [T.stories, toStories],
      [T.title, toTitle]
    ];
    actions.push([LE.Data.decisionText[LE.Save.get().settings.language].practice, () => LE.DecisionScene.open(
      session.storyId)]);
    actions.push([LE.Data.miniText[LE.Save.get().settings.language].studio, () => LE.MiniGameScene.open(
      session.storyId)]);
    actions.push([LE.UI.t('glossary'), () => LE.LearningScene.glossary()]);
    if (session.director) {
      actions.push(['F2 · Debug', () => LE.ScenarioDirector.debugMenu()]);
      actions.push([L('Campus sandbox · practice only', 'Sandbox sa kampus · pagsasanay lamang'), () => LE
        .MapScene.openSandbox(session.storyId)
      ]);
    }
    actions.forEach(([label, action], index) => grid.append(h('button', {
      type: 'button',
      id: 'world-menu-' + index,
      className: index === 0 ? 'primary' : 'secondary',
      onclick: action
    }, label)));
    body.append(grid);
    LE.UI.modal(T.pause, body);
  }

  function journal(directory = false) {
    if (!session) return;
    const h = LE.UI.h,
      T = words(),
      state = session.model.state;
    const counts = [
      ['visited', state.visited.size + '/9'],
      ['seen', state.seen.size],
      ['reports', Object.values(state.objects).filter(o => o.reported).length],
      ['items', Object.values(state.objects).filter(o => o.collected).length]
    ];
    const body = h('div', {}, h('div', {
      className: 'journal-counts'
    }, counts.map(([key, value]) => h('div', {}, h('strong', {}, String(value)), h('small', {}, T[
      key])))));
    if (!directory) {
      const collected = Object.values(LE.Data.maps).flatMap(map => map.objects).filter(o => (state.objects[o
        .id] || {}).collected);
      body.append(h('h3', {}, T.items), h('p', {
        className: 'hint'
      }, T.inventoryNote));
      if (!collected.length) body.append(h('p', {}, T.noItems));
      else body.append(h('ul', {}, collected.map(o => h('li', {}, nameOf(o)))));
    }
    body.append(h('h3', {}, T.route), h('p', {
      className: 'hint'
    }, T.routeHint));
    const list = h('ul', {
      className: 'directory-list'
    });
    Object.values(LE.Data.maps).forEach(map => list.append(h('li', {}, h('strong', {}, local(map.name)), h(
      'span', {}, map.objects.filter(o => o.kind === 'door').map(o => local(LE.Data.maps[o.target]
        .name)).join(' · ')))));
    body.append(list, h('p', {
      className: 'modal-note'
    }, T.note));
    LE.UI.modal(T.journal, body);
  }

  function inspect(object) {
    if (!session || session.director && session.director.locked()) return;
    const model = session.model,
      o = object || model.near(),
      T = words(),
      h = LE.UI.h;
    if (!o || !model.near(o.id)) {
      LE.UI.toast(T.nothing);
      return;
    }
    if (o.kind === 'door') {
      model.enter(o);
      session.camera = LE.MapRenderer.cameraFor(model);
      save();
      refreshHUD();
      return;
    }
    if (session.director) return directorInspect(o);
    model.inspect(o);
    save();
    if (o.npc) {
      const profile = LE.Save.active();
      LE.UI.showDialogue(nameOf(o), local(LE.Data.npcCampus[o.npc]).replaceAll('{name}', profile.name),
        null, {
          npc: o.npc
        });
      return;
    }
    const record = model.state.objects[o.id] || {},
      body = h('div', {}, h('p', {}, local(LE.Data.objectText[o.key].text)));
    if (o.kind === 'hazard' || ['evacuation_map', 'route_marker', 'signboard'].includes(o.key)) body.append(h(
      'p', {
        className: 'hint'
      }, local(LE.Data.scenarioCampusNotes[session.storyId])));
    if (model.state.mapId === 'upper') body.append(h('p', {
      className: 'hint'
    }, T.access));
    if (record.reported) body.append(h('p', {
      className: 'guide-card'
    }, T.reported));
    if (o.action === 'toggle') body.append(h('p', {
      className: 'hint'
    }, T.status + ': ' + T[record.on ? 'on' : 'off']));
    const actions = [h('button', {
      type: 'button',
      className: 'secondary',
      onclick: () => LE.UI.close()
    }, T.done)];
    if (['collect', 'report', 'toggle'].includes(o.action) && !record.reported) {
      actions.push(h('button', {
        type: 'button',
        id: 'world-object-action',
        className: 'primary',
        onclick: () => {
          if (!session || !model.act(o)) return;
          save();
          LE.Audio.play('success');
          LE.UI.close();
          LE.UI.toast(T[o.action === 'report' ? 'reported' : o.action === 'collect' ? 'collected' :
            'changed']);
        }
      }, T[o.action === 'report' ? 'report' : o.action === 'collect' ? 'collect' : 'toggle']));
    }
    const trigger = {
      noticeboard: 'hunt',
      bag: 'bag',
      desk: 'drill',
      bench: 'breathe',
      first_aid: 'aid',
      route_marker: 'chain',
      seedling: 'cleanup'
    } [o.key];
    if (trigger) actions.push(h('button', {
      type: 'button',
      id: 'world-mini-trigger',
      className: 'primary',
      onclick: () => LE.MiniGameScene.open(session.storyId, trigger)
    }, local(LE.Data.minigames.games.find(g => g.id === trigger).title)));
    LE.UI.modal(nameOf(o), body, actions);
  }

  const L = (en, fil) => LE.Save.get().settings.language === 'fil' ? fil : en;

  function refreshDirectorHUD() {
    const d = session.director,
      n = d.current(),
      o = d.objectives(),
      tracker = document.getElementById('scenario-tracker');
    document.getElementById('world-student').textContent = LE.Save.active().name + ' · ' + (d.state.debug ?
      'DEBUG · ' : '') + L('Chapter ', 'Kabanata ') + o.chapter + '/4';
    document.getElementById('world-day').textContent = LE.UI.t(LE.Data.pillars[o.chapter - 1].labelKey) +
      ' · ' + d.weather();
    document.getElementById('world-count').textContent = d.story.score().decisions + '/60 · ' + L('Safety ',
      'Kaligtasan ') + d.story.decisions().state.safety + '/100';
    const text = n ? n.game === 'hunt' ? L('Find 6 hazards ', 'Hanapin ang 6 na panganib ') + o.hazards +
      '/6 · ' + local(d.data.director.hazards.find(h => !d.state.hazards.includes(h.id))?.name || {
        en: 'Complete',
        fil: 'Tapos'
      }) : local(n.text || n.title || {
        en: n.type,
        fil: n.type
      }) : L('Final quiz → Results', 'Huling pagsusulit → Resulta');
    const detail = L('Chapter objectives ', 'Mga layunin ') + o.done + '/' + o.total + ' · ' + (o.locked ? L(
      'Movement locked', 'Nakakandado ang galaw') : L('Follow the arrow · E to interact',
      'Sundin ang palaso · E sa pakikipag-ugnayan'));
    if (tracker && tracker.textContent !== text + detail) tracker.replaceChildren(LE.UI.h('strong', {}, text),
      LE.UI.h('small', {}, detail));
    document.querySelectorAll('.world-pillar').forEach((node, i) => {
      const complete = d.story.completedPillars().includes(LE.Data.pillars[i].id);
      node.textContent = (complete ? '✓ ' : '') + LE.UI.t(LE.Data.pillars[i].labelKey);
      node.classList.toggle('is-complete', complete);
    });
    for (const direction of ['up', 'left', 'down', 'right']) document.getElementById('move-' + direction)
      .disabled = d.locked();
    document.getElementById('world-interact').disabled = d.locked();
  }

  function directorArrow() {
    const d = session && session.director,
      w = session && session.model;
    if (!d || d.locked()) return null;
    const t = d.target(w);
    if (!t) return null;
    const o = d.targetObject(w, t);
    if (o) return w.center(o);
    if (t.map === w.state.mapId) return LE.World.point(t.x, t.y);
    const queue = [
        [w.state.mapId]
      ],
      seen = new Set([w.state.mapId]);
    while (queue.length) {
      const path = queue.shift(),
        last = path.at(-1);
      if (last === t.map) {
        const door = w.map().objects.find(o => o.kind === 'door' && o.target === path[1]);
        return door ? w.center(door) : null;
      }
      for (const door of LE.Data.maps[last].objects.filter(o => o.kind === 'door'))
        if (!seen.has(door.target) && d.canEnter(door, last)) {
          seen.add(door.target);
          queue.push([...path, door.target]);
        }
    }
    return null;
  }

  function directorInspect(o) {
    const s = session,
      d = s.director,
      w = s.model;
    if (d.locked()) return;
    w.inspect(o);
    save();
    const n = d.current(),
      item = d.data.director.hazards.find(h => h.objectId === o.id),
      h = LE.UI.h;
    if (item) {
      const reported = d.state.hazards.includes(item.id),
        body = h('div', {}, h('p', {}, local(item.name)), h('p', {}, L(
          'Report the hazard to the teacher. Trained adults handle repair work.',
          'Iulat ang panganib sa guro. Sinanay na nakatatanda ang mag-aayos.')));
      LE.UI.modal(local(item.name), body, [h('button', {
        id: 'director-report',
        type: 'button',
        className: 'primary',
        disabled: reported || n.game !== 'hunt',
        onclick: () => {
          if (session !== s) return;
          w.state.objects[o.id] = {
            ...(w.state.objects[o.id] || {}),
            reported: true
          };
          d.interact(w, o, 'report');
          save();
          LE.UI.close();
        }
      }, reported ? L('Reported', 'Naiulat') : L('Report hazard', 'Iulat ang panganib'))]);
      return;
    }
    if (o.npc) {
      const targeted = n.type === 'talk' && n.npc === o.npc;
      LE.UI.showDialogue(nameOf(o), targeted ? local(n.text) : local(LE.Data.npcCampus[o.npc]).replaceAll(
        '{name}', LE.Save.active().name), () => {
        if (session === s) {
          if (targeted) d.interact(w, o, 'talk');
          save();
        }
        LE.UI.close();
      }, {
        npc: o.npc
      });
      return;
    }
    LE.UI.modal(nameOf(o), h('p', {}, local(LE.Data.objectText[o.key].text)), [h('button', {
      id: 'director-object-done',
      type: 'button',
      className: 'primary',
      onclick: () => {
        if (session === s) {
          d.interact(w, o, 'inspect');
          save();
        }
        LE.UI.close();
      }
    }, LE.UI.t('done'))]);
  }

  function directorCard(n) {
    const s = session,
      d = s.director,
      m = d.story,
      h = LE.UI.h,
      body = h('div', {
        id: 'director-card'
      }, h('p', {}, local(n.text || {
        en: 'Review the safe steps together.',
        fil: 'Balikan ang ligtas na mga hakbang.'
      }))),
      actions = [],
      button = (id, text, fn) => h('button', {
        id,
        type: 'button',
        className: 'primary',
        onclick: () => {
          if (session !== s || LE.Save.active()?.id !== s.profileId) return;
          fn();
          save();
          LE.UI.close();
        }
      });
    if (n.type === 'board') {
      for (const [i, signal] of d.data.signals.entries()) body.append(h('div', {
        className: 'guide-card'
      }, h('h3', {}, signal.name ? local(signal.name) : 'TCWS ' + signal.level), h('p', {}, signal
        .range || ''), h('p', {}, local(signal.detail || signal.text || signal.description || {
        en: 'Read the official warning and follow the teacher.',
        fil: 'Basahin ang babala at sundin ang guro.'
      })), h('button', {
        id: 'director-signal-' + (i + 1),
        type: 'button',
        className: 'secondary',
        onclick: () => {
          m.readSignal(i + 1);
          save();
          LE.UI.close();
        }
      }, m.state.board.includes(i + 1) ? '✓ ' + L('Read', 'Nabasa') : L('Mark as read',
        'Nabasa ko na'))));
      const b = button('director-next', L('Continue', 'Magpatuloy'), () => d.advance());
      b.disabled = m.state.board.length !== d.data.signals.length;
      actions.push(b);
    } else if (n.type === 'route') {
      body.append(h('p', {}, L('Choose stops in the approved order. This is the fictional school plan.',
        'Piliin sa tamang ayos ang mga hinto sa kathang-isip na plano.')));
      for (const stop of d.data.route) body.append(h('button', {
        id: 'director-route-' + stop.id,
        type: 'button',
        className: 'secondary',
        onclick: () => {
          if (!m.plotRoute(stop.id)) LE.UI.toast(L('Follow the approved order.',
            'Sundin ang aprubadong ayos.'));
          save();
          LE.UI.close();
        }
      }, (m.state.route.includes(stop.id) ? '✓ ' : '') + local(stop.name)));
      const b = button('director-next', L('Route ready', 'Handa ang ruta'), () => d.advance());
      b.disabled = m.state.route.length !== d.data.route.length;
      actions.push(b);
    } else if (['check', 'dengue'].includes(n.type)) {
      const answers = n.type === 'dengue' ? m.state.dengue : m.state.checks[n.sourceId] || [],
        cards = n.type === 'dengue' ? d.data.dengue : n.cards,
        q = cards[answers.length];
      if (q) {
        body.append(h('h3', {}, local(q.question || q.text)), h('p', {
          className: 'guide-card'
        }, L('Choose the safer action.', 'Piliin ang mas ligtas na hakbang.')));
        q.choices.forEach((choice, i) => body.append(h('button', {
          id: 'director-check-' + i,
          type: 'button',
          className: 'secondary',
          onclick: () => {
            if (session !== s) return;
            const ok = n.type === 'dengue' ? m.answerDengue(i) : m.answerCheck(i);
            LE.UI.toast(local(q.why));
            if (ok) {
              save();
              LE.UI.close();
            }
          }
        }, local(choice))));
      } else actions.push(button('director-next', L('All reviewed · Continue', 'Nabalikan na · Magpatuloy'),
        () => d.advance()));
    } else if (n.type === 'contacts') {
      body.append(h('p', {}, L('Teacher-verified school/local service: ',
          'Tiyak na serbisyo sa paaralan/lugar: ') + (LE.Save.get().settings.localContactName || '—') +
        ' ' + (LE.Save.get().settings.localContactPhone || '—')), h('p', {}, L(
        'Keep your real family contact card private. Ask the teacher to verify unknown local numbers.',
        'Panatilihing pribado ang tunay na contact card ng pamilya. Ipatukoy sa guro ang lokal na numero.'
      )));
      actions.push(button('director-next', L('Contact plan reviewed', 'Nabalikan ang plano'), () => {
        m.readContacts();
        d.advance();
      }));
    } else if (n.type === 'reflect') {
      const notes = d.data.decisions.filter(x => x.pillar === LE.Data.pillars[n.chapter].id);
      body.append(h('ul', {}, notes.map(x => h('li', {}, local(x.memory)))));
      actions.push(button('director-next', L('I understand these safer actions',
        'Nauunawaan ko ang mga ligtas na hakbang'), () => {
        const missed = notes.find(x => m.decisions().state.records[x.id] && x.choices.find(c => c.id ===
          m.decisions().state.records[x.id].choiceId).type !== 'best');
        m.review(missed ? missed.choices.find(c => c.type === 'best').id : notes[0].choices.find(c => c
          .type === 'best').id);
        d.advance();
      }));
    } else actions.push(button('director-next', L('Continue', 'Magpatuloy'), () => d.advance()));
    const title = n.title ? local(n.title) : n.type === 'reflect' ? L('What I learned', 'Ang natutuhan ko') :
      n.type === 'board' ? local(d.data.boardTitle || {
        en: 'Warning signals',
        fil: 'Mga babala'
      }) : n.type === 'scene' ? L('Chapter ', 'Kabanata ') + (n.chapter + 1) : L('Objective briefing',
        'Gabay sa layunin');
    LE.UI.modal(title, body, actions).classList.add('wide-dialog');
  }

  function pump() {
    const s = session;
    if (!s || !s.director || s.paused || !document.getElementById('modal-layer').hidden) return;
    const d = s.director,
      n = d.current(),
      cue = document.getElementById('scenario-cue');
    if (!n) {
      save();
      if (d.state.debug) {
        LE.UI.modal('DEBUG · Quiz → Results', LE.UI.h('p', {}, L(
          'All four chapters reached the final assessment. This isolated debug run cannot award currency or a certificate. ' +
          'Use F2 to test another chapter or resume your real run.',
          'Nakarating ang apat na kabanata sa pagsusulit. Walang gantimpala o sertipiko ang hiwalay na debug run. F2 para sa ibang kabanata o tunay na laro.'
        )));
        return;
      }
      const pid = s.profileId,
        rid = d.state.runId,
        id = s.storyId,
        earned = LE.Rewards.result(pid, rid);
      stop(false);
      LE.App.beginTitle();
      if (earned) LE.ResultsScene.open(pid, rid);
      else LE.QuizScene.open(id, rid);
      return;
    }
    if (s.enteredNode !== n.id) {
      s.enteredNode = n.id;
      save();
      for (const sound of n.sfx || []) LE.Audio.play(sound);
      d.log('timeline-enter', {
        weather: d.weather(),
        locked: d.locked(),
        type: n.type
      });
    }
    cue.hidden = n.type !== 'event';
    if (n.type === 'event') {
      const title = local(n.title),
        text = local(n.text),
        note = L('Scripted exercise event · controls locked',
          'Pangyayari sa pagsasanay · nakakandado ang galaw');
      if (cue.textContent !== title + text + note) cue.replaceChildren(LE.UI.h('h2', {}, title), LE.UI.h(
        'p', {}, text), LE.UI.h('small', {}, note));
      return;
    }
    if (['walk', 'goal', 'talk'].includes(n.type) || n.type === 'activity' && n.game === 'hunt') return;
    if (n.type === 'decision') {
      LE.DecisionScene.open(s.storyId, {
        directorContext: {
          director: d,
          profileId: s.profileId,
          save: () => session === s && save(),
          complete: () => {
            if (session !== s) return false;
            const ok = d.finishDecision();
            save();
            return ok;
          }
        }
      });
      return;
    }
    if (n.type === 'activity') {
      const context = {
        director: true,
        debug: d.state.debug,
        profileId: s.profileId,
        storyId: s.storyId,
        runId: d.state.runId,
        nodeId: n.id,
        taskId: n.sourceId || n.id,
        snapshot: d.activitySnapshot(),
        intro: n.text,
        elapsedMs: 0
      };
      save();
      stop(false);
      LE.MiniGameScene.open(context.storyId, n.game, {
        storyContext: context
      });
      return;
    }
    if (n.type === 'ending') {
      d.advance();
      save();
      return;
    }
    directorCard(n);
  }

  function open(storyId, options = {}) {
    let profile = LE.Save.active();
    storyId = storyId || profile && profile.selectedDisaster;
    if (!profile || !profile.characterCreated || !LE.Data.maps || !LE.Data.scenarios.some(o => o.id ===
        storyId)) {
      LE.UI.toast(words().missingProfile);
      return;
    }
    if (session) stop();
    if (LE.DecisionScene && LE.DecisionScene.isActive()) LE.DecisionScene.stop();
    if (LE.MiniGameScene && LE.MiniGameScene.isActive()) LE.MiniGameScene.stop();

    if (LE.Save.active().selectedDisaster !== storyId) LE.Save.selectDisaster(storyId, profile.id);
    profile = LE.Save.active();
    LE.UI.close(false);
    document.getElementById('title-screen').hidden = true;
    document.getElementById('boot-screen').hidden = true;
    document.querySelector('.topbar').hidden = true;
    let screen = document.getElementById('world-screen');
    const h = LE.UI.h;
    if (!screen) {
      screen = h('section', {
        id: 'world-screen',
        'aria-label': words().explore
      });
      document.getElementById('game-frame').append(screen);
    }
    screen.hidden = false;
    document.getElementById('game-frame').classList.toggle('world-mode', true);
    const canvas = h('canvas', {
      id: 'world-canvas',
      width: 640,
      height: 360,
      tabIndex: 0,
      role: 'application',
      'aria-describedby': 'world-controls'
    });
    const hud = h('header', {
        className: 'world-hud'
      }, h('div', {}, h('small', {
        id: 'world-student'
      }), h('h2', {
        id: 'world-location'
      }), h('small', {
        id: 'world-day'
      })),
      h('div', {
        className: 'world-hud-actions'
      }, h('span', {
        id: 'world-count'
      }), h('button', {
        type: 'button',
        id: 'world-notebook',
        onclick: () => {
          save();
          journal();
        }
      }), h('button', {
        type: 'button',
        id: 'world-pause',
        onclick: pause
      })));
    const pillarBar = h('div', {
      className: 'world-pillar-bar'
    }, LE.Data.pillars.map(() => h('span', {
      className: 'world-pillar'
    })));
    const pad = h('div', {
      className: 'world-dpad',
      role: 'group',
      'aria-label': words().touch
    });
    const buttons = {};
    for (const [direction, label] of [
        ['up', '↑'],
        ['left', '←'],
        ['down', '↓'],
        ['right', '→']
      ]) {
      buttons[direction] = h('button', {
        type: 'button',
        id: 'move-' + direction,
        className: 'dpad-' + direction,
        'aria-label': LE.Data.profileText[LE.Save.get().settings.language][direction]
      }, label);
      pad.append(buttons[direction]);
    }
    const action = h('button', {
      type: 'button',
      id: 'world-interact',
      className: 'world-action',
      onclick: () => inspect()
    });
    screen.replaceChildren(canvas, hud, pillarBar, h('div', {
      className: 'world-prompt',
      id: 'world-near',
      role: 'status'
    }), pad, action, h('p', {
      id: 'world-controls',
      className: 'world-controls'
    }));
    const debug = options.debugResume && profile.debugScenarioRuns && profile.debugScenarioRuns[storyId],
      d = options.sandbox ? null : LE.ScenarioDirector.create(storyId, options.fresh ? null : debug ? debug
        .story : profile.storyRuns && profile.storyRuns[storyId], options.fresh ? null : debug ? debug
        .director : profile.scenarioDirectors && profile.scenarioDirectors[storyId], {
          debug: Boolean(debug)
        }),
      hazards = d ? d.data.director.hazards.map(x => ({
        id: x.objectId,
        map: x.map,
        key: x.prop,
        art: x.prop === 'soil' ? 'seedling' : x.prop,
        x: x.x,
        y: x.y,
        w: 1,
        h: 1,
        solid: true,
        kind: 'hazard',
        action: 'report'
      })) : [],
      model = LE.World.create(d ? {
        ...profile,
        exploration: {
          [storyId]: d.state.world
        }
      } : profile, storyId, d ? {
        extraObjects: hazards,
        blocked: (map, x, y) => d.blocked(map, x, y),
        canEnter: (door, from) => d.canEnter(door, from)
      } : {}),
      c = canvas.getContext('2d');
    session = {
      model,
      director: d,
      storyId,
      profileId: profile.id,
      options,
      enteredNode: null,
      effectTime: 0,
      lastSound: 0,
      screen,
      canvas,
      c,
      camera: LE.MapRenderer.cameraFor(model),
      keys: new Set(),
      pointers: new Map(),
      listeners: [],
      paused: false,
      raf: null,
      lastTime: 0,
      lastSave: 0,
      lastHUD: 0,
      footTime: 0,
      savedSignature: null
    };
    const current = session;
    if (d && !d.state.debug && profile.completedRuns && profile.completedRuns[d.state.runId]) d.markResults();
    if (d) {
      screen.append(h('aside', {
        id: 'scenario-tracker',
        className: 'scenario-tracker',
        'aria-live': 'polite'
      }), h('div', {
        id: 'scenario-cue',
        className: 'scenario-cue',
        hidden: true
      }));
    }

    function listen(target, type, handler, options) {
      target.addEventListener(type, handler, options);
      current.listeners.push(() => target.removeEventListener(type, handler, options));
    }
    const keyDirections = {
      arrowup: 'up',
      w: 'up',
      arrowleft: 'left',
      a: 'left',
      arrowdown: 'down',
      s: 'down',
      arrowright: 'right',
      d: 'right'
    };
    listen(document, 'keydown', event => {
      if (!session || session !== current || event.defaultPrevented) return;
      if (!document.getElementById('modal-layer').hidden) return;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(event.target.tagName)) return;
      const key = event.key.toLowerCase();
      if (keyDirections[key] && current.director && current.director.locked()) {
        event.preventDefault();
        return;
      }
      if (keyDirections[key]) {
        event.preventDefault();
        current.keys.delete(keyDirections[key]);
        current.keys.add(keyDirections[key]);
      } else if (key === 'escape') {
        event.preventDefault();
        if (!event.repeat) pause();
      } else if (key === 'e' || key === ' ' && event.target.tagName !== 'BUTTON') {
        event.preventDefault();
        if (!event.repeat) inspect();
      }
    });
    listen(document, 'keyup', event => {
      const direction = keyDirections[event.key.toLowerCase()];
      if (direction) current.keys.delete(direction);
    });
    for (const [direction, button] of Object.entries(buttons)) {
      listen(button, 'pointerdown', event => {
        if (current.paused || current.director && current.director.locked()) return;
        event.preventDefault();
        current.pointers.set(event.pointerId, direction);
        try {
          button.setPointerCapture(event.pointerId);
        } catch (error) {}
      });
      const release = event => current.pointers.delete(event.pointerId);
      for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(button, event,
        release);
      // Keyboard activation of a D-pad button takes one small step.
      listen(button, 'click', event => {
        if (event.detail === 0 && !current.paused && (!current.director || !current.director.locked())) {
          const result = model.tick(0.05, {
            x: direction === 'left' ? -1 : direction === 'right' ? 1 : 0,
            y: direction === 'up' ? -1 : direction === 'down' ? 1 : 0
          });
          if (result.transition) {
            current.camera = LE.MapRenderer.cameraFor(model);
            save();
            refreshHUD();
          }
        }
      });
    }
    listen(canvas, 'pointerdown', event => {
      if (current.paused || current.director && current.director.locked() || event.button > 0) return;
      canvas.focus();
      const rect = canvas.getBoundingClientRect(),
        scale = Math.min(rect.width / 640, rect.height / 360);
      if (!scale) return;
      const sx = (event.clientX - rect.left - (rect.width - 640 * scale) / 2) / scale,
        sy = (event.clientY - rect.top - (rect.height - 360 * scale) / 2) / scale;
      if (sx < 0 || sy < 0 || sx > 640 || sy > 360) return;
      const x = sx + current.camera.x,
        y = sy + current.camera.y,
        o = model.objectAt(x, y);
      if (o && model.near(o.id)) {
        inspect(o);
        return;
      }
      if (!model.routeTo(Math.floor(x / 32), Math.floor(y / 32), o && o.id)) LE.UI.toast(words().blocked);
    });
    listen(window, 'blur', () => {
      clearInputs();
      if (session === current && !current.paused) pause();
    });
    listen(document, 'visibilitychange', () => {
      if (document.hidden) {
        clearInputs();
        save();
        if (session === current && !current.paused) pause();
      }
    });
    listen(window, 'pagehide', () => save());

    function frame(timestamp) {
      if (session !== current) return;
      const dt = current.lastTime ? Math.min(0.05, (timestamp - current.lastTime) / 1000) : 0;
      current.lastTime = timestamp;
      if (LE.Save.active()?.id !== current.profileId) {
        stop(false);
        LE.UI.close(false);
        LE.App.beginTitle();
        return;
      }
      if (!document.hidden) {
        if (!current.paused) {
          if (d) {
            d.tick(dt * 1000, LE.Save.get().settings.decisionTimers);
            if (d.locked()) clearInputs();
          }
          const direction = [...current.pointers.values(), ...current.keys].at(-1),
            command = {
              x: direction === 'left' ? -1 : direction === 'right' ? 1 : 0,
              y: direction === 'up' ? -1 : direction === 'down' ? 1 : 0
            },
            result = (!d || !d.locked()) ? model.tick(dt, command) : {
              moved: false
            };
          if (result.transition) {
            current.camera = LE.MapRenderer.cameraFor(model);
            save();
            LE.UI.toast(words().mapChanged + ' ' + local(model.map().name));
          }
          if (result.interaction) inspect(result.interaction);
          if (d && d.observe(model)) {
            save();
            refreshHUD();
          }
          if (result.moved && timestamp - current.footTime > 320) {
            LE.Audio.play('footstep');
            current.footTime = timestamp;
          }
          if (timestamp - current.lastSave > 8000) {
            save();
            current.lastSave = timestamp;
          }
        }
        const visualActive = !current.paused || Boolean(document.getElementById('director-card') || document
          .getElementById('director-decision'));
        if (visualActive) {
          current.effectTime += dt;
          if (d && current.paused && document.getElementById('director-card')) d.visualTick(dt * 1000);
        }
        LE.Audio.setWeather({
          active: visualActive,
          phase: d ? d.weather() : 'clear',
          waterLevel: d ? d.waterLevel() : 0,
          outdoor: model.map().outdoor && model.map().id !== 'upper'
        });
        const settings = LE.Save.get().settings,
          target = LE.MapRenderer.cameraFor(model),
          blend = settings.reducedMotion ? 1 : Math.min(1, dt * 10);
        current.camera.x += (target.x - current.camera.x) * blend;
        current.camera.y += (target.y - current.camera.y) * blend;
        if (c) {
          const shift = d ? LE.ScenarioEffects.offset(d.weather(), current.effectTime, settings
            .reducedMotion) : {
            x: 0,
            y: 0
          };
          c.save();
          c.translate(shift.x, shift.y);
          LE.MapRenderer.render(c, model, {
            camera: current.camera,
            time: current.effectTime,
            reducedMotion: settings.reducedMotion,
            highContrast: settings.highContrast,
            language: settings.language,
            playerArt: LE.Save.artOptions(),
            director: d,
            chapter: d ? d.chapter() + 1 : 1,
            textSize: settings.textSize
          });
          c.restore();
          if (d) {
            LE.ScenarioEffects.paint(c, model, d, {
              camera: current.camera,
              time: current.effectTime,
              reducedMotion: settings.reducedMotion,
              highContrast: settings.highContrast,
              language: settings.language
            });
            LE.ScenarioEffects.arrow(c, model, directorArrow(), current.camera, current.effectTime, settings
              .reducedMotion);
          }
        }
        if (d && !current.paused && !options.defer) pump();
        if (timestamp - current.lastHUD > 150) {
          refreshHUD();
          current.lastHUD = timestamp;
        }
      }
      current.raf = window.requestAnimationFrame(frame);
    }
    save();
    refreshHUD();
    canvas.focus();
    frame(0);
  }
  LE.MapScene = {
    open,
    openSandbox: id => open(id, {
      sandbox: true
    }),
    stop,
    save,
    pause,
    journal,
    inspect,
    modalChanged,
    toTitle,
    toStories,
    isActive: () => Boolean(session),
    model: () => session && session.model,
    director: () => session && session.director
  };
})();
