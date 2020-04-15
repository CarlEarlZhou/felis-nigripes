<template>
<div>
    <el-row>
      <el-col :span="6">
        <div class="menu-text">
          系统
        </div>
        <mu-button color="primary" @click="openWindow">添加文件</mu-button>
        <mu-button color="primary" @click="editRule">编辑规则</mu-button>
      </el-col>
      <el-col :span="12">
        <div class="menu-text">
          文件
        </div>
        <mu-button color="primary">
          详细信息
        </mu-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="19">
        <address-bar ref="address_bar"></address-bar>
      </el-col>
      <el-col :span="5">
        <el-input v-model="search_content"></el-input>
        
      </el-col>
    </el-row>
    
    <el-row>
        <el-col :span="5">
          <file-tag :multiple="true" v-model="selected_tag"></file-tag>
          <div>
            <mu-button color="primary" @click="editTag">编辑标签</mu-button>
            
          </div>
        </el-col>
        <el-col :span="19">
          <result :selected_tag="selected_tag" :search_content="search_content"></result>
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
      Result,
      
    },
    data() {
      return {
        selected_tag: [],
        search_content: ''
      }
    },
    methods: {
      editTag() {
        ipcRenderer.send('edit-tag')
      },
      editRule() {
        console.log(233)
        ipcRenderer.send('edit-rule')
      },
      openWindow() {
        ipcRenderer.send('add-file')
      }
    },
    async created() {
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
    },
    // mounted() {
    //   console.log(this.$refs.address_bar)
    //   this.$refs.address_bar.submit()
    // }
}
</script>

<style>
.menu-text {
  width: 100%;
  text-align: center;
}
</style>
