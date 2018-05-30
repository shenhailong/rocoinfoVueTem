import Vue from 'vue'
import Vip from '@/pages/Vip'
import router from '@/router/vip'
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
    template: '<Vip/>',
    components: { Vip }
  })
})
