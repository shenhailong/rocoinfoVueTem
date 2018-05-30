<template>
  <div id="app" style="height:100%;position:relative;">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<script>
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
import { routerTransitionMixin } from '@/mixin/router'
import store from '@/configs/store'
export default {
  mixins: [routerTransitionMixin],
  mounted() {
    if (!this.$route.query.forward) {
      this.getPeople()
    }
  },
  methods: {
    // 判断是否关注过
    getPeople() {
      store.remove('communityPage')
      axios.get('/api/wap/forum/myFollows').then((res) => {
        if (res.data.code === CODE_SUCCESS) {
          if (res.data.data.page.total === 0) {
            this.$router.replace({ path: '/FocusAuthor' })
          } else {
            if (this.$route.query.forward) {
              // 直接要去别的页面
            } else {
              this.$router.replace({ path: '/Index' })
            }
          }
        } else {
          this.$router.replace({ path: '/Index' })
        }
      })
    }
  }
}
</script>

