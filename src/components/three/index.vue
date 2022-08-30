<template>
  <div></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'index',
  data () {
    return {};
  },
  mounted () {
    this.initThree();
  },
  methods: {
    initThree () {
      // 创建场景
      const scene = new THREE.Scene();
      // 创建相机
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      // 设置相机位置
      camera.position.set(0, 0, 10);
      // 将相机加入场景中
      scene.add(camera);
      // 添加物体
      // 创建几何体
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      // 修改物体的位置
      // cube.position.set(5, 0, 0);
      // cube.position.x = 3;
      // 缩放
      // cube.scale.set(3, 2, 1);
      // 旋转
      cube.rotation.set(Math.PI / 4, 0, 0);
      scene.add(cube);
      // 添加渲染器
      const renderer = new THREE.WebGLRenderer();
      // 设置渲染器大小
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 将webgl渲染的canvas内容添加值body
      document.body.appendChild(renderer.domElement);
      // 使用渲染器，通过相机将场景渲染进来
      renderer.render(scene, camera);
      // 创建轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      console.log(controls);
      // 添加坐标轴
      const axesHelper = new THREE.AxesHelper(30);
      scene.add(axesHelper);

      function render () {
        cube.position.x += 0.01;
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        if (cube.position.x > 5) {
          cube.position.x = 0;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }

      render();
    }
  }
};
</script>

<style scoped>

</style>
