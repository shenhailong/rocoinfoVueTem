<template>
  <div class="wrap wrap-order-list">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">退款售后</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div v-if="isEmpty" class="tips-box">
        <div class="tips-no-result">
          <div class="icon-area">
            <i class="icon icon-no-order">icon</i>
          </div>
          <p>你还没有售后订单</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <!-- /.tips-box -->
      <div v-else v-for="(item, index) in afterSaleInfo" :key="index"
        class="card card-order">
        <div class="card-header">
          <div class="item-left">订单编号：{{ item.orderCode }}</div>
          <!-- /.item-left -->
          <div class="item-right">
            <a href="javascript:;" @click="goRouter(item)" class="btn-normal btn-primary btn-sm">
              {{ item.status==='REFUNDED' ? '退款' : '售后' }}进度
            </a>
          </div>
          <!--/.item-right -->
        </div>
        <!-- /.card-header -->
        <div class="card-body">
          <div @click="goRouter(item)" class=" item-goods item-horizontal item-flex-between">
            <div class="media-multiple">
              <div class="item-media" :class="{'item-media-multiple': item.itemQuantity > 1}">
                <img v-for="(img, idx) in item.items" :key="idx" v-lazy="{
                  src: img.img ? img.img : 'static/images/m/img348x348.jpg',
                  loading: 'static/images/m/img348x348.jpg',
                  error: 'static/images/m/img348x348.jpg'
                }" alt="商品图片" class="lazy-img-fadein">
              </div>
              <div v-if="item.items.length > 3" class="ellipsis">...</div>
            </div>
            <div v-if="item.items.length === 1" class="item-title _ellipsis">
                {{ item.items[0].skuName }}
              </div>
            <div class="item-align-center">
              <a href="javascript:;" class="item-sum">
                共{{ item.totalQuantity }}件
              </a>
              <a href="javascript:;">
                <svg class="svg-arrow _right">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
                </svg>
              </a>
            </div>
          </div>
          <!--/.item-horizontal 水平摆放商品-->
          <div class="item-total text-right">
            商品总额：<span class="item-price">
              <span v-if="item.orderType === 'CASH'">￥{{ item.amount }}</span>
              <span v-else>{{ item.amount }}积分</span>
            </span>
          </div>
        </div>
        <!-- /.card-body -->
      </div>
      <!--/.card -->
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img v-if="afterSaleInfo.length > 3" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
        </div>
      </infinite-loading>
      <div class="float-window">
        <ScrollTop :container="'#scrollContent'"></ScrollTop>
      </div>
      <!-- /.float-window -->
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
  name: 'MineAfterSale',
  data () {
    return {
      afterSaleInfo: [],
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
    onInfinite: function () {
      var self = this
      let promise = axios.get(`/api/wap/aftersale`, {
        offset: self.offset,
        limit: self.limit
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.afterSaleInfo = self.afterSaleInfo.concat(res.data.data.rows)
            // 计算商品总数
            self.afterSaleInfo.forEach(item => {
              item.totalQuantity = self.getSum(item.items)
            })
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.afterSaleInfo.length) {
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
    // 加总方法
    getSum (arr) {
      let sum = 0
      let i = arr.length
      while (i--) {
        sum += arr[i].quantity
      }
      return sum
    },
    // 路由跳转
    goRouter (item) {
      this.$router.push({
        name: 'MineOrderAfterSaleProgress',
        params: { orderId: item.afterSaleId },
        query: { type: item.status }
      })
    }
  }
}
</script>

