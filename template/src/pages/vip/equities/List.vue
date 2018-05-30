<template>
  <div class="wrap wrap-list">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{ routeInfo.title }}商品</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div v-if="isEmpty" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-result">icon</i>
          </div>
          <p>还没有{{ routeInfo.title }}商品</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <div v-else class="list-product list-column2">
        <div
          v-for="(item, index) in lists"
          :key="index"
          @click="goDetail(item)"
          class="item-goods">
          <div class="item-media">
            <!-- <img :src="item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg'" > -->
            <img v-lazy="{
              src: item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg',
              loading: 'static/images/lazyload/348x348.jpg',
              error: 'static/images/lazyload/348x348.jpg'
            }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{ item.name }} {{ item.attribute1 }}</div>
            <div class="item-subtitle _ellipsis">
              {{ item.subtitle }}
            </div>
            <div class="price-area">
              <div v-if="$route.params.type === 'member'" class="item-price">
                {{ item.saleCent }}积分
              </div>
              <div v-if="$route.params.type === 'halfPrice'" class="item-price">
                <em>¥</em>{{ item.activityPrice }}
              </div>
              <div v-if="$route.params.type === 'halfPrice'" class="item-price-original">
                <em>¥</em>{{ item.salePrice }}
              </div>
            </div>
          </div>
        </div>
        <!--/.item-goods 商品-->
      </div>
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img v-if="lists.length > 4" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
        </div>
      </infinite-loading>
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
      routeInfo: {},
      lists: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
    }
  },
  created () {
    this.getTypeCommodity()
  },
  methods: {
    // 判断是半价试用商品还是会员商品或是其他
    getTypeCommodity () {
      switch (this.$route.params.type) {
        case 'halfPrice':
          this.routeInfo = {
            api: `/api/wap/product/halffare`,
            title: '半价试用',
            orderType: 'HALF_PRICE_TRIAL'
          }
          break
        case 'member':
          this.routeInfo = {
            api: `/api/wap/memberVIP/vipSkuList`,
            title: '会员',
            orderType: 'CENT_EXCHANGE'
          }
          break
        default:
          break
      }
    },
    onInfinite: function () {
      var self = this
      let promise = axios.get(this.routeInfo.api, {
        offset: self.offset,
        limit: self.limit
      }).then((res) => {
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
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.id}&placeOrderType=${this.routeInfo.orderType}`
    }
  }
}
</script>

