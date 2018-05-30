<template>
  <div class="wrap wrap-order-list">
    <div class="bar-box-top bar-absolute-top">
      <div class="bar bar-nav _border">
        <a href="javascript:;" @click="routerBackIndex" class="bar-item item-arrow">
          <svg class="svg-arrow _left">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <div class="bar-item">我的订单</div>
      </div>
      <!--/.bar-nav-->
      <div class="main-tab border-bottom">
        <nav class="main-tab-links">
          <div @click="changeOrderType(null)" class="item" :class="{'_active': currentType === null}">
            全部
          </div>
          <div @click="changeOrderType('PENDING_PAID')" class="item" :class="{'_active': currentType === 'PENDING_PAID'}">
            待付款
          </div>
          <div @click="changeOrderType('PENDING_DELIVER')" class="item" :class="{'_active': currentType === 'PENDING_DELIVER'}">
            待发货
          </div>
          <div @click="changeOrderType('PENDING_RECEIVE')" class="item" :class="{'_active': currentType === 'PENDING_RECEIVE'}">
            待收货
          </div>
          <div @click="changeOrderType('COMPLETED')" class="item" :class="{'_active': currentType === 'COMPLETED'}">
            待评价
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
            <i class="icon icon-no-order">icon</i>
          </div>
          <p>你还没有相关订单</p>
        </div>
        <!-- /.tips-no-result -->
      </div>
      <!-- /.tips-box -->
      <div v-else>
        <div v-for="(item, index) in orderInfo" :key="index"
          class="card card-order">
          <div class="card-header">
            <div class="item-left">订单编号：{{ item.orderCode }}</div>
            <!-- /.item-left -->
            <div class="item-right">
              {{ item.orderStatus === 'PENDING_PAID' && item.timeout ? '已取消' : ORDER_STATUS[item.orderStatus].label }}
            </div>
            <!--/.item-right -->
          </div>
          <!-- /.card-header -->
          <div @click="goRouter('Detail', item.orderId)" class="card-body">
            <div class=" item-goods item-horizontal item-flex-between">
              <div class="media-multiple">
                <div class="item-media" :class="{'item-media-multiple': item.itemQuantity > 1}">
                  <img v-for="(img, idx) in item.orderItems" :key="idx" v-lazy="{
                    src: img.skuImg ? img.skuImg : 'static/images/m/img348x348.jpg',
                    loading: 'static/images/m/img348x348.jpg',
                    error: 'static/images/m/img348x348.jpg'
                  }" alt="商品图片" class="lazy-img-fadein">
                </div>
                <div v-if="item.orderItems.length > 3" class="ellipsis">...</div>
              </div>
              <div v-if="item.orderItems.length === 1" class="item-title _ellipsis">
                {{ item.orderItems[0].skuName }}
              </div>
              <div class="item-align-center">
                <a href="javascript:;" class="item-sum">
                  共{{ item.itemQuantity }}件
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
                <span v-if="item.orderType === 'CASH'">￥{{ item.payAmount }}</span>
                <span v-else>{{ item.cent }}积分</span>
              </span>
            </div>
          </div>
          <!-- /.card-body -->
          <div class="card-footer _border-top">
            <div class="item-left">
              <span v-if="item.orderStatus === 'PENDING_PAID' && !item.timeout && item.timerFlag" class="text-primary">
                剩余付款时间{{ toTwo(item.mm) }}:{{ toTwo(item.ss) }}
              </span>
              <span v-if="item.timeout" class="text-primary">
                已过付款时间，交易关闭
              </span>
            </div>
            <div class="item-right">
              <!-- 待付款 -->
              <a href="javascript:;" v-if="item.orderStatus === 'PENDING_PAID' && !item.timeout"
                @click="goRouter('Detail', item.orderId, 'payment')"
                class="btn-normal btn-primary btn-sm _solid">去付款</a>
              <!-- 待发货、已取消和交易完成已评价 -->
              <a href="javascript:;"
                v-if="item.orderStatus === 'PENDING_DELIVER' || item.orderStatus === 'CANCELED' || item.orderStatus === 'EVALUATED'"
                @click="goRouter('Detail', item.orderId)"
                class="btn-normal btn-primary btn-sm _solid">查看详情</a>
              <!-- 待收货 -->
              <a href="javascript:;" v-if="item.orderStatus === 'PENDING_RECEIVE'"
                @click="goRouter('Detail', item.orderId)"
                class="btn-normal btn-primary btn-sm">查看物流</a>
              <a href="javascript:;" v-if="item.orderStatus === 'PENDING_RECEIVE'"
                @click="confirmReceivingGoods(item.orderId)"
                class="btn-normal btn-primary btn-sm _solid">确认收货</a>
              <!-- 限量试用已完成订单发布报告 -->
              <a href="javascript:;" v-if="item.hasReleaseReport"
                @click="goTrialReportRouter(item)"
                class="btn-normal btn-primary btn-sm _solid">发布报告</a>
              <!-- 交易完成未评价 -->
              <a href="javascript:;" v-if="item.orderStatus === 'COMPLETED'"
                @click="goRouter('Evaluate', item.orderId)"
                class="btn-normal btn-primary btn-sm _solid">评价晒单得积分</a>
            </div>
          </div>
        </div>
        <!--/.card -->
      </div>
      <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles" :key="infiniteKey">
        <span slot="no-results" style="display:none;"></span>
        <div class="tips-txt" slot="no-more">
          <img v-if="orderInfo.length > 2" class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片">
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
import moment from 'moment'
import { Toast, Modal } from 'rocoui'
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import ORDER_STATUS from '@/constants/orderStatus'
import ScrollTop from '@/components/ScrollTop'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  name: 'MineOrder',
  data () {
    return {
      currentType: null,
      orderInfo: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false,
      ORDER_STATUS,
      infiniteKey: 'ALL',
      timer: null
    }
  },
  components: {
    InfiniteLoading,
    ScrollTop
  },
  created () {
    this.currentType = this.$route.query.type
  },
  methods: {
    // 获取订单列表
    onInfinite: function () {
      var self = this
      let promise = axios.get(`/api/wap/member/orders/findOrders`, {
        offset: self.offset,
        limit: self.limit,
        status: self.currentType
      }).then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.rows.length) {
            self.total = res.data.data.total
            self.orderInfo = self.orderInfo.concat(res.data.data.rows)
            // 待付款订单倒计时
            self.orderInfo.forEach(item => {
              let leftTime = moment(item.orderTime).add(30, 'minutes') - moment(item.serverTime)
              if (leftTime > 0) {
                item.timerFlag = true
              } else {
                item.timerFlag = false
              }
              if (item.orderStatus === 'PENDING_PAID' && item.timerFlag) {
                item.mm = moment(leftTime).minute()
                item.ss = moment(leftTime).second()
                item.timer = setInterval(() => {
                  leftTime -= 1000
                  item.mm = moment(leftTime).minute()
                  item.ss = moment(leftTime).second()
                  this.$forceUpdate()
                  if (!item.mm && !item.ss) {
                    clearInterval(item.timer)
                    // 超时，交易关闭
                    item.timeout = true
                  }
                }, 1000)
              }
            })
            self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            self.offset += self.limit
            if (self.offset >= self.total) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
            self.isEmpty = false
          } else if (self.orderInfo.length) {
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
    toTwo(t) {
      return t > 9 ? t : '0' + t
    },

    // 切换订单类型
    changeOrderType (type) {
      this.currentType = type
      this.$router.push({
        name: 'MineOrder',
        query: {type}
      })
      this.orderInfo = []
      this.offset = 0
      if (this.infiniteKey === 'ALL') {
        this.infiniteKey = '_ALL'
      } else {
        this.infiniteKey = 'ALL'
      }
    },
    // 路由跳转
    goRouter (name, orderId, type) {
      this.$router.push({
        name: 'MineOrder' + name,
        params: { orderId },
        query: { type }
      })
    },
    // 路由跳转-发布报告
    goTrialReportRouter (item) {
      this.$router.push({
        name: 'MineOrderTrialReport',
        params: { orderId: item.orderId },
        query: { productId: item.orderItems[0].productId, skuId: item.orderItems[0].skuId }
      })
    },
    // 待收货订单确认收货
    confirmReceivingGoods (orderId) {
      let self = this
      Modal.confirm({
        body: '确定所有包裹都已收到？',
        okCb: function() {
          axios.get('/api/wap/member/orders/confirmReceipt', { orderId })
          .then(res => {
            if (res.data.code === CODE_SUCCESS) {
              self.orderInfo = []
              self.offset = 0
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
            }
          })
        }
      })
    },
    routerBackIndex () {
      this.$router.push({
        name: 'Index'
      })
    }
  },
  beforeDestroy() {
    this.orderInfo.forEach(item => {
      clearInterval(item.timer)
    })
  }
}
</script>

