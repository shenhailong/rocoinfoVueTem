<template>
  <div class="wrap wrap-coupons">
    <div class="bar-box-top bar-absolute-top">
      <div class="bar bar-nav _border">
        <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
          <svg class="svg-arrow _left">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <div class="bar-item">优惠券</div>
      </div>
      <!--/.bar-nav-->
      <div class="main-tab">
        <nav class="main-tab-links">
          <div @click="changeTab('NOT_USED')" :class="['item', {'_active':currentType==='NOT_USED'}]">
            未使用
          </div>
          <div @click="changeTab('USED')" :class="['item', {'_active':currentType==='USED'}]">
            已使用
          </div>
          <div @click="changeTab('EXPIRED')" :class="['item', {'_active':currentType==='EXPIRED'}]">
            已失效
          </div>
        </nav>
      </div>
      <!-- /.main-tab -->
    </div>
    <!-- /.bar-box-top -->
    <div class="content" id="scrollContent">
      <div v-if="isEmpty" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-coupons">icon</i>
          </div>
          <p>没有你要的优惠券</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <!-- /.tips-box -->
      <div v-else class="coupons-viewbox">
        <div v-for="(item, index) in info" :key="index"
          class="list-coupons" :class="{'coupons-expried':currentType!=='NOT_USED'}">
          <svg class="svg-coupons">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-coupons"></use>
          </svg>
          <!-- 选中状态标识 -->
          <div class="select-tag">
            <svg class="svg-check">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-check"></use>
            </svg>
          </div>
          <!-- 已使用/已失效状态标识-->
          <div class="disabled-img">
            <span class="text">{{ currentType==='USED'?'已使用':'已失效' }}</span>
          </div>
          <div class="coupons-body">
            <div class="coupons">
              <div class="item-price"><em>¥</em>{{ item.subtraction }}</div>
              <div class="text">满{{ item.threshold }}可用</div>
            </div>
            <!-- /.coupons-bg -->
            <div class="item-inner">
              <div class="item-title _ellipsis">{{ item.name }}</div>
              <div class="item-subtitle">
                {{ item.effectStartdate }}至{{ item.effectEnddate }}
              </div>
              <div class="details-info">
                <span class="text _ellipsis">{{ item.note }}</span>
                <svg v-show="calcWords(item.note)>21" @click="showCouponDetails(item)" class="svg-arrow"
                  :class="item.isCollapse ? '_down' : '_up'">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
                </svg>
              </div>
            </div>
            <!-- /.item-inner -->
            <div class="item-align-center">
              <a href="javascript:;" @click="goRouter(item)" class="btn-normal btn-primary btn-xs">立即使用</a>
            </div>
          </div>
          <!-- /.coupons-body -->
          <div class="coupons-footer" :class="{disB:!item.isCollapse}">{{ item.note }}</div>
          <!-- /.coupons-footer -->
        </div>
        <!-- list-coupons -->
      </div>
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles" :key="infiniteKey">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img v-if="info.length > 5" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
        </div>
      </infinite-loading>
      <div class="float-window">
        <ScrollTop :container="'#scrollContent'"></ScrollTop>
      </div>
      <!--返回顶部按钮-->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import { Toast } from 'rocoui'
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import ScrollTop from '@/components/ScrollTop'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MineCoupon',
  data () {
    return {
      currentType: 'NOT_USED',
      info: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false,
      infiniteKey: 'ALL'
    }
  },
  components: {
    InfiniteLoading,
    ScrollTop
  },
  methods: {
    onInfinite: function () {
      var self = this
      let promise = axios.get('/api/wap/coupon/mycoupons', {
        offset: self.offset,
        limit: self.limit,
        useStatus: self.currentType
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.info = self.info.concat(res.data.data.rows)
            self.info.forEach(item => {
              item.isCollapse = true
            })
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.info.length) {
            self.isEmpty = false
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

    // 切换tab
    changeTab (type) {
      this.currentType = type
      this.info = []
      this.offset = 0
      if (this.infiniteKey === 'ALL') {
        this.infiniteKey = '_ALL'
      } else {
        this.infiniteKey = 'ALL'
      }
    },
    // 计算优惠券描述字符数
    calcWords (val) {
      if (val) {
        return val.replace(/[\u0391-\uFFE5]/g, 'aa').length
      }
    },
    // 显示优惠券详情
    showCouponDetails (item) {
      item.isCollapse = !item.isCollapse
      this.$forceUpdate()
    },
    // 立即使用跳转路由
    goRouter (item) {
      this.$router.push({
        name: 'MineCouponCommodity',
        query: {
          couponId: item.id,
          skuType: item.applySkuType
        }
      })
    }
  }
}
</script>

