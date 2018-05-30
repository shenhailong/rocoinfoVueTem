<template>
  <div v-show="loaded">
    <div class="tips-box" v-show="!couponList.length">
      <div class="tips-no-result">
        <div class="icon-area">
          <i class="icon icon-no-coupons">icon</i>
        </div>
        <p>没有您可领取的优惠券</p>
      </div>
      <!-- /.tips-no-result -->
    </div>
    <!-- /.tips-box -->
    <div class="coupons-viewbox" v-show="couponList.length">
      <!--
        注意:
        1.不可用状态请在list-coupons后追加class[coupons-disabled]
        2.已使用、已失效和已抢光状态请在list-coupons后追加class[coupons-expried]
        3.选中状态请在list-coupons后追加class[coupons-selected],
          选中标识默认是灰色状态，选中后请在select-tag后追加class[has-selected]
        -->
        <!-- 已领取,已抢光添加class coupons-expried -->
      <div class="list-coupons" :class="{'coupons-expried':item.isReceive||item.isUseUp}" v-for="(item,index) in couponList" :key="item.id">
        <svg class="svg-coupons">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-coupons"></use>
        </svg>
        <!-- 已使用/已失效状态标识-->
        <div class="disabled-img">
          <!-- 已抢光 -->
          <span class="text" v-show="item.isUseUp">已抢光</span>
          <!-- 已领取未抢光 -->
          <span class="text" v-show="item.isReceive&&!item.isUseUp">已领取</span>
        </div>
        <div class="coupons-body">
          <div class="coupons">
            <div class="item-price">
              <em>¥</em>{{item.subtraction}}</div>
            <div class="text">满{{item.threshold}}可用</div>
          </div>
          <!-- /.coupons-bg -->
          <div class="item-inner">
            <div class="item-title _ellipsis">{{item.name}}</div>
            <div class="item-subtitle">{{item.effectiveDate}}</div>
            <!--toggle优惠券详细结束-->
            <div class="details-info" @click="toggleTag(item,index)">
              <span class="text _ellipsis">{{item.note}}</span>
              <svg class="svg-arrow _up">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-arrow"></use>
              </svg>
            </div>
          </div>
          <!-- /.item-inner -->
          <!-- 非已领取非已抢光 -->
          <div class="item-align-center" v-show="!item.isReceive&&!item.isUseUp">
            <a href="javascript:;" class="btn-normal btn-primary btn-xs" @click="getCoupon(item,index)">立即领取</a>
          </div>
        </div>
        <!-- /.coupons-body -->
        <div class="coupons-footer" :class="{disB:!item.isCollapse}">{{item.note}}</div>
        <!-- /.coupons-footer -->
      </div>
    </div>
    <!-- .coupons-viewbox -->
  </div>
</template>
<script>
import axios from 'axios'
import { Toast } from 'rocoui'
export default {
  name: 'Coupon',
  data() {
    return {
      couponList: [],
      loaded: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取优惠券列表
    fetchData() {
      let promise = axios.get('/api/wap/coupon/center').then(res => {
        if (res.data.code === '1') {
          this.couponList = res.data.data
          // 默认优惠券详情都收起
          this.couponList.forEach(item => { item.isCollapse = true })
        }
      }).finally(() => {
        this.loaded = true
      })
      Toast.loading('正在加载...', promise)
    },
    // 领取优惠券
    getCoupon(item, index) {
      axios.get('/api/wap/coupon/toreceive?couponId=' + item.id).then(res => {
        if (res.data.code === '1') {
          // 领取成功
          let obj = res.data.data
          if (obj.isUseUp) {
            // 已抢光
            item.isUseUp = true
          } else if (obj.isReceive) {
            // 已领取
            item.isReceive = true
          }
          this.couponList.splice(index, 1, item)
          Toast.success('领取成功')
        } else if (res.data.code === '2') {
          // 已领取
          item.isReceive = true
          this.couponList.splice(index, 1, item)
          Toast.info(res.data.message, 2)
        } else if (res.data.code === '3') {
          // 已抢光
          item.isUseUp = true
          this.couponList.splice(index, 1, item)
          Toast.info(res.data.message, 2)
        }
      })
    },
    // toggle优惠券详情
    toggleTag(item, index) {
      item.isCollapse = !item.isCollapse
      this.couponList.splice(index, 1, item)
    }
  }
}
</script>

