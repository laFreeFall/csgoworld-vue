// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store/store'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import VueAnimateNumber from 'vue-animate-number'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/font-awesome.min.css'
import './assets/css/styles.css'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(VueAnimateNumber)

axios.defaults.baseURL = 'http://csgoworld.loc'
const tokenData = JSON.parse(window.localStorage.getItem('user'))
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Authorization'] = tokenData ? 'Bearer ' + tokenData.auth.access_token : 'Bearer NO DATA'

router.beforeEach((to, from, next) => {
  const tokenData = JSON.parse(window.localStorage.getItem('user'))
  axios.defaults.headers.common['Authorization'] = tokenData ? 'Bearer ' + tokenData.auth.access_token : 'Bearer NO DATA'
  if (to.meta.requiresAuth) {
    document.title = to.meta.title || 'CSGOworld' // https://github.com/vuejs/vue-router/issues/914
    if (window.localStorage.getItem('user') !== null) {
      next()
    } else {
      next({ name: 'Auth', params: { action: 'login' } })
    }
  } else {
    next()
  }
})

Vue.filter('twoDecimals', (val) => { return `${val.toFixed(2)}` })
Vue.filter('money', (val) => { return `$${val.toFixed(2)}` })
Vue.filter('percent', (val) => { return `${(val * 100).toFixed(2)}%` })
Vue.filter('float', (val) => { return `${val.toFixed(2)}` })
Vue.filter('diamonds', (val) => { return `${val.toLocaleString()}` })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
