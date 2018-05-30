<template>
  <div v-if="loaded" class="wrap wrap-details">
    <cart-bar @favorite="doFavorite" :product="product" :quantity="quantity" :productImg="product.banners[0].path" :placeOrderType="query.placeOrderType" :skuId="query.skuId" :activityId="computedActivityId" :recordId="query.recordId"></cart-bar>
    <div class="content content-details">
      <a @click="routerBack" href="javascript:;" class="back">
        <svg class="svg-arrow _left">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
        </svg>
      </a>
      <!-- Swiper -->
      <div ref="swiper" class="swiper-container swiper-container-details">
        <div class="swiper-wrapper">
          <template v-for="banner in product.banners">
            <div :key="banner.path" class="swiper-slide">
              <img v-bind:data-src="banner.path" alt="详情图" class="swiper-lazy">
              <div class="swiper-lazy-preloader"></div>
            </div>
          </template>
        </div>
        <div class="pagination">{{swiperIndicatorWord}}</div>
      </div>
      <!-- 活动为限时购的显示倒计时 -->
      <div v-if="timeLimitColumn" class="time-countdown-wrap">
        <div v-html="timeLimitWord" class="time-countdown">
        </div>
      </div>

      <div class="details-box">
        <div class="item-title _ellipsis">{{product.name}}</div>
        <div class="item-subtitle _ellipsis">{{product.promotion}}</div>
        <div class="item-subtitle-state _ellipsis2">
          {{product.subtitle}}
        </div>
        <div class="item-flex-between item-align-center price-box">
          <div class="price-area">
            <!-- 点卡兑换 -->
            <template v-if="isSkuPoint">
              <div class="item-price size-lg">积分{{product.checkedSku.saleCent}}
              </div>
            </template>
            <template v-else>
              <div class="item-price size-lg">
                <em>¥</em>{{skuPrice}}</div>
              <span v-if="product.originalPrice" class="item-price-original">
                <em>¥</em>{{product.originalPrice}}</span>
            </template>
          </div>
          <!-- <div class="item-subtitle">销量19999</div> -->
        </div>
      </div>
      <div v-if="!isSkuPoint" class="content-block-title-box mb-20">
        <!-- 有优惠券的显示领券栏 -->
        <div v-if="product.coupons" @click="couponVisible = true" class="content-block-title _border">
          <div class="item-left">
            <div class="title">
              领券
            </div>
            <div class="tag-area">
              <!-- 只显示前三个 -->
              <template v-for="(coupon, $index) in product.coupons">
                <span v-if="$index <= 2" :key="coupon.id" class="tag tag-lg tag-primary _ellipsis">满{{coupon.threshold}}减{{coupon.subtraction}}</span>
              </template>
            </div>
          </div>
          <a href="javascript:;">
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <!-- 有活动时才显示活动栏 -->
        <div v-if="product.activity" class="content-block-title _border _flex-start _flex-align-start">
          <div class="title">
            活动
          </div>
          <div class="state-active">
            <span class="tag tag-primary _solid _ellipsis">{{product.activity.label}}</span>
            <div class="text text-primary">
              <router-link :to="{name:'Activity', params:{activityId: product.activity.id, type: product.activity.type}}" class="text-primary">{{product.activity.comment}}</router-link>
            </div>
          </div>
        </div>

        <!-- 说明 -->
        <div @click="instructionVisible = true" class="content-block-title">
          <div class="item-left">
            <div class="title">
              说明
            </div>
            <!-- 是否包税 -->
            <div v-if="product.freeTax" class="mark">
              <span class="item">澳洲进口</span>|
              <span class="item">包邮</span>|
              <span class="item">包税</span>|
              <span class="item">不支持退换货</span>
            </div>
            <div v-else class="mark">
              <span class="item">包邮</span>|
              <span class="item">支持退换货</span>
            </div>
          </div>
          <a href="javascript:;">
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
      </div>
      <!-- 规格栏目 -->
      <div @click="specVisible = true" class="content-block-title mb-20">
        <div class="title">
          规格数量
        </div>
        <a href="javascript:;">
          <span v-if="product.hasSkus" class="text">{{product.checkedSku.attribute1}}，{{quantity}}件</span>
          <span v-else class="text">{{quantity}}件</span>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </div>
      <div v-if="product.hasEvaluate" @click="goEvaluation" class="list-evaluation">
        <div class="content-block-title _border">
          <div class="title">
            商品口碑
          </div>
          <a href="javascript:;" class="links">
            <span class="text">查看更多口碑</span>
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <template v-for="eva in evaluations">
          <div :key="eva.id" class="item-goods">
            <div class="author-column flex-between">
              <div class="item-left">
                <div class="author-avatar">
                  <img :src="eva.header" alt="avatar">
                </div>
                <div class="item-title">{{eva.name}}</div>
              </div>
              <div class="text">{{eva.evaluateTime|eva-time-filter}}</div>
            </div>
            <div class="item-text">
              {{eva.content}}
            </div>
            <div v-if="eva.imgs" class="media-multiple">
              <div class="item-media">
                <img v-for="img in eva.imgs" :key="img.path" :src="img.path">
              </div>
            </div>
            <!-- 回复在图片下面 -->
            <div v-if="eva.replyContent" class="item-reply">
              In Essence回复：{{eva.replyContent}}
            </div>
          </div>
        </template>
      </div>
      <div class="details-content">
        <div class="details-title">
          <em>-</em>商品详情
          <em>-</em>
        </div>
        <!-- 视频播放框 -->
        <div v-if="product.videoPath" style="padding:10px 0;">
          <video :src="product.videoPath" controls x5-playsinline="" playsinline="" webkit-playsinline="" :poster="product.banners[0].path" preload style="width:100%;height: auto;"></video>
        </div>
        <!-- 商品详情 -->
        <div v-html="product.detail"></div>
      </div>
    </div>

    <!-- 规格 -->
    <PopupDialog v-model="specVisible" title="选择规格与数量" :wrapStyle="{'height': '6.80666667rem'}">
      <div class="content-select-sku">
        <div class="item-goods item-horizontal">
          <div class="item-media">
            <img :src="product.banners[0].path">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis">{{product.checkedSku.name}}</div>
            <div class="item-subtitle">
              <span class="name">库存：</span>{{skuStock}}
            </div>
            <div class="item-flex-between item-bottom">
              <div class="price-area">
                <template v-if="isSkuPoint">
                  <span class="item-price size-lg">
                    <em>积分</em>{{product.checkedSku.saleCent}}</span>
                </template>
                <template v-else>
                  <span class="item-price size-lg">
                    <em>¥</em>{{product.checkedSku.salePrice}}</span>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div v-if="product.hasSkus">
          <div class="content-block-title">
            容量
          </div>
          <div class="tag-block">
            <!-- 遍历所有sku 与选中项相等的标红 -->
            <span v-for="sku in product.skus" @click="chooseSku(sku)" :key="sku.id" :class="{'_active': sku.id === product.checkedSku.id}" class="tag tag-xl">{{sku.attribute1}}</span>
          </div>
        </div>
        <div class="content-block-title">
          数量
        </div>
        <div class="modified">
          <!-- 是否可加减 -->
          <template v-if="skuCountable">
            <div @click="quantityMinus" :class="skuMinusClassObj()" class="minus">
              <svg class="svg-minus">
                <use xlink:href="#svg-minus"></use>
              </svg>
            </div>
            <div class="num">{{quantity}}</div>
            <div @click="quantityPlus" :class="skuPlusClassObj()" class="plus">
              <svg class="svg-add">
                <use xlink:href="#svg-add"></use>
              </svg>
            </div>
          </template>
          <template v-else>
            <div class="num">{{quantity}}</div>
          </template>

        </div>
      </div>
      <div slot="footer" class="bar bar-button bar-absolute-bottom">
        <a @click="specVisible = false" href="javascript:;" class="btn-normal btn-primary _solid btn-xxl">确定</a>
      </div>
    </PopupDialog>
    <!-- 说明 -->
    <PopupDialog v-model="instructionVisible" title="说明">
      <div>
        <div v-if="product.freeTax" class="list-state">
          <div class="item-goods">
            <div class="item-title">澳洲进口</div>
            <div class="item-subtitle">本产品为澳洲原装进口</div>
          </div>
          <div class="item-goods">
            <div class="item-title">包邮</div>
            <div class="item-subtitle">本产品支持包邮</div>
          </div>
          <div class="item-goods">
            <div class="item-title">包税</div>
            <div class="item-subtitle">本产品包税，税费商家承担</div>
          </div>
          <div class="item-goods">
            <div class="item-title">不支持退换货</div>
            <div class="item-subtitle">本产品为保税区发货，不支持退换货</div>
          </div>
          <div style="height:20px;"></div>
        </div>
        <div v-else class="list-state">
          <div class="item-goods">
            <div class="item-title">包邮</div>
            <div class="item-subtitle">本产品支持顺丰包邮</div>
          </div>
          <div class="item-goods">
            <div class="item-title">支持退换货</div>
            <div class="item-subtitle">不影响二次销售的产品，支持七天无理由退换货</div>
          </div>
          <div style="height:20px;"></div>
        </div>
      </div>
      <div slot="footer" class="bar bar-button bar-absolute-bottom">
        <a @click="instructionVisible = false" href="javascript:;" class="btn-normal btn-close btn-xxl">关闭</a>
      </div>
    </PopupDialog>

    <!-- 优惠券 -->
    <PopupDialog v-model="couponVisible" title="领取优惠券" :contentClass="{'dialog-coupons-wrap':true}" :wrapStyle="{'background': '#f4f4f4'}">
      <div>
        <div v-for="(coupon, $index) in product.coupons" :key="coupon.id + 'coupon'" :class="{
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
            <div class="item-inner">
              <div class="item-title _ellipsis">{{coupon.name}}</div>
              <div class="item-subtitle _ellipsis">
                {{coupon.effectiveDate}}
              </div>
              <div @click.stop="couponSwitchInfo(coupon,$index)" class="details-info">
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
    </PopupDialog>
  </div>
