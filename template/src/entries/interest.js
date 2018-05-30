import Vue from 'vue'
import Interest from '@/pages/Interest'
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
    template: '<Interest/>',
    components: { Interest }
  })
})
