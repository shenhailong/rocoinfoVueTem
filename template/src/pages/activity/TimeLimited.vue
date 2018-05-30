<template>
  <div class="wrap wrap-list-sale">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{ typeName }}活动</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div class="time-countdown">
        <span class="text">距离活动结束</span>
        <em class="num">{{runTime.d}}</em>
        <span class="text">天</span>
        <em class="num">{{runTime.h}}</em>
        <span class="text">时</span>
        <em class="num">{{runTime.m}}</em>
        <span class="text">分</span>
        <em class="num">{{runTime.s}}</em>
        <span class="text">秒</span>
      </div>
      <!-- /.time-cuontdown 倒计时 -->
      <div class="list-sale">
        <div v-for="(item, index) in lists" :key="index" class="item-goods item-horizontal">
          <div class="item-media">
            <img v-lazy="{
              src: item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg',
              loading: 'static/images/lazyload/348x348.jpg',
              error: 'static/images/lazyload/348x348.jpg'
            }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis">{{ item.name }} {{ item.attribute1 }}</div>
            <div class="item-subtitle _ellipsis">
              {{ item.subtitle }}
            </div>
            <!-- /.title -->
            <div class="progress-colunm">
              <div class="progress">
                <div :style="{width: item.progress + '%'}" class="progress-bar"></div>
              </div>
              <div class="text">已售{{ item.progress }}%</div>
            </div>
            <!-- /.progress -->
            <div class="item-flex-between item-bottom">
              <div class="price-area">
                <div class="item-price size-lg"><em>¥</em>{{ item.activityPrice }}</div>
                <div class="item-price-original size-lg"><em>¥</em>{{ item.salePrice }}</div>
              </div>
              <a href="javascript:;"
                v-if="item.progress === 100 || (runTime.d === '00' && runTime.h === '00' && runTime.m === '00' && runTime.s === '00')"
                class="btn-normal _solid btn-sm">已抢光</a>
              <a href="javascript:;"
                v-else
                @click="goDetail(item)"
                class="btn-normal btn-primary _solid btn-sm">立即抢购</a>
            </div>
          </div>
          <!-- /.item-inner -->
        </div>
        <!--/.item-goods 水平摆放商品-->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            -已经到底了-
          </div>
        </infinite-loading>
      </div>
      <div class="float-window">
        <ScrollTop :container="'#scrollContent'"></ScrollTop>
      </div>
    </div>
  </div>
</template>

<script>
import routerMixin from '@/mixin/router'
import axios from 'axios'
import moment from 'moment'
import InfiniteLoading from 'vue-infinite-loading'
import ScrollTop from '@/components/ScrollTop'
import { Toast } from 'rocoui'
import runTime from '@/mixin/runTime'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin, runTime],
  components: {
    InfiniteLoading,
    ScrollTop
  },
  props: {
    typeName: {
      type: String
    }
  },
  data () {
    return {
      lists: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false,
      endTime: ''
    }
  },
  methods: {
    onInfinite: function () {
      var self = this
      let loadingProduct = axios.get(`/api/wap/activity/product/${this.$route.params.activityId}`, {
        params: {
          offset: self.offset,
          limit: self.limit
        }
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          this.endTime = moment(res.data.data.activity.endTime)

          if (res.data.data.page.rows.length) {
            self.total = res.data.data.page.total
            self.lists = self.lists.concat(res.data.data.page.rows)
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
      Toast.loading('加载中...', loadingProduct)
    },

    // 点击立即抢购跳到抢购详情
    goDetail (item) {
      this.$router.push({
        name: 'ProductDetail',
        params: { pid: item.productId },
        query: {
          skuId: item.skuId,
          activityId: this.$route.params.activityId,
          placeOrderType: 'TIME_LIMITED'
        }
      })
    }
  }
}
</script>

