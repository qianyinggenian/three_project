import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  MOUSE
} from 'three';

export function setOrbitControl (camera, el) {
  const controls = new OrbitControls(camera, el);
  // 初始化控制器
  // 设置相机缩放的中心点
  controls.target.set(0, 0, 0);
  controls.rotateSpeed = 0.2;
  // 如果使用animate方法时，将此函数删除
  // controls.addEventListener('change', () => {
  //   console.log(camera.getEffectiveFOV())
  // })
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true;
  // controls.enableDamping = false;
  // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
  controls.dampingFactor = 0.5;
  // 是否可以缩放
  controls.enableZoom = true;
  // 是否可以左键旋转
  // controls.enableRotate = false;
  controls.enableRotate = true;
  // 能够将相机缩小多少
  // controls.maxZoom = false;
  // 能够将相机放大多少
  // controls.minZoom = false;
  // 是否自动旋转
  controls.autoRotate = true;
  // 设置相机距离原点的最远距离
  // controls.minDistance = 20;
  // 设置相机距离原点的最远距离
  // controls.maxDistance = 10000;
  // 是否开启右键拖拽 默认是
  controls.enablePan = true;
  controls.mouseButtons = {
    // 右键旋转
    // LEFT: MOUSE.PAN,
    // MIDDLE: MOUSE.DOLLY,
    // RIGHT: MOUSE.ROTATE
    // 左键旋转
    LEFT: MOUSE.ROTATE,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN
  }; // 设置鼠标按键的功能，此处做了一个切换
  return controls;
}
