<template>
    <span>[</span>
    <input :placeholder="props.modelValue.x.toFixed(props.displayedDigits)" 
        v-model="mx"><span>,</span>
    <input :placeholder="props.modelValue.y.toFixed(props.displayedDigits)"
        v-model="my"><span>,</span>
    <input :placeholder="props.modelValue.z.toFixed(props.displayedDigits)"
        v-model="mz">
    <span>]</span>
    <button @click="submit">Set</button>
</template>

<script setup>
import { ref } from 'vue';
import { Vector3d } from '../lib/linalg';

const props = defineProps({
    modelValue: {type: Vector3d},
    normalized: {type: Boolean, default: false},
    displayedDigits: {type: Number, default: 3}
})
const emit = defineEmits(['update:modelValue'])

const mx = ref('')
const my = ref('')
const mz = ref('')

function submit() {
    let x = mx.value === '' ? props.modelValue.x : mx.value
    let y = my.value === '' ? props.modelValue.y : my.value
    let z = mz.value === '' ? props.modelValue.z : mz.value

    // Force Convert to Number
    x = Number(x)
    y = Number(y)
    z = Number(z)
    let v = new Vector3d([x, y, z])

    // In Case of Rotation Axis, etc.
    if(props.normalized){v = v.normalized()}

    emit('update:modelValue', v)

    // Clear Input
    mx.value = my.value = mz.value = ''
}
</script>
