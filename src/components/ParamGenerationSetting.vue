<template>
<div v-for="(key, i) in Object.keys(setting)" :key="i">
    <span>{{ key }}=</span><input v-model="setting[key]">
    <br>
</div>
<button @click="submit">Generate</button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['generationConstants'])
const emit = defineEmits(['generate'])

const setting = ref(props.generationConstants)

function submit() {
    emit('generate', setting.value)
}

</script>

<style scoped>
button {
    position: relative;
    left: 16em;
}
</style>
