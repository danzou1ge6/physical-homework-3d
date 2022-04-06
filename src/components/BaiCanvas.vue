<template>
<div class="constant-inp">
    <span>GravityConstant=</span><input v-model="gravityConstant">
</div>
<p class="viewpoint-pos-disp">
    Pitch: {{ (viewPointPitch / Math.PI).toFixed(3) }} PI<br>
    Yaw: {{ (viewPointYaw / Math.PI).toFixed(3) }} PI<br>
    Radius: {{ viewPointRadius }} px
</p>
<BaiObject :params="centerBaiParams" :run-physics="false">
    <a :href="props.centerImgSrc" target="_blank">
        <img :src="props.centerImgSrc">
    </a>
</BaiObject>
<div v-for="(baiParam,i) in baiParams" :key="i">
    <BaiObject :params="baiParam" :run-physics="true">
        <template #default>
            <a :href="props.baiImgSrcList[i]" target="_blank">
                <img :src="props.baiImgSrcList[i]">
            </a>
        </template>
    </BaiObject>
</div>
<canvas ref="cordCanvas" :width="windowWidth" :height="windowHeight"></canvas>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { onMounted, provide, ref, unref } from 'vue';

import { Vector3d, Matrix3D } from '../lib/linalg';
import { useWindowSize } from '../lib/windowSizeTracking';
import { useTrackMouseSwipe } from '../lib/mouseSwipe.js'
import { useTrackMouseScroll } from '../lib/mouseScroll.js'
import { defaultGravityConstant,
         defaultViewPointDistanceToWindow, 
initialViewPointPitch, 
initialViewPointRadius,
imgSize,
initialViewPointYaw} from '../constants.js';
import { randomParam } from '../lib/paramGeneration.js'

import BaiObject from './BaiObject.vue'


const props = defineProps([
    'baiImgSrcList',
    'centerImgSrc',
    'showAxis'
])


// Basis for Universal Cordinate System
const universeBasisX = ref(new Vector3d([1, 0, 0]))
const universeBasisY = ref(new Vector3d([0, 1, 0]))
const universeBasisZ = ref(new Vector3d([0, 0, 1]))

provide('universeBasisX', universeBasisX)
provide('universeBasisY', universeBasisY)
provide('universeBasisZ', universeBasisZ)

// Cordinate of ViewPoint in Universal Cordinate System
const viewPointYaw = ref(initialViewPointYaw)
const viewPointPitch = ref(initialViewPointPitch)
const viewPointRadius = ref(initialViewPointRadius)

const viewPointDirectionZ = computed(() => 
    new Vector3d([
        Math.cos(viewPointPitch.value) * Math.cos(viewPointYaw.value),
        Math.cos(viewPointPitch.value) * Math.sin(viewPointYaw.value),
        Math.sin(viewPointPitch.value)
    ]).scale(-1)
)

const universeViewPointPos = computed(() => 
    viewPointDirectionZ.value.scale(-viewPointRadius.value)
)

provide('universeViewPointPos', universeViewPointPos)

// Update Cordinate of ViewPoint in Universal Cordinate System
function updateViewPointAngle({deltaPitch, deltaYaw}) {
    // Prevent Flip of View
    let newPitch = viewPointPitch.value + deltaPitch
    if(-Math.PI / 2 < newPitch && newPitch < Math.PI / 2){
        viewPointPitch.value = newPitch
    }
    viewPointYaw.value += deltaYaw
}
useTrackMouseSwipe(updateViewPointAngle)

function updateViewPointRadius(deltaRadius) {
    viewPointRadius.value += deltaRadius
}
useTrackMouseScroll(updateViewPointRadius)

// Direction of ViewPoint in Universal Cordinate System
const viewPointDirectionX = computed(() =>
    viewPointDirectionZ.value.cross(universeBasisZ.value).normalized())
const viewPointDirectionY = computed(() => 
    viewPointDirectionZ.value.cross(viewPointDirectionX.value))

