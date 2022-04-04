<template>
<BaiObject :params="baiParams" :run-physics="true">
    <img src="../assets/SorakadoAi.jpg">
</BaiObject>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { provide, ref } from 'vue';
import { Vector3d, Matrix3D } from '../lib/linalg';
import { useWindowSize } from '../lib/windowSizeTracking';

import BaiObject from './BaiObject.vue'


// // src of Images to Put in BaiObject
// const props = defineProps({
//     baiImgSrcList
// })


// Basis for Universal Cordinate System
const universeBasisX = ref(new Vector3d([1, 0, 0]))
const universeBasisY = ref(new Vector3d([0, 1, 0]))
const universeBasisZ = ref(new Vector3d([0, 0, 1]))

provide('universeBasisX', universeBasisX)
provide('universeBasisY', universeBasisY)
provide('universeBasisZ', universeBasisZ)

// Cordinate of ViewPoint in Universal Cordinate System
const viewPointYaw = ref(0.0)
const viewPointPitch = ref(Math.PI / 2)
const viewPointRadius = ref(4000)

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
const viewPointDistanceToWindow = ref(800)

provide('windowSize', {windowWidth, windowHeight})
provide('viewPointDistanceToWindow', viewPointDistanceToWindow)

// Gravity Constant
const gravityConstant = ref(0.001)
provide('gravityConstant', gravityConstant)

// BaiObject Params
const baiParams = ref({
    initialPos: new Vector3d([800, 0, 0]),
    initialVelocity: new Vector3d([0, 1, 0]),
    objectWidth: 296,
    objectHeight: 200,
    initialDirectionX: new Vector3d([1, 0, 0]),
    initialDirectionY: new Vector3d([0, 1, 0]),
    rotationAxis: new Vector3d([1, 0, 0]),
    rotationAngularSpeed: 0.001
})

</script>

<style>
img {
    max-width: 100%;
    max-height: 100%;
}
</style>