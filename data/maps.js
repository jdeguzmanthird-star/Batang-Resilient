/* Tile coordinates, collision, objects, and doorway links for all nine maps. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {};
  LE.Data = LE.Data || {};
  const maps = {};
  const reports = new Set(['bookshelf', 'ceiling_fan', 'outlet', 'window_latch', 'branch', 'clogged_drain',
    'electric_post', 'roof_sheet', 'cracked_panel'
  ]);
  const pickups = new Set(['whistle_box', 'flashlight', 'water_bottle', 'id_card']);
  const switches = new Set(['radio', 'emergency_light']);

  function room(id, en, fil, width, height, outdoor = false) {
    const map = {
      id,
      name: {
        en,
        fil
      },
      width,
      height,
      outdoor,
      spawn: {
        x: Math.floor(width / 2),
        y: height - 5
      },
      objects: [],
      decor: [],
      tiles: [],
      blocked: []
    };
    for (let y = 0; y < height; y++) {
      map.tiles[y] = [];
      map.blocked[y] = [];
      for (let x = 0; x < width; x++) {
        const border = x === 0 || y === 0 || x === width - 1 || y === height - 1 || !outdoor && y === 1;
        map.tiles[y][x] = outdoor ? 'grass' : y < 2 ? 'wall' : 'floor';
        map.blocked[y][x] = border;
      }
    }
    maps[id] = map;
    return map;
  }

  function patch(map, x, y, w, h, tile, blocked = false) {
    for (let row = y; row < y + h; row++)
      for (let col = x; col < x + w; col++) {
        map.tiles[row][col] = tile;
        map.blocked[row][col] = blocked;
      }
  }

  function object(map, key, x, y, extra = {}) {
    const action = extra.action || (reports.has(key) ? 'report' : pickups.has(key) ? 'collect' : switches.has(
      key) ? 'toggle' : 'info');
    const item = {
      id: map.id + '_' + key + '_' + map.objects.length,
      key,
      art: key,
      x,
      y,
      w: 1,
      h: 1,
      solid: true,
      kind: action === 'report' ? 'hazard' : action === 'collect' ? 'pickup' : action === 'toggle' ?
        'switch' : 'info',
      action,
      ...extra
    };
    map.objects.push(item);
    return item;
  }

  function npc(map, id, x, y) {
    return object(map, 'npc', x, y, {
      npc: id,
      kind: 'npc',
      action: 'talk',
      art: null
    });
  }

  function door(map, x, y, target, tx, ty) {
    map.blocked[y][x] = false;
    map.tiles[y][x] = 'exit';
    return object(map, 'door', x, y, {
      kind: 'door',
      action: 'enter',
      solid: false,
      art: null,
      target,
      arrival: {
        x: tx,
        y: ty
      }
    });
  }

  function scatter(map, items, points) {
    items.forEach((key, index) => object(map, key, ...points[index]));
  }
  const classroom = room('classroom', 'Grade 5 Classroom', 'Silid ng Grade 5', 40, 28);
  classroom.spawn = {
    x: 20,
    y: 23
  };
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 6; col++) {
      object(classroom, 'desk', 5 + col * 5, 8 + row * 3, {
        number: row * 6 + col + 1
      });
      object(classroom, 'chair', 5 + col * 5, 9 + row * 3, {
        number: row * 6 + col + 1
      });
    }
  scatter(classroom, ['blackboard', 'teacher_desk', 'bookshelf', 'wall_clock', 'noticeboard',
      'evacuation_map', 'first_aid', 'water_jug', 'whistle_box', 'outlet', 'bag', 'window_latch',
      'ceiling_fan', 'curtain', 'emergency_light', 'radio', 'flagpole', 'flashlight', 'id_card',
      'water_bottle'
    ],
    [
      [18, 2],
      [19, 4],
      [3, 3],
      [26, 3],
      [31, 3],
      [35, 3],
      [3, 6],
      [36, 7],
      [3, 13],
      [36, 11],
      [3, 17],
      [36, 15],
      [11, 3],
      [36, 19],
      [3, 21],
      [36, 22],
      [3, 24],
      [10, 24],
      [29, 24],
      [35, 24]
    ]);
  npc(classroom, 'mara', 22, 4);
  npc(classroom, 'lino', 11, 22);
  door(classroom, 20, 26, 'hallway', 6, 4);

  const hallway = room('hallway', 'School Corridor', 'Pasilyo ng Paaralan', 40, 18);
  hallway.spawn = {
    x: 20,
    y: 12
  };
  patch(hallway, 1, 7, 38, 3, 'path');
  scatter(hallway, ['locker', 'locker', 'locker', 'noticeboard', 'speaker', 'evacuation_map', 'first_aid',
      'water_jug', 'trash_bin', 'bench', 'books', 'outlet', 'signboard', 'emergency_light', 'radio',
      'flashlight', 'id_card', 'window_latch'
    ],
    [
      [3, 4],
      [10, 4],
      [18, 4],
      [27, 4],
      [37, 4],
      [3, 11],
      [10, 11],
      [28, 11],
      [37, 11],
      [4, 14],
      [11, 14],
      [28, 14],
      [34, 14],
      [24, 4],
      [16, 13],
      [6, 13],
      [31, 11],
      [36, 6]
    ]);
  npc(hallway, 'jomar', 23, 11);
  door(hallway, 6, 2, 'classroom', 20, 24);
  door(hallway, 14, 2, 'library', 16, 20);
  door(hallway, 23, 2, 'clinic', 14, 18);
  door(hallway, 33, 2, 'canteen', 14, 18);
  door(hallway, 20, 15, 'grounds', 20, 5);
  door(hallway, 37, 8, 'upper', 4, 14);

  const grounds = room('grounds', 'School Grounds', 'Bakuran ng Paaralan', 40, 30, true);
  grounds.spawn = {
    x: 20,
    y: 5
  };
  patch(grounds, 18, 1, 5, 28, 'path');
  patch(grounds, 5, 9, 28, 14, 'path');
  patch(grounds, 8, 17, 20, 5, 'assembly');
  patch(grounds, 31, 18, 4, 6, 'garden');
  patch(grounds, 37, 2, 2, 26, 'water', true);
  scatter(grounds, ['flagpole', 'tree', 'tree', 'branch', 'clogged_drain', 'trash_bin', 'bench', 'bench',
      'flowerpot', 'seedling', 'evacuation_map', 'signboard', 'route_marker', 'water_jug', 'noticeboard',
      'roof_sheet', 'flashlight', 'id_card', 'bangka', 'mangrove'
    ],
    [
      [20, 12],
      [5, 5],
      [32, 6],
      [7, 7],
      [33, 13],
      [4, 14],
      [5, 21],
      [30, 21],
      [5, 25],
      [31, 25],
      [13, 5],
      [26, 5],
      [11, 15],
      [29, 10],
      [4, 10],
      [34, 9],
      [10, 25],
      [27, 25],
      [34, 25],
      [35, 19]
    ]);
  door(grounds, 20, 2, 'hallway', 20, 13);
  door(grounds, 20, 27, 'gate', 20, 4);

  const canteen = room('canteen', 'School Canteen', 'Kantina ng Paaralan', 28, 22);
  scatter(canteen, ['stove', 'food_crate', 'food_crate', 'water_jug', 'trash_bin', 'noticeboard', 'outlet',
      'window_latch', 'first_aid', 'contact_list', 'desk', 'desk', 'desk', 'chair', 'chair', 'chair', 'bag',
      'radio', 'whistle_box', 'emergency_light'
    ],
    [
      [4, 3],
      [8, 3],
      [12, 3],
      [20, 4],
      [24, 4],
      [4, 7],
      [24, 8],
      [20, 8],
      [4, 12],
      [24, 12],
      [8, 10],
      [14, 10],
      [20, 12],
      [8, 11],
      [14, 11],
      [20, 13],
      [4, 16],
      [24, 16],
      [8, 17],
      [20, 17]
    ]);
  npc(canteen, 'nena', 16, 4);
  door(canteen, 14, 20, 'hallway', 33, 4);

  const library = room('library', 'Library & Computer Room', 'Aklatan at Computer Room', 32, 24);
  scatter(library, ['bookshelf', 'bookshelf', 'bookshelf', 'bookshelf', 'books', 'books', 'computer',
      'computer', 'computer', 'desk', 'desk', 'chair', 'chair', 'noticeboard', 'evacuation_map', 'outlet',
      'wall_clock', 'first_aid', 'water_jug', 'radio', 'emergency_light', 'flashlight', 'id_card',
      'window_latch'
    ],
    [
      [4, 3],
      [10, 3],
      [20, 3],
      [26, 3],
      [4, 7],
      [26, 7],
      [5, 11],
      [11, 11],
      [23, 11],
      [8, 15],
      [21, 15],
      [8, 16],
      [21, 16],
      [15, 4],
      [15, 8],
      [28, 12],
      [15, 12],
      [4, 18],
      [27, 18],
      [12, 19],
      [23, 19],
      [7, 20],
      [26, 20],
      [28, 4]
    ]);
  door(library, 16, 22, 'hallway', 14, 4);

  const clinic = room('clinic', 'Clinic & Guidance Office', 'Klinika at Guidance Office', 28, 22);
  patch(clinic, 1, 2, 26, 19, 'floor_blue');
  scatter(clinic, ['cot', 'cot', 'cot', 'curtain', 'curtain', 'first_aid', 'medicine', 'medicine',
      'contact_list', 'water_jug', 'teacher_desk', 'noticeboard', 'evacuation_map', 'trash_bin',
      'wall_clock', 'window_latch', 'outlet', 'radio', 'emergency_light', 'id_card'
    ],
    [
      [4, 5],
      [11, 5],
      [20, 5],
      [4, 3],
      [20, 3],
      [4, 11],
      [9, 11],
      [22, 10],
      [18, 11],
      [23, 14],
      [10, 14],
      [14, 3],
      [17, 15],
      [4, 16],
      [24, 3],
      [24, 7],
      [4, 8],
      [22, 17],
      [7, 18],
      [19, 18]
    ]);
  npc(clinic, 'bea', 15, 10);
  door(clinic, 14, 20, 'hallway', 23, 4);

  const upper = room('upper', 'Upper-floor Walkway', 'Daan sa Itaas na Palapag', 36, 20, true);
  patch(upper, 1, 1, 34, 18, 'floor_blue');
  upper.spawn = {
    x: 4,
    y: 14
  };
  patch(upper, 1, 1, 34, 2, 'water', true);
  patch(upper, 1, 18, 34, 1, 'wall', true);
  scatter(upper, ['signboard', 'evacuation_map', 'route_marker', 'noticeboard', 'bench', 'bench', 'water_jug',
      'first_aid', 'radio', 'emergency_light', 'outlet', 'roof_sheet', 'cracked_panel', 'contact_list',
      'flashlight', 'id_card', 'water_bottle', 'bangka', 'mangrove'
    ],
    [
      [5, 5],
      [10, 5],
      [16, 5],
      [23, 5],
      [29, 5],
      [29, 10],
      [25, 14],
      [20, 14],
      [15, 14],
      [10, 14],
      [31, 14],
      [31, 8],
      [20, 9],
      [7, 9],
      [12, 10],
      [26, 8],
      [7, 15],
      [5, 4],
      [32, 4]
    ]);
  door(upper, 2, 14, 'hallway', 35, 8);

  const gate = room('gate', 'School Gate & Road', 'Tarangkahan at Kalsada', 40, 24, true);
  gate.spawn = {
    x: 20,
    y: 4
  };
  patch(gate, 18, 1, 5, 22, 'path');
  patch(gate, 1, 12, 38, 4, 'road', true);
  patch(gate, 18, 12, 5, 4, 'path');
  scatter(gate, ['gate', 'signboard', 'evacuation_map', 'jeepney', 'tricycle', 'electric_post',
      'electric_post', 'clogged_drain', 'trash_bin', 'bench', 'noticeboard', 'route_marker', 'tree',
      'flowerpot', 'contact_list', 'radio', 'whistle_box', 'flashlight', 'id_card', 'water_bottle'
    ],
    [
      [15, 4],
      [24, 4],
      [16, 8],
      [7, 9],
      [29, 9],
      [4, 8],
      [34, 8],
      [25, 10],
      [11, 5],
      [28, 5],
      [7, 18],
      [25, 18],
      [4, 19],
      [34, 19],
      [14, 18],
      [30, 18],
      [8, 6],
      [12, 20],
      [26, 20],
      [32, 6]
    ]);
  npc(gate, 'ben', 17, 5);
  door(gate, 20, 2, 'grounds', 20, 25);
  door(gate, 20, 21, 'center', 20, 5);

  const center = room('center', 'Barangay Evacuation Center', 'Evacuation Center ng Barangay', 40, 26, true);
  center.spawn = {
    x: 20,
    y: 5
  };
  patch(center, 3, 4, 34, 18, 'floor_blue');
  scatter(center, ['noticeboard', 'contact_list', 'route_marker', 'first_aid', 'medicine', 'water_jug', 'cot',
      'cot', 'cot', 'cot', 'food_crate', 'trash_bin', 'bench', 'bench', 'books', 'bag', 'radio',
      'emergency_light', 'whistle_box', 'id_card', 'flashlight', 'seedling', 'evacuation_map', 'signboard'
    ],
    [
      [6, 5],
      [11, 5],
      [27, 5],
      [32, 5],
      [32, 9],
      [6, 9],
      [6, 13],
      [12, 13],
      [26, 13],
      [32, 13],
      [6, 18],
      [12, 18],
      [26, 18],
      [32, 18],
      [15, 9],
      [25, 9],
      [16, 19],
      [22, 19],
      [35, 8],
      [9, 21],
      [29, 21],
      [35, 20],
      [16, 5],
      [25, 21]
    ]);
  npc(center, 'kuya', 21, 9);
  door(center, 20, 2, 'gate', 20, 19);
  // Visual flood basins are reserved outside all checked walking corridors.
  // They are environmental metadata, not story tasks or saved state.
  grounds.floodZones = [{
    id: 'low-lawn',
    x: 1,
    y: 17,
    w: 3,
    h: 9
  }, {
    id: 'canal-bank',
    x: 36,
    y: 3,
    w: 3,
    h: 24
  }];
  gate.floodZones = [{
    id: 'west-road',
    x: 1,
    y: 12,
    w: 16,
    h: 4
  }, {
    id: 'east-road',
    x: 24,
    y: 12,
    w: 15,
    h: 4
  }];
  hallway.floodZones = [{
    id: 'entrance-alcove',
    x: 1,
    y: 15,
    w: 6,
    h: 2
  }];
  canteen.floodZones = [{
    id: 'entrance-side',
    x: 1,
    y: 18,
    w: 7,
    h: 3
  }];
  grounds.coastZones = grounds.floodZones;
  gate.coastZones = gate.floodZones;
  // A closed viewing wall directly above the refuge stays in its live camera view.
  // Its aperture shows the lower grounds; it is not traversable floodwater.
  patch(upper, 14, 10, 5, 2, 'wall', true);
  upper.floodWindow = {
    x: 14,
    y: 10,
    w: 5,
    h: 2,
    viewOnly: true
  };

  const anchors = {
    classroom: [
      [18, 23],
      [18, 13],
      [18, 16],
      [18, 19],
      [35, 16]
    ],
    hallway: [
      [9, 10],
      [30, 6],
      [32, 10],
      [35, 8],
      [12, 12]
    ],
    grounds: [
      [22, 18],
      [33, 12],
      [7, 6]
    ],
    upper: [
      [16, 12]
    ],
    center: [
      [18, 12]
    ]
  };
  const decorKinds = [
    'mural', 'kid_board', 'poster', 'plant', 'rug', 'fan',
    'curtain', 'plant', 'poster', 'drawing', 'basket', 'plant',
    'drum', 'books', 'drawing', 'lantern', 'planter', 'poster'
  ];

  function inside(rect, x, y) {
    return x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h;
  }

  function prepareEnvironment(map) {
    map.floodZones = map.floodZones || [];
    map.coastZones = map.coastZones || [];
    const reserved = (x, y) => map.floodZones.some(rect => inside(rect, x, y));
    const occupied = (x, y) => map.objects.some(o => o.solid && inside(o, x, y));
    const open = (x, y) => x > 0 && y > 1 && x < map.width - 1 && y < map.height - 1 &&
      !map.blocked[y][x] && !occupied(x, y) && !reserved(x, y);
    const start = map.spawn;
    const queue = [start];
    const parents = new Map([
      [start.x + ',' + start.y, null]
    ]);
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i];
      for (const [dx, dy] of [
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0]
        ]) {
        const x = p.x + dx,
          y = p.y + dy,
          key = x + ',' + y;
        if (open(x, y) && !parents.has(key)) {
          parents.set(key, p);
          queue.push({
            x,
            y
          });
        }
      }
    }
    const dry = new Set();

    function protect(p) {
      let point = p;
      while (point) {
        const key = point.x + ',' + point.y;
        dry.add(key);
        point = parents.get(key);
      }
    }
    for (const o of map.objects) {
      const candidates = queue.filter(p => Math.abs(p.x - o.x) + Math.abs(p.y - o.y) <= 1);
      if (candidates.length) protect(candidates[0]);
      if (o.kind === 'door') {
        for (let y = o.y - 1; y <= o.y + 1; y++) {
          for (let x = o.x - 1; x <= o.x + 1; x++)
            if (!reserved(x, y)) dry.add(x + ',' + y);
        }
      }
    }
    for (const [x, y] of anchors[map.id] || []) {
      if (parents.has(x + ',' + y)) protect({
        x,
        y
      });
    }
    protect(start);
    map.dryRouteCells = [...dry].map(key => key.split(',').map(Number));
    const candidates = queue.filter(p => !dry.has(p.x + ',' + p.y) &&
      !map.objects.some(o => Math.abs(p.x - o.x) + Math.abs(p.y - o.y) < 2));
    // Wall displays stay near the north wall; floor accents use the clear perimeter.
    // These pictures never enter World.objects or alter collision.
    const layout = [
      [0.35, 0.08],
      [0.61, 0.08],
      [0.82, 0.09],
      [0.07, 0.25],
      [0.08, 0.65],
      [0.64, 0.2],
      [0.91, 0.24],
      [0.9, 0.7],
      [0.13, 0.08],
      [0.49, 0.1],
      [0.89, 0.87],
      [0.1, 0.85],
      [0.28, 0.11],
      [0.15, 0.5],
      [0.73, 0.09],
      [0.53, 0.15],
      [0.86, 0.46],
      [0.22, 0.09]
    ];
    for (let i = 0; i < 18; i++) {
      const [nx, ny] = layout[i];
      const x = Math.round(nx * map.width),
        y = Math.max(2, Math.round(ny * map.height));
      const p = candidates.filter(p => !map.decor.some(o => Math.abs(o.x - p.x) + Math.abs(o.y - p.y) < 2))
        .sort((a, b) => Math.abs(a.x - x) + Math.abs(a.y - y) * 1.5 -
          Math.abs(b.x - x) - Math.abs(b.y - y) * 1.5)[0];
      if (p) map.decor.push({
        id: map.id + '-decor-' + i,
        kind: decorKinds[i],
        x: p.x,
        y: p.y
      });
    }
    map.waterFixtures = map.floodZones.flatMap((zone, i) => {
      // A display fixture may occupy a basin's free bank, never an existing collider.
      const spots = [];
      for (let y = zone.y; y < zone.y + zone.h; y++) {
        for (let x = zone.x; x < zone.x + zone.w; x++) {
          if (!map.blocked[y][x] && !occupied(x, y)) spots.push({
            x,
            y
          });
        }
      }
      const spot = spots[Math.floor(spots.length * 0.72)];
      return spot ? [{
        id: map.id + '-water-fixture-' + i,
        art: map.outdoor ? 'flowerpot' : 'food_crate',
        x: spot.x,
        y: spot.y,
        w: 1,
        h: 1,
        solid: false
      }] : [];
    });
  }
  for (const map of Object.values(maps)) prepareEnvironment(map);
  LE.Data.maps = maps;
})();
