export class PlayerSystem {
  constructor(scene, cfg) {
    this.scene = scene;
    this.cfg = cfg;
    this.health = 100;
    this.cash = 0;
    this.wanted = 0;
    this.inVehicle = null;
  }

  create(spawn) {
    const g = this.scene.add.graphics();
    g.fillStyle(0x000000, 0.35).fillEllipse(10, 14, 14, 6);
    g.fillStyle(0x3be6ff, 1).fillRoundedRect(4, 2, 12, 14, 3);
    g.fillStyle(0x0b1d30, 0.6).fillRect(7, 4, 6, 4);
    g.fillStyle(0xb7f6ff, 1).fillRect(8, 10, 4, 4);
    g.generateTexture('playerTex', 20, 20);
    g.destroy();

    this.sprite = this.scene.physics.add.sprite(spawn.x, spawn.y, 'playerTex');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(8);

    this.cursors = this.scene.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D', sprint: 'SHIFT', enter: 'E', attack: 'SPACE', pause: 'ESC'
    });
  }

  update() {
    if (this.inVehicle) {
      this.sprite.setPosition(this.inVehicle.x, this.inVehicle.y);
      this.sprite.setVisible(false);
      return;
    }

    this.sprite.setVisible(true);
    const speed = this.cursors.sprint.isDown ? this.cfg.playerSprintSpeed : this.cfg.playerSpeed;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown) vx = -speed;
    else if (this.cursors.right.isDown) vx = speed;
    if (this.cursors.up.isDown) vy = -speed;
    else if (this.cursors.down.isDown) vy = speed;

    this.sprite.body.setVelocity(vx, vy);
    this.sprite.body.velocity.normalize().scale(speed);
  }

  addCash(v) { this.cash += v; }
  increaseWanted(v = 1) { this.wanted = Phaser.Math.Clamp(this.wanted + v, 0, 5); }
  decayWanted() { if (this.wanted > 0) this.wanted = Math.max(0, this.wanted - 1); }
}
