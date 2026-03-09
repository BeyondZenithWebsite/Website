export class WorldGenerator {
  constructor(scene, cfg) {
    this.scene = scene;
    this.cfg = cfg;
    this.roadRects = [];
    this.spawnPoints = [];
  }

  build() {
    const { scene, cfg } = this;
    scene.cameras.main.setBackgroundColor(0x1a2532);

    const block = cfg.blockSize;
    const cols = Math.floor(cfg.worldWidth / block);
    const rows = Math.floor(cfg.worldHeight / block);

    const g = scene.add.graphics();

    // Ground base
    g.fillStyle(0x2a4f38, 1);
    g.fillRect(0, 0, cfg.worldWidth, cfg.worldHeight);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const bx = x * block;
        const by = y * block;
        const isRoadX = x % 2 === 0;
        const isRoadY = y % 2 === 0;

        if (isRoadX || isRoadY) {
          // asphalt
          g.fillStyle(0x2d313a, 1);
          g.fillRect(bx, by, block, block);

          // sidewalks
          g.fillStyle(0x5e6774, 1);
          g.fillRect(bx + 3, by + 3, block - 6, block - 6);
          g.fillStyle(0x363b46, 1);
          g.fillRect(bx + 8, by + 8, block - 16, block - 16);

          // lane markings
          g.fillStyle(0xd4b85e, 0.7);
          if (isRoadX) {
            for (let ly = by + 14; ly < by + block - 14; ly += 18) g.fillRect(bx + block * 0.5 - 1, ly, 2, 10);
          }
          if (isRoadY) {
            for (let lx = bx + 14; lx < bx + block - 14; lx += 18) g.fillRect(lx, by + block * 0.5 - 1, 10, 2);
          }

          this.roadRects.push(new Phaser.Geom.Rectangle(bx, by, block, block));
          if ((x + y) % 3 === 0) this.spawnPoints.push({ x: bx + block / 2, y: by + block / 2 });

          // intersections crosswalk stripes
          if (isRoadX && isRoadY) {
            g.fillStyle(0xc7ced9, 0.35);
            for (let i = 0; i < 4; i++) {
              g.fillRect(bx + 12 + i * 9, by + 6, 5, 14);
              g.fillRect(bx + 12 + i * 9, by + block - 20, 5, 14);
              g.fillRect(bx + 6, by + 12 + i * 9, 14, 5);
              g.fillRect(bx + block - 20, by + 12 + i * 9, 14, 5);
            }
          }
        } else {
          // lot background
          g.fillStyle(0x93a3b5, 1);
          g.fillRect(bx + 4, by + 4, block - 8, block - 8);

          if (Math.random() < 0.2) {
            // park
            g.fillStyle(0x3d8457, 1);
            g.fillRect(bx + 10, by + 10, block - 20, block - 20);
            g.fillStyle(0x2d6e45, 1);
            for (let t = 0; t < 4; t++) {
              g.fillCircle(bx + Phaser.Math.Between(18, block - 18), by + Phaser.Math.Between(18, block - 18), Phaser.Math.Between(5, 9));
            }
          } else {
            // low-poly building with fake shadow/highlight
            const w = Phaser.Math.Between(block * 0.45, block * 0.82);
            const hh = Phaser.Math.Between(block * 0.45, block * 0.82);
            const ox = bx + (block - w) / 2;
            const oy = by + (block - hh) / 2;
            const c = Phaser.Display.Color.RandomRGB(90, 200);
            const base = Phaser.Display.Color.GetColor(c.r, c.g, c.b);
            const hi = Phaser.Display.Color.GetColor(Math.min(c.r + 35, 255), Math.min(c.g + 35, 255), Math.min(c.b + 35, 255));
            const sh = Phaser.Display.Color.GetColor(Math.max(c.r - 35, 0), Math.max(c.g - 35, 0), Math.max(c.b - 35, 0));

            g.fillStyle(sh, 0.8);
            g.fillRect(ox + 6, oy + 8, w, hh);
            g.fillStyle(base, 1);
            g.fillRect(ox, oy, w, hh);
            g.fillStyle(hi, 0.85);
            g.fillRect(ox, oy, w, 6);

            // windows
            g.fillStyle(0xd8ecff, 0.38);
            for (let wy = oy + 10; wy < oy + hh - 6; wy += 10) {
              for (let wx = ox + 8; wx < ox + w - 6; wx += 10) g.fillRect(wx, wy, 4, 5);
            }
          }

          // random props
          if (Math.random() < 0.18) {
            g.fillStyle(0xd8ad5f, 1);
            g.fillCircle(bx + Phaser.Math.Between(12, block - 12), by + Phaser.Math.Between(12, block - 12), Phaser.Math.Between(3, 6));
          }
        }
      }
    }

    g.generateTexture('cityTexture', cfg.worldWidth, cfg.worldHeight);
    g.destroy();
    scene.add.image(0, 0, 'cityTexture').setOrigin(0, 0);

    // subtle city haze
    const haze = scene.add.rectangle(cfg.worldWidth / 2, cfg.worldHeight / 2, cfg.worldWidth, cfg.worldHeight, 0x88bbff, 0.05);
    haze.setDepth(30);
    haze.setScrollFactor(1);

    scene.physics.world.setBounds(0, 0, cfg.worldWidth, cfg.worldHeight);
  }

  randomRoadPoint() {
    return Phaser.Utils.Array.GetRandom(this.spawnPoints) || { x: 100, y: 100 };
  }
}
