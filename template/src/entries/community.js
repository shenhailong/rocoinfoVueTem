import Vue from 'vue'
import Community from '@/pages/Community'
import router from '@/router/community'
import store from '@/store/cart'
import VueLazyload from 'vue-lazyload'
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
    template: '<Community/>',
    components: { Community }
  })
})
