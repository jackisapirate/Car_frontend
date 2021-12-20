import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import axios from './axios'
import axiosSourse from './axiosSourse'
import globle from './globalFun'
import locale from 'element-ui/lib/locale/lang/en'


Vue.config.productionTip = false
Vue.use(Element, { locale })
Vue.prototype.$axios = axios
Vue.prototype.$axiosSourse = axiosSourse

// require("./mock.js")

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
