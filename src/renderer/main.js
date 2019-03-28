import Vue from 'vue'
import VueResize from 'vue-resize'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import 'vue-resize/dist/vue-resize.css'
Vue.use(VueResize)

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
