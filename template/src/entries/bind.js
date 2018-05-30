import Vue from 'vue'
import Bind from '@/pages/Bind'
import router from '@/router'
// import store from '../configs/store'
require('../configs/vue')
require('../configs/store')
require('../configs/axios')

document.addEventListener('DOMContentLoaded', function(e){
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<Bind/>',
    components: { Bind }
  })
})
