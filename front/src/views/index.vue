<template>
  <canvas id="gameCanvas"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const gameCanvas = ref(null);
const gameScene = ref(null);
const house = new THREE.Group();
const initThree = () => {
  // 给canvas设置宽高
  const canvas = document.querySelector("#gameCanvas");
  gameCanvas.value = canvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //新建场景
  const scene = new THREE.Scene();
  gameScene.value = scene;
  //新建渲染器
  const render = new THREE.WebGLRenderer({ canvas, antialias: true });
  render.setClearColor(0xcce0ff, 1);

  // 设置渲染器的清除颜色
  render.setClearColor(0xd5d9df);
  // 启用阴影映射
  render.shadowMap.enabled = true;
  // 新建坐标系
  const axes = new THREE.AxesHelper(50000);
  scene.add(axes);
  render.setSize(canvas.width, canvas.height);
  // 新建一个 相机
 
const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0,30,50);
  camera.lookAt(0,30,0);
  // 创建一个第一人称控制器
  const controls = new FirstPersonControls(camera, canvas);
    controls.lookSpeed = 0.05;
  controls.movementSpeed =50;
  controls.lookVertical = false;
  const clock = new THREE.Clock();
  // 创建轨道控制器
  // const textControls = new OrbitControls(camera, canvas);
  // 创建一个环境光
  const light = new THREE.AmbientLight(0xcccccc);
  scene.add(light);
  createGround();
  createHouse();
  // 渲染动画
  function animate() {
    render.render(scene, camera);
    // textControls.update();
    const delta = clock.getDelta();
    controls.update(delta);
    requestAnimationFrame(animate);
  }
  animate();
};
// 新建草地
const createGround = () => {
  // 定义一个平面几何体
  const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
  // 定义一个纹理
  const groundTexture = new THREE.TextureLoader().load(requireAssets("grass.jpg"));
  // 设置纹理的环绕方式
  groundTexture.wrapS = THREE.RepeatWrapping;
  groundTexture.wrapT = THREE.RepeatWrapping;
  // 设置纹理的重复次数
  groundTexture.repeat.set(100, 100);
  const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
  // const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -0.5 * Math.PI;
  ground.receiveShadow = true; // 接收阴影
  gameScene.value.add(ground);
};

// 新建房子
const createHouse = () => {
  createFloor();
  createWall();
  let roof1 = createRoof();
  let roof2 = createRoof();

  //模型对象旋转的函数，每次设置一个坐标轴的变换
  function rotateAroundWorldAxis(object, axis, radians) {
    let rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  //调用方式，设置x、y、z轴的旋转
  let xAxis = new THREE.Vector3(1, 0, 0);
  let yAxis = new THREE.Vector3(0, 1, 0);
  let zAxis = new THREE.Vector3(0, 0, 1);
  //模型、旋转轴和旋转角度（弧度）
  rotateAroundWorldAxis(roof1, yAxis, Math.PI / 2);
  rotateAroundWorldAxis(roof2, yAxis, Math.PI / 2);
  rotateAroundWorldAxis(roof1, zAxis, -Math.PI / 2.8);
  rotateAroundWorldAxis(roof2, zAxis, -Math.PI /1.55);
  roof1.position.y = roof2.position.y = 120;
  roof1.position.x = -62;
  roof2.position.x = 62;
  house.add(roof2);
  house.add(roof1);
  house.add(createWall(-100));
  house.add(createWall(100));
  house.add(createBehindWall());
  house.add(createFrontWall());
  gameScene.value.add(house);
};
// 地板
const createFloor = () => {
  // 先定义一个平面几何体
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  // 木头纹理
  const texture = new THREE.TextureLoader().load(requireAssets("wood.jpg"));
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  // 定义材质
  const floorMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.position.y = 1;
  house.add(floor);
};
// 两侧墙体
const createWall = (z = -100) => {
  // 定义一个形状
  const shape = new THREE.Shape();
  shape.moveTo(-100, 0);
  shape.lineTo(100, 0);
  shape.lineTo(100, 100);
  shape.lineTo(0, 150);
  shape.lineTo(-100, 100);
  shape.lineTo(-100, 0);
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape, { depth: 5 });
  const texture = new THREE.TextureLoader().load(requireAssets("wall.jpg"));
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.01, 0.01);
  let material = new THREE.MeshBasicMaterial({ map: texture });
  let sidewall = new THREE.Mesh(extrudeGeometry, material);
  sidewall.position.z = z;
  return sidewall;
};
const createBehindWall = () => {
  // 定义一个形状
  const shape = new THREE.Shape();
  shape.moveTo(-100, 0);
  shape.lineTo(100, 0);
  shape.lineTo(100, 100);
  shape.lineTo(-100, 100);
  shape.lineTo(-100, 0);
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape, { depth: 5 });
  // 定义一个纹理
  const texture = new THREE.TextureLoader().load(requireAssets("wall.jpg"));
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.01, 0.01);

  let material = new THREE.MeshBasicMaterial({ map: texture });
  let sidewall = new THREE.Mesh(extrudeGeometry, material);
  sidewall.rotation.y = 0.5 * Math.PI;
  sidewall.position.x = -100;
  return sidewall;
};
const createFrontWall = () => {
  // 定义一个形状
  const shape = new THREE.Shape();
  shape.moveTo(-100, 0);
  shape.lineTo(100, 0);
  shape.lineTo(100, 100);
  shape.lineTo(-100, 100);
  shape.lineTo(-100, 0);

  // 挖一个窗户
  const window = new THREE.Path();
  window.moveTo(30, 30);
  window.lineTo(30, 50);
  window.lineTo(80, 50);
  window.lineTo(80, 30);
  window.lineTo(30, 30);
  shape.holes.push(window);

  // 挖一个们
  const door = new THREE.Path();
  door.moveTo(-30, 0);
  door.lineTo(-30, 80);
  door.lineTo(-80, 80);
  door.lineTo(-80, 0);
  door.lineTo(-30, 0);
  shape.holes.push(door);
  const extrudeGeometry = new THREE.ExtrudeGeometry(shape, { depth: 5 });
  // 定义纹理
  const texture = new THREE.TextureLoader().load(requireAssets("wall.jpg"));
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.01, 0.01);
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const frontWall = new THREE.Mesh(extrudeGeometry, material);
  frontWall.rotation.y = 0.5 * Math.PI;
  frontWall.position.x = 95;
  return frontWall;
};
// 创建屋顶
const createRoof = () => {
  // 定义几何体
  const geometry = new THREE.BoxGeometry(210, 140, 5);
  // 定义一个纹理
  const texture = new THREE.TextureLoader().load(requireAssets("tile.jpg"));
  texture.repeat.set(5, 5);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // 定义材质
  const material = new THREE.MeshBasicMaterial({ map: texture });
  // 定义颜色材质
  const colorMaterial = new THREE.MeshBasicMaterial({ color: "gray" });
  const materials = [
    colorMaterial,
    colorMaterial,
    colorMaterial,
    colorMaterial,
    colorMaterial,
    material,
  ];
  let roof = new THREE.Mesh(geometry, materials);

  return roof;
};
onMounted(() => {
  initThree();
});
</script>
<style lang="scss" scoped></style>
