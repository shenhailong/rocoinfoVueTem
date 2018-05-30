<template>
  <div class="wrap wrap-order">
    <template v-if="order">
      <div class="bar bar-nav _border bar-absolute-top">
        <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
          <svg class="svg-arrow _left">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <div class="bar-item">填写订单</div>
      </div>

      <div v-if="!isCentExchange" class="bar bar-tool bar-absolute-bottom">
        <div class="bar-item bar-total">
          实付款：
          <span class="item-price">¥{{order.payMoney}}</span>
        </div>
        <div class="bar-item bar-item-button _cloumn2">
          <button :disabled="submitting" @click="submitHandler" :class="{'btn-primary': !submitting, 'btn-disabled': submitting}" class="btn-normal _solid" href="javascript:;">提交订单</button>
        </div>
      </div>
      <div v-else class="bar bar-tool bar-absolute-bottom">
        <div class="bar-item bar-total">
          应付：
          <span class="item-price">{{order.totalCent}}积分</span>
        </div>
        <div class="bar-item bar-item-button _cloumn2">
          <button :disabled="submitting" @click="submitHandler" :class="{'btn-primary': !submitting, 'btn-disabled': submitting}" class="btn-normal _solid" href="javascript:;">确认兑换</button>
        </div>
      </div>
      <div class="content">
        <div v-if="!orderState.hasAddress" class="btn-new-address">
          <template>
            <router-link :to="{name: 'OrderAddressAdd', query: {use: true}}" class="text-primary">
              + 新建收货地址
            </router-link>
          </template>
        </div>
        <div v-else-if="orderState.hasAddress && !orderState.address" class="btn-new-address">
          <router-link :to="{name: 'OrderAddressList'}" class="text-primary">
            + 选择收货地址
          </router-link>
        </div>
        <div v-else @click="addressHandler" class="content-block-title _border">
          <div class="item-inner">
            <div class="user-info text-space">{{orderState.address.receiverName}}
              <span>{{orderState.address.receiverMobile}}</span>
            </div>
            <div class="flex flex-align-center user-address ">
              <svg class="svg-location">
                <use xlink:href="#svg-location" />
              </svg>
              <div class="address _ellipsis2">{{addressDetail}}</div>
            </div>
          </div>
          <a href="javascript:;" class="text">
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <div class="space-20"></div>
        <div v-if="orderState.address && order.bonded" @click="customInfoHandler" class="content-block-title _border">
          <div class="flex title text-primary">
            {{orderState.customInfo ? '身份信息上传成功' : '因海关清关需要，请上传收件人真实的身份信息'}}
          </div>
          <a href="javascript:;" class="text">
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <div class="list-order">
          <div v-for="(sku, $index) in order.placeOrderSkuDtos" :key="sku.skuId" v-show="skuVisible($index)" class="list-order-item">
            <!-- 展开全部 或前三个 显示 -->
            <div :class="{'item-goods-gift': sku.giftFlag}" class="item-goods item-horizontal">
              <div class="item-media">
                <img v-lazy="{
                  src: sku.skuImg,
                  loading: 'static/images/lazyload/324x324.jpg',
                  error: 'static/images/lazyload/324x324.jpg'
                }">
              </div>
              <div class="item-inner">
                <div class="item-flex-between">
                  <div class="item-title _ellipsis">{{sku.skuName}}</div>
                </div>
                <div class="item-subtitle-sku">
                  <span v-if="sku.attribute1" class="name">规格：</span>{{sku.attribute1}}
                </div>
                <div v-if="sku.giftFlag" class="item-flex-between item-bottom">
                  <span class="tag tag-primary _solid">赠品</span>
                  <div class="item-count">x{{sku.quantity}}</div>
                </div>

                <div v-else class="item-flex-between item-bottom">
                  <span class="item-price">
                    <em>{{currencyWord}}</em>{{sku.salePrice}}</span>
                  <span v-if="sku.hasSubtract" class="item-price-sale">
                    <span class="text">优惠后</span>
                    <em>¥</em>{{sku.payMoney}}</span>
                  <div class="item-count">x{{sku.quantity}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="order.placeOrderSkuDtos.length > 3" @click="allSkuHandler" class="btn-show-all">
          {{orderState.allSkuVisible ? '收起': '查看全部商品'}}
          <svg :class="{'_up': orderState.allSkuVisible, '_down': !orderState.allSkuVisible}" class="svg-arrow">
            <use xlink:href="#svg-arrow" />
          </svg>
        </div>
        <div class="space-20"></div>
        <div v-if="couponVisible" @click="couponHandler" class="content-block-title _border">
          <div class="flex title">
            优惠券
            <template v-if="order.useCouponCount > 0">
              <span class="tag tag-primary _ellipsis">{{usedCounponWord}}</span>
            </template>
            <template v-else-if="unusedCouponCountTotal > 0">
              <span class="tag tag-primary _ellipsis">{{unusedCouponWord}}</span>
            </template>
          </div>
          <a href="javascript:;" class="item-right">
            <span class="text text-primary _ellipsis">{{couponWord}}</span>
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <div v-if="!isCentExchange" @click="invoiceHandler" class="content-block-title">
          <div class="title">
            发票
          </div>
          <!-- <div class="text">
          保税区商品不可开发票
        </div> -->
          <a href="javascript:;" class="item-right">
            <span class="text _ellipsis">{{invoiceWord}}</span>
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <div v-if="isCentExchange" class="content-block-title _border">
          <div class="flex title">
            可用积分
          </div>
          <div class="item-right">
            <div class="text text-primary">
              {{order.centBalance}}积分
            </div>
          </div>
        </div>
        <div class="space-20"></div>
        <div v-if="!isCentExchange" class="content-block-title _border">
          <div class="title">
            商品金额
          </div>
          <div class="item-right">
            <div class="text">{{currencyWord}}{{order.saleMoney}}</div>
            <!-- <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg> -->
          </div>
        </div>
        <div v-if="isCentExchange" class="content-block-title _border">
          <div class="title">
            商品总额
          </div>
          <div class="item-right">
            <div class="text text-primary">{{order.totalCent}}积分</div>
            <!-- <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg> -->
          </div>
        </div>
        <!-- <div v-if="!isCentExchange" class="content-block-title _border">
          <div class="flex title">
            税费
            <span class="tag tag-primary _ellipsis">商家承担</span>
          </div>
          <div class="text">
            -￥0
          </div>
        </div> -->
        <div class="content-block-title _border">
          <div class="flex title">
            运费
            <span style="margin-left: 10px;" class="tag tag-primary _ellipsis">全场包邮</span>
          </div>
          <div class="text">
            +￥0
          </div>
        </div>
        <div v-if="!isCentExchange" class="content-block-title _border">
          <div class="title">
            立减
          </div>
          <div class="text text-primary">
            -￥{{order.immediatelySubtractMoney}}
          </div>
        </div>
        <div v-if="couponVisible" :class="{'_border': order.original}" class="content-block-title">
          <div class="title">
            优惠券
          </div>
          <div class="text text-primary">
            -￥{{order.totalCouponSubtractMoney}}
          </div>
        </div>
        <div v-if="couponVisible && order.original" class="content-block-title">
          <div class="title">
            初始会员优惠
          </div>
          <div class="text text-primary">
            -￥{{order.originalSubtractMoney}}
          </div>
        </div>
        <div class="space-20"></div>
      </div>
    </template>
  </div>
</template>
<script>
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
// import { Toast, ActionSheet } from 'rocoui'
import { Toast } from 'rocoui'
import routerMixin from '@/mixin/router'
import { mapState } from 'vuex'
import * as STORE_ORDER_TYPE from '@/store/types/order'
import * as INVOICE_TYPE from '@/constants/invoiceType'
import * as PLACE_ORDER_TYPE from '@/constants/placeOrderType'
export default {
  mixins: [routerMixin],
  data() {
    return {
      order: null,
      placeOrderType: '',
      submitting: false,
      ordered: false,
      timer: null,
      promise: null,
      orderedInfo: {
        // payOrderCode: '8b16dd67-03c6-4194-a6a9-e5f192c8aa49', // 主订单code
        // payMoney: 3894.3 // 支付金额 或支付积分
        // orderId 订单id
        // centBalance 剩余积分
      }
    }
  },
  created() {
    this.placeOrderType =
      this.$route.query.placeOrderType || PLACE_ORDER_TYPE.CART.value
    this.fetchOrder()
    // 地址海关信息判断
    if (this.orderState.address) {
      this.$store.commit(STORE_ORDER_TYPE.ORDER_SET_HAS_ADDRESS, true)
      this.fetchCustomInfo()
    } else {
      this.fetchDefaultAddress()
    }
  },
  methods: {
    fetchOrder() {
      let promise = axios
        .post('/api/wap/orders/placeOrderSearch', {
          placeOrderType: this.placeOrderType,
          memberCouponId: this.couponId,
          noThresholdMemberCouponId: this.noThresholdCouponId,
          targetSkuId: this.$route.query.skuId,
          activityId: this.$route.query.activityId,
          quantity: this.$route.query.quantity,
          recordId: this.$route.query.recordId,
          bonded: this.$route.query.bonded
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.order = res.data.data
            this.setStore()
          }else {
            this.timer = setTimeout(() => {
              this.$router.back()
            }, 500)
          }
        })
      Toast.loading('正在加载', promise)
    },
    fetchDefaultAddress() {
      axios.get('/api/wap/memberAddress/findDefaultAddress').then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.defaultAddress) {
            this.$store.commit(
              STORE_ORDER_TYPE.ORDER_SET_ADDRESS,
              res.data.data.defaultAddress
            )
            this.$store.commit(
              STORE_ORDER_TYPE.ORDER_SET_HAS_ADDRESS,
              res.data.data.hasAddress
            )
            this.fetchCustomInfo()
          }
        }
      })
    },
    fetchCustomInfo() {
      let promise = axios
        .post('/api/wap/ciq/findByNameAndMobile', {
          name: this.orderState.address.receiverName,
          mobile: this.orderState.address.receiverMobile
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.$store.commit(
              STORE_ORDER_TYPE.ORDER_SET_CUSTOM_INFO,
              res.data.data
            )
          }
        })
      Toast.loading('正在加载报关信息', promise)
    },
    setStore() {
      if (this.order) {
        // 默认将活动优惠券放入有门槛优惠券列表头部
        if (this.order.activityCoupon) {
          this.order.couponDtos.unshift(this.order.activityCoupon)
        }
        this.order.couponDtos.forEach((coupon) => {
          this.$set(coupon, '_textVisible', false)
          if (coupon.checked) {
            this.$store.commit(STORE_ORDER_TYPE.ORDER_SET_COUPON, coupon)
          }
        })
        this.order.noThresholdCouponDtos.forEach((coupon) => {
          this.$set(coupon, '_textVisible', false)
          if (coupon.checked) {
            this.$store.commit(
              STORE_ORDER_TYPE.ORDER_SET_NO_THRESHOLD_COUPON,
              coupon
            )
          }
        })

        this.$store.commit(
          STORE_ORDER_TYPE.ORDER_SET_COUPONDTOS,
          this.order.couponDtos
        )
        this.$store.commit(
          STORE_ORDER_TYPE.ORDER_SET_NOTHRESHOLDCOUPONDTOS,
          this.order.noThresholdCouponDtos
        )
      }
    },
    allSkuHandler() {
      // this.allSkuVisible = !this.allSkuVisible
      this.$store.commit(
        STORE_ORDER_TYPE.ORDER_SET_ALL_SKU_VISIBLE,
        !this.orderState.allSkuVisible
      )
    },
    addressHandler() {
      this.$router.push({ name: 'OrderAddressList' })
    },
    customInfoHandler() {
      this.$router.push({
        name: 'OrderIdCard',
        query: {
          name: this.orderState.address.receiverName,
          mobile: this.orderState.address.receiverMobile
        }
      })
    },
    couponHandler() {
      this.$router.push({
        name: 'OrderCoupon'
      })
    },
    invoiceHandler() {
      // 不需要发票
      if (!this.order.hasInvoiced) {
        return false
      }
      this.$router.push({
        name: 'OrderInvoice',
        query: {
          money: this.order.invoiceMoney
        }
      })
    },
    submitHandler() {
      if (this.ordered) {
        this.choosePayment()
        return false
      }
      if (!this.orderState.address) {
        Toast.info('请选择收货地址', 2, null, false)
        return false
      }
      if (this.order.bonded) {
        if (!this.orderState.customInfo) {
          Toast.info('请上传报关材料', 2, null, false)
          return false
        }
      }

      this.submitting = true
      let data = {
        memberAddress: {
          ...this.orderState.address
        },
        ciqMaterial: {
          ...this.orderState.customInfo
        },
        invoice:
          this.orderState.invoiceType === 'NONE'
            ? {}
            : { ...this.orderState.invoice },
        useCouponDto: {
          targetSkuId: this.$route.query.skuId,
          activityId: this.$route.query.activityId,
          recordId: this.$route.query.recordId,
          quantity: this.$route.query.quantity,
          placeOrderType: this.placeOrderType,
          memberCouponId: this.couponId,
          noThresholdMemberCouponId: this.noThresholdCouponId
        },
        saleMoney: this.order.saleMoney,
        payMoney: this.order.payMoney,
        bonded: this.$route.query.bonded
      }

      // let promise = axios
      //   .post('/api/wap/orders/placeOrder', data)
      //   .then((res) => {
      //     if (res.data.code === CODE_SUCCESS) {
      //       this.ordered = true
      //       this.orderedInfo = res.data.data
      //       // 无需支付的直接进入支付成功
      //       if (this.orderedInfo && this.orderedInfo.payMoney === 0) {
      //         this.$router.push({
      //           name: 'OrderSuccess',
      //           query: {
      //             ...this.orderedInfo,
      //             // 因为有可能是立即购买的后台会把最终的类型返回给前台
      //             placeOrderType: this.orderedInfo.placeOrderType,
      //             paymentType: '',
      //             payMoney: this.orderedInfo.payMoney,
      //             totalCent: this.order.totalCent,
      //             centBalance: this.orderedInfo.centBalance
      //           }
      //         })
      //       } else {
      //         this.choosePayment()
      //       }
      //     }
      //   })
      //   .finally(() => {
      //     this.submitting = false
      //   })
      // Toast.loading('正在提交', promise)

      // 一本道下订单
      this.placeOrder(data)
    },
    placeOrder(data){
      const promise = new Promise(async (resolve, reject) => {
        this.submitting = true
        try{
          const placeOrderRes = await axios.post('/api/wap/orders/placeOrder', data)
          if (placeOrderRes.data.code === CODE_SUCCESS) {
            this.ordered = true
            this.orderedInfo = placeOrderRes.data.data
            // 无需支付的直接进入支付成功
            if (this.orderedInfo && this.orderedInfo.payMoney === 0) {
              this.$router.push({
                name: 'OrderSuccess',
                query: {
                  ...this.orderedInfo,
                  // 因为有可能是立即购买的后台会把最终的类型返回给前台
                  placeOrderType: this.orderedInfo.placeOrderType,
                  paymentType: '',
                  payMoney: this.orderedInfo.payMoney,
                  totalCent: this.order.totalCent,
                  centBalance: this.orderedInfo.centBalance
                }
              })
              resolve()
            } else {
              try{
                const supayRes = await axios.post('/api/supay/order', {orderId: this.orderedInfo.orderId, cash: this.orderedInfo.payMoney})
                if (supayRes.data.code === CODE_SUCCESS) {
                  resolve()
                  window.location = supayRes.data.data.url
                }else {
                  throw new Error('code not 1')
                }
              }catch(e){
                this.submitting = false
                reject(e)
              }
            }
          }else {
            throw new Error('code not 1')
          }
        }catch(e){
          this.submitting = false
          reject(e)
        }
      })
      Toast.loading('正在提交', promise)
    },
    choosePayment() {
      this.submitting = true
      let promise = axios
        .post('/api/supay/order', {
          orderId: this.orderedInfo.orderId,
          cash: this.orderedInfo.payMoney
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            window.location = res.data.data.url
          }
        }).finally(() => {
          this.submitting = false
        })
      Toast.loading('正在提交', promise)
      // let options = ['微信支付', '银联支付', '取消']
      // ActionSheet.showActionSheet(
      //   {
      //     title: '请选择支付方式',
      //     cancelButtonIndex: options.length - 1,
      //     options: options
      //   },
      //   (index) => {
      //     switch (index) {
      //       case 0:
      //         this.doWechatSubmit()
      //         break
      //       case 1:
      //         this.doUnionPay()
      //         break
      //       default:
      //         break
      //     }
      //   }
      // )
    },
    skuVisible(index) {
      if (this.orderState.allSkuVisible) {
        return true
      } else {
        return index <= 2
      }
    },
    doWechatSubmit() {
      this.submitting = true
      axios
        .post('/api/wechat/pay/order', {
          orderId: this.orderedInfo.orderId,
          cash: this.orderedInfo.payMoney
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
            try {
              removeWechatEvent()
            } catch (e) {
              console.log(e)
            }
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              // 根据后台设计需要用子订单id查看详情 切记切记
              self.$router.push({
                name: 'OrderSuccess',
                query: {
                  ...self.orderedInfo,
                  placeOrderType: self.placeOrderType,
                  paymentType: 'wechat'
                }
              })
              // window.location.href = `store.html#/service/orderfillin/${self.serviceId}/${self.itemCode}/success?storeId=${self.storeId}`
            } else {
              self.$router.push({
                name: 'OrderFailure',
                query: {
                  ...self.orderedInfo,
                  placeOrderType: self.placeOrderType,
                  paymentType: 'wechat'
                }
              })
              // window.location.href = 'pay_error.html?ordNo=' + result.ordNo + '&type=' + (self.enterprisePayment ? 2 : 1)
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
      axios
        .post('/api/union/pay/page', {
          orderId: this.orderedInfo.orderId,
          cash: this.orderedInfo.payMoney
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            document.body.innerHTML = res.data.data
            document.forms[0].submit()
          }
        })
    }
  },
  computed: {
    ...mapState({
      orderState: (state) => state.order
    }),
    couponId() {
      if (this.orderState.coupon) {
        return this.orderState.coupon.id
      } else {
        return ''
      }
    },
    noThresholdCouponId() {
      if (this.orderState.noThresholdCoupon) {
        return this.orderState.noThresholdCoupon.id
      } else {
        return ''
      }
    },
    usedCounponWord() {
      return `已使用${this.order.useCouponCount}个优惠`
    },
    couponCount() {
      return this.orderState.couponDtos ? this.orderState.couponDtos.length : 0
    },
    couponWord() {
      return this.order.totalCouponSubtractMoney <= 0
        ? '不使用优惠券'
        : `-￥${this.order.totalCouponSubtractMoney}`
    },
    noTHresholdCouponCount() {
      return this.orderState.noThresholdCouponDtos
        ? this.orderState.noThresholdCouponDtos.length
        : 0
    },
    unusedCouponCountTotal() {
      return this.couponCount + this.noTHresholdCouponCount
    },
    unusedCouponWord() {
      return `${this.unusedCouponCountTotal}个优惠`
    },
    addressDetail() {
      return `${this.orderState.address.provinceLabel}${
        this.orderState.address.cityLabel
      }${this.orderState.address.districtLabel}${
        this.orderState.address.detail
      }`
    },
    invoiceWord() {
      // 可开发票的才去看发票类型
      if (this.order.hasInvoiced) {
        switch (this.orderState.invoiceType) {
          case INVOICE_TYPE.NONE:
            return '不需要发票'
          case INVOICE_TYPE.PERSONAGE:
            return '个人'
          case INVOICE_TYPE.COMPANY:
            return this.orderState.invoice.invoiceHeader
          default:
            return ''
        }
      } else {
        return '保税区及特殊商品暂不可开发票'
      }
    },
    isCentExchange() {
      return this.placeOrderType === PLACE_ORDER_TYPE.CENT_EXCHANGE.value
    },
    currencyWord() {
      if (this.isCentExchange) {
        return '积分'
      } else {
        return '￥'
      }
    },
    couponVisible() {
      if (
        // 晋级礼 生日礼品 新品免费试用 隐藏优惠方式
        (this.placeOrderType === PLACE_ORDER_TYPE.UPGRADE_GIFT.value ||
          this.placeOrderType === PLACE_ORDER_TYPE.BIRTHDAY_GIFT.value ||
          this.placeOrderType === PLACE_ORDER_TYPE.FREE_TRIAL.value) ||
        // 积分兑换隐藏优惠方式
        this.isCentExchange === true
      ) {
        return false
      } else {
        return true
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.tiemr)
    next()
  }
}
</script>
