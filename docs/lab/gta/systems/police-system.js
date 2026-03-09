import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class PoliceSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.cops = [];
    this.roadblocks = [];
    this.lastSpawn = 0;
    this.lastRoadblock = 0;
  }

  spawnNear(targetPos) {
    const p = targetPos.clone();
    p.x += (Math.random() - 0.5) * 92;
    p.z += (Math.random() - 0.5) * 92;

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 1.7, 8.6),
      new THREE.MeshStandardMaterial({ color: 0x2f5bff, emissive: 0x101a44, emissiveIntensity: 0.6 })
    );
    mesh.position.set(p.x, 1.7, p.z);
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.cops.push({ mesh, vel: new THREE.Vector3() });
  }

  update(dt, now) {
    const target = this.player.inVehicle ? this.player.inVehicle.mesh.position : this.player.mesh.position;
    if (this.player.wanted > 0 && now - this.lastSpawn > 3200 && this.cops.length < this.player.wanted * 3) {
      this.lastSpawn = now;
      this.spawnNear(target);
    }

    if (this.player.wanted >= 3 && now - this.lastRoadblock > 12000 && this.roadblocks.length < 3) {
      this.lastRoadblock = now;
      this.spawnRoadblock(target);
    }

    this.cops.forEach((c, i) => {
      const toTarget = target.clone().sub(c.mesh.position).setY(0);
      const tangent = new THREE.Vector3(-toTarget.z, 0, toTarget.x).normalize();
      const flank = (i % 2 === 0 ? 1 : -1) * Math.min(0.35, this.player.wanted * 0.08);
      const dir = toTarget.lengthSq() > 0 ? toTarget.normalize().addScaledVector(tangent, flank).normalize() : new THREE.Vector3();
      c.vel.lerp(dir.multiplyScalar(14 + this.player.wanted * 4), 0.14);
      c.mesh.position.addScaledVector(c.vel, dt);
      c.mesh.rotation.y = Math.atan2(c.vel.x, c.vel.z);
      c.mesh.material.emissive.setHex(((now >> 7) % 2 === 0) ? 0x3a1020 : 0x10293f);

      if (c.mesh.position.distanceTo(target) < 5.5) this.player.health -= 12 * dt;
      if (i > 18) c.mesh.visible = false;
    });

    this.roadblocks.forEach((rb) => {
      if (!rb.active) return;
      rb.ttl -= dt;
      if (rb.ttl <= 0) {
        rb.active = false;
        rb.mesh.visible = false;
        return;
      }
      const d = rb.mesh.position.distanceTo(target);
      if (d < 6.5) {
        this.player.health -= 28 * dt;
        this.player.increaseWanted(1);
      }
    });
  }

  spawnRoadblock(targetPos) {
    const n = this.world.nearestRoadNode(targetPos);
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(10, 1.5, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x8a9099, emissive: 0x2f333a, emissiveIntensity: 0.5 })
    );
    mesh.position.set(n.x + (Math.random() - 0.5) * 8, 1.2, n.z + (Math.random() - 0.5) * 8);
    mesh.rotation.y = Math.random() > 0.5 ? 0 : Math.PI / 2;
    this.scene.add(mesh);
    this.roadblocks.push({ mesh, ttl: 12, active: true });
  }

  triggerRaid(targetPos) {
    for (let i = 0; i < 3; i++) this.spawnNear(targetPos);
    this.player.increaseWanted(1);
  }
}
