/* Native pixel panels: water is outside; students remain on a dry checked upper floor. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {};
  const levels = {
    'flood-low': 172,
    'flood-high': 112,
    receding: 190
  };

  function water(c, y, time = 0, reducedMotion = false, options = {}) {
    const t = reducedMotion ? 0 : time;
    if (LE.WorldWater) {
      LE.WorldWater.surface(c, {
        x: 0,
        y,
        w: 640,
        h: Math.max(0, 220 - y)
      }, {
        ...options,
        time: t,
        reducedMotion,
        rain: options.storyId !== 'tsunami'
      });
    } else {
      c.fillStyle = '#4b8998';
      c.fillRect(0, y, 640, Math.max(0, 220 - y));
    }
  }

  function windowView(c, rect, options = {}) {
    const phase = options.phase || 'flood-low',
      reduced = options.reducedMotion === true;
    const time = reduced ? 0 : options.time || 0;
    const target = LE.WorldWater ? LE.WorldWater.target(phase) : phase === 'flood-high' ? 1 : 0.45;
    const level = reduced ? target : Math.max(0, Math.min(1,
      Number.isFinite(options.waterLevel) ? options.waterLevel : target));
    c.save();
    c.beginPath();
    c.rect(rect.x, rect.y, rect.w, rect.h);
    c.clip();
    c.translate(rect.x, rect.y);
    c.scale(rect.w / 640, rect.h / 224);
    c.fillStyle = '#adbfba';
    c.fillRect(0, 0, 640, 224);
    c.fillStyle = 'rgba(96,133,142,' + (0.12 + Math.sin(time * 0.3) * 0.008).toFixed(3) + ')';
    c.fillRect(0, 0, 640, 165);
    for (let i = 0; i < 3; i++) {
      const x = (i * 242 + time * 3) % 800 - 80;
      c.fillStyle = '#c2cfca';
      c.fillRect(x, 28 + i * 15, 130, 10);
      c.fillRect(x + 22, 18 + i * 15, 63, 15);
    }
    c.fillStyle = '#789780';
    c.fillRect(0, 161, 640, 63);
    LE.Art.drawProp(c, 'tree', 31, 67, 2.5);
    LE.Art.drawProp(c, 'tree', 541, 55, 2.7);
    c.fillStyle = '#e2d2a6';
    c.fillRect(111, 64, 373, 148);
    c.fillStyle = '#9e6d4b';
    c.fillRect(99, 51, 397, 15);
    c.fillStyle = '#586c5b';
    for (let i = 0; i < 4; i++) c.fillRect(130 + i * 88, 91, 50, 44);
    c.fillRect(266, 151, 47, 62);
    c.fillStyle = '#9e6d4b';
    c.fillRect(111, 139, 373, 7);
    const wetness = Number.isFinite(options.wetness) ? options.wetness : phase === 'receding' ? 1 : 0;
    if (wetness > 0) {
      c.fillStyle = 'rgba(119,94,57,' + (wetness * 0.24).toFixed(3) + ')';
      c.fillRect(111, 151, 373, 6);
      c.fillStyle = 'rgba(111,102,65,' + (wetness * 0.18).toFixed(3) + ')';
      c.fillRect(0, 188, 640, 36);
    }
    if (level > 0) {
      const y = 218 - level * 106;
      // A slow distant band and the nearer surface move at different rates.
      c.fillStyle = '#7faba9';
      c.fillRect(0, y, 640, 220 - y);
      c.strokeStyle = '#b3cdbe';
      c.lineWidth = 2;
      for (let i = 0; i < 7; i++) {
        const x = (i * 109 - time * 3 + 800) % 760 - 60;
        c.beginPath();
        c.moveTo(x, y + 6);
        c.quadraticCurveTo(x + 20, y + 9, x + 49, y + 6);
        c.stroke();
      }
      water(c, y + 9, time * 0.85, reduced, {
        ...options,
        phase
      });
    }
    if (['rain', 'flood-low', 'flood-high', 'receding'].includes(phase)) {
      LE.Weather.paint(c, {
        ...options,
        width: 640,
        height: 224,
        phase,
        outdoor: true,
        time
      });
    }
    // This rail and its mask belong to an exterior view, never to traversable water.
    c.fillStyle = '#36564b';
    c.fillRect(0, 213, 640, 11);
    for (let x = 0; x < 640; x += 157) {
      c.fillStyle = '#698674';
      c.fillRect(x, 0, 10, 224);
    }
    c.fillStyle = '#d5d0aa';
    c.fillRect(0, 0, 640, 15);
    c.restore();
  }

  function route(c, o) {
    const data = LE.Data.flood,
      fil = o.language === 'fil',
      selected = o.route || [],
      points = [
        [92, 87],
        [272, 87],
        [272, 249],
        [514, 249]
      ],
      wet = [514, 87];
    c.fillStyle = '#cdd9ad';
    c.fillRect(0, 0, 640, 360);
    for (let x = 0; x < 640; x += 32)
      for (let y = 0; y < 360; y += 32)
        if ((x + y) % 96 === 0) LE.Art.drawTile(c, 'grass', x, y);
    c.lineWidth = 25;
    c.strokeStyle = '#e8dbb1';
    c.beginPath();
    points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
    c.stroke();
    c.strokeStyle = '#426957';
    c.lineWidth = 5;
    c.beginPath();
    points.slice(0, Math.max(1, selected.length)).forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
    c.stroke();
    c.fillStyle = '#5796a6';
    c.fillRect(410, 25, 215, 125);
    for (let i = 0; i < 7; i++) {
      c.fillStyle = '#a8d2d0';
      c.fillRect(425 + i * 26, 58 + (i % 2) * 28, 17, 3);
    }
    c.strokeStyle = '#a34f42';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(486, 63);
    c.lineTo(540, 112);
    c.moveTo(540, 63);
    c.lineTo(486, 112);
    c.stroke();
    c.font = 'bold 13px sans-serif';
    c.textAlign = 'center';
    data.route.forEach((node, i) => {
      const [x, y] = points[i];
      c.fillStyle = selected.includes(node.id) ? '#356752' : '#746544';
      c.fillRect(x - 64, y - 27, 128, 54);
      c.fillStyle = '#fff7dd';
      c.fillRect(x - 61, y - 24, 122, 48);
      c.fillStyle = '#233d35';
      c.fillText(String(i + 1) + (selected.includes(node.id) ? ' ✓' : ''), x, y - 3);
      c.font = '12px sans-serif';
      const labels = fil ? [
        ['Silid'],
        ['Tuyong pasilyo'],
        ['Nasuring hagdan'],
        ['Pagtitipunan', 'sa itaas']
      ] : [
        ['Classroom'],
        ['Dry corridor'],
        ['Checked stairs'],
        ['Upper', 'assembly']
      ];
      labels[i].forEach((label, n) => c.fillText(label, x, y + 12 + n * 13));
      c.font = 'bold 13px sans-serif';
    });
    c.fillStyle = '#442e27';
    c.fillText(fil ? 'BAHA · SARADO' : 'FLOODED · CLOSED', wet[0], 137);
    c.fillText(fil ? 'MAPA NG PAGSASANAY · SURIIN ANG TUNAY NA PLANO' :
      'PRACTICE MAP · CHECK YOUR REAL SCHOOL PLAN', 320, 337);
    c.textAlign = 'start';
  }

  function paint(c, o = {}) {
    const task = o.task || {},
      phase = task.weather || 'recovery',
      time = o.reducedMotion ? 0 : o.time || 0,
      fil = o.language === 'fil';
    c.save();
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, 640, 360);
    if (task.type === 'route') {
      route(c, o);
      c.restore();
      return;
    }
    if (phase === 'clear' || phase === 'rain' && task.type === 'board') {
      if (task.type !== 'board') {
        LE.StoryArt.paint(c, o);
        c.restore();
        return;
      }
      c.fillStyle = '#e7e1bc';
      c.fillRect(0, 0, 640, 360);
      c.fillStyle = '#374f42';
      c.font = 'bold 20px sans-serif';
      c.fillText(fil ? 'BABALA SA ULAN' : 'RAINFALL WARNINGS', 45, 50);
      const colors = ['#e8c84f', '#d78b45', '#b65748'],
        labels = fil ? ['KAMALAYAN', 'PAGHAHANDA', 'PAGTUGON'] : ['AWARENESS', 'PREPAREDNESS', 'RESPONSE'];
      for (let i = 0; i < 3; i++) {
        c.fillStyle = colors[i];
        c.fillRect(35 + i * 204, 80, 180, 170);
        c.fillStyle = '#253b34';
        c.fillRect(42 + i * 204, 143, 166, 53);
        c.fillStyle = '#fff9df';
        c.font = 'bold 14px sans-serif';
        c.fillText(['YELLOW', 'ORANGE', 'RED'][i], 64 + i * 204, 167);
        c.font = '11px sans-serif';
        c.fillText(labels[i], 53 + i * 204, 186);
        c.fillStyle = '#f4ecd1';
        c.fillRect(85 + i * 204, 96, 62, 17);
        c.fillRect(98 + i * 204, 87, 35, 12);
        c.fillStyle = '#397e92';
        for (let drop = 0; drop < 3; drop++) c.fillRect(95 + i * 204 + drop * 18, 117 + (drop % 2) * 4, 4,
          11);
      }
      c.fillStyle = '#374f42';
      c.font = '14px sans-serif';
      c.fillText(fil ? 'Sundin nang maaga ang opisyal na tagubilin.' : 'Follow official instructions early.',
        45, 304);
      c.restore();
      return;
    }
    // View out of upper-floor windows onto a separate lower building and grounds.
    windowView(c, {
      x: 0,
      y: 0,
      w: 640,
      h: 224
    }, {
      ...o,
      phase,
      time
    });
    // Solid room floor and window rail mask all water. No water is painted over students.
    c.fillStyle = o.highContrast ? '#fff4d5' : '#e3d6b0';
    c.fillRect(0, 224, 640, 136);
    c.fillStyle = '#36564b';
    c.fillRect(0, 214, 640, 13);
    for (let x = 0; x < 640; x += 157) {
      c.fillStyle = '#698674';
      c.fillRect(x, 0, 13, 224);
    }
    c.fillStyle = '#d5d0aa';
    c.fillRect(0, 0, 640, 21);
    c.fillStyle = '#2d4b40';
    c.fillRect(13, 24, 291, 28);
    c.fillStyle = '#fff7df';
    c.font = 'bold 12px sans-serif';
    c.fillText(fil ? 'TUYO · APRUBADONG LUGAR SA ITAAS' : 'DRY · APPROVED UPPER ASSEMBLY', 22, 42);
    LE.Art.drawProp(c, 'radio', 505, 253, 1.6);
    LE.Art.drawProp(c, 'bag', 107, 285, 1.8);
    LE.Art.drawProp(c, 'water_bottle', 480, 297, 1.3);
    LE.Art.drawProp(c, 'route_marker', 24, 264, 1.5);
    const feedback = o.feedback || '',
      caution = ['consequence', 'rescue', 'retry'].includes(feedback);
    LE.Art.drawCharacter(c, 270, 320, {
      ...o.playerArt,
      direction: 'right',
      time,
      reducedMotion: o.reducedMotion
    }, 2);
    LE.Art.drawCharacter(c, 354, 314, {
      npc: 'mara',
      direction: 'left',
      time,
      reducedMotion: o.reducedMotion
    }, 2);
    LE.Art.drawCharacter(c, 194, 313, {
      npc: task.npc && task.npc !== 'mara' ? task.npc : 'bea',
      direction: 'right',
      time,
      reducedMotion: o.reducedMotion
    }, 1.8);
    LE.Art.drawCharacter(c, 426, 315, {
      npc: 'jomar',
      direction: 'left',
      time,
      reducedMotion: o.reducedMotion
    }, 1.8);
    LE.Art.drawCharacter(c, 319, 351, {
      npc: 'bantay',
      direction: 'right',
      time,
      reducedMotion: o.reducedMotion
    }, 1.5);
    if (caution || feedback === 'learn') c.drawImage(LE.Art.emote(caution ? 'help' : 'happy'), 272, 235, 27,
      27);
    c.restore();
  }
  LE.FloodArt = {
    paint,
    water,
    levels,
    windowView
  };
})();
