<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { IFCSPACE } from 'web-ifc';
// import { getResourcePath } from '@/common/js/utils';
// import { getResourcePath } from '@/utils/util';
// import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader';

let scene, camera, renderer;
export default {
  name: 'index',
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    async init () {
      // Scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x8cc7de);

      // Camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = -70;
      camera.position.y = 25;
      camera.position.x = 90;

      // Initial cube
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Lights
      const directionalLight1 = new THREE.DirectionalLight(0xffeeff, 2.5);
      directionalLight1.position.set(1, 1, 1);
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5);
      directionalLight2.position.set(-1, 0.5, -1);
      scene.add(directionalLight2);

      const ambientLight = new THREE.AmbientLight(0xffffee, 0.75);
      scene.add(ambientLight);

      // Setup IFC Loader
      const ifcLoader = new IFCLoader();
      await ifcLoader.ifcManager.setWasmPath('static/web-ifc/', true);

      await ifcLoader.ifcManager.parser.setupOptionalCategories({
        [IFCSPACE]: false
      });

      await ifcLoader.ifcManager.applyWebIfcConfig({
        USE_FAST_BOOLS: true
      });

      const url = '/static/models/ifc/rac_advanced_sample_project.ifc';
      // const url = '/static/models/ifc/斜拉桥20250417-6.ifc';
      ifcLoader.load(url, (model) => {
        scene.add(model);
        this.render();
      });

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.threeContainer.appendChild(renderer.domElement);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', this.render);

      window.addEventListener('resize', this.onWindowResize);

      this.render();
    },
    onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      this.render();
    },
    render () {
      renderer.render(scene, camera);
    }
  }
};
</script>

<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<style scoped lang="scss">
.three-container {
  height: 100%;
  width: 100%;
}
</style>
