<template>
  <div class="wrap wrap-cart">
    <div class="bar-box-bottom bar-absolute-bottom">
      <div v-if="!isEmpty" class="bar bar-tool">
        <div class="bar-item bar-checkbox">
          <label class="label-checkbox">
            <input @change="checkAllHandler" v-model="checkAll" type="checkbox" name="my-radio">
            <i class="icon icon-form-checkbox">icon</i>
            全选
          </label>
        </div>
        <div class="bar-item bar-total">
          <p class="total-price">
            {{summaryWord}}
            <span class="item-price">¥{{cart.totalAmount}}</span>
          </p>
          <p class="sale-price">
            立减：￥{{cart.substractAmount}}
          </p>
        </div>
        <div class="bar-item bar-item-button _cloumn2">
          <a @click="paymentHandler" :disabled="submitting" :class="{'btn-primary': !submitting, 'btn-disabled': submitting}" class="btn-normal _solid " href="javascript:;">去结算</a>
        </div>
      </div>
      <nav-bar :bottom="false" :type="NAV_TYPES.CART"></nav-bar>
    </div>
    <div class="content">
      <!-- 购物车为空 -->
      <div v-if="isEmpty">
        <div class="tips-box">
          <div class="tips-no-result">
            <div class="icon-area">
              <i class="icon icon-no-cart">icon</i>
            </div>
            <p>亲，购物车内还没有商品哦</p>
            <a href="index.html" class="btn-normal btn-primary btn-xl _solid">去逛逛吧</a>
          </div>
          <!-- /.tips-no-result -->
        </div>
      </div>
      <!-- 购物车不为空 -->
      <div v-else>
        <div v-if="cart.couponList && cart.couponList.length > 0 && !couponDismiss" class="notice">
          <a @click="couponSelectHandler" href="javascript:;" class="item-left flex flex-align-center">
            <div class="info _ellipsis">
              有优惠券
              <span class="tag tag-lg tag-primary">{{cart.minThresholdCouponLabel}}</span>
              你一定用得上，快去看看
            </div>
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
          <div @click="couponDismissHandler" class="item-right">
            <svg class="svg-close _right">
              <use xlink:href="#svg-close" />
            </svg>
          </div>
        </div>
        <!-- 循环活动 -->
        <template v-if="cart.activityList" v-for="(activity, $activityIndex) in cart.activityList">
          <div :key="activity.activityId" class="card card-cart">
            <div class="card-header">
              <div class="item-left">
                <span class="tag tag-primary _solid">{{activity.activityLabel}}</span>
                <span class="text _ellipsis">{{activity.activityRuleDesc}}</span>
              </div>
              <a v-if="activity.activityType === FULL_GIVEN.value || activity.activityType === FULL_SUBTRACT.value" v-show="activity.showPatchLink" :href="`index.html#/activity/${activity.activityType}/${activity.activityId}`" class="links item-right">
                <span class="text">去凑单</span>
                <svg class="svg-arrow _right">
                  <use xlink:href="#svg-arrow" />
                </svg>
              </a>
            </div>
            <div class="card-body">
              <!-- 循环sku -->
              <template v-for="(sku, $skuIndex) in activity.skus">
                <div :key="sku.skuId">
                  <div :class="{'item-disabled': !(sku.stock> 0 && sku.valid)}" class="item-goods item-horizontal">
                    <div class="item-align-center">
                      <label class="label-checkbox">
                        <input @change="checkSingleHandler(sku, $event)" v-model="sku.checked" type="checkbox" name="my-radio">
                        <i class="icon icon-form-checkbox">icon</i>
                      </label>
                    </div>
                    <div class="item-media">
                      <img v-lazy="{
                        src: sku.imgPath,
                        loading: 'static/images/lazyload/324x324.jpg',
                        error: 'static/images/lazyload/324x324.jpg'
                      }">
                      <div v-if="!(sku.stock> 0 && sku.valid)" class="tag-sold-out">
                        无货
                      </div>
                    </div>
                    <div class="item-inner">
                      <div class="item-flex-between">
                        <div class="item-title _ellipsis">{{sku.skuName}}</div>
                        <a @click="trashHandler(sku)" href="javascript:;" class="links-del">
                          <svg class="svg-trash">
                            <use xlink:href="#svg-trash" />
                          </svg>
                        </a>
                      </div>
                      <div class="item-subtitle-sku">
                        <span v-if="sku.attribute" class="name">规格：</span>{{sku.attribute}}
                      </div>
                      <div class="item-flex-between flex-align-center item-bottom">
                        <span class="item-price">
                          <em>¥</em>{{sku.salePrice}}</span>
                        <div class="modified">
                          <div @click="quantityMinus(sku)" class="minus">
                            <svg class="svg-minus">
                              <use xlink:href="#svg-minus"></use>
                            </svg>
                          </div>
                          <div class="num"><input type="num" readonly disabled v-model="sku.quantity" /></div>
                          <div @click="quantityPlus(sku)" :class="skuPlusClassObj(sku)" class="plus">
                            <svg class="svg-add">
                              <use xlink:href="#svg-add"></use>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 循环赠品 -->
                  <template v-if="sku.giftList" v-for="gift in sku.giftList">
                    <div :key="gift.skuId" class="item-goods-gift item-goods item-horizontal">
                      <div class="item-media">
                        <img v-lazy="{
                          src: gift.imgPath,
                          loading: 'static/images/lazyload/324x324.jpg',
                          error: 'static/images/lazyload/324x324.jpg'
                        }">
                      </div>
                      <div class="item-inner">
                        <div class="item-flex-between">
                          <div class="item-title _ellipsis">{{gift.skuName}}</div>
                        </div>
                        <div class="item-flex-between flex-align-center item-bottom">
                          <span class="tag tag-primary _solid">赠品</span>
                          <div class="item-count">x{{gift.quantity}}</div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="activity.activityType === FULL_GIVEN.value && activity.fullGivenGifts" v-for="gift in activity.fullGivenGifts">
                <div :key="gift.skuId" class="item-goods-gift item-goods item-horizontal">
                  <div class="item-media">
                    <img v-lazy="{
                      src: gift.imgPath,
                      loading: 'static/images/lazyload/324x324.jpg',
                      error: 'static/images/lazyload/324x324.jpg'
                    }">
                  </div>
                  <div class="item-inner">
                    <div class="item-flex-between">
                      <div class="item-title _ellipsis">{{gift.skuName}}</div>
                    </div>
                    <div class="item-flex-between flex-align-center item-bottom">
                      <span class="tag tag-primary _solid">赠品</span>
                      <div class="item-count">x{{gift.quantity}}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template>
          <div v-if="cart.skuList" class="card card-cart">
            <div class="card-body">
              <div v-for="(sku, $skuListIndex) in cart.skuList" :key="sku.skuId">
                <div :class="{'item-disabled': !(sku.stock> 0 && sku.valid)}" class="item-goods item-horizontal">
                  <div class="item-align-center">
                    <label class="label-checkbox">
                      <input @change="checkSingleHandler(sku, $event)" v-model="sku.checked" type="checkbox" name="my-radio">
                      <i class="icon icon-form-checkbox">icon</i>
                    </label>
                  </div>
                  <div class="item-media">
                    <img v-lazy="{
                      src: sku.imgPath,
                      loading: 'static/images/lazyload/324x324.jpg',
                      error: 'static/images/lazyload/324x324.jpg'
                    }">
                    <div v-if="!(sku.stock> 0 && sku.valid)" class="tag-sold-out">
                      {{skuWord(sku)}}
                    </div>
                  </div>
                  <div class="item-inner">
                    <div class="item-flex-between">
                      <div class="item-title _ellipsis">{{sku.skuName}}</div>
                      <a @click="trashHandler(sku)" href="javascript:;" class="links-del">
                        <svg class="svg-trash">
                          <use xlink:href="#svg-trash" />
                        </svg>
                      </a>
                    </div>
                    <div class="item-subtitle-sku">
                      <span v-if="sku.attribute" class="name">规格：</span>{{sku.attribute}}
                    </div>
                    <div class="item-flex-between flex-align-center item-bottom">
                      <span class="item-price">
                        <em>¥</em>{{sku.salePrice}}</span>
                      <div class="modified">
                        <div @click="quantityMinus(sku)" class="minus">
                          <svg class="svg-minus">
                            <use xlink:href="#svg-minus"></use>
                          </svg>
                        </div>
                        <div class="num"><input type="num" readonly disabled v-model="sku.quantity" /></div>
                        <div @click="quantityPlus(sku)" :class="skuPlusClassObj(sku)" class="plus">
                          <svg class="svg-add">
                            <use xlink:href="#svg-add"></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 循环赠品 -->
                <template v-if="sku.giftList" v-for="gift in sku.giftList">
                  <div :key="gift.skuId" class="item-goods-gift item-goods item-horizontal">
                    <div class="item-media">
                      <img v-lazy="{
                        src: gift.imgPath,
                        loading: 'static/images/lazyload/324x324.jpg',
                        error: 'static/images/lazyload/324x324.jpg'
                      }">
                    </div>
                    <div class="item-inner">
                      <div class="item-flex-between">
                        <div class="item-title _ellipsis">{{gift.skuName}}</div>
                      </div>
                      <div class="item-flex-between flex-align-center item-bottom">
                        <span class="tag tag-primary _solid">赠品</span>
                        <div class="item-count">x{{quantity}}</div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
        <popup-dialog v-model="couponVisible" title="领取优惠券" :contentClass="{'dialog-coupons-wrap':true}" :wrapStyle="{'background': '#f4f4f4'}">
          <div>
            <div v-for="(coupon, $index) in cart.couponList" :key="coupon.id + 'coupon'" :class="{
                'coupons-expried': coupon.isUseUp || coupon.isReceive
              }" class="list-coupons coupons-selected">
              <svg class="svg-coupons">
                <use xlink:href="#svg-coupons" />
              </svg>
              <!-- 选中状态标识 -->
              <div v-if="coupon.selected" class="selected">
                <svg class="svg-check">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-check"></use>
                </svg>
              </div>
              <!-- 优先展示已抢光-->
              <div v-if="coupon.isUseUp" class="disabled-img">
                <span class="text">已抢光</span>
              </div>
              <div v-else-if="coupon.isReceive" class="disabled-img">
                <span class="text">已领取</span>
              </div>
              <div class="coupons-body">
                <div class="coupons">
                  <div class="item-price">
                    <em>¥</em>{{coupon.subtraction}}</div>
                  <div class="text">满{{coupon.threshold}}可用</div>
                </div>
                <div @click.stop="couponSwitchInfo(coupon,$index)" class="item-inner">
                  <div class="item-title _ellipsis">{{coupon.name}}</div>
                  <div class="item-subtitle _ellipsis">
                    {{coupon.effectiveDate}}
                  </div>
                  <div class="details-info">
                    <span class="text _ellipsis">{{coupon.note}}</span>
                    <svg :class="{'_up': coupon.textVisible, '_down': !coupon.textVisible}" class="svg-arrow">
                      <use xlink:href="#svg-arrow" />
                    </svg>
                  </div>
                </div>
                <div @click="couponReceive(coupon)" class="item-align-center">
                  <a href="javascript:;" class="btn-normal btn-primary btn-xs">{{coupon.isReceive ? '已领取' : '领取'}}</a>
                </div>
              </div>
              <!-- 判断是否显示 -->
              <div :class="{'disB': coupon.textVisible, 'disN': !coupon.textVisible}" class="coupons-footer">
                {{coupon.note}}
              </div>
            </div>
            <div style="height: 20px;"></div>
          </div>
          <div slot="footer" class="bar bar-button bar-absolute-bottom">
            <a @click="couponVisible = false" href="javascript:;" class="btn-normal btn-close btn-xxl">关闭</a>
          </div>
        </popup-dialog>
        <r-modal :visible.sync="modalVisible" :loading.sync="modalLoading" title="" :bodyStyle="modalBodyStyle">
          <div slot="header" class="cart-modal-title">含有保税区商品，需分开结算</div>
          <div class="cart-modal-body">
            <div class="cart-item-list">
              <div class="cart-item">
                <div class="item-align-center">
                  <label class="label-checkbox">
                    <input v-model="modalBonded" :value="true" type="radio" name="bonded">
                    <i class="icon icon-form-checkbox">icon</i>
                    <span class="item-label">保税商品</span>
                  </label>
                </div>
                <div>
                  {{modalData.bondTotalSkuQty}}件
                </div>
              </div>
              <div class="cart-item">
                <div class="item-align-center">
                  <label class="label-checkbox">
                    <input v-model="modalBonded" :value="false" type="radio" name="bonded">
                    <i class="icon icon-form-checkbox">icon</i>
                    <span class="item-label">普通商品</span>
                  </label>
                </div>
                <div>
                  {{modalData.unbondTotalSkuQty}}件
                </div>
              </div>
            </div>
          </div>
          <div slot="footer" class="cart-modal-footer">
            <a href="javascript:;" class="cart-modal-button" role="button" @click="modalCancelHandler">取消</a>
            <a href="javascript:;" class="cart-modal-button" role="button" @click="modalOkHandler">确定</a>
          </div>
        </r-modal>
      </div>
    </div>
  </div>
