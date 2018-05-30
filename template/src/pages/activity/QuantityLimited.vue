<template>
  <div class="wrap wrap-list-limit-trial">
    <div class="content" id="scrollContent">
      <div class="banner-box">
        <img class="banner-img" src="static/images/banner-limit-trial.jpg" alt="banner图">
        <a href="javascript:;" @click="routerBack" class="back">
          <svg class="svg-arrow _left">
            <use xlink:href="#svg-arrow"></use>
          </svg>
        </a>
      </div>
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
            <div class="item-title _ellipsis">{{ item.name }}活动</div>
            <div class="item-subtitle _ellipsis">
              {{ item.subtitle }}
            </div>
            <!-- /.title -->
            <div class="item-flex-between item-align-center item-bottom">
              <div class="price-area">
                <div class="item-price size-lg"><em>¥</em>{{ item.salePrice }}</div>
              </div>
              <a href="javascript:;"
                v-if="item.progress === 100"
                class="btn-normal _solid btn-sm">已抢光</a>
              <a href="javascript:;"
                v-else
                @click="goDetail(item)"
                class="btn-normal btn-primary _solid btn-sm">立即购买</a>
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
      <!-- /.list-sale -->
      <div class="float-window">
        <ScrollTop :container="'#scrollContent'"></ScrollTop>
      </div>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading'
import ScrollTop from '@/components/ScrollTop'
import { Toast, Modal } from 'rocoui'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  components: {
    InfiniteLoading,
    ScrollTop
  },
  data () {
    return {
      activityInfo: {},
      lists: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
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
          this.activityInfo = res.data.data.activity
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
      if (this.activityInfo.hasJoinPermission) {
        this.$router.push({
          name: 'ProductDetail',
          params: { pid: item.productId },
          query: {
            skuId: item.skuId,
            activityId: this.$route.params.activityId,
            placeOrderType: 'QUANTITY_LIMITED'
          }
        })
      } else {
        Modal.alert({body: '您没有限量试用的权限'})
      }
    }
  }
}
</script>

