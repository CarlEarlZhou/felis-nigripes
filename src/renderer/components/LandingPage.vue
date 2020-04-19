<template>
<div style="height: 100%; display: flex; flex-direction: column;">
    <el-row>
      <el-col :span="6">
        <div class="menu-text">
          系统
        </div>
        <mu-button color="primary" @click="openWindow">添加文件</mu-button>
        <mu-button color="primary" @click="editRule">编辑规则</mu-button>
        <mu-button color="primary" @click="editTag">编辑标签</mu-button>

      </el-col>
      <el-col :span="12">
        <div class="menu-text">
          文件
        </div>
        <mu-button color="primary">
          详细信息
        </mu-button>
      </el-col>
      <el-col :span="6">
        <div class="menu-text">
          OneDrive
        </div>
        <mu-button color="primary" @click="login">
          登录
        </mu-button>
        <mu-button color="primary" @click="logout">
          注销
        </mu-button>
        <mu-button color="primary" @click="testapi">
          test
        </mu-button>
        <span>{{test}}</span>
      </el-col>
      
    </el-row>
    <br>
    <el-row  style="display: flex; align-items: center;">
      <el-col :span="19">
        <address-bar ref="address_bar" @change-type="search_type=$event"></address-bar>
      </el-col>
      <el-col :span="5" style="display: flex;">
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-input v-model="search_content" placeholder="在此处搜索"></el-input>
        
      </el-col>
    </el-row>
    <br>
    <el-row style="flex: 1; ">
        <el-col :span="5" 
          style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; border: 5px #90a4ae double;">
          <mu-appbar z-depth="0" style="width: 100%; text-align: center; height: 3.5rem;" color="blueGrey300">
            <span style="font-size: 1.1rem; width: 100%;">标签类别</span>
          </mu-appbar>
          <div style="flex: 1; overflow-y: scroll">
            <file-tag :multiple="true" v-model="selected_tag"></file-tag>
          </div>
        </el-col>
        <el-col :span="19" style="height: 100%; overflow-y: scroll; border-top: 5px #90a4ae double;">
          <result :selected_tag="selected_tag" 
            :search_content="search_content"
            :folder_type="search_type"
          ></result>
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
import axios from 'axios'


export default {
    name: 'LandingPage',
    components: {
      FileTag,
      AddressBar,
      Result,
    },
    data() {
      return {
        search_type: false,
        selected_tag: [],
        search_content: '',
        test: ''
      }
    },
    methods: {
      testapi() {
        axios.get(`https://graph.microsoft.com/v1.0/users/AAAAAAAAAAAAAAAAAAAAAD6aI_eNU5zA_aeaybtin6o/me/drive/root`,
        {
          headers: {
            Authorization: 'bearer ' + this.$store.getters.token
          }
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
        // console.log(this.$store.getters.token)
        // this.test=this.$store.getters.token
      },
      login() {
        ipcRenderer.send('login')
      },
      logout() {
        ipcRenderer.send('logout')
      },
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
