<template>
<div>
    <el-row>
        <el-col>
            <mu-button color="primary" @click="openWindow">添加</mu-button>
        </el-col>
    </el-row>
    <el-row>
      <el-col :span="19">
        <address-bar></address-bar>
      </el-col>
      <el-col :span="5">search bar</el-col>
    </el-row>
    
    <el-row>
        <el-col :span="5">
          <file-tag :multiple="true" v-model="selected_tag"></file-tag>
          <div>
            <mu-button color="primary" @click="editTag">编辑标签</mu-button>
            
          </div>
        </el-col>
        <el-col :span="19">
          <result></result>
        </el-col>
    </el-row>
</div>
</template>

<script>
import db from '@/db'
import {ipcRenderer} from 'electron'
import FileTag from '@/components/FileTag'
import AddressBar from '@/components/AddressBar'
import Result from '@/components/Result'
import path from 'path'


export default {
    name: 'LandingPage',
    components: {
      FileTag,
      AddressBar,
      Result
    },
    data() {
      return {
        selected_tag: [],
      }
    },
    methods: {
      editTag() {
        ipcRenderer.send('edit-tag')
      },
      openWindow() {
        ipcRenderer.send('add-file')
      }
    },
    async mounted() {
      console.log(this.$store)
      this.$store.dispatch('init')
      let file_list = await db.getFile()
      let promise_list = []
      for (let file of file_list) {
        promise_list.push(db.getTagsByFileID(file.id))
      }
      Promise.all(promise_list).then(res => {
        for (let i = 0; i < res.length; i++) {
          file_list[i].tags = res[i]
          this.$store.dispatch('addFile', file_list[i])
          // console.log(this.$store.state.Counter.file_node.childNodes)
        }
      })
    }
}
</script>

<style>
  /* CSS */
</style>
