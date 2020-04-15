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
              @click.native="current_rule = index"
            >
              <mu-list-item-title>
                <span v-if="current_rule==index" style="color: #2196f3">
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
        
        <mu-divider></mu-divider>
        <mu-button color="error" @click="removeRuleSet">
          删除规则集
        </mu-button>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
import fs from 'fs'

export default {
  name: 'EditRule',
  data() {
    return {
      rule_set_list: [],
      current_rule: 0,
      new_rule_set_name: '',
      editing: false
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
    removeRuleSet() {
      if (this.current_rule != 0) {
        this.rule_set_list.splice(this.current_rule, 1)
        this.save()
      }
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

<style lang="" scoped>
    
</style>