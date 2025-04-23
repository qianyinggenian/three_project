<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { IFCSPACE } from 'web-ifc';
// import { getResourcePath } from '@/common/js/utils';
// import { getResourcePath } from '@/utils/util';
// import { IFCLoader } from 'three/examples/jsm/loaders/IFCLoader';

let scene, camera, renderer, controls;
let gui;
let ambientLight, directionalLight1, directionalLight2;
export default {
  name: 'index',
  data () {
    return {
      fileName: ''
    };
  },
  mounted () {
    this.$nextTick(() => {
      console.log('clientWidth', this.$refs.threeContainer.clientWidth);
      console.log('clientHeight', this.$refs.threeContainer.clientHeight);
      // this.init();
    });
  },
  methods: {
    async init () {
      // Scene
      if (!scene) {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x8cc7de);
        this.addAxesHelper();
        // Camera
        camera = new THREE.PerspectiveCamera(45, this.$refs.threeContainer.clientWidth / this.$refs.threeContainer.clientHeight, 0.1, 1000);
        camera.position.z = -70;
        camera.position.y = 25;
        camera.position.x = 90;

        // Initial cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Lights
        directionalLight1 = new THREE.DirectionalLight(0xffeeff, 1);
        directionalLight1.position.set(1, 1, 1);
        scene.add(directionalLight1);

        directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight2.position.set(-1, 0.5, -1);
        scene.add(directionalLight2);

        ambientLight = new THREE.AmbientLight(0xffffee, 0.75);
        scene.add(ambientLight);

        window.addEventListener('resize', this.onWindowResize);
      }

      // Setup IFC Loader
      const ifcLoader = new IFCLoader();
      // await ifcLoader.ifcManager.setWasmPath('static/web-ifc/');
      const webIfcUrl = 'static/web-ifc/';
      await ifcLoader.ifcManager.setWasmPath(webIfcUrl);

      await ifcLoader.ifcManager.parser.setupOptionalCategories({
        [IFCSPACE]: false
      });

      await ifcLoader.ifcManager.applyWebIfcConfig({
        USE_FAST_BOOLS: true
      });

      // const url = '/static/models/ifc/rac_advanced_sample_project.ifc';
      const url = this.previewPath;
      // const url = '/static/models/ifc/斜拉桥20250417-6.ifc';
      // 显示加载进度
      const loadingContainer = document.createElement('div');
      loadingContainer.style.position = 'absolute';
      loadingContainer.style.top = '50px';
      loadingContainer.style.left = '10px';
      loadingContainer.style.color = '#fff';
      loadingContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      loadingContainer.style.padding = '10px';
      loadingContainer.style.borderRadius = '5px';
      loadingContainer.style.zIndex = '1000';
      this.$refs.threeContainer.appendChild(loadingContainer);

      const loadingText = document.createElement('div');
      loadingText.innerText = 'Loading: 0%';
      loadingContainer.appendChild(loadingText);
      ifcLoader.load(url, (model) => {
        scene.add(model);
        // 将相机目标点设置为模型的中心
        // const boundingBox = new THREE.Box3().setFromObject(model); // 获取模型的包围盒
        // const center = new THREE.Vector3();
        // boundingBox.getCenter(center); // 计算模型的中心点
        // controls.target.copy(center); // 设置目标点为模型的中心
        // controls.update(); // 确保控件更新
        // 隐藏加载进度
        loadingContainer.style.display = 'none';

        this.render();
        // 初始化 GUI
        this.initGUI();
      }, (xhr) => {
        console.log('xhr', xhr);
        // 更新加载进度
        if (xhr.total > 0) {
          const progress = Math.round((xhr.loaded / xhr.total) * 100);
          loadingText.innerText = `Loading: ${progress}%`;
        } else {
          loadingText.innerText = 'Loading...'; // 当无法确定总大小时，显示加载中...
        }
      },
      (error) => {
        console.error('Error loading model:', error);
        loadingText.innerText = 'Error loading model!';
      });

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(this.$refs.threeContainer.clientWidth, this.$refs.threeContainer.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.threeContainer.appendChild(renderer.domElement);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener('change', this.render);

      this.render();
    },
    onWindowResize () {
      camera.aspect = this.$refs.threeContainer.clientWidth / this.$refs.threeContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(this.$refs.threeContainer.clientWidth, this.$refs.threeContainer.clientHeight);

      this.render();
    },
    render () {
      renderer.render(scene, camera);
    },
    addAxesHelper () {
      // 添加辅助坐标系
      const axesHelper = new THREE.AxesHelper(50000); // 坐标轴长度为 5
      scene.add(axesHelper);
    },
    initGUI () {
      // 创建 GUI
      gui = new GUI();

      // 添加调试选项：模型位置
      // const modelFolder = gui.addFolder('Model Position');
      // modelFolder.add(model.position, 'x', -100, 100).name('Position X').onChange(this.render);
      // modelFolder.add(model.position, 'y', -100, 100).name('Position Y').onChange(this.render);
      // modelFolder.add(model.position, 'z', -100, 100).name('Position Z').onChange(this.render);
      // modelFolder.open();

      // 添加调试选项：相机位置
      const cameraFolder = gui.addFolder('Camera Position');
      cameraFolder.add(camera.position, 'x', -2000, 2000).name('Position X').step(0.01).onChange(this.render);
      cameraFolder.add(camera.position, 'y', -2000, 2000).name('Position Y').step(0.01).onChange(this.render);
      cameraFolder.add(camera.position, 'z', -2000, 2000).name('Position Z').step(0.01).onChange(this.render);
      cameraFolder.open();

      // 添加调试选项：相机目标点
      const targetFolder = gui.addFolder('Camera Target');
      const target = new THREE.Vector3(); // 创建一个目标点向量
      controls.target.copy(target); // 初始化目标点
      targetFolder.add(target, 'x', -2000, 2000).name('Target X').step(0.01).onChange(() => {
        controls.target.copy(target); // 更新目标点
        controls.update();
        this.render();
      });
      targetFolder.add(target, 'y', -2000, 2000).name('Target Y').step(0.01).onChange(() => {
        controls.target.copy(target);
        controls.update();
        this.render();
      });
      targetFolder.add(target, 'z', -2000, 2000).name('Target Z').step(0.01).onChange(() => {
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
      light1Folder.add(directionalLight1.position, 'x', -10, 10).name('Position X').onChange(this.render);
      light1Folder.add(directionalLight1.position, 'y', -10, 10).name('Position Y').onChange(this.render);
      light1Folder.add(directionalLight1.position, 'z', -10, 10).name('Position Z').onChange(this.render);
      light1Folder.add(directionalLight1, 'intensity', 0, 5).name('Intensity').step(0.1).onChange(this.render);
      light1Folder.open();

      // 添加调试选项：DirectionalLight2 的颜色
      const light2Folder = gui.addFolder('Directional Light 2');
      const light2Color = { color: '#ffffff' }; // 初始颜色（十六进制字符串）
      light2Folder.addColor(light2Color, 'color').name('Color').onChange((value) => {
        directionalLight2.color.set(value); // 更新光源颜色
        this.render();
      });
      light2Folder.add(directionalLight2.position, 'x', -10, 10).name('Position X').onChange(this.render);
      light2Folder.add(directionalLight2.position, 'y', -10, 10).name('Position Y').onChange(this.render);
      light2Folder.add(directionalLight2.position, 'z', -10, 10).name('Position Z').onChange(this.render);
      light2Folder.add(directionalLight2, 'intensity', 0, 5).name('Intensity').step(0.1).onChange(this.render);
      light2Folder.open();

      // 添加调试选项：AmbientLight 的颜色和强度
      const ambientLightFolder = gui.addFolder('Ambient Light');
      const ambientLightColor = { color: '#ffffee' }; // 初始颜色（十六进制字符串）
      ambientLightFolder.addColor(ambientLightColor, 'color').name('Color').onChange((value) => {
        ambientLight.color.set(value); // 更新环境光颜色
        this.render();
      });
      ambientLightFolder.add(ambientLight, 'intensity', 0, 2).name('Intensity').step(0.1).onChange(this.render);
      ambientLightFolder.open();
    },
    handlePreview (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = async (e) => {
        this.previewPath = e.target.result; // data:image/png;base64...:ml-citation{ref="4,7" data="citationList"}

        this.cleanupScene();
        this.destroyGUI();
        await this.init();
        if (gui) {
          gui.destroy();
        }
      };
      reader.readAsDataURL(file);
      return false; // 阻止自动上传
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

      window.removeEventListener('resize', this.onWindowResize);
    },
    destroyGUI () {
      if (gui) {
        // const container = this.$refs.threeContainer;
        // container.removeChild(gui.domElement); // 移除 GUI 的 DOM 元素
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

<template>
  <div class="container">
   <div class="upload-container">
     <el-upload action="" :before-upload="handlePreview" accept=".ifc">
       <el-button type="primary" size="small">上传文件</el-button>
     </el-upload>
     <span class="fileName">模型名称：{{fileName}}</span>
   </div>

    <div ref="threeContainer" class="three-container"></div>
  </div>
</template>

<style scoped lang="scss">
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
  }
  .three-container {
    height: calc(100% - 50px);
    width: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
}
</style>
