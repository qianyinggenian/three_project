<script>
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

let stats, gui;
let camera, scene, renderer;
let controls, water, sun, mesh;
export default {
  components: {},
  data () {
    return {};
  },
  props: {},
  computed: {},
  watch: {},
  created () {},
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(this.$refs.webglRef.clientWidth, this.$refs.webglRef.clientHeight);
      renderer.setAnimationLoop(this.animate);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      this.$refs.webglRef.appendChild(renderer.domElement);

      //

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(55, this.$refs.webglRef.clientWidth / this.$refs.webglRef.clientHeight, 1, 20000);
      camera.position.set(30, 30, 100);

      //

      sun = new THREE.Vector3();

      // Water

      const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

      water = new Water(
        waterGeometry,
        {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load('/static/textures/waternormals.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          }),
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: scene.fog !== undefined
        }
      );

      water.rotation.x = -Math.PI / 2;

      scene.add(water);

      // Skybox

      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      const skyUniforms = sky.material.uniforms;

      skyUniforms.turbidity.value = 10;
      skyUniforms.rayleigh.value = 2;
      skyUniforms.mieCoefficient.value = 0.005;
      skyUniforms.mieDirectionalG.value = 0.8;

      const parameters = {
        elevation: 2,
        azimuth: 180
      };

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const sceneEnv = new THREE.Scene();

      let renderTarget;

      function updateSun () {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms.sunPosition.value.copy(sun);
        water.material.uniforms.sunDirection.value.copy(sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        sceneEnv.add(sky);
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        scene.add(sky);

        scene.environment = renderTarget.texture;
      }

      updateSun();

      //

      const geometry = new THREE.BoxGeometry(30, 30, 30);
      const material = new THREE.MeshStandardMaterial({ roughness: 0 });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      //

      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();

      //

      stats = new Stats();
      stats.dom.style.position = 'absolute'; // 设置为绝对定位
      stats.dom.style.top = '10px'; // 调整顶部距离
      stats.dom.style.left = '10px'; // 调整左侧距离
      // this.stats.dom.style.zIndex = '100'; // 确保在最上层
      this.$refs.webglRef.appendChild(stats.dom);

      // GUI

      gui = new GUI();

      const folderSky = gui.addFolder('Sky');
      folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
      folderSky.add(parameters, 'azimuth', -180, 180, 0.1).onChange(updateSun);
      folderSky.open();

      const waterUniforms = water.material.uniforms;

      const folderWater = gui.addFolder('Water');
      folderWater.add(waterUniforms.distortionScale, 'value', 0, 100, 0.1).name('distortionScale').onChange(this.render);
      folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
      folderWater.open();

      //

      window.addEventListener('resize', this.onWindowResize);
    },
    onWindowResize () {
      camera.aspect = this.$refs.webglRef.clientWidth / this.$refs.webglRef.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(this.$refs.webglRef.clientWidth, this.$refs.webglRef.clientHeight);
    },
    animate () {
      this.render();
      stats.update();
    },
    render () {
      const time = performance.now() * 0.001;

      mesh.position.y = Math.sin(time) * 20 + 5;
      mesh.rotation.x = time * 0.5;
      mesh.rotation.z = time * 0.51;

      water.material.uniforms.time.value += 1.0 / 60.0;

      renderer.render(scene, camera);
    },

    destroyGUI () {
      if (gui) {
        gui.destroy(); // 销毁 dat.GUI 实例
        gui = null;
      }
    }
  },
  beforeDestroy () {
    this.destroyGUI();
  }
};
</script>

<template>
<div class="container" id="container" ref="webglRef"></div>
</template>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
