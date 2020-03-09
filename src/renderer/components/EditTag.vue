<template>
  <div>
    <br>
    <el-row type="flex" style="align-items: center;" justify="center">
      <el-col :span="2" style="text-align: right;">
        <span>添加标签：&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </el-col>
      <el-col :span="5">
        <el-input v-model="new_tag_name" label="test"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="addTag">添加标签</el-button>
      </el-col>
      
    </el-row>
    <br>
    <mu-divider></mu-divider>
    <br>
    <el-row type="flex" style="align-items: center;" justify="center">
      <el-col :span="2" style="text-align: right;">
        <span>添加分类：&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </el-col>
      <el-col :span="5">
        <el-input v-model="new_tag_name" label="test"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="addTag">添加分类</el-button>
      </el-col>
      
    </el-row>
    <br>
    <mu-divider></mu-divider>
    <br>
    <el-row :gutter="20">
      <el-col :span="6">
        <file-tag v-model="selected_tag" :key="timer"></file-tag>
      </el-col>
      <el-col :span="18">
        <div v-if="current_tag !== null">
          <h2>{{ current_tag.name }}</h2>
          <div><span>标签名：</span><mu-text-field v-model="current_tag.name"></mu-text-field></div>
          <div>
            <span>标签分类：</span>
            <mu-select v-model="current_tag.tag_group_id">
              <mu-option
                v-for="tag_group in tag_groups" :key="tag_group.id"
                :label="tag_group.name" :value="tag_group.id">
              </mu-option>
            </mu-select>
          </div>
          <mu-button color="primary" @click="updateTag">更新</mu-button>
        </div>
      </el-col>
    </el-row>
    
    
  </div>
</template>

<script>
import FileTag from '@/components/FileTag'
import db from '@/db'

export default {
  name: 'EditTag',
  components: {
    FileTag
  },
  watch: {
    selected_tag: async function(arr) {
      if (arr.length !==0) {
        let tag_id = arr[0]
        this.current_tag = await db.getTagByID(tag_id)
      }
      else {
        this.current_tag = null
      }
    }
  },
  data() {
    return {
      new_tag_name: '',
      selected_tag: [],
      // detail info of selected_tag[0]
      current_tag: null,
      value1: '2333333',
      options: [],
      tag_groups: [],
      timer: ''
    }
  },
  methods: {
    addTag() {

    },
    async updateTag() {
      await db.updateTagByID(this.current_tag)
      this.timer = new Date().getTime()
      this.selected_tag.splice(0, 1)
    }
  },
  async beforeMount() {
    this.tag_groups = await db.getTagGroup()
  }
}
</script>

<style lang="" scoped>
    
</style>