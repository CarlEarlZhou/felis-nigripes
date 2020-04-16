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
        <el-step title="调整文件标签"></el-step>
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
        <el-col :span="8">
          <mu-paper>
            <div>
              <span>规则列表：</span>
            </div>
            <mu-list>
              <mu-list-item
                button :ripple="false"
                v-for="(rule_set, index) of rule_set_list"
                :key="index"
                @click.native="current_rule = index"
              >
                <mu-list-item-title>{{rule_set.rule_set_name}}</mu-list-item-title>
                <mu-button icon @click="selectRule(index)">
                  <mu-icon v-if="!selected_rules.includes(index)" value="radio_button_unchecked">
                  </mu-icon>
                  <mu-icon v-if="selected_rules.includes(index)" value="check_circle">
                  </mu-icon>
                </mu-button>
              </mu-list-item>
            </mu-list>
          </mu-paper>
        </el-col>
        <el-col :span="16">
          <div v-for="(rule, index) in rule_set_list[current_rule].rule_list"
            :key="index"
          >
            <h2>
              {{rule.tag}}
            </h2>
            <div v-for="(rule_part, index) in rule.rule"
              :key="index"
            >
              <span v-if="rule_part.type=='end'">扩展名为</span>
              <span v-else>文件名中包含</span>
              <span>{{rule_part.value}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="current_step==2">
        <el-col :span="18">
          <mu-paper>
            <mu-list>
              <mu-list-item
                button :ripple="false"
                v-for="(file, index) of selected_files"
                :key="index"
                @click.native="current_file = selected_files[index]"
              >
                <mu-list-item-title>
                  <span v-if="isEqual(file, current_file)" style="color: #2196f3">
                    {{file.name}}
                  </span>
                  <span v-else>
                    {{file.name}}
                  </span>
                </mu-list-item-title>
                <div>
                  <mu-chip
                    v-for="tag in file.tags"
                    :key="tag.id"
                    color="green"
                  >
                    {{tag.name}}
                  </mu-chip>
                </div>
              </mu-list-item>
            </mu-list>
          </mu-paper>
        </el-col>
        <el-col :span="6">
          <file-tag v-model="current_file.tags"></file-tag>
        </el-col>
      </el-row>
      
      <el-button style="margin-top: 12px;" @click="prevStep">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="nextStep">下一步</el-button>
      
    </div>
    
</template>

<script>
import db from '@/db'
import fs from 'fs'
import FileTag from '@/components/FileTag'
import testFile from '@/rule'
import _ from 'lodash'

export default {
  name: 'AddFile',
  components: {
    FileTag
  },
  data() {
    return {
      current_step: 0,
      exist_file_paths: [],
      new_file_paths: [],
      selected_files: [],
      optional_files: [],
      rule_set_list: [],
      selected_rules: [],
      current_file: null,
      current_rule: 0
    }
  },
  methods: {
    isEqual(a, b) {
      return _.isEqual(a, b)
    },
    selectRule(rule_index) {
      let i = this.selected_rules.indexOf(rule_index)
      if (i == -1) {
        this.selected_rules.push(rule_index)
      } 
      else {
        this.selected_rules.splice(i, 1)
      }
    },
    // clearPathList() {
    //   this.exist_file_paths = []
    //   this.new_file_paths = []
    //   this.selected_files = []
    //   this.optional_files = []
    // },
    nextStep() {
      if (this.current_step >= 2) {
        this.saveFile()
        return
      }
      else if (this.current_step == 1) {
        this.generateFileTag()
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
    saveFile() {
      this.selected_files.forEach(file => {
        db.isFileExist(file.path).then(async (res) => {
          if (!res) {
            await db.storeFiles([file.path])
          }
          let db_file = await db.getFileByPath(file.path)
          db_file = db_file[0]
          console.log(db_file)
          for (let tag of file.tags) {
            db.addFileTag(db_file.id, tag.id)
          }
        })
      })
    },
    async generateFileTag() {
      for (let rule_index of this.selected_rules) {
        let rule_set = this.rule_set_list[rule_index]
        console.log(rule_set)
        for (let rule of rule_set.rule_list) {
          for (let i = 0; i < this.selected_files.length; i++) {
            console.log(rule)
            if (testFile(this.selected_files[i], rule)) {
              if (!this.selected_files[i].tags.includes(rule.tag)) {
                this.selected_files[i].tags.push(rule.tag)
              }
            }
          }
        }
      }
      for (let file of this.selected_files) {
        for (let i = 0; i < file.tags.length; i++) {
          let db_tag = await db.getTagByName(file.tags[i])
          db_tag = db_tag[0]
          if (!db_tag) {
            try {
              await db.addTag(file.tags[i], 1)
            } catch (error) {
            }
            db_tag = await db.getTagByName(file.tags[i])
            db_tag = db_tag[0]
          }
          file.tags.splice(i, 1, db_tag)
        }
      }
      this.current_file = this.selected_files[0]
      console.log(this.selected_files)
      console.log(this.current_file)
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
          exist: exist_flag,
          tags: []
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
  created() {
    fs.readFile('rules.json', (err, res) => {
      this.rule_set_list = JSON.parse(res).rule_set
      console.log(this.rule_set_list)
    })
  }
}
</script>

<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>