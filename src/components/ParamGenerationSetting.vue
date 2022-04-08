<template>
<div v-for="(key, i) in scalerKeys" :key="i">
    <span>{{ key }}=</span><input v-model="setting[key]">
    <br>
</div>
<div v-for="(key, i) in normVectorKeys" :key="i">
    <span>{{ key }}=</span>
    <VectorInput v-model="setting[key]"></VectorInput>
    <br>
</div>
<button @click="submit" 
    :disabled="props.selected == -2">{{ generationTarget }}</button>
<br>
<div class="imgurl-inp-container">
    <span>imageURL=</span>
    <input v-model="imageURL"
        class="imgurl-inp"
        placeholder="/physical-homework-3d/SorakadoAi.jpg">
    <br>
</div>
<button @click="add">Add New</button>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import VectorInput from './VectorInput.vue';

const props = defineProps(['generationConstants', 'selected'])
const emit = defineEmits(['generate', 'add'])

// Settings That are Scalers
const scalerKeys = [
    'minObjRadius',
    'maxObjRadius',
    'tanVelocityFromRadius',
    'minSpeedCoefficient',
    'maxSpeedCoefficient',
    'minRotationAngularSpeed',
    'maxRotationAngularSpeed',
    'imgSize']

// Settings That are Normal Vectors
const normVectorKeys = [
    'planeNormalVector'
]

const setting = ref(props.generationConstants)
const imageURL = ref('/physical-homework-3d/SorakadoAi.jpg')

const generationTarget = computed(() => {
    if(props.selected == -1){
        return 'Generate for all'
    }else if(props.selected == -2){
        return 'Don\'t Generate for Center Bai Object'
    }else{
        return `Generate for Bai Object ${props.selected}`
    }
})

function submit() {
    scalerKeys.forEach(k => {
        setting.value[k] = Number(setting.value[k])
    })
    emit('generate', setting.value)
}

function add() {
    scalerKeys.forEach(k => {
        setting.value[k] = Number(setting.value[k])
    })
    emit('add', setting.value, imageURL.value)
}

</script>

<style scoped>
button {
    position: relative;
    display: inline-block;
}
input.imgurl-inp {
    flex-grow: 1;
}
.imgurl-inp-container {
    display: flex;
}
</style>
