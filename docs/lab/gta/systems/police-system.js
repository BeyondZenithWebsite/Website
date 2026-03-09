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
    g.fillStyle(0x2e75ff, 1).fillRect(0, 0, 14, 14);
    g.generateTexture('copTex', 14, 14);
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
