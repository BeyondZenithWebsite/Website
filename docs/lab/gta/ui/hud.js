export class HUD {
  constructor(player, mission) {
    this.player = player;
    this.mission = mission;
    this.el = document.getElementById('hud');
  }

  stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  render() {
    if (!this.el) return;
    const m = this.mission.current;
    this.el.innerHTML = `
      <div><strong>Health:</strong> ${Math.max(0, this.player.health | 0)}%</div>
      <div><strong>Money:</strong> $${this.player.cash}</div>
      <div><strong>Wanted:</strong> <span style="color:#ff7185">${this.stars(this.player.wanted)}</span></div>
      <div><strong>Objective:</strong> ${m ? m.label : 'Generating...'}</div>
    `;
  }
}
