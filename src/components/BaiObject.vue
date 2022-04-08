<template>
<div class="bai-object" :style="baiObjStyle">
    <div :style="props.showEdit ? 'border: solid red 3px;' : ''"
        class="border-container">
        <div :style="rotateStyle">
            <slot></slot>
        </div>
    </div>
</div>
<Teleport to="body">
    <div class="param-editor ctl-layer" v-if="props.showEdit">
        <CustomCheckbox v-model="runPhysics">
            Run Physics
        </CustomCheckbox><br>
        <span>position=</span>
        <VectorInput v-model="universePos"></VectorInput><br>
        <span>velocity=</span>
        <VectorInput v-model="universeVelocity"></VectorInput><br>
        <span>directionX=</span>
        <VectorInput v-model="directionX" normalized></VectorInput><br>
        <span>directionY=</span>
        <VectorInput v-model="directionY" normalized></VectorInput><br>
        <span>rotationAxis=</span>
        <VectorInput v-model="rotationAxis" normalized></VectorInput><br>
        <span>rotationAngularSpeed=</span>
        <input v-model="rotationAngularSpeed"><br>
        <span>width=</span>
        <input v-model="objectWidth"><br>
        <span>height=</span>
        <input v-model="objectHeight"><br>
        <button @click="$emit('destroy', props.baiKey)">Destroy</button>
    </div>
    <div class="bai-object-preview" v-if="props.showEdit">
        <slot></slot>
    </div>
    <div class="bai-object-peek" v-if="props.showEdit">
        <slot></slot>
    </div>
</Teleport>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { inject, onMounted, ref, unref } from 'vue';

import VectorInput from './VectorInput.vue'
import CustomCheckbox from './CustomCheckbox.vue'

// Destory
const emit = defineEmits(['destroy'])

// Initial Position and Velocity
const props = defineProps({
    runPhysics: Boolean,
    drawPathPoints: Number,
    params: Object,
    showEdit: Boolean,
    baiKey: {}
})
let params = props.params
// initialPos: Vector3d,
// initialVelocity: Vector3d,
// objectWidth: Number,
// objectHeight: Number,
// initialDirectionY: Vector3d,
// initialDirecitonZ: Vector3d,
// rotationAxis: Vector3d,
// rotationAngularSpeed: Number,  （rad/frame）

// Record Position and Velocity
const universePos = ref(params.initialPos)
const universeVelocity = ref(params.initialVelocity)


// Cordinate Transformation from Universal to ViewPoint
const universeToViewPointTransform = inject('universeToViewPointTransform')

// ViewPoint Cordinate in Universal Cordinate System
const universeViewPointPos = inject('universeViewPointPos')

// Position in ViewPoint Cordinate System
const viewPointPos = computed(() => 
    universeToViewPointTransform.value.dotVec(
        universePos.value.minus(universeViewPointPos.value)
    )
)

// Window Size and ViewPoint Distance to Window
const { windowWidth, windowHeight } = inject('windowSize')
const viewPointDistanceToWindow = inject('viewPointDistanceToWindow')

// Position on the Window
const windowPos = computed(() => {
    return {
        x: Math.floor(viewPointPos.value.x * viewPointDistanceToWindow.value
                        / viewPointPos.value.z + windowWidth.value / 2),
        y: Math.floor(viewPointPos.value.y * viewPointDistanceToWindow.value
                        / viewPointPos.value.z + windowHeight.value / 2)
        }
})

// Size on the Window
const objectWidth = ref(params.objectWidth)
const objectHeight = ref(params.objectHeight)

const windowDisplayedWidth = computed(() =>
    Math.floor(
        unref(objectWidth.value) * viewPointDistanceToWindow.value / viewPointPos.value.z)
    )
const windowDisplayedHeight = computed(() =>
    Math.floor(
        unref(objectHeight.value) * viewPointDistanceToWindow.value / viewPointPos.value.z)
    )

// Rotation in Universal Cordinate System
const directionX = ref(params.initialDirectionX)
const directionY = ref(params.initialDirectionY)

// ViewPoint Direction in Universal Cordinate System
const viewPointDirectionX = inject('viewPointDirectionX')
const viewPointDirectionY = inject('viewPointDirectionY')

