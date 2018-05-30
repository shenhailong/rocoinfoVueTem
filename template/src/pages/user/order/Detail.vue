<template>
  <div class="wrap wrap-order">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">订单详情</div>
    </div>
    <!--/.bar-nav-->
    <div class=" disN bar bar-tool bar-absolute-bottom flex-center">
      <div class="text-primary">已过付款时间，交易关闭</div>
    </div>
    <!--/.bar-tool-->
    <div v-if="orderDetail.orderStatus !== 'CANCELED' || orderDetail.timeout" class="bar bar-tool bar-absolute-bottom">
      <div class="bar-item">
        <span v-if="orderDetail.orderStatus === 'PENDING_PAID' && !orderDetail.timeout && hasNoTimer" class="text-primary">
          剩余付款时间{{ toTwo(orderDetail.mm) }}:{{ toTwo(orderDetail.ss) }}
        </span>
        <span v-if="orderDetail.timeout" class="text-primary">
          已过付款时间，交易关闭
        </span>
      </div>
      <div class="bar-item button-line bar-button-small">
        <!-- 待付款订单 -->
        <!-- 待发货订单 -->
        <a href="javascript:;" v-if="(orderDetail.orderStatus === 'PENDING_PAID' && !orderDetail.timeout) || orderDetail.orderStatus === 'PENDING_DELIVER'" @click="cancelOrder" class="btn-normal btn-sm btn-primary">取消订单</a>
        <a href="javascript:;" v-if="orderDetail.orderStatus === 'PENDING_PAID' && !orderDetail.timeout" @click="choosePayment" class="btn-normal _solid btn-sm btn-primary">去付款</a>
        <!-- 待收货 -->
        <a href="javascript:;" v-if="orderDetail.orderStatus === 'PENDING_RECEIVE'" @click="confirmReceivingGoods" class="btn-normal _solid btn-sm btn-primary">确认收货</a>
        <a href="javascript:;" v-if="orderDetail.hasReleaseReport" class="btn-normal btn-sm btn-primary">发布报告</a>
        <!-- 交易完成未评价 -->
        <a href="javascript:;" v-if="orderDetail.orderStatus === 'COMPLETED'" @click="goRouter('Evaluate')" class="btn-normal _solid btn-sm btn-primary">评价晒单</a>
      </div>
      <!-- /.bar-button-small -->
    </div>
    <!--/.bar-tool-->
    <div class="content">
      <div class="content-block-title _border">
        <div class="title">订单编号：{{ orderDetail.orderCode }}</div>
        <div v-if="orderDetail.orderStatus === 'PENDING_PAID' && orderDetail.timeout" class="text text-grey">
          已取消
        </div>
        <div v-else class="text text-grey">
          {{ ORDER_STATUS[orderDetail.orderStatus] ? ORDER_STATUS[orderDetail.orderStatus].label : '' }}
        </div>
      </div>
      <!-- /.content-block-title -->
      <div class="content-block-title _border">
        <div class="item-inner">
          <div class="user-info text-space">
            {{ orderDetail.receiverName }}
            <span>{{ orderDetail.receiverMobile }}</span>
          </div>
          <div class="flex flex-align-center user-address ">
            <svg class="svg-location">
              <use xlink:href="#svg-location" />
            </svg>
            <div class="address _ellipsis2">{{ orderDetail.receiverAddress }}</div>
          </div>
        </div>
      </div>
      <!-- /.content-block-title -->
      <div class="space-20"></div>

      <div v-for="(item, index) in orderDetail.packages" :key="index">
        <div class="content-block-title" :class="{'_border':!item.expressType}">
          <div class="flex title ">
            <span v-if="orderDetail.packages.length > 1" class="tag tag-primary _ellipsis">包裹{{ index + 1 }}</span>
            <span class="text">
              <span v-if="item.expressType">{{ item.expressType }}：{{ item.expressNo }}</span>
              <span v-else>暂无物流信息</span>
            </span>
          </div>
        </div>
        <!-- /.content-block-title -->
        <div v-if="item.expressFlows && item.expressFlows.length > 0" @click="goRouter('Logistics', item, orderDetail.packages.length, index)" class="content-block-title flex-align-start _border">
          <div class="logistic-info text">
            {{ item.expressFlows[item.expressFlows.length-1].flowInfo }}
          </div>
          <a href="javascript:;" class="text">
            <svg class="svg-arrow _right">
              <use xlink:href="#svg-arrow" />
            </svg>
          </a>
        </div>
        <!-- /.content-block-title -->
        <div :id="'listOrder'+index" class="list-order list-order-transition" :style="{'max-height':(3*2.55) + 'rem'}">
          <div v-for="orderItem in item.orderItems" :key="orderItem.orderItemId" class="list-order-item">
            <div v-if="!orderDetail.giftFlag" class="item-goods item-horizontal">
              <div class="item-media">
                <img v-lazy="{
                  src: orderItem.skuImg ? orderItem.skuImg : 'static/images/m/img348x348.jpg',
                  loading: 'static/images/m/img348x348.jpg',
                  error: 'static/images/m/img348x348.jpg'
                }" alt="商品图片" class="lazy-img-fadein">
              </div>
              <div class="item-inner">
                <div class="item-flex-between">
                  <div class="item-title _ellipsis">{{ orderItem.skuName }}</div>
                  <template v-if="orderDetail.orderStatus === 'COMPLETED' || orderDetail.orderStatus === 'EVALUATED'">
                    <a href="javascript:;" v-if="orderItem.afterStatus" @click="goProgressRouter(orderItem)" class="btn-normal btn-primary btn-xxs _solid">
                      {{ AFTER_SALES_STATUS[orderItem.afterStatus].status }}
                    </a>
                    <a href="javascript:;" v-else @click="goRouter('AfterSaleApply', orderItem)" class="btn-normal btn-primary btn-xxs _solid">申请售后</a>
                  </template>
                </div>
                <div v-if="orderItem.attribute" class="item-subtitle-sku">
                  <span class="name">规格：</span>{{ orderItem.attribute }}
                </div>
                <div class="item-flex-between item-bottom">
                  <span class="item-price">
                    <span v-if="orderDetail.orderType === 'CASH'">
                      <em>¥</em>{{ orderItem.salePrice }}</span>
                    <span v-else>积分{{ orderItem.cent }}</span>
                  </span>
                  <div class="item-count">x{{ orderItem.quantity }}</div>
                </div>
              </div>
              <!-- /.item-inner -->
            </div>
            <!--/.item-horizontal 水平摆放商品-->
            <div v-else class="item-goods-gift item-goods item-horizontal">
              <div class="item-media">
                <img v-lazy="{
                  src: orderItem.skuImg ? orderItem.skuImg : 'static/images/m/img348x348.jpg',
                  loading: 'static/images/m/img348x348.jpg',
                  error: 'static/images/m/img348x348.jpg'
                }" alt="商品图片" class="lazy-img-fadein">
              </div>
              <div class="item-inner">
                <div class="item-flex-between">
                  <div class="item-title _ellipsis">{{ orderItem.skuName }}</div>
                  <a href="javascript:;" v-if="orderDetail.orderStatus === 'COMPLETED' || orderDetail.orderStatus === 'EVALUATED'" @click="goRouter('AfterSaleApply', orderItem)" class="btn-normal btn-primary btn-xxs _solid">申请售后</a>
                </div>
                <div v-if="orderItem.attribute" class="item-subtitle-sku">
                  <span class="name">规格：</span>{{ orderItem.attribute }}
                </div>
                <div class="item-flex-between item-bottom">
                  <span class="tag tag-primary _solid">赠品</span>
                  <div class="item-count">x{{ orderItem.quantity }}</div>
                </div>
              </div>
              <!-- /.item-inner -->
            </div>
            <!--/.item-goods-gift 水平摆放商品-->
          </div>
          <!-- /.list-order-item -->
        </div>
        <!-- /.list-order -->
        <div v-if="item.orderItems.length > 3" class="btn-show-all">
          <span v-if="item['spreadFlag' + index]" @click="close(item, index)">
            收起
            <svg class="svg-arrow _up">
              <use xlink:href="#svg-arrow" />
            </svg>
          </span>
          <span v-else @click="open(item, index)">
            查看全部商品
            <svg class="svg-arrow _down">
              <use xlink:href="#svg-arrow" />
            </svg>
          </span>
        </div>
        <div class="space-20"></div>
      </div>

      <div v-if="orderDetail.orderType === 'CASH'" class="content-block-title _border">
        <div class="title">发票信息</div>
        <div v-if="orderDetail.bonded || !orderDetail.payAmount" class="text">保税区及特殊商品暂不可开发票</div>
        <div v-else class="text">{{ orderDetail.hasInvoice ? '电子普通发票' : '不要发票' }}</div>
      </div>
      <!-- /.content-block-title -->
      <div v-if="orderDetail.hasInvoice" class="content-block-title _border">
        <div class="title">发票抬头</div>
        <div class="item-right">
          <span class="text _ellipsis">{{ orderDetail.invoiceHeader }}</span>
        </div>
      </div>
      <!-- /.content-block-title -->
      <div v-if="orderDetail.hasInvoice" class="content-block-title _border">
        <div class="title">发票内容</div>
        <div class="item-right">
          <span class="text _ellipsis">商品详情</span>
        </div>
      </div>
      <!-- /.content-block-title -->
      <div class="space-20"></div>
      <div class="content-block-title _border">
        <div class="title">{{ orderDetail.orderType === 'CENT' ? '兑换' : '下单' }}时间</div>
        <div class="text">{{ orderDetail.orderTime }}</div>
      </div>
      <!-- /.content-block-title -->
      <div v-if="orderDetail.payWay" class="content-block-title">
        <div class="title">支付方式</div>
        <div class="text">{{ PAY_WAY[orderDetail.payWay].label }}</div>
      </div>
      <!-- /.content-block-title -->
      <div class="space-20"></div>
      <div class="content-block-title _border">
        <div class="title">商品金额</div>
        <div v-if="orderDetail.orderType === 'CENT'" class="text">{{ orderDetail.cent }}积分</div>
        <div v-else class="text">￥{{ orderDetail.amount }}</div>
      </div>
      <!-- /.content-block-title -->
      <div class="content-block-title _border">
        <div class="flex title">
          <span class="text">运费</span>
          <span class="tag tag-primary _ellipsis">全场包邮</span>
        </div>
        <div class="text">+￥0</div>
      </div>
      <!-- /.content-block-title -->
      <div v-if="orderDetail.reduceAmount" class="content-block-title _border">
        <div class="title">立减</div>
        <div class="text text-primary">-￥{{ orderDetail.reduceAmount }}</div>
      </div>
      <!-- /.content-block-title -->
      <div v-if="orderDetail.couponAmount" class="content-block-title _border">
        <div class="title">优惠券</div>
        <div class="text text-primary">-￥{{ orderDetail.couponAmount }}</div>
      </div>
      <div v-if="orderDetail.original" class="content-block-title _border">
        <div class="title">
          初始会员优惠
        </div>
        <div class="text text-primary">
          -￥{{orderDetail.discountAmount || 0}}
        </div>
      </div>
      <!-- /.content-block-title -->
      <div class="content-block-title flex-end">
        <div class="text">
          {{orderDetail.orderStatus === 'PENDING_PAID' ? '待支付' : '实付'}}：
          <span v-if="orderDetail.orderType === 'CENT'" class="text-primary">{{ orderDetail.cent }}积分</span>
          <span v-else class="text-primary">￥{{ orderDetail.payAmount }}</span>
        </div>
      </div>
      <!-- /.content-block-title -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import moment from 'moment'
