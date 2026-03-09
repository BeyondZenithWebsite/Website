import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class RendererEngine {
  constructor(mountEl, cfg) {
    this.cfg = cfg;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0f1b);
    this.scene.fog = new THREE.Fog(0x0a0f1b, 160, 620);

    this.camera = new THREE.PerspectiveCamera(56, cfg.width / cfg.height, 0.1, 1800);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.setSize(cfg.width, cfg.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    mountEl.innerHTML = '';
    mountEl.appendChild(this.renderer.domElement);

    const hemi = new THREE.HemisphereLight(0x8ec5ff, 0x1c2433, 0.9);
    this.scene.add(hemi);

    this.sun = new THREE.DirectionalLight(0xffffff, 1.0);
    this.sun.position.set(120, 240, 80);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.width = 1024;
    this.sun.shadow.mapSize.height = 1024;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 650;
    this.sun.shadow.camera.left = -260;
    this.sun.shadow.camera.right = 260;
    this.sun.shadow.camera.top = 260;
    this.sun.shadow.camera.bottom = -260;
    this.scene.add(this.sun);

    const ambient = new THREE.AmbientLight(0x546580, 0.45);
    this.scene.add(ambient);

    // subtle neon bloom fake (cheap)
    this.neonOrb = new THREE.Mesh(
      new THREE.SphereGeometry(22, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x4cc8ff, transparent: true, opacity: 0.045 })
    );
    this.neonOrb.position.set(-120, 36, -110);
    this.scene.add(this.neonOrb);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const w = Math.max(760, window.innerWidth - 40);
    const h = Math.max(520, Math.floor(w * 0.58));
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  follow(target) {
    const tx = target.position.x;
    const tz = target.position.z;
    const desired = new THREE.Vector3(tx + 42, 55, tz + 46);
    this.camera.position.lerp(desired, 0.08);
    this.camera.lookAt(tx, 0, tz);
  }

  render(now = performance.now()) {
    if (this.neonOrb) {
      this.neonOrb.material.opacity = 0.03 + (Math.sin(now * 0.0012) + 1) * 0.012;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
