<template>
    <span>[</span>
    <input :placeholder="placeholder.x" 
        v-model="mx"><span>,</span>
    <input :placeholder="placeholder.y"
        v-model="my"><span>,</span>
    <input :placeholder="placeholder.z"
        v-model="mz">
    <span>]</span>
    <button @click="submit">Set</button>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { Vector3d } from '../lib/linalg';

const props = defineProps({
    modelValue: {type: Vector3d},
    normalized: {type: Boolean, default: false},
    displayedDigits: {type: Number, default: 3}
})
const emit = defineEmits(['update:modelValue'])

const placeholder = computed(() =>
    props.modelValue ? {
        x: props.modelValue.x.toFixed(props.displayedDigits),
        y: props.modelValue.y.toFixed(props.displayedDigits),
        z: props.modelValue.z.toFixed(props.displayedDigits)
    } : {
        x: 'null', y: 'null', z: 'null'
    }
)

const mx = ref('')
const my = ref('')
const mz = ref('')

function submit() {
    // if `modelValue` is Empty and one of x,y,z is Empty
    if((!props.modelValue) && (mx.value === '' ||
                               my.value === '' ||
                               mz.value === '')){
        return
    }

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
