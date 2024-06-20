<template>
  <div ref="webglRef" id="webgl-output" class="webglRef"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getResourcePath } from '@/common/js/utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// let water;
let renderer;
let scene;
let camera;
let controls;
let directionalLight;
export default {
  name: 'index',
  components: {},
  data () {
    return {
      scene: null,
      // camera: null,
      controls: null,
      // renderer: null,
      webglRef: null
    };
  },
  props: {},
  watch: {},
  computed: {},
  mounted () {
    this.init();
  },
  methods: {
    init () {
      const el = this.$refs.webglRef;
      scene = new THREE.Scene();
      // 设置摄像机
      camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 1, 20000);
      // 创建渲染器
      renderer = new THREE.WebGLRenderer({
        antialias: true
        // logarithmicDepthBuffer: true
      });
      // 设置渲染器的初始颜色
      renderer.setClearColor(new THREE.Color(0x87ceeb));
      // 设置输出canvas画面的大小
      renderer.setSize(el.clientWidth, el.clientHeight);
      //   设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.physicallyCorrectLights = true;
      renderer.outputEncoding = THREE.sRGBEncoding;
      // 设置渲染物体阴影
      renderer.shadowMap.enabled = true;

      // 定位相机，并且指向场景中心
      // camera.position.set(0, 339.5358612533638, 807.6822095787198);
      camera.position.set(125.7512205654842, 57.58951477003565, 701.0900594107068);
      // camera.position.set(200, 500, 250);
      camera.lookAt(scene.position);
      // 将渲染器输出添加html元素中
      el.appendChild(renderer.domElement);
      renderer.render(scene, camera);
      // 创建controls对象;
      this.addControls();
      this.addAxesHelper();
      this.addBridge();
      this.addAmbientLight();
      this.addDirectionalLight();
      const render = () => {
        controls.update();
        renderer.render(scene, camera);
        this.updateLightDirection();
        requestAnimationFrame(render);
      };
      render();
    },
    addBridge () {
      const dracoLoader = new DRACOLoader();
      const dracoUrl = getResourcePath('/static/draco/gltf/', 'three_project');
      dracoLoader.setDecoderPath(dracoUrl);

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      const glbUrl = getResourcePath('/static/digital/models/洪奇沥大桥.gltf', 'three_project');
      // loader.load('/static/models/gltf/LittlestTokyo.glb', function (gltf) {
      loader.load(glbUrl, function (gltf) {
        const model = gltf.scene;
        // model.position.set(1, 1, 1);
        // model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);
      }, undefined, function (e) {
        console.error(e);
      });
    },
    addControls () {
      controls = new OrbitControls(camera, renderer.domElement);
      // controls.maxPolarAngle = Math.PI * 0.495;
      // controls.target.set(50, 250, 250);
      controls.target.set(0, 0, 0);
      // controls.minDistance = 5.0;
      // controls.maxDistance = 500.0;
    },
    addAxesHelper () {
      const axes = new THREE.AxesHelper(20000);
      // 添加坐标系到场景中
      scene.add(axes);
      const material1 = new THREE.LineBasicMaterial({
        color: 0xff9881
      });
      const points1 = [];
      points1.push(new THREE.Vector3(0, 0, 0));
      points1.push(new THREE.Vector3(-2000, 0, 0));

      const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);

      const line1 = new THREE.Line(geometry1, material1);
      scene.add(line1);
      const material2 = new THREE.LineBasicMaterial({
        color: 0x073d8d
      });

      const points2 = [];
      points2.push(new THREE.Vector3(0, 0, 0));
      points2.push(new THREE.Vector3(0, 0, -2000));

      const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);

      const line2 = new THREE.Line(geometry2, material2);
      scene.add(line2);
    },
    addAmbientLight () {
      const light = new THREE.AmbientLight(0xeeb584); //
      light.position.set(0, 1000, 500);
      scene.add(light);
    },
    updateLightDirection () {
    },
    addDirectionalLight () {
      directionalLight = new THREE.DirectionalLight(0xeeb584, 1);
      directionalLight.position.set(300, -100, 300);
      const directionalLight2 = new THREE.DirectionalLight(0xeeb584, 1);
      directionalLight2.position.set(10, 250, -500);
      scene.add(directionalLight);
      scene.add(directionalLight2);
    }
  }
};
</script>

<style lang="scss" scoped>
.webglRef {
  width: 887px;
  height: 531px;
}
</style>
