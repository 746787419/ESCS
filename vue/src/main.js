import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import MintUI from 'mint-ui'
import JSEncrypt from "jsencrypt" 
import jsMd5 from 'js-md5'
import 'mint-ui/lib/style.css'
import './assets/clear.css'
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false
Vue.prototype.axios = axios

Vue.use(MintUI)
Vue.use(VueCookies)

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})
Vue.prototype.$serverUrl = 'http://localhost:8086'
Vue.prototype.$jsEncrypt = JSEncrypt; 
Vue.prototype.$md5 = jsMd5;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
