import Vue from 'vue'
import User from '@/pages/User'
import router from '@/router/user'
import VueLazyload from 'vue-lazyload'
import store from '@/store/cart'
require('../configs/vue')
require('../configs/store')
require('../configs/axios')
Vue.use(VueLazyload)

document.addEventListener('DOMContentLoaded', function(e){
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    router,
    template: '<User/>',
    components: { User }
  })
})
