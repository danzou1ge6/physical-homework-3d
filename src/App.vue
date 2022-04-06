<template>
<h1>汝可识得此阵？</h1>
<BaiCanvas :bai-img-src-list="baiImgSrcList"
    center-img-src="/SorakadoAi.jpg"></BaiCanvas>
</template>

<script setup>
import BaiCanvas from './components/BaiCanvas.vue';

const baiImgSrcList = [
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
span {
    color: aliceblue;
}
p {
    color: aliceblue;
}
input{
    background-color: rgba(0,0,0,0);
    color: aliceblue;
    border: none;
}
label {
    color: aliceblue;
}
button{
    border: none;
    background-color: rgba(0,0,0,0);
    color: aliceblue;
}
button:hover{
    background-color: aliceblue;
    color: black;
}
select {
    border: solid aliceblue 1px;
    background-color: rgba(0,0,0,0);
    color: aliceblue;
}
</style>
