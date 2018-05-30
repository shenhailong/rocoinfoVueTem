import Vue from 'vue'
import Vuex from 'vuex'
import baseInfo from './modules/baseInfo'
import cart from './modules/cart'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    baseInfo,
    cart
  },
  strict: !debug
})
