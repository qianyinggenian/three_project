<template>
  <div class="server-room">
    <div class="panel">
      机房服务器状态：正常浅绿 / 故障红色闪烁 / 离线灰色
    </div>

    <div class="buttons">
      <button @click="setStatus('server-01', 'normal')">server-01 正常</button>
      <button @click="setStatus('server-01', 'fault')">server-01 故障</button>
      <button @click="setStatus('server-02', 'offline')">server-02 离线</button>
      <button @click="setStatus('server-02', 'normal')">server-02 正常</button>
      <button @click="setStatus('server-03', 'fault')">server-03 故障</button>
      <button @click="recoverAll">全部恢复</button>
    </div>

    <div ref="sceneContainer" class="scene-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const STATUS_COLORS = {
  normal: 0x6ee7a6,
  fault: 0xf53f3f,
  offline: 0x9ca3af
};

const FAULT = {
  baseEmissive: 0x330000,
  peakEmissive: 0xff2222,
  minIntensity: 0.35,
  maxIntensity: 1,

  bodySpeed: 3.2,
  haloSpeed: 1.6,
  haloPhase: 0.6,

  haloColor: 0xff2222,
  haloMinScale: 1.6,
  haloMaxScale: 2.6,
  haloMinOpacity: 0.25,
  haloMaxOpacity: 0.85
};

export default {
  name: 'ServerRoom',

  data () {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      serverMap: new Map(),
      faultServers: new Set(),
      clock: new THREE.Clock(),
      animationId: null
    };
  },

  mounted () {
    this.$nextTick(() => {
      this.initScene();
    });
  },

  beforeDestroy () {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', this.handleResize);

    if (this.controls) {
      this.controls.dispose();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.scene) {
      this.scene.clear();
    }

    this.serverMap.clear();
    this.faultServers.clear();
  },

  methods: {
    initScene () {
      const container = this.$refs.sceneContainer;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b0f19);
      this.scene = scene;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(8, 6, 10);
      this.camera = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      this.renderer = renderer;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      this.controls = controls;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({ color: 0x0f1724, roughness: 0.9 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.6;
      scene.add(floor);

      const servers = [
        { id: 'server-01', x: -3 },
        { id: 'server-02', x: 0 },
        { id: 'server-03', x: 3 }
      ];

      servers.forEach((s) => {
        this.createServer(s.id, { position: { x: s.x, y: 0, z: 0 } });
      });

      this.setStatus('server-01', 'normal');
      this.setStatus('server-02', 'offline');
      this.setStatus('server-03', 'normal');

      window.addEventListener('resize', this.handleResize);
      this.animate();
    },

    createHalo () {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 60, 60, 0)');
      gradient.addColorStop(0.35, 'rgba(255, 60, 60, 0.9)');
      gradient.addColorStop(0.7, 'rgba(255, 40, 40, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({
        map: texture,
        color: FAULT.haloColor,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending
      });

      const sprite = new THREE.Sprite(material);
      sprite.renderOrder = 999;
      sprite.scale.set(FAULT.haloMinScale, FAULT.haloMinScale, 1);
      return sprite;
    },

    createServer (id, options = {}) {
      const {
        width = 1.1,
        height = 0.6,
        depth = 1.8,
        position = { x: 0, y: 0, z: 0 }
      } = options;

      const geometry = new THREE.BoxGeometry(width, height, depth);

      const material = new THREE.MeshStandardMaterial({
        color: STATUS_COLORS.offline,
        metalness: 0.3,
        roughness: 0.55,
        emissive: 0x000000,
        emissiveIntensity: 0
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position.x, position.y, position.z);
      mesh.userData.id = id;
      mesh.userData.status = 'offline';

      const halo = this.createHalo();
      halo.position.set(
        position.x,
        position.y + height * 0.5 + 0.05,
        position.z
      );
      halo.visible = false;
      this.scene.add(halo);

      mesh.userData.halo = halo;

      this.serverMap.set(id, mesh);
      this.scene.add(mesh);
      return mesh;
    },

    setStatus (id, status) {
      const mesh = this.serverMap.get(id);
      if (!mesh) return;

      const color = STATUS_COLORS[status];
      if (!color) {
        console.warn('未知服务器状态:', status);
        return;
      }

      mesh.userData.status = status;

      const material = mesh.material;
      if (!material) return;

      material.color.set(color);

      const halo = mesh.userData.halo;

      if (status === 'fault') {
        this.faultServers.add(id);
        material.emissive.set(FAULT.baseEmissive);
        material.emissiveIntensity = FAULT.minIntensity;

        if (halo) {
          halo.visible = true;
          halo.material.color.set(FAULT.haloColor);
        }
      } else {
        this.faultServers.delete(id);
        material.emissive.set(0x000000);
        material.emissiveIntensity = 0;

        if (halo) {
          halo.visible = false;
        }
      }
    },

    animateFaultPulse () {
      if (this.faultServers.size === 0) return;

      const t = this.clock.getElapsedTime();

      const bodyPulse =
          FAULT.minIntensity +
          (FAULT.maxIntensity - FAULT.minIntensity) *
          (Math.sin(t * FAULT.bodySpeed) * 0.5 + 0.5);

      const base = new THREE.Color(FAULT.baseEmissive);
      const peak = new THREE.Color(FAULT.peakEmissive);
      const emissive = base.clone().lerp(peak, bodyPulse);

      const haloPulse =
          Math.sin(t * FAULT.haloSpeed + FAULT.haloPhase) * 0.5 + 0.5;

      const haloScale =
          FAULT.haloMinScale +
          (FAULT.haloMaxScale - FAULT.haloMinScale) * haloPulse;

      const haloOpacity =
          FAULT.haloMinOpacity +
          (FAULT.haloMaxOpacity - FAULT.haloMinOpacity) * haloPulse;

      for (const id of this.faultServers) {
        const mesh = this.serverMap.get(id);
        if (!mesh?.material) continue;

        mesh.material.emissive.copy(emissive);
        mesh.material.emissiveIntensity = bodyPulse;

        const halo = mesh.userData.halo;
        if (halo && halo.visible) {
          halo.scale.set(haloScale, haloScale, 1);
          halo.material.opacity = haloOpacity;
        }
      }
    },

    animate () {
      this.animationId = requestAnimationFrame(this.animate);

      this.animateFaultPulse();
      if (this.controls) {
        this.controls.update();
      }
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },

    handleResize () {
      const container = this.$refs.sceneContainer;
      if (!container || !this.camera || !this.renderer) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    },

    recoverAll () {
      for (const id of this.serverMap.keys()) {
        this.setStatus(id, 'normal');
      }
    }
  }
};
</script>

<style scoped>
.server-room {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0b0f19;
}

.scene-container {
  width: 100%;
  height: 100%;
}

.panel {
  position: fixed;
  top: 56px;
  left: 256px;
  color: #d0d8e8;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  background: rgba(10, 16, 30, 0.85);
  padding: 10px 14px;
  border-radius: 8px;
  z-index: 10;
}

.buttons {
  position: fixed;
  top: 100px;
  left: 256px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

button {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: #1e293b;
  color: #e2e8f0;
  cursor: pointer;
}

button:hover {
  background: #334155;
}
</style>
