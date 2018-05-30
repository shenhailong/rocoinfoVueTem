import _QRcodeModal from './QRcodeModal'
import Vue from 'vue'
const QRcodeModal = Vue.component('QRcodeModal', _QRcodeModal)
function createQRcodeModal(config) {
  const props = {
    ...config
  }
  let component = new QRcodeModal({ propsData: props }).$mount()
  document.body.appendChild(component.$el)
}

export default createQRcodeModal
