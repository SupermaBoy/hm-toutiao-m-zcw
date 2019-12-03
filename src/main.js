import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

import '@/style/globle.css'
import myPlugin from '@/utils/plugin.js'
Vue.use(myPlugin)
Vue.use(Vant)

// options 为可选参数，无则不传
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
