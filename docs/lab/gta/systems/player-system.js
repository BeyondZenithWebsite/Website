import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class PlayerSystem {
  constructor(scene) {
    this.scene = scene;
    this.health = 100;
    this.cash = 0;
    this.wanted = 0;
    this.inVehicle = null;
    this.speed = 22;
    this.sprint = 34;
    this.velocity = new THREE.Vector3();
  }

  create(spawn) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x32d9ff, emissive: 0x0a3f4d, emissiveIntensity: 0.5 });
    this.mesh = new THREE.Mesh(new THREE.CapsuleGeometry(1.2, 2.4, 4, 8), mat);
    this.mesh.position.set(spawn.x, 2.2, spawn.z);
    this.mesh.castShadow = true;
    this.scene.add(this.mesh);
  }

  update(input, dt) {
    if (this.inVehicle) {
      this.mesh.visible = false;
      this.mesh.position.copy(this.inVehicle.mesh.position);
      return;
    }
    this.mesh.visible = true;

    const target = new THREE.Vector3();
    if (input.KeyW) target.z -= 1;
    if (input.KeyS) target.z += 1;
    if (input.KeyA) target.x -= 1;
    if (input.KeyD) target.x += 1;

    if (target.lengthSq() > 0) {
      target.normalize();
      const s = input.ShiftLeft ? this.sprint : this.speed;
      this.velocity.lerp(target.multiplyScalar(s), 0.2);
      this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
    } else {
      this.velocity.multiplyScalar(0.84);
    }

    this.mesh.position.addScaledVector(this.velocity, dt);
  }

  addCash(v) { this.cash += v; }
  increaseWanted(v = 1) { this.wanted = Math.min(5, this.wanted + v); }
  decayWanted() { this.wanted = Math.max(0, this.wanted - 1); }
}
