<template>
<h1>汝可识得此阵？</h1>
<Teleport to="body">
    <div class="ctl-layer">
        <CustomCheckbox v-model="showUniverseAxis">
            Show Axis
        </CustomCheckbox>
        <br>
        <CustomCheckbox v-model="showViewPointPos">
            Show View Point Position
        </CustomCheckbox>
        <br>
        <span>deltaT=</span><input v-model="deltaT">
        <br>
        <span>gravityConstant=</span><input v-model="gravityConstant">
        <br>
        <span>viewPointDistanceToWindow=</span><input v-model="viewPointDistanceToWindow">
        <br>
        <CustomCheckbox v-model="showGnerationPanel">
            Generate Random Paramameter
        </CustomCheckbox>
        <br>
        <div v-if="showGnerationPanel" class="generation-panel">
            <ParamGenerationSetting 
                :generation-constants="generationConstants"
                @generate="generateParams"
                @add="addBaiObj"
                :selected="selectedParamEdit">
            </ParamGenerationSetting>
        </div>
        <div class="param-edit-container">
            <select v-model="selectedParamEdit">
                <option value="-1">Select Bai Object to Edit Param</option>
                <option value="-2">Center</option>
                <option v-for="(_, i) in baiParams" :key="i" :value="i">
                    Bai Object {{ i }} (Key={{ baiObjKey[i] }})
                </option>
            </select>
        </div>
    </div>
    <br>
    <div class="viewpoint-pos-disp" v-if="showViewPointPos">
        <span>Pitch={{ (viewPointPitch / Math.PI).toFixed(3) }} PI</span>
        <br>
        <span>Yaw={{ (viewPointYaw / Math.PI).toFixed(3) }} PI</span>
        <br>
        <span>Radius= {{ viewPointRadius.toFixed(0) }} px</span>
        <br>
    </div>
</Teleport>
<div class="bai-objects-container" ref="baiObjectsContainer">
    <BaiObject :params="centerBaiParams" :run-physics="false"
        :show-edit="selectedParamEdit == -2"
        :bai-key="0">
        <a :href="props.centerImgSrc" target="_blank">
            <img :src="props.centerImgSrc">
        </a>
    </BaiObject>
    <div v-for="(baiParam,i) in baiParams" :key="baiObjKey[i]">
        <BaiObject :params="baiParam" :run-physics="true"
            :show-edit="i == selectedParamEdit"
            :bai-key="baiObjKey[i]"
            @destroy="destroyBaiObj">
            <template #default>
                <a :href="props.baiImgSrcList[i]" target="_blank">
                    <img :src="props.baiImgSrcList[i]">
                </a>
            </template>
        </BaiObject>
    </div>
    <canvas ref="cordCanvas" :width="windowWidth" :height="windowHeight"
        v-if="showUniverseAxis"></canvas>
</div>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { onMounted, provide, ref } from 'vue';

import { ZIndexSorter } from '../lib/zIndexer.js';
import { Vector3d, Matrix3D } from '../lib/linalg';
import { useWindowSize } from '../lib/windowSizeTracking';
import { useTrackMouseSwipe } from '../lib/mouseSwipe.js'
import { useTrackMouseScroll } from '../lib/mouseScroll.js'
import { 
    defaultGravityConstant,
    defaultViewPointDistanceToWindow, 
    generationConstants, 
    initialViewPointPitch, 
    initialViewPointRadius,
    initialViewPointYaw,
    initialDeltaT
} from '../constants.js';
import { randomParam, RandomParamGenerator } from '../lib/paramGeneration.js'

import BaiObject from './BaiObject.vue'
import CustomCheckbox from './CustomCheckbox.vue';
import ParamGenerationSetting from './ParamGenerationSetting.vue';

const props = defineProps([
    'baiImgSrcList',
    'centerImgSrc'
])

// Show View Point Pos
const showViewPointPos = ref(true)

// Basis for Universal Cordinate System
const universeBasisX = ref(new Vector3d([1, 0, 0]))
const universeBasisY = ref(new Vector3d([0, 1, 0]))
const universeBasisZ = ref(new Vector3d([0, 0, 1]))

provide('universeBasisX', universeBasisX)
provide('universeBasisY', universeBasisY)
provide('universeBasisZ', universeBasisZ)

// Ref for Bai Objects Container to track Mouse and Touch
const baiObjectsContainer = ref(null)

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
useTrackMouseSwipe(updateViewPointAngle, baiObjectsContainer)

function updateViewPointRadius(deltaRadius) {
    let newRadius = viewPointRadius.value + deltaRadius
    if(newRadius > 0){
        viewPointRadius.value = newRadius
    }else{
        viewPointRadius.value = 0
    }
}
useTrackMouseScroll(updateViewPointRadius, baiObjectsContainer)

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

