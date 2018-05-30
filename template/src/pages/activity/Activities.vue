<template>
  <div class="wrap wrap-list">
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
      <div class="list-product list-column2">
        <div v-for="(item, index) in lists" :key="index" @click="goDetail(item)" class="item-goods">
          <div class="item-media">
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
              <div class="item-price"><em>¥</em>{{ item.salePrice }}</div>
              <span class="tag tag-sm tag-primary">{{ typeName }}</span>
            </div>
          </div>
        </div>
        <!--/.item-goods 商品-->
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more">
            <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
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
import axios from 'axios'
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
      axios.get(`/api/wap/activity/product/${this.$route.params.activityId}`, {
        params: {
          offset: self.offset,
          limit: self.limit
        }
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
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
    },
    // 点击某个商品跳到商品详情
    goDetail (item) {
      this.$router.push({
        name: 'ProductDetail',
        params: { pid: item.productId },
        query: { skuId: item.skuId, activityId: this.$route.params.activityId }
      })
    }
  }
}
</script>

