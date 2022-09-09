import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// 灯光与阴影
// 1、材质要满足能够对光照有反应
// 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true
// 3、设置光照投射阴影 directionalLight.castShadow = true
// 4、设置物体投射阴影 sphere.castShadow = true
// 5、设置物体接收阴影 plane.receiveShadow = true
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
    // 设置球体
    const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
    const material = new THREE.MeshStandardMaterial({});
    const sphere = new THREE.Mesh(sphereGeometry, material);
    // 投射阴影
    sphere.castShadow = true;
    scene.add(sphere);
    // 创建平面
    const planeGeometry = new THREE.PlaneBufferGeometry(10, 10);
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(0, -1, 0);
    plane.rotation.x = -Math.PI / 2;
    // 接收阴影
    plane.receiveShadow = true;
    scene.add(plane);
    // 添加灯光
    // 环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    // 直线光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    // 添加渲染器
    const renderer = new THREE.WebGLRenderer();
    // 开启场景中的阴影贴图
    renderer.shadowMap.enabled = true;
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