import { Toast, Modal } from 'rocoui'
import axios from '@/configs/axios'
import ORDER_STATUS from '@/constants/orderStatus' // 订单状态
import PAY_WAY from '@/constants/payWay' // 支付方式
import { AFTER_SALES_STATUS } from '@/constants/afterSaleStatus'
import store from '@/configs/store'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  data() {
    return {
      orderDetail: {},
      ORDER_STATUS,
      PAY_WAY,
      AFTER_SALES_STATUS,
      listOrder: null,
      endTime: '',
      fromOrder: false,
      timer: null
    }
  },
  computed: {
    hasNoTimer () {
      return moment(this.orderDetail.orderTime).add(30, 'minutes') - moment(this.orderDetail.serverTime) > 0
    }
  },
  created() {
    // 获取订单详情
    this.getOrderDetail()
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      if (from.name === 'MineOrder') {
        vm.fromOrder = true
      }
    })
  },
  methods: {
    // 获取订单详情
    getOrderDetail() {
      let promise = axios
        .get(`/api/wap/member/orders/findOrderDetails`, {
          orderId: this.$route.params.orderId
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.orderDetail = res.data.data
            // 待付款订单倒计时
            let leftTime = moment(this.orderDetail.orderTime).add(30, 'minutes') - moment(this.orderDetail.serverTime)
            if (this.orderDetail.orderStatus === 'PENDING_PAID' && this.hasNoTimer) {
              this.orderDetail.mm = moment(leftTime).minute()
              this.orderDetail.ss = moment(leftTime).second()
              this.timer = setInterval(() => {
                leftTime -= 1000
                this.orderDetail.mm = moment(leftTime).minute()
                this.orderDetail.ss = moment(leftTime).second()
                this.$forceUpdate()
                if (!this.orderDetail.mm && !this.orderDetail.ss) {
                  clearInterval(this.timer)
                  // 超时，交易关闭
                  this.orderDetail.timeout = true
                }
              }, 1000)
            }
          }
        })
        .finally(() => {
          // 如果从我的订单页面直接点击'去付款'，跳转到订单详情页加载完订单详情后直接弹出付款弹窗
          let sessionHasPaidId = sessionStorage.getItem('curHasPaiedId')
          if (this.$route.query.type === 'payment' && this.$route.params.orderId !== sessionHasPaidId && this.fromOrder) {
            // 去付款
            this.choosePayment()
          }
        })
      Toast.loading('加载中...', promise)
    },
    // 展开或收起商品列表
    open(item, index) {
      item['spreadFlag' + index] = true
      this.$forceUpdate()
      this.listOrder = document.getElementById('listOrder' + index)
      this.listOrder.style.maxHeight = item.orderItems.length * 2.55 + 'rem'
    },
    close(item, index) {
      item['spreadFlag' + index] = false
      this.$forceUpdate()
      this.listOrder = document.getElementById('listOrder' + index)
      this.listOrder.style.maxHeight = 3 * 2.55 + 'rem'
    },
    toTwo(t) {
      return t > 9 ? t : '0' + t
    },

    // 去付款
    choosePayment() {
      let promise = axios
        .post('/api/supay/order', {
          orderId: this.orderDetail.orderId,
          cash: this.orderDetail.payAmount
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            window.location = res.data.data.url
          }
        })
      Toast.loading('正在进入付款页面...', promise)
    },

    // 路由跳转
    goRouter(name, item, total, index) {
      this.$router.push({
        name: 'MineOrder' + name,
        params: { orderId: this.orderDetail.orderId },
        query: { total, index }
      })
      if (name === 'Logistics') {
        store.set('logisticsInfo', item)
      } else if (name === 'AfterSaleApply') {
        store.set('willAfterSaleInfo', item)
      }
    },
    // 查看售后进度
    goProgressRouter (item) {
      let type = item.afterStatus === 'REFUNDED' || item.afterStatus === 'REFUND_DISAGREE' ? 'REFUNDED' : null
      this.$router.push({
        name: 'MineOrderAfterSaleProgress',
        params: { orderId: item.afterSaleId },
        query: { type }
      })
    },
    // 取消订单
    cancelOrder() {
      let self = this
      Modal.confirm({
        body: '确定要取消订单？',
        okCb: function() {
          axios
            .get('/api/wap/member/orders/cancelOrder', {
              orderId: self.orderDetail.orderId
            })
            .then((res) => {
              if (res.data.code === CODE_SUCCESS) {
                self.getOrderDetail()
              }
            })
        }
      })
    },

    // 确认收货
    confirmReceivingGoods() {
      let self = this
      Modal.confirm({
        body: '确定所有包裹都已收到？',
        okCb: function() {
          axios
            .get('/api/wap/member/orders/confirmReceipt', {
              orderId: self.orderDetail.orderId
            })
            .then((res) => {
              if (res.data.code === CODE_SUCCESS) {
                self.getOrderDetail()
              }
            })
        }
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>
