import path from 'path'
import db from '@/db'

class FileNode {
  constructor(name, tag_list, type='folder', father_node=null, id=0) {
    this.id = id
    this.name = name
    this.father_node = father_node
    if (this.father_node != null) {
      this.full_path = this.father_node.full_path + this.name
      if (type == 'folder') {
        this.full_path += path.sep
      }
    }
    else {
      this.full_path = ''
    }
    this.type = type
    this.tags = new Map()
    this.updateTag(tag_list)
    this.childNodes = new Map()
  }

  updateTag(tag_list) {
    let cur = this
    while (cur != null) {
      for (let tag of tag_list) {
        if (cur.tags.has(tag)) {
          cur.tags.set(tag, cur.tags.get(tag)+1)
        }
        else {
          cur.tags.set(tag, 1)
        }
      }
      cur = cur.father_node
    }
  }

  addChildNode(name, tag_list, type='folder', id=0) {
    if (!this.childNodes.has(name)) {
      this.childNodes.set(name, new FileNode(name, tag_list, type, this, id))
    }
  }

  removeTag(tag) {
    db.removeFileTag(this.id, tag.id)
    let cur = this
    while (cur != null) {
      let num = cur.tags.get(tag)
      if (num <= 1) {
        cur.tags.delete(tag)
      } 
      else {
        cur.tags.set(tag, num-1)
      }
      cur = cur.father_node
    }
  }

  addTag(tag) {
    db.addFileTag(this.id, tag.id)
    this.updateTag([tag])
  }
}

function findNodeByPath(root_node, file_path) {
  let index = 0
  let cur_node = root_node
  while (index < file_path.length && cur_node.childNodes.has(file_path[index])) {
    cur_node = cur_node.childNodes.get(file_path[index])
    index += 1
  }
  if (index !== file_path.length) {
    return undefined
  }
  else {
    return cur_node
  }
}

const state = {
  main: 0,
  file_node: null,
  cur_node: null,
  child_folder: '' // 用户点击文件夹时改变这个值
}

const getters = {
}

const mutations = {
  init(state) {
    state.file_node = new FileNode('', [])
  },
  addFile(state, file) {
    console.log(file)
    let path_list = file.path.split(path.sep)
    let cur_node = state.file_node
    for (let index = 0; index < path_list.length-1; index++) {
      const element = path_list[index]
      cur_node.addChildNode(element, [])
      cur_node = cur_node.childNodes.get(element)
    }
    cur_node.addChildNode(path_list[path_list.length-1], file.tags, 'file', file.id)
    console.log(state.file_node)
  },
  getFileByPath(state, file_path) {
    if (file_path.length == 0) {
      state.cur_node = state.file_node
      return
    }
    let path_list = file_path.split(path.sep)
    state.cur_node = findNodeByPath(state.file_node, path_list)
  },
  enterFolder(state, folder_name) {
    state.child_folder = folder_name
  }
}

const actions = {
  init({commit}) {
    commit('init')
  },
  addFile({commit}, file) {
    console.log(file)
    commit('addFile', file)
  },
  getFileByPath({commit}, file_path) {
    commit('getFileByPath', file_path)
  },
  enterFolder({commit}, folder_name) {
    commit('enterFolder', folder_name)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
