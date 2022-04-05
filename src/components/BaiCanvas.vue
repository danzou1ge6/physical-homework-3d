<template>
<p>
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
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { provide, ref } from 'vue';

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
    'centerImgSrc'
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
    rotationAngularSpeed: 0.001
    }
})


</script>

<style scoped>
img {
    max-width: 100%;
    max-height: 100%;
}
p {
    color: aliceblue;
}
</style>