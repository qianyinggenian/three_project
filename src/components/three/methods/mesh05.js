import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// 透明纹理
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
    // 导入纹理
    const textureLoader = new THREE.TextureLoader();
    // const menUrl = require('./../../../../dist/textures/men.jpg');
    const menUrl = require('./../textures/door/color.jpg');
    const doorColorTexture = textureLoader.load(menUrl);
    const alphaUrl = require('./../textures/door/alpha.jpg');
    const doorAlphaTexture = textureLoader.load(alphaUrl);
    console.log(doorAlphaTexture);
    // 设置纹理偏移
    // 添加物体
    // 创建几何体
    const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    // 添加材质
    const basicMaterial = new THREE.MeshBasicMaterial({
      color: '#ffff00',
      map: doorColorTexture,
      // alphaMap: doorAlphaTexture,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
    scene.add(cube);
    // 添加平面
    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      basicMaterial
    );
    plane.position.set(3, 0, 0);
    scene.add(plane);
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
