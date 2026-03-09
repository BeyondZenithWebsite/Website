export class MissionSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.current = null;
    this.marker = null;
  }

  create() {
    const g = this.scene.add.graphics();
    g.fillStyle(0x34ff9b, 1).fillCircle(8, 8, 8);
    g.generateTexture('missionMarker', 16, 16);
    g.destroy();
    this.newMission();
  }

  newMission() {
    const types = ['steal_car', 'escape_police', 'deliver_vehicle', 'collect_cash'];
    const type = Phaser.Utils.Array.GetRandom(types);

    this.current = { type, done: false, reward: Phaser.Math.Between(120, 280), label: '' };
    const p = this.world.randomRoadPoint();
    if (this.marker) this.marker.destroy();
    this.marker = this.scene.add.image(p.x, p.y, 'missionMarker').setDepth(5);

    if (type === 'steal_car') this.current.label = 'Mission: Steal any parked car';
    if (type === 'escape_police') this.current.label = 'Mission: Lose all wanted stars';
    if (type === 'deliver_vehicle') this.current.label = 'Mission: Bring a stolen car to green marker';
    if (type === 'collect_cash') this.current.label = 'Mission: Collect $250 from chaos';
  }

  update() {
    if (!this.current || this.current.done) return;

    const p = this.player;
    if (this.current.type === 'steal_car' && p.inVehicle) this.complete();
    if (this.current.type === 'escape_police' && p.wanted === 0) this.complete();
    if (this.current.type === 'collect_cash' && p.cash >= 250) this.complete();

    if (this.current.type === 'deliver_vehicle' && p.inVehicle) {
      const d = Phaser.Math.Distance.Between(p.inVehicle.x, p.inVehicle.y, this.marker.x, this.marker.y);
      if (d < 28) this.complete();
    }
  }

  complete() {
    this.current.done = true;
    this.player.addCash(this.current.reward);
    this.scene.time.delayedCall(900, () => this.newMission());
  }
}
