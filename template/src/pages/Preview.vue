<template>
  <div v-if="loaded" class="wrap wrap-details">
    <div class="bar bar-tool bar-absolute-bottom">
      <a href="javascript:;" class="bar-item bar-cart">
        <span class="tab-icon">
          <svg class="svg-cart">
            <use xlink:href="#svg-cart" />
          </svg>
          <span class="tab-text">购物车</span>
          <span class="badge">223</span>
        </span>
      </a>
      <!-- 选中状态在svg-heart后加class[_active] -->
      <a href="javascript:;" class="bar-item bar-collect">
        <span class="tab-icon">
          <svg class="svg-heart">
            <use xlink:href="#svg-heart" />
          </svg>
          <span class="tab-text">收藏</span>
        </span>
      </a>
      <div class="bar-item bar-item-button _cloumn2">
        <a class="btn-normal _solid btn-orange" href="javascript:;">加入购物车</a>
        <a class="btn-normal _solid btn-primary" href="javascript:;">去结算</a>
      </div>
    </div>
    <div class="content content-details">
      <a href="javascript:;" class="back">
        <svg class="svg-arrow _left">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
        </svg>
      </a>
      <!-- Swiper -->
      <div ref="swiper" class="swiper-container swiper-container-details">
        <div class="swiper-wrapper">
          <template v-for="banner in product.banners">
            <div :key="banner.path" class="swiper-slide">
              <img :src="banner.path" alt="详情图">
            </div>
          </template>
        </div>
        <div class="pagination">{{swiperIndicatorWord}}</div>
      </div>

      <div class="details-box">
        <div class="item-title _ellipsis">{{product.name}}</div>
        <div class="item-subtitle _ellipsis">{{product.promotion}}</div>
        <div class="item-subtitle-state _ellipsis2">
          {{product.subtitle}}
        </div>
        <div class="item-flex-between price-box">
          <div class="price-area">
            <div class="item-price size-lg">
              <em>¥</em>{{product.salePrice}}</div>
            <span v-if="product.activityPrice" class="tag tag-lg tag-member flex flex-align-center">
              <svg class="svg-member-circle">
                <use xlink:href="#svg-member-circle"></use>
              </svg>
              会员专享价￥{{product.activityPrice}}
            </span>
          </div>
          <!-- <div class="item-subtitle">销量19999</div> -->
        </div>
      </div>
      <div class="content-block-title-box mb-20">
        <!-- 有优惠券的显示领券栏 -->
        <div v-if="product.coupons" @click="couponVisible = true" class="content-block-title _border">
          <div class="item-left">
            <div class="title">
              领券
            </div>
            <template v-for="(coupon, $index) in product.coupons">
              <!-- 只显示前三个 -->
              <span v-if="$index <= 2" :key="coupon.id" class="tag tag-lg tag-primary _ellipsis">{{coupon.name}}</span>
            </template>
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
              <a href="javascript:;" class="text-primary">{{product.activity.comment}}</a>
            </div>
          </div>
        </div>

        <!-- 说明 -->
        <div class="content-block-title">
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
              <span class="item">澳洲进口</span>|
              <span class="item">包邮</span>|
              <span class="item">不支持退换货</span>
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
      <div class="content-block-title mb-20">
        <div class="title">
          规格数量
        </div>
        <a href="javascript:;">
          <span class="text">{{product.attribute}}，{{number}}件</span>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
      </div>
      <div v-if="evaluations" class="list-evaluation">
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
              {{eva.replyContent}}
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
  </div>
</template>
<script>
import moment from 'moment'
import axios from '@/configs/axios'
import Swiper from 'Swiper'
import { Toast } from 'rocoui'
import CODE_SUCCESS from '@/constants/responseCode'
import qs from '@/utils/qs'
export default {
  data() {
    return {
      loaded: false,
      loading: false,
      product: null,
      swiperIndex: 0,
      swiperCount: 4,
      swiper: null,
      specVisible: false,
      instructionVisible: false,
      couponVisible: false,
      number: 1,
      now: +moment(),
      evaluations: null,
      skuId: null,
      pid: null
    }
  },
  filters: {
    'eva-time-filter'(value) {
      return moment(value).format('YYYY.MM.DD HH:mm')
    }
  },
  created() {
    this.skuId = qs()['skuId']
    this.pid = qs()['pid']
    this.fetchProduct()
  },
  methods: {
    fetchProduct() {
      this.loading = true
      let promise = axios
        .get(`/adm/api/product/preview/${this.pid}`, {
          skuId: this.skuId
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.product = res.data.data
            this.loaded = true
            this.activeSwiper()
          }
        })
        .finally(() => {
          this.loading = false
        })
      Toast.loading('加载中...', promise)
    },
    activeSwiper() {
      this.$nextTick(() => {
        let _this = this
        this.swiper = new Swiper(this.$refs.swiper, {
          pagination: '.swiper-pagination',
          onSlideChangeEnd: function(swiper) {
            _this.swiperIndex = swiper.activeIndex
          }
          // autoplay: 5000
        })
      })
    }
  },
  computed: {
    swiperIndicatorWord() {
      return `${this.swiperIndex + 1}/${this.product.banners.length}`
    }
  },
  beforeDestroy() {
    this.swiper && this.swiper.destroy()
  }
}
</script>

