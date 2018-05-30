import _GoldModal from './GoldModal'
import Vue from 'vue'
const GoldModal = Vue.component('GoldModal', _GoldModal)
function createGoldModal(config) {
  const props = {
    ...config
  }
  let component = new GoldModal({ propsData: props }).$mount()
  document.body.appendChild(component.$el)
}

export default createGoldModal
