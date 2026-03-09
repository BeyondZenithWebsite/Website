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
    const projectiles = [];

    const tick = () => {
      requestAnimationFrame(tick);
      const dt = Math.min(0.035, clock.getDelta());
      const now = performance.now();
      if (paused) return engine.render(now);

      player.update(keys, dt);
      const pos = player.inVehicle ? player.inVehicle.mesh.position : player.mesh.position;
      const facing = player.inVehicle ? player.inVehicle.mesh.rotation.y : player.mesh.rotation.y;

      vehicles.update(keys, dt);
      npcs.update(dt, now);
      police.update(dt, now);
      missions.update(dt, now);

      // projectile simulation + impacts
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const pr = projectiles[i];
        pr.ttl -= dt;
        pr.mesh.position.addScaledVector(pr.vel, dt);

        let hit = false;

        for (const n of npcs.npcs) {
          if (!n.alive) continue;
          if (n.mesh.position.distanceTo(pr.mesh.position) < 2.2) {
            n.alive = false;
            n.mesh.visible = false;
            player.addCash(25);
            player.increaseWanted(1);
            hit = true;
            const decal = new THREE.Mesh(
              new THREE.CircleGeometry(0.7, 10),
              new THREE.MeshBasicMaterial({ color: 0x2b0f12, transparent: true, opacity: 0.65 })
            );
            decal.rotation.x = -Math.PI / 2;
            decal.position.set(pr.mesh.position.x, 0.07, pr.mesh.position.z);
            engine.scene.add(decal);
            setTimeout(() => engine.scene.remove(decal), 5000);
            break;
          }
        }

        if (!hit) {
          for (const c of police.cops) {
            if (c.mesh.position.distanceTo(pr.mesh.position) < 2.8) {
              c.vel.multiplyScalar(0.3);
              c.mesh.material.emissive.setHex(0x5c0f0f);
              hit = true;
              player.increaseWanted(1);
              break;
            }
          }
        }

        if (pr.ttl <= 0 || hit) {
          engine.scene.remove(pr.mesh);
          projectiles.splice(i, 1);
          if (hit) {
            const spark = new THREE.Mesh(
              new THREE.SphereGeometry(0.5, 8, 8),
              new THREE.MeshBasicMaterial({ color: 0xffcc80, transparent: true, opacity: 0.8 })
            );
            spark.position.copy(pr.mesh.position);
            engine.scene.add(spark);
            fxBursts.push({ mesh: spark, ttl: 0.14 });
          }
        }
      }

      const impactPos = player.inVehicle ? player.inVehicle.mesh.position : null;
      if (impactPos) {
        for (const p of world.props) {
          if (!p.alive) continue;
          const d = p.mesh.position.distanceTo(impactPos);
          if (d < 3.8 && player.inVehicle.vel.length() > 10) {
            p.hp -= dt * 14;
            if (p.hp <= 0) {
              p.alive = false;
              p.mesh.visible = false;
              player.addCash(20);
              const boom = new THREE.Mesh(
                new THREE.SphereGeometry(1.2, 10, 10),
                new THREE.MeshBasicMaterial({ color: 0xffb05d, transparent: true, opacity: 0.85 })
              );
              boom.position.copy(p.mesh.position).setY(1.2);
              engine.scene.add(boom);
              fxBursts.push({ mesh: boom, ttl: 0.28 });

              // chain reaction
              for (const q of world.props) {
                if (!q.alive || q === p) continue;
                if (q.mesh.position.distanceTo(p.mesh.position) < 6.5 && Math.random() < 0.45) {
                  q.hp -= 1.4;
                }
              }
            }
          }
        }
      }

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
      engine.render(now);
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

        const facingNow = player.inVehicle ? player.inVehicle.mesh.rotation.y : player.mesh.rotation.y;
        const muzzle = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffb766, transparent: true, opacity: 0.95 })
        );
        muzzle.position.set(atkPos.x + Math.sin(facingNow) * 2.2, 2.2, atkPos.z + Math.cos(facingNow) * 2.2);
        engine.scene.add(muzzle);
        fxBursts.push({ mesh: muzzle, ttl: 0.08 });

        const bullet = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xfff2cf })
        );
        bullet.position.copy(muzzle.position);
        engine.scene.add(bullet);
        const dir = new THREE.Vector3(Math.sin(facingNow), 0, Math.cos(facingNow)).normalize();
        projectiles.push({ mesh: bullet, vel: dir.multiplyScalar(95), ttl: 0.9 });

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
