<template>
<div id="app">
    <router-view></router-view>
</div>
</template>

<script>
import db from './db'
import {ipcRenderer} from 'electron'

export default {
    name: 'felis-nigripes',
    methods: {
        openWindow() {
            ipcRenderer.send('add')
        }
    },
    async mounted() {
        // let ans = await db.excute('select * from test')
        // console.log(ans)
    }
}
</script>

<style>
.body {
    background-color: white;
}

#app {
    height: 100%;
}
</style>
