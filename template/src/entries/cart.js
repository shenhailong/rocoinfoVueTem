import Vue from 'vue'
import Cart from '@/pages/Cart'
import router from '@/router/cart'
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
    router,
    store,
    template: '<Cart/>',
    components: { Cart }
  })
})
