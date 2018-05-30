import _SwiperDialog from './SwiperDialog'
import Vue from 'vue'
const SwiperDialog = Vue.component('SwiperDialog', _SwiperDialog)
function createSwiperDialog(config) {
  const props = {
    ...config
  }
  let component = new SwiperDialog({ propsData: props }).$mount()
  document.body.appendChild(component.$el)
}

export default createSwiperDialog
