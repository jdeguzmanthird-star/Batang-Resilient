/* Shared native/browser renderer. Tiles are cached; only moving layers redraw. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {};

  function cameraFor(model, width = 640, height = 360) {
    const map = model.map();
    return {
      x: Math.max(0, Math.min(map.width * 32 - width, model.state.x - width / 2)),
      y: Math.max(0, Math.min(map.height * 32 - height, model.state.y - height / 2 - 12))
    };
  }

  function render(c, model, options = {}) {
    const width = options.width || 640,
      height = options.height || 360;
    const camera = options.camera || cameraFor(model, width, height);
    const reduced = options.reducedMotion === true,
      time = reduced ? 0 : options.time || 0;
    const map = model.map(),
      state = model.state;
    const water = LE.WorldWater.stateFor(options.director, {
      ...options,
      storyId: state.storyId
    });
    const view = {
      ...options,
      width,
      height,
      camera,
      time,
      phase: water.phase,
      storyId: water.storyId,
      reducedMotion: reduced
    };
    c.save();
    c.imageSmoothingEnabled = false;
    c.beginPath();
    c.rect(0, 0, width, height);
    c.clip();
    c.fillStyle = '#b3c4b1';
    c.fillRect(0, 0, width, height);
    c.save();
    c.translate(-Math.round(camera.x), -Math.round(camera.y));
    c.drawImage(LE.Environment.staticLayer(map), 0, 0);
    LE.Environment.ambient(c, map, view);
    // Water is translated with the world, and never drawn over a player's dry cell.
    LE.WorldWater.paint(c, map, water, view);
    if (map.floodWindow && LE.FloodArt.windowView) {
      const window = map.floodWindow;
      LE.FloodArt.windowView(c, {
        x: window.x * 32,
        y: window.y * 32,
        w: window.w * 32,
        h: window.h * 32
      }, {
        ...view,
        waterLevel: water.level,
        wetness: water.wetness
      });
    }
    LE.Environment.steps(c, model, water, view);
    const nearest = model.near(),
      actors = [];
    const objects = map.objects.concat(map.waterFixtures || []);
    for (const o of objects) {
      if ((state.objects[o.id] || {}).collected) continue;
      const x = o.x * 32,
        y = o.y * 32,
        w = o.w * 32,
        h = o.h * 32;
      if (x + w < camera.x - 32 || y + h < camera.y - 32 ||
        x > camera.x + width + 32 || y > camera.y + height + 32) continue;
      actors.push({
        depth: (o.y + o.h) * 32,
        draw() {
          if (o.kind === 'door') {
            LE.Art.drawTile(c, 'exit', x, y);
            c.fillStyle = '#355a42';
            c.font = '9px monospace';
            c.textAlign = 'center';
            const name = LE.Data.maps[o.target].name[options.language || 'en'];
            c.fillText(name.slice(0, 24), x + 16, y - 3);
            c.textAlign = 'left';
          } else if (o.npc) {
            LE.Environment.shadow(c, x + 16, y + 30, 24, 6);
            LE.Art.drawCharacter(c, x + 16, y + 31, {
              npc: o.npc,
              direction: 'down',
              time,
              reducedMotion: reduced
            });
            if (!state.seen.has(o.id)) c.drawImage(LE.Art.emote('help'), x + 8, y - 13);
          } else if (o.art) {
            LE.Environment.shadow(c, x + w / 2, y + h - 2, w * 0.8, 6, 0.13);
            const image = LE.Art.prop(o.art);
            if (o.art === 'tree' || o.art === 'mangrove') {
              const wind = ['storm', 'flood-high', 'surge'].includes(water.phase) ? 0.075 : 0.025;
              c.save();
              c.translate(x + w / 2, y + h);
              c.rotate(reduced ? 0 : Math.sin(time * 0.65 + o.x) * wind);
              c.drawImage(image, -w / 2, -h, w, h);
              c.restore();
            } else LE.WorldWater.drawProp(c, image, x, y, w, h, map, water);
            if (o.art === 'ceiling_fan') LE.Environment.fan(c, x + 16, y + 14, time);
            if (o.art === 'flagpole') {
              const sway = Math.sin(time * 0.9) * 2;
              c.fillStyle = '#3e7594';
              c.fillRect(x + 17, y + 4, 12 + sway, 4);
              c.fillStyle = '#ad6151';
              c.fillRect(x + 17, y + 8, 12 + sway, 4);
            }
          }
          const record = state.objects[o.id] || {};
          if (record.reported) {
            c.fillStyle = '#467756';
            c.fillRect(x + 24, y + 2, 6, 6);
            c.fillStyle = '#f9edbf';
            c.fillRect(x + 26, y + 3, 2, 3);
          }
          if (o.kind === 'switch' && record.on) {
            c.fillStyle = '#f3cf76';
            c.fillRect(x + 24, y + 2, 5, 5);
          }
          if (nearest && nearest.id === o.id) {
            c.strokeStyle = options.highContrast ? '#102e20' : '#fff0a6';
            c.lineWidth = 2;
            c.strokeRect(x - 2, y - 2, w + 4, h + 4);
            c.drawImage(LE.Art.emote('sparkle', reduced ? 0 : Math.floor(time) % 3), x + w - 7, y - 10);
          }
        }
      });
    }
    const profileArt = options.playerArt || {};
    actors.push({
      depth: state.dog.y + 1,
      draw() {
        LE.Environment.shadow(c, state.dog.x, state.dog.y, 22, 5, 0.14);
        LE.Art.drawCharacter(c, state.dog.x, state.dog.y, {
          npc: 'bantay',
          direction: state.dog.direction,
          time,
          walking: state.walking,
          reducedMotion: reduced,
          vest: profileArt.outfit === 'k9'
        });
      }
    });
    actors.push({
      depth: state.y + 2,
      draw() {
        LE.Environment.shadow(c, state.x, state.y, 24, 6, 0.18);
        LE.Art.drawCharacter(c, state.x, state.y, {
          ...profileArt,
          direction: state.direction,
          time,
          walking: state.walking,
          reducedMotion: reduced
        });
      }
    });
    actors.sort((a, b) => a.depth - b.depth).forEach(actor => actor.draw());
    LE.WorldWater.edgeSign(c, map, water, view);
    c.restore();
    LE.Environment.light(c, map, view);
    c.restore();
  }
  LE.MapRenderer = {
    render,
    cameraFor
  };
})();
