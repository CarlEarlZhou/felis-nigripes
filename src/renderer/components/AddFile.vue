<template>
    <div>
      <div>
        <el-button icon="el-icon-circle-plus" type="primary" @click="selectFile" plain>
          选择文件
        </el-button>
        
      </div>
      <el-steps :active="current_step" finish-status="success" align-center>
        <el-step title="选择将要添加的文件"></el-step>
        <el-step title="应用标签规则"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
      <el-row v-if="current_step==0">
        <el-col :span="8">
          不添加的文件<br>
          <el-table
            :data="optional_files"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column
              prop="name"
              label="文件名">
            </el-table-column>
            <el-table-column
              prop="path"
              label="文件路径">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          将要添加文件
          <el-table
            :data="selected_files"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column
              prop="name"
              label="文件名">
            </el-table-column>
            <el-table-column
              prop="path"
              label="文件路径">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="current_step==1">
        <el-col :span="9">规则列表</el-col>
        <el-col :span="15">规则详情</el-col>
      </el-row>
      <el-button style="margin-top: 12px;" @click="prevStep">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="nextStep">下一步</el-button>
      
    </div>
    
</template>

<script>
import db from '@/db'

export default {
  name: 'AddFile',
  data() {
    return {
      current_step: 0,
      exist_file_paths: [],
      new_file_paths: [],
      selected_files: [],
      optional_files: [],
    }
  },
  methods: {
    // clearPathList() {
    //   this.exist_file_paths = []
    //   this.new_file_paths = []
    //   this.selected_files = []
    //   this.optional_files = []
    // },
    nextStep() {
      if (this.current_step >= 2) {
        return
      }
      this.current_step += 1
    },
    prevStep() {
      if (this.current_step <= 0) {
        return
      }
      this.current_step -= 1
    },
    tableRowClassName({row, rowIndex}) {
      if (row.exist) {
        return 'success-row'
      }
      return ''
    },
    selectFile() {
      // this.optional_files = [1, 2, 3]
      this.exist_file_paths = []
      this.new_file_paths = []
      const {dialog} = require('electron').remote
      let file_paths = dialog.showOpenDialogSync({
        properties: ['openFile', 'multiSelections', 'showHiddenFiles']
      })
      if (file_paths == undefined)
        return
      Promise.all(this.separateFile(file_paths)).then(() => {
        // console.log(this.exist_file_paths)
        // console.log(this.new_file_paths)
        this.formatFile(this.exist_file_paths, true).forEach((obj) => {
          // console.log(obj)
          this.optional_files.push(obj)
          console.log(this.optional_files)
        })
        this.formatFile(this.new_file_paths, false).forEach((obj) => {
          this.selected_files.push(obj)
        })
        // if (this.new_file_paths.length !== 0) {
        //   db.storeFiles(this.new_file_paths)
        // }
      })
    },
    formatFile(file_paths, exist_flag) {
      let res = []
      file_paths.forEach(file_path => {
        let tem = file_path.split('/')
        tem = tem[tem.length - 1].split('\\')
        let file_name = tem[tem.length - 1]
        res.push({
          name: file_name,
          path: file_path,
          exist: exist_flag
        })
      })
      return res
    },
    /**
     * 将用户新添加的文件分为已存在和不存在两组
     */
    separateFile(file_paths) {
      let promise_pool = []
      for (let file_path of file_paths) {
        promise_pool.push(new Promise(async (resolve, reject) => {
          if (await db.isFileExist(file_path)) {
            this.exist_file_paths.push(file_path)
          }
          else {
            this.new_file_paths.push(file_path)
          }
          resolve()
        }))
      }
      return promise_pool
    }
  },
  beforeMount() {
      
  }
}
</script>

<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>