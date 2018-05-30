<template>
  <div>

    <div class="float-window float-window-top">
      <transition name="fadeScale">
        <a v-show="visible" @click="scrollTopHandler" href="javascript:;" class="item return-top">
          <svg class="svg-icon svg-return-top">
            <use xlink:href="#svg-return-top" />
          </svg>
        </a>
      </transition>
    </div>
  </div>
</template>
<script>
import VueScrollTo from 'vue-scrollto'
export default {
  props: {
    container: {
      type: String,
      required: true
    },
    threshold: {
      type: Number,
      default: 300
    },
    timeout: {
      type: Number,
      default: 350
    },
    duration: {
      type: Number,
      default: 500
    },
    element: {
      type: String,
      default: 'body'
    },
    offset: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: false,
      timer: null,
      con: null,
      scrolling: false
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.con = document.querySelector(this.container)
      this.con.addEventListener('scroll', this.scrollHandler, false)
    })
  },
  methods: {
    scrollHandler() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.timerHandler()
      }, this.timeout)
    },
    timerHandler() {
      let scrollTop = this.con.scrollTop
      this.visible = scrollTop > this.threshold
      this.scrolling = false
    },
    scrollTopHandler() {
      if (this.scrolling) {
        return false
      }
      this.scrolling = true
      let options = {
        container: this.container,
        easing: 'ease-in',
        offset: this.offset,
        cancelable: false,
        x: false,
        y: true,
        onDone: () => {
          clearTimeout(this.timer)
          this.scrolling = false
          this.timerHandler()
        },
        onCancel: () => {
          clearTimeout(this.timer)
          this.scrolling = false
          this.timerHandler()
        }
      }

      VueScrollTo.scrollTo(this.element, this.duration, options)
    }
  },
  beforeDestroy() {
    this.con.removeEventListener('scroll', this.scrollHandler, false)
  },
  computed: {
    classObj() {
      return { disN: !this.visible }
    }
  }
}
</script>
