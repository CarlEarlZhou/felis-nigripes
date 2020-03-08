<template>
<div>
    <el-row>
        <el-col>
            <el-button type="primary" plain @click="openWindow">添加</el-button>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="5">
          <file-tag></file-tag>
        </el-col>
        <el-col :span="19">result</el-col>
    </el-row>
</div>
</template>

<script>
import db from '@/db'
import {ipcRenderer} from 'electron'
import FileTag from '@/components/FileTag'


export default {
    name: 'LandingPage',
    components: {
      FileTag
    },
    data() {
      return {
        // tableData: []
      }
    },
    methods: {
        openWindow() {
            ipcRenderer.send('add-file')
        }
    },
    async mounted() {
    }
}
</script>

<style>
  /* CSS */
</style>
