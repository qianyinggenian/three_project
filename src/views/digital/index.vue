<template>
  <div ref="webglRef" id="webgl-output" class="webglRef"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { Water } from 'three/examples/jsm/objects/Water';
// import { Sky } from 'three/examples/jsm/objects/Sky';
// import Stats from 'three/examples/jsm/libs/stats.module';
// import * as dat from 'dat.gui';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getResourcePath } from '@/common/js/utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// let water;
let renderer;
let scene;
let camera;
let plane;
let controls;
const mouse = {};
let intersects;
let mixer;
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
      // this.addShape();
      el.addEventListener(
        'pointerdown',
        this.onDocumentMouseDownHandle,
        false
      );

      // 定位相机，并且指向场景中心
      // camera.position.set(0, 339.5358612533638, 807.6822095787198);
      camera.position.set(125.7512205654842, 57.58951477003565, 701.0900594107068);
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
      // this.addSpotLight();
      function render () {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      window.addEventListener('resize', this.onWindowResize);
      render();
    },
    addBridge () {
      const dracoLoader = new DRACOLoader();
      const dracoUrl = getResourcePath('/static/draco/gltf/', 'three_project');
      dracoLoader.setDecoderPath(dracoUrl);

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      const glbUrl = getResourcePath('/static/digital/models/洪奇门大桥全貌Draco.gltf', 'three_project');
      // loader.load('/static/models/gltf/LittlestTokyo.glb', function (gltf) {
      loader.load(glbUrl, function (gltf) {
        const model = gltf.scene;
        // model.position.set(1, 1, 1);
        // model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
      }, undefined, function (e) {
        console.error(e);
      });
    },
    addControls () {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      // controls.minDistance = 5.0;
      controls.maxDistance = 500.0;
    },
    onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
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
    /**
     * @Description 鼠标点击触发
     * @author wangkangzhang
     * @date 2023/12/12
    */
    onDocumentMouseDownHandle (e) {
      console.log(e);
      console.log('camera', camera);
      console.log('plane', plane);
      this.getIntersects(e);
    },
    getIntersects (event) {
      event.preventDefault();
      // 将鼠标地位归一化为设施坐标。x 和 y 方向的取值范畴是 (-1 to +1)
      // renderer为three的渲染器
      const px = renderer.domElement.getBoundingClientRect().left;
      const py = renderer.domElement.getBoundingClientRect().top;
      mouse.x = ((event.clientX - px) / renderer.domElement.offsetWidth) * 2 - 1;
      mouse.y = -((event.clientY - py) / renderer.domElement.offsetHeight) * 2 + 1;
      const vector2 = new THREE.Vector2(mouse.x, mouse.y);
      console.log(vector2, vector2);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(vector2, camera);
      intersects = raycaster.intersectObjects(scene.children, true);
      console.log('intersects', intersects[0]);
    },
    addAmbientLight () {
      const light = new THREE.AmbientLight(0xffffff); // 柔和的白光
      scene.add(light);
    },
    addDirectionalLight () {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(directionalLight);
    },
    /**
     * @Description 添加聚光灯
     * @author wangkangzhang
     * @date 2023/12/12
     */
    addSpotLight () {
      // 创建聚光灯
      var spotLight = new THREE.SpotLight(0xFFFFFF);
      spotLight.position.set(130, 130, -130);
      spotLight.castShadow = true;
      spotLight.angle = Math.PI / 4;
      spotLight.shadow.penumbra = 0.05;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.innerHeight = 1024;
      // 添加聚光灯
      scene.add(spotLight);
    }
  }
};
</script>

<style lang="scss" scoped>
.webglRef {
  width: 100%;
  height: 100%;
}
</style>
