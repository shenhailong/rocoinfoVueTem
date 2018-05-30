<template>
  <!-- 限时购 -->
  <div class="group-show">
    <div v-if="isRunning">
      <div class="time-countdown">
        <span class="text">距离活动结束</span>
        <em class="num">{{runTime.d}}</em>
        <span class="text">天</span>
        <em class="num">{{runTime.h}}</em>
        <span class="text">时</span>
        <em class="num">{{runTime.m}}</em>
        <span class="text">分</span>
        <em class="num">{{runTime.s}}</em>
        <span class="text">秒</span>
      </div>
      <!-- /.time-cuontdown 倒计时 -->
      <div class="swiper-container swiper-container-sale swiper-container-horizontal">
        <div class="swiper-wrapper">
          <div v-for="item in privilegeInfo.actSkuDtoList" :key="item.productId" @click="goRouterSkuIdDetail(item)" class="swiper-slide">
            <div class="item-goods">
              <div class="item-media">
                <img v-lazy="{
                  src: item.imgPath ? item.imgPath : 'static/images/lazyload/348x348.jpg',
                  loading: 'static/images/lazyload/348x348.jpg',
                  error: 'static/images/lazyload/348x348.jpg'
                }" alt="限时购商品" class="lazy-img-fadein">
              </div>
              <div class="item-inner">
                <div class="item-title _ellipsis">{{ item.name }}</div>
                <div class="price-area">
                  <span class="item-price"><em>¥</em>{{ item.activityPrice }}</span>
                  <span class="item-price-original"><em>¥</em>{{ item.salePrice }}</span>
                </div>
              </div>
            </div>
            <!--/.item-goods 商品-->
          </div>
          <a :href="`/#/activity/TIME_LIMITED/${privilegeInfo.id}`" v-if="privilegeInfo.actSkuDtoList && privilegeInfo.actSkuDtoList.length > 4" class="swiper-slide slide-more">
            <div class="item-more">查看更多</div>
          </a>
        </div>
        <!--/.swiper-wrapper-->
      </div>
      <!--/.swiper-container-sale 限时优惠-->
    </div>
    <div v-else class="tips-box">
      <p>活动尚未开始...☕🎵</p>
    </div>
  </div>
  <!-- /.group-show -->
</template>

<script>
import moment from 'moment'
import runTime from '@/mixin/runTime'
import Swiper from 'Swiper'
export default {
  props: ['privilegeInfo'],
  mixins: [runTime],
  computed: {
    isRunning () {
      if (this.privilegeInfo.status === 'RUNNING') {
        return true
      } else {
        return false
      }
    },
    endTime () {
      // 限时购初始化swiper插件
      this.$nextTick(() => {
        this.swiper = new Swiper('.swiper-container-sale', {
          slidesPerView: 'auto',
          paginationClickable: true
        })
      })
      return moment(this.privilegeInfo.endTime)
    }
  },
  methods: {
    // 点击限时购商品跳到商品详情
    goRouterSkuIdDetail (item) {
      window.location.href = `index.html#/product/${item.productId}?skuId=${item.skuId}&placeOrderType=TIME_LIMITED`
    }
  }
}
</script>
