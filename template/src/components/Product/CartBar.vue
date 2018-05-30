<template>
  <div class="bar bar-tool bar-absolute-bottom">
    <div class="ball-container" style="position: absolute;">
      <transition-group v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div v-for="ball in balls" v-if="ball.show" v-bind:key="ball.show" class="ball">
          <div class="inner inner-hook">
            <img :src="productImg" alt="">
          </div>
        </div>
      </transition-group>
    </div>

    <a v-if="!isSkuPoint" @click="cartHandler" :class="{'scale':numChange}" class="bar-item bar-cart">
      <span class="tab-icon">
        <svg class="svg-cart">
          <use xlink:href="#svg-cart" />
        </svg>
        <span class="tab-text">购物车</span>
        <span class="badge" v-if="stateQuantity > 0">{{cartNum}}</span>
      </span>
    </a>
    <!-- 选中状态在svg-heart后加class[_active] -->
    <a v-if="!isSkuPoint" @click="doFavorite" href="javascript:;" class="bar-item bar-collect">
      <span class="tab-icon">
        <svg class="svg-heart" :class="{'_active': product.isCollection}">
          <use xlink:href="#svg-heart" />
        </svg>
        <span class="tab-text">收藏</span>
      </span>
    </a>
    <!-- 购物车订单 -->
    <template v-if="isOrderTypeCart">
      <div :class="{'_cloumn2': !isOrderTypeCartStockOut}" class="bar-item bar-item-button">
        <a v-if="!isOrderTypeCartStockOut" @click="doAdd" class="btn-normal _solid btn-orange" href="javascript:;">加入购物车</a>
        <a v-if="!isOrderTypeCartStockOut" @click="doPayment" class="btn-normal _solid btn-primary" href="javascript:;">立即购买</a>
        <a v-if="isOrderTypeCartStockOut" class="btn-normal btn-disabled" href="javascript:;">该商品已售罄</a>
      </div>
    </template>

    <template v-else>
      <div :class="{'single-button': isSkuPoint}" class="bar-item bar-item-button">
        <!-- 积分也要判断库存不足 -->
        <button :disabled="isOrderTypeCartStockOut" :class="{'btn-disabled': isOrderTypeCartStockOut, 'btn-primary': !isOrderTypeCartStockOut}" @click="doPayment" class="btn-normal _solid">{{orderTypeETCWord}}</button>
      </div>
    </template>
  </div>
</template>
<script>
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
import { Toast } from 'rocoui'
import * as CART_TYPE from '@/store/types/cart'
import { mapState } from 'vuex'
// import * as ACTIVITY_TYPE from '@/constants/activityType'
import * as PLACE_ORDER_TYPE from '@/constants/placeOrderType'
export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    productImg: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true
    },
    placeOrderType: {
      type: String,
      required: true
    },
    skuId: {
      type: [String, Number],
      required: true
    },
    activityId: {
      type: [String, Number],
      default: ''
    },
    recordId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      PLACE_ORDER_TYPE,
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],
      numChange: false,
      numChangeTimer: null
    }
  },
  methods: {
    beforeEnter(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    enter(el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.display = ''
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0, 0, 0)'
        inner.style.transform = 'translate3d(0, 0, 0)'
      })
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
      for (let i = 0; i < this.balls.length; i++) {
        this.balls[i].show = false
      }
    },
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    doAdd(e) {
      let promise = axios
        .get(`/api/wap/cart/add/${this.product.skuId}`, {
          quantity: this.quantity
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.$store.commit(CART_TYPE.CART_SET_QUANTITY, res.data.data)
            this.drop(e.target)
          }
        })
      Toast.loading('正在加入购物车', promise)
    },
    doFavorite() {
      this.$emit('favorite')
    },
    cartHandler() {
      window.location = 'cart.html'
    },
    doPayment() {
      let location = `order.html#/?placeOrderType=${
        this.placeOrderType
      }&skuId=${this.skuId}&activityId=${this.activityId}&quantity=${
        this.quantity
      }&recordId=${this.recordId}`

      axios.get(`/api/wap/members/getCurrentMemberInfo`).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          const userInfo = res.data.data
          if (userInfo.mobile) {
            window.location = location
          } else {
            this.$router.push({
              name: 'BindPhone',
              query: {
                redirect: location
              }
            })
          }
        }
      })
    }
  },
  beforeCreate() {
    this.$store.dispatch('cartGetQuantity')
  },
  computed: {
    ...mapState({
      stateQuantity: (state) => state.cart.quantity,
      userInfo: (state) => state.baseInfo.userInfo
    }),
    cartNum() {
      return this.stateQuantity > 99 ? '99+' : this.stateQuantity
    },
    isOrderTypeCart() {
      switch (this.placeOrderType) {
        case PLACE_ORDER_TYPE.CART.value:
          return true
        case PLACE_ORDER_TYPE.QUANTITY_LIMITED.value:
        case PLACE_ORDER_TYPE.TIME_LIMITED.value:
          if (this.product.activity.qualification) {
            return false
          } else {
            return true
          }
        default:
          return false
      }
    },
    // 购物车订单是否参加活动
    isOrderTypeCartActivity() {
      // 有活动且有活动资格
      return this.product.activity && this.product.activity.qualification
    },
    // 购物车订单库存不足
    isOrderTypeCartStockOut() {
      // 有活动时没有不足
      if (this.isOrderTypeCartActivity) {
        return false
      } else {
        return this.product.checkedSku.stock <= 0
      }
    },
    orderTypeETCWord() {
      if (this.isOrderTypeCartStockOut) {
        return '该商品已售罄'
      } else {
        return this.placeOrderType === PLACE_ORDER_TYPE.CENT_EXCHANGE.value
          ? '立即兑换'
          : '去结算'
      }
    },
    isSkuPoint() {
      return this.placeOrderType === PLACE_ORDER_TYPE.CENT_EXCHANGE.value
    }
  },
  watch: {
    stateQuantity() {
      clearTimeout(this.numChangeTimer)
      this.numChange = true
      this.numChangeTimer = setTimeout(() => {
        this.numChange = false
      }, 500)
    }
  }
}
</script>
