<template>
  <div class="wrap wrap-list">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">商品列表</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div v-if="isEmpty" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-result">icon</i>
          </div>
          <p>没有可使用该优惠券的商品</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <div v-else class="list-product list-column2">
        <div v-for="(item, index) in lists" :key="index"
          @click="goDetail(item)" class="item-goods">
          <div class="item-media">
            <img v-lazy="{
              src: item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg',
              loading: 'static/images/lazyload/348x348.jpg',
              error: 'static/images/lazyload/348x348.jpg'
            }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{ item.name }}</div>
            <div class="item-subtitle _ellipsis">{{ item.subtitle }}</div>
            <div v-if="$route.query.skuType==='ALL'" class="price-area">
              <div class="item-price"><em>¥</em>{{ item.salePrice }}</div>
            </div>
            <div v-else class="price-area">
              <div class="item-price"><em>¥</em>{{ item.activityPrice ? item.activityPrice : item.salePrice }}</div>
              <div v-if="item.activityPrice" class="item-price-original"><em>¥</em>{{ item.salePrice }}</div>
            </div>
          </div>
        </div>
        <!--/.item-goods 商品-->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            <img v-if="lists.length > 5" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
          </div>
        </infinite-loading>
      </div>
      <!--返回顶部按钮-->
      <div class="float-window">
        <ScrollTop :container="'#scrollContent'"></ScrollTop>
      </div>
      <!-- /.float-window -->
    </div>
    <!-- /.content -->
  </div>
</template>

<script>
import routerMixin from '@/mixin/router'
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import ScrollTop from '@/components/ScrollTop'
import { Toast } from 'rocoui'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MineCouponCommodity',
  components: {
    InfiniteLoading,
    ScrollTop
  },
  data () {
    return {
      routeInfo: {},
      lists: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
    }
  },
  computed: {
    api () {
      return this.$route.query.skuType === 'ALL' ? '/api/wap/product/list' : '/api/wap/coupon/center/touse'
    },
    params () {
      let paramsAllCommodity = {
        offset: this.offset,
        limit: this.limit
      }
      let paramsPartCommodity = {
        couponId: this.$route.query.couponId,
        ...paramsAllCommodity
      }
      return this.$route.query.skuType === 'ALL' ? paramsAllCommodity : paramsPartCommodity
    }
  },
  methods: {
    onInfinite: function () {
      var self = this
      let promise = axios.get(self.api, self.params).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.lists = self.lists.concat(res.data.data.rows)
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.lists.length) {
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          } else {
            self.isEmpty = true
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        } else {
          Toast.fail(res.data.message)
          self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 点击某个商品跳到商品详情
    goDetail (item) {
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.id}`
    }
  }
}
</script>

