import * as CART_TYPE from '../types/cart'
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
const state = {
  quantity: 0
}

const actions = {
  cartGetQuantity({ commit }) {
    axios.get('/api/wap/cart/viewQuantity').then(res => {
      if (res.data.code === CODE_SUCCESS) {
        commit(CART_TYPE.CART_SET_QUANTITY, res.data.data)
      }
    })
  }
}

const mutations = {
  [CART_TYPE.CART_SET_QUANTITY](state, data) {
    state.quantity = data
  }
}

export default {
  state,
  mutations,
  actions
}
