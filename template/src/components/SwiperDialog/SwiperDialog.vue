<template>
  <div>
    <transition name="fade">
      <div class="_in mask-layer mask-layer-swiper" @click="close">
      </div>
    </transition>
    <transition name="fade">
      <div class="_in swiper-img-box">
        <div ref="swiper" class="swiper-container swiper-container-evaluation">
          <div v-once class="swiper-wrapper">
            <div v-for="(img,$index) in imgs" :key="img.path" class="swiper-slide" :class="{'swiper-slide-active': $index === initialSlide}">
              <img :src="img.path" alt="详情图">
            </div>
          </div>
          <div class="pagination">{{swiperIndicatorWord}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import Swiper from 'Swiper'
export default {
  props: {
    imgs: {
      type: Array,
      required: true
    },
    initialSlide: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: false,
      maskDiv: null,
      swiper: null,
      swiperIndex: this.initialSlide,
      swiperCount: this.imgs.length
    }
  },
  created() {
    // this.visible = true
  },
  mounted() {
    this.$nextTick(() => {
      // setTimeout(() => {
      //   this.activeSwiper()
      // }, 500)
      this.activeSwiper()
    })
  },
  methods: {
    activeSwiper() {
      let _this = this
      this.swiper = new Swiper(this.$refs.swiper, {
        initialSlide: this.initialSlide,
        pagination: '.swiper-pagination',
        preventLinksPropagation: false,
        preventClicks: false,
        onSlideChangeEnd: function(swiper) {
          _this.swiperIndex = swiper.activeIndex
        },
        onClick: (swiper) => {
          this.close()
        }
      })
    },
    close() {
      // setTimeout(() => {
      this.$destroy()
      // }, 500)
    }
  },
  computed: {
    swiperIndicatorWord() {
      return `${this.swiperIndex + 1}/${this.swiperCount}`
    }
  },
  beforeDestroy() {
    this.swiper && this.swiper.destroy()
    document.body.removeChild(this.$el)
  }
}
</script>
