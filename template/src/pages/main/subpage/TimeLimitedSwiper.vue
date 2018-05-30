<template>
  <div class="swiper-container swiper-container-sale">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="item in dataList.list" :key="item.skuId">
        <div class="item-goods" @click="$_goDetail(item)">
          <div class="item-media">
            <img v-lazy="{
                  src: item.imgPath,
                  loading: 'static/images/lazyload/200x200.jpg',
                  error: 'static/images/lazyload/200x200.jpg'
                }" alt="商品图片" class="lazy-img-fadein">
          </div>
          <div class="item-inner">
            <div class="item-title _ellipsis">{{item.name}}</div>
            <div class="price-area">
              <span class="item-price">
                <em>¥</em>{{item.activityPrice}}</span>
              <span class="item-price-original">
                <em>¥</em>{{item.salePrice}}</span>
            </div>
          </div>
        </div>
        <!--/.item-goods 商品-->
      </div>
      <a href="javascript:;" class="swiper-slide slide-more" @click="goActivity" v-if="dataList.more">
        <div class="item-more ">
          查看更多
        </div>
      </a>
    </div>
    <!--/.swiper-wrapper-->
  </div>
  <!--/.swiper-container-sale 限时优惠-->
</template>
<script>
import Swiper from 'Swiper'
import productDetail from '@/mixin/productDetail'
import { TIME_LIMITED } from '@/constants/activityType'
export default {
  mixins: [productDetail],
  props: ['timeLimited'],
  computed: {
    dataList() {
      let data = this.timeLimited.actSkuDtoList
      data.forEach(item => { item.type = 'TIME_LIMITED' })
      return {
        // 大于4个显示更多
        more: data.length > 4,
        // 最多显示5个
        list: data.slice(0, 5)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.swiper = new Swiper('.swiper-container-sale', {
        slidesPerView: 'auto',
        freeMode: true
      })
    })
  },
  methods: {
    // 限时购列表
    goActivity() {
      this.$router.push({
        path: '/activity/' + TIME_LIMITED.value + '/' + this.timeLimited.id
      })
    }
  },
  beforeDestroy() {
    this.swiper && this.swiper.destroy()
  }
}
</script>
