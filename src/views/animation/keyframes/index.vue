<template>
 <div id="container" ref="keyframes" class="keyframes">
 </div>
</template>

<script>
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import { getResourcePath } from "@/common/js/utils";

export default {
  name: 'index',
  components: {},
  data () {
    return {};
  },
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
      let mixer;

      const clock = new THREE.Clock();
      const container = document.getElementById('container');
      const el = container;

      const stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '5px';
      stats.domElement.style.top = '5px';
      container.appendChild(stats.dom);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(el.clientWidth, el.clientHeight);
      container.appendChild(renderer.domElement);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xbfe3dd);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
      const light = new THREE.AmbientLight(0xffffff); // 柔和的白光
      scene.add(light);
      const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 1, 100);
      camera.position.set(5, 2, 8);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.5, 0);
      controls.update();
      controls.enablePan = false;
      controls.enableDamping = true;

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/static/draco/gltf/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      const url = '/static/models/gltf/LittlestTokyo.glb';
      // const glbUrl = getResourcePath('/static/models/gltf/LittlestTokyo.glb');
      const glbUrl = process.env.NODE_ENV === 'production' ? `/three_project/${url}` : url;
      // loader.load('/static/models/gltf/LittlestTokyo.glb', function (gltf) {
      loader.load(glbUrl, function (gltf) {
        const model = gltf.scene;
        model.position.set(1, 1, 1);
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        animate();
      }, undefined, function (e) {
        console.error(e);
      });

      window.onresize = function () {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(el.clientWidth, el.clientHeight);
      };

      function animate () {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        mixer.update(delta);

        controls.update();

        stats.update();

        renderer.render(scene, camera);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.keyframes {
  width: 100%;
  height: 100%;
}
</style>
