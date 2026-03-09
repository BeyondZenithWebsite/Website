import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class WorldGenerator {
  constructor(scene, cfg) {
    this.scene = scene;
    this.cfg = cfg;
    this.spawnPoints = [];
    this.parks = [];
    this.roadNodes = [];
    this.props = [];
  }

  build() {
    const { worldSize, block, roadW } = this.cfg;
    const half = worldSize / 2;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(worldSize, worldSize),
      new THREE.MeshStandardMaterial({ color: 0x294736 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const grid = worldSize / block;
    for (let gx = 0; gx < grid; gx++) {
      for (let gz = 0; gz < grid; gz++) {
        const x = -half + gx * block + block / 2;
        const z = -half + gz * block + block / 2;
        const road = gx % 2 === 0 || gz % 2 === 0;

        if (road) {
          const r = new THREE.Mesh(
            new THREE.PlaneGeometry(block - 2, block - 2),
            new THREE.MeshStandardMaterial({ color: 0x323742, roughness: 0.95 })
          );
          r.rotation.x = -Math.PI / 2;
          r.position.set(x, 0.02, z);
          r.receiveShadow = true;
          this.scene.add(r);
          if ((gx + gz) % 3 === 0) this.spawnPoints.push({ x, z });
          this.roadNodes.push({ x, z, gx, gz });

          // lane marks
          if (Math.random() < 0.7) {
            const line = new THREE.Mesh(
              new THREE.BoxGeometry(block * 0.04, 0.05, block * 0.45),
              new THREE.MeshStandardMaterial({ color: 0xd8bc66, emissive: 0x2a2108 })
            );
            line.position.set(x, 0.08, z);
            this.scene.add(line);
          }

          // curb strips
          const curbMat = new THREE.MeshStandardMaterial({ color: 0x636d7a, roughness: 0.9 });
          const curb1 = new THREE.Mesh(new THREE.BoxGeometry(block - 2, 0.25, 0.35), curbMat);
          curb1.position.set(x, 0.13, z - block / 2 + 0.2);
          this.scene.add(curb1);
          const curb2 = curb1.clone(); curb2.position.z = z + block / 2 - 0.2; this.scene.add(curb2);
        } else {
          if (Math.random() < 0.12) {
            const prop = new THREE.Mesh(
              new THREE.BoxGeometry(1.6, 1.6, 1.6),
              new THREE.MeshStandardMaterial({ color: 0xd59652, roughness: 0.9 })
            );
            prop.position.set(x + (Math.random() - 0.5) * 10, 0.9, z + (Math.random() - 0.5) * 10);
            prop.castShadow = true;
            this.scene.add(prop);
            this.props.push({ mesh: prop, hp: 2, alive: true });
          }

          if (Math.random() < 0.22) {
            const park = new THREE.Mesh(
              new THREE.BoxGeometry(block * 0.78, 0.3, block * 0.78),
              new THREE.MeshStandardMaterial({ color: 0x3d7f52 })
            );
            park.position.set(x, 0.15, z);
            park.receiveShadow = true;
            this.scene.add(park);
            this.parks.push({ x, z });

            for (let i = 0; i < 3; i++) {
              const tree = new THREE.Mesh(
                new THREE.ConeGeometry(1.8, 5, 6),
                new THREE.MeshStandardMaterial({ color: 0x2e6b42 })
              );
              tree.position.set(x + (Math.random() - 0.5) * 16, 2.8, z + (Math.random() - 0.5) * 16);
              tree.castShadow = true;
              this.scene.add(tree);
            }
          } else {
            const w = 10 + Math.random() * 16;
            const h = 10 + Math.random() * 26;
            const d = 10 + Math.random() * 16;
            const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.08, 0.25, 0.38 + Math.random() * 0.2);
            const b = new THREE.Mesh(
              new THREE.BoxGeometry(w, h, d),
              new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0.04 })
            );
            b.position.set(x + (Math.random() - 0.5) * 8, h / 2, z + (Math.random() - 0.5) * 8);
            b.castShadow = true;
            b.receiveShadow = true;
            this.scene.add(b);
          }
        }
      }
    }

    // streetlights
    for (let i = 0; i < 36; i++) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 9, 8),
        new THREE.MeshStandardMaterial({ color: 0x4b5564, metalness: 0.35, roughness: 0.7 })
      );
      pole.position.set((Math.random() - 0.5) * worldSize * 0.86, 4.5, (Math.random() - 0.5) * worldSize * 0.86);
      this.scene.add(pole);
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xfff1b1 })
      );
      lamp.position.set(pole.position.x, 9.1, pole.position.z);
      this.scene.add(lamp);
    }

    // Neon accents
    for (let i = 0; i < 18; i++) {
      const n = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x5dc9ff, emissive: 0x0c3a57, emissiveIntensity: 1.1 })
      );
      n.position.set((Math.random() - 0.5) * worldSize * 0.85, 4, (Math.random() - 0.5) * worldSize * 0.85);
      this.scene.add(n);
    }
  }

  randomSpawn() {
    return this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)] || { x: 0, z: 0 };
  }

  randomRoadNode() {
    return this.roadNodes[Math.floor(Math.random() * this.roadNodes.length)] || { x: 0, z: 0, gx: 0, gz: 0 };
  }

  nearestRoadNode(pos) {
    let best = null;
    let bestD = Infinity;
    for (const n of this.roadNodes) {
      const dx = n.x - pos.x;
      const dz = n.z - pos.z;
      const d = dx * dx + dz * dz;
      if (d < bestD) { bestD = d; best = n; }
    }
    return best || this.randomRoadNode();
  }
}