</template>
<script>
import axios from '@/configs/axios'
import NavBar from '@/components/NavBar'
import NAV_TYPES from '@/constants/navType'
import { Toast, PopupDialog, ActionSheet, Modal } from 'rocoui'
import CODE_SUCCESS from '@/constants/responseCode'
import { FULL_GIVEN, FULL_SUBTRACT } from '@/constants/activityType'
import * as PLACE_ORDER_TYPE from '@/constants/placeOrderType'
function fetchCart(cb) {
  return axios.get('/api/wap/cart').then((res) => {
    if (res.data.code === CODE_SUCCESS) {
      cb(null, res.data.data)
    } else {
      cb(new Error())
    }
  })
}

export default {
  name: 'CartView',
  components: {
    NavBar,
    PopupDialog,
    ActionSheet,
    'r-modal': Modal
  },
  data() {
    return {
      FULL_GIVEN,
      FULL_SUBTRACT,
      NAV_TYPES,
      submitting: false,
      isEmpty: false,
      couponVisible: false,
      couponDismiss: false,
      cart: {
        activityList: null,
        couponList: null,
        skuList: [],
        substractAmount: 0,
        totalAmount: 0,
        hasTaxFreeProduct: false,
        minThresholdCouponLabel: ''
      },
      checkAll: false,
      err: null,
      modalLoading: false,
      modalVisible: false,
      modalBonded: true,
      modalSelected: false,
      // 去掉padding
      modalBodyStyle: { padding: 0 },
      modalData: {},
      // 需要绑定手机号
      modalNeedBindPhone: false
    }
  },
  beforeCreate() {
    this.$store.dispatch('cartGetQuantity')
  },
  created() {
    let promise = fetchCart((err, data) => {
      this.err = data
      !err && this.setCart(data, true)
    })
    Toast.loading('', promise)
  },
  beforeRouteUpdate(to, from, next) {
    console.log('update')
    let promise = fetchCart((err, data) => {
      this.err = err
      !err && this.setCart(data, true)
    })
    Toast.loading('', promise)
    next()
  },
  methods: {
    checkSingleHandler(sku, event) {
      let promise = axios
        .get('/api/wap/cart/checkUncheck', {
          skuIdList: `${sku.skuId}`,
          isChecked: event.target.checked
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.setCart(res.data.data)
            this.$store.dispatch('cartGetQuantity')
          } else {
            sku.checked = !event.target.checked
          }
        })
      Toast.loading('', promise)
    },
    checkAllHandler(event) {
      let skuIdList = []
      if (this.cart.activityList) {
        this.cart.activityList.forEach((activity) => {
          activity.skus.forEach((sku) => {
            skuIdList.push(sku.skuId)
          })
        })
      }
      if (this.cart.skuList) {
        this.cart.skuList.forEach((sku) => {
          skuIdList.push(sku.skuId)
        })
      }

      let promise = axios
        .get('/api/wap/cart/checkUncheck', {
          skuIdList: skuIdList.join(','),
          isChecked: event.target.checked
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.setCart(res.data.data)
            this.$store.dispatch('cartGetQuantity')
          } else {
            this.checkAllSum()
          }
        })
      Toast.loading('', promise)
    },
    checkAllSum() {
      let result = null
      if (this.cart.activityList) {
        this.cart.activityList.forEach((activity) => {
          result = activity.skus.some((sku) => {
            return !sku.checked
          })
          if (!result) {
            return false
          }
        })
      }
      if (!result && this.cart.skuList) {
        result = this.cart.skuList.some((sku) => {
          return !sku.checked
        })
      }
      this.checkAll = !result
    },
    setCart(data, initial = false) {
      // 是否为空购物车
      this.isEmpty = !data
      if (data) {
        this.cart.activityList = data.activityList || null
        this.cart.skuList = data.skuList || null
        this.cart.substractAmount = data.substractAmount
        this.cart.totalAmount = data.totalAmount
        this.cart.hasTaxFreeProduct = data.hasTaxFreeProduct
        // 初始化才处理优惠券
        if (initial) {
          this.cart.couponList = data.couponList || null
          this.cart.minThresholdCouponLabel = data.minThresholdCouponLabel || ''
          this.setCartCoupon()
        }
      }
      this.checkAllSum()
    },
    setCartCoupon() {
      if (this.cart.couponList) {
        this.cart.couponList.forEach((coupon) => {
          this.$set(coupon, 'textVisible', false)
        })
      }
    },
    paymentHandler() {
      let promise = axios.get('/api/wap/cart/validate').then((res) => {
        if (res.data.code !== '0') {
          this.modalData = res.data.data
        }
        // 先判断是否需要弹窗
        if (
          this.modalData.bondTotalSkuQty > 0 &&
          this.modalData.unbondTotalSkuQty > 0
        ) {
          this.modalVisible = true
          // 需要绑定手机号
          this.modalNeedBindPhone = res.data.code === '2'
        } else if (res.data.code === CODE_SUCCESS) {
          // 不需要弹窗的直接跳转
          window.location = `order.html#/?placeOrderType=${
            PLACE_ORDER_TYPE.CART.value
          }`
        } else if (res.data.code === '2') {
          // 不需要弹窗的去绑定手机号
          this.$router.push({
            name: 'BindPhone',
            query: {
              redirect: `order.html#/?placeOrderType=${
                PLACE_ORDER_TYPE.CART.value
              }`
            }
          })
        }
      })
      Toast.loading('正在提交', promise)
    },
    activityHandler() {
      let options = ['满300赠礼品', '满500减50', '买一赠一', '取消']
      ActionSheet.showActionSheet(
        {
          // 当前选中项
          destructiveButtonIndex: 1,
          cancelButtonIndex: options.length - 1,
          options: options
        },
        (index) => {}
      )
    },
    trashHandler(sku) {
      Modal.confirm({
        title: '',
        body: `<b>确定删除该商品？</b>`,
        okCb: () => {
          let promise = axios
            .get(`/api/wap/cart/deleteItem/${sku.skuId}`)
            .then((res) => {
              if (res.data.code === CODE_SUCCESS) {
                this.setCart(res.data.data)
                this.$store.dispatch('cartGetQuantity')
              }
            })
          Toast.loading('正在删除️', promise)
        }
      })
    },
    couponDismissHandler() {
      this.couponDismiss = true
    },
    couponSelectHandler() {
      this.couponVisible = true
    },
    couponSwitchInfo(coupon, index) {
      coupon.textVisible = !coupon.textVisible
    },
    couponReceive(coupon) {
      // 优惠券已领取或已抢光 不再处理
      if (coupon.isReceive || coupon.isUseUp) {
        return false
      }
      let promise = axios
        .get(`/api/wap/coupon/toreceive`, {
          couponId: coupon.id
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            coupon.isReceive = res.data.data.isReceive
            coupon.isUseUp = res.data.data.isUseUp
            Toast.success('领取成功', 1, null, false)
          } else if (res.data.code === '2') {
            coupon.isReceive = true
          } else if (res.data.code === '3') {
            coupon.isUseUp = true
          }
        })
      Toast.loading('正在领取...', promise)
    },
    quantityMinus(sku) {
      // 减到0 直接删除
      if (sku.quantity - 1 < 1) {
        this.trashHandler(sku)
        return false
      }
      let promise = axios
        .get('/api/wap/cart/modifyQty', {
          skuId: sku.skuId,
          quantity: sku.quantity - 1
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.setCart(res.data.data)
            this.$store.dispatch('cartGetQuantity')
          }
        })
      Toast.loading('', promise)
    },
    quantityPlus(sku) {
      if (sku.quantity + 1 > sku.stock) {
        return false
      }
      let promise = axios
        .get('/api/wap/cart/modifyQty', {
          skuId: sku.skuId,
          quantity: sku.quantity + 1
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.setCart(res.data.data)
            this.$store.dispatch('cartGetQuantity')
          }
        })
      Toast.loading('', promise)
    },
    modalCancelHandler() {
      this.modalVisible = false
    },
    modalOkHandler() {
      this.modalVisible = false
      this.modalSelected = true
      // 需要绑定手机号的
      if (this.modalNeedBindPhone) {
        this.$router.push({
          name: 'BindPhone',
          query: {
            redirect: `order.html#/?placeOrderType=${
              PLACE_ORDER_TYPE.CART.value
            }&bonded=${this.modalBonded}`
          }
        })
      } else {
        window.location = `order.html#/?placeOrderType=${
          PLACE_ORDER_TYPE.CART.value
        }&bonded=${this.modalBonded}`
      }
    },
    skuWord(sku) {
      if (sku.stock < 1) {
        return '无货'
      } else if (!sku.valid) {
        return '无效'
      } else {
        return ''
      }
    },
    skuPlusClassObj(sku) {
      return { _disabled: sku.quantity >= sku.stock }
    }
  },
  computed: {
    summaryWord() {
      if (this.cart.skuList && this.cart.skuList.length > 0) {
        let result = this.cart.skuList.some((sku) => {
          return sku.bonded && sku.checked
        })
        if (result) {
          return '总计（包邮包税）：'
        }
      }
      return '总计（包邮）：'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/scss/utilities/_variables.scss';
@import '@/scss/utilities/_mixins.scss';
@import '@/scss/utilities/_functions.scss';
.cart-modal-title {
  color: #333;
  text-align: center;
  @include font-dpr(30px);
  padding-top: px2rem(30px);
}
.cart-modal-body {
  width: px2rem(520px);
  .cart-item-list {
    .cart-item {
      display: flex;
      justify-content: space-between;
      @include font-dpr(28px);
      @include lh-dpr(90px);
      padding: 0 px2rem(70px) 0 px2rem(50px);
      color: #666;
      .item-label {
        padding-left: px2rem(10px);
        line-height: px2rem(30px);
      }
      &.active {
        background: #f2f2f2;
      }
      & > div {
        flex: 1;
        &:last-child {
          text-align: right;
        }
      }
    }
  }
}
.cart-modal-footer {
  display: flex;
  flex: 1;
  .cart-modal-button {
    -webkit-touch-callout: none;
    flex: 1;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    outline: none;
    color: #108ee9;
    @include font-dpr(30px);
    @include lh-dpr(80px);
    display: block;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:first-child {
      border-right: 1px solid #ddd;
    }
    &:last-child {
      color: #ff2d48;
    }
  }
}
</style>
