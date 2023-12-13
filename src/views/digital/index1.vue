<template>
  <div ref="webglRef" id="webgl-output" class="webglRef"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/examples/jsm/objects/Water';
import { Sky } from 'three/examples/jsm/objects/Sky';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as dat from 'dat.gui';
let water;
let renderer;
let scene;
let camera;
let plane;
let sun;
// let mesh;
let stats;
const mouse = {};
let intersects;
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
        antialias: true,
        logarithmicDepthBuffer: true
      });
      // 设置渲染器的初始颜色
      renderer.setClearColor(new THREE.Color(0xffffff));
      // 设置输出canvas画面的大小
      renderer.setSize(el.clientWidth, el.clientHeight);
      //   设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio);
      // 设置渲染物体阴影
      renderer.shadowMap.enabled = true;

      this.addGround();
      this.addWater();
      this.addSkyAndSun();
      // this.addShape();
      el.addEventListener(
        'pointerdown',
        this.onDocumentMouseDownHandle,
        false
      );
      var axes = new THREE.AxesHelper(20000);
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

      // 定位相机，并且指向场景中心
      camera.position.set(-9.88793235045439, 339.5358612533638, 807.6822095787198);
      camera.lookAt(scene.position);
      // 将渲染器输出添加html元素中
      el.appendChild(renderer.domElement);
      renderer.render(scene, camera);
      stats = new Stats();

      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '5px';
      stats.domElement.style.top = '5px';
      stats.domElement.style.display = 'none';
      el.appendChild(stats.dom);
      // 创建controls对象;
      var controls = new OrbitControls(camera, renderer.domElement);
      function render () {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        stats.update();
        // const time = performance.now() * 0.001;
        water.material.uniforms.time.value += 0.5 / 60.0;
      }
      window.addEventListener('resize', this.onWindowResize);
      render();
    },
    onWindowResize () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    /**
     * @Description 鼠标点击触发
     * @author wangkangzhang
     * @date 2023/12/12
    */
    onDocumentMouseDownHandle (e) {
      // onDocumentMouseDown(e, wrap3d);
      console.log(e);
      console.log('camera', camera);
      console.log('plane', plane);
      // console.log('maxDistance',controlsRef.value.maxDistance);
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
      // mouse.x = ((event.clientX - wrap3d.el.offsetLeft) / wrap3d.el.clientWidth) * 2 - 1;
      // mouse.y = -((event.clientY - wrap3d.el.offsetTop) / wrap3d.el.clientHeight) * 2 + 1;
      const vector2 = new THREE.Vector2(mouse.x, mouse.y);
      console.log(vector2, vector2);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(vector2, camera);
      intersects = raycaster.intersectObjects(scene.children, true);
      console.log('intersects', intersects[0]);
    },

    addShape () {
      // 创建一个平面几何体

      const splinepts = [];
      splinepts.push(new THREE.Vector2(-60.988853948220827, 523.854887064948));
      splinepts.push(new THREE.Vector2(-370.5005518655458, 522.9146753092871));
      splinepts.push(new THREE.Vector2(40.5005518655458, -525.9146753092871));
      splinepts.push(new THREE.Vector2(370.5005518655458, -520.996753092871));

      const splineShape = new THREE.Shape(splinepts);
      const geometry = new THREE.ShapeGeometry(splineShape);
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0x00ff00
      }));

      mesh.position.set(-15, 5, 0);
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);
    },
    /**
     * @Description 添加地面
     * @author wangkangzhang
     * @date 2023/12/12
    */
    addGround () {
      // 创建地面的几何体
      var planeGeometry = new THREE.PlaneGeometry(1000, 1050);
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('/static/digital/textures/ground.png');
      // 给地面物体上色
      var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        side: THREE.DoubleSide
        // transparent: true // 允许透明
      });
      // 创建地面
      plane = new THREE.Mesh(planeGeometry, planeMaterial);
      // 物体移动位置
      // Math.PI 为180度
      plane.rotation.x = 1.5 * Math.PI;
      plane.castShadow = true;
      // 接收阴影
      plane.receiveShadow = true;

      // 将地面添加到场景中
      scene.add(plane);
    },
    /**
     * @Description 添加水面
     * @author wangkangzhang
     * @date 2023/12/12
    */
    addWater () {
      // const waterGeometry = new THREE.PlaneGeometry(270, 1000);

      const splinepts = [];
      splinepts.push(new THREE.Vector2(-60.988853948220827, 523.854887064948));
      splinepts.push(new THREE.Vector2(-370.5005518655458, 522.9146753092871));
      splinepts.push(new THREE.Vector2(40.5005518655458, -525.9146753092871));
      splinepts.push(new THREE.Vector2(370.5005518655458, -520.996753092871));

      const splineShape = new THREE.Shape(splinepts);
      const geometry = new THREE.ShapeGeometry(splineShape);
      // const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      //   side: THREE.DoubleSide,
      //   color: 0x00ff00
      // }));
      //
      // mesh.position.set(-15, 5, 0);
      // mesh.rotation.x = -Math.PI / 2;
      // scene.add(mesh);
      water = new Water(
        geometry,
        {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load('/static/digital/textures/water.jpg', function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          }),
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: scene.fog !== undefined,
          transparent: true
        }
      );
      water.position.set(-15, 0.1, 0);
      // const gui = new dat.GUI();
      water.rotation.x = -Math.PI / 2;
      // water.rotation.z = Math.PI / 7.8;
      // gui.add(water.rotation, 'z').min(-360).max(360).step(0.1);
      scene.add(water);
    },
    /**
     * @Description
     * @author wangkangzhang
     * @date 2023/12/12
    */
    addSkyAndSun () {
      sun = new THREE.Vector3();
      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      const skyUniforms = sky.material.uniforms;

      skyUniforms.turbidity.value = 10;
      skyUniforms.rayleigh.value = 2;
      skyUniforms.mieCoefficient.value = 0.005;
      skyUniforms.mieDirectionalG.value = 0.8;

      const parameters = {
        elevation: 2,
        azimuth: 180
      };

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const sceneEnv = new THREE.Scene();

      let renderTarget;

      function updateSun () {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        // const phi = THREE.MathUtils.degToRad(90 - 15.3);
        // const theta = THREE.MathUtils.degToRad(-39.4);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms.sunPosition.value.copy(sun);
        water.material.uniforms.sunDirection.value.copy(sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        sceneEnv.add(sky);
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        scene.add(sky);

        scene.environment = renderTarget.texture;
      }
      updateSun();
      // const geometry = new THREE.BoxGeometry(30, 30, 30);
      // const material = new THREE.MeshStandardMaterial({ roughness: 0 });
      //
      // mesh = new THREE.Mesh(geometry, material);
      // scene.add(mesh);

      const gui = new dat.GUI();
      const folderSky = gui.addFolder('Sky');
      folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
      folderSky.add(parameters, 'azimuth', -180, 180, 0.1).onChange(updateSun);
      folderSky.open();

      const waterUniforms = water.material.uniforms;

      const folderWater = gui.addFolder('Water');
      folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
      folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
      folderWater.open();
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