</template>
<script>
import moment from 'moment'
import axios from '@/configs/axios'
import Swiper from 'Swiper'
import { PopupDialog, Toast } from 'rocoui'
import routerMixin from '@/mixin/router'
import CartBar from './CartBar'
import {
  TIME_LIMITED,
  FULL_GIVEN,
  FULL_SUBTRACT,
  BUY_GIVEN,
  QUANTITY_LIMITED
} from '@/constants/activityType'
import * as PLACE_ORDER_TYPE from '@/constants/placeOrderType'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  components: {
    'cart-bar': CartBar,
    PopupDialog
  },
  data() {
    return {
      PLACE_ORDER_TYPE,
      TIME_LIMITED,
      FULL_GIVEN,
      FULL_SUBTRACT,
      BUY_GIVEN,
      QUANTITY_LIMITED,
      loaded: false,
      loading: false,
      product: null,
      swiperIndex: 0,
      swiperCount: 4,
      swiper: null,
      specVisible: false,
      instructionVisible: false,
      couponVisible: false,
      quantity: 1,
      now: +moment(),
      evaluations: null,
      timer: null,
      query: {
        pid: '',
        skuId: '',
        placeOrderType: '',
        activityId: ''
      }
    }
  },
  filters: {
    'eva-time-filter'(value) {
      return moment(value).format('YYYY.MM.DD HH:mm')
    }
  },
  created() {
    this.makeQuery()
    this.fetchProduct()
    this.fetchEva()
  },
  methods: {
    skuPlusClassObj() {
      return {
        _disabled: this.quantity >= this.skuStock || this.isQuantityUnadjustable
      }
    },
    skuMinusClassObj() {
      return { _disabled: this.quantity <= 1 || this.isQuantityUnadjustable }
    },
    makeQuery() {
      this.query = { ...this.$route.query }
      this.query.placeOrderType =
        this.$route.query.placeOrderType || PLACE_ORDER_TYPE.CART.value
    },
    fetchProduct() {
      this.loading = true
      let promise = axios
        .get(`/api/wap/product/${this.$route.params.pid}`, this.query)
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.product = res.data.data
            this.product.coupons &&
              this.product.coupons.length &&
              this.product.coupons.forEach((coupon) => {
                this.$set(coupon, 'textVisible', false)
              })
            this.loaded = true
            this.activeSwiper()
            // 限时购无权利时按购物车商品处理
            let placeOrderType = this.query.placeOrderType
            if (PLACE_ORDER_TYPE.CART.value === placeOrderType) {
              let product = this.product
              let act = product.activity
              if (!act.qualification) {
                this.query.placeOrderType = PLACE_ORDER_TYPE.CART.value
              }
            }

            if (this.timeLimitCountable) {
              this.countdown()
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
      Toast.loading('加载中...', promise)
    },
    fetchEva() {
      axios
        .get(`/api/wap/product/evaluate/${this.$route.query.skuId}`, {
          limit: 2,
          offset: 0
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.evaluations = res.data.data.rows
          }
        })
    },
    activeSwiper() {
      this.$nextTick(() => {
        let _this = this
        this.swiper = new Swiper(this.$refs.swiper, {
          autoplay: 5000,
          lazyLoading: true,
          lazyLoadingOnTransitionStart: true,
          lazyLoadingInPrevNext: true,
          lazyLoadingInPrevNextAmount: 2,
          pagination: '.swiper-pagination',
          onSlideChangeEnd: function(swiper) {
            _this.swiperIndex = swiper.activeIndex
          }
          // autoplay: 5000
        })
      })
    },
    chooseSku(sku) {
      if (sku.id === this.product.checkedSku.id) {
        return false
      }
      this.$router.replace({
        name: 'ProductDetail',
        params: { pid: this.$route.params.pid },
        query: { skuId: sku.id }
      })
    },
    quantityMinus() {
      if (this.isQuantityUnadjustable) {
        return false
      }
      // 订单类型是限时购或限量试用的按活动库存判断
      if (
        this.query.placeOrderType === PLACE_ORDER_TYPE.TIME_LIMITED.value ||
        this.query.placeOrderType === PLACE_ORDER_TYPE.QUANTITY_LIMITED.value
      ) {
        if (this.quantity >= this.product.activity.stock) {
          return false
        } else {
          this.quantity -= 1
        }
      } else {
        if (this.quantity <= 1) {
          return false
        } else {
          this.quantity -= 1
        }
      }
    },
    quantityPlus() {
      if (this.isQuantityUnadjustable) {
        return false
      }
      // 订单类型是限时购或限量试用的按活动库存判断
      if (
        this.query.placeOrderType === PLACE_ORDER_TYPE.TIME_LIMITED.value ||
        this.query.placeOrderType === PLACE_ORDER_TYPE.QUANTITY_LIMITED.value
      ) {
        if (this.quantity >= this.product.activity.stock) {
          return false
        } else {
          this.quantity += 1
        }
      } else {
        if (this.quantity >= this.product.checkedSku.stock) {
          return false
        } else {
          this.quantity += 1
        }
      }
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
            Toast.success('领取成功')
            coupon.isReceive = res.data.data.isReceive
            coupon.isUseUp = res.data.data.isUseUp
          } else if (res.data.code === '2') {
            coupon.isReceive = true
          } else if (res.data.code === '3') {
            coupon.isUseUp = true
          }
        })
      Toast.loading('正在领取...', promise)
    },
    goEvaluation() {
      this.$router.push({
        name: 'ProductEvaluation',
        params: {
          skuId: this.$route.query.skuId
        }
      })
    },
    countdown() {
      this.now = +moment()
      this.timer = setTimeout(() => {
        if (this.timeLimitCountable) {
          this.countdown()
        }
      }, 1000)
    },
    doFavorite() {
      let promise = axios
        .get(
          `/api/wap/collection/${this.$route.query.skuId}/${
            this.product.isCollection ? 'N' : 'Y'
          }`
        )
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.product.isCollection = !this.product.isCollection
          }
        })
      Toast.loading(
        `${this.product.isCollection ? '取消收藏' : '添加收藏'}`,
        promise
      )
    }
  },
  computed: {
    isQuantityUnadjustable() {
      return (
        this.query.placeOrderType === PLACE_ORDER_TYPE.FREE_TRIAL.value ||
        this.query.placeOrderType === PLACE_ORDER_TYPE.INVITE_GIFT.value ||
        this.query.placeOrderType === PLACE_ORDER_TYPE.UPGRADE_GIFT.value ||
        this.query.placeOrderType === PLACE_ORDER_TYPE.BIRTHDAY_GIFT.value ||
        this.query.placeOrderType === PLACE_ORDER_TYPE.HALF_PRICE_TRIAL.value ||
        this.query.placeOrderType === PLACE_ORDER_TYPE.UPGRADE_GOLD_CARD.value
      )
    },
    swiperIndicatorWord() {
      return `${this.swiperIndex + 1}/${this.product.banners.length}`
    },
    timeLimitWord() {
      try {
        let startTime = moment(this.product.activity.startTime)
        let endTime = moment(this.product.activity.endTime)
        if (startTime.isAfter()) {
          return '活动尚未开始'
        }
        if (endTime.isBefore()) {
          return '活动已结束'
        }
        // let now = +moment()
        let end = +endTime
        let diff = end - this.now
        let d = Math.floor(diff / 1000 / 60 / 60 / 24)
        let h = Math.floor((diff / 1000 / 60 / 60) % 24)
        let m = Math.floor((diff / 1000 / 60) % 60)
        let s = Math.floor((diff / 1000) % 60)
        return `<span class="text">距离活动结束</span>
              <em class="num">${d >= 10 ? d : '0' + d}</em>
              <span class="text">天</span>
              <em class="num">${h >= 10 ? h : '0' + h}</em>
              <span class="text">时</span>
              <em class="num">${m >= 10 ? m : '0' + m}</em>
              <span class="text">分</span>
              <em class="num">${s >= 10 ? s : '0' + s}</em>
              <span class="text">秒</span>`
      } catch (e) {
        console.error(e)
        return ''
      }
    },
    // 能否看到倒计时
    timeLimitColumn() {
      try {
        let activity = this.product.activity
        if (activity) {
          return (
            activity &&
            activity.type === TIME_LIMITED.value &&
            activity.qualification &&
            this.query.placeOrderType === PLACE_ORDER_TYPE.TIME_LIMITED.value
          )
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
    // 是否在活动时间内
    timeLimitCountable() {
      try {
        if (this.timeLimitColumn) {
          let startTime = moment(this.product.activity.startTime)
          let endTime = moment(this.product.activity.endTime)
          return startTime.isBefore(this.now) && endTime.isAfter(this.now)
        } else {
          return false
        }
      } catch (e) {
        console.error(e)
        return false
      }
    },
    isActivityTimeLimit() {
      return (
        this.product &&
        this.product.activity &&
        this.product.activity.type === TIME_LIMITED.value
      )
    },
    isActivityQuantityLimited() {
      return (
        this.product &&
        this.product.activity &&
        this.product.activity.type === QUANTITY_LIMITED.value
      )
    },
    skuCountable() {
      switch (this.query.placeOrderType) {
        case PLACE_ORDER_TYPE.FREE_TRIAL.value:
        case PLACE_ORDER_TYPE.INVITE_GIFT.value:
        case PLACE_ORDER_TYPE.UPGRADE_GIFT.value:
        case PLACE_ORDER_TYPE.BIRTHDAY_GIFT.value:
          return false
        default:
          return true
      }
    },
    skuStock() {
      let placeOrderType = this.query.placeOrderType
      let product = this.product
      let act = product.activity
      // 购物车的
      if (placeOrderType === PLACE_ORDER_TYPE.CART.value) {
        // 满赠 满减 买赠活动 且有资格的
        if (
          act &&
          act.qualification &&
          (act.type === FULL_GIVEN.value ||
            act.type === FULL_SUBTRACT.value ||
            act.type === BUY_GIVEN.value)
        ) {
          return act.stock
        }
      }
      // 限时购
      if (
        placeOrderType === PLACE_ORDER_TYPE.TIME_LIMITED.value &&
        act &&
        act.qualification
      ) {
        return act.stock
      }
      // 限量试用
      if (
        placeOrderType === PLACE_ORDER_TYPE.QUANTITY_LIMITED.value &&
        act &&
        act.qualification
      ) {
        return act.stock
      }
      return product.checkedSku.stock
    },
    skuPrice() {
      let placeOrderType = this.query.placeOrderType
      let product = this.product
      let act = product.activity
      switch (placeOrderType) {
        case PLACE_ORDER_TYPE.TIME_LIMITED.value:
          if (act.qualification) {
            return product.activityPrice
          } else {
            return product.checkedSku.salePrice
          }
        case PLACE_ORDER_TYPE.FREE_TRIAL.value:
        case PLACE_ORDER_TYPE.INVITE_GIFT.value:
        case PLACE_ORDER_TYPE.UPGRADE_GIFT.value:
        case PLACE_ORDER_TYPE.BIRTHDAY_GIFT.value:
          return 0
        case PLACE_ORDER_TYPE.HALF_PRICE_TRIAL.value:
          return product.salePrice
        case PLACE_ORDER_TYPE.QUANTITY_LIMITED.value:
        default:
          return product.checkedSku.salePrice
      }
    },
    isSkuPoint() {
      return this.query.placeOrderType === PLACE_ORDER_TYPE.CENT_EXCHANGE.value
    },
    computedActivityId() {
      if (this.product && this.product.activity) {
        return this.product.activity.id
      } else {
        return ''
      }
    }
  },
  beforeDestroy() {
    this.swiper && this.swiper.destroy()
    clearTimeout(this.timer)
  },
  beforeRouteUpdate(to, from, next) {
    // 重置
    this.swiper && this.swiper.destroy()
    this.loaded = false
    this.loading = false
    this.product = null
    this.swiperIndex = 0
    this.swiperCount = 4
    this.swiper = null
    this.specVisible = false
    this.instructionVisible = false
    this.couponVisible = false
    this.quantity = 1
    next()
    this.$nextTick(() => {
      this.makeQuery()
      this.fetchProduct()
      this.fetchEva()
    })
  }
}
</script>

