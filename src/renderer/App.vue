<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {db, initDB} from './db'

export default {
    name: 'felis-nigripes',
    mounted() {
        db.all('select * from test', function(err, res) {
            console.log(res)
        })
    }
}
</script>

<style>
  /* CSS */
</style>
