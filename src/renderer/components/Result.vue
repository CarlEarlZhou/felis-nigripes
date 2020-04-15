<template>
<div>
  
  <el-row>
    <el-col :span="content_width"
      v-for="f in result"
      :key="f.full_path"
      @click.native="showDetail(f)"
    >
      <div v-if="hasTags(f.tags) && (!f.search_result)">
        <el-row
          style="display: flex; align-items: center; min-height: 40px;"
        >
          <el-col :span="1" style="display: flex; justify-content: center;">
            <mu-icon v-if="f.type=='folder'" value="folder"></mu-icon>
            <mu-icon v-if="f.type!='folder'" value="description"></mu-icon>
          </el-col>
          <el-col :span="9">{{f.name}}</el-col>
          <el-col :span="14">
            <mu-chip
              v-for="tag in f.tags.keys()"
              :key="tag.id"
              color="green"
            >
              {{tag.name}}
            </mu-chip>
          </el-col>
        </el-row>
        <mu-divider></mu-divider>
      </div>
    </el-col>
  </el-row>

  <mu-drawer :open.sync="open_detail" :docked="false" :right="true" style="width: 50%">
    <div v-if="cur_file" style="padding-left: 3em;">
      <h2>{{cur_file.name}}</h2>
      <mu-divider></mu-divider>
      <div>
        
      </div>
      <mu-divider></mu-divider>
      <div v-if="!edit_cur_file_tag">
        <span>标签：</span>
        <mu-chip
          v-for="tag in cur_file.tags.keys()"
          :key="tag.id"
          color="green"
        >
          {{tag.name}}
        </mu-chip>
        <br>
        <mu-button color="primary" @click="changeTag">修改标签</mu-button>
      </div>
      <div v-if="edit_cur_file_tag">
        <mu-chip
          v-for="(tag, index) in cur_file_tags"
          :key="tag.id"
          color="green"
          delete
          @delete="removeTag(index)"
        >
          {{tag.name}}
        </mu-chip>
        <file-tag :multiple="true" v-model="cur_file_tags"></file-tag>
        <br>
        <mu-button color="primary" @click="confirmRemoveTag">确定</mu-button>
        <mu-button color="primary" @click="cancleRemoveTag">取消</mu-button>
      </div>
      <mu-divider></mu-divider>
      <el-row>
        <el-col :span="5">大小：</el-col>
        <el-col :span="19">{{cur_file_info.size}}kb</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">创建时间：</el-col>
        <el-col :span="19">{{cur_file_info.birthtime}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">修改时间：</el-col>
        <el-col :span="19">{{cur_file_info.ctime}}</el-col>
      </el-row>
    </div>
  </mu-drawer>
</div>
</template>

<script>
import db from '@/db'
import FileTag from '@/components/FileTag'
import fs from 'fs'
import _ from 'lodash'

export default {
  name: '',
  components: {
    FileTag
  },
  props: [
    'selected_tag',
    'search_content'
  ],
  data() {
    return {
      content_width: 24,
      folder_type: false,
      result: [],
      open_detail: false,
      cur_file: null,
      cur_file_info: {},
      edit_cur_file_tag: false,
      cur_file_tags: [],
    }
  },
  watch: {
    '$store.state.Counter.cur_node': function() {
      if (this.folder_type) {
        
      }
      else {
        let tem
        let search_list = []
        search_list.push(this.$store.state.Counter.cur_node)
        let result_list = []
        for (let i = 0; i < search_list.length; ++i) {
          if (search_list[i].type == 'folder') {
            for (let t of search_list[i].childNodes.values()) {
              search_list.push(t)
            }
          }
          else {
            result_list.push(search_list[i])
          }
        }
        this.result = result_list
        console.log(this.result)
      }
    },
    search_content() {
      this.matchSearch()
    }
  },
  methods: {
    showDetail(f) {
      this.cur_file = f
      this.getFileInfo(f)
      this.open_detail = true
    },
    hasTags(tag_map) {
      let tem_set = new Set()
      for (let tag of tag_map.keys()) {
        tem_set.add(tag.id)
      }
      for (let tag of this.selected_tag) {
        if (!tem_set.has(tag.id)) {
          return false
        }
      }
      return true
    },
    changeTag() {
      this.cur_file_tags = []
      for (let tag of this.cur_file.tags.keys()) {
        this.cur_file_tags.push(tag)
      }
      this.edit_cur_file_tag = true
    },
    removeTag(index) {
      this.cur_file_tags.splice(index, 1)
    },
    cancleRemoveTag() {
      this.edit_cur_file_tag = false
    },
    confirmRemoveTag() {
      for (let tag of this.cur_file_tags) {
        if (!this.cur_file.tags.has(tag)) {
          this.cur_file.addTag(tag)
        }
      }
      for (let tag of this.cur_file.tags.keys()) {
        if (!this.cur_file_tags.includes(tag)) {
          this.cur_file.removeTag(tag)
        }
      }
      this.edit_cur_file_tag = false
    },
    getFileInfo(f) {
      fs.stat(f.full_path, (err, res) => {
        console.log(res)
        this.cur_file_info = res
        this.cur_file_info.size /= 1000
        this.cur_file_info.ctime = (new Date(this.cur_file_info.ctimeMs)).toLocaleString()
        this.cur_file_info.birthtime = (new Date(this.cur_file_info.birthtimeMs)).toLocaleString()
        console.log(this.cur_file_info)
      })
    },
    matchSearch: _.debounce(function() {
      let search_list = this.search_content.split('')
      for (let f of this.result) {
        let index = 0
        let flag = true
        for (let char of search_list) {
          index = f.name.indexOf(char, index)
          if (index < 0) {
            flag = false
            f.search_result = true
            break
          }
        }
        if (flag) {
          f.search_result = false
        }
      }
      // 更新视图
      this.result.push(0)
      this.result.pop()
    }, 1000)
  },
  created() {
    // console.log(this.$store)
  }
}
</script>

<style scoped>
    
</style>