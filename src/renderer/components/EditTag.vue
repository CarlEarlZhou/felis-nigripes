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
        <el-button type="primary" @click="openAlertDialog(0)">添加标签</el-button>
      </el-col>
      
    </el-row>
    <!-- 用户确认操作的窗口 -->
    <mu-dialog :title="dialog_info[current_dialog_info]" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="open_alert">
      <mu-button slot="actions" flat color="primary" @click="closeAlertDialog(false)">取消</mu-button>
      <mu-button slot="actions" flat color="primary" @click="closeAlertDialog(true)">确定</mu-button>
    </mu-dialog>
    <br>
    <mu-divider></mu-divider>
    <br>
    <el-row type="flex" style="align-items: center;" justify="center">
      <el-col :span="2" style="text-align: right;">
        <span>添加分类：&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </el-col>
      <el-col :span="5">
        <el-input v-model="new_group_name" label="test"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="openAlertDialog(1)">添加分类</el-button>
      </el-col>
      
    </el-row>
    <br>
    <mu-divider></mu-divider>
    <br>
    <el-row :gutter="20">
      <el-col :span="6">
        <file-tag v-model="selected_tag" :editable="true" :key="timer"></file-tag>
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
          <mu-button color="error" @click="openAlertDialog(3)">删除</mu-button>
          <mu-button color="primary" @click="openAlertDialog(2)">更新</mu-button>
          
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
      new_group_name: '',
      selected_tag: [],
      // detail info of selected_tag[0]
      current_tag: null,
      value1: '2333333',
      options: [],
      tag_groups: [],
      timer: '',
      open_alert: false,
      dialog_info: [
        '添加标签？',
        '添加分类？',
        '修改标签？',
        '删除标签？',
      ],
      current_dialog_info: 0
    }
  },
  methods: {
    updateFileTagComponent() {
      this.timer = new Date().getTime()
    },
    openAlertDialog (index) {
      this.current_dialog_info = index
      this.open_alert = true
    },
    closeAlertDialog (flag) {
      if (flag) {
        if (this.current_dialog_info === 0) {
          this.addTag()
        }
        else if (this.current_dialog_info === 1) {
          this.addGroup()
        }
        else if (this.current_dialog_info === 2) {
          this.updateTag()
        }
        else if (this.current_dialog_info === 3) {
          this.deleteTag()
        }
      }
      this.open_alert = false;
    },
    async addTag() {
      this.new_tag_name = this.new_tag_name.trim()
      if (this.new_tag_name.length > 0) {
        // TODO: 标签已经存在时弹窗提醒
        if (!(await db.isTagExist(this.new_tag_name))) {
          let group_id = this.tag_groups[0].id
          await db.addTag(this.new_tag_name, group_id)
          this.updateFileTagComponent()
          this.new_tag_name = ''
        }
      }
    },
    async addGroup() {
      this.new_group_name = this.new_group_name.trim()
      // check if new_group_name already exists
      if (this.tag_groups.filter(element => {
        if (element.name == this.new_group_name) {
          return true
        }
        else {
          return false
        }
      }).length == 0) {
        let res = await db.addTagGroup(this.new_group_name)
        this.tag_groups.push(res)
        this.updateFileTagComponent()
        this.new_group_name = ''
      }
    },
    async updateTag() {
      await db.updateTagByID(this.current_tag)
      this.updateFileTagComponent()
      this.selected_tag.splice(0, 1)
    },
    async deleteTag() {
      await db.deleteTagByID(this.selected_tag[0])
      this.selected_tag.splice(0, 1)
      this.updateFileTagComponent()
    }
  },
  async beforeMount() {
    this.tag_groups = await db.getTagGroup()
  }
}
</script>

<style lang="" scoped>
    
</style>