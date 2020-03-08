<template>
  <div>
    <el-row style="display: flex; align-items: center;">
      <el-col :span="4" style="text-align: right;">
        <span>添加标签：&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </el-col>
      <el-col :span="5">
        <el-input v-model="new_tag_name" label="test"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="addTag">添加标签</el-button>
      </el-col>
      
    </el-row>
    
  </div>
</template>

<script>
export default {
  name: 'EditTag',
  data() {
    return {
      new_tag_name: ''
    }
  }
}
</script>

<style lang="" scoped>
    
</style>