<template>
  <div class="wrap wrap-list-sale">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">赠品</div>
    </div>
    <!--/.bar-nav-->

    <div class="content" id="scrollContent">
      <div class="list-gifts">
        <div v-for="(item, index) in giftsList" :key="index" class="item-goods item-horizontal">
          <div class="item-media">
            <img v-lazy="{
              src: item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg',
              loading: 'static/images/lazyload/348x348.jpg',
              error: 'static/images/lazyload/348x348.jpg'
            }" alt="avatar" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis">{{ item.name }} {{ item.attribute }}</div>
            <div class="item-subtitle _ellipsis">{{ item.subtitle }}</div>
            <!-- /.title -->
            <div class="item-flex-between item-align-end item-bottom">
              <div class="item-subtitle _ellipsis">
                获赠时间：{{ item.obtainTime }}
              </div>
              <a href="javascript:;"
                v-if="item.status === 'UNRECEIVED'"
                @click="obtainGifts(item)"
                class="btn-normal btn-primary _solid btn-sm">去领取</a>
              <a href="javascript:;" v-else class="btn-normal _solid btn-sm">已领取</a>
            </div>
          </div>
          <!-- /.item-inner -->
        </div>
        <!--/.item-goods 水平摆放商品-->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            <span v-if="giftsList.length > 7">-已经到底了-</span>
          </div>
        </infinite-loading>
      </div>
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
  data () {
    return {
      giftsList: [],
      offset: 0,
      limit: 10,
      total: 0
    }
  },
  components: {
    InfiniteLoading,
    ScrollTop
  },
  methods: {
    // 获取赠品列表
    onInfinite: function () {
      var self = this
      let promise = axios.get('/api/wap/activity/invites/getGivenRecords', {
        offset: self.offset,
        limit: self.limit
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.giftsList = self.giftsList.concat(res.data.data.rows)
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          } else if (self.giftsList.length) {
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          } else {
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        } else {
          Toast.fail(res.data.message)
          self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 去领取赠品
    obtainGifts (item) {
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.skuId}&recordId=${item.recordId}&placeOrderType=INVITE_GIFT`
    }
  }
}
</script>

