import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class VehicleSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.vehicles = [];
  }

  create(count = 28) {
    for (let i = 0; i < count; i++) {
      const p = this.world.randomSpawn();
      this.spawnVehicle(p.x + (Math.random() - 0.5) * 8, p.z + (Math.random() - 0.5) * 8, Math.random() > 0.4);
    }
  }

  spawnVehicle(x, z, locked = false) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.6, 8.2), new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.72, 0.5) }));
    body.position.y = 1.6;
    body.castShadow = true;
    g.add(body);
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.2, 3.4), new THREE.MeshStandardMaterial({ color: 0x98c9ea, transparent: true, opacity: 0.82 }));
    top.position.set(0, 2.6, -0.5);
    g.add(top);
    g.position.set(x, 0, z);
    this.scene.add(g);

    const v = { mesh: g, vel: new THREE.Vector3(), locked, driver: null };
    this.vehicles.push(v);
    return v;
  }

  tryEnterOrExit(playerPos) {
    if (this.player.inVehicle) {
      this.player.inVehicle.driver = null;
      this.player.inVehicle = null;
      return;
    }

    let best = null, min = 999;
    this.vehicles.forEach((v) => {
      if (v.driver) return;
      const d = v.mesh.position.distanceTo(playerPos);
      if (d < min) { min = d; best = v; }
    });
    if (best && min < 8) {
      this.player.inVehicle = best;
      best.driver = this.player;
      if (best.locked) {
        this.player.increaseWanted(1);
        this.player.addCash(80);
        best.locked = false;
      }
    }
  }

  update(input, dt) {
    this.vehicles.forEach((v) => {
      if (this.player.inVehicle === v) {
        const thrust = 48;
        const turn = 2.6;
        if (input.KeyW) v.vel.add(new THREE.Vector3(Math.sin(v.mesh.rotation.y), 0, Math.cos(v.mesh.rotation.y)).multiplyScalar(thrust * dt));
        if (input.KeyS) v.vel.add(new THREE.Vector3(-Math.sin(v.mesh.rotation.y), 0, -Math.cos(v.mesh.rotation.y)).multiplyScalar(thrust * 0.7 * dt));
        if (input.KeyA) v.mesh.rotation.y += turn * dt;
        if (input.KeyD) v.mesh.rotation.y -= turn * dt;

        const max = 34;
        if (v.vel.length() > max) v.vel.setLength(max);
      }

      v.mesh.position.addScaledVector(v.vel, dt);
      v.vel.multiplyScalar(0.97);
    });
  }
}
