import Vue from 'vue'
import VueScrollTo from 'vue-scrollto'
import Index from '@/pages/Main'
import router from '@/router/main'
import store from '@/store/main'
import VueLazyload from 'vue-lazyload'
require('../configs/vue')
require('../configs/store')
require('../configs/axios')

Vue.use(VueScrollTo)
Vue.use(VueLazyload)

document.addEventListener('DOMContentLoaded', function(e){
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    template: '<Index/>',
    components: { Index }
  })
})
