<template>
  <div class="wrap wrap-list-limit-trial">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">评价晒单</div>
    </div>
    <!--/.bar-nav-->
    <div class="content" id="scrollContent">
      <div class="list-evalute">
        <div v-for="(item, index) in orderInfo" :key="index" class="item-goods item-horizontal">
          <div class="item-media">
            <img v-lazy="{
              src: item.productImg ? item.productImg : 'static/images/lazyload/348x348.jpg',
              loading: 'static/images/lazyload/348x348.jpg',
              error: 'static/images/lazyload/348x348.jpg'
            }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis">{{ item.productName }}</div>
            <div class="item-subtitle-sku">
              <span class="name">规格：</span>{{ item.attribute }}
            </div>
            <!-- /.title -->
            <div class="item-flex-end item-align-center  item-bottom">
              <a href="javascript:;" @click="goRouter(item)" class="btn-normal btn-primary _solid btn-sm">评价晒单</a>
            </div>
          </div>
          <!-- /.item-inner -->
        </div>
        <!--/.item-goods 水平摆放商品-->
      </div>
      <!-- /.list-sale -->
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
import ScrollTop from '@/components/ScrollTop'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  name: 'MineOrderEvaluate',
  data () {
    return {
      orderInfo: []
    }
  },
  components: {
    ScrollTop
  },
  created () {
    this.getUnevaluateList()
  },
  methods: {
    // 活动待评价订单的商品列表
    getUnevaluateList () {
      let promise = axios.get(`/api/wap/orders/${this.$route.params.orderId}/unevaluate`)
      .then(res => {
        if (res.data.code === CODE_SUCCESS) {
          this.orderInfo = res.data.data
          sessionStorage.setItem('unevaluateOrderNum', this.orderInfo.length)
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 路由跳转
    goRouter (item) {
      this.$router.push({
        name: 'MineOrderEvaluateEdit',
        params: { id: item.orderItemId },
        query: {
          skuId: item.skuId,
          name: item.productName,
          subtitle: item.subtitle,
          img: item.productImg,
          attr: item.attribute
        }
      })
    }
  }
}
</script>

