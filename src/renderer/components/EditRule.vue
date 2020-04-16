<template>
  <div>
    <el-row>
      <el-col :span="8">
        <mu-paper>
          <mu-list>
            <mu-list-item
              button :ripple="false"
              v-for="(rule_set, index) of rule_set_list"
              :key="index"
              @click.native="current_rule_index = index"
            >
              <mu-list-item-title>
                <span v-if="current_rule_index==index" style="color: #2196f3">
                  {{rule_set.rule_set_name}}
                </span>
                <span v-else>
                  {{rule_set.rule_set_name}}
                </span>
              </mu-list-item-title>
            </mu-list-item>
          </mu-list>
        </mu-paper>
        <mu-button v-if="!editing" color="primary" @click="addRuleSet">
          添加规则集
        </mu-button>
        <el-row v-else>
          <el-col :span="20">
            <mu-text-field full-width v-model="new_rule_set_name"></mu-text-field>
          </el-col>
          <el-col :span="4">
            <mu-button color="primary" @click="confirmNewRuleSetName">
              确定
            </mu-button>
          </el-col>
        </el-row>
        
      </el-col>
      <el-col :span="16">
        <mu-paper v-for="(rule, index) in current_rule.rule_list"
          :key="index"
          :z-depth="3"
          style="margin-bottom: 1em; padding: 1em;"
        >
          <div style="display: flex; justify-content: space-between">
            <div>
              <span>标签：</span>
              <mu-text-field
                v-model="rule.tag"
              ></mu-text-field>
            </div>
            <mu-button color="error" @click="removeRule(index)">删除规则</mu-button>
          </div>
          <span>规则：</span><br>
          <div
            v-for="(rule_part, rule_part_index) in rule.rule"
            :key="rule_part_index"
          >
            <mu-select v-model="rule_part.type">
              <mu-option v-for="(option, rule_part_index) in options" :key="rule_part_index" :label="option.name" :value="option.type"></mu-option>
            </mu-select>
            &nbsp;&nbsp;
            <mu-text-field
              v-model="rule_part.value"
            ></mu-text-field>
            <mu-button icon color="error" @click="removeRulePart(index, rule_part_index)">
              <mu-icon value="close"></mu-icon>
            </mu-button>
          </div>
          <mu-button color="primary" @click="addRulePart(index)">增加条目</mu-button>
        </mu-paper>
        
        <mu-divider></mu-divider>
        <br>
        <mu-button color="primary" @click="addRule">
          <mu-icon left value="add"></mu-icon>
          添加规则
        </mu-button>
        <br><br>
        <mu-divider></mu-divider>
        <br>
        <mu-button color="success" @click="saveRuleSet">保存更改</mu-button>
        <mu-button color="error" @click="removeRuleSet">
          删除规则集
        </mu-button>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import fs from 'fs'
import _ from 'lodash'

export default {
  name: 'EditRule',
  data() {
    return {
      rule_set_list: [],
      current_rule_index: 0,
      current_rule: null,
      new_rule_set_name: '',
      editing: false,
      options: [
        {
          type: 'end',
          name: '扩展名为'
        },
        {
          type: 'contains',
          name: '文件名中包含'
        }
      ]
    }
  },
  watch: {
    current_rule_index() {
      this.current_rule = _.cloneDeep(this.rule_set_list[this.current_rule_index])
    }
  },
  methods: {
    save() {
      let tem = {
        rule_set: this.rule_set_list
      }
      fs.writeFile('rules.json', JSON.stringify(tem), function(err) {
        if (err) {
          console.log(err)
        }
      })
    },
    addRuleSet() {
      this.new_rule_set_name = ''
      this.editing = true
    },
    confirmNewRuleSetName() {
      let new_rule_set = {
        rule_set_name: this.new_rule_set_name,
        rule_list: []
      }
      this.rule_set_list.push(new_rule_set)
      this.save()
      this.editing = false
    },
    addRule() {
      this.current_rule.rule_list.push({
        tag: '',
        rule: []
      })
    },
    removeRule(index) {
      this.current_rule.rule_list.splice(index, 1)
    },
    saveRuleSet() {
      this.rule_set_list.splice(this.current_rule_index, 1, this.current_rule)
      this.save()
    },
    removeRuleSet() {
      if (this.current_rule_index != 0) {
        this.rule_set_list.splice(this.current_rule_index, 1)
        this.save()
      }
    },
    removeRulePart(rule_index, rule_part_index) {
      this.current_rule.rule_list[rule_index].rule.splice(rule_part_index, 1)
    },
    addRulePart(rule_index) {
      this.current_rule.rule_list[rule_index].rule.push({
        type: 'end',
        value: ''
      })
    }
  },
  created() {
    fs.readFile('rules.json', (err, res) => {
      this.rule_set_list = JSON.parse(res).rule_set
      console.log(this.rule_set_list)
      this.current_rule = _.cloneDeep(this.rule_set_list[0])
    })
  }
}
</script>

<style lang="" scoped>
    
</style>