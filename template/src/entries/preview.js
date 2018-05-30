import Vue from 'vue'
import Preview from '@/pages/Preview'
require('../configs/vue')
require('../configs/store')
require('../configs/axios')

document.addEventListener('DOMContentLoaded', function(e){
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    template: '<Preview/>',
    components: { Preview }
  })
})
