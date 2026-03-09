import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class VehicleSystem {
  constructor(scene, player, world) {
    this.scene = scene;
    this.player = player;
    this.world = world;
    this.vehicles = [];
  }

  create(count = 42) {
    for (let i = 0; i < count; i++) {
      const p = this.world.randomSpawn();
      this.spawnVehicle(p.x + (Math.random() - 0.5) * 8, p.z + (Math.random() - 0.5) * 8, Math.random() > 0.4);
    }
  }

  spawnVehicle(x, z, locked = false) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 1.6, 8.2),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.72, 0.5),
        roughness: 0.32,
        metalness: 0.55,
        clearcoat: 0.7,
        clearcoatRoughness: 0.4
      })
    );
    body.position.y = 1.6;
    body.castShadow = true;
    g.add(body);

    const wheelGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 12);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x16181d, roughness: 0.9 });
    const wheelOffsets = [
      [-1.9, 0.9, -2.7], [1.9, 0.9, -2.7],
      [-1.9, 0.9, 2.7], [1.9, 0.9, 2.7]
    ];
    const wheels = wheelOffsets.map(([ox, oy, oz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(ox, oy, oz);
      g.add(w);
      return w;
    });
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 1.2, 3.4),
      new THREE.MeshPhysicalMaterial({ color: 0x98c9ea, transparent: true, opacity: 0.72, transmission: 0.3, roughness: 0.2 })
    );
    top.position.set(0, 2.6, -0.5);
    g.add(top);
    g.position.set(x, 0, z);
    this.scene.add(g);

    const v = {
      mesh: g,
      vel: new THREE.Vector3(),
      locked,
      driver: null,
      wheels,
      steer: 0,
      aiTarget: this.world.randomRoadNode(),
      aiCooldown: 0
    };
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
        const thrust = 52;
        const turn = 2.2;
        const forward = new THREE.Vector3(Math.sin(v.mesh.rotation.y), 0, Math.cos(v.mesh.rotation.y));

        if (input.KeyW) v.vel.add(forward.clone().multiplyScalar(thrust * dt));
        if (input.KeyS) v.vel.add(forward.clone().multiplyScalar(-thrust * 0.75 * dt));

        const steerInput = (input.KeyA ? 1 : 0) + (input.KeyD ? -1 : 0);
        v.steer = THREE.MathUtils.lerp(v.steer, steerInput, 0.18);
        const speedFactor = Math.min(1.3, v.vel.length() / 18 + 0.2);
        v.mesh.rotation.y += v.steer * turn * dt * speedFactor;

        const lateral = new THREE.Vector3(forward.z, 0, -forward.x);
        const sideSlip = lateral.dot(v.vel);
        v.vel.addScaledVector(lateral, -sideSlip * 0.07); // drift control

        const max = 38;
        if (v.vel.length() > max) v.vel.setLength(max);

        if (v.vel.length() > 16 && Math.abs(sideSlip) > 2.8 && Math.random() < 0.2) {
          const skid = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.8),
            new THREE.MeshBasicMaterial({ color: 0xc7e9ff, transparent: true, opacity: 0.3 })
          );
          skid.rotation.x = -Math.PI / 2;
          skid.position.set(v.mesh.position.x, 0.12, v.mesh.position.z);
          this.scene.add(skid);
          setTimeout(() => this.scene.remove(skid), 260);
        }
      }

      if (this.player.inVehicle !== v) {
        v.aiCooldown -= dt;
        if (!v.aiTarget || v.mesh.position.distanceTo(new THREE.Vector3(v.aiTarget.x, 0, v.aiTarget.z)) < 6 || v.aiCooldown <= 0) {
          v.aiTarget = this.world.randomRoadNode();
          v.aiCooldown = 1.2 + Math.random() * 2;
        }

        const to = new THREE.Vector3(v.aiTarget.x - v.mesh.position.x, 0, v.aiTarget.z - v.mesh.position.z);
        if (to.lengthSq() > 0.1) {
          const desiredYaw = Math.atan2(to.x, to.z);
          const yawDiff = Math.atan2(Math.sin(desiredYaw - v.mesh.rotation.y), Math.cos(desiredYaw - v.mesh.rotation.y));
          v.mesh.rotation.y += THREE.MathUtils.clamp(yawDiff, -0.05, 0.05);
          const heading = new THREE.Vector3(Math.sin(v.mesh.rotation.y), 0, Math.cos(v.mesh.rotation.y));
          v.vel.addScaledVector(heading, 0.95);
        }
      }

      v.mesh.position.addScaledVector(v.vel, dt);
      v.vel.multiplyScalar(0.972);

      const spin = v.vel.length() * dt * 0.9;
      v.wheels?.forEach((w, i) => {
        w.rotation.x += spin;
        if (i < 2) w.rotation.y = v.steer * 0.35;
      });
    });
  }
}
