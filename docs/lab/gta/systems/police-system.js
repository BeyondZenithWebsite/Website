export class PoliceSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.cops = null;
    this.lastSpawn = 0;
  }

  create() {
    const g = this.scene.add.graphics();
    g.fillStyle(0x000000, 0.25).fillEllipse(8, 14, 10, 4);
    g.fillStyle(0x5aa1ff, 1).fillCircle(8, 6, 4);
    g.fillStyle(0x27457a, 1).fillRoundedRect(4, 9, 8, 7, 2);
    g.fillStyle(0xff4862, 0.9).fillRect(5, 9, 2, 2);
    g.fillStyle(0x63c0ff, 0.9).fillRect(9, 9, 2, 2);
    g.generateTexture('copTex', 16, 18);
    g.destroy();
    this.cops = this.scene.physics.add.group();
  }

  update(now) {
    const wanted = this.player.wanted;
    const target = this.player.inVehicle || this.player.sprite;

    if (wanted > 0 && now > this.lastSpawn + 4000 && this.cops.countActive(true) < wanted * 3) {
      this.lastSpawn = now;
      this.spawnNear(target.x, target.y);
    }

    this.cops.children.iterate((cop) => {
      if (!cop.active) return;
      const angle = Phaser.Math.Angle.Between(cop.x, cop.y, target.x, target.y);
      const speed = 95 + wanted * 35;
      cop.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      cop.rotation = angle;
      cop.setTint(((now >> 7) % 2 === 0) ? 0xff8aa0 : 0x7ec3ff);
    });
  }

  spawnNear(x, y) {
    const offset = Phaser.Math.Between(180, 300);
    const cop = this.cops.create(x + Phaser.Math.Between(-offset, offset), y + Phaser.Math.Between(-offset, offset), 'copTex');
    cop.setDepth(9);
    cop.setCollideWorldBounds(true);
    return cop;
  }

  triggerRaid() {
    const target = this.player.inVehicle || this.player.sprite;
    for (let i = 0; i < 3; i++) this.spawnNear(target.x, target.y);
    this.player.increaseWanted(1);
  }
}
