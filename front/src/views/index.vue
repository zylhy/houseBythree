<template>
  <canvas id="gameCanvas"></canvas>
</template>
<script setup>
import * as THREE from "three";
const gameCanvas = ref(null);
console.dir(THREE);
const initThree = () => {
  // 给canvas设置宽高
  const canvas = document.querySelector("#gameCanvas");
  gameCanvas.value = canvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

onMounted(() => {
    initThree();
})
</script>
<style lang="scss" scoped></style>
