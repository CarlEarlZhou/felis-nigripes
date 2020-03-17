<template>
  <div>
    <div style="boder: 1px red solid;">

      <mu-expansion-panel 
        v-for="tag_group in all_tag_list"
        :key="tag_group.group_name"
      >
        
        <div slot="header">{{tag_group.group_name}}</div>
        <mu-button
          v-for="tag in tag_group.tag_list"
          :key="tag.id"
          color="success" round
          @click="selectTag(tag.id)"
        >
          {{tag.name}}
          <mu-icon v-if="selected_tag.includes(tag.id)" right value="check_circle"></mu-icon>
        </mu-button>
        <div v-if="editable && tag_group.group_name !== 'ungrouped'">
          <mu-divider></mu-divider>
          <mu-flex class="flex-wrapper" justify-content="end">
            <mu-button flat color="secondary" @click="deleteGroup(tag_group)">删除分组</mu-button>
          </mu-flex>
        </div>
      </mu-expansion-panel>
    </div>
    <mu-dialog title="删除分组？" width="360" :open.sync="open_dialog">
      分组被删除后，该分组下的所有标签会被一并删除
      <mu-button slot="actions" flat color="primary" @click="confirmAction">确认</mu-button>
    </mu-dialog>
    
  </div>
</template>

<script>
import db from '@/db'
import {ipcRenderer} from 'electron'

export default {
  props: [
    'multiple',
    'editable',
    'value'
  ],
  name: 'FileTag',
  data() {
    return {
      component_type: (this.multiple === true) ? true : false,
      all_tag_list: [{
        group_name: "ungrouped",
        group_id: 1,
        tag_list: []
      }],
      open_dialog: false,
      on_delete_group: undefined
    }
  },
  computed: {
    selected_tag() {
      return this.value
    }
  },
  methods: {
    async loadData() {
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
    },
    deleteGroup(tag_group) {
      this.on_delete_group = tag_group
      this.open_dialog = true
    },
    async confirmAction() {
      console.log(this.on_delete_group)
      await db.deleteTagGroupByID(this.on_delete_group.group_id)
      this.loadData()
      this.on_delete_group = undefined
      this.open_dialog = false
    },
    selectTag(tag_id) {
      if (this.component_type) {
        let tag_index = this.selected_tag.indexOf(tag_id)
        if (tag_index > -1) {
          this.selected_tag.splice(tag_index, 1)
        }
        else {
          this.selected_tag.push(tag_id)
        }
      }
      else {
        if (this.selected_tag.length === 0) {
          this.selected_tag.push(tag_id)
        }
        else if (this.selected_tag[0] === tag_id) {
          this.selected_tag.splice(0, 1)
        }
        else {
          this.selected_tag.splice(0, 1)
          this.selected_tag.push(tag_id)
        }
      }
      this.$emit('input', this.selected_tag)
    }
  },
  async beforeMount() {
    this.loadData()
  }
}
</script>

<style lang="" scoped>
    
</style>