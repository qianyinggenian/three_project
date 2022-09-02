import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

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
    // 添加物体
    // 创建几何体
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.BufferGeometry();
      const positionsArray = new Float32Array(9);
      for (let j = 0; j < 9; j++) {
        positionsArray[j] = Math.random() * 10 - 5;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
      const color = new THREE.Color(Math.random(), Math.random(), Math.random());
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    // const vertices = new Float32Array([
    //   -1.0, -1.0, 1.0,
    //   1.0, -1.0, 1.0,
    //   1.0, 1.0, 1.0,
    //   1.0, 1.0, 1.0,
    //   -1.0, 1.0, 1.0,
    //   -1.0, -1.0, 1.0
    // ]);
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