onMounted(() => {
    props.baiImgSrcList.forEach(_ => {
        baiParams.value.push(randomParam(gravityConstant.value))
    })
})

// Force Refresh a Bai Object: Vue Renders Compoenent on `key` Change
const baiObjKey = ref(props.baiImgSrcList.map(_ => 
    Math.floor(Math.random() * 100000000)))
function refreshBaiObj(i) {
    baiObjKey.value[i] = Math.floor(Math.random() * 100000000)
}

const showGnerationPanel = ref(false)
function generateParams (setting) {
    let generator = new RandomParamGenerator(setting, gravityConstant.value)
    if(selectedParamEdit.value >= 0){
        baiParams.value[selectedParamEdit.value] = 
           generator.randomParam()
        refreshBaiObj(selectedParamEdit.value)
    }else if(selectedParamEdit.value == -1) {
        // All
        baiParams.value.forEach((_, i) => {
            baiParams.value[i] = generator.randomParam()
            refreshBaiObj(i)
        })
    }
}

// Add new Bai Object
function addBaiObj(setting, imageURL) {
    let generator = new RandomParamGenerator(setting, gravityConstant.value)
    props.baiImgSrcList.push(imageURL)
    baiObjKey.value.push(Math.floor(Math.random() * 100000000))
    baiParams.value.push(generator.randomParam())
    
}

// Animation Speed
const deltaT = ref(initialDeltaT)
provide('deltaT', deltaT)

// Handle z-index for Each Bai Object
const zIndexer = new ZIndexSorter(1, baiObjKey.value, baiParams.value.length)
provide('zIndexer', zIndexer)

// BaiObject Para for Center Object
const centerBaiParams = ref({
    initialPos: new Vector3d([0, 0, 0]),
    initialVelocity: new Vector3d([0, 0, 0]),
    objectWidth: generationConstants.imgSize,
    objectHeight: generationConstants.imgSize,
    initialDirectionX: new Vector3d([1, 0, 0]),
    initialDirectionY: new Vector3d([0, 1, 0]),
    rotationAxis: new Vector3d([0, 0, 1]),
    rotationAngularSpeed: 0.001
})

// Desroy Bai Object
function destroyBaiObj(baiKey) {
    let idx = baiObjKey.value.indexOf(baiKey)
    if(idx != -1){
        baiParams.value.splice(idx, 1)
        props.baiImgSrcList.splice(idx, 1)
        baiObjKey.value.splice(idx, 1)
    }
}

// Draw Cordinate System on Canvas
const showUniverseAxis = ref(true)

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
    if(cordCanvas.value){
        let cordCanvasContext = cordCanvas.value.getContext('2d')

        // Clear Canvas
        cordCanvasContext.clearRect(0, 0, windowWidth.value, windowHeight.value)

        let centerWindowPos = universePosToWindow(new Vector3d([0, 0, 0]));

        let label = ['X', 'Y', 'Z'];
        [universeBasisX, universeBasisY, universeBasisZ]
        .forEach((basis, i) => {
            let drawLength = 2 * generationConstants.imgSize
            let draw = universePosToWindow(basis.value.scale(drawLength))
            
            cordCanvasContext.beginPath()
            cordCanvasContext.strokeStyle = "rgb(255,255,255)"
            cordCanvasContext.moveTo(centerWindowPos.x, centerWindowPos.y)
            cordCanvasContext.lineTo(draw.x, draw.y)
            cordCanvasContext.closePath()
            cordCanvasContext.stroke()

            cordCanvasContext.strokeText(`${label[i]} ${drawLength}`
                , draw.x, draw.y)
        })
    }

}

// Edit Bai Object Param
const selectedParamEdit = ref(-1)

// Run Animation
function animationLoop() {
    if(showUniverseAxis.value){
        drawUniverseBasisAxis()
    }

    requestAnimationFrame(animationLoop)
}

onMounted(() => {animationLoop()})


</script>

<style scoped>
.bai-objects-container {
    touch-action: none;
    position: absolute;
    width: 100%;
    height: 100vh;
    left: 0px;
    top: 0px;
}
img {
    max-width: 100%;
    max-height: 100%;
    margin: auto;
}
.viewpoint-pos-disp {
    position: fixed;
    text-align: right;
    right: 0px;
    top: 0px;
    margin-top: 10px;
    margin-right: 10px;
    z-index: 999;
}
.viewpoint-pos-disp input {
    width: 5em;
}
canvas {
    left: 0px;
    top: 0px;
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: -1;
}
.generation-panel {
    border: solid aliceblue 1px;
    display: inline-block;
}
.ctl-layer {
    z-index: 999;
    position: relative;
    display: inline-block;
}
</style>