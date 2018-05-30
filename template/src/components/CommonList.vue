<template>
  <div class="wrap wrap-list">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:history.back();" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{$route.query.title}}</div>
    </div>

    <div class="content" id="scrollContent">
      <div class="list-product list-column2">
        <div class="item-goods" v-for="(items) in lists" :key="items.id" @click="goDetail(items)">
          <div class="item-media">
            <img v-lazy="{
            src: items.imgPath ? items.imgPath : 'static/images/lazyload/348x348.jpg',
            loading: 'static/images/lazyload/348x348.jpg',
            error: 'static/images/lazyload/348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis2">{{items.name}}</div>
            <div class="item-subtitle _ellipsis">
              {{items.subtitle}}&ensp;
            </div>
            <div class="price-area">
              <div class="item-price" v-if="items.type === activityType.TIME_LIMITED.value">
                <em>¥</em>{{items.activityPrice}}
              </div>
              <div class="item-price" v-else>
                <em>¥</em>{{items.salePrice}}
              </div>
              <div class="item-price-original" v-if="items.type === activityType.TIME_LIMITED.value">
                <em>¥</em>{{items.salePrice}}
              </div>

            </div>
          </div>
        </div>

      </div>
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
        </div>
      </infinite-loading>
    </div>
    <ScrollTop :container="'#scrollContent'"></ScrollTop>
  </div>
</template>

<script type="text/ecmascript-6">
import ScrollTop from './ScrollTop'
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { Toast } from 'rocoui'
import * as activityType from '@/constants/activityType'
export default {
  data() {
    return {
      activityType,
      lists: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
    }
  },
  components: {
    InfiniteLoading,
    ScrollTop
  },
  methods: {
    // 跳转详情页
    goDetail(items) {
      let type = items.activityType === 'QUANTITY_LIMITED' ? 'CART' : items.activityType
      this.$router.push({
        name: 'ProductDetail',
        params: { pid: items.productId },
        query: { skuId: items.id, activityId: items.activityId, placeOrderType: type }
      })
    },
    onInfinite: function () {
      var self = this
      axios.get(this.api, {
        params: {
          offset: self.offset,
          limit: self.limit
        }
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
    }
  },
  computed: {
    api() {
      let url = ''
      switch (this.$route.query.from) {
        case 'like':
          url = '/api/wap/product/like'
          break
        case 'new':
          url = '/api/wap/recommendations?module=NEW_PRODUCTS'
          break
      }
      return url
    }
  }
}
</script>

