import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'material-icons/iconfont/material-icons.css'

import App from './App'
import router from './router'
import store from './store'

import db from './db'

Vue.use(ElementUI)
Vue.use(MuseUI);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
