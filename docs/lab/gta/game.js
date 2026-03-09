import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { RendererEngine } from './engine/renderer.js';
import { WorldGenerator } from './engine/world-generator.js';
import { PlayerSystem } from './systems/player-system.js';
import { VehicleSystem } from './systems/vehicle-system.js';
import { NPCSystem } from './systems/npc-system.js';
import { PoliceSystem } from './systems/police-system.js';
import { MissionSystem } from './systems/mission-system.js';
import { HUD } from './ui/hud.js';

const cfg = {
  width: 1180,
  height: 680,
  worldSize: 560,
  block: 28,
  roadW: 10
};

const keys = {};
let paused = false;
let devMode = false;
let devPanel = null;

function clampInside(v, max) {
  v.x = Math.max(-max, Math.min(max, v.x));
  v.z = Math.max(-max, Math.min(max, v.z));
}

function boot() {
  const mount = document.getElementById('gtaGame');
  const playBtn = document.getElementById('playBtn');
  if (!mount || !playBtn) return;

  playBtn.addEventListener('click', () => {
    if (window.__bzGta3d) return;
    window.__bzGta3d = true;
    playBtn.remove();

    const engine = new RendererEngine(mount, cfg);
    const world = new WorldGenerator(engine.scene, cfg);
    world.build();

    const player = new PlayerSystem(engine.scene);
    player.create(world.randomSpawn());

    const vehicles = new VehicleSystem(engine.scene, player, world);
    vehicles.create();

    const npcs = new NPCSystem(engine.scene, player, world);
    npcs.create();

    const police = new PoliceSystem(engine.scene, player, world);
    const missions = new MissionSystem(engine.scene, player, world);
    missions.newMission();

    const hud = new HUD(player, missions);

    const clock = new THREE.Clock();
    let lastWantedDecay = 0;
    let lastChaos = 0;

    const fxBursts = [];

    const tick = () => {
      requestAnimationFrame(tick);
      const dt = Math.min(0.035, clock.getDelta());
      const now = performance.now();
      if (paused) return engine.render();

      player.update(keys, dt);
      const pos = player.inVehicle ? player.inVehicle.mesh.position : player.mesh.position;

      vehicles.update(keys, dt);
      npcs.update(dt, now);
      police.update(dt, now);
      missions.update(dt, now);

      if (now - lastWantedDecay > 18000) {
        lastWantedDecay = now;
        player.decayWanted();
      }

      if (now - lastChaos > 13000) {
        lastChaos = now;
        const roll = Math.floor(Math.random() * 3);
        if (roll === 0) npcs.chaosFight();
        if (roll === 1) police.triggerRaid(pos);
        if (roll === 2) vehicles.spawnVehicle(pos.x + (Math.random() - 0.5) * 25, pos.z + (Math.random() - 0.5) * 25, false);
      }

      for (let i = fxBursts.length - 1; i >= 0; i--) {
        const fx = fxBursts[i];
        fx.ttl -= dt;
        fx.mesh.scale.addScalar(dt * 6);
        fx.mesh.material.opacity = Math.max(0, fx.ttl * 5);
        if (fx.ttl <= 0) {
          engine.scene.remove(fx.mesh);
          fxBursts.splice(i, 1);
        }
      }

      clampInside(pos, cfg.worldSize / 2 - 8);
      if (player.health <= 0) {
        player.health = 100;
        player.wanted = 0;
        const s = world.randomSpawn();
        if (player.inVehicle) player.inVehicle = null;
        player.mesh.position.set(s.x, 2.2, s.z);
      }

      engine.follow(player.inVehicle ? player.inVehicle.mesh : player.mesh);
      hud.render();
      engine.render();
    };

    function toggleDevPanel(on) {
      if (!on) return devPanel?.remove();
      if (devPanel) return;
      devPanel = document.createElement('div');
      devPanel.className = 'dev-panel';
      devPanel.innerHTML = `
        <button data-act="vehicle">Spawn Vehicle</button>
        <button data-act="police">Spawn Police</button>
        <button data-act="chaos">Trigger Chaos</button>
        <button data-act="teleport">Teleport Player</button>
      `;
      devPanel.addEventListener('click', (e) => {
        const act = e.target.dataset.act;
        const p = player.inVehicle ? player.inVehicle.mesh.position : player.mesh.position;
        if (act === 'vehicle') vehicles.spawnVehicle(p.x + 10, p.z + 6, false);
        if (act === 'police') police.spawnNear(p);
        if (act === 'chaos') npcs.chaosFight();
        if (act === 'teleport') {
          const s = world.randomSpawn();
          (player.inVehicle ? player.inVehicle.mesh.position : player.mesh.position).set(s.x, player.inVehicle ? 0 : 2.2, s.z);
        }
      });
      document.querySelector('.game-wrap')?.appendChild(devPanel);
    }

    window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
      if (e.code === 'KeyE') vehicles.tryEnterOrExit(player.mesh.position);
      if (e.code === 'Space') {
        const atkPos = player.inVehicle ? player.inVehicle.mesh.position : player.mesh.position;
        const hit = npcs.attackNearby(atkPos);
        if (hit) {
          const flash = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 8, 8),
            new THREE.MeshBasicMaterial({ color: 0xff7c67, transparent: true, opacity: 0.9 })
          );
          flash.position.set(atkPos.x, 2.5, atkPos.z);
          engine.scene.add(flash);
          fxBursts.push({ mesh: flash, ttl: 0.18 });
        }
      }
      if (e.code === 'Escape') {
        paused = !paused;
        document.getElementById('pauseOverlay')?.classList.toggle('hidden', !paused);
      }
      if (e.ctrlKey && e.altKey && e.code === 'KeyZ') {
        devMode = !devMode;
        toggleDevPanel(devMode);
      }
    });

    window.addEventListener('keyup', (e) => { keys[e.code] = false; });

    tick();
  });
}

boot();
