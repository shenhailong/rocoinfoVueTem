<template>
  <div class="wrap wrap-pay-status">
    <div class="bar bar-nav _border bar-absolute-top">
      <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">支付失败</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <div class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <svg class="svg-pay-fail">
              <use xlink:href="#svg-pay-fail" />
            </svg>
            <span class="text">支付失败</span>
          </div>
          <p>请在
            <em>{{timeWord}}</em>内完成付款</p>
        </div>
      </div>
      <div class="space-20"></div>
      <template v-if="isCentExchange">
        <div class="content-block-title _border">
          <div class="title">
            支付方式
          </div>
          <a href="javascript:;" class="item-right">
            <span class="text">积分兑换</span>
          </a>
        </div>
        <div class="content-block-title _border">
          <div class="title">
            支付积分
          </div>
          <a href="javascript:;" class="item-right">
            <span class="text text-primary">{{$route.query.payMoney}}分</span>
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
      <div class="button-line _flex-align-center">
        <button @click="repayHandler" :disabled="submitting && paymentable" type="button" class="btn-normal btn-primary _solid btn-xl">重新支付</button>
        <button @click="checkHandler" type="button" class="btn-normal btn-primary btn-xl">查看订单</button>
      </div>
    </div>
  </div>
</template>
<script>
import * as PLACE_ORDER_TYPE from '@/constants/placeOrderType'
import routerMixin from '@/mixin/router'
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
import moment from 'moment'
export default {
  mixins: [routerMixin],
  data(){
    return {
      submitting: false,
      now: +moment(),
      elapsed: null,
      orderTime: null,
      timer: null
    }
  },
  mounted(){
    this.orderTime = +moment(this.$route.query.orderTime)
    this.elapsed = (this.orderTime + (30 * 60 * 1000)) - this.now
    this.countDown()
  },
  methods: {
    countDown(){
      this.now = new Date().getTime()
      this.timer = setTimeout(() => {
        // 还在订单的三十分钟之内
        this.elapsed = (this.orderTime + (30 * 60 * 1000)) - this.now
        if(this.elapsed > 0){
          this.countDown()
        }
      }, 1000)
    },
    repayHandler() {
      switch(this.$route.query.paymentType){
        case 'wechat':
          this.doWechatSubmit()
          break
        case 'unionpay':
          this.doUnionPay()
          break
        default:
          break
      }
    },
    doWechatSubmit() {
      this.submitting = true
      axios
        .post('/api/wechat/pay/order', {
          orderId: this.$route.query.orderId,
          cash: this.$route.query.payMoney
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.wechatPay(res.data.data)
          }
        })
        .finally(() => {
          this.submitting = false
        })
    },
    wechatPay(result) {
      let self = this
      const WeixinJSBridge = window.WeixinJSBridge

      function removeWechatEvent() {
        if (typeof WeixinJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.removeEventListener(
              'WeixinJSBridgeReady',
              onBridgeReady,
              false
            )
          } else if (document.detachEvent) {
            document.detachEvent('WeixinJSBridgeReady', onBridgeReady)
            document.detachEvent('onWeixinJSBridgeReady', onBridgeReady)
          }
        }
      }

      function onBridgeReady() {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          {
            appId: result.appid, // 公众号名称，由商户传入
            timeStamp: result.timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr: result.nonceStr, // 随机串
            package: result.package,
            signType: result.signType, // 微信签名方式：
            paySign: result.paySign // 微信签名
          },
          function(res) {
            try{
              removeWechatEvent()
            }catch(e){ console.log(e) }
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              // 根据后台设计需要用子订单id查看详情 切记切记
              self.$router.replace({
                name: 'OrderSuccess',
                query: {
                  ...self.$route.query,
                  paymentType: 'wechat'
                }
              })
            }
          }
        )
      }
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
    },
    doUnionPay() {
      this.submitting = true
      axios.post('/api/union/pay/page', {
        orderId: this.$route.query.orderId,
        cash: this.$route.query.payMoney
      }).then(res => {
        if (res.data.code === CODE_SUCCESS) {
          document.body.innerHTML = res.data.data
          document.forms[0].submit()
        }
      })
    },
    checkHandler() {
      window.location = `user.html#/order/detail/${this.$route.query.orderId}`
    }
  },
  computed: {
    paymentable(){
      return this.elapsed > 0
    },
    timeWord(){
      if(this.elapsed > 0){
        let diff = this.elapsed
        let m = Math.floor((diff / 1000 / 60) % 60)
        let s = Math.floor((diff / 1000) % 60)
        return `00:${m >= 10 ? m : '0' + m}:${s >= 10 ? s : '0' + s}`
      }else {
        return '00:00:00'
      }
    },
    isCentExchange() {
      if(this.$route.name === 'OrderSuccess') {
        return (
          this.$route.query.placeOrderType ===
          PLACE_ORDER_TYPE.CENT_EXCHANGE.value
        )
      } else if(this.$route.name === 'MineOrderDetail'){
        return false
      }
    },
    paymentTypeWord() {
      switch (this.$route.query.paymentType) {
        case 'wechat':
          return '微信支付'
        case 'unionpay':
          return '银联'
        default:
          return '-'
      }
    }
  }
}
</script>
