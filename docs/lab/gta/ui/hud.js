export class HUD {
  constructor(player, mission, cfg) {
    this.player = player;
    this.mission = mission;
    this.cfg = cfg;
    this.el = document.getElementById('hud');
    this.map = null;
  }

  stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  render(meta = {}) {
    if (!this.el) return;
    const m = this.mission.current;
    this.el.innerHTML = `
      <div><strong>Health:</strong> ${Math.max(0, this.player.health | 0)}%</div>
      <div><strong>Money:</strong> $${this.player.cash}</div>
      <div><strong>Wanted:</strong> <span style="color:#ff7185">${this.stars(this.player.wanted)}</span></div>
      <div><strong>Objective:</strong> ${m ? m.label : 'Generating...'}</div>
    `;

    if (!this.map) {
      this.map = document.createElement('canvas');
      this.map.width = 120;
      this.map.height = 120;
      this.map.style.marginTop = '8px';
      this.map.style.border = '1px solid rgba(120,190,255,.35)';
      this.map.style.borderRadius = '8px';
    }
    this.el.appendChild(this.map);

    const ctx = this.map.getContext('2d');
    ctx.fillStyle = '#08101d';
    ctx.fillRect(0, 0, 120, 120);
    const s = 120 / this.cfg.worldSize;

    const dot = (x, z, c, r = 2) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc((x + this.cfg.worldSize / 2) * s, (z + this.cfg.worldSize / 2) * s, r, 0, Math.PI * 2);
      ctx.fill();
    };

    dot(meta.player?.x || 0, meta.player?.z || 0, '#56d8ff', 3);
    (meta.cops || []).slice(0, 14).forEach((p) => dot(p.x, p.z, '#ff6f8a', 2));
    (meta.vehicles || []).slice(0, 18).forEach((p) => dot(p.x, p.z, '#f7d07e', 1.5));
    if (meta.mission) dot(meta.mission.x, meta.mission.z, '#4cff9c', 3);
  }
}
