export class HUD {
  constructor(player, mission, cfg) {
    this.player = player;
    this.mission = mission;
    this.cfg = cfg;
    this.el = document.getElementById('hud');
    this.minimap = null;
  }

  stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  render() {
    if (!this.el) return;
    const m = this.mission.current;
    const target = this.player.inVehicle || this.player.sprite;
    const marker = this.mission.marker;
    const dist = marker ? Math.floor(Phaser.Math.Distance.Between(target.x, target.y, marker.x, marker.y)) : 0;

    if (!this.minimap) {
      this.minimap = document.createElement('canvas');
      this.minimap.width = 120;
      this.minimap.height = 120;
      this.minimap.style.marginTop = '8px';
      this.minimap.style.border = '1px solid rgba(122,200,255,.4)';
      this.minimap.style.borderRadius = '8px';
    }

    this.el.innerHTML = `
      <div><strong>Health:</strong> ${Math.max(0, Math.floor(this.player.health))}%</div>
      <div><strong>Money:</strong> $${this.player.cash}</div>
      <div><strong>Wanted:</strong> <span style="color:#ff7185">${this.stars(this.player.wanted)}</span></div>
      <div><strong>Objective:</strong> ${m ? m.label : '—'}</div>
      <div><strong>Waypoint:</strong> ${dist}m</div>
    `;
    this.el.appendChild(this.minimap);
    this.drawMinimap(target, marker);
  }

  drawMinimap(target, marker) {
    if (!this.minimap) return;
    const c = this.minimap;
    const ctx = c.getContext('2d');
    const sX = c.width / this.cfg.worldWidth;
    const sY = c.height / this.cfg.worldHeight;

    ctx.fillStyle = '#09101c';
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = '#2f435c';
    for (let i = 0; i < c.width; i += 12) ctx.fillRect(i, 0, 2, c.height);
    for (let i = 0; i < c.height; i += 12) ctx.fillRect(0, i, c.width, 2);

    if (marker) {
      ctx.fillStyle = '#39ff96';
      ctx.beginPath();
      ctx.arc(marker.x * sX, marker.y * sY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#55d9ff';
    ctx.beginPath();
    ctx.arc(target.x * sX, target.y * sY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
