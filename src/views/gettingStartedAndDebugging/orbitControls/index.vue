<template>
<div id="container" class="container"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export default {
  name: 'index',
  components: {},
  data () {
    return {};
  },
  props: {},
  watch: {},
  computed: {},
  mounted () {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init () {
      const el = document.getElementById('container');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        el.clientWidth / el.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 10);
      scene.add(camera);
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.scale.set(3, 3, 3);
      cube.rotation.set(-Math.PI / 4, 0, 0, 'XZY');
      scene.add(cube);
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      });
      renderer.setSize(el.clientWidth, el.clientHeight);
      el.appendChild(renderer.domElement);

      // 创建轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      // scene.add(controls);
      // 添加坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
      // 箭头
      const dir = new THREE.Vector3(5, 0, 0);

      // normalize the direction vector (convert to vector of length 1)
      dir.normalize();

      const origin = new THREE.Vector3(5, 0, 0);
      const length = 1;
      const hex = 0xffff00;

      const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
      scene.add(arrowHelper);
      function render () {
        controls.update();
        cube.position.x += 0.01;
        cube.rotation.x += 0.01;
        if (cube.position.x > 5) {
          cube.position.x = 0;
        }
        renderer.render(scene, camera);
        //   渲染下一帧的时候就会调用render函数
        requestAnimationFrame(render);
      }

      render();
      window.addEventListener('resize', () => {
        //   console.log("画面变化了");
        // 更新摄像头
        camera.aspect = el.clientWidth / el.clientHeight;
        //   更新摄像机的投影矩阵
        camera.updateProjectionMatrix();

        //   更新渲染器
        renderer.setSize(el.clientWidth, el.clientHeight);
        //   设置渲染器的像素比
        renderer.setPixelRatio(window.devicePixelRatio);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