// Rotation in Window Cordinate System
function calcWindowRotationData() {
    // Rotation Step One: Rotate viewPointDirectionX to directionX
    let windowRotationAxis1 = viewPointDirectionX.value.cross(directionX.value).normalized()
    let windowRotationRad1 = 
        Math.acos(viewPointDirectionX.value.dot(directionX.value))
        * Math.sign(viewPointDirectionX.value
                        .cross(windowRotationAxis1).dot(directionX.value))
    
    // Rotation Step Two: Rotate rotated1ViewPointDirectionY to directionY
    let rotated1ViewPointDirectionY = viewPointDirectionY.value.rotate(
        windowRotationAxis1, windowRotationRad1
    )
    let windowRotationAxis2 = directionX.value
    let windowRotationRad2 =
        Math.acos(rotated1ViewPointDirectionY.dot(directionY.value))
        * Math.sign(rotated1ViewPointDirectionY
                        .cross(windowRotationAxis2).dot(directionY.value))
    
    // So They Have to Be Transformed into ViewPoint Cordinate System
    windowRotationAxis1 = universeToViewPointTransform.value.dotVec(windowRotationAxis1)
    windowRotationAxis2 = universeToViewPointTransform.value.dotVec(windowRotationAxis2)

    return {windowRotationAxis1, windowRotationRad1,
            windowRotationAxis2, windowRotationRad2}
}

// Calculate Velocity and Position
const runPhysics = ref(props.runPhysics)

const gravityConstant = inject('gravityConstant')
function updatePhysics(deltaT) {
    universeVelocity.value = universeVelocity.value.minus(
        universePos.value.scale(gravityConstant.value * deltaT
                                / universePos.value.norm() ** 3)
    )
    universePos.value = universePos.value.add(
        universeVelocity.value.scale(deltaT)
    )
}

// Apply Rotation
const rotationAxis = ref(params.rotationAxis)
const rotationAngularSpeed = ref(params.rotationAngularSpeed)

function rotateBaiObj(deltaT) {
    directionX.value = directionX.value.rotate(
        rotationAxis.value,
        rotationAngularSpeed.value * deltaT
    )
    directionY.value = directionY.value.rotate(
        rotationAxis.value,
        rotationAngularSpeed.value * deltaT
    )
}

// Get z-index
const zIndexer = inject('zIndexer')
const zIndex = computed(() => 
    zIndexer.getZIndex(viewPointPos.value.z, props.baiKey))

// Render Bai
const baiObjStyle = ref('')
const rotateStyle = ref('')
function renderBai() {
    // Does not Render When Behind the Window
    if(viewPointPos.value.z <= 0){
        baiObjStyle.value = 'display: none'
    }else{
        // Format Rotation Data
        let {windowRotationAxis1, windowRotationRad1,
            windowRotationAxis2, windowRotationRad2} = calcWindowRotationData()
        let ra1x = windowRotationAxis1.x
        let ra1y = windowRotationAxis1.y
        let ra1z = windowRotationAxis1.z
        let ra2x = windowRotationAxis2.x
        let ra2y = windowRotationAxis2.y
        let ra2z = windowRotationAxis2.z
        let rdeg1 = windowRotationRad1 / Math.PI * 180
        let rdeg2 = windowRotationRad2 / Math.PI * 180
        // Build CSS String
        // Transform is Executed From Right to Left. Damn It!
        baiObjStyle.value = `
            left: ${windowPos.value.x - windowDisplayedWidth.value / 2}px;
            top: ${windowPos.value.y -  windowDisplayedHeight.value / 2}px;
            width: ${windowDisplayedWidth.value}px;
            height: ${windowDisplayedHeight.value}px;
            z-index: ${zIndex.value};
            perspective: ${viewPointPos.value.z}
        `
        rotateStyle.value = `
            transform: 
                    rotate3d(${ra2x}, ${ra2y}, ${ra2z}, ${-rdeg2}deg)
                    rotate3d(${ra1x}, ${ra1y}, ${ra1z}, ${-rdeg1}deg);
        `
    }
}

// Animation Loop
const deltaT = inject('deltaT')

function animationLoop(timestamp) {

    if(runPhysics.value){
        updatePhysics(deltaT.value)
    }

    if(params.rotationAngularSpeed){
        rotateBaiObj(deltaT.value)
    }

    renderBai()
        
    

    requestAnimationFrame(animationLoop)
}

// Bai !
onMounted(() => {animationLoop()})

</script>

<style scoped>
.bai-object {
    position: fixed;
    display: flex;
}
.border-container {
    align-self: center;
}
.param-editor {
    border: solid aliceblue 1px;
    display: inline-block;
}
.bai-object-preview {
    max-width: 100px;
    max-height: 100px;
}
.bai-object-peek {
    display: none;
    z-index: 999;
}
.bai-object-preview:hover~.bai-object-peek {
    max-width: 80%;
    max-height: 100vh;
    position: fixed;
    display: block;
    right: 10px;
    top: 10px
}
</style>