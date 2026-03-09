import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class NPCSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.npcs = [];
    this.lastCrimeAt = 0;
  }

  create(count = 44) {
    for (let i = 0; i < count; i++) {
      const p = this.world.randomSpawn();
      const mesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.9, 2, 4, 6),
        new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.35, 0.62) })
      );
      mesh.position.set(p.x + (Math.random() - 0.5) * 14, 1.8, p.z + (Math.random() - 0.5) * 14);
      mesh.castShadow = true;
      this.scene.add(mesh);
      this.npcs.push({ mesh, vel: new THREE.Vector3((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6), alive: true, t: 0 });
    }
  }

  update(dt, now) {
    this.npcs.forEach((n) => {
      if (!n.alive) return;
      const target = this.player.inVehicle ? this.player.inVehicle.mesh.position : this.player.mesh.position;
      const d = n.mesh.position.distanceTo(target);
      if (d < 20 && now - this.lastCrimeAt < 2400) {
        n.vel.copy(n.mesh.position.clone().sub(target).setY(0).normalize().multiplyScalar(12));
      } else if (Math.random() < 0.01) {
        n.vel.set((Math.random() - 0.5) * 7, 0, (Math.random() - 0.5) * 7);
      }
      n.mesh.position.addScaledVector(n.vel, dt);
      n.mesh.rotation.y = Math.atan2(n.vel.x, n.vel.z);
    });
  }

  attackNearby(playerPos) {
    const t = this.npcs.find((n) => n.alive && n.mesh.position.distanceTo(playerPos) < 5.5);
    if (!t) return false;
    t.alive = false;
    t.mesh.visible = false;
    this.player.addCash(30 + Math.floor(Math.random() * 80));
    this.player.increaseWanted(1);
    this.lastCrimeAt = performance.now();
    return true;
  }

  chaosFight() {
    const alive = this.npcs.filter((n) => n.alive);
    if (alive.length < 2) return;
    const a = alive[Math.floor(Math.random() * alive.length)];
    const b = alive[Math.floor(Math.random() * alive.length)];
    if (!a || !b || a === b) return;
    a.vel.copy(b.mesh.position.clone().sub(a.mesh.position).setY(0).normalize().multiplyScalar(14));
    b.vel.copy(a.mesh.position.clone().sub(b.mesh.position).setY(0).normalize().multiplyScalar(14));
  }
}
