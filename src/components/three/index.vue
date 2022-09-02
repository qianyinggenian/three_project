<template>
  <div></div>
</template>

<script>
import * as THREE from 'three';
// 导入动画库
import gsap from 'gsap';
// 导入dat.gui
import * as dat from 'dat.gui';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gui = new dat.GUI();
export default {
  name: 'index',
  data () {
    return {};
  },
  mounted () {
    console.log(33333333333);
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
      gui.add(cube.position, 'x').min(0).max(5).step(0.01).name('移动X轴').onChange((value) => {
        console.log('值被修改：', value);
      }).onFinishChange((value) => {
        console.log('完全停下来:', value);
      });
      // 修改颜色
      const params = {
        color: '#ffff00',
        fn: () => {
          // 让立方体运动起来
          gsap.to(cube.position, {
            x: 5,
            duration: 5,
            // 设置重复次数, 无数次循环 -1
            repeat: -1,
            // 设置往返运动
            yoyo: true
          });
        }
      };
      gui.addColor(params, 'color').onChange((value) => {
        console.log('值被修改：', value);
        cube.material.color.set(value);
      }).onFinishChange((value) => {
        console.log('完全停下来:', value);
      });
      // 设置选项框
      gui.add(cube, 'visible').name('是否显示');
      var folder = gui.addFolder('设置立方体');
      folder.add(cube.material, 'wireframe');
      // 设置按钮点击触发某个事件
      folder.add(params, 'fn').name('立方体运动');
      console.log(folder);
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
  },
  destroyed () {
    console.log(gui.__folders);
    delete gui.__folders.设置立方体;
    gui.domElement.remove();
  }
};
</script>

<style scoped>

</style>
