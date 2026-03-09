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
    g.fillStyle(0x00d8ff, 1).fillRect(0, 0, 16, 16);
    g.generateTexture('playerTex', 16, 16);
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
