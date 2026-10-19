/* Cached scenery, cheap lighting and bounded ambient motion. No collision objects. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {};
  const tiles = new WeakMap();
  const vignettes = new Map();
  const stats = {
    builds: 0,
    hits: 0
  };
  const LIMITS = Object.freeze({
    dust: 12,
    birds: 3,
    grass: 22,
    clouds: 3,
    footsteps: 4
  });
  const palette = ['#b78160', '#688e7a', '#d0b366', '#74949f', '#967b99'];

  function shadow(c, x, y, w = 22, h = 6, alpha = 0.16) {
    c.save();
    for (let i = 2; i >= 0; i--) {
      c.fillStyle = 'rgba(31,52,40,' + (alpha / 3).toFixed(3) + ')';
      c.beginPath();
      c.ellipse(x, y, w / 2 + i * 2, h / 2 + i, 0, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  }

  function decor(c, item, outdoor) {
    const x = item.x * 32,
      y = item.y * 32,
      kind = item.kind;
    c.save();
    if (['plant', 'planter'].includes(kind)) {
      shadow(c, x + 16, y + 30, 23, 5, 0.12);
      LE.Art.drawProp(c, outdoor ? 'flowerpot' : 'seedling', x, y);
      c.fillStyle = '#759c65';
      c.fillRect(x + 5, y + 13, 9, 5);
      c.fillRect(x + 18, y + 8, 7, 7);
    } else if (kind === 'rug') {
      c.fillStyle = '#b09c78';
      c.fillRect(x + 1, y + 6, 30, 24);
      c.fillStyle = '#a7b9a0';
      c.fillRect(x + 3, y + 8, 26, 20);
      c.strokeStyle = '#e6dbc0';
      c.lineWidth = 1;
      c.strokeRect(x + 6, y + 11, 20, 14);
      c.fillStyle = '#788f7c';
      for (let i = 0; i < 5; i++) c.fillRect(x + 7 + i * 4, y + 17, 2, 2);
    } else if (kind === 'basket') {
      shadow(c, x + 16, y + 29, 24, 5, 0.12);
      c.fillStyle = '#b79763';
      c.fillRect(x + 5, y + 13, 22, 15);
      c.fillStyle = '#ddc28b';
      for (let i = 0; i < 5; i++) c.fillRect(x + 7 + i * 4, y + 15, 1, 11);
      c.fillRect(x + 4, y + 12, 24, 3);
    } else if (kind === 'books') {
      LE.Art.drawProp(c, 'books', x, y);
    } else if (kind === 'drum') {
      shadow(c, x + 16, y + 29, 24, 6, 0.14);
      c.fillStyle = '#a36442';
      c.fillRect(x + 6, y + 8, 20, 19);
      c.fillStyle = '#e2c992';
      c.fillRect(x + 5, y + 6, 22, 4);
      c.fillRect(x + 5, y + 25, 22, 3);
      c.strokeStyle = '#eed6a1';
      c.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        c.beginPath();
        c.moveTo(x + 6 + i * 5, y + 10);
        c.lineTo(x + 11 + i * 5, y + 24);
        c.stroke();
      }
    } else if (kind === 'lantern') {
      c.strokeStyle = '#60776b';
      c.beginPath();
      c.moveTo(x + 16, y);
      c.lineTo(x + 16, y + 10);
      c.stroke();
      c.fillStyle = '#d6b76d';
      c.fillRect(x + 9, y + 8, 14, 13);
      c.fillStyle = '#f3e1a3';
      c.fillRect(x + 12, y + 11, 8, 7);
    } else {
      const mural = kind === 'mural',
        width = mural ? 44 : 28,
        left = x + 16 - width / 2;
      c.fillStyle = '#795c43';
      c.fillRect(left - 2, y - 7, width + 4, 36);
      c.fillStyle = kind === 'kid_board' ? '#b69b6c' : '#f0e3bf';
      c.fillRect(left, y - 5, width, 32);
      if (mural) {
        c.fillStyle = '#8fb7b3';
        c.fillRect(left + 2, y - 3, width - 4, 26);
        c.fillStyle = '#6d9b7d';
        c.beginPath();
        c.moveTo(left + 2, y + 10);
        c.lineTo(left + 13, y + 2);
        c.lineTo(left + 27, y + 12);
        c.lineTo(left + 42, y + 7);
        c.lineTo(left + 42, y + 16);
        c.lineTo(left + 2, y + 16);
        c.fill();
        c.fillStyle = '#d4c78d';
        c.fillRect(left + 3, y + 19, 38, 1);
        c.fillStyle = '#8d5e40';
        c.fillRect(left + 19, y + 17, 13, 3);
        c.fillStyle = '#e8dbb7';
        c.fillRect(left + 25, y + 8, 1, 10);
        c.beginPath();
        c.moveTo(left + 26, y + 9);
        c.lineTo(left + 33, y + 15);
        c.lineTo(left + 26, y + 15);
        c.fill();
        c.font = '6px Arial';
        c.fillStyle = '#315e53';
        c.fillText('GUIMARAS STRAIT', left + 2, y + 26);
      } else {
        for (let i = 0; i < 3; i++) {
          const px = left + 3 + i * 8;
          c.fillStyle = '#fff6dc';
          c.fillRect(px, y, 7, 14);
          c.fillStyle = palette[i];
          c.fillRect(px + 1, y + 6, 5, 5);
          c.fillStyle = '#e5b868';
          c.fillRect(px + 3, y + 2, 2, 2);
          c.fillStyle = '#597b61';
          c.fillRect(px + 2, y + 12, 3, 1);
        }
        c.fillStyle = '#6a8c77';
        c.fillRect(left + 4, y + 20, width - 8, 2);
      }
    }
    c.restore();
  }

  function staticLayer(map) {
    const previous = tiles.get(map.tiles);
    if (previous) {
      stats.hits++;
      return previous;
    }
    const canvas = document.createElement('canvas');
    canvas.width = map.width * 32;
    canvas.height = map.height * 32;
    const c = canvas.getContext('2d');
    c.imageSmoothingEnabled = false;
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        LE.Art.drawTile(c, map.tiles[y][x], x * 32, y * 32, 1, (x * 3 + y * 7) % 4);
        if (map.outdoor && (x === 0 || y === 0 || x === map.width - 1 || y === map.height - 1)) {
          c.fillStyle = '#82936b';
          c.fillRect(x * 32, y * 32 + 19, 32, 3);
          c.fillRect(x * 32 + 6, y * 32 + 11, 3, 20);
        }
        if (!map.outdoor && y === 0 && x % 5 === 2) LE.Art.drawTile(c, 'window', x * 32, y * 32);
      }
    }
    if (!map.outdoor) {
      c.fillStyle = '#b5b496';
      c.fillRect(32, 58, (map.width - 2) * 32, 5);
      c.fillStyle = '#819984';
      c.fillRect(32, 63, (map.width - 2) * 32, 3);
      c.fillStyle = 'rgba(55,66,42,0.07)';
      c.fillRect(32, 66, (map.width - 2) * 32, 7);
    }
    for (const item of map.decor || []) {
      if (!['fan', 'curtain'].includes(item.kind)) decor(c, item, map.outdoor);
    }
    tiles.set(map.tiles, canvas);
    stats.builds++;
    return canvas;
  }

  function fan(c, x, y, time) {
    c.save();
    c.translate(x, y);
    c.strokeStyle = '#6e8175';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, -14);
    c.lineTo(0, 0);
    c.stroke();
    c.rotate(time * 2.2);
    c.fillStyle = '#8ba294';
    for (let i = 0; i < 3; i++) {
      c.rotate(Math.PI * 2 / 3);
      c.beginPath();
      c.ellipse(10, 0, 11, 3, 0.2, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#e0d0aa';
    c.beginPath();
    c.arc(0, 0, 4, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  function ambient(c, map, options) {
    const time = options.reducedMotion ? 0 : options.time || 0;
    const camera = options.camera || {
      x: 0,
      y: 0
    };
    const wind = ['storm', 'flood-high', 'surge'].includes(options.phase) ? 1.8 : 1;
    c.save();
    if (!map.outdoor || map.id === 'upper') {
      // Translucent shafts are world anchored and have no expensive blur/filter.
      for (let x = 80; x < map.width * 32; x += 192) {
        c.fillStyle = 'rgba(255,237,180,0.055)';
        c.beginPath();
        c.moveTo(x, 38);
        c.lineTo(x + 24, 38);
        c.lineTo(x + 124, 240);
        c.lineTo(x + 50, 240);
        c.fill();
      }
      for (let i = 0; i < LIMITS.dust; i++) {
        const x = 80 + i * 73 % (map.width * 32 - 100) + Math.sin(time * 0.25 + i) * 8;
        const y = 88 + (i * 31 + time * 2) % 155;
        c.fillStyle = 'rgba(241,218,165,0.38)';
        c.fillRect(x, y, 1.5, 1.5);
      }
    } else {
      for (let i = 0; i < LIMITS.clouds; i++) {
        const x = (i * 410 + time * 8) % (map.width * 32 + 260) - 130;
        c.fillStyle = 'rgba(63,93,88,0.065)';
        c.beginPath();
        c.ellipse(x, 170 + i * 180, 138, 36, -0.2, 0, Math.PI * 2);
        c.fill();
      }
      for (let i = 0; i < LIMITS.grass; i++) {
        const x = 40 + i * 137 % (map.width * 32 - 80),
          y = 90 + i * 83 % (map.height * 32 - 130);
        if (map.tiles[Math.floor(y / 32)][Math.floor(x / 32)] !== 'grass') continue;
        const bend = Math.sin(time * 0.8 + i) * 2 * wind;
        c.strokeStyle = '#72945f';
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + bend - 2, y - 5);
        c.moveTo(x + 3, y);
        c.lineTo(x + bend + 4, y - 7);
        c.stroke();
      }
      c.strokeStyle = '#52766b';
      c.lineWidth = 1;
      for (let i = 0; i < LIMITS.birds; i++) {
        const x = (i * 210 + time * 13) % (map.width * 32),
          y = 90 + i * 64;
        const flap = Math.sin(time * 1.8 + i) * 2;
        c.beginPath();
        c.moveTo(x - 4, y + flap);
        c.lineTo(x, y + 2);
        c.lineTo(x + 4, y + flap);
        c.stroke();
      }
    }
    for (const item of map.decor || []) {
      const x = item.x * 32 + 16,
        y = item.y * 32 + 10;
      if (x < camera.x - 60 || x > camera.x + (options.width || 640) + 60) continue;
      if (item.kind === 'fan') fan(c, x, y, time);
      if (item.kind === 'curtain') {
        const sway = Math.sin(time * 0.6) * 2 * wind;
        c.fillStyle = 'rgba(162,185,160,0.86)';
        c.beginPath();
        c.moveTo(x - 10, y - 11);
        c.lineTo(x + 10, y - 11);
        c.lineTo(x + 8 + sway, y + 22);
        c.lineTo(x - 8 + sway, y + 22);
        c.fill();
        c.strokeStyle = '#879d83';
        c.beginPath();
        c.moveTo(x - 3, y - 9);
        c.lineTo(x - 3 + sway, y + 19);
        c.stroke();
      }
    }
    c.restore();
  }

  function light(c, map, options) {
    const width = options.width || 640,
      height = options.height || 360;
    const chapter = Math.max(1, Math.min(4, options.chapter || 1));
    const colors = ['rgba(255,221,155,0.035)', 'rgba(83,121,147,0.10)',
      'rgba(29,51,68,0.20)', 'rgba(243,184,96,0.13)'
    ];
    c.save();
    c.globalAlpha = options.highContrast ? 0.35 : 1;
    c.fillStyle = colors[chapter - 1];
    c.fillRect(0, 0, width, height);
    if (chapter === 3 && (!map.outdoor || map.id === 'upper')) {
      const spots = [
        [width * 0.27, 90],
        [width * 0.76, 110]
      ];
      for (const [x, y] of spots) {
        for (let r = 48; r > 0; r -= 12) {
          c.fillStyle = 'rgba(255,207,126,0.035)';
          c.beginPath();
          c.ellipse(x, y, r * 1.5, r * 0.75, 0, 0, Math.PI * 2);
          c.fill();
        }
      }
    }
    const key = width + 'x' + height;
    if (!vignettes.has(key)) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const v = canvas.getContext('2d'),
        gradient = v.createRadialGradient(width / 2, height / 2,
          height * 0.2, width / 2, height / 2, width * 0.65);
      if (gradient && gradient.addColorStop) {
        gradient.addColorStop(0, 'rgba(21,42,33,0)');
        gradient.addColorStop(1, 'rgba(21,42,33,0.17)');
        v.fillStyle = gradient;
        v.fillRect(0, 0, width, height);
      }
      if (vignettes.size >= 4) vignettes.delete(vignettes.keys().next().value);
      vignettes.set(key, canvas);
    }
    c.drawImage(vignettes.get(key), 0, 0);
    c.restore();
  }

  function steps(c, model, water, options) {
    if (options.reducedMotion || !model.state.walking) return;
    const time = options.time || 0,
      x = model.state.x,
      y = model.state.y;
    const edge = LE.WorldWater.nearEdge(model.map(), water, x, y);
    c.save();
    if (edge) {
      c.beginPath();
      c.rect(edge.rect.x, edge.rect.y, edge.rect.w, edge.rect.h);
      c.clip();
      c.strokeStyle = 'rgba(232,239,216,0.6)';
      c.lineWidth = 1;
      c.beginPath();
      c.ellipse(edge.x, edge.y, 2 + time * 6 % 8, 1 + time * 3 % 4, 0, 0, Math.PI * 2);
      c.stroke();
    } else if (model.map().outdoor && model.map().id !== 'upper') {
      for (let i = 0; i < LIMITS.footsteps; i++) {
        const p = (time * 1.5 + i / LIMITS.footsteps) % 1;
        c.fillStyle = 'rgba(201,180,126,' + (0.23 * (1 - p)).toFixed(3) + ')';
        c.beginPath();
        c.ellipse(x - 8 + i * 5, y + 2 - p * 5, 1 + p * 2, 1 + p, 0, 0, Math.PI * 2);
        c.fill();
      }
    }
    c.restore();
  }
  LE.Environment = {
    staticLayer,
    shadow,
    ambient,
    light,
    fan,
    steps,
    LIMITS,
    cacheStats: () => ({
      ...stats
    })
  };
})();
