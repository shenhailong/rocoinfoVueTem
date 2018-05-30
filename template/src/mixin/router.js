import share from '@/configs/share'


export var routerMixin = {
  methods: {
    routerBack() {
      this.$router && this.$router.back()
    }
  }
}


export var routerTransitionMixin = {
  data() {
    return {
      transitionName: 'slide-left',
      routers: [],
      status: []
    }
  },
  created() {
    share.share(share.defaultConfig())
  },
  watch: {
    '$route'(to, from) {
      try {
        share.share(share.defaultConfig())
      } catch (e) {

      }
      let toIndex = to.meta.index || 1
      let fromIndex = from.meta.index || 1
      if (toIndex > fromIndex) {
        this.transitionName = 'slide-in'
      } else if (toIndex < fromIndex) {
        this.transitionName = 'slide-out'
      } else {
        this.transitionName = ''
      }
    }
  }
}

export default routerMixin
