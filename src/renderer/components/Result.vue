<template>
<div>
  
  <el-row>
    <el-col :span="content_width"
      v-for="f in result"
      :key="f.full_path"
      @click.native="showDetail(f)"
    >
      <el-row style="display: flex; align-items: center; min-height: 40px;">
        <el-col :span="1" style="display: flex; justify-content: center;">
          <mu-icon v-if="f.type=='folder'" value="folder"></mu-icon>
          <mu-icon v-if="f.type!='folder'" value="description"></mu-icon>
        </el-col>
        <el-col :span="9">{{f.name}}</el-col>
        <el-col :span="14">
          <mu-chip
            v-for="tag in f.tags"
            :key="tag.id"
            color="green"
          >
            {{tag.name}}
          </mu-chip>
        </el-col>
        
        
      </el-row>
      <mu-divider></mu-divider>
    </el-col>
  </el-row>

  <mu-drawer :open.sync="openDetail" :docked="false" :right="true">
    <mu-list>
      <mu-list-item button>
        <mu-list-item-title>Menu Item 1</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button>
        <mu-list-item-title>Menu Item 2</mu-list-item-title>
      </mu-list-item>
      <mu-list-item  @click="openDetail = false" button>
        <mu-list-item-title>Close</mu-list-item-title>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      content_width: 24,
      folder_type: false,
      result: [],
      openDetail: false
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
    }
  },
  methods: {
    showDetail(f) {
      console.log(23333333333)
      this.openDetail = true
    }
  },
  created() {
    // console.log(this.$store)
  }
}
</script>

<style scoped>
    
</style>