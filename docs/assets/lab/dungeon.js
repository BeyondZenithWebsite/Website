(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startRun');
  const restartBtn = document.getElementById('restartRun');
  const statusEl = document.getElementById('runStatus');
  const statsEl = document.getElementById('runStats');
  const overlay = document.getElementById('upgradeOverlay');
  const upgradesEl = document.getElementById('upgradeChoices');

  const W = canvas.width, H = canvas.height;
  const rand = (a, b) => Math.random() * (b - a) + a;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let game;

  const upgradePool = [
    { id: 'dmg', n: '+20% Damage', apply: g => g.player.weapon.damage *= 1.2 },
    { id: 'spd', n: '+18% Attack Speed', apply: g => g.player.weapon.fireRate *= 1.18 },
    { id: 'proj', n: '+1 Projectile', apply: g => g.player.weapon.projectiles += 1 },
    { id: 'move', n: '+15% Move Speed', apply: g => g.player.speed *= 1.15 },
    { id: 'pierce', n: '+1 Pierce', apply: g => g.player.weapon.pierce += 1 },
    { id: 'lifesteal', n: 'Lifesteal +2%', apply: g => g.player.weapon.lifesteal += 0.02 },
    { id: 'orbit', n: 'Orbit Blade', apply: g => g.player.orbit = true },
    { id: 'explode', n: 'Explosion Rounds', apply: g => g.player.weapon.effects.explosion = true },
    { id: 'chain', n: 'Chain Lightning', apply: g => g.player.weapon.effects.chain = true },
    { id: 'poison', n: 'Poison Rounds', apply: g => g.player.weapon.effects.poison = true },
    { id: 'range', n: '+20% Range', apply: g => g.player.weapon.range *= 1.2 }
  ];

  function genDungeon() {
    const rooms = [];
    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const rw = rand(70, 180), rh = rand(60, 150);
      rooms.push({ x: rand(20, W - rw - 20), y: rand(20, H - rh - 20), w: rw, h: rh });
    }
    rooms.sort((a, b) => a.x - b.x);
    const corridors = [];
    for (let i = 1; i < rooms.length; i++) {
      const a = rooms[i - 1], b = rooms[i];
      const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
      const bx = b.x + b.w / 2, by = b.y + b.h / 2;
      corridors.push({ x: Math.min(ax, bx), y: ay - 8, w: Math.abs(ax - bx), h: 16 });
      corridors.push({ x: bx - 8, y: Math.min(ay, by), w: 16, h: Math.abs(ay - by) });
    }
    const spawns = rooms.map(r => ({ x: r.x + rand(10, r.w - 10), y: r.y + rand(10, r.h - 10) }));
    return { rooms, corridors, spawns };
  }

  function newWeapon() {
    const base = {
      damage: rand(9, 15), fireRate: rand(1.9, 2.8), range: rand(180, 250),
      speed: rand(260, 360), projectiles: 1, pierce: 0, lifesteal: 0,
      effects: { poison: false, chain: false, explosion: false, knockback: Math.random() > .65 }
    };
    const spice = pick(['poison', 'chain', 'explosion', 'none']);
    if (spice !== 'none') base.effects[spice] = true;
    return base;
  }

  function spawnEnemy(stage, spawns) {
    const archetype = pick(['chaser', 'zigzag', 'dasher']);
    const p = pick(spawns);
    const hp = rand(24, 48) * (1 + stage * 0.22);
    const speed = rand(28, 58) * (1 + stage * 0.08);
    return {
      x: p.x, y: p.y, hp, maxHp: hp, speed, r: rand(7, 12), a: archetype,
      dashCd: rand(2, 5), t: rand(0, Math.PI * 2), poison: 0,
      special: Math.random() > .82 ? 'splitter' : 'none'
    };
  }

  function initRun() {
    const dungeon = genDungeon();
    game = {
      mode: 'running',
      stage: 1,
      stageTime: 0,
      kills: 0,
      xp: 0,
      xpNeed: 25,
      elapsed: 0,
      dungeon,
      keys: {},
      player: {
        x: W / 2, y: H / 2, r: 9, hp: 100, maxHp: 100, speed: 130,
        weapon: newWeapon(),
        shootCd: 0,
        invuln: 0,
        orbit: false
      },
      bullets: [],
      enemies: [],
      particles: [],
      spawnClock: 0,
      spawnRate: 1.2,
      orbitAngle: 0
    };

    for (let i = 0; i < 8; i++) game.enemies.push(spawnEnemy(game.stage, dungeon.spawns));
    statusEl.textContent = 'Run active';
    restartBtn.hidden = true;
    overlay.classList.remove('show');
  }

  function damageEnemy(e, d, g) {
    e.hp -= d;
    if (e.hp <= 0) {
      g.kills++;
      g.xp += 6;
      if (e.special === 'splitter') {
        for (let i = 0; i < 2; i++) {
          g.enemies.push({ ...spawnEnemy(g.stage, g.dungeon.spawns), x: e.x + rand(-10,10), y: e.y + rand(-10,10), r: 6, hp: 15 + g.stage * 4, maxHp: 15 + g.stage * 4 });
        }
      }
      g.particles.push({ x: e.x, y: e.y, t: .4 });
      return true;
    }
    return false;
  }

  function doUpgrade(g) {
    g.mode = 'upgrade';
    overlay.classList.add('show');
    upgradesEl.innerHTML = '';
    const options = [...upgradePool].sort(() => Math.random() - .5).slice(0, 3);
    options.forEach(op => {
      const b = document.createElement('button');
      b.className = 'upgrade-btn';
      b.innerHTML = `<strong>${op.n}</strong><div class="small">Unique build modifier</div>`;
      b.onclick = () => {
        op.apply(g);
        g.mode = 'running';
        overlay.classList.remove('show');
      };
      upgradesEl.appendChild(b);
    });
  }

  function update(dt) {
    if (!game || game.mode === 'dead' || game.mode === 'upgrade') return;
    const g = game, p = g.player;
    g.elapsed += dt;
    g.stageTime += dt;

    const mvx = (g.keys['ArrowRight'] || g.keys['d'] ? 1 : 0) - (g.keys['ArrowLeft'] || g.keys['a'] ? 1 : 0);
    const mvy = (g.keys['ArrowDown'] || g.keys['s'] ? 1 : 0) - (g.keys['ArrowUp'] || g.keys['w'] ? 1 : 0);
    const len = Math.hypot(mvx, mvy) || 1;
    p.x = clamp(p.x + (mvx / len) * p.speed * dt, 10, W - 10);
    p.y = clamp(p.y + (mvy / len) * p.speed * dt, 10, H - 10);

    p.shootCd -= dt;
    if (p.shootCd <= 0) {
      const nearest = g.enemies.reduce((best, e) => {
        const d = (e.x - p.x) ** 2 + (e.y - p.y) ** 2;
        return !best || d < best.d ? { e, d } : best;
      }, null);
      if (nearest) {
        for (let i = 0; i < p.weapon.projectiles; i++) {
          const a = Math.atan2(nearest.e.y - p.y, nearest.e.x - p.x) + rand(-0.18, 0.18);
          g.bullets.push({
            x: p.x, y: p.y,
            vx: Math.cos(a) * p.weapon.speed,
            vy: Math.sin(a) * p.weapon.speed,
            life: p.weapon.range / p.weapon.speed,
            d: p.weapon.damage,
            pierce: p.weapon.pierce,
            eff: { ...p.weapon.effects }
          });
        }
      }
      p.shootCd = 1 / p.weapon.fireRate;
    }

    g.spawnClock -= dt;
    if (g.spawnClock <= 0) {
      g.enemies.push(spawnEnemy(g.stage, g.dungeon.spawns));
      g.spawnClock = Math.max(0.22, g.spawnRate - g.elapsed * 0.01);
    }

    g.enemies.forEach(e => {
      if (e.poison > 0) {
        e.poison -= dt;
        e.hp -= 5 * dt;
      }
      e.t += dt;
      let tx = p.x, ty = p.y;
      if (e.a === 'zigzag') {
        tx += Math.cos(e.t * 5) * 35;
        ty += Math.sin(e.t * 5) * 35;
      }
      if (e.a === 'dasher') {
        e.dashCd -= dt;
        if (e.dashCd <= 0) {
          e.speed *= 1.8;
          e.dashCd = rand(2, 4);
          setTimeout(() => (e.speed /= 1.8), 220);
        }
      }
      const a = Math.atan2(ty - e.y, tx - e.x);
      e.x += Math.cos(a) * e.speed * dt;
      e.y += Math.sin(a) * e.speed * dt;

      if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r && p.invuln <= 0) {
        p.hp -= 8;
        p.invuln = .5;
      }
    });

    p.invuln -= dt;

    g.bullets.forEach(b => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      g.enemies.forEach(e => {
        if (b.life <= 0) return;
        if (Math.hypot(e.x - b.x, e.y - b.y) < e.r + 3) {
          if (b.eff.poison) e.poison = Math.max(e.poison, 2.2);
          if (b.eff.chain) {
            const target = g.enemies.find(o => o !== e && Math.hypot(o.x - e.x, o.y - e.y) < 80);
            if (target) damageEnemy(target, b.d * .55, g);
          }
          if (b.eff.explosion) {
            g.enemies.forEach(o => {
              if (Math.hypot(o.x - e.x, o.y - e.y) < 42) damageEnemy(o, b.d * .5, g);
            });
          }
          if (b.eff.knockback) {
            const a = Math.atan2(e.y - b.y, e.x - b.x);
            e.x += Math.cos(a) * 8;
            e.y += Math.sin(a) * 8;
          }
          const died = damageEnemy(e, b.d, g);
          if (died && g.player.weapon.lifesteal > 0) {
            p.hp = Math.min(p.maxHp, p.hp + p.maxHp * g.player.weapon.lifesteal);
          }
          if (b.pierce > 0) b.pierce--; else b.life = 0;
        }
      });
    });

    g.enemies = g.enemies.filter(e => e.hp > 0 && e.x > -30 && e.x < W + 30 && e.y > -30 && e.y < H + 30);
    g.bullets = g.bullets.filter(b => b.life > 0);
    g.particles.forEach(pt => pt.t -= dt);
    g.particles = g.particles.filter(pt => pt.t > 0);

    if (p.orbit) {
      g.orbitAngle += dt * 2.3;
      const ox = p.x + Math.cos(g.orbitAngle) * 36;
      const oy = p.y + Math.sin(g.orbitAngle) * 36;
      g.enemies.forEach(e => {
        if (Math.hypot(e.x - ox, e.y - oy) < e.r + 6) damageEnemy(e, 22 * dt, g);
      });
    }

    if (g.xp >= g.xpNeed) {
      g.xp = 0;
      g.xpNeed = Math.floor(g.xpNeed * 1.25);
      doUpgrade(g);
    }

    if (g.stageTime > 35) {
      g.stage += 1;
      g.stageTime = 0;
      g.spawnRate = Math.max(0.32, g.spawnRate * .9);
      for (let i = 0; i < 3 + g.stage; i++) g.enemies.push(spawnEnemy(g.stage, g.dungeon.spawns));
    }

    if (p.hp <= 0) {
      g.mode = 'dead';
      statusEl.textContent = 'Run over';
      restartBtn.hidden = false;
    }
  }

  function drawDungeon(d) {
    ctx.fillStyle = '#0c101a';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#1b2540';
    d.rooms.forEach(r => {
      ctx.fillStyle = '#121a30';
      ctx.fillRect(r.x, r.y, r.w, r.h);
      ctx.strokeRect(r.x, r.y, r.w, r.h);
    });
    ctx.fillStyle = '#182342';
    d.corridors.forEach(c => ctx.fillRect(c.x, c.y, c.w, c.h));
  }

  function render() {
    if (!game) {
      ctx.fillStyle = '#0c101a';
      ctx.fillRect(0, 0, W, H);
      return;
    }
    const g = game, p = g.player;
    drawDungeon(g.dungeon);

    g.particles.forEach(pt => {
      ctx.fillStyle = `rgba(121, 176, 255, ${pt.t * 1.8})`;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 10 * (1 - pt.t), 0, Math.PI * 2); ctx.fill();
    });

    ctx.fillStyle = '#8cc1ff';
    g.bullets.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, 2.4, 0, Math.PI * 2); ctx.fill(); });

    g.enemies.forEach(e => {
      const hue = e.a === 'dasher' ? '#ff8c8c' : e.a === 'zigzag' ? '#f5b876' : '#d97cff';
      ctx.fillStyle = e.poison > 0 ? '#6be891' : hue;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0008';
      ctx.fillRect(e.x - e.r, e.y - e.r - 7, e.r * 2, 3);
      ctx.fillStyle = '#78ffcf';
      ctx.fillRect(e.x - e.r, e.y - e.r - 7, (e.hp / e.maxHp) * e.r * 2, 3);
    });

    ctx.fillStyle = p.invuln > 0 ? '#9ad0ff' : '#d7e2ff';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();

    if (p.orbit) {
      const ox = p.x + Math.cos(g.orbitAngle) * 36;
      const oy = p.y + Math.sin(g.orbitAngle) * 36;
      ctx.fillStyle = '#ffd66b';
      ctx.beginPath(); ctx.arc(ox, oy, 6, 0, Math.PI * 2); ctx.fill();
    }

    const hp = Math.max(0, p.hp);
    ctx.fillStyle = '#0b1224'; ctx.fillRect(16, 12, 220, 12);
    ctx.fillStyle = '#6fd2ff'; ctx.fillRect(16, 12, (hp / p.maxHp) * 220, 12);
    ctx.strokeStyle = '#2f3a62'; ctx.strokeRect(16, 12, 220, 12);

    statsEl.textContent = `Stage ${g.stage} · Kills ${g.kills} · Time ${Math.floor(g.elapsed)}s · HP ${Math.ceil(hp)} · Weapon ${Math.round(p.weapon.damage)} dmg @ ${p.weapon.fireRate.toFixed(1)}/s`;
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(.033, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  startBtn.addEventListener('click', () => {
    initRun();
    statusEl.textContent = 'Run active';
  });

  restartBtn.addEventListener('click', () => {
    initRun();
  });

  window.addEventListener('keydown', e => { if (game) game.keys[e.key.toLowerCase()] = true; });
  window.addEventListener('keyup', e => { if (game) game.keys[e.key.toLowerCase()] = false; });

  requestAnimationFrame(loop);
})();
