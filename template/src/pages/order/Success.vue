<template>
  <div class="wrap wrap-pay-status">
    <div class="bar bar-nav _border bar-absolute-top">
      <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{paymentWord}}</div>
    </div>

    <div class="content">
      <div class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <svg class="svg-pay-success">
              <use xlink:href="#svg-pay-success" />
            </svg>
            <span class="text">{{paymentWord}}</span>
          </div>
        </div>
      </div>
      <div class="space-20"></div>
      <template v-if="isCentExchange">
        <div class="content-block-title _border">
          <div class="title">
            积分支付
          </div>
          <a href="javascript:;" class="item-right">
            <span class="text text-primary">{{$route.query.totalCent}}</span>
          </a>
        </div>
        <div class="content-block-title _border">
          <div class="title">
            账户剩余积分
          </div>
          <a href="javascript:;" class="item-right">
            <span class="text">{{$route.query.centBalance}}</span>
          </a>
        </div>
      </template>
      <template v-else>
        <div class="content-block-title _border">
          <div class="title">
            支付方式
          </div>
          <a href="javascript:;" class="item-right">
            <span class="text">{{paymentTypeWord}}</span>
          </a>
        </div>
        <div class="content-block-title _border">
          <div class="title">
            支付金额
          </div>
          <a href="javascript:;" class="item-right">
            <span class="text text-primary">{{$route.query.payMoney}}元</span>
          </a>
        </div>
      </template>
      <div class="space-20"></div>
      <template v-if="noMore">
        <div class="button-line _flex-align-center">
          <button @click="continueHandler" type="button" class="btn-normal btn-primary _solid btn-xl">{{continueWord}}</button>
          <button @click="checkHandler" type="button" class="btn-normal btn-primary btn-xl">查看订单</button>
        </div>
      </template>
      <template v-else>
        <template v-if="loaded">
          <div class="content-block-title _border " style="justify-content:center;">
            您还有以下商品待结算
          </div>
          <div class="list-order">
            <div v-for="item in list" :key="item.itemId" class="list-order-item">
              <div class="item-goods item-horizontal">
                <div class="item-media">
                  <img v-lazy="{
                src: item.imgPath ? item.imgPath : 'static/images/lazyload/img348x348.jpg',
                loading: 'static/images/lazyload/img348x348.jpg',
                error: 'static/images/lazyload/img348x348.jpg'
              }" alt="商品图片" class="lazy-img-fadein">
                </div>
                <div class="item-inner">
                  <div class="item-flex-between">
                    <div class="item-title _ellipsis">{{item.skuName}}</div>
                  </div>
                  <div class="item-subtitle-sku">
                    <span class="name">规格：</span>{{ item.attribute }}
                  </div>
                  <div class="item-flex-between item-bottom">
                    <span class="item-price">
                      <span>
                        <em>¥</em>{{ item.salePrice }}</span>
                    </span>
                    <div class="item-count">x{{ item.quantity }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="position: fixed;bottom:0;left:0;right: 0;" class="button-block">
            <button @click="orderHandler" type="button" class="btn-normal btn-primary _solid btn-xxl">继续结算</button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
import * as PLACE_ORDER_TYPE from '@/constants/placeOrderType'
import routerMixin from '@/mixin/router'
export default {
  mixins: [routerMixin],
  data() {
    return {
      noMore: true,
      loaded: false,
      list: [],
      centBalance: 0
    }
  },
  created() {
    if (this.loadMore) {
      this.noMore = this.isCentExchange
      if (this.isCartOrderType) {
        this.fetchList()
      }
    }
  },
  methods: {
    continueHandler() {
      window.location = this.continueUrl
    },
    checkHandler() {
      // 去用户中心订单详情
      window.location = `user.html#/order/detail/${this.$route.query.orderId}`
    },
    fetchList() {
      axios
        .get('/api/wap/cart/continuePayCheckedSku')
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.list = res.data.data
            this.noMore = !(this.list && this.list.length > 0)
          }
        })
        .finally(() => {
          this.loaded = true
        })
    },
    orderHandler() {
      let timestamp = new Date().getTime()
      window.location = `order.html?_=${timestamp}#/?placeOrderType=${
        PLACE_ORDER_TYPE.CART.value
      }`
    }
  },
  computed: {
    isCentExchange() {
      // 订单支付成功
      if (this.$route.name === 'OrderSuccess') {
        return (
          this.$route.query.placeOrderType ===
          PLACE_ORDER_TYPE.CENT_EXCHANGE.value
        )
        // 订单详情
      } else if (this.$route.name === 'MineOrderDetail') {
        return false
      }
    },
    paymentWord() {
      if (this.isCentExchange) {
        return '兑换成功'
      } else {
        return '支付成功'
      }
    },
    paymentTypeWord() {
      switch (this.$route.query.paymentType) {
        case 'unionpay':
          return '银联'
        case 'wechat':
        default:
          return '微信支付'
      }
    },
    loadMore() {
      return this.$route.name === 'OrderSuccess' && this.isCartOrderType
    },
    isCartOrderType() {
      return this.$route.query.placeOrderType === PLACE_ORDER_TYPE.CART.value
    },
    continueWord() {
      return this.isCentExchange ? '继续兑换' : '继续购物'
    },
    continueUrl() {
      return this.isCentExchange ? 'vip.html' : 'index.html'
    }
  }
}
</script>
<style lang="scss" scoped>
.list-order {
  padding-bottom: px2rem(90px);
}
</style>
