<template>
  <div class="container">
    <div class="upload-container">
      <div class="tabs-box">
        <div class="tab"
             v-for="(item,index) in tabs"
             :key="index"
             :class="activeTab === item.value ? 'active-tab': ''"
             @click="handleClickTab(item)"
        >
          {{ item.label }}</div>
      </div>
      <el-upload action="" :before-upload="handlePreview" v-if="activeTab === '动态'">
        <el-button type="primary" size="small">上传文件</el-button>
      </el-upload>
      <span class="fileName">模型名称：{{fileName}}</span>
    </div>

    <div ref="webglRef" id="webgl-output" class="three-container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { getResourcePath } from '@/common/js/utils';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
// let water;
let renderer;
let scene;
let camera;
let controls;
let directionalLight1, directionalLight2, ambientLight;
let gui;
export default {
  name: 'index',
  components: {},
  data () {
    return {
      tabs: [
        {
          label: '默认',
          value: '默认'
        },
        {
          label: '动态',
          value: '动态'
        }
      ],
      scene: null,
      // camera: null,
      controls: null,
      // renderer: null,
      webglRef: null,
      fileName: '洪奇沥大桥.gltf',
      activeTab: '默认'
    };
  },
  props: {},
  watch: {},
  computed: {},
  mounted () {
    // this.init();
    if (this.activeTab === '默认') {
      this.init();
    }
  },
  methods: {
    handleClickTab (item) {
      this.activeTab = item.value;
      this.cleanupScene();
      this.destroyGUI();
      if (this.activeTab === '默认') {
        this.$nextTick(() => {
          this.init();
        });
      }
    },
    init () {
      if (!scene) {
        const el = this.$refs.webglRef;
        scene = new THREE.Scene();
        // 设置摄像机
        camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 1, 20000);
        // 创建渲染器
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          logarithmicDepthBuffer: true
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
      }
      // 创建controls对象;
      this.addControls();
      this.addAxesHelper();
      this.addBridge();
      this.addAmbientLight();
      this.addDirectionalLight();
      this.initGUI();

      this.$nextTick(() => {
        this.render();
      });
    },
    render () {
      controls && controls.update();
      renderer && renderer.render(scene, camera);
      requestAnimationFrame(this.render);
    },
    addBridge () {
      const dracoLoader = new DRACOLoader();
      const dracoUrl = getResourcePath('/static/draco/gltf/', 'three_project');
      dracoLoader.setDecoderPath(dracoUrl);

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      let glbUrl;
      if (this.activeTab === '动态') {
        glbUrl = this.previewPath;
      } else {
        glbUrl = getResourcePath('/static/digital/models/大桥.gltf', 'three_project');
      }
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
      ambientLight = new THREE.AmbientLight(0xeeb584); //
      ambientLight.position.set(0, 1000, 500);
      scene.add(ambientLight);
    },
    addDirectionalLight () {
      directionalLight1 = new THREE.DirectionalLight(0xeeb584, 10);
      directionalLight1.position.set(300, -100, 300);
      directionalLight2 = new THREE.DirectionalLight(0xeeb584, 10);
      directionalLight2.position.set(10, 250, -500);
      scene.add(directionalLight1);
      scene.add(directionalLight2);
    },

    handlePreview (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = async (e) => {
        this.previewPath = e.target.result; // data:image/png;base64...:ml-citation{ref="4,7" data="citationList"}

        this.cleanupScene();
        this.destroyGUI();
        await this.init();
      };
      reader.readAsDataURL(file);
      return false; // 阻止自动上传
    },

    initGUI () {
      // 创建 GUI
      gui = new GUI();

      // 添加调试选项：相机位置
      const cameraFolder = gui.addFolder('Camera Position');
      cameraFolder.add(camera.position, 'x', -50000, 50000).name('Position X').step(0.01).onChange(this.render);
      cameraFolder.add(camera.position, 'y', -50000, 50000).name('Position Y').step(0.01).onChange(this.render);
      cameraFolder.add(camera.position, 'z', -50000, 50000).name('Position Z').step(0.01).onChange(this.render);
      cameraFolder.open();

      // 添加调试选项：相机目标点
      const targetFolder = gui.addFolder('Camera Target');
      const target = new THREE.Vector3(); // 创建一个目标点向量
      controls.target.copy(target); // 初始化目标点
      targetFolder.add(target, 'x', -50000, 50000).name('Target X').step(0.01).onChange(() => {
        controls.target.copy(target); // 更新目标点
        controls.update();
        this.render();
      });
      targetFolder.add(target, 'y', -50000, 50000).name('Target Y').step(0.01).onChange(() => {
        controls.target.copy(target);
        controls.update();
        this.render();
      });
      targetFolder.add(target, 'z', -50000, 50000).name('Target Z').step(0.01).onChange(() => {
        controls.target.copy(target);
        controls.update();
        this.render();
      });
      targetFolder.open();
      // 添加调试选项：DirectionalLight1 的颜色
      const light1Folder = gui.addFolder('Directional Light 1');
      const light1Color = { color: '#ffeeff' }; // 初始颜色（十六进制字符串）
      light1Folder.addColor(light1Color, 'color').name('Color').onChange((value) => {
        directionalLight1.color.set(value); // 更新光源颜色
        this.render();
      });
      light1Folder.add(directionalLight1.position, 'x', -50000, 50000).name('Position X').step(0.1).onChange(this.render);
      light1Folder.add(directionalLight1.position, 'y', -50000, 50000).name('Position Y').step(0.1).onChange(this.render);
      light1Folder.add(directionalLight1.position, 'z', -50000, 50000).name('Position Z').step(0.1).onChange(this.render);
      light1Folder.add(directionalLight1, 'intensity', 0, 20).name('Intensity').step(0.1).onChange(this.render);
      light1Folder.open();

      // 添加调试选项：DirectionalLight2 的颜色
      const light2Folder = gui.addFolder('Directional Light 2');
      const light2Color = { color: '#ffffff' }; // 初始颜色（十六进制字符串）
      light2Folder.addColor(light2Color, 'color').name('Color').onChange((value) => {
        directionalLight2.color.set(value); // 更新光源颜色
        this.render();
      });
      light2Folder.add(directionalLight2.position, 'x', -50000, 50000).name('Position X').step(0.1).onChange(this.render);
      light2Folder.add(directionalLight2.position, 'y', -50000, 50000).name('Position Y').step(0.1).onChange(this.render);
      light2Folder.add(directionalLight2.position, 'z', -50000, 50000).name('Position Z').step(0.1).onChange(this.render);
      light2Folder.add(directionalLight2, 'intensity', 0, 20).name('Intensity').step(0.1).onChange(this.render);
      light2Folder.open();

      // 添加调试选项：AmbientLight 的颜色和强度
      const ambientLightFolder = gui.addFolder('Ambient Light');
      const ambientLightColor = { color: '#ffffee' }; // 初始颜色（十六进制字符串）
      ambientLightFolder.addColor(ambientLightColor, 'color').name('Color').onChange((value) => {
        ambientLight.color.set(value); // 更新环境光颜色
        this.render();
      });
      ambientLightFolder.add(ambientLight, 'intensity', 0, 20).name('Intensity').step(0.1).onChange(this.render);
      ambientLightFolder.open();
    },
    cleanupScene () {
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
        renderer = null;
      }

      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
          if (object.texture) object.texture.dispose();
        });
        scene = null;
      }

      if (camera) {
        camera = null;
      }

      if (controls) {
        controls.dispose();
        controls = null;
      }

      // window.removeEventListener('resize', this.onWindowResize);
    },
    onWindowResize () {
      camera.aspect = this.$refs.threeContainer.clientWidth / this.$refs.threeContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(this.$refs.threeContainer.clientWidth, this.$refs.threeContainer.clientHeight);

      this.render();
    },
    destroyGUI () {
      if (gui) {
        gui.destroy(); // 销毁 dat.GUI 实例
        gui = null;
      }
    }
  },
  beforeDestroy () {
    // 销毁 GUI
    this.cleanupScene();
    this.destroyGUI();
  }
};
</script>

<style lang="scss" scoped>
.webglRef {
  width: 887px;
  height: 531px;
}
.container {
  height: 100%;
  width: 100%;
  .upload-container {
    height: 50px;
    padding-left: 16px;
    display: flex;
    align-items: center;
    .fileName {
      margin-left: 16px;
    }
    .tabs-box {
      display: flex;
      margin-right: 16px;
      .tab {
        box-sizing: border-box;
        padding: 5px 16px;
        border: 1px  solid #ccc;
        cursor: pointer;
        &:first-child {
          border-radius: 8px 0 0 8px;
        }
        &:last-child {
          border-radius: 0 8px 8px 0;
        }
      }
      .active-tab {
        background: #409eff;
        color: white;
        border: 1px  solid #409eff;
      }
    }
  }
  .three-container {
    height: calc(100% - 50px);
    width: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
}
</style>
