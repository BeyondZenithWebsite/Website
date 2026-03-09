export class VehicleSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.vehicles = null;
  }

  create(count = 26) {
    const g = this.scene.add.graphics();
    g.fillStyle(0x000000, 0.3).fillEllipse(17, 20, 26, 10);
    g.fillStyle(0xe64f4f, 1).fillRoundedRect(3, 6, 28, 12, 4);
    g.fillStyle(0xb8e8ff, 0.8).fillRoundedRect(8, 8, 18, 5, 2);
    g.fillStyle(0x1a1f2c, 1).fillRect(5, 5, 4, 14);
    g.fillStyle(0x1a1f2c, 1).fillRect(25, 5, 4, 14);
    g.generateTexture('carTex', 34, 24);
    g.destroy();

    this.vehicles = this.scene.physics.add.group();
    this.trails = this.scene.add.group();
    for (let i = 0; i < count; i++) {
      const p = this.world.randomRoadPoint();
      const car = this.vehicles.create(p.x, p.y, 'carTex');
      car.setTint(Phaser.Display.Color.RandomRGB().color);
      car.setDepth(6);
      car.setDrag(180);
      car.setMaxVelocity(220);
      car.locked = Math.random() > 0.45;
      car.driver = null;
    }
  }

  tryEnterOrExit() {
    if (this.player.inVehicle) {
      this.player.inVehicle.driver = null;
      this.player.inVehicle = null;
      return;
    }

    let closest = null;
    let min = 999;
    this.vehicles.children.iterate((car) => {
      if (!car.active || car.driver) return;
      const d = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, car.x, car.y);
      if (d < min) { min = d; closest = car; }
    });

    if (closest && min < 34) {
      this.player.inVehicle = closest;
      closest.driver = this.player;
      if (closest.locked) {
        this.player.increaseWanted(1);
        this.player.addCash(60);
        closest.locked = false;
      }
    }
  }

  update(input) {
    if (!this.player.inVehicle) return;
    const car = this.player.inVehicle;

    let accelX = 0;
    let accelY = 0;
    const speed = 330;
    if (input.left.isDown) accelX = -speed;
    else if (input.right.isDown) accelX = speed;
    if (input.up.isDown) accelY = -speed;
    else if (input.down.isDown) accelY = speed;

    car.setAcceleration(accelX, accelY);
    if (!accelX && !accelY) car.setAcceleration(0, 0);

    const vx = car.body.velocity.x;
    const vy = car.body.velocity.y;
    const mag = Math.hypot(vx, vy);
    if (mag > 8) car.rotation = Math.atan2(vy, vx);

    if (mag > 120 && (Math.abs(accelX) > 0 || Math.abs(accelY) > 0) && Math.random() < 0.28) {
      const skid = this.scene.add.circle(car.x - vx * 0.02, car.y - vy * 0.02, 2, 0xe6f4ff, 0.45).setDepth(4);
      this.scene.tweens.add({ targets: skid, alpha: 0, scale: 2.2, duration: 420, onComplete: () => skid.destroy() });
    }
  }

  spawnVehicle(x, y) {
    const car = this.vehicles.create(x, y, 'carTex');
    car.setTint(Phaser.Display.Color.RandomRGB().color);
    car.setDepth(6);
    car.setDrag(180);
    car.setMaxVelocity(220);
    car.locked = false;
    car.driver = null;
    return car;
  }
}
