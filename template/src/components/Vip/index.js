import _VipModal from './VipModal'
import Vue from 'vue'
const VipModal = Vue.component('VipModal', _VipModal)
function createVipModal(config) {
  const props = {
    ...config
  }
  let component = new VipModal({ propsData: props }).$mount()
  document.body.appendChild(component.$el)
}

export default createVipModal
