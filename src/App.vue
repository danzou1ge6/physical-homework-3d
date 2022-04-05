<template>
<BaiCanvas :bai-img-src-list="baiImgSrcList" 
    center-img-src="/src/assets/SorakadoAi.jpg"></BaiCanvas>
</template>

<script setup>
import BaiCanvas from './components/BaiCanvas.vue';

const baiImgSrcList = [
    '/src/assets/SorakadoAi.jpg',
    '/src/assets/SorakadoAi.jpg',
    '/src/assets/SorakadoAi.jpg',
    '/src/assets/SorakadoAi.jpg',
    '/src/assets/SorakadoAi.jpg',
    '/src/assets/SorakadoAi.jpg',
    '/src/assets/SorakadoAi.jpg'
]
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
body {
    background-color: black;
}
</style>