provide('viewPointDirectionX', viewPointDirectionX)
provide('viewPointDirectionY', viewPointDirectionY)
provide('viewPointDirectionZ', viewPointDirectionZ)

// Cordinate Transformation from Universal to ViewPoint
const universeToViewPointTransform = computed(() => 
    new Matrix3D([viewPointDirectionX.value.data,
              viewPointDirectionY.value.data,
              viewPointDirectionZ.value.data])
        .T.inv()
)

provide('universeToViewPointTransform', universeToViewPointTransform)

// Window Size and ViewPoint Distance
// for Caculating BaiObject's Projection on the Window
const {windowWidth, windowHeight} = useWindowSize()
const viewPointDistanceToWindow = ref(defaultViewPointDistanceToWindow)

provide('windowSize', {windowWidth, windowHeight})
provide('viewPointDistanceToWindow', viewPointDistanceToWindow)

// Gravity Constant
const gravityConstant = ref(defaultGravityConstant)
provide('gravityConstant', gravityConstant)

// BaiObject Params
const baiParams = ref([])
props.baiImgSrcList.forEach(_ => {
    baiParams.value.push(randomParam(imgSize, imgSize))
})

// BaiObject Para for Center Object
const centerBaiParams = computed(() => {
    return {
    initialPos: new Vector3d([0, 0, 0]),
    initialVelocity: new Vector3d([0, 0, 0]),
    objectWidth: imgSize,
    objectHeight: imgSize,
    initialDirectionX: new Vector3d([1, 0, 0]),
    initialDirectionY: new Vector3d([0, 1, 0]),
    rotationAxis: new Vector3d([0, 0, 1]),
    rotationAngularSpeed: 0.00
    }
})

// Draw Cordinate System on Canvas
const cordCanvas = ref(null)

function universePosToWindow(universePos) {
    let viewPointPos = universeToViewPointTransform.value.dotVec(
        universePos.minus(universeViewPointPos.value)
    )
    return {
        x: Math.floor(viewPointPos.x * viewPointDistanceToWindow.value
                        / viewPointPos.z + windowWidth.value / 2),
        y: Math.floor(viewPointPos.y * viewPointDistanceToWindow.value
                        / viewPointPos.z + windowHeight.value / 2)
    }
}

function drawUniverseBasisAxis() {
    if(cordCanvas){
        let cordCanvasContext = cordCanvas.value.getContext('2d')

        // Clear Canvas
        cordCanvasContext.clearRect(0, 0, windowWidth.value, windowHeight.value)

        let centerWindowPos = universePosToWindow(new Vector3d([0, 0, 0]));

        [universeBasisX, universeBasisY, universeBasisZ]
        .forEach(basis => {
            let draw = universePosToWindow(basis.value.scale(2 * imgSize))
            
            cordCanvasContext.beginPath()
            cordCanvasContext.strokeStyle = "rgb(255,255,255)"
            cordCanvasContext.moveTo(centerWindowPos.x, centerWindowPos.y)
            cordCanvasContext.lineTo(draw.x, draw.y)
            cordCanvasContext.closePath()
            cordCanvasContext.stroke()
        })
    }

}

// Run Animation
function animationLoop() {
    drawUniverseBasisAxis()

    requestAnimationFrame(animationLoop)
}

if(props.showAxis){
    onMounted(() => {animationLoop()})
}

</script>

<style scoped>
img {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
}
p.viewpoint-pos-disp {
    position: fixed;
    color: aliceblue;
    text-align: center;
    right: 0px;
    top: 0px;
    margin-top: 10px;
    margin-right: 10px;
}
canvas {
    left: 0px;
    top: 0px;
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: -1;
}
.constant-inp {
    z-index: 99;
    position: relative;
    color: aliceblue
}
.constant-inp input{
    background-color: rgba(0,0,0,0);
    color: aliceblue;
    border: none;
}
</style>