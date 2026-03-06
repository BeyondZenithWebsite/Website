(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startRun');
  const restartBtn = document.getElementById('restartRun');
  const statusEl = document.getElementById('runStatus');
  const statsEl = document.getElementById('runStats');

  const TILE = 16;
  const VIEW_W = canvas.width;
  const VIEW_H = canvas.height;
  const WORLD_W = 360;
  const WORLD_H = 120;

  const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, ORE = 4, WOOD = 5, LEAF = 6;
  const COLORS = {
    [AIR]: '#00000000',
    [GRASS]: '#3cb34f',
    [DIRT]: '#7d4f2c',
    [STONE]: '#6f7488',
    [ORE]: '#61a8ff',
    [WOOD]: '#8f5e34',
    [LEAF]: '#56b44f'
  };

  const rnd = (a, b) => Math.random() * (b - a) + a;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let game = null;

  function makeWorld(seed) {
    const world = Array.from({ length: WORLD_H }, () => Array(WORLD_W).fill(AIR));
    const heights = [];
    const setTile = (x, y, v) => {
      const ix = Math.floor(x), iy = Math.floor(y);
      if (ix < 0 || ix >= WORLD_W || iy < 0 || iy >= WORLD_H) return;
      world[iy][ix] = v;
    };

    let h = 58 + Math.floor(Math.sin(seed * 0.02) * 4);
    for (let x = 0; x < WORLD_W; x++) {
      h += Math.floor(rnd(-1.2, 1.2));
      h = clamp(h, 36, 74);
      heights[x] = h;

      for (let y = h; y < WORLD_H; y++) {
        if (y === h) setTile(x, y, GRASS);
        else if (y < h + 5) setTile(x, y, DIRT);
        else setTile(x, y, Math.random() > 0.93 ? ORE : STONE);
      }

      if (x % 17 === 0 && Math.random() > 0.55 && h > 38 && h < 70) {
        for (let t = 1; t <= 4; t++) setTile(x, h - t, WOOD);
        for (let lx = -2; lx <= 2; lx++) {
          for (let ly = -6; ly <= -3; ly++) {
            if (Math.abs(lx) + Math.abs(ly + 4) < 5) {
              const tx = x + lx, ty = h + ly;
              if (tx > 1 && tx < WORLD_W - 1 && ty > 2) setTile(tx, ty, LEAF);
            }
          }
        }
      }
    }

    for (let i = 0; i < 110; i++) {
      let cx = Math.floor(rnd(5, WORLD_W - 5));
      let cy = Math.floor(rnd(45, WORLD_H - 10));
      const r = Math.floor(rnd(2, 6));
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          const dx = cx + x, dy = cy + y;
          const ix = Math.floor(dx), iy = Math.floor(dy);
          if (ix > 1 && ix < WORLD_W - 1 && iy > 1 && iy < WORLD_H - 1) {
            if (x * x + y * y <= r * r * rnd(0.6, 1.2)) setTile(ix, iy, AIR);
          }
        }
      }
    }

    return { world, heights };
  }

  function solidAt(wx, wy) {
    if (!game) return false;
    if (wx < 0 || wx >= WORLD_W || wy < 0 || wy >= WORLD_H) return true;
    const t = game.world[wy][wx];
    return t !== AIR && t !== LEAF;
  }

  function collides(px, py, pw, ph) {
    const x0 = Math.floor(px / TILE), x1 = Math.floor((px + pw - 1) / TILE);
    const y0 = Math.floor(py / TILE), y1 = Math.floor((py + ph - 1) / TILE);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (solidAt(x, y)) return true;
    return false;
  }

  function resetWorld() {
    const seed = Math.floor(Math.random() * 999999);
    const { world, heights } = makeWorld(seed);
    const sx = Math.floor(WORLD_W / 2);
    const sy = (heights[sx] - 4) * TILE;
    const startX = sx * TILE;
    game = {
      seed,
      world,
      cameraX: clamp(startX - VIEW_W / 2, 0, WORLD_W * TILE - VIEW_W),
      keys: {},
      inv: { dirt: 0, stone: 0, ore: 0, wood: 0 },
      player: { x: startX, y: sy, w: 12, h: 24, vx: 0, vy: 0, speed: 150, jump: 330, onGround: false }
    };
    statusEl.textContent = 'World active';
    restartBtn.hidden = false;
  }

  function mineAt(mx, my) {
    if (!game) return;
    const wx = Math.floor((mx + game.cameraX) / TILE);
    const wy = Math.floor(my / TILE);
    const p = game.player;
    const px = (p.x + p.w / 2) / TILE, py = (p.y + p.h / 2) / TILE;
    if (Math.hypot(wx - px, wy - py) > 6) return;
    if (wx < 0 || wx >= WORLD_W || wy < 0 || wy >= WORLD_H) return;
    const t = game.world[wy][wx];
    if (t === AIR || t === GRASS) return;
    if (t === DIRT) game.inv.dirt++;
    if (t === STONE) game.inv.stone++;
    if (t === ORE) game.inv.ore++;
    if (t === WOOD) game.inv.wood++;
    game.world[wy][wx] = AIR;
  }

  function placeAt(mx, my) {
    if (!game || game.inv.dirt <= 0) return;
    const wx = Math.floor((mx + game.cameraX) / TILE);
    const wy = Math.floor(my / TILE);
    const p = game.player;
    const px = (p.x + p.w / 2) / TILE, py = (p.y + p.h / 2) / TILE;
    if (Math.hypot(wx - px, wy - py) > 6) return;
    if (wx < 0 || wx >= WORLD_W || wy < 0 || wy >= WORLD_H) return;
    if (game.world[wy][wx] !== AIR) return;
    const bx = wx * TILE, by = wy * TILE;
    if (bx < p.x + p.w && bx + TILE > p.x && by < p.y + p.h && by + TILE > p.y) return;
    game.world[wy][wx] = DIRT;
    game.inv.dirt--;
  }

  function update(dt) {
    if (!game) return;
    const p = game.player;
    const left = game.keys['a'] || game.keys['arrowleft'];
    const right = game.keys['d'] || game.keys['arrowright'];
    const jump = game.keys['w'] || game.keys['arrowup'] || game.keys[' '];

    p.vx = (left ? -1 : 0) + (right ? 1 : 0);
    p.vx *= p.speed;

    if (jump && p.onGround) {
      p.vy = -p.jump;
      p.onGround = false;
    }

    p.vy += 760 * dt;

    let nx = p.x + p.vx * dt;
    if (!collides(nx, p.y, p.w, p.h)) p.x = nx;
    else {
      while (!collides(p.x + Math.sign(p.vx), p.y, p.w, p.h)) p.x += Math.sign(p.vx);
      p.vx = 0;
    }

    let ny = p.y + p.vy * dt;
    if (!collides(p.x, ny, p.w, p.h)) {
      p.y = ny;
      p.onGround = false;
    } else {
      const dir = Math.sign(p.vy);
      while (!collides(p.x, p.y + dir, p.w, p.h)) p.y += dir;
      p.onGround = p.vy > 0;
      p.vy = 0;
    }

    game.cameraX = clamp(p.x - VIEW_W / 2, 0, WORLD_W * TILE - VIEW_W);
    statsEl.textContent = `Seed ${game.seed} · x:${Math.floor(p.x / TILE)} y:${Math.floor(p.y / TILE)} · Dirt ${game.inv.dirt} Stone ${game.inv.stone} Ore ${game.inv.ore} Wood ${game.inv.wood}`;
  }

  function render() {
    ctx.fillStyle = '#6fc7ff';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    if (!game) {
      ctx.fillStyle = '#0b2038';
      ctx.font = '20px monospace';
      ctx.fillText('Start World to generate procedural terrain', 180, 260);
      return;
    }

    const x0 = Math.floor(game.cameraX / TILE);
    const x1 = Math.ceil((game.cameraX + VIEW_W) / TILE);

    for (let y = 0; y < WORLD_H; y++) {
      for (let x = x0; x <= x1; x++) {
        if (x < 0 || x >= WORLD_W) continue;
        const t = game.world[y][x];
        if (t === AIR) continue;
        ctx.fillStyle = COLORS[t];
        ctx.fillRect(x * TILE - game.cameraX, y * TILE, TILE, TILE);
        ctx.fillStyle = '#00000022';
        ctx.fillRect(x * TILE - game.cameraX, y * TILE, TILE, 1);
      }
    }

    const p = game.player;
    const px = p.x - game.cameraX;
    ctx.strokeStyle = '#0a1022';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - 1, p.y - 1, p.w + 2, p.h + 2);
    ctx.fillStyle = '#2f5bff';
    ctx.fillRect(px, p.y, p.w, p.h);
    ctx.fillStyle = '#ffe2bd';
    ctx.fillRect(px + 2, p.y + 2, p.w - 4, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px + 4, p.y + 5, 1, 1);
    ctx.fillRect(px + 7, p.y + 5, 1, 1);

    // spawn marker to make character instantly findable
    ctx.fillStyle = '#ffffffcc';
    ctx.beginPath();
    ctx.moveTo(px + p.w / 2, p.y - 12);
    ctx.lineTo(px + p.w / 2 - 5, p.y - 4);
    ctx.lineTo(px + p.w / 2 + 5, p.y - 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1118';
    ctx.fillRect(12, 12, 190, 44);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText('Zenith Sidecraft', 20, 30);
    ctx.fillText('Mine: LMB  Place Dirt: RMB', 20, 46);
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', () => { resetWorld(); });
  restartBtn.addEventListener('click', () => { resetWorld(); });

  window.addEventListener('keydown', e => { if (game) game.keys[e.key.toLowerCase()] = true; });
  window.addEventListener('keyup', e => { if (game) game.keys[e.key.toLowerCase()] = false; });

  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (e.button === 0) mineAt(mx, my);
    if (e.button === 2) placeAt(mx, my);
  });

  requestAnimationFrame(loop);
})();
