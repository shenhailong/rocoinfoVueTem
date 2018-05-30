import Vue from 'vue'
import Vuex from 'vuex'
import main from './main'
import cart from './cart'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    cart,
    main
  },
  strict: !debug
})
