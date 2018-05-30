<template>
  <div>
    <div v-if="isEmpty" class="tips-box">
      <div class="tips-no-result">
        <div class="icon-area">
          <i class="icon icon-no-collect">icon</i>
        </div>
        <p>还未收藏任何内容</p>
      </div>
      <!-- /.tips-no-result -->
    </div>
    <!-- /.tips-box -->
    <div v-else class="list-product list-column2">
      <div v-for="(item, index) in info" :key="index"
        @click="goCommodityRouter(item)" class="item-goods">
        <div class="item-media">
          <img v-lazy="{
            src: item.imgPath ? item.imgPath : 'static/images/m/img348x348.jpg',
            loading: 'static/images/m/img348x348.jpg',
            error: 'static/images/m/img348x348.jpg'
          }" alt="商品图片" class="lazy-img-fadein">
        </div>
        <div class="item-inner">
          <div class="item-title _ellipsis2">{{ item.name }}</div>
          <div class="item-subtitle _ellipsis">{{ item.subtitle }}</div>
          <div class="price-area">
            <div class="item-price"><em>¥</em>{{ item.activityPrice?item.activityPrice:item.salePrice }}</div>
            <span v-if="item.typeName" class="tag tag-sm tag-primary">{{ item.typeName }}</span>
            <span v-if="!item.valid" class="tag tag-sm tag-disabled">无效</span>
            <span v-if="item.valid && !item.stock" class="tag tag-sm tag-disabled">无货</span>
          </div>
        </div>
      </div>
      <!--/.item-goods 商品-->
      <infinite-loading :on-infinite="getCommodity" ref="commodityInfinite" spinner="circles" key="commodity">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img v-if="info.length > 2" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
        </div>
      </infinite-loading>
    </div>
    <!-- 收藏的商品end -->
  </div>
</template>

<script>
import { Toast, Modal } from 'rocoui'
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  data () {
    return {
      info: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false
    }
  },
  components: {
    InfiniteLoading
  },
  methods: {
    getCommodity: function () {
      var self = this
      let promise = axios.get('/api/wap/collection/skucollection', {
        offset: self.offset,
        limit: self.limit,
        useStatus: 'commodity'
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.info = self.info.concat(res.data.data.rows)
            self.$refs.commodityInfinite.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.commodityInfinite.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.info.length) {
            self.isEmpty = false
            self.$refs.commodityInfinite.$emit('$InfiniteLoading:complete')
          } else {
            self.isEmpty = true
            self.$refs.commodityInfinite.$emit('$InfiniteLoading:complete')
          }
        } else {
          Toast.fail(res.data.message)
          self.$refs.commodityInfinite.$emit('$InfiniteLoading:complete')
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 路由跳转
    goCommodityRouter (item) {
      if (item.valid) {
        if (item.type) {
          window.location.href = `index.html#/product/${item.productId}?skuId=${item.id}&activityId=${item.activityId}&placeOrderType=${item.type}`
        } else {
          window.location.href = `index.html#/product/${item.productId}?skuId=${item.id}`
        }
      } else {
        Modal.alert({body: '该商品不存在或已下架'})
      }
    }
  }
}
</script>
