<template>
  <!-- Swiper -->
  <div class="swiper-container swiper-container-banner">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item,index) in banners" :key="index" @click="link(item.linkUrl)">
        <img :data-src="item.imgUrl" class="swiper-lazy"/>
        <img :src="bannerSrc" class="swiper-lazy-preloader" />
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
  </div>
  <!-- Swiper -->
</template>
<script>
import Swiper from 'Swiper'
export default {
  props: ['banners'],
  data() {
    return {
      bannerSrc: 'static/images/lazyload/750x400.jpg'
    }
  },
  mounted() {
    this.$nextTick(() => {
      let self = this
      this.swiper = new Swiper('.swiper-container-banner', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 4000,
        loop: true,
        autoplayDisableOnInteraction: false,
        lazyLoading: true,
        onLazyImageLoad: function (swiper, slide, img) {
          img.onerror = function () {
            this.src = self.bannerSrc
          }
        }
      })
    })
  },
  beforeDestroy() {
    this.swiper && this.swiper.destroy()
  },
  methods: {
    // 点击Banner 跳转
    link(url) {
      window.location.href = url
    }
  }
}
</script>
