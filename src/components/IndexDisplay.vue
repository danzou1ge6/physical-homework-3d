<template>
    <h1>Index</h1>
    <h2>{{ msg }}</h2>
    <ul>
        <li v-for="key in Object.keys(index)" :key="key">
            <a class="link" :href="`${BASE_URL}#${key}`" 
                target="_blank">
                {{ key }}
            </a><br>
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
const props = defineProps(['index', 'msg'])

const BASE_URL = import.meta.env.BASE_URL

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
h2 {
    color: aliceblue;
    text-align: center;
}
.link:hover {
    color: black;
    background-color: aliceblue;
}
.further-info {
    display: none;
}
.link:hover~.further-info {
    display: block;
}
</style>
