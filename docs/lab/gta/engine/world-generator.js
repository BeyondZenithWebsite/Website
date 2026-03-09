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
    const street = cfg.roadWidth;
    const cols = Math.floor(cfg.worldWidth / block);
    const rows = Math.floor(cfg.worldHeight / block);

    const g = scene.add.graphics();

    // Ground
    g.fillStyle(0x2f5d3f, 1);
    g.fillRect(0, 0, cfg.worldWidth, cfg.worldHeight);

    // Roads + sidewalks + lots
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const bx = x * block;
        const by = y * block;
        const isRoadX = x % 2 === 0;
        const isRoadY = y % 2 === 0;

        if (isRoadX || isRoadY) {
          g.fillStyle(0x3a3f4b, 1);
          g.fillRect(bx, by, block, block);
          this.roadRects.push(new Phaser.Geom.Rectangle(bx, by, block, block));
          if ((x + y) % 3 === 0) this.spawnPoints.push({ x: bx + block / 2, y: by + block / 2 });

          if (isRoadX && isRoadY) {
            g.fillStyle(0x5a6472, 1);
            g.fillRect(bx + block * 0.4, by, block * 0.2, block);
            g.fillRect(bx, by + block * 0.4, block, block * 0.2);
          }
        } else {
          g.fillStyle(0x8ea0b3, 1);
          g.fillRect(bx + 4, by + 4, block - 8, block - 8);

          if (Math.random() < 0.2) {
            g.fillStyle(0x3b7a50, 1);
            g.fillRect(bx + 12, by + 12, block - 24, block - 24);
          } else {
            const h = Phaser.Math.Between(0x4e7dbf, 0x8f98ad);
            g.fillStyle(h, 1);
            const w = Phaser.Math.Between(block * 0.45, block * 0.8);
            const hh = Phaser.Math.Between(block * 0.45, block * 0.8);
            g.fillRect(bx + (block - w) / 2, by + (block - hh) / 2, w, hh);
          }

          if (Math.random() < 0.15) {
            g.fillStyle(0xd8ad5f, 1);
            g.fillCircle(bx + Phaser.Math.Between(12, block - 12), by + Phaser.Math.Between(12, block - 12), Phaser.Math.Between(3, 6));
          }
        }
      }
    }

    g.generateTexture('cityTexture', cfg.worldWidth, cfg.worldHeight);
    g.destroy();
    scene.add.image(0, 0, 'cityTexture').setOrigin(0, 0);

    scene.physics.world.setBounds(0, 0, cfg.worldWidth, cfg.worldHeight);
  }

  randomRoadPoint() {
    return Phaser.Utils.Array.GetRandom(this.spawnPoints) || { x: 100, y: 100 };
  }
}
