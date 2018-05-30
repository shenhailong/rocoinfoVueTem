import Vue from 'vue'
import Order from '@/pages/Order'
import router from '@/router/order'
import store from '@/store/order'
import VueLazyload from 'vue-lazyload'
require('../configs/vue')
require('../configs/store')
require('../configs/axios')
Vue.use(VueLazyload)

document.addEventListener('DOMContentLoaded', function(e){
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<Order/>',
    components: { Order }
  })
})
