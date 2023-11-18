<template>
  <canvas id="gameCanvas"></canvas>
</template>
<script setup>
import * as THREE from "three";
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js'

const gameCanvas = ref(null);
const initThree = () => {
  // 给canvas设置宽高
  const canvas = document.querySelector("#gameCanvas");
  gameCanvas.value = canvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //新建场景
  const scene = new THREE.Scene();
  //新建渲染器
  const render = new THREE.WebGLRenderer({ canvas,antialias: true });
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
  camera.position.set(0, 0, 10);
  // 创建一个第一人称控制器
  const controls =  new FirstPersonControls(camera,canvas);
  controls.movementSpeed = 1;
  controls.lookVertical = false;
  const clock = new THREE.Clock();

  // 渲染动画
  function animate() {
    render.render(scene, camera);
    const delta = clock.getDelta();
    controls.update(delta);
    requestAnimationFrame(animate);
  }
  animate();
};

onMounted(() => {
  initThree();
});
</script>
<style lang="scss" scoped></style>
