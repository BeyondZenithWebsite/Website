import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class MissionSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.current = null;
    this.marker = null;
  }

  newMission() {
    const types = ['steal_car', 'escape_police', 'deliver_vehicle', 'collect_cash'];
    const type = types[Math.floor(Math.random() * types.length)];
    const p = this.world.randomSpawn();

    if (this.marker) this.scene.remove(this.marker);
    this.marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.3, 20),
      new THREE.MeshStandardMaterial({ color: 0x31ff9b, emissive: 0x0b5e37, emissiveIntensity: 0.8 })
    );
    this.marker.position.set(p.x, 0.35, p.z);
    this.scene.add(this.marker);

    const label = {
      steal_car: 'Mission: Steal any parked car',
      escape_police: 'Mission: Lose all wanted stars',
      deliver_vehicle: 'Mission: Deliver stolen car to marker',
      collect_cash: 'Mission: Collect $250 from chaos'
    }[type];

    this.current = { type, label, reward: 120 + Math.floor(Math.random() * 180) };
  }

  update(dt, t) {
    if (!this.current) this.newMission();
    if (this.marker) {
      this.marker.position.y = 0.35 + Math.sin(t * 0.004) * 0.12;
      this.marker.rotation.y += dt * 1.1;
    }

    const p = this.player;
    if (!this.current) return;
    if (this.current.type === 'steal_car' && p.inVehicle) this.complete();
    if (this.current.type === 'escape_police' && p.wanted === 0) this.complete();
    if (this.current.type === 'collect_cash' && p.cash >= 250) this.complete();
    if (this.current.type === 'deliver_vehicle' && p.inVehicle && this.marker && p.inVehicle.mesh.position.distanceTo(this.marker.position) < 7) this.complete();
  }

  complete() {
    this.player.addCash(this.current.reward);
    this.current = null;
    setTimeout(() => this.newMission(), 900);
  }
}
