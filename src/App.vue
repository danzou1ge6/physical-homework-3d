<template>
<h1>汝可识得此阵？</h1>
<BaiCanvas :bai-img-src-list="baiImgSrcList" 
    center-img-src="/SorakadoAi.jpg"
    show-axis="true"></BaiCanvas>
</template>

<script setup>
import BaiCanvas from './components/BaiCanvas.vue';

const baiImgSrcList = [
    '/SorakadoAi.jpg',
    '/SorakadoAi.jpg',
    '/SorakadoAi.jpg',
    '/SorakadoAi.jpg',
    '/SorakadoAi.jpg',
    '/SorakadoAi.jpg',
    '/SorakadoAi.jpg',
]
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
h1 {
    text-align: center;
    color: aliceblue;
}
body {
    background-color: black;
}
</style>
