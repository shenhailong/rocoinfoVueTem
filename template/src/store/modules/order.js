import * as ORDER_TYPE from '../types/order'
import { NONE } from '@/constants/invoiceType'
const state = {
  allSkuVisible: false,
  // 选中优惠券对象 -1表示活动
  coupon: { id: -1 },
  // 选中无门槛优惠券对象
  // 无门槛优惠券对象默认 -1 选择最大优惠
  noThresholdCoupon: { id: -1 },
  hasAddress: false,
  address: null,
  invoice: null,
  invoiceType: NONE,
  customInfo: {}, // 报关材料
  idCard: null,
  // 活动优惠列表
  couponDtos: null,
  // 无门槛优惠列表
  noThresholdCouponDtos: null
}

const actions = {

}

const mutations = {
  [ORDER_TYPE.ORDER_SET_ADDRESS](state, data) {
    state.address = data
  },
  [ORDER_TYPE.ORDER_REMOVE_ADDRESS](state) {
    state.address = null
  },
  [ORDER_TYPE.ORDER_SET_INVOICE](state, data) {
    state.invoice = data
  },
  [ORDER_TYPE.ORDER_SET_COUPON](state, data) {
    state.coupon = data
  },
  [ORDER_TYPE.ORDER_SET_NO_THRESHOLD_COUPON](state, data) {
    state.noThresholdCoupon = data
  },
  [ORDER_TYPE.ORDER_SET_INVOICE_TYPE](state, data) {
    state.invoiceType = data
  },
  [ORDER_TYPE.ORDER_SET_ID_CARD](state, data) {
    state.idCard = data
  },
  [ORDER_TYPE.ORDER_SET_COUPONDTOS](state, data) {
    state.couponDtos = data
  },
  [ORDER_TYPE.ORDER_SET_ALL_SKU_VISIBLE](state, data) {
    state.allSkuVisible = data
  },
  [ORDER_TYPE.ORDER_SET_NOTHRESHOLDCOUPONDTOS](state, data) {
    state.noThresholdCouponDtos = data
  },
  [ORDER_TYPE.ORDER_SET_CUSTOM_INFO](state, data) {
    state.customInfo = data
  },
  [ORDER_TYPE.ORDER_SET_HAS_ADDRESS](state, data) {
    state.hasAddress = data
  },
  [ORDER_TYPE.ORDER_SET_COUPON_VISIBLE](state, { coupon, index, key }) {
    state[key][index]._textVisible = !coupon._textVisible
  },
  [ORDER_TYPE.ORDER_SET_COUPON_SELECT](state, { coupon, index, key }) {
    // 勾选掉
    if (coupon.checked) {
      state[key][index].checked = false
      state[key.replace('Dtos', '')] = null
    } else {
      // 勾选上
      state[key].forEach(_coupon => {
        _coupon.checked = false
      })
      state[key][index].checked = true
      state[key.replace('Dtos', '')] = state[key][index]
    }
  }
}

export default {
  state,
  mutations,
  actions
}
