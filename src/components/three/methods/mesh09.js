import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// 粗糙贴图，粗糙度
export default {

  initThree () {
    // 创建场景
    const scene = new THREE.Scene();
    // 创建相机
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 设置相机位置
    camera.position.set(0, 0, 10);
    // 将相机加入场景中
    scene.add(camera);
    // const menUrl = require('./../../../../dist/textures/men.jpg');
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.height = '200px';
    div.style.position = 'fixed';
    div.style.right = 0;
    div.style.top = '10px';
    div.style.color = '#fff';
    document.body.appendChild(div);
    const event = {};
    // 单张纹理图加载
    event.onLoad = function () {
      console.log('加载完成');
    };
    event.onProgress = function (url, num, total) {
      console.log('url', url);
      console.log('num', num);
      console.log('total', total);
      const value = ((num / total) * 100).toFixed(2) + '%';
      console.log('加载进度', value);
      // div.innerText = value;
      div.innerHTML = value;
    };
    event.onError = function (e) {
      console.log(e);
      console.log('图片纹理加载错误');
    };
    // 设置加载管理器
    const loadingManager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError);
    // 导入纹理
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const menUrl = require('./../textures/door/color.jpg');
    const doorColorTexture = textureLoader.load(menUrl);
    const alphaUrl = require('./../textures/door/alpha.jpg');
    const doorAlphaTexture = textureLoader.load(alphaUrl);
    const doorAOUrl = require('./../textures/door/ambientOcclusion.jpg');
    const doorAOTexture = textureLoader.load(doorAOUrl);
    console.log(doorAlphaTexture);
    // 导入置换贴图
    const doorHeightTexture = textureLoader.load(require('./../textures/door/height.jpg'));
    // 导入粗糙度贴图
    const doorRoughnessTexture = textureLoader.load(require('./../textures/door/roughness.jpg'));
    // 导入金属贴图
    const metalnessTexture = textureLoader.load(require('./../textures/door/metalness.jpg'));
    // 导入法线贴图
    const normalTexture = textureLoader.load(require('./../textures/door/normal.jpg'));
    // 设置纹理偏移
    // 添加物体
    // 创建几何体
    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);
    // 添加材质
    const material = new THREE.MeshStandardMaterial({
      color: '#ffff00',
      map: doorColorTexture,
      alphaMap: doorAlphaTexture,
      transparent: true,
      aoMap: doorAOTexture,
      aoMapIntensity: 1,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      roughness: 1,
      roughnessMap: doorRoughnessTexture,
      metalness: 1,
      metalnessMap: metalnessTexture,
      normalMap: normalTexture
      // opacity: 0.3,
      // side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(cubeGeometry, material);
    scene.add(cube);
    // 给cube添加第二组uv
    cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2));
    // 添加平面
    const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200);
    const plane = new THREE.Mesh(
      planeGeometry,
      material
    );
    plane.position.set(1.5, 0, 0);
    scene.add(plane);
    // 给平面设置第二组UV
    planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2));
    // 添加灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    // 直线光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
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
    // 设置控制器的阻尼,让控制器更加逼真，必须在循环调用是调用update();
    controls.enableDamping = true;
    // 添加坐标轴
    const axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper);
    window.addEventListener('dblclick', () => {
      // if (animate1.isActive()) {
      //   // 暂停
      //   animate1.pause();
      // } else {
      //   // 恢复
      //   animate1.resume();
      // }
      // 双击控制屏幕进入全屏，退出全屏
      const fullscreenElement = document.fullscreenElement;
      if (fullscreenElement) {
        // 退出全屏，使用document对象
        document.exitFullscreen();
      } else {
        // 让画布对象全屏
        renderer.domElement.requestFullscreen();
      }
    });

    function render () {
      controls.update();
      renderer.render(scene, camera);
      // 默认传入时间
      requestAnimationFrame(render);
    }

    render();
    // 监听画面变化，更新玄滩画面
    window.addEventListener('resize', () => {
      // 更新摄像头
      camera.aspect = window.innerWidth / window.innerHeight;
      // 更新摄像机投影矩阵
      camera.updateProjectionMatrix();
      // 更新渲染器
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio);
    });
  },
  gsapFn (cube) {
    // 设置动画
    gsap.to(cube.position, {
      x: 5,
      duration: 5,
      // 设置重复次数, 无数次循环 -1
      repeat: -1,
      // 设置往返运动
      yoyo: true,
      // delay,设置延迟2秒运动
      delay: 2,
      ease: 'power1.inOut',
      onComplete: () => {
        console.log('动画完成');
      },
      onStart: () => {
        console.log('动画开始');
      }
    });
    gsap.to(cube.rotation, {
      x: 2 * Math.PI,
      duration: 5,
      ease: 'power1.inOut'
    });
  }
};
