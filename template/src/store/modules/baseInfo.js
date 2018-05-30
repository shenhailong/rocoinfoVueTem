import * as BASE_INFO from '../types/baseInfo'
import axios from 'axios'
const state = {
  userInfo: null
}

const actions = {
  [BASE_INFO.BASE_INFO_GET]({ commit }) {
    axios.get('/api/wap/members/getCurrentUserInfo').then(res => {
      if (res.data.code === '1') {
        sessionStorage.oilmall_user = JSON.stringify(res.data.data)
        commit(BASE_INFO.BASE_INFO_SET, res.data.data)
      }
    })
  }
}

const mutations = {
  [BASE_INFO.BASE_INFO_SET](state, data) {
    state.userInfo = data
  }
}

export default {
  state,
  mutations,
  actions
}
