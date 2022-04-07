<template>
<div class="container">
    <span :class="className" @click="toggle">
        <slot></slot>
    </span>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({modelValue: Boolean})
const emit = defineEmits(['update:modelValue'])

const className = ref('checked')

function toggle() {
    if(props.modelValue){
        emit('update:modelValue', false)
        className.value = 'unchecked'
    }else{
        emit('update:modelValue', true)
        className.value = 'checked'
    }
}

onMounted(() => {
    className.value = props.modelValue ? 'checked' : 'unchecked'
})

</script>

<style scoped>
.container {
    display: inline;
    margin: 0px 0px 0px 0px;
}
.checked {
    background-color: aliceblue;
    color: black;
}
.unchecked {
    background-color: rgba(0,0,0,0);
    color: aliceblue
}
span:hover {
    cursor: pointer;
}
span.unchecked:hover {
    background-color: aliceblue;
    color: black;
}
</style>
