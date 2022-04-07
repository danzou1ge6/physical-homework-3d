<template>
<DisplayedComponent 
    :bai-img-src-list="baiImgSrcList"
    :center-img-src="centerImgSrc">
</DisplayedComponent>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';
import BaiCanvas from './components/BaiCanvas.vue';
import IndexDisplay from './components/IndexDisplay.vue';

import index from '/displayed/index.json'

const baiImgSrcList = ref([])
const centerImgSrc = ref('')


// Load `BaiCanvas` After Index Resolved
const DisplayedComponent = defineAsyncComponent(() => {
    return new Promise((resolve, reject) => {
        let srcInfo = index[location.hash.slice(1,)]

        if(srcInfo){
            // Success: Load `BaiCanvas`
            centerImgSrc.value = srcInfo.center
            baiImgSrcList.value = srcInfo.outer
            resolve(BaiCanvas)
        }else{
            resolve(IndexDisplay)
        }
    })
})

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
