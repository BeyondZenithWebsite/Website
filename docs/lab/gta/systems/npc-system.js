export class NPCSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.pedestrians = null;
    this.lastCrimeAt = 0;
  }

  create(count = 40) {
    const g = this.scene.add.graphics();
    g.fillStyle(0x000000, 0.25).fillEllipse(8, 14, 10, 4);
    g.fillStyle(0xf7d87b, 1).fillCircle(8, 6, 4);
    g.fillStyle(0x6dd3ff, 1).fillRoundedRect(4, 9, 8, 7, 2);
    g.generateTexture('npcTex', 16, 18);
    g.destroy();

    this.pedestrians = this.scene.physics.add.group();
    for (let i = 0; i < count; i++) {
      const p = this.world.randomRoadPoint();
      const npc = this.pedestrians.create(p.x + Phaser.Math.Between(-40, 40), p.y + Phaser.Math.Between(-40, 40), 'npcTex');
      npc.setTint(Phaser.Display.Color.RandomRGB(40, 255).color);
      npc.setDepth(7);
      npc.nextMoveAt = 0;
      npc.state = 'wander';
    }
  }

  update(now) {
    this.pedestrians.children.iterate((npc) => {
      if (!npc.active) return;

      const dist = Phaser.Math.Distance.Between(npc.x, npc.y, this.player.sprite.x, this.player.sprite.y);
      if (dist < 90 && this.lastCrimeAt + 2200 > now) {
        npc.state = 'flee';
      } else if (npc.state === 'flee' && dist > 180) {
        npc.state = 'wander';
      }

      if (now > npc.nextMoveAt) {
        npc.nextMoveAt = now + Phaser.Math.Between(800, 2300);
        if (npc.state === 'flee') {
          const angle = Phaser.Math.Angle.Between(this.player.sprite.x, this.player.sprite.y, npc.x, npc.y);
          npc.setVelocity(Math.cos(angle) * 90, Math.sin(angle) * 90);
        } else {
          npc.setVelocity(Phaser.Math.Between(-60, 60), Phaser.Math.Between(-60, 60));
        }
      }
    });
  }

  attackNearby() {
    const target = this.pedestrians.children.entries.find((npc) => npc.active && Phaser.Math.Distance.Between(npc.x, npc.y, this.player.sprite.x, this.player.sprite.y) < 24);
    if (!target) return false;

    target.disableBody(true, true);
    this.player.addCash(Phaser.Math.Between(20, 90));
    this.player.increaseWanted(1);
    this.lastCrimeAt = this.scene.time.now;
    return true;
  }

  chaosFight() {
    const npcs = this.pedestrians.children.entries.filter((n) => n.active);
    if (npcs.length < 2) return;
    const a = Phaser.Utils.Array.GetRandom(npcs);
    const b = Phaser.Utils.Array.GetRandom(npcs);
    if (!a || !b || a === b) return;
    a.setVelocity((b.x - a.x) * 0.5, (b.y - a.y) * 0.5);
    b.setVelocity((a.x - b.x) * 0.5, (a.y - b.y) * 0.5);
  }
}
