<template>
<div v-if="displayed == 'bai-canvas'">
    <BaiCanvas 
        :bai-img-src-list="baiImgSrcList"
        :center-img-src="centerImgSrc">
    </BaiCanvas>
</div>
<div v-if="displayed == 'index-display'">
    <IndexDisplay
        :index="displayIndex"
        :msg="indexDisplayMsg"
    ></IndexDisplay>
</div>
</template>

<script setup>
import { ref } from 'vue';
import BaiCanvas from './components/BaiCanvas.vue';
import IndexDisplay from './components/IndexDisplay.vue';

import displayIndex from './displayIndex.js'

const baiImgSrcList = ref([])
const centerImgSrc = ref('')

const displayed = ref('')

const indexDisplayMsg = ref('')


let key = location.hash.slice(1,)
let srcInfo = displayIndex[key]
if(srcInfo){
    centerImgSrc.value = srcInfo.center
    baiImgSrcList.value = srcInfo.outer
    displayed.value = 'bai-canvas'
}else{
    if(key){
        indexDisplayMsg.value = `Err: Entry "${key}" not found`
    }
    displayed.value = 'index-display'
}


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
