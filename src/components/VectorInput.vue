<template>
    <input :placeholder="props.modelValue.x" v-model="mx"><span>,</span>
    <input :placeholder="props.modelValue.y" v-model="my"><span>,</span>
    <input :placeholder="props.modelValue.z" v-model="mz">
    <button @click="submit">Submit</button>
</template>

<script setup>import { ref } from 'vue';
import { Vector3d } from '../lib/linalg';

const props = defineProps(['modelValue', 'normalized'])
const emit = defineEmits(['update:modelValue'])

const mx = ref('')
const my = ref('')
const mz = ref('')

function submit() {
    let x = mx.value == '' ? props.modelValue.x : mx.value
    let y = my.value == '' ? props.modelValue.y : my.value
    let z = mx.value == '' ? props.modelValue.z : mz.value

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
