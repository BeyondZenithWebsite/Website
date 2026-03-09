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
  worldWidth: 2600,
  worldHeight: 2600,
  blockSize: 130,
  roadWidth: 30,
  playerSpeed: 160,
  playerSprintSpeed: 245
};

class SandboxScene extends Phaser.Scene {
  constructor() {
    super('sandbox');
    this.paused = false;
    this.lastChaosEvent = 0;
  }

  create() {
    this.worldGen = new WorldGenerator(this, cfg);
    this.worldGen.build();

    const spawn = this.worldGen.randomRoadPoint();

    this.player = new PlayerSystem(this, cfg);
    this.player.create(spawn);

    this.vehicles = new VehicleSystem(this, this.player, this.worldGen);
    this.vehicles.create();

    this.npcs = new NPCSystem(this, this.player, this.worldGen);
    this.npcs.create();

    this.police = new PoliceSystem(this, this.player, this.worldGen);
    this.police.create();

    this.missions = new MissionSystem(this, this.player, this.worldGen);
    this.missions.create();

    this.hud = new HUD(this.player, this.missions, cfg);

    this.physics.add.overlap(this.player.sprite, this.police.cops, () => {
      this.player.health -= 0.3 + this.player.wanted * 0.1;
    });

    this.physics.add.collider(this.vehicles.vehicles, this.vehicles.vehicles, (a, b) => {
      const impact = Phaser.Math.Distance.Between(a.body.velocity.x, a.body.velocity.y, b.body.velocity.x, b.body.velocity.y);
      if (impact > 120 && Math.random() < 0.45) {
        this.player.increaseWanted(1);
        this.player.health = Math.max(0, this.player.health - 2);
      }
      if (impact > 170) {
        const spark = this.add.circle((a.x + b.x) / 2, (a.y + b.y) / 2, 5, 0xffb463, 0.9).setDepth(25);
        this.tweens.add({ targets: spark, alpha: 0, scale: 4.5, duration: 300, onComplete: () => spark.destroy() });
        this.cameras.main.shake(80, 0.0045);
      }
    });

    this.input.keyboard.on('keydown-E', () => this.vehicles.tryEnterOrExit());
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.paused) return;
      const hit = this.npcs.attackNearby();
      if (hit) this.player.health = Math.max(this.player.health - 1, 0);
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.paused = !this.paused;
      document.getElementById('pauseOverlay')?.classList.toggle('hidden', !this.paused);
    });

    this.setupDevMode();

    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.42);
    this.cameras.main.setRotation(-0.02);
    this.cameras.main.setBounds(0, 0, cfg.worldWidth, cfg.worldHeight);

    this.vignette = this.add.rectangle(cfg.worldWidth / 2, cfg.worldHeight / 2, cfg.worldWidth, cfg.worldHeight, 0x03070f, 0.12)
      .setDepth(40)
      .setScrollFactor(1);

    this.neonSweep = this.add.rectangle(cfg.worldWidth * 0.2, cfg.worldHeight * 0.15, 420, 120, 0x4fd0ff, 0.05)
      .setDepth(39)
      .setScrollFactor(1)
      .setRotation(-0.4);
    this.tweens.add({ targets: this.neonSweep, x: cfg.worldWidth * 0.85, y: cfg.worldHeight * 0.75, alpha: 0.02, duration: 7000, yoyo: true, repeat: -1 });

    this.time.addEvent({
      delay: 14000,
      loop: true,
      callback: () => {
        if (Math.random() < 0.45) this.triggerRandomChaos();
      }
    });

    this.time.addEvent({ delay: 18000, loop: true, callback: () => this.player.decayWanted() });
  }

  setupDevMode() {
    this.devMode = false;
    this.input.keyboard.on('keydown', (ev) => {
      if (ev.ctrlKey && ev.altKey && ev.code === 'KeyZ') {
        this.devMode = !this.devMode;
        this.toggleDevPanel(this.devMode);
      }
    });
  }

  toggleDevPanel(enabled) {
    let panel = document.getElementById('devPanel');
    if (!enabled) {
      panel?.remove();
      return;
    }

    if (panel) return;
    panel = document.createElement('div');
    panel.id = 'devPanel';
    panel.className = 'dev-panel';
    panel.innerHTML = `
      <button data-act="vehicle">Spawn Vehicle</button>
      <button data-act="police">Spawn Police</button>
      <button data-act="chaos">Trigger Chaos</button>
      <button data-act="teleport">Teleport Player</button>
    `;

    panel.addEventListener('click', (e) => {
      const act = e.target.dataset.act;
      const target = this.player.inVehicle || this.player.sprite;
      if (act === 'vehicle') this.vehicles.spawnVehicle(target.x + 30, target.y + 30);
      if (act === 'police') this.police.spawnNear(target.x, target.y);
      if (act === 'chaos') this.triggerRandomChaos(true);
      if (act === 'teleport') {
        const p = this.worldGen.randomRoadPoint();
        target.setPosition(p.x, p.y);
      }
    });

    document.querySelector('.game-wrap')?.appendChild(panel);
  }

  triggerRandomChaos(force = false) {
    const now = this.time.now;
    if (!force && now < this.lastChaosEvent + 5000) return;
    this.lastChaosEvent = now;

    const roll = Phaser.Math.Between(1, 3);
    if (roll === 1) this.npcs.chaosFight();
    if (roll === 2) {
      this.police.triggerRaid();
      this.player.increaseWanted(1);
    }
    if (roll === 3) {
      const p = this.worldGen.randomRoadPoint();
      this.vehicles.spawnVehicle(p.x, p.y).setVelocity(Phaser.Math.Between(-160, 160), Phaser.Math.Between(-160, 160));
    }
  }

  update() {
    if (this.paused) return;

    this.player.update();
    this.vehicles.update(this.player.cursors);
    this.npcs.update(this.time.now);
    this.police.update(this.time.now);
    this.missions.update();

    if (this.player.health <= 0) {
      this.player.health = 100;
      this.player.wanted = 0;
      const p = this.worldGen.randomRoadPoint();
      this.player.sprite.setPosition(p.x, p.y);
      this.player.inVehicle = null;
    }

    this.hud.render();
  }
}

function boot() {
  const mount = document.getElementById('gtaGame');
  if (!mount) return;

  const playBtn = document.getElementById('playBtn');
  const launch = () => {
    if (window.__bzGtaStarted) return;
    window.__bzGtaStarted = true;

    new Phaser.Game({
      type: Phaser.AUTO,
      width: cfg.width,
      height: cfg.height,
      parent: 'gtaGame',
      backgroundColor: '#101826',
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [SandboxScene]
    });
    playBtn?.remove();
  };

  playBtn?.addEventListener('click', launch);
}

boot();
