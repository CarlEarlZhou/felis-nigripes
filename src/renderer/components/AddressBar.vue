<template>
<div class="main">
  <mu-checkbox v-model="search_type" label="显示文件夹结构">
  </mu-checkbox>
  <mu-button icon @click="backward">
    <mu-icon value="arrow_back"></mu-icon>
  </mu-button>
  <mu-button icon @click="forward">
    <mu-icon value="arrow_forward"></mu-icon>
  </mu-button>
  <mu-button icon @click="upward">
    <mu-icon value="arrow_upward"></mu-icon>
  </mu-button>
  <el-input v-model="file_url" @keyup.enter.native="submit"></el-input>
</div>
</template>

<script>
import path from 'path'

export default {
  name: '',
  data() {
    return {
      file_url: '',
      url_list: [],
      index: -1,
      search_type: false
    }
  },
  watch: {
    '$store.state.Counter.child_folder': function() {
      
      this.cutList()
      
      if (this.url_list[this.index].length == 0) {
        this.file_url = this.$store.state.Counter.child_folder
      }
      else {
        this.file_url = this.url_list[this.index]+path.sep+this.$store.state.Counter.child_folder
      }
      this.pushList(this.file_url)
      this.getFile()
    },
    search_type() {
      this.$emit('change-type', this.search_type)
    }
  },
  methods: {
    getFile() {
      console.log(this.url_list)
      console.log(this.index)
      this.$store.dispatch('getFileByPath', this.url_list[this.index])
    },
    cutList() {
      this.url_list.splice(this.index+1, this.url_list.length-this.index-1)
    },
    pushList(url) {
      this.url_list.push(url)
      this.index += 1
    },
    backward() {
      if (this.index > 0) {
        this.index -= 1
      }
      else {
        return
      }
      this.file_url = this.url_list[this.index]
      this.getFile()
    },
    forward() {
      if (this.index < this.url_list.length - 1) {
        this.index += 1
      }
      else {
        return
      }
      this.file_url = this.url_list[this.index]
      this.getFile()
    },
    upward() {
      let tem_list = this.file_url.split(path.sep)
      if (tem_list.length <= 1) {
        this.file_url = ''
      }
      else {
        tem_list = tem_list.slice(0, tem_list.length - 1)
        this.file_url = tem_list.join(path.sep)
      }
      this.cutList()
      this.pushList(this.file_url)
      this.getFile()
    },
    submit() {
      this.cutList()
      this.pushList(this.file_url)
      this.getFile()
    }
  },
  mounted() {
    setTimeout(() => {
      this.pushList(this.file_url)
      this.getFile()
    }, 1000)
  }
}
</script>

<style scoped>
.main {
  display: flex;
  align-items: center;
}
</style>