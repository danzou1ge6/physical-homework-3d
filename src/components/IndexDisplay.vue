<template>
    <h1>Index</h1>
    <ul>
        <li v-for="key in Object.keys(index)" :key="key">
            <span @click="gotoPage(key)" class="link">
                {{ key }}
            </span><br>
            <div class="further-info">
                <span>Center: {{ index[key].center }}</span><br>
                <span>Outer: </span><br>
                <ul>
                    <li v-for="(item, i) in index[key].outer" :key="i">
                        {{ item }}
                    </li>
                </ul>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import idx from '/displayed/index.json';

function gotoPage(key) {
    location.href = '/#' + key
    location.reload()
}

const index = ref([])

onMounted(() => {
    index.value = idx
})


</script>

<style scoped>
ul {
    font-size: x-large;
}
li {
    color: aliceblue
}
a {
    color: aliceblue;
}
.link:hover {
    color: black;
    background-color: aliceblue;
    cursor: pointer;
}
.further-info {
    display: none;
}
.link:hover~.further-info {
    display: block;
}
</style>
