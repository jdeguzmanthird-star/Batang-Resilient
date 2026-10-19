/* World-space water, bounded particles and a presentation-only easing clock. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {};
  const TILE = 32;
  const LIMITS = Object.freeze({
    zones: 4,
    debris: 5,
    ripples: 10,
    rings: 5,
    sparkles: 8
  });
  const targets = {
    'flood-low': 0.45,
    'flood-high': 1,
    receding: 0,
    retreat: 0.12,
    'first-surge': 0.68,
    surge: 1,
    'wave-lull': 0.3
  };
  const clamp = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const smoothstep = value => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };
  const target = phase => targets[phase] || 0;
  const duration = phase => ({
    'flood-low': 2600,
    'flood-high': 1600,
    receding: 8000,
    'first-surge': 2400,
    surge: 2200,
    'wave-lull': 3200
  })[phase] || 4000;

  function timeline(nodes, state) {
    // No fields are added to the Director snapshot or the browser save format.
    let phase = null,
      from = 0,
      to = 0,
      elapsed = 0,
      span = 1,
      dryAge = 0,
      wasWet = false;

    function value() {
      sync();
      return clamp(from + (to - from) * smoothstep(elapsed / span));
    }

    function sync() {
      const node = nodes[state.cursor];
      const next = node ? node.weather || 'clear' : 'recovery';
      if (next === phase) return;
      const previous = phase === null ? null : from + (to - from) * smoothstep(elapsed / span);
      let first = state.cursor;
      while (first > 0 && (nodes[first - 1].weather || 'clear') === next) first--;
      const prior = first > 0 ? target(nodes[first - 1].weather) : 0;
      from = previous === null ? prior : previous;
      to = target(next);
      span = node && node.type === 'event' ? node.duration : duration(next);
      span = Math.max(1, span || duration(next));
      elapsed = previous === null ? first < state.cursor ? span : state.elapsed || 0 : 0;
      phase = next;
      wasWet = wasWet || from > 0 || to > 0 || next === 'receding';
      if (to > 0) dryAge = 0;
    }

    function tick(ms) {
      sync();
      const dt = Math.max(0, Math.min(1000, Number.isFinite(ms) ? ms : 0));
      elapsed = Math.min(span, elapsed + dt);
      if (value() < 0.005 && wasWet) dryAge += dt;
    }

    function wetness() {
      sync();
      return wasWet ? clamp(1 - dryAge / 90000) : 0;
    }
    return {
      tick,
      value,
      wetness
    };
  }

  function zones(map, storyId) {
    if (storyId === 'flood') return map.floodZones || [];
    if (storyId === 'tsunami') return map.coastZones || [];
    return [];
  }

  function forbidden(mapId, x, y, storyId) {
    const map = LE.Data.maps[mapId];
    return Boolean(map && zones(map, storyId).some(z =>
      x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h));
  }

  function stateFor(director, options = {}) {
    const phase = options.phase || (director ? director.weather() : 'clear');
    const storyId = options.storyId || (director && director.state.storyId);
    const raw = Number.isFinite(options.waterLevel) ? options.waterLevel :
      director && director.waterLevel ? director.waterLevel() : target(phase);
    // Reduced motion freezes the water's presentation at its phase's stable level.
    const level = options.reducedMotion ? target(phase) : clamp(raw);
    const rawWetness = director && director.waterWetness ? director.waterWetness() : phase === 'receding' ?
      1 : 0;
    const wetness = options.reducedMotion ? ['receding', 'recovery', 'coast-recovery'].includes(phase) ? 1 :
      0 : rawWetness;
    return {
      phase,
      storyId,
      level,
      wetness
    };
  }

  function bounds(zone, level) {
    const height = zone.h * TILE * clamp(level);
    return {
      x: zone.x * TILE,
      y: (zone.y + zone.h) * TILE - height,
      w: zone.w * TILE,
      h: height
    };
  }

  function visible(rect, camera, width, height) {
    return rect.x + rect.w >= camera.x && rect.y + rect.h >= camera.y &&
      rect.x <= camera.x + width && rect.y <= camera.y + height;
  }

  function debris(c, kind, x, y, time, seed) {
    const bob = Math.sin(time * 1.1 + seed) * 1.4;
    c.save();
    c.translate(x, y + bob);
    c.rotate(Math.sin(time * 0.35 + seed) * 0.12);
    c.globalAlpha *= 0.8;
    if (kind === 0) {
      c.fillStyle = '#b6d2ce';
      c.fillRect(-2, -5, 5, 10);
      c.fillStyle = '#4c8b86';
      c.fillRect(-1, -7, 3, 3);
      c.fillStyle = '#e0e9cf';
      c.fillRect(-2, -1, 5, 3);
    } else if (kind === 1) {
      c.fillStyle = '#73835a';
      c.beginPath();
      c.ellipse(0, 0, 6, 2.6, -0.45, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#b2ae70';
      c.fillRect(-4, 0, 7, 1);
    } else if (kind === 2) {
      c.fillStyle = '#856b71';
      c.fillRect(-3, -6, 6, 12);
      c.fillStyle = '#b3978c';
      c.fillRect(-2, -3, 4, 3);
    } else if (kind === 3) {
      c.fillStyle = '#5e9895';
      c.beginPath();
      c.ellipse(0, 0, 7, 4, 0, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#b0c0aa';
      c.lineWidth = 1;
      c.stroke();
      c.fillStyle = '#487577';
      c.fillRect(-3, -1, 6, 2);
    } else {
      c.fillStyle = '#967e58';
      c.fillRect(-9, -2, 18, 4);
      c.fillStyle = '#bdab7c';
      c.fillRect(-6, -2, 13, 1);
    }
    c.restore();
  }

  function surface(c, rect, options = {}) {
    if (rect.w <= 0 || rect.h <= 0.1) return;
    const t = options.reducedMotion ? 0 : options.time || 0;
    const muddy = ['flood-high', 'receding'].includes(options.phase);
    c.save();
    c.beginPath();
    c.rect(rect.x + 0.5, rect.y, rect.w - 1, rect.h);
    c.clip();
    c.fillStyle = muddy ? 'rgba(99,119,99,0.67)' : 'rgba(53,143,151,0.51)';
    c.fillRect(rect.x, rect.y, rect.w, rect.h);
    // The existing floodwater tile is a translucent, cached texture rather than unused art.
    c.globalAlpha = muddy ? 0.1 : 0.055;
    for (let y = rect.y; y < rect.y + rect.h; y += 32) {
      for (let x = rect.x; x < rect.x + rect.w; x += 32) LE.Art.drawTile(c, 'floodwater', x, y);
    }
    c.globalAlpha = 1;
    for (let layer = 0; layer < 2; layer++) {
      c.strokeStyle = layer ? 'rgba(213,230,202,0.33)' : 'rgba(24,91,99,0.24)';
      c.lineWidth = layer ? 1 : 2;
      for (let i = 0; i < LIMITS.ripples; i++) {
        const x = rect.x + ((i * 61 + t * (7 + layer * 5)) % (rect.w + 30)) - 15;
        const y = rect.y + ((i * 29 + layer * 13) % Math.max(8, rect.h));
        c.beginPath();
        c.moveTo(x, y);
        c.quadraticCurveTo(x + 10, y + 2, x + 23, y);
        c.stroke();
      }
    }
    c.strokeStyle = 'rgba(226,239,211,0.82)';
    c.lineWidth = 2;
    c.beginPath();
    for (let x = 1; x < rect.w; x += 6) {
      const y = rect.y + 3 + Math.sin(x / 19 + t * 0.8) * 1.7;
      if (x === 1) c.moveTo(rect.x + x, y);
      else c.lineTo(rect.x + x, y);
    }
    c.stroke();
    for (let i = 0; i < LIMITS.sparkles; i++) {
      const x = rect.x + (i * 43 + t * 4) % rect.w;
      const y = rect.y + 6 + i * 31 % Math.max(1, rect.h - 8);
      c.fillStyle = 'rgba(230,241,219,0.48)';
      c.fillRect(x, y, 3, 1);
    }
    for (let i = 0; i < LIMITS.debris; i++) {
      const x = rect.x + 8 + (i * 67 + t * (4 + i % 2)) % Math.max(1, rect.w - 16);
      const y = rect.y + 10 + (i * 37 + t * 1.2) % Math.max(1, rect.h - 18);
      debris(c, i, x, y, t, i * 3);
    }
    if (options.rain !== false) {
      for (let i = 0; i < LIMITS.rings; i++) {
        const p = (t * 0.55 + i * 0.21) % 1;
        c.strokeStyle = 'rgba(224,237,222,' + (0.32 * (1 - p)).toFixed(3) + ')';
        c.lineWidth = 1;
        c.beginPath();
        c.ellipse(rect.x + 8 + i * 83 % Math.max(1, rect.w - 16),
          rect.y + 10 + i * 47 % Math.max(1, rect.h - 18), 2 + p * 7, 1 + p * 3, 0, 0, Math.PI * 2);
        c.stroke();
      }
    }
    c.restore();
  }

  function paint(c, map, water, options = {}) {
    const camera = options.camera || {
      x: 0,
      y: 0
    };
    const width = options.width || 640,
      height = options.height || 360;
    for (const zone of zones(map, water.storyId).slice(0, LIMITS.zones)) {
      const whole = bounds(zone, 1);
      if (!visible(whole, camera, width, height)) continue;
      if (water.wetness > 0 && ['receding', 'recovery', 'coast-recovery'].includes(water.phase)) {
        c.save();
        c.fillStyle = 'rgba(110,91,58,' + (water.wetness * 0.22).toFixed(3) + ')';
        c.fillRect(whole.x, whole.y, whole.w, whole.h);
        c.fillStyle = 'rgba(104,94,66,' + (water.wetness * 0.35).toFixed(3) + ')';
        c.fillRect(whole.x, whole.y, whole.w, 3);
        c.restore();
      }
      if (water.level > 0.001) surface(c, bounds(zone, water.level), {
        ...options,
        phase: water.phase,
        rain: water.storyId === 'flood'
      });
    }
  }

  function wetRectAt(map, water, x, y) {
    return zones(map, water.storyId).map(z => bounds(z, water.level)).find(r =>
      x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h);
  }

  function drawProp(c, image, x, y, w, h, map, water) {
    const rect = wetRectAt(map, water, x + w / 2, y + h - 2);
    if (!rect) {
      c.drawImage(image, x, y, w, h);
      return;
    }
    const line = y + h - Math.min(13, 4 + water.level * 9);
    c.save();
    c.beginPath();
    c.rect(rect.x, rect.y, rect.w, rect.h);
    c.clip();
    c.globalAlpha *= 0.14;
    c.translate(x, line * 1.45);
    c.scale(1, -0.45);
    c.drawImage(image, 0, y, w, h);
    c.restore();
    c.save();
    c.beginPath();
    c.rect(x, y, w, Math.max(0, line - y));
    c.clip();
    c.drawImage(image, x, y, w, h);
    c.restore();
    c.save();
    c.beginPath();
    c.rect(rect.x, rect.y, rect.w, rect.h);
    c.clip();
    c.strokeStyle = 'rgba(225,232,204,0.5)';
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(x + w / 2, line + 2, w * 0.5, 2.2, 0, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  function nearEdge(map, water, x, y) {
    if (water.level <= 0.001) return null;
    for (const zone of zones(map, water.storyId)) {
      const r = bounds(zone, water.level);
      const px = Math.max(r.x + 1, Math.min(r.x + r.w - 1, x));
      const py = Math.max(r.y + 1, Math.min(r.y + r.h - 1, y));
      if (Math.hypot(px - x, py - y) < 18) return {
        x: px,
        y: py,
        rect: r
      };
    }
    return null;
  }

  function edgeSign(c, map, water, options = {}) {
    if (water.level < 0.01) return;
    const camera = options.camera || {
        x: 0,
        y: 0
      },
      zone = zones(map, water.storyId).find(z =>
        visible(bounds(z, 1), camera, options.width || 640, options.height || 360));
    if (!zone) return;
    const text = options.language === 'fil' ? 'Huwag pumasok sa baha' : 'Never enter floodwater';
    const fontSize = Math.max(12, Math.min(16, (options.textSize || 18) * 0.72));
    c.save();
    c.font = 'bold ' + fontSize + 'px Arial';
    const width = c.measureText(text).width + 16;
    const x = zone.x > map.width / 2 ? zone.x * TILE - width - 8 : zone.x * TILE + 4;
    const y = (zone.y + zone.h * 0.5) * TILE - 10;
    c.fillStyle = options.highContrast ? '#fff' : '#fff4cc';
    c.fillRect(x, y, width, 25);
    c.strokeStyle = '#72553b';
    c.lineWidth = 2;
    c.strokeRect(x, y, width, 25);
    c.fillStyle = '#3b4538';
    c.fillText(text, x + 8, y + 17);
    c.restore();
  }
  LE.WorldWater = {
    LIMITS,
    smoothstep,
    target,
    timeline,
    zones,
    forbidden,
    stateFor,
    bounds,
    surface,
    paint,
    drawProp,
    nearEdge,
    edgeSign
  };
})();
