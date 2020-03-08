<template>
  <div>
    <div style="boder: 1px red solid;">
      <el-collapse v-model="activeGroupNames">
        <el-collapse-item
          v-for="tag_group in all_tag_list"
          :key="tag_group.group_name"
          :title="tag_group.group_name"
          :name="tag_group.group_id">
          <el-button
            v-for="tag in tag_group.tag_list"
            :key="tag.id"
            type="primary" round
          >
            {{tag.name}}
          </el-button>
        </el-collapse-item>
        
      </el-collapse>
    </div>
    <div>
      <el-button type="primary" @click="editTag">编辑标签</el-button>
      
    </div>
  </div>
</template>

<script>
import db from '@/db'
import {ipcRenderer} from 'electron'

export default {
  name: 'FileTag',
  data() {
    return {
      activeGroupNames: [],
      all_tag_list: [{
        group_name: "ungrouped",
        group_id: 1,
        tag_list: []
      }]
    }
  },
  methods: {
    editTag() {
      ipcRenderer.send('edit-tag')
    }
  },
  async beforeMount() {
    this.all_tag_list = []
    let group_list = await db.getTagGroup()
    group_list.forEach(async (tag_group) => {
      let tag_list = await db.getTagsByGroupID(tag_group.id)
      this.all_tag_list.push({
        group_name: tag_group.name,
        group_id: tag_group.id,
        tag_list: tag_list
      })
    })
  }
}
</script>

<style lang="" scoped>
    
</style>