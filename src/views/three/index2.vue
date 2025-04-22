<template>
  <div ref="container" class="viewer-container"></div>
</template>

<script>
import * as THREE from 'three';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

export default {
  name: 'IFCViewer',
  data () {
    return {
      scene: null,
      camera: null,
      renderer: null,
      ifcLoader: null
    };
  },
  async mounted () {
    await this.initScene();
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.renderer) {
      this.renderer.dispose();
    }
  },
  methods: {
    async initScene () {
      // 初始化 Three.js 场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x8cc7de);

      // 初始化相机
      // this.camera = new THREE.PerspectiveCamera(
      //   75,
      //   this.$refs.container.clientWidth / this.$refs.container.clientHeight,
      //   0.1,
      //   1000
      // );
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = -70;
      this.camera.position.y = 25;
      this.camera.position.x = 90;
      // this.camera.position.set(5, 5, 5);
      this.camera.lookAt(0, 0, 0);
      // Lights
      const directionalLight1 = new THREE.DirectionalLight(0xffeeff, 2.5);
      directionalLight1.position.set(1, 1, 1);
      this.scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
      directionalLight2.position.set(-1, 0.5, -1);
      this.scene.add(directionalLight2);

      const ambientLight = new THREE.AmbientLight(0xffffee, 0.75);
      this.scene.add(ambientLight);
      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(
        this.$refs.container.clientWidth,
        this.$refs.container.clientHeight
      );
      this.$refs.container.appendChild(this.renderer.domElement);

      // 初始化 IFC 加载器
      this.ifcLoader = new IFCLoader();

      await this.ifcLoader.ifcManager.setWasmPath('static/web-ifc/'); // WASM 文件必须在 public/

      // 加载 IFC 模型
      await this.loadIFCModel();
    },

    async loadIFCModel () {
      try {
        const response = await fetch('/static/models/ifc/rac_advanced_sample_project.ifc');
        const buffer = await response.arrayBuffer();
        console.log('response', response);
        if (buffer) {
          console.log('buffer', buffer);
        }
        const model = await this.ifcLoader.parse(buffer);
        console.log('model', model);
        console.log(model.children); // 检查几何体是否存在

        // 如果需要合并几何体（示例代码）
        const geometries = model.children.map(child => child.geometry);
        const mergedGeometry = mergeBufferGeometries(geometries);
        const mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshStandardMaterial());
        this.scene.add(mergedMesh);

        this.animate();
      } catch (error) {
        console.error('加载 IFC 失败:', error);
      }
    },

    animate () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },

    onWindowResize () {
      this.camera.aspect =
          this.$refs.container.clientWidth / this.$refs.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.$refs.container.clientWidth,
        this.$refs.container.clientHeight
      );
    }
  }
};
</script>

<style>
.viewer-container {
  width: 100%;
  height: 100vh;
}
</style>
